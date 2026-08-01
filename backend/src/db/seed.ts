import { initDb, getDb } from './database';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

// ── Exercise data (edit the JSON files, not this file!) ──
import course1Data from './exercises/course1_grundlage.json';
import course2Data from './exercises/course2_datenanalyse.json';
import course3Data from './exercises/course3_fortgeschrittene.json';
import course4Data from './exercises/course4_datenbank.json';

type ExerciseJson = {
  title: string;
  description: string;
  template: Record<string, unknown>;
  solution: Record<string, unknown>;
  instructions: string;
  order: number;
  formulaHint?: string | null;
  hint1?: string;
  hint2?: string;
  hint3?: string;
  learningObjectives?: string[];
  estimated_minutes?: number;
  prerequisites?: string[];
  theoryTitle?: string;
  theory?: string;
};

type CourseJson = {
  title: string;
  description: string;
  difficulty: string;
  exercises: ExerciseJson[];
};

const ALL_COURSES: CourseJson[] = [course1Data, course2Data, course3Data, course4Data];

export function seed(): void {
  initDb();
  const db = getDb();

  // Only seed users if table is empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const hash = bcrypt.hashSync(process.env.SEED_PASSWORD || 'devpassword', 10);
    const seedPwd = process.env.SEED_PASSWORD || 'devpassword';
    const insertUser = db.prepare(
      'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)'
    );
    insertUser.run(crypto.randomUUID(), 'dozent@excel-lenz.edu', hash, 'Lehrer Müller', 'teacher');
    insertUser.run(crypto.randomUUID(), 'student@excel-lenz.edu', hash, 'Anna Schmidt', 'student');
  }

  // Only seed exercises if table is empty (allows updating exercises on restart)
  const exCount = db.prepare('SELECT COUNT(*) as count FROM exercises').get() as { count: number };
  if (exCount.count > 0) return;

  const insertEx = db.prepare(
    'INSERT INTO exercises (id, course_id, title, description, template_data, solution_data, instructions, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const insertCourse = db.prepare(
    'INSERT INTO courses (id, title, description, difficulty, modules_meta) VALUES (?, ?, ?, ?, ?)'
  );

  const addExercise = (courseId: string, ex: ExerciseJson) => {
    // Validate required fields
    if (!ex.title || !ex.description || !ex.instructions) {
      console.error(`❌ Seed: Übung übersprungen — fehlende Pflichtfelder (title, description, instructions)`);
      return;
    }
    if (!ex.template || typeof ex.template !== 'object') {
      console.error(`❌ Seed: Übung "${ex.title}" übersprungen — template fehlt oder ungültig`);
      return;
    }
    if (!ex.solution || typeof ex.solution !== 'object') {
      console.error(`❌ Seed: Übung "${ex.title}" übersprungen — solution fehlt oder ungültig`);
      return;
    }

    const template: Record<string, unknown> = { ...ex.template };
    if (ex.formulaHint) template.formulaHint = ex.formulaHint;
    if (ex.hint1) template.hint1 = ex.hint1;
    if (ex.hint2) template.hint2 = ex.hint2;
    if (ex.hint3) template.hint3 = ex.hint3;
    if (ex.learningObjectives) template.learningObjectives = ex.learningObjectives;
    if (ex.estimated_minutes) template.estimated_minutes = ex.estimated_minutes;
    if (ex.prerequisites) template.prerequisites = ex.prerequisites;
    if (ex.theoryTitle) template.theoryTitle = ex.theoryTitle;
    if (ex.theory) template.theory = ex.theory;
    // Module metadata for grouping
    if ((ex as any).moduleId) template._moduleId = (ex as any).moduleId;
    if ((ex as any).moduleSection) template._moduleSection = (ex as any).moduleSection;
    if ((ex as any).moduleTitle) template._moduleTitle = (ex as any).moduleTitle;
    if ((ex as any).sectionTitle) template._sectionTitle = (ex as any).sectionTitle;

    insertEx.run(
      crypto.randomUUID(), courseId, ex.title, ex.description,
      JSON.stringify(template), JSON.stringify(ex.solution),
      ex.instructions, ex.order
    );
  };

  let total = 0;
  for (const data of ALL_COURSES) {
    const courseId = crypto.randomUUID();
    const modulesMeta = (data as any).modules ? JSON.stringify((data as any).modules) : null;
    insertCourse.run(courseId, data.title, data.description, data.difficulty, modulesMeta);
    for (const ex of data.exercises) {
      addExercise(courseId, ex);
    }
    total += data.exercises.length;
  }

  console.log(`✅ Database seeded (${ALL_COURSES.length} Kurse, ${total} Übungen)`);
  console.log(`   Teacher: dozent@excel-lenz.edu / ${process.env.SEED_PASSWORD || 'devpassword'}`);
  console.log(`   Student: student@excel-lenz.edu / ${process.env.SEED_PASSWORD || 'devpassword'}`);

  const badges = [
    ['ersteschritte', 'Fundament', 'Erste Übung gemeistert', 'Award', 'exercises', 1],
    ['fleissig', 'Praxis', '10 Übungen abgeschlossen', 'FileText', 'exercises', 10],
    ['profi', 'Spezialist', '25 Übungen abgeschlossen', 'Trophy', 'exercises', 25],
    ['streak3', 'Kontinuität', '3 Tage in Folge aktiv', 'Calendar', 'streak', 3],
    ['streak7', 'Disziplin', '7 Tage in Folge aktiv', 'CalendarCheck', 'streak', 7],
    ['streak30', 'Engagement', '30 Tage in Folge aktiv', 'CalendarDays', 'streak', 30],
    ['level5', 'Fortgeschritten', 'Niveau 5 erreicht', 'Star', 'level', 5],
    ['level10', 'Experte', 'Niveau 10 erreicht', 'Award', 'level', 10],
    ['perfekt', 'Präzision', '5 Übungen mit 100%', 'CheckCircle', 'perfect', 5],
  ];
  const insertBadge = db.prepare(
    'INSERT OR IGNORE INTO badges (id, name, description, icon, criteria_type, criteria_value) VALUES (?, ?, ?, ?, ?, ?)'
  );
  for (const b of badges) {
    insertBadge.run(b[0], b[1], b[2], b[3], b[4], b[5]);
  }
  console.log('   Badges: 9 Abzeichen erstellt');
}

seed();
