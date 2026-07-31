Entendido. Vamos a perfeccionar el sistema de evaluación para introducir el **Modo Práctica (Übungsmodus)**, donde el alumno recibe feedback visual instantáneo sin tener que esperar a un examen final. 

Para lograr la mejor experiencia de usuario (y no sobrecargar la CPU), dividiremos la evaluación en dos capas: **Chequeo dinámico de valores** (al escribir) y **Chequeo de formatos bajo demanda** (con un botón). Además, implementaremos el famoso **triángulo verde de error** característico de Excel.

Aquí tienes la implementación completa:

---

### 1. 🟢 El Triángulo Verde de Error (Visual Excel)

En Excel, cuando hay un error o una incoherencia en una celda, aparece un pequeño triángulo verde en la esquina superior izquierda. Vamos a replicarlo en tu `renderer`.

**En `SpreadsheetHandsontable.txt` (dentro de la función `cells` -> `renderer`):**

Busca la sección donde gestionas los `errorCells` y actualízala para añadir el triángulo mediante un pseudo-elemento o un span absoluto. Usaremos un span para mayor compatibilidad.

```typescript
// Dentro del renderer, reemplaza la lógica de currentErrors:
const currentErrors = errorCellsRef.current;
if (currentErrors && currentErrors.length > 0) {
  const hasError = currentErrors.find(ec => ec.row === _r && ec.col === _c);
  if (hasError) {
    // Fondo rojo claro
    td.style.background = '#fff0f0';
    td.style.borderLeft = '2px solid #c62828';
    td.title = `Fehler: Erwartet wird "${hasError.expected}"`;

    // Añadir triángulo verde (Indikator)
    // Verificamos si ya existe para no duplicarlo en cada renderizado
    if (!td.querySelector('.excel-error-triangle')) {
      const triangle = document.createElement('div');
      triangle.className = 'excel-error-triangle';
      td.style.position = 'relative'; // Necesario para el posicionamiento absoluto
      td.appendChild(triangle);
    }
  } else {
    // Si la celda ya no tiene error, eliminar el triángulo si existe
    const existingTriangle = td.querySelector('.excel-error-triangle');
    if (existingTriangle) existingTriangle.remove();
  }
} else {
  const existingTriangle = td.querySelector('.excel-error-triangle');
  if (existingTriangle) existingTriangle.remove();
}
```

**Añade esto a tu CSS global:**
```css
.excel-error-triangle {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 6px 0 0;
  border-color: #43a047 transparent transparent transparent; /* Verde Excel */
  z-index: 5;
  pointer-events: none;
}
```

---

### 2. ⚡ Evaluación Dinámica en Modo Práctica (Übungsmodus)

En el Modo Práctica, cada vez que el alumno pulsa Enter (o se mueve de la celda tras escribir), el sistema comprobará **solo el valor** de esa celda contra la solución.

**En `SpreadsheetHandsontable.tsx`:**

Añade las props necesarias y un `useEffect` para la evaluación reactiva.

```typescript
interface SpreadsheetHandsontableProps {
  // ... tus props existentes ...
  mode?: 'exam' | 'practice'; // Modo de funcionamiento
  solution?: ExamSolution; // La solución con los valores esperados
  showSolution?: boolean; // Si el profesor permite mostrar la solución completa
}

export default function SpreadsheetHandsontable({ 
  // ... 
  mode = 'exam', 
  solution, 
  showSolution = false,
  // ... 
}: SpreadsheetHandsontableProps) {
  
  const [errorCells, setErrorCells] = useState<{row: number; col: number; expected: string; got: string}[]>([]);
  const errorCellsRef = useRef(errorCells);
  useEffect(() => { errorCellsRef.current = errorCells; }, [errorCells]);

  // Función para chequear UNA celda específica
  const checkCellPractice = useCallback((row: number, col: number) => {
    if (!solution || mode !== 'practice') return;
    
    const hot = hotRef.current;
    if (!hot) return;
    
    hfRef.current?.calculate();
    const got = hot.getDataAtCell(row, col);
    const expected = solution.evaluatedData[row]?.[col];
    
    if (expected === null || expected === undefined || expected === '') return;
    
    const numExpected = parseFloat(String(expected));
    const numGot = parseFloat(String(got));
    const isCorrect = !isNaN(numExpected) 
      ? Math.abs(numGot - numExpected) < 0.01 
      : String(got).trim() === String(expected).trim();
    
    setErrorCells(prev => {
      // Filtrar el error antiguo de esta celda
      const filtered = prev.filter(e => !(e.row === row && e.col === col));
      // Si es incorrecto, añadirlo
      if (!isCorrect) {
        return [...filtered, { row, col, expected: String(expected), got: String(got) }];
      }
      return filtered;
    });
    
    hot.render();
  }, [solution, mode]);
```

**Engancha esta función al evento `afterChange` de Handsontable:**

```typescript
// En la inicialización de Handsontable:
afterChange(changes: any, source: string) {
  if (!changes || source === 'loadData' || isInternalChange.current) return;
  
  setCanUndo(hot.isUndoAvailable());
  setCanRedo(hot.isRedoAvailable());
  
  const nd = dataRef.current.map(r => [...r]);
  for (const [row, col, _old, newVal] of changes) {
    if (row === 0) continue;
    if (nd[row - 1]) nd[row - 1][col] = newVal;
    
    // MODO PRÁCTICA: Chequear inmediatamente la celda cambiada
    if (mode === 'practice') {
      checkCellPractice(row, col);
    }
  }
  // ... (resto del afterChange)
}
```

---

### 3. 🕵️‍♂️ Botón "Lösung anzeigen" (Mostrar Solución)

En el modo práctica, es muy útil que el alumno pueda pulsar un botón para que las celdas correctas se llenen automáticamente con la respuesta (como hace Excel cuando detecta un patrón, o en sistemas educativos tipo Moodle).

**En `SpreadsheetHandsontable.tsx`:**

```typescript
// Función para revelar la solución
const handleShowSolution = useCallback(() => {
  if (!solution || !showSolution) return;
  const hot = hotRef.current;
  if (!hot) return;
  
  const changes: [number, number, any][] = [];
  for (let r = 0; r < solution.evaluatedData.length; r++) {
    for (let c = 0; c < solution.evaluatedData[r].length; c++) {
      const expected = solution.evaluatedData[r][c];
      // Solo rellenar si la celda está vacía o es incorrecta
      const currentVal = hot.getDataAtCell(r, c);
      const numExp = parseFloat(String(expected));
      const numCur = parseFloat(String(currentVal));
      const isCorrect = !isNaN(numExp) ? Math.abs(numCur - numExp) < 0.01 : String(currentVal).trim() === String(expected).trim();
      
      if (expected !== null && expected !== '' && !isCorrect) {
        changes.push([r, c, expected]);
      }
    }
  }
  
  if (changes.length > 0) {
    isInternalChange.current = true;
    hot.setDataAtCell(changes as any);
    requestAnimationFrame(() => { isInternalChange.current = false; });
  }
  
  // Limpiar errores ya que ahora todo es correcto
  setErrorCells([]);
  hot.render();
}, [solution, showSolution]);
```

---

### 4. 🎛️ Integración en el Ribbon y Status Bar

Ahora necesitamos decirle al alumno en qué modo está y, si está en modo práctica, darle el botón para ver la solución.

**En `ExcelRibbon.tsx`:**
Añade los nuevos props y un indicador visual en la barra de título.

```typescript
interface ExcelRibbonProps {
  // ...
  examMode?: 'exam' | 'practice';
  onShowSolution?: () => void;
  canShowSolution?: boolean;
}

// En la barra de título (ribbon-titlebar-right):
<div className="ribbon-titlebar-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
  {examMode === 'practice' && (
    <span style={{ background: '#ffc107', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>
      ÜBUNGSMODUS
    </span>
  )}
  
  {canShowSolution && (
    <button 
      className="qat-btn" 
      onClick={onShowSolution}
      style={{ color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontSize: '12px' }}
      title="Lösung für leere/falsche Zellen anzeigen"
    >
      💡 Lösung anzeigen
    </button>
  )}
  
  {/* ... temporizador y título ... */}
</div>
```

**Pásalo desde `SpreadsheetHandsontable.tsx`:**
```tsx
<ExcelRibbon
  // ... tus props ...
  examMode={mode}
  onShowSolution={handleShowSolution}
  canShowSolution={mode === 'practice' && showSolution}
/>
```

---

### 5. 🔄 Evaluación Completa bajo Demanda (Formatos)

Como mencionamos, la evaluación dinámica solo revisa valores (para no interrumpir al alumno mientras pinta celdas). Pero el alumno necesita saber si los formatos (negrita, colores, decimales) son correctos antes de entregar.

Actualizamos el botón "Überprüfen" (Verificar) para que en modo práctica haga un chequeo exhaustivo de valores **y** formatos:

```typescript
const handleCheckProgress = useCallback(() => {
  const hot = hotRef.current;
  if (!hot || !solution) return;
  
  hfRef.current?.calculate();
  const newErrors = [];
  
  // 1. Re-chequear todos los valores
  for (let r = 0; r < solution.evaluatedData.length; r++) {
    for (let c = 0; c < solution.evaluatedData[r].length; c++) {
      const expected = solution.evaluatedData[r][c];
      if (expected === null || expected === '') continue;
      const got = hot.getDataAtCell(r, c);
      const numExp = parseFloat(String(expected));
      const numGot = parseFloat(String(got));
      const isCorrect = !isNaN(numExp) ? Math.abs(numGot - numExp) < 0.01 : String(got).trim() === String(expected).trim();
      if (!isCorrect) newErrors.push({ row: r, col: c, expected: String(expected), got: String(got) });
    }
  }
  
  // 2. Chequear formatos obligatorios
  if (solution.requiredFormats) {
    for (const req of solution.requiredFormats) {
      const fmt = cellFormatsRef.current[`R${req.row}C${req.col}`] || {};
      let fmtCorrect = true;
      if (req.format.bold && !fmt.bold) fmtCorrect = false;
      if (req.format.bgColor && fmt.bgColor !== req.format.bgColor) fmtCorrect = false;
      if (req.format.numberFormat && fmt.numberFormat !== req.format.numberFormat) fmtCorrect = false;
      
      if (!fmtCorrect) {
        // Si el valor era correcto pero falla el formato, lo añadimos a errores
        if (!newErrors.find(e => e.row === req.row && e.col === req.col)) {
          newErrors.push({ 
            row: req.row, 
            col: req.col, 
            expected: `Format: ${JSON.stringify(req.format)}`, 
            got: `Format: ${JSON.stringify(fmt)}` 
          });
        }
      }
    }
  }
  
  setErrorCells(newErrors);
  hot.render();
  
  // Mostrar un pequeño Toast o Alerta
  alert(newErrors.length === 0 
    ? "Alles richtig! (Valores y formatos correctos)" 
    : `Es gibt noch ${newErrors.length} Fehler. Suche nach den grünen Dreiecken.`);
}, [solution]);
```

### Resumen de la mejora del sistema de evaluación:

1. **Triángulo Verde:** Ahora los errores se marcan visualmente con el mismo indicador que usa Excel, mejorando enormemente la retroalimentación visual.
2. **Modo Práctica Dinámico:** En cuanto el alumno escribe un número incorrecto y pulsa Enter, la celda se pone roja con el triángulo verde. Si lo corrige, el error desaparece instantáneamente.
3. **Mostrar Solución:** Si el alumno se rinde con una celda, puede pulsar "Lösung anzeigen" y las celdas incorrectas/vacías se rellenan automáticamente con la respuesta correcta.
4. **Chequeo de Formatos:** Al pulsar "Überprüfen", el sistema avisa si faltan negritas, bordes o formatos de moneda, evitando que el alumno entregue un ejercicio con el valor correcto pero el formato equivocado.