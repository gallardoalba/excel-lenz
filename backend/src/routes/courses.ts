import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';
import { authMiddleware, optionalAuth, AuthPayload } from '../middleware/auth';

const router = Router();

// List all courses (with user progress if authenticated)
router.get('/', optionalAuth, (req: Request, res: Response) => {
  const db = getDb();
  const userId = (req.user as AuthPayload)?.userId;
  const courses = db.prepare(
    `SELECT c.*, COUNT(e.id) as exercise_count
     FROM courses c LEFT JOIN exercises e ON e.course_id = c.id
     GROUP BY c.id
     ORDER BY CASE c.difficulty
       WHEN 'beginner' THEN 1
       WHEN 'intermediate' THEN 2
       WHEN 'advanced' THEN 3
       WHEN 'expert' THEN 4
       ELSE 5
     END, c.created_at ASC`
  ).all() as any[];

  // Compute modules_count from exercises
  for (const course of courses) {
    const modCount = db.prepare(
      'SELECT COUNT(DISTINCT json_extract(template_data, ?)) as cnt FROM exercises WHERE course_id = ?'
    ).get('$._moduleId', course.id) as any;
    course.modules_count = modCount?.cnt || 0;
  }

  // If user is logged in, add progress with a single query
  if (userId) {
    const progressStats = db.prepare(`
      SELECT e.course_id,
             COUNT(DISTINCT p.exercise_id) as completed,
             COUNT(DISTINCT e.id) as total
      FROM exercises e
      LEFT JOIN progress p ON p.exercise_id = e.id AND p.user_id = ? AND p.completed = 1
      GROUP BY e.course_id
    `).all(userId) as any[];

    const statsMap = new Map(progressStats.map((s: any) => [s.course_id, s]));
    for (const course of courses) {
      course.user_progress = statsMap.get(course.id) || { completed: 0, total: course.exercise_count };
    }
  }

  res.json(courses);
});

// Get single course with exercises (grouped by module) and user progress
router.get('/:id', optionalAuth, (req: Request, res: Response) => {
  const db = getDb();
  const userId = (req.user as AuthPayload)?.userId;
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id) as any;
  if (!course) {
    res.status(404).json({ error: 'Kurs nicht gefunden' });
    return;
  }

  const exercises = db.prepare(
    'SELECT id, title, description, order_index, template_data FROM exercises WHERE course_id = ? ORDER BY order_index'
  ).all(req.params.id) as any[];

  // Parse template_data to extract metadata and module info
  for (const ex of exercises) {
    try {
      const tmpl = JSON.parse(ex.template_data || '{}');
      ex.estimated_minutes = tmpl.estimated_minutes || null;
      ex.prerequisites = tmpl.prerequisites || [];
      ex.learningObjectives = tmpl.learningObjectives || [];
      ex.theoryTitle = tmpl.theoryTitle || null;
      ex.theory = tmpl.theory || null;
      ex.moduleId = tmpl._moduleId || tmpl.moduleId || null;
      ex.moduleSection = tmpl._moduleSection || tmpl.moduleSection || null;
      ex.moduleTitle = tmpl._moduleTitle || tmpl.moduleTitle || null;
      ex.sectionTitle = tmpl._sectionTitle || tmpl.sectionTitle || null;
    } catch { ex.estimated_minutes = null; ex.prerequisites = []; ex.learningObjectives = []; }
    delete ex.template_data;
  }

  // Add user progress for each exercise
  if (userId) {
    for (const ex of exercises) {
      const prog = db.prepare(
        'SELECT score, completed FROM progress WHERE user_id = ? AND exercise_id = ?'
      ).get(userId, ex.id) as any;
      ex.user_score = prog?.score ?? null;
      ex.completed = prog?.completed ?? 0;
    }
  }

  // Build module structure for grouping
  let modules: any[] = [];
  try {
    modules = course.modules_meta ? JSON.parse(course.modules_meta) : [];
  } catch { modules = []; }

  // If no module metadata in DB, group by module info from exercises
  const moduleMap: Record<string, { id: string; title: string; sections: Record<string, { id: string; title: string; exercises: any[] }> }> = {};

  for (const ex of exercises) {
    const modId = ex.moduleId || 'default';
    const modTitle = ex.moduleTitle || 'Übungen';
    const secId = ex.moduleSection || '';
    const secTitle = ex.sectionTitle || '';

    if (!moduleMap[modId]) {
      const modMeta = modules.find((m: any) => m.id === modId);
      moduleMap[modId] = {
        id: modId,
        title: modMeta?.title || modTitle,
        sections: {},
      };
    }
    const secKey = secId || '__no_section__';
    if (!moduleMap[modId].sections[secKey]) {
      const modMeta = modules.find((m: any) => m.id === modId);
      const secMeta = modMeta?.sections?.find((s: any) => s.id === secId);
      moduleMap[modId].sections[secKey] = {
        id: secId,
        title: secMeta?.title || secTitle,
        exercises: [],
      };
    }
    moduleMap[modId].sections[secKey].exercises.push(ex);
  }

  // Convert map to ordered arrays
  const groupedModules = Object.values(moduleMap).map(mod => ({
    ...mod,
    sections: Object.values(mod.sections),
  }));

  res.json({
    ...course as object,
    modules_meta: undefined, // don't send raw JSON
    exercises,
    modules: groupedModules,
  });
});

export default router;
