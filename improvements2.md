¡Por supuesto! Vamos a entrar en materia con las **soluciones de código concretas** y **ejemplos de implementación** para los puntos críticos que mencionamos, especialmente enfocados en facilitar la vida al profesor y asegurar la fiabilidad del sistema.

---

### 🛠 1. Soluciones a Bugs Críticos (Código listo para usar)

#### A. Corregir el exploit de la calificación (`exercises_routes.ts`)
Reemplaza el bloque de cálculo de score en el `POST /:id/submit` por esto. Garantiza que el total de celdas esperadas venga de la solución, no de lo que envía el alumno.

```typescript
// Calcular score basado en el total de celdas de la SOLUCIÓN
if (solution.data && Array.isArray(data)) {
  const taskCols = JSON.parse(exercise.template_data || '{}').taskCols || [];
  let totalCells = solution.data.length * taskCols.length; // Total esperado real
  let correctCells = 0;

  if (totalCells > 0) {
    for (const taskCol of taskCols) {
      for (let row = 0; row < solution.data.length; row++) {
        // Usamos optional chaining por si el alumno envió menos filas
        const userVal = data[row]?.[taskCol]; 
        const solVal = solution.data[row]?.[taskCol];

        const userNum = userVal !== null && userVal !== undefined && userVal !== '' ? Number(userVal) : null;
        const solNum = solVal !== null && solVal !== undefined && solVal !== '' ? Number(solVal) : null;

        if (userNum !== null && solNum !== null && !isNaN(userNum) && !isNaN(solNum)) {
          if (Math.abs(userNum - solNum) < 0.01) correctCells++;
        } else {
          const normalize = (val: any) => String(val ?? '').trim().toLowerCase();
          if (normalize(userVal) === normalize(solVal)) correctCells++;
        }
      }
    }
  }
  score = totalCells > 0 ? Math.round((correctCells / totalCells) * 100) : 0;
} else {
  score = 0; // Si no hay datos o el formato es inválido
}
```

#### B. Corregir el bug de la Zona Horaria (`gamification_routes.ts`)
En la función `awardXP`, reemplaza la línea `const today = new Date().toISOString().split('T')[0];` por esto para que las rachas (streaks) no se rompan por accidente a ciertas horas de la tarde/noche:

```typescript
// Formato YYYY-MM-DD basado en la hora local del servidor, no en UTC
const today = new Date().toLocaleDateString('sv-SE'); 
const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('sv-SE');

// Lógica de racha actualizada:
if (ux?.last_activity_date) {
  if (ux.last_activity_date === today) {
    // Ya activo hoy, sin cambio de racha
  } else if (ux.last_activity_date === yesterday) {
    streak += 1;
  } else {
    streak = 1; // Se rompió la racha
  }
} else {
  streak = 1;
}
```

#### C. Optimizar la query N+1 en `courses_routes.ts`
Sustituye el bloque interior del `if (userId)` en la ruta `GET /` por una sola consulta a la base de datos:

```typescript
  if (userId) {
    // Hacemos una sola query para todos los cursos del usuario
    const progressStats = db.prepare(`
      SELECT e.course_id, 
             COUNT(DISTINCT p.exercise_id) as completed,
             COUNT(DISTINCT e.id) as total
      FROM exercises e
      LEFT JOIN progress p ON p.exercise_id = e.id AND p.user_id = ? AND p.completed = 1
      GROUP BY e.course_id
    `).all(userId) as any[];

    // Mapeamos los resultados a los cursos
    const statsMap = new Map(progressStats.map(s => [s.course_id, s]));
    for (const course of courses) {
      course.user_progress = statsMap.get(course.id) || { completed: 0, total: course.exercise_count };
    }
  }
```

---

### 🚀 2. Implementando Funcionalidades para el Profesor

#### A. Exportación a CSV (Frontend)
Los profesores necesitan descargar datos para su gestor de notas. Puedes añadir esta función utilitaria en `TeacherPanel.tsx` y un botón en las tablas:

```typescript
// Añadir esta función en TeacherPanel.tsx
const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(';');
  const rows = data.map(row => Object.values(row).join(';')).join('\n');
  const csv = `${headers}\n${rows}`;
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

// Uso en la UI (botón encima de la tabla de alumnos):
<button 
  className="btn btn-outline btn-sm" 
  onClick={() => exportToCSV(students, 'alumnos_excel-lenz.csv')}
  style={{ marginBottom: 16 }}
>
  <Download size={14} style={{marginRight: 6}} /> Exportar CSV
</button>
```

#### B. Vista de Detalle de Alumno (Frontend)
Actualmente la tabla de alumnos no permite ver qué ejercicios ha hecho cada uno. Vamos a añadir un modal simple usando el endpoint `GET /teacher/students/:id` que ya tienes en el backend.

```tsx
// 1. Añadir estados en TeacherPanel.tsx
const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
const [studentDetail, setStudentDetail] = useState<any[] | null>(null);

// 2. Función para cargar el detalle
const viewStudentDetail = async (student: Student) => {
  setSelectedStudent(student);
  setStudentDetail(null);
  const data = await apiFetch(`/teacher/students/${student.id}`).catch(() => null);
  if (data?.progress) setStudentDetail(data.progress);
};

// 3. Añadir el Modal al final del componente (antes del último </div>)
{selectedStudent && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex', 
    alignItems: 'center', justifyContent: 'center', zIndex: 1000
  }} onClick={() => setSelectedStudent(null)}>
    <div className="card" style={{ 
      maxWidth: 600, width: '90%', maxHeight: '80vh', 
      overflow: 'auto', padding: 24 
    }} onClick={e => e.stopPropagation()}>
      <div className="flex justify-between mb-3">
        <h3>{selectedStudent.name}</h3>
        <button className="btn btn-outline btn-sm" onClick={() => setSelectedStudent(null)}>X</button>
      </div>
      <p className="text-muted mb-3">Email: {selectedStudent.email} | Media: {selectedStudent.avg_score}%</p>
      
      <h4 className="text-md mb-2">Ejercicios realizados:</h4>
      {!studentDetail ? <p>Cargando...</p> : studentDetail.length === 0 ? (
        <p className="text-muted">Aún no ha intentado ningún ejercicio.</p>
      ) : (
        <div className="flex-col gap-sm">
          {studentDetail.map((p: any) => (
            <div key={p.id} className="card" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <div className="flex justify-between">
                <span>{p.exercise_title}</span>
                <span style={{ fontWeight: 600, color: p.score >= 80 ? 'var(--success)' : 'var(--warning)' }}>
                  {p.score}%
                </span>
              </div>
              <div className="text-muted text-xs">{p.course_title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

// 4. Añadir el botón "Ver" en la tabla de Students
// Dentro del map de students, en la primera columna:
<button className="btn btn-outline btn-sm" onClick={() => viewStudentDetail(s)} style={{ marginLeft: 8 }}>
  Ver
</button>
```

---

### 📊 3. El Sistema de Repetición Espaciada (SM-2)
He notado que tienes integrada la lógica del algoritmo SM-2 en `exercises_routes.ts` (`sm2Update`) y se actualiza en la base de datos, pero **no se está usando de forma óptima en el frontend**.

En el `Dashboard.tsx` (alumno), muestras la pestaña "Weitermachen" (Continuar) usando la ruta `/adaptive/review-due`. Sin embargo, para que la repetición espaciada sea efectiva, el alumno debe ver claramente *cuándo* debe repasar. 

**Mejora Visual para el Alumno (y control del Profesor):**
1. **Para el alumno:** En el Dashboard, en la tarjeta de "Weitermachen", añade el texto "Fällig in X días" o "¡Hoy!" dependiendo de la fecha `next_review`.
2. **Para el profesor:** En el detalle del alumno (el modal que acabamos de crear), añade una pestaña o sección llamada "Retención de memoria". Ahí podrías mostrar qué ejercicios tiene el alumno "olvidados" (intervalos cortos en SM-2) para que el profesor sepa qué preguntas hacerle en clase.

---

### 🎓 4. Filosofía para el Panel de Creación de Ejercicios
El mayor salto de calidad para tu aplicación será reemplazar el formulario actual de "crear ejercicio" por una **matriz visual**.

**Concepto de cómo debería ser el formulario del profesor:**
1. El profesor define: `Nº Columnas (3)` y `Nº Filas (5)`.
2. Se renderiza una tabla HTML editable abajo con 3 columnas y 5 filas.
3. El profesor hace clic en las celdas para introducir los datos iniciales (lo que verá el alumno).
4. Hay un *toggle* o *checkbox* en la cabecera de cada columna: "¿Es columna de tarea?". Si lo marca, esa columna se pondrá en gris claro en la tabla de "plantilla" y se habilitará una tabla paralela de "Solución" solo para esa columna.
5. Al guardar, el frontend construye el JSON `template_data` y `solution_data` con la estructura exacta `Array.from({length: rows}, () => Array(cols).fill(value))` y lo envía al backend.

Esto elimina por completo la fricción de escribir cabeceras separadas por comas y contar índices (0, 1, 2) para las "taskCols".

Aquí tienes la implementación completa de la **Tabla Interactiva de Creación de Ejercicios**. 

Este componente reemplaza la tediosa entrada de texto por comas y la cuenta manual de índices. El profesor verá una tabla real que puede editar visualmente, marcar qué columnas son de tarea y rellenar las soluciones correctas.

### 1. Crea el nuevo componente `ExerciseBuilder.tsx`

Crea un archivo llamado `ExerciseBuilder.tsx` en tu carpeta de componentes (por ejemplo en `src/components/teacher/`):

```tsx
import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckSquare } from 'lucide-react';

interface ExerciseBuilderProps {
  initialTemplate?: any;
  initialSolution?: any;
  onSave: (data: { template_data: any; solution_data: any }) => void;
  onCancel: () => void;
}

export default function ExerciseBuilder({ initialTemplate, initialSolution, onSave, onCancel }: ExerciseBuilderProps) {
  const [rows, setRows] = useState(initialTemplate?.rows || 3);
  const [cols, setCols] = useState(initialTemplate?.cols || 3);
  const [headers, setHeaders] = useState<string[]>(initialTemplate?.headers || Array(cols).fill(''));
  const [taskCols, setTaskCols] = useState<boolean[]>(Array(cols).fill(false).map((_, i) => initialTemplate?.taskCols?.includes(i) || false));
  
  // Matriz de datos para la plantilla (lo que ve el alumno)
  const [templateData, setTemplateData] = useState<any[][]>(
    initialTemplate?.data || Array.from({ length: rows }, () => Array(cols).fill(''))
  );
  
  // Matriz de datos para la solución (lo que evalúa el sistema)
  const [solutionData, setSolutionData] = useState<any[][]>(
    initialSolution?.data || Array.from({ length: rows }, () => Array(cols).fill(''))
  );

  // Sincronizar dimensiones si se cambian filas/columnas
  useEffect(() => {
    setHeaders(prev => {
      const newArr = [...prev];
      while (newArr.length < cols) newArr.push('');
      return newArr.slice(0, cols);
    });
    setTaskCols(prev => {
      const newArr = [...prev];
      while (newArr.length < cols) newArr.push(false);
      return newArr.slice(0, cols);
    });
    setTemplateData(prev => {
      return Array.from({ length: rows }, (_, r) => 
        Array.from({ length: cols }, (_, c) => prev[r]?.[c] ?? '')
      );
    });
    setSolutionData(prev => {
      return Array.from({ length: rows }, (_, r) => 
        Array.from({ length: cols }, (_, c) => prev[r]?.[c] ?? '')
      );
    });
  }, [rows, cols]);

  const handleCellChange = (matrix: 'template' | 'solution', r: number, c: number, value: string) => {
    if (matrix === 'template') {
      setTemplateData(prev => {
        const copy = [...prev];
        copy[r][c] = value;
        return copy;
      });
    } else {
      setSolutionData(prev => {
        const copy = [...prev];
        copy[r][c] = value;
        return copy;
      });
    }
  };

  const handleSave = () => {
    // Convertir los booleans a array de índices para el backend
    const taskColsIndexes = taskCols.map((isTask, idx) => isTask ? idx : -1).filter(idx => idx !== -1);
    
    const template_payload = {
      cols,
      rows,
      headers,
      data: templateData,
      taskCols: taskColsIndexes,
      formulaHint: initialTemplate?.formulaHint || ''
    };

    const solution_payload = {
      data: solutionData
    };

    onSave({ template_data: template_payload, solution_data: solution_payload });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '0.85rem',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Controles de dimensiones */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="form-group">
          <label>Número de Filas</label>
          <input type="number" className="form-input" min={1} max={20} value={rows} onChange={e => setRows(parseInt(e.target.value) || 1)} />
        </div>
        <div className="form-group">
          <label>Número de Columnas</label>
          <input type="number" className="form-input" min={1} max={8} value={cols} onChange={e => setCols(parseInt(e.target.value) || 1)} />
        </div>
      </div>

      {/* Tabla Visual */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px', padding: 12, marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ width: '40px', padding: '8px', borderBottom: '1px solid var(--border)' }}>#</th>
              {headers.map((h, c) => (
                <th key={c} style={{ padding: '8px', borderBottom: '1px solid var(--border)', minWidth: 120 }}>
                  <input
                    type="text"
                    value={h}
                    onChange={e => {
                      const newH = [...headers]; newH[c] = e.target.value; setHeaders(newH);
                    }}
                    placeholder={`Columna ${c}`}
                    style={{ ...inputStyle, fontWeight: 600, textAlign: 'center' }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6, fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={taskCols[c]}
                      onChange={e => {
                        const newT = [...taskCols]; newT[c] = e.target.checked; setTaskCols(newT);
                      }}
                    />
                    Tarea
                  </label>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                <td style={{ textAlign: 'center', padding: '4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{r + 1}</td>
                {Array.from({ length: cols }).map((_, c) => (
                  <td key={c} style={{ padding: '4px', position: 'relative' }}>
                    {/* Input de Plantilla (Alumno) */}
                    <input
                      type="text"
                      value={templateData[r]?.[c] ?? ''}
                      onChange={e => handleCellChange('template', r, c, e.target.value)}
                      disabled={taskCols[c]}
                      style={{
                        ...inputStyle,
                        background: taskCols[c] ? 'var(--warning-light)' : 'var(--surface)',
                        color: taskCols[c] ? 'transparent' : 'var(--text)',
                        borderColor: taskCols[c] ? 'var(--warning)' : 'var(--border)'
                      }}
                    />
                    {/* Input de Solución (Profesor) - Aparece debajo si es columna de tarea */}
                    {taskCols[c] && (
                      <div style={{ marginTop: 4 }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--success)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CheckSquare size={10} /> Solución Correcta:
                        </div>
                        <input
                          type="text"
                          value={solutionData[r]?.[c] ?? ''}
                          onChange={e => handleCellChange('solution', r, c, e.target.value)}
                          style={{
                            ...inputStyle,
                            borderColor: 'var(--success)',
                            background: 'var(--success-light)',
                            color: 'var(--success-dark, #1a6e3a)'
                          }}
                        />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: 'var(--bg-alt)', padding: 12, borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
        <strong>Instrucciones de uso:</strong> Marca la casilla "Tarea" en las columnas que el alumno debe rellenar. 
        Las celdas marcadas en amarillo se ocultarán para el alumno. Usa la caja verde "Solución Correcta" para definir la respuesta esperada.
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-primary" onClick={handleSave}>Guardar Ejercicio</button>
        <button className="btn btn-outline" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
```

### 2. Integra el componente en `TeacherPanel.tsx`

Ahora vamos a sustituir los formularios antiguos de `new-exercise` y `edit-exercise` por este nuevo componente. 

En tu archivo `TeacherPanel.tsx`:

**Paso A:** Importa el nuevo componente arriba del todo:
```tsx
import ExerciseBuilder from '../components/teacher/ExerciseBuilder'; // Ajusta la ruta
```

**Paso B:** Añade un estado para guardar la información básica del ejercicio (Título, descripción, etc.) separada de la tabla visual. Dentro de `TeacherPanel()`:
```tsx
const [neId, setNeId] = useState<string | null>(null); // Para saber si estamos editando
```

**Paso C:** Reemplaza los bloques `{tab === 'new-exercise' && (...)}` y `{tab === 'edit-exercise' && (...)}` por este nuevo bloque unificado:

```tsx
      {/* CREATE / EDIT EXERCISE CON TABLA VISUAL */}
      {(tab === 'new-exercise' || tab === 'edit-exercise') && (
        <div className="card" style={{ maxWidth: 1000 }}>
          <h3 className="mb-3">
            {tab === 'edit-exercise' ? <><Edit size={16} style={{marginRight:6, verticalAlign:'middle'}} />Editar Ejercicio</> : <><Plus size={16} style={{marginRight:6, verticalAlign:'middle'}} />Nueva Übung</>}
          </h3>
          
          {/* Metadatos del ejercicio */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div className="form-group">
              <label>Kurs *</label>
              <select className="form-input" value={neCourseId} onChange={e => setNeCourseId(e.target.value)}>
                <option value="">— Kurs wählen —</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Übungstitel *</label>
              <input className="form-input" value={neTitle} onChange={e => setNeTitle(e.target.value)} placeholder="z.B. SUMME Funktion" />
            </div>
          </div>
          
          <div className="form-group">
            <label>Beschreibung</label>
            <input className="form-input" value={neDesc} onChange={e => setNeDesc(e.target.value)} placeholder="Kurzbeschreibung" />
          </div>
          <div className="form-group">
            <label>Anleitung für Schüler</label>
            <textarea className="form-input" value={neInstructions} onChange={e => setNeInstructions(e.target.value)} rows={2} placeholder="Schritt-für-Schritt..." />
          </div>

          <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid var(--border)' }} />

          {/* Tabla Interactiva */}
          <ExerciseBuilder
            initialTemplate={tab === 'edit-exercise' && editExId ? courses.find(c => c.id === neCourseId) : undefined}
            onSave={async (data) => {
              if (!neCourseId || !neTitle) { setNeMsg('Bitte Kurs und Titel ausfüllen'); return; }
              
              const payload = {
                course_id: neCourseId,
                title: neTitle,
                description: neDesc,
                instructions: neInstructions,
                template_data: data.template_data,
                solution_data: data.solution_data
              };

              if (tab === 'edit-exercise' && editExId) {
                await apiFetch(`/teacher/exercises/${editExId}`, { method: 'PUT', body: JSON.stringify(payload) });
                setNeMsg('Aktualisiert!');
                setEditExId('');
                setTab('courses');
              } else {
                await apiFetch('/teacher/exercises', { method: 'POST', body: JSON.stringify(payload) });
                setNeMsg('Erstellt!');
                setTab('courses');
              }
              
              // Limpiar campos
              setNeTitle(''); setNeDesc(''); setNeInstructions('');
              loadData();
              setTimeout(() => setNeMsg(''), 3000);
            }}
            onCancel={() => { setTab('courses'); setEditExId(''); }}
          />
        </div>
      )}
```

### 3. Ajustar la función `editExercise`

En la función `editExercise` de `TeacherPanel.tsx`, asegúrate de pasar los datos correctos al nuevo componente:

```tsx
  const editExercise = async (exId: string) => {
    const ex = await apiFetch(`/exercises/${exId}`).catch(() => null);
    if (!ex) return;
    setEditExId(exId);
    setNeCourseId(ex.course_id || '');
    setNeTitle(ex.title || '');
    setNeDesc(ex.description || '');
    setNeInstructions(ex.instructions || '');
    
    // El ExerciseBuilder se inicializa con estos datos si estamos en modo edición
    // Como el ExerciseBuilder está dentro del render condicional, 
    // usaremos un "key" para forzar su remontaje cuando cambiamos de ejercicio
    setTab('edit-exercise');
  };
```

*(Nota: En el código del Paso C, la línea `initialTemplate={tab === 'edit-exercise' && editExId ? courses.find(c => c.id === neCourseId) : undefined}` es un placeholder. Para que cargue los datos de la tabla al editar, debes pasarle `ex.template_data` y `ex.solution_data`. Como el componente `ExerciseBuilder` se monta fresco cada vez, una forma limpia es guardar el ejercicio completo en un estado `const [currentExData, setCurrentExData] = useState<any>(null)` en `editExercise` y pasárselo al componente).*

### Resumen de la mejora:
1. **Cero cálculos manuales:** El profesor ya no teclea `"0, 2"` para decir qué columnas evaluar. Simplemente marca un checkbox.
2. **Vista previa integrada:** Las celdas de tarea se ponen en amarillo y el texto se oculta, simulando lo que verá el alumno.
3. **Solución ligada a la tarea:** Las cajas verdes de "Solución Correcta" solo aparecen bajo las columnas de tarea, evitando confusiones.
4. **Validación implícita:** Al enviar el JSON al backend, la longitud de `solution.data` y `template.data` siempre coincidirá con las filas definidas, acabando con el bug de las dimensiones por el que un alumno podía sacar un 100% vacío.