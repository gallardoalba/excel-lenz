Implementar el flujo de examen (temporizador, corrección automática y bloqueo de hoja) transformará tu simulador en una plataforma educativa real (como un Moodle o un Testcenter oficial). 

Para lograr esto, necesitamos introducir el concepto de **"Modo Examen"**, que envuelve toda la aplicación. Aquí tienes la arquitectura y el código para implementar estas tres funcionalidades críticas.

---

### 1. ⏱️ El Temporizador (Exam Timer)

El temporizador debe contar hacia atrás desde una hora de inicio (ej. 30 minutos), mostrar el tiempo restante en la esquina superior derecha (como Excel O365) y bloquear la hoja cuando llegue a cero.

**Paso 1: Crear el hook `useExamTimer.ts`**
Crea un archivo separado para manejar la lógica del tiempo sin causar re-renders innecesarios en la cuadrícula.

```typescript
import { useState, useEffect, useRef, useCallback } from 'react';

export function useExamTimer(durationInMinutes: number, onTimeUp: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(durationInMinutes * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  const start = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  // Formatear a HH:MM:SS
  const hours = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;
  const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return { secondsLeft, timeString, isUrgent: secondsLeft <= 300 }; // Urgente si quedan <= 5 min
}
```

**Paso 2: Integrarlo en el Ribbon (`ExcelRibbon.tsx`)**
Añade el temporizador a la barra de título verde.

```tsx
// Dentro de ExcelRibbon.tsx
interface ExcelRibbonProps {
  // ... tus props existentes ...
  examTimeString?: string;
  isExamUrgent?: boolean;
}

// En el JSX, dentro de ribbon-titlebar, antes de ribbon-app-title:
<div className="ribbon-titlebar-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
  {examTimeString && (
    <div 
      className="exam-timer" 
      style={{ 
        background: isExamUrgent ? '#d83b01' : 'rgba(255,255,255,0.2)', 
        padding: '2px 8px', 
        borderRadius: '4px', 
        fontWeight: 'bold',
        fontSize: '13px'
      }}
    >
      ⏱ {examTimeString}
    </div>
  )}
  <span className="ribbon-app-title">Excel-lenz</span>
</div>
```

---

### 2. 📝 El Motor de Corrección (Grading Engine)

Este es el corazón del examen. Debe comparar el estado actual del alumno con una "Solución Maestra" (Master Solution). 

**Importante:** No debemos comparar fórmulas exactas, sino **valores evaluados**. Si el alumno hace `=A1+A2` y la solución es `=SUMME(A1:A2)`, ambos dan `30` y deben considerarse correctos.

**Paso 1: Definir la Solución Maestra en `types.ts`**
```typescript
export interface ExamSolution {
  // Matriz de los valores finales esperados (ej. [["Apfel", 30], ["Birne", 45]])
  evaluatedData: (string | number | null)[][]; 
  // Formatos obligatorios en celdas clave
  requiredFormats?: { row: number; col: number; format: Partial<CellFormat> }[];
}
```

**Paso 2: Crear la función de evaluación en `SpreadsheetHandsontable.tsx`**
Añade un estado para el resultado del examen y una función que lo evalúe.

```typescript
const [examResult, setExamResult] = useState<{ score: number; total: number; errors: any[] } | null>(null);

const gradeExam = useCallback(() => {
  const hot = hotRef.current;
  if (!hot || !solution) return; // 'solution' vendría por props

  let correct = 0;
  let total = 0;
  const errors: any[] = [];

  // Forzar recálculo antes de leer los datos
  hfRef.current?.calculate();

  // 1. Comparar valores
  for (let r = 0; r < solution.evaluatedData.length; r++) {
    for (let c = 0; c < solution.evaluatedData[r].length; c++) {
      const expected = solution.evaluatedData[r][c];
      if (expected === null || expected === undefined || expected === '') continue; // Ignorar celdas vacías
      
      total++;
      const got = hot.getDataAtCell(r, c);
      
      // Normalizar números para comparar (ej. 30.00 === 30)
      const numExpected = parseFloat(String(expected));
      const numGot = parseFloat(String(got));
      const isCorrect = !isNaN(numExpected) ? Math.abs(numGot - numExpected) < 0.01 : String(got).trim() === String(expected).trim();
      
      if (isCorrect) {
        correct++;
      } else {
        errors.push({ row: r, col: c, expected, got });
      }
    }
  }

  // 2. Comparar formatos (si existen)
  if (solution.requiredFormats) {
    for (const req of solution.requiredFormats) {
      total++;
      const fmt = cellFormatsRef.current[`R${req.row}C${req.col}`] || {};
      let fmtCorrect = true;
      if (req.format.bold && !fmt.bold) fmtCorrect = false;
      if (req.format.bgColor && fmt.bgColor !== req.format.bgColor) fmtCorrect = false;
      if (req.format.numberFormat && fmt.numberFormat !== req.format.numberFormat) fmtCorrect = false;
      
      if (fmtCorrect) correct++;
      else errors.push({ row: req.row, col: req.col, expected: req.format, got: fmt });
    }
  }

  setExamResult({ score: correct, total, errors });
  return { score: correct, total, errors };
}, [solution]);
```

**Paso 3: Resaltar errores visualmente**
Si el alumno pulsa "Verificar" (sin entregar), podemos iluminar las celdas incorrectas. En tu `renderer` de Handsontable, ya tienes una variable `errorCells`. Simplemente la actualizamos:

```typescript
// Al pulsar "Verificar progreso":
const handleCheckProgress = () => {
  const result = gradeExam();
  if (result) {
    // Mapear errores al formato que tu renderer ya entiende
    setErrorCells(result.errors.map(e => ({ 
      row: e.row, 
      col: e.col, 
      expected: String(e.expected), 
      got: String(e.got) 
    })));
    hotRef.current?.render();
  }
};
```

---

### 3. 🔒 Flujo de Entrega y Bloqueo (Submission & Lock)

Cuando el tiempo se agota o el alumno hace clic en "Abgeben" (Entregar), la hoja debe bloquearse permanentemente.

**Paso 1: Manejar el estado de bloqueo**
En el componente padre (el que llama a `SpreadsheetHandsontable`), añade:

```typescript
const [isExamFinished, setIsExamFinished] = useState(false);

// Función que se llama al acabarse el tiempo o al pulsar entregar
const handleExamSubmit = () => {
  setIsExamFinished(true);
  // Aquí también dispararías el gradeExam() final y guardarías en backend
};

// En el JSX:
<SpreadsheetHandsontable
  // ... otras props ...
  isExamMode={true}
  isLocked={isExamFinished}
  onSubmit={handleExamSubmit}
  solution={masterSolution}
/>
```

**Paso 2: Aplicar el bloqueo en `SpreadsheetHandsontable.tsx`**
Si `isLocked` es true, hacemos toda la cuadrícula de solo lectura y deshabilitamos el Ribbon.

```typescript
// En SpreadsheetHandsontable.tsx
interface SpreadsheetHandsontableProps {
  // ...
  isExamMode?: boolean;
  isLocked?: boolean;
  onSubmit?: () => void;
  solution?: ExamSolution;
}

// Dentro del componente:
useEffect(() => {
  const hot = hotRef.current;
  if (!hot || hot.isDestroyed) return;
  hot.updateSettings({ readOnly: isLocked });
  hot.render();
}, [isLocked]);

// En el renderer de Handsontable (dentro de la función cells):
if (isLocked) {
  cellMeta.readOnly = true;
  // Opcional: Cambiar el fondo a gris claro para indicar bloqueo
  if (_r > 0) td.style.background = td.style.background || '#f8f9fa';
}
```

**Paso 3: Añadir botones de Examen al Ribbon**
Añade los botones de "Verificar" y "Entregar" al lado del temporizador.

```tsx
// En ExcelRibbon.tsx, añadir a las props:
onCheckProgress?: () => void;
onSubmit?: () => void;
isLocked?: boolean;

// En la barra de título (ribbon-titlebar-right):
{!isLocked && onCheckProgress && (
  <button className="qat-btn" onClick={onCheckProgress} style={{ color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
    Überprüfen
  </button>
)}
{!isLocked && onSubmit && (
  <button className="qat-btn" onClick={onSubmit} style={{ background: '#d83b01', color: 'white', fontWeight: 'bold', border: 'none' }}>
    Abgeben
  </button>
)}
```

**Paso 4: Modal de Resultados Finales**
Cuando `examResult` tiene datos, mostramos un modal superpuesto con la nota.

```tsx
{examResult && (
  <div className="excel-dialog-overlay" style={{ zIndex: 9999 }}>
    <div className="excel-dialog" style={{ maxWidth: 400, textAlign: 'center' }}>
      <h2 style={{ color: '#107b4f', marginBottom: '10px' }}>
        {examResult.score} / {examResult.total} Punkte
      </h2>
      <p style={{ fontSize: '14px', color: '#605e5c' }}>
        {examResult.score === examResult.total 
          ? "Perfekt! Alle Aufgaben richtig gelöst." 
          : `Es gibt noch ${examResult.total - examResult.score} Fehler.`}
      </p>
      <div style={{ maxHeight: 200, overflow: 'auto', textAlign: 'left', marginTop: 15, border: '1px solid #eee', padding: 10 }}>
        {examResult.errors.map((err, i) => (
          <div key={i} style={{ fontSize: '12px', borderBottom: '1px solid #eee', padding: '4px 0' }}>
            Zelle <strong>{colToLetter(err.col)}{err.row + 1}</strong>: 
            Erwartet "{String(err.expected)}", erhalten "{String(err.got)}"
          </div>
        ))}
      </div>
      <button 
        onClick={() => setExamResult(null)} 
        style={{ marginTop: 20, background: '#107b4f', color: 'white', border: 'none', padding: '8px 20px', cursor: 'pointer', borderRadius: 4 }}
      >
        Schließen
      </button>
    </div>
  </div>
)}
```

### Resumen del Flujo de Examen

1. **Inicio:** El temporizador comienza a correr (ej. 30:00). Se muestra en la esquina superior derecha.
2. **Durante el examen:** El alumno trabaja. Puede pulsar "Überprüfen" (Verificar) para ver qué celdas están mal (se iluminan en rojo con un tooltip).
3. **Entrega:** El alumno pulsa "Abgeben" (Entregar) o el temporizador llega a 0.
4. **Bloqueo:** `isLocked` se pone en `true`. El Ribbon se deshabilita (excepto el botón de imprimir). La cuadrícula pasa a `readOnly`.
5. **Corrección Final:** El motor `gradeExam()` compara los valores de HyperFormula y los formatos con la `solution`, calcula la puntuación y muestra el modal de resultados detallando qué celdas fallaron.

Con esto, tienes un **sistema de evaluación completo y funcional**, ideal para entornos académicos o de certificación. ¿Te gustaría que añadiéramos una funcionalidad para que el profesor pueda exportar la hoja del alumno en formato `.xlsx` real (usendo la librería `ExcelJS` o `SheetJS`) para revisarla offline?