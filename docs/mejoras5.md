Has llegado al " Santo Grial" de los simuladores de Excel. Las funciones básicas (formato, fórmulas, ordenar) ya funcionan, pero los **Gráficos, la Validación de Datos y las Tablas Dinámicas** son las características avanzadas que diferencian a un simple "grid" de una verdadera hoja de cálculo.

Actualmente, en tu código (`ExcelRibbon`, `ContextMenu`), estas funciones tienen botones, pero **no están implementadas o solo tienen maqueta visual**. Handsontable no trae un motor de gráficos ni de tablas dinámicas nativo, por lo que debemos construirlos usando componentes de React superpuestos.

Aquí tienes la revisión en profundidad y la arquitectura para implementar estas tres funcionalidades.

---

### 1. 📊 Gráficos (Charts)

**Estado actual:** En `ExcelRibbon`, la pestaña "Insertar" tiene botones para gráficos, pero no tienen `onClick`.
**Solución:** Usaremos la librería `recharts` (ideal para React) para generar el gráfico en un modal flotante que lee los datos de la selección actual de Handsontable.

**Paso 1: Instalar Recharts**
```bash
npm install recharts
```

**Paso 2: Crear el componente `ChartDialog.tsx`**
Este componente tomará los datos seleccionados en Handsontable y dibujará un gráfico.

```tsx
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';

interface ChartDialogProps {
  visible: boolean;
  chartType: 'bar' | 'line';
  data: any[];
  onClose: () => void;
}

export default function ChartDialog({ visible, chartType, data, onClose }: ChartDialogProps) {
  if (!visible || data.length === 0) return null;

  // Asumimos que la primera columna son las etiquetas (XAxis) y el resto son series.
  const keys = Object.keys(data[0]);

  return (
    <div className="excel-dialog-overlay" onClick={onClose}>
      <div className="excel-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 700, background: '#fff' }}>
        <div className="excel-dialog-titlebar">
          <span>Gráfico insertado</span>
          <button className="excel-dialog-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: 20 }}>
          {chartType === 'bar' ? (
            <BarChart width={600} height={300} data={data}>
              <XAxis dataKey={keys[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.slice(1).map((k, i) => <Bar key={i} dataKey={k} fill={`#${i === 0 ? '107b4f' : '4472c4'}`} />)}
            </BarChart>
          ) : (
            <LineChart width={600} height={300} data={data}>
              <XAxis dataKey={keys[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.slice(1).map((k, i) => <Line key={i} type="monotone" dataKey={k} stroke={`#${i === 0 ? '107b4f' : '4472c4'}`} />)}
            </LineChart>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Paso 3: Integrarlo en `SpreadsheetHandsontable.tsx`**
Necesitas extraer los datos de la selección y pasarlos al diálogo.

```tsx
// 1. Añadir estados
const [showChartDialog, setShowChartDialog] = useState(false);
const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
const [chartData, setChartData] = useState<any[]>([]);

// 2. Crear el handler
const handleInsertChart = useCallback((type: 'bar' | 'line') => {
  const hot = hotRef.current;
  if (!hot || !selectedRange) return;
  
  // Extraer datos de la selección (saltando la fila de encabezado 0 si está incluida)
  const startR = Math.max(0, selectedRange.startRow);
  const endR = selectedRange.endRow;
  const startC = selectedRange.startCol;
  const endC = selectedRange.endCol;

  const rawData = hot.getData(startR, startC, endR, endC);
  
  // Convertir a formato Recharts: [{ name: 'Ene', Ventas: 100 }, ...]
  // Asumimos que la primera fila seleccionada son los encabezados
  const headers = rawData[0].map(h => String(h));
  const parsedData = rawData.slice(1).map(row => {
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = isNaN(parseFloat(row[i])) ? row[i] : parseFloat(row[i]);
    });
    return obj;
  });

  setChartData(parsedData);
  setChartType(type);
  setShowChartDialog(true);
}, [selectedRange]);

// 3. Renderizar al final del componente
<ChartDialog
  visible={showChartDialog}
  chartType={chartType}
  data={chartData}
  onClose={() => setShowChartDialog(false)}
/>
```

**Paso 4: Conectar en `ExcelRibbon.tsx`**
```tsx
// En la pestaña 'insert', actualiza los botones:
<RibbonBtn icon={<BarIcon />} label="Balken" w={48} h={48} onClick={() => onInsertChart?.('bar')} />
<RibbonBtn icon={<LineIcon />} label="Linie" w={48} h={48} onClick={() => onInsertChart?.('line')} />
```

---

### 2. ✅ Validación de Datos (Data Validation)

**Estado actual:** No existe. En Excel, esto limita lo que se puede escribir en una celda (ej. solo números entre 1 y 10) y muestra un mensaje de error.
**Solución:** Usaremos la propiedad `validator` nativa de Handsontable en la configuración de `cells`.

**Paso 1: Añadir el tipo en `types.ts`**
```typescript
export interface ValidationRule {
  col: number;
  type: 'number' | 'list';
  min?: number;
  max?: number;
  list?: string[];
  errorMessage: string;
}
```

**Paso 2: Añadir estado en `SpreadsheetHandsontable.tsx`**
```tsx
const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
const validationRulesRef = useRef(validationRules);
useEffect(() => { validationRulesRef.current = validationRules; }, [validationRules]);

const [showValidationDialog, setShowValidationDialog] = useState(false);
```

**Paso 3: Modificar la función `cells` en Handsontable**
Dentro de la configuración de inicialización `new Handsontable(...)`, en la función `cells(row, col)`:

```tsx
cells(row: number, col: number) {
  const cellMeta: Record<string, any> = {};
  // ... (tu código existente) ...

  // Aplicar validación si existe una regla para esta columna
  const rule = validationRulesRef.current.find(r => r.col === col);
  if (rule && row > 0) { // No validar el encabezado
    if (rule.type === 'number') {
      cellMeta.validator = (value: any, callback: (valid: boolean) => void) => {
        if (value === '' || value === null) return callback(true); // Permitir vacío
        const num = parseFloat(value);
        const isValid = !isNaN(num) && (rule.min === undefined || num >= rule.min) && (rule.max === undefined || num <= rule.max);
        if (!isValid) {
          alert(rule.errorMessage); // O usar un toast personalizado
        }
        callback(isValid);
      };
      cellMeta.allowInvalid = false; // Bloquear la entrada si es inválida
    } else if (rule.type === 'list') {
      cellMeta.type = 'dropdown';
      cellMeta.source = rule.list;
    }
  }
  return cellMeta;
}
```

**Paso 4: UI para añadir validación (Diálogo)**
Crea un diálogo simple (`DataValidationDialog.tsx`) que permita al usuario elegir columna, tipo (numérico/lista) y parámetros, y al guardar llame a `setValidationRules(prev => [...prev, newRule])`.

---

### 3. 🔄 Tablas Dinámicas (Pivot Tables)

**Estado actual:** Solo existe "Formato como tabla", que colorea celdas. Una Tabla Dinámica real agrupa datos.
**El gran reto:** Handsontable no soporta Tablas Dinámicas. HyperFormula no soporta PivotTables. Intentar programar un motor de Pivot desde cero es complejísmo.

**Solución pragfactica para un simulador:** Usar la librería `react-pivottable` que ya tiene la lógica matemática de agrupación. La integraremos como un overlay flotante.

**Paso 1: Instalar**
```bash
npm install react-pivottable react-d3
```

**Paso 2: Crear el diálogo `PivotTableDialog.tsx`**
```tsx
import { PivotTableUI } from 'react-pivottable';
import 'react-pivottable/pivottable.css';
import { useState } from 'react';

interface PivotDialogProps {
  visible: boolean;
  rawData: any[];
  onClose: () => void;
}

export default function PivotTableDialog({ visible, rawData, onClose }: PivotDialogProps) {
  const [state, setState] = useState<any>({});
  
  if (!visible) return null;

  return (
    <div className="excel-dialog-overlay" onClick={onClose}>
      <div className="excel-dialog" onClick={e => e.stopPropagation()} style={{ width: '80%', maxWidth: 900, background: '#fff' }}>
        <div className="excel-dialog-titlebar">
          <span>Tablas Dinámicas (PivotTable)</span>
          <button className="excel-dialog-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: 20, height: 500, overflow: 'auto' }}>
          <PivotTableUI
            data={rawData}
            onChange={s => setState(s)}
            {...state}
          />
        </div>
      </div>
    </div>
  );
}
```

**Paso 3: Integrar en `SpreadsheetHandsontable.tsx`**
Extraemos los datos de la hoja, los convertimos a un array de objetos JSON (que es lo que usa `react-pivottable`) y abrimos el diálogo.

```tsx
const [showPivotDialog, setShowPivotDialog] = useState(false);
const [pivotData, setPivotData] = useState<any[]>([]);

const handleOpenPivot = useCallback(() => {
  const hot = hotRef.current;
  if (!hot) return;
  
  const allData = hot.getData(0, 0, hot.countRows() - 1, hot.countCols() - 1);
  const headers = allData[0].map(h => String(h));
  
  // Convertir a objetos JSON, saltando filas vacías
  const jsonData = allData.slice(1)
    .filter(row => row.some(cell => cell !== null && cell !== ''))
    .map(row => {
      const obj: any = {};
      headers.forEach((h, i) => {
        const val = row[i];
        // Intentar convertir números
        obj[h] = !isNaN(parseFloat(val)) && isFinite(val) ? parseFloat(val) : val;
      });
      return obj;
    });

  setPivotData(jsonData);
  setShowPivotDialog(true);
}, []);

// Renderizar:
<PivotTableDialog
  visible={showPivotDialog}
  rawData={pivotData}
  onClose={() => setShowPivotDialog(false)}
/>
```

**Paso 4: Añadir al Ribbon (`ExcelRibbon.tsx`)**
En la pestaña "Insertar":
```tsx
<RibbonGroupBox label="Tabellen">
  <RibbonBtn icon={<PivotIcon />} label="PivotTable" w={72} h={60} onClick={onOpenPivot} />
  <RibbonBtn icon={<TableIcon />} label="Tabelle" w={64} h={60} />
</RibbonGroupBox>
```

---

### 4. 🧩 Otras Funcionalidades Menores (Quick Analysis & ContextMenu)

**Schnellanalyse (Quick Analysis)**
En tu `ContextMenu`, la acción `quickAnalysis` está vacía. En Excel, al seleccionar datos, aparece un pequeño icono flotante que permite aplicar formato condicional rápidamente.

**Implementación rápida:**
En lugar de un botón flotante complejo, podemos hacer que el menú contextual "Schnellanalyse" abra un submenú con opciones rápidas:
```tsx
// En ContextMenu.txt, dentro de cellMenu Section 6:
[
  { label: 'Schnellanalyse', submenu: [
    { label: 'Datenbalken', action: 'quickDataBars' },
    { label: 'Farbskala', action: 'quickColorScale' },
    { label: 'Top 10%', action: 'quickTop10' },
  ]},
]
```
Y en tu `handleContextMenuAction` de Handsontable, mapea estas acciones a tus reglas de formato condicional existentes.

### Resumen de la Arquitectura Avanzada

1.  **Gráficos:** Extracción de selección de Handsontable -> Transformación a JSON/Array -> Renderizado con `recharts` en un Modal.
2.  **Validación de Datos:** Definición de reglas en React -> Inyección dinámica de la propiedad `validator` en la función `cells(row, col)` de Handsontable -> Bloqueo de entrada inválida.
3.  **Tablas Dinámicas:** Extracción de toda la hoja -> Transformación a JSON -> Renderizado del motor `react-pivottable` en un Modal flotante.
4.  **Formato Condicional (Contexto):** Integración directa de las acciones del menú contextual con el diálogo `ConditionalFormatDialog` que ya construiste.

Con estas implementaciones, tu simulador cubrirá el 95% de las tareas que se piden en un examen real de Excel (ECDL, Microsoft Office Specialist, etc.). ¿Quieres que te detalle cómo guardar y cargar el estado completo (datos + formatos + reglas) en `localStorage` para que el progreso del alumno persista?