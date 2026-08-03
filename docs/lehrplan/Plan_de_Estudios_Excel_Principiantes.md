---
pdftitle: "Programa de estudios: Excel para principiantes"
author: "Cristóbal Gallardo"
date: "agosto de 2026"
location: "Friburgo de Brisgovia"
lang: es
colorlinks: true
linkcolor: blue
urlcolor: blue
fontsize: 11pt
documentclass: article
geometry: margin=2.5cm
---

\thispagestyle{empty}
\begin{center}
{\Huge\bfseries\sffamily\color{excelblue}Programa de estudios\par}
\vspace{0.3em}
{\Large\sffamily Excel para principiantes\par}
\vspace{1.5em}
{\large\sffamily Programa de estudios completo con teoría y ejercicios prácticos\par}
\vspace{2.5em}
{\normalsize\sffamily\color{excelgray}
\textbf{Autor:} Cristóbal Gallardo\par
\vspace{0.2em}
\textbf{Fecha:} agosto de 2026\par
\vspace{0.2em}
\textbf{Lugar:} Friburgo de Brisgovia\par
\vspace{0.2em}
\textbf{Duración:} 12 horas (8 sesiones de 90 minutos cada una)\par
\vspace{0.2em}
\textbf{Nivel:} Principiante (no se requieren conocimientos previos)\par
}
\end{center}
\vfill

\tableofcontents

## Introducción

Este plan de estudios ofrece una introducción completa a Microsoft Excel para adultos
sin conocimientos previos. Combina teoría fácil de entender con ejercicios prácticos y
ha sido diseñado específicamente para clases presenciales individuales.

## ¿A quién va dirigido este plan de estudios?

Este plan de estudios está dirigido a **adultos sin conocimientos previos** de Excel.

## ¿Cómo está estructurado el plan de estudios?

1. **Objetivo de aprendizaje** — Lo que serás capaz de hacer tras completar este módulo
2. **Teoría** — Explicaciones claras para principiantes
3. **Ejercicios** — Tareas prácticas con archivos de Excel

## Qué debes saber antes

- Conocimientos básicos sobre el manejo de un ordenador
- No se requieren conocimientos previos de Excel
- Tener instalado Microsoft Excel 2019 o Microsoft 365


## Módulo 1: Introducción a Excel y al entorno de trabajo

**Objetivo de aprendizaje:** Familiarizarse con la interfaz de Excel, los conceptos básicos y la gestión de archivos.

## 1.1. ¿Qué es Excel y para qué sirve?

### Concepto: la hoja de cálculo

Excel es una **hoja de cálculo**. Cada recuadro se denomina **celda** y tiene una dirección como A1, B5 o Z100.

| Término | Significado | Ejemplo |
|---------|-----------|----------|
| **Libro** | El archivo completo de Excel | `Presupuesto_2026.xlsx` |
| **Hoja de cálculo** | Una página dentro del libro | `Enero` |
| **Fila** | Serie horizontal (1, 2, 3...) | Fila 5 |
| **Columna** | Serie vertical (A, B, C...) | Columna D |
| **Celdilla** | Punto de intersección entre fila y columna | B5 |

### ¿Para qué se utiliza Excel?

- **Contabilidad:** facturas, presupuestos
- **Gestión de proyectos:** calendarios, recursos
- **Ventas:** listas de clientes, análisis
- **Uso personal:** presupuesto doméstico, planificación

**Ejercicio 1.1 — Primeros pasos**

Abre Excel y crea un nuevo libro. Identifica las pestañas,
el cuadro de nombre, la barra de edición y la barra de estado. Guárdalo como `Mi_primer_libro.xlsx`.

## 1.2. La interfaz de usuario

### Concepto: la cinta de opciones (Ribbon)

| Pestaña | Funciones |
|--------------|-----------|
| **Inicio** | Fuente, alineación, formato numérico |
| **Insertar** | Tablas, gráficos |
| **Diseño de página** | Áreas de impresión, márgenes |
| **Fórmulas** | Biblioteca de funciones |
| **Datos** | Ordenar, filtrar |

**Consejo:** Personaliza la barra de acceso rápido con los comandos que utilices con más frecuencia.

**Ejercicio 1.2 — Explorar la interfaz**

Añade "Nuevo", "Abrir" e "Impresión rápida" a la barra de acceso rápido.

## 1.3. Navegación básica

### Concepto: desplazamiento por la hoja de cálculo

| Tecla | Efecto |
|-------|---------|
| Teclas de flecha | Avanzar una celda |
| Ctrl+Flecha | Saltar al borde |
| Ctrl+Pos1 | Ir a la celda A1 |
| Ctrl+Fin | Ir a la última celda |

**Consejo:** `Ctrl+Barra espaciadora` = columna completa, `Mayús+Barra espaciadora` = fila completa.

**Ejercicio 1.3 — Practicar la navegación**

Crea tres hojas: enero, febrero, marzo. Practica con Ctrl+Pos1 y Ctrl+Fin.

## 1.4. Gestión de archivos

### Concepto: formatos de archivo

| Formato | Extensión | Uso |
|--------|--------|------------|
| Estándar | `.xlsx` | Desde Excel 2007 |
| Con macros | `.xlsm` | Para VBA |
| PDF | `.pdf` | Para compartir |
| CSV | `.csv` | Intercambio de datos |

**Importante:** En todas las combinaciones de teclas de este plan de estudios, `Mayús` hace referencia a la tecla Mayús (Shift), que en algunos teclados también aparece etiquetada como `Shift`.

**Importante:** ¡Guarda regularmente con `Ctrl+S`!

**Ejercicio 1.4 — Gestionar archivos**

Guárdelo como `Inventario_2026.xlsx` y expórtelo a PDF.



## Módulo 2: Introducción y edición de datos

**Objetivo de aprendizaje:** Introducir y editar de forma eficiente datos de distintos tipos, y organizarlos con la función de autocompletar.

## 2.1. Tipos de datos en Excel

###  Concepto: ¿Por qué Excel distingue entre tipos de datos?

Excel no es un simple programa de texto: reconoce automáticamente si introduces texto, un número
o una fecha. Esta distinción es fundamental, ya que determina **lo que Excel
puede hacer con los datos**: con los números puede realizar cálculos, con las fechas puede calcular intervalos
de tiempo y el texto sirve como etiqueta. La alineación automática te indica de inmediato
cómo ha interpretado Excel lo que has introducido: el texto se alinea a la izquierda, mientras que los números y las fechas
se alinean a la derecha.

| Tipo de datos | Alineación | Ejemplo | Qué puede hacer Excel con ello |
|----------|-------------|---------|----------------------------|
| **Texto** (etiqueta) | Alineado a la izquierda | `Müller`, `Berlín`, `Producto A` | Ordenar, filtrar, buscar |
| **Número** (valor) | Alineado a la derecha | `42`, `19,99`, `-150` | Realizar cálculos, sumar, calcular la media |
| **Fecha** | Alineado a la derecha | `15/03/2026` | Calcular días, determinar la edad |
| **Hora** | Alineado a la derecha | `14:30`, `09:15:00` | Diferencias horarias, cálculo de horas |
| **Porcentaje** | Alineado a la derecha | `19 %`, `0,05` | Cálculos porcentuales |
| **Moneda** | Alineado a la derecha | `29,99 €`, `45,00 €` | Cálculos financieros |

 **Consejo:** Si Excel no reconoce una fecha (p. ej., `2026.03.15`), prueba con el
formato `DD.MM.AAAA`. Excel se basa en la configuración regional de tu sistema.

**Ejercicio 2.1 — Reconocer tipos de datos**

La siguiente tabla de ejercicios **Módulo 2.1 Tipos de datos** ya está cargada. Introduzca en diferentes celdas:

- Su nombre (texto)

- El número 1500 (número)

- La fecha de hoy

- Una cantidad de dinero, por ejemplo, `49,99 €`

Observe la alineación automática. A continuación, cambie el formato numérico
de una celda mediante `Inicio → Número → Seleccionar formato`.

## 2.2. Editar celdas

###  Concepto: cambiar el contenido sin tener que volver a escribirlo

Imagina que has escrito una lista larga y detectas un error tipográfico en
la celda D47. ¿Tienes que volver a escribirlo todo? ¡No! Excel ofrece varias formas de editar el contenido de las celdas:
haciendo doble clic en la celda, pulsando la tecla `F2` o directamente en la barra de edición
situada sobre la cuadrícula. Los comandos "Deshacer" (Ctrl+Z) y "Hacer" (Ctrl+Y) son
su red de seguridad: puede retroceder hasta 100 pasos.

**Comparación de los tres métodos de edición:**

| Método | Atajo de teclado | Ideal para |
|---------|-------------|---------------|
| Doble clic en la celda | — | Corrección rápida directamente en la hoja |
| Tecla `F2` | F2 | Edición sin ratón |
| Barra de edición | — | Visión general de fórmulas o textos largos |

 **Importante:** Si seleccionas una celda y empiezas a escribir directamente, se sustituirá todo el
contenido, ¡no se añadirá nada! Para realizar cambios, pulsa siempre primero `F2` o haz doble clic.

**Ejercicio 2.2 — Editar celdas**

La siguiente tabla de ejercicios **Módulo 2.2 Edición** ya está cargada. La tabla contiene, a propósito,
errores ortográficos. Corrija cada celda con error de tres formas diferentes:

1. Haciendo doble clic en la celda
2. Con la tecla `F2`
3. A través de la barra de edición

Deshaga una corrección con `Ctrl+Z` y, a continuación, restáurela con `Ctrl+Y`.

## 2.3. Autocompletar y filas

###  Concepto: reconocer patrones y continuarlos automáticamente

El **cuadro de autocompletado** (el pequeño cuadrado situado en la esquina inferior derecha de una celda seleccionada) es una
de las herramientas más potentes de Excel. Al arrastrarlo, Excel reconoce patrones y los
continúa automáticamente. Escribe "Lunes" en una celda, arrastra el cuadro de relleno y
Excel completará "Martes", "Miércoles", "Jueves"... Lo mismo funciona con meses,
trimestres, series numéricas e incluso patrones definidos por el usuario como "Cliente 1", "Cliente 2"...

Excel reconoce las siguientes series integradas:
- Días de la semana (lunes, martes...)
- Meses (enero, febrero...)
- Trimestres (T1, T2...)
- Secuencias numéricas (1, 2, 3... o 2, 4, 6...)

 **Consejo:** Si seleccionas dos valores (por ejemplo, "1" y "3") y luego arrastras,
Excel reconoce el patrón de incrementos y lo continúa: 1, 3, 5, 7, 9... ¡Esto también funciona con
fechas!

**Ejercicio 2.3 — Usar el Autocompletar**

La siguiente tabla de ejercicios **Módulo 2.3 Autocompletar** ya está cargada.

1. Escribe "enero" en la celda A1 y arrastra el punto de relleno hasta A12.
2. Escribe "1" en B1, "3" en B2, selecciona ambas y arrastra hasta B10.
3. Escribe la fecha de hoy en C1 y crea una

   para 30 días.

## 2.4. Copiar, cortar y pegar

###  Concepto: las opciones de pegado de contenido

Todo el mundo conoce `Ctrl+C` y `Ctrl+V`, pero Excel puede hacer mucho más que una simple copia.
Con **Pegar contenido** (accesible mediante clic con el botón derecho o `Ctrl+Alt+V`) puedes transferir de forma selectiva
solo determinados aspectos de una celda: solo los valores sin fórmulas, solo el formato,
o incluso transponer la tabla (intercambiar filas y columnas).

**Las opciones de pegado más importantes:**

| Opción | Atajo de teclado (después de Ctrl+Alt+V) | Efecto |
|--------|-------------------------------|---------|
| Todo | — | Predeterminado: fórmulas + formato |
| Valores | `W` | Solo el resultado visible, sin fórmula |
| Fórmulas | `F` | Solo la fórmula, sin formato |
| Formato | `R` | Solo el aspecto, no el contenido |
| Transponer | (marcar la casilla) | Intercambiar filas y columnas |

 **Consejo:** Si desea copiar los resultados de las fórmulas sin que se desplacen las referencias,
utilice "Pegar contenido → Valores". Esto resulta especialmente útil cuando
se transfieren cálculos a otra hoja de cálculo.

**Ejercicio 2.4 — Copiar y pegar**

La siguiente tabla de ejercicios **Módulo 2.4 Copiar** ya está cargada.

1. Copie la tabla `A1:D10` y péguela a partir de `F1`.
2. Copie la misma tabla y péguela con "Transponer" a partir de `F15`.
3. Copie una celda con fórmula y péguela con "Valores"; observe

   la diferencia.



## Módulo 3: Formato y estilo de celda

**Objetivo de aprendizaje:** dar formato a las tablas de forma profesional, representar correctamente los números y aplicar el
formato condicional.

## 3.1. Formato básico

###  Concepto: por qué el formato va más allá de la estética

Una tabla bien formateada no solo es más atractiva, sino que también resulta **más comprensible**. Los estudios demuestran
que los datos formateados se asimilan más rápidamente y se interpretan con mayor precisión. Los tres
principios básicos del formateo profesional son:

1. **Contraste**: los encabezados destacan claramente sobre los datos (negrita, tamaño mayor, color)
2. **Alineación**: los datos del mismo tipo se alinean de forma uniforme (números a la derecha, texto a la izquierda)
3. **Discreción**: menos es más — un máximo de 2-3 colores, sin combinaciones llamativas

**Las herramientas de formato de los grupos "Fuente" y "Alineación":**

| Herramienta | Atajo de teclado | Efecto |
|----------|-------------|---------|
| Negrita | `Ctrl+Mayús+F` (cuadro de diálogo "Fuente") | Resaltar el texto (encabezados) |
| Cursiva | `Ctrl+Mayús+K` (cuadro de diálogo "Fuente") | Resaltar en el texto corrido |
| Subrayado | `Ctrl+Mayús+U` (cuadro de diálogo "Fuente") | Valores especialmente importantes |
| Marco | — | Separar visualmente las celdas entre sí |
| Color de relleno | — | Color de fondo para las celdas |
| Color de la fuente | — | Cambiar el color del texto |
| Unir y centrar | — | Combinar varias celdas en una sola |
| Salto de línea | — | Dividir texto largo en una celda |

 **Consejo:** El cuadro de diálogo "Formato de celdas" (`Ctrl+1`) es el centro de control
de todas las opciones de formato. Aquí encontrarás todo en un mismo lugar: desde los bordes hasta
la alineación y la fuente.

**Ejercicio 3.1 — Aplicar el formato básico**

La siguiente tabla de ejercicios **Módulo 3.1 Formato básico** ya está cargada. Da formato a la tabla de la siguiente manera:

1. Fila de encabezados: negrita, fondo azul oscuro, letra blanca
2. Celdas de datos: bordes finos grises, color de fila alterno (blanco/gris claro)
3. Título: extenderlo a lo ancho de la tabla y centrarlo
4. Celdas de texto largo: activar el salto de línea

## 3.2. Formatos numéricos

###  Concepto: la importancia de un formato numérico correcto

El número `0,25` puede significar muchas cosas: 25 céntimos, el 25 % o, simplemente, un número pequeño. El
**formato numérico** determina cómo Excel *muestra* el valor, sin modificar el valor real
de la celda. Esta es una diferencia importante: la visualización es solo la
presentación, mientras que el valor almacenado se mantiene para los cálculos.

**Los formatos numéricos más importantes:**

| Formato | Ejemplo (introducido) | Ejemplo (mostrado) | Uso |
|--------|----------------------|---------------------|------------|
| Estándar | `1500,5` | `1500,5` | Sin formato específico |
| Número | `1500,5` | `1.500,50` | Separador de miles, decimales |
| Moneda | `1500,5` | `1.500,50 €` | Importes financieros |
| Porcentaje | `0,19` | `19 %` | Proporciones, tipos impositivos |
| Fecha | `45300` | `15/03/2026` | Fechas del calendario |
| Definido por el usuario | — | `KG 42` | Formatos propios como `"KG "0` |

 **Importante:** En Excel, los valores porcentuales son números decimales: `19 %` se guarda como `0,19`.
Si introduce `19` y luego le aplica el formato %, ¡Excel mostrará `1900 %`!

**Ejercicio 3.2 — Dar formato a los números**

La siguiente tabla de ejercicios **Módulo 3.2 Formato de números** ya está cargada.

1. Formatea la columna B como "Moneda" con el símbolo € y 2 decimales.
2. Formatea la columna C como "Porcentaje" con 1 decimal.
3. Formatea la columna D como "Número" con separador de miles.
4. Experimenta con el botón "Añadir/eliminar decimal".

## 3.3. Ajustar filas y columnas

###  Concepto: dar estructura a la tabla

Por defecto, todas las columnas tienen el mismo ancho (aprox. 64 píxeles) y todas las filas la misma altura.
Esto rara vez se ajusta a sus datos: un apellido necesita más espacio que una edad,
y una dirección, más que un código postal. Puede ajustar el ancho de las columnas y la altura de las filas
manualmente mediante arrastrar y soltar, o automáticamente haciendo doble clic.

**Métodos de ajuste:**

| Acción | Cómo | Cuándo utilizarla |
|--------|-----|----------------|
| Ajustar automáticamente | Hacer doble clic en el borde de la columna | Cuando la columna debe ajustarse exactamente al contenido más largo |
| Arrastrar manualmente | Arrastrar el borde de la columna | Para especificar un ancho concreto |
| Varias a la vez | Seleccionar columnas y arrastrar el borde | Ancho uniforme para varias columnas |
| Ocultar filas/columnas | Clic con el botón derecho → Ocultar | Ocultar datos que no se necesitan temporalmente |
| Insertar/Eliminar | Clic con el botón derecho → Insertar/eliminar celdas | Crear espacio posteriormente |

 **Consejo:** Con `Ctrl+Barra espaciadora` se selecciona toda la columna; con
`Mayús+Barra espaciadora`, toda la fila. A continuación, con un clic con el botón derecho del ratón, puede
insertar, eliminar u ocultar rápidamente.

**Ejercicio 3.3 — Ajustar el diseño**

La siguiente tabla de ejercicios **Módulo 3.3 Diseño** ya está cargada.

1. Ajusta automáticamente todas las columnas al contenido haciendo doble clic.
2. Oculta la columna C ("Nota interna") y vuelve a mostrarla.
3. Inserta una nueva fila vacía entre las filas 3 y 4.
4. Cambia manualmente la altura de la fila 1 (fila de título) a 30.

## 3.4. Formato condicional

###  Concepto: resaltar valores automáticamente

El formato condicional es como un resaltador automático: usted define reglas
(por ejemplo, "todos los valores superiores a 1000") y Excel aplica el formato a las celdas correspondientes de forma automática.
Lo especial es que, cuando los valores cambian, el formato se adapta inmediatamente, sin
que tenga que volver a aplicarlo.

**Los tipos más importantes de formato condicional:**

| Tipo | Ejemplo | Uso |
|-----|---------|---------|
| Reglas de resaltado | "Mayor que 1000" → rojo | Identificar valores atípicos |
| Reglas de máximo/mínimo | "10 % superior" → verde | Mejores/peores valores |
| Barras de datos | Barra de color dentro de la celda | Visualizar proporciones |
| Escalas de color | Degradado de rojo a amarillo a verde | Efecto de gráfico de temperatura |
| Conjuntos de símbolos | Semáforos, flechas, marcas de verificación | Reconocer el estado al instante |

 **Consejo:** Empieza con una regla sencilla como "Mayor que" y, a continuación, explora
las barras de datos. ¡Estos minigráficos de barras en las celdas son una de las
funciones más impresionantes para los principiantes!

**Ejercicio 3.4 — Aplicar formato condicional**

La siguiente tabla de ejercicios **Módulo 3.4 Formato condicional** ya está cargada.

1. Selecciona las cifras de facturación y aplica "Barras de datos" (Inicio → Formato condicional

   → Barras de datos).
2. Resalte todos los valores superiores a 10 000 € con un relleno rojo.
3. Aplique una escala de colores (verde-blanco-rojo) a la columna de descuentos.
4. Cambie un valor a 15 000 € y observe el ajuste automático.



## Módulo 4: Fórmulas y funciones básicas

**Objetivo de aprendizaje:** Realizar cálculos con fórmulas, comprender las referencias de celdas y utilizar funciones básicas
como SUMA y SI.

## 4.1. Conceptos básicos de las fórmulas

###  Concepto: una fórmula es como una receta de cocina

Una fórmula de Excel es una instrucción que le dice a Excel: "Toma estos ingredientes (valores de celda),
realiza estas operaciones y muéstrame el resultado". Cada fórmula comienza con un
signo de igualdad `=` —esa es la señal para Excel: "¡Ahora viene un cálculo!"

Los operadores matemáticos siguen la regla conocida de la escuela
**"el punto antes de la raya"**:

| Operador | Significado | Ejemplo | Resultado |
|----------|-----------|----------|----------|
| `+` | Suma | `=5+3` | `8` |
| `-` | Resta | `=10-4` | `6` |
| `*` | Multiplicación | `=6*7` | `42` |
| `/` | División | `=100/4` | `25` |
| `^` | Potencia | `=2^10` | `1024` |
| `()` | Paréntesis | `=(2+3)*4` | `20` (¡no 14!) |

 **Importante:** Sin paréntesis, se aplica la regla de "primero lo punto, luego lo raya": `=2+3*4` da como resultado `14`, ya que
`3*4=12` se calcula primero. Con paréntesis: `=(2+3)*4` da como resultado `20`.

**Ejercicio 4.1 — Escribir las primeras fórmulas**

La siguiente tabla de ejercicios **Módulo 4.1 Primeras fórmulas** ya está cargada.

1. En la celda D2, calcula la suma de B2 y C2 con `=B2+C2`.
2. En D3, calcula el producto: `=B3*C3`.
3. En D4: `=(B4+C4)/2` para la media.
4. En D5: `=B5^2` para el cuadrado.
5. Comprueba la diferencia entre `=10+5*2` y `=(10+5)*2`.


**Errores frecuentes en las fórmulas y su significado:**

| Error | Significado | Causa típica |
|--------|-----------|-----------------|
| `#DIV/0!` | División por cero | La fórmula divide entre una celda vacía o 0 |
| `#VALOR!` | Tipo de valor incorrecto | Texto en lugar de un número en un cálculo |
| `#REFERENCIA!` | Referencia no válida | La fórmula hace referencia a una celda eliminada |
| `#NAME?` | Nombre no reconocido | Error tipográfico en el nombre de la función (p. ej., `SUME` en lugar de `SUMME`) |
| `#NV` | No disponible | LABUSCA no encuentra el término de búsqueda |
| `#NULL!` | Operador de rango incorrecto | Espacio en blanco en lugar de dos puntos en el rango |

**Consejo:** Si se produce un error, haz clic en el pequeño
símbolo de exclamación situado junto a la celda. Excel te sugerirá posibles correcciones.

## 4.2. Referencias de celda: relativas, absolutas y mixtas

###  Concepto: la diferencia entre A1, $A$1 y $A1

Cuando copias una fórmula, Excel ajusta automáticamente las referencias. De `=A1+B1` en
la fila 1, al copiar hacia abajo se convierte en `=A2+B2` en la fila 2. A esto se le llama **referencias relativas**
: están activadas por defecto y, en la mayoría de los casos, son exactamente lo que
quieres.

Sin embargo, a veces es necesario que una referencia permanezca *fija* —por ejemplo, un tipo de IVA en
la celda `B1`, que es el mismo para todos los cálculos—. Para ello, utilice el signo de dólar:
`$B$1` siempre seguirá siendo `$B$1`, independientemente de dónde copie la fórmula. Esto es una
**referencia absoluta**.

| Tipo de referencia | Sintaxis | Al copiar | Nota |
|-----------|-------------|---------------|-----------|
| Relativa | `A1` | Se adapta | Sin $ = flexible |
| Absoluta | `$A$1` | Se mantiene fija | $ como "atornillada" |
| Mixta (columna fija) | `$A1` | La columna A se mantiene, la fila se desplaza | $ delante de la letra |
| Mixta (fila fija) | `A$1` | La fila 1 se mantiene, la columna se desplaza | $ delante del número |

 **Consejo:** La tecla `F4` alterna entre los cuatro
tipos de referencia al editar una fórmula: `A1` → `$A$1` → `A$1` → `$A1` → `A1`. ¡Un atajo imprescindible!

**Ejercicio 4.2 — Comprender las referencias de celda**

La siguiente tabla de ejercicios **Módulo 4.2 Referencias de celdas** ya está cargada.

1. Calcula en C2 el precio bruto con `=B2*(1+$F$1)`, donde F1 contiene el tipo de IVA

   (19 %). Copie la fórmula hacia abajo. ¡La referencia a F1 debe ser absoluta!
2. Cree una pequeña tabla de tablas de multiplicar (de 1×1 a 10×10) con referencias mixtas.
3. Pruebe con F4 cómo cambia el tipo de referencia.

## 4.3. Definir y utilizar nombres

### Concepto: referirse a las celdas por su nombre en lugar de por su dirección

En lugar de `=B2*$F$1` (tipo de IVA en F1), puede asignar a la celda F1 un nombre como
`IVA` y escribir: `=B2*IVA`. Esto hace que las fórmulas sean comprensibles de inmediato;
incluso semanas después, seguirá sabiendo qué es lo que se está calculando.

**Definir un nombre:**
1. Seleccione la celda o el rango
2. Haga clic en el **campo de nombre** (a la izquierda de la barra de edición)
3. Introduzca el nombre (p. ej., `IVA`, `Lista de precios`, `Datos`)
4. Pulse Intro

**Reglas para los nombres:**
- Sin espacios (utilice `_` o mayúsculas: `IVA_tipo`)
- Debe comenzar con letras o un guión bajo
- No se pueden utilizar direcciones de celda como nombres (p. ej., no `A1`)
- No se distingue entre mayúsculas y minúsculas

**El Gestor de nombres** se encuentra en `Fórmulas → Gestor de nombres`.
Allí podrá ver, editar y eliminar todos los nombres definidos.

**Consejo:** Los nombres son válidos para todo el libro, no solo para una
hoja de cálculo. Si escribe `=SUMA(Volumen de negocio)`, no es necesario que sepa
en qué hoja se encuentran los datos de volumen de negocio.

**Ejercicio 4.3 — Definir nombres**

> La siguiente hoja de ejercicios **Módulo 4.3 Nombres** ya está cargada.
>
> 1. Defina el nombre `IVA` para la celda que contiene el tipo de IVA.
> 2. En la fórmula del precio bruto, sustituya `$F$1` por `IVA`.
> 3. Defina el nombre `Lista de precios` para toda la tabla de precios.
> 4. Utilice el nombre en una fórmula: `=BUSCARV(A2;Lista de precios;2;0)`.

## 4.4. Funciones estadísticas básicas

###  Concepto: módulos de cálculo predefinidos

Las funciones son fórmulas predefinidas que incluye Excel. En lugar de escribir `=A1+A2+A3+...+A100`,
basta con utilizar `=SUMA(A1:A100)`. Cada función tiene un nombre, seguido
de paréntesis con los argumentos. Las cinco funciones estadísticas más importantes cubren
el 90 % de las necesidades de los principiantes:

| Función | Inglés | Qué hace | Ejemplo |
|----------|----------|---------------|----------|
| `SUMA()` | `SUM()` | Suma todos los valores | `=SUMA(B2:B50)` |
| `MEDIA()` | `AVERAGE()` | Calcula la media | `=MEDIA(C2:C50)` |
| `MIN()` | `MIN()` | Busca el valor más pequeño | `=MIN(D2:D50)` |
| `MAX()` | `MAX()` | Busca el valor más grande | `=MAX(D2:D50)` |
| `ANZAHL()` | `COUNT()` | ¿Cuántos números hay? | `=ANZAHL(E2:E50)` |
| `CONTA2()` | `COUNTA()` | ¿Cuántas celdas no vacías? | `=CONTA2(A2:A50)` |

 **Consejo:** El botón de suma automática (`Alt+=`) de la pestaña "Inicio" inserta
automáticamente `=SUMA()` para el rango seleccionado. ¡Incluso reconoce tus rangos de datos!

**Ejercicio 4.3 — Aplicar funciones estadísticas**

La siguiente tabla de ejercicios **Módulo 4.3 Estadística** ya está cargada.

1. Calcula con `SUMA` el total de las ventas.
2. Calcula la `MEDIA`, el pedido más pequeño (`MÍN`) y el más grande (`MÁX`).
3. Cuenta con `CONTAE` el número de entradas de ventas.
4. Con la función `CONTAE2`, cuenta todas las celdas no vacías de la columna A (nombres de clientes).
5. Prueba el botón de Autosuma: haz clic debajo de una columna de números y

   luego en "Suma".

## 4.5. La función SI

###  Concepto: automatizar decisiones

La función SI es la más básica de todas las funciones lógicas. Permite a Excel
tomar decisiones: "SI esta condición es verdadera, ENTONCES haz esto; SI NO, haz aquello".
Es como una regla "si... entonces" automatizada y constituye la base de cualquier
automatización inteligente.

**Sintaxis:** `=SI(condición; valor_si; valor_si_no)`

| Operador de comparación | Significado | Ejemplo |
|-------------------|-----------|----------|
| `>` | Mayor que | `A1>100` |
| `<` | Menor que | `B2<0` |
| `>=` | Mayor o igual que | `C3>=50` |
| `<=` | Menor o igual que | `D4<=18` |
| `=` | Igual a | `E5="Sí"` |
| `<>` | Diferente de | `F6<>0` |

 **Consejo:** En una función SI, la parte "si no" puede ser a su vez otra
función SI; esto se denomina "función SI anidada". A partir de Excel 2019 existe
la función `SIJS()`, que resulta más sencilla.

**Ejercicio 4.4 — Utilizar la función SI**

La siguiente tabla de ejercicios **Módulo 4 4 SI** ya está cargada.

1. Escribe en D2: `=SI(C2>1000; "Pedido grande"; "Estándar")` y copia

   la fórmula hacia abajo.
2. En E2: `=SI(C2>5000; C2*0,1; 0)` para un 10 % de bonificación a partir de 5.000 €.
3. En F2: `=SI(Y(B2="Norte"; C2>2000); "Prioridad"; "")` — combina

   SI con Y para dos condiciones.



## Módulo 5: Limpieza y validación de datos

**Objetivo de aprendizaje:** garantizar la calidad de los datos mediante la validación y limpiar de forma profesional
los datos importados.

## 5.1. Validación de datos

###  Concepto: el principio GIGO — Garbage In, Garbage Out

En el procesamiento de datos se aplica una ley inquebrantable: **una entrada errónea conduce a resultados erróneos
**, por muy perfectas que sean tus fórmulas. Si alguien escribe "abcd" en un campo numérico
o "999" en lugar de "9,99" como precio, todos los cálculos basados en ello
serán erróneos. La **validación de datos** es tu escudo protector: establece, antes incluso de que se introduzcan los datos,
qué valores están permitidos —y bloquea todo lo demás—.

**Los tipos de validación más importantes:**

| Tipo de validación | Ejemplo | Impide |
|----------------|---------|------------|
| Lista desplegable | `=Categorías!A1:A10` | Introducción de texto libre, solo selección |
| Número entero | entre 1 y 100 | Números decimales, texto, valores demasiado grandes |
| Número decimal | entre 0 y 1 | Valores negativos, valores > 1 |
| Fecha | entre el 01/01/2026 y el 31/12/2026 | Fechas no válidas |
| Longitud del texto | máximo 50 caracteres | Entradas demasiado largas |
| Definida por el usuario | `=Y(A1>0; A1<1000)` | Todo lo que no se ajuste a la lógica de la fórmula |

 **Consejo:** Utilice el "Mensaje de entrada" y el "Mensaje de error" en la
configuración de validación. El mensaje de entrada aparece como una indicación amable al
hacer clic en la celda, mientras que el mensaje de error aparece como una señal de stop cuando se introduce un dato incorrecto.

**Ejercicio 5.1 — Configurar la validación de datos**

La siguiente tabla de ejercicios **Módulo 5.1 Validación** ya está cargada.

1. Crea una lista desplegable en la columna B ("Departamento") con las opciones:

   "Ventas", "Marketing", "TI", "Recursos Humanos", "Finanzas".
2. Limite la columna C ("Salario") a números enteros comprendidos entre 30 000 y 120 000.
3. Añada un mensaje de entrada: "Seleccione un departamento, por favor".
4. Añada un mensaje de error en caso de que el salario no sea válido.

## 5.2. Herramientas para la limpieza de datos

###  Concepto: limpiar como después de una fiesta

Los datos rara vez llegan en perfectas condiciones, sobre todo cuando proceden de otros sistemas. Los nombres
a veces están en mayúsculas y otras en minúsculas, las fechas siguen diferentes
formatos y los duplicados distorsionan cualquier estadística. Excel ofrece tres potentes herramientas
para poner orden en ese caos de datos:

| Herramienta | Qué hace | Uso típico |
|----------|-----------|-------------------|
| **Eliminar duplicados** | Busca y elimina filas idénticas | Pedidos, clientes o entradas duplicadas |
| **Texto en columnas** | Dividir una columna de texto en función de separadores | "Müller, Berlín" → columna A, columna B |
| **Relleno rápido** (Flash Fill) | Reconocer un patrón y continuarlo automáticamente | A partir de "Max Müller" → extraer nombre + apellidos |

 **Consejo:** El Relleno rápido (`Ctrl+E`) es mágico para los principiantes: escribe
en la celda contigua el patrón deseado (por ejemplo, solo el nombre), pulsa
`Ctrl+E` y ¡Excel se encarga del resto!

**Ejercicio 5.2 — Limpiar datos**

La siguiente tabla de ejercicios **Módulo 5.2 Limpiar** ya está cargada.

1. Elimina todas las entradas duplicadas con "Datos → Eliminar duplicados".
2. Divide la columna "Apellidos, nombre" en dos columnas con "Texto en columnas".
3. Prueba el relleno rápido: extrae las iniciales de

   una lista de nombres.

## 5.3. Consolidación de datos

###  Concepto: una única verdad a partir de muchas fuentes

Cuando los datos están dispersos en varias hojas de cálculo (p. ej., "Enero", "Febrero", "Marzo")
, a menudo se desea ver un resumen en una sola hoja: una visión general anual.
La **consolidación** agrupa datos de varios rangos por categorías y les aplica
una función (normalmente SUMA).

 **Consejo:** Antes de consolidar, asegúrate de que todos los rangos de origen
tengan la misma estructura: los mismos nombres de categorías en el mismo orden.

**Ejercicio 5.3 — Consolidar datos**

La siguiente tabla de ejercicios **Módulo 5.3 Consolidación** ya está cargada.

1. Utilice "Datos → Consolidar" para agrupar las tres hojas mensuales en un

   resumen anual.
2. Vincula los valores consolidados con los datos de origen, de modo que los cambios

   se apliquen automáticamente.

## 5.4. Importación de datos desde fuentes externas

###  Concepto: el puente con el mundo exterior

No todos los datos se generan en Excel. A menudo se reciben archivos `.csv` o `.txt` procedentes de
otros programas (contabilidad, gestión de existencias, tiendas online). Excel puede abrirlos
o importarlos directamente, con la ventaja de que ya durante la importación se pueden definir los separadores,
el formato de fecha y la codificación.

| Formato de importación | Fuente típica | Característica |
|-------------|-----------------|--------------|
| `.csv` (separado por comas) | Tiendas online, exportación de bases de datos | Intercambio más sencillo |
| `.txt` (texto con separador) | Sistemas antiguos, archivos de registro | Separador flexible |
| De la web | Páginas web con tablas | Los datos se mantienen actualizados (actualizables) |

 **Importante:** Al importar archivos CSV, asegúrese de utilizar el separador correcto (coma o
punto y coma, según la configuración regional) y la codificación adecuada (UTF-8 para las diéresis).

**Ejercicio 5.4 — Importar datos**

La siguiente tabla de ejercicios **Módulo 5_4 Importación** ya está cargada.

1. Importe un archivo `.csv` facilitado a través de "Datos → Desde texto/CSV".
2. Compruebe la vista previa y ajuste el separador y la codificación.
3. Cargue los datos en una nueva hoja de cálculo y actualice la conexión.



## Módulo 6: Hojas de cálculo y filtros

**Objetivo de aprendizaje:** Ordenar, filtrar y organizar datos de forma profesional en hojas de cálculo de Excel.

## 6.1. Buscar y sustituir

### Concepto: No desplazarse manualmente por las filas

En tablas grandes, resulta tedioso encontrar un valor concreto —
o incluso modificar todas las apariciones de un término. La función de búsqueda
lo hace en segundos.

| Acción | Atajo de teclado | Uso |
|--------|-------------|------------|
| **Buscar** | `Ctrl+F` | Buscar un término en la hoja |
| **Reemplazar** | `Ctrl+H` | Buscar un término y sustituirlo por otro |
| **Buscar siguiente** | `Mayús+F4` | Buscar la siguiente coincidencia sin cuadro de diálogo |

**Consejo:** En el cuadro de diálogo "Reemplazar", puede utilizar "Opciones" para limitar la búsqueda
: solo en la hoja actual, solo en celdas completas o
distinguiendo entre mayúsculas y minúsculas.

**Ejercicio 6.1 — Buscar y sustituir**

> La siguiente tabla de ejercicios **Módulo 6.1 Buscar y sustituir** ya está cargada.
>
> 1. Busque con `Ctrl+F` todas las apariciones de "Múnich".
> 2. Sustituya con `Ctrl+H` todas las apariciones de "Múnich" por "Múnich (sede central)".
> 3. Busque "500" con la opción "Contenido completo de la celda" y observe
>    la diferencia con respecto a la búsqueda sin esta opción.

## 6.2. Congelar la ventana

### Concepto: mantener siempre a la vista los encabezados

Cuando se desplaza hacia abajo en una tabla grande, la
línea de encabezado desaparece de la pantalla; solo ve números, sin saber qué
significan. La función **Congelar ventana** fija filas o columnas para que
permanezcan visibles al desplazarse.

| Acción | Ruta del menú | Efecto |
|--------|----------|--------|
| **Fijar la fila superior** | Ver → Congelar ventana → Fijar la fila superior | La fila 1 permanece siempre visible |
| **Fijar la primera columna** | Ver → Congelar ventana → Fijar la primera columna | La columna A permanece siempre visible |
| **Fijar cualquier área** | Seleccionar una celda situada debajo o a la derecha del área que se desea fijar → Congelar ventana | Se fijan filas y columnas |

**Consejo:** En tablas con fila de encabezado Y columna de etiquetas a la izquierda:
Seleccione la celda B2 y elija "Congelar ventana".
De este modo, tanto la fila 1 como la columna A permanecerán congeladas.

**Ejercicio 6.2 — Congelar ventanas**

> La siguiente tabla de ejercicios **Módulo 6.2: Congelar ventanas** ya está cargada.
>
> 1. Congele la fila superior y desplácese hacia abajo.
> 2. Desactive la congelación (Ver → Congelar ventanas → Descongelar).
> 3. Congele la fila 1 Y la columna A al mismo tiempo.
> 4. Desplácese en diagonal y observe qué permanece congelado.

## 6.3. Ordenar datos

###  Concepto: el orden como base del análisis

Ordenar es más que un orden alfabético: es el primer paso de cualquier análisis de datos.
Una lista ordenada muestra de inmediato las ventas más altas, los pedidos más recientes o los
empleados más productivos. Excel puede ordenar **en varios niveles**: primero por región y, a continuación,
dentro de cada región por volumen de ventas, y todo ello con un solo clic.

**Resumen de las opciones de ordenación:**

| Tipo de ordenación | Ejemplo | Uso |
|-----------|---------|---------|
| Simple (A→Z) | Nombres por orden alfabético | Listas de direcciones, catálogos de productos |
| Simple (Z→A) | Mayor volumen de ventas primero | Clasificaciones, top 10 |
| Por niveles | 1. Región, 2. Volumen de ventas | Análisis comparativo agrupado |
| Por color | Celdas con formato rojo arriba | Dar prioridad a los valores atípicos |

 **Consejo:** Seleccione **una** celda dentro de su tabla de datos; Excel detectará
automáticamente todo el rango contiguo para ordenarlo. ¡No es necesario seleccionarlo todo
manualmente!

**Ejercicio 6.1 — Practicar la ordenación**

La siguiente tabla de ejercicios **Módulo 6.1 Ordenar** ya está cargada.

1. Ordena la tabla de clientes alfabéticamente por apellido (A→Z).
2. Ordena por valor del pedido en orden descendente (el más alto primero).
3. Realiza una ordenación en varios niveles: primero por país, luego por

   valor del pedido dentro de cada país.

## 6.4. Filtrar datos

###  Concepto: centrar la atención en los datos relevantes

Un filtro oculta todas las filas que *no* cumplen un criterio determinado, como
un motor de búsqueda dentro de su tabla. A diferencia de la ordenación, los datos
permanecen en su orden original, y las filas ocultas no se eliminan,
sino que solo quedan temporalmente invisibles.

| Tipo de filtro | Qué se puede filtrar |
|-----------|----------------------|
| Filtro de texto | Contiene, empieza por, termina por... |
| Filtro numérico | Mayor que, entre, Top 10... |
| Filtro de fecha | Hoy, esta semana, este trimestre... |
| Por color | Todas las celdas con relleno amarillo |

 **Consejo:** El icono de filtro (embudo) en el encabezado de la columna indica que
hay un filtro activo. Se pueden aplicar varios filtros a la vez, lo cual es fundamental
para trabajar con grandes volúmenes de datos.

**Ejercicio 6.2 — Aplicar filtros**

La siguiente tabla de ejercicios **Módulo 6.2 Filtros** ya está cargada.

1. Active el filtro automático (`Ctrl+Mayús+L`).
2. Filtre solo los pedidos procedentes de "Berlín".
3. Filtre los pedidos con un importe superior a 500 €.
4. Combine ambos filtros y cuente las filas visibles.

## 6.5. Hojas de cálculo de Excel (Ctrl+T)

###  Concepto: de un rango sencillo a una tabla inteligente

Un rango de celdas normal (`A1:D100`) es un conjunto disperso de celdas. Una **tabla de Excel**
(`Ctrl+T`), en cambio, es una estructura de datos inteligente con claras ventajas:

| Característica | Rango normal | Tabla de Excel (Ctrl+T) |
|------------|-----------------|----------------------|
| Formato | Manual, estático | Automático, colores de fila cambiantes |
| Nuevas filas | Formateadas manualmente | El formato se aplica automáticamente |
| Fórmulas | Se copian una a una | Se aplican automáticamente a todas las filas |
| Filtros | Deben configurarse manualmente | Están automáticamente en el encabezado |
| Referencias | `=B2*C2` | `=[@Precio]*[@Cantidad]` (referencias estructuradas) |
| Gráficos/tablas dinámicas | Se deben ajustar manualmente con los nuevos datos | Se amplían automáticamente |

 **Consejo:** Las referencias estructuradas como `=[@Volumen de negocio]` en lugar de `=D2` hacen que las fórmulas
sean más legibles y robustas. Se ve al instante qué se está calculando, incluso semanas después.

**Ejercicio 6.3 — Utilizar hojas de cálculo de Excel**

La siguiente hoja de ejercicios **Módulo 6.3 Hojas de cálculo** ya está cargada.

1. Convierte el rango de datos en una tabla de Excel con `Ctrl+T`.
2. Elige un formato de tabla con colores de fila alternos.
3. Añade una nueva fila y observa el formato automático.
4. Utiliza una referencia estructurada: `=[@Cantidad]*[@Precio]` en la columna "Suma".

## 6.6. Resultados parciales y estructura

###  Concepto: resúmenes con solo pulsar un botón

Imagina una tabla de ventas con 5.000 filas, ordenada por región y
producto. La función **Resultados parciales** inserta automáticamente filas de sumas, medias o
recuentos después de cada cambio de grupo, y crea una estructura que
te permite alternar entre la vista detallada y la vista general.

 **Consejo:** Antes de utilizar los subtotales, **es imprescindible** que los datos estén ordenados según el
criterio de agrupación; de lo contrario, obtendrá subtotales sin sentido.

**Ejercicio 6.4 — Calcular subtotales**

La siguiente tabla de ejercicios **Módulo 6.4 Resultados parciales** ya está cargada.

1. Ordena primero la tabla por "Región".
2. Añade totales automáticos para cada región mediante "Datos → Subtotal".
3. Utiliza los símbolos de expansión (1, 2, 3 en el margen izquierdo) para alternar entre

   la vista detallada y la vista general.



## Módulo 7: Funciones avanzadas

**Objetivo de aprendizaje:** Dominar los cálculos condicionales, las funciones de búsqueda y el procesamiento de texto.

## 7.1. Funciones matemáticas condicionales

###  Concepto: realizar cálculos solo bajo determinadas condiciones

Mientras que `SUMA()` suma todo, `SUMA.SI()` solo suma los valores que cumplen una condición
. El concepto es sencillo: "Suma todas las ventas, PERO SOLO de la región Norte".
Esta es la estructura de casi todas las funciones: `=NOMBRE(Argumento1; Argumento2; ...)` con
un punto y coma como separador.

**La familia de funciones condicionales:**

| Función | Estructura | Ejemplo |
|----------|--------|----------|
| `SUMA.SI()` | Rango, criterio, [rango de suma] | `=SUMA.SI(A:A;"Norte";C:C)` |
| `SUMA.SI.OTRA()` | Rango de suma, Rango1, Criterio1, ... | `=SUMA.SI.OTRA(C:C;A:A;"Norte";B:B;"Q1")` |
| `CONTAR.SI()` | Rango, criterio | `=CONTAR.SI(C:C;">1000")` |
| `CONTAR.SI.SI()` | Rango1, criterio1, rango2, criterio2... | `=CONTAR.SI(A:A;"Norte";C:C;">1000")` |
| `MEDIA.SI()` | Rango, criterio, [rango de la media] | `=MEDIA.SI(A:A;"Sur";C:C)` |

 **Consejo:** `SUMA.SI` para UNA condición, `SUMA.SI.CONDICIONES` para VARIAS condiciones.
Fíjate en el orden diferente de los argumentos: en `SI`, el
rango de suma va primero.

**Ejercicio 7.1 — Sumas y recuentos condicionales**

La siguiente tabla de ejercicios **Módulo 7.1 Sumas condicionales** ya está cargada.

1. Calcula con `SUMA.SI` la facturación total de la región "Norte".
2. Calcula con `SUMA.SI.SI` la facturación de "Norte" Y del producto "Portátil".
3. Cuenta con `CONTA.SI` todos los pedidos superiores a 1.000 €.
4. Con la función `CONTABLE.SI`, cuente los pedidos grandes (> 1.000 €) en la región "Sur".

## 7.2. La función BUSCARV

###  Concepto: como una guía telefónica: buscar y encontrar

VLOOKUP (búsqueda vertical) busca un valor en la columna de la izquierda de una tabla y
devuelve el valor de otra columna de la misma fila. Como en una guía telefónica:
buscas un nombre (columna de la izquierda) y lees el número de teléfono (columna de la derecha).
La "S" significa "vertical": la búsqueda se realiza de arriba abajo.

**Sintaxis:** `=VLOOKUP(criterio_búsqueda; matriz_búsqueda; índice_columna; referencia_rango)`

| Argumento | Significado | Ejemplo |
|----------|-----------|----------|
| Criterio de búsqueda | ¿Qué buscas? | `"Portátil"` o `A2` |
| Matriz de búsqueda | ¿Dónde buscas? | `Productos!A:D` |
| Índice de columna | ¿Qué columna se debe devolver? | `2` (para la columna B) |
| Referencia_al_rango | ¿Coincidencia exacta (0) o aproximada (1)? | `0` = exacta |

 **Importante:** LAVERSO busca **siempre en la primera columna** de la matriz de búsqueda, nunca
en el centro ni al final. Si su término de búsqueda se encuentra a la derecha, necesitará
ÍNDICE+COMPARAR o BUSCARV.

**Importante:** Si `referencia_rango=1` (coincidencia aproximada), la
columna de búsqueda **debe** estar **ordenada de menor a mayor**; de lo contrario, BUSCARV devolverá resultados
erróneos. Si `referencia_rango=0` (coincidencia exacta), no es necesario
ordenarla.

**Ejercicio 7.2 — Aplicar la función BUSCARV**

La siguiente tabla de ejercicios **Módulo 7.2 BUSCARV** ya está cargada.

1. Utilice la función BUSCARV para encontrar el nombre del producto correspondiente a un ID de producto

   una lista de precios (coincidencia exacta).
2. Busca la calificación correspondiente ("muy bien", "bien"...) a partir de una puntuación, utilizando

   una coincidencia aproximada.
3. Comprueba qué ocurre si el término de búsqueda no existe (error #NV).

## 7.3. ÍNDICE y COMPARAR

###  Concepto: la alternativa flexible a BUSCARV

ÍNDICE + COMPARAR es la combinación más potente: ÍNDICE devuelve el valor en una posición determinada
de un rango, mientras que COMPARAR encuentra la posición de un término de búsqueda. Juntas
pueden buscar en cualquier dirección, no solo de izquierda a derecha como VLOOKUP.

```
=ÍNDICE(rango; número de fila; [número de columna])
=COMPARAR(criterio de búsqueda; rango de búsqueda; [tipo de comparación])
     → devuelve la POSICIÓN (número de fila), no el valor

Combinado: =ÍNDICE(columna de resultados; BUSCAR.VALOR(término de búsqueda; columna de búsqueda; 0))
```

 **Consejo:** ÍNDICE + COMPARAR busca en cualquier dirección (también de derecha a izquierda), es
más rápido con tablas grandes y no falla si se insertan columnas.
Para los usuarios de Excel 365, XVERWEIS (`XLOOKUP`) es la alternativa más sencilla.

**Ejercicio 7.3 — Combinar ÍNDICE y COMPARAR**

La siguiente tabla de ejercicios **Módulo 7.3 ÍNDICE COMPARAR** ya está cargada.

1. Utiliza ÍNDICE + COMPARAR para hallar el precio de un producto, teniendo en cuenta que la

   columna del producto se encuentra a la derecha del precio (algo que VLOOKUP no puede hacer).
2. Crea una búsqueda bidireccional: producto (fila) × mes (columna).
3. Compara la fórmula con la variante de VLOOKUP del ejercicio anterior.

## 7.4. Funciones de texto y fecha

###  Concepto: no solo mostrar textos, sino también editarlos

Excel puede hacer mucho más que simplemente almacenar texto: puede descomponerlo, recomponerlo,
limpiarlo y transformarlo. Esto resulta especialmente útil cuando los datos proceden de sistemas externos
y es necesario convertir "Dr. Max Müller, MBA" en "Müller, Max".

**Las funciones de texto más importantes:**

| Función | Efecto | Ejemplo | Resultado |
|----------|---------|----------|----------|
| `IZQUIERDA(texto; n)` | Primeros n caracteres | `=IZQUIERDA("Excel";2)` | `Ex` |
| `DERECHA(texto; n)` | Los últimos n caracteres | `=DERECHA("Excel";2)` | `el` |
| `PARTE(texto; inicio; n)` | n caracteres a partir de la posición | `=PARTE("Excel";2;3)` | `xce` |
| `LONGITUD(texto)` | Número de caracteres | `=LONGITUD("Excel")` | `5` |
| `SUAVIZAR(texto)` | Elimina los espacios en blanco innecesarios | `=SUAVIZAR("  Hola  ")` | `Hola` |
| `MAYÚSCULAS2(texto)` | Primera letra de cada palabra en mayúscula | `=MAYÚSCULAS2("max mustermann")` | `Max Mustermann` |
| `MAYÚSCULAS(texto)` | Todo en mayúsculas | `=MAYÚSCULAS("excel")` | `EXCEL` |
| `MINÚSCULAS(texto)` | Todo en minúsculas | `=MINÚSCULAS("EXCEL")` | `excel` |
| `CONCATENAR()` / `&` | Unir textos | `=A2&" "&B2` | `Max Müller` |

 **Consejo:** Con `HOY()` siempre obtendrás la fecha actual, ideal para
calcular edades o controlar plazos: `=AÑOS(HOY())-AÑOS(fecha de nacimiento)`.

**Ejercicio 7.4 — Aplicar funciones de texto y fecha**

La siguiente tabla de ejercicios **Módulo 7.4 Texto y fecha** ya está cargada.

1. Extrae el apellido de una columna "Apellido, nombre" con

   `IZQUIERDA()` y `BUSCAR()`.
2. Elimina los espacios superfluos del texto importado con `ALISAR()`.
3. Combina el nombre y los apellidos de dos columnas con `&` en una sola columna.
4. Calcula la edad de las personas a partir de la fecha de nacimiento con `HOY()`.



## Módulo 8: Gráficos y visualización

**Objetivo de aprendizaje:** Elegir el tipo de gráfico adecuado, crear gráficos profesionales y
darles formato.

## 8.1. ¿Qué gráfico para qué datos?

###  Concepto: la comunicación visual como lenguaje

Un gráfico traduce los números en imágenes, y el cerebro humano procesa las imágenes
60 000 veces más rápido que el texto. Pero no todos los gráficos son adecuados para todos los tipos de datos. El
arte reside en la **elección correcta**: un gráfico circular para 50 puntos de datos no tiene sentido,
al igual que un gráfico de líneas para nombres de productos. Aquí tienes tu guía de selección:

| Tipo de datos | Gráfico recomendado | Ejemplo |
|----------|---------------------|----------|
| Comparación de valores | **Gráfico de columnas** | Facturación por región |
| Evolución temporal | **Gráfico de líneas** | Cotización bursátil a lo largo de 12 meses |
| Proporciones de un todo | **Gráfico circular** | Cuotas de mercado (¡máx. 5-7 segmentos!) |
| Clasificación | **Gráfico de barras** | Los 10 productos más vendidos |
| Relación entre dos variables | **Gráfico de puntos (XY)** | Gasto publicitario frente a facturación |
| Distribución de frecuencias | **Histograma** | Distribución por edades de los clientes |

 **Importante:** Un diagrama circular nunca debe tener más de 5-7 segmentos; de lo contrario,
resultará ilegible. Agrupe las proporciones pequeñas en "Otros".

**Ejercicio 8.1 — Tu primer gráfico**

La siguiente tabla de ejercicios **Módulo 8.1 Primeros gráficos** ya está cargada.

1. Seleccione la tabla de ventas (productos + valores) y cree un

   gráfico de columnas mediante "Insertar → Gráfico de columnas".
2. Crea un gráfico circular a partir de los mismos datos. ¿Cuál es

   más revelador y por qué?
3. Crea un gráfico de líneas a partir de las cifras de facturación mensuales.

## 8.2. Dar formato a los elementos de los gráficos

###  Concepto: del gráfico estándar al informe profesional

El gráfico predeterminado de Excel es funcional, pero rara vez está listo para una presentación. Solo mediante
una personalización específica un gráfico se convierte en una herramienta de comunicación: un título significativo,
etiquetas correctas en los ejes, etiquetas de datos adecuadas y una leyenda que explique
sin confundir.

**Los elementos de un gráfico:**

| Elemento | Finalidad | Recomendación |
|---------|-------|------------|
| Título del gráfico | ¿Qué muestra el gráfico? | Incluirlo siempre, describirlo con precisión |
| Título de los ejes | ¿Qué significan los ejes X e Y? | Indícalo si las unidades son desconocidas |
| Leyenda | ¿Qué color corresponde a cada serie de datos? | Imprescindible si hay varias series de datos |
| Etiquetas de datos | Cifras concretas directamente en el punto | Útil en presentaciones |
| Líneas de cuadrícula | Orientación en el eje Y | Color discreto, no demasiadas |

 **Consejo:** Con el símbolo más (+) situado a la derecha de un gráfico seleccionado,
puedes mostrar u ocultar todos los elementos del gráfico con un solo clic. Es la forma más rápida
de personalizarlo.

**Ejercicio 8.2 — Dar formato a un gráfico**

La siguiente tabla de ejercicios **Módulo 8.2 Formato de gráficos** ya está cargada.

1. Añada un título significativo al gráfico ("Volumen de negocio trimestral 2026").
2. Etiquete los ejes ("Trimestre" y "Volumen de negocio en €").
3. Añada etiquetas de datos a las columnas.
4. Cambie los colores de las columnas utilizando una paleta de colores profesional.

## 8.3. Gráficos combinados y especiales

###  Concepto: dos escalas de datos en un gráfico

A veces se quiere representar el volumen de negocio (en miles de euros) y la tasa de crecimiento (en porcentaje) en un
gráfico, pero los rangos de valores son muy dispares. Un
**gráfico combinado** (gráfico mixto) con **eje secundario** resuelve este problema:
columnas para el volumen de negocio en el eje izquierdo y una línea para la tasa de crecimiento en
el derecho.

 **Consejo:** Un gráfico combinado resulta ideal para comparaciones entre valores previstos y reales,
como presupuesto frente a gastos reales o facturación frente a margen de beneficio.

**Ejercicio 8.3 — Crear un gráfico combinado**

La siguiente tabla de ejercicios **Módulo 8.3 Gráfico combinado** ya está cargada.

1. Crea un gráfico combinado: volumen de negocio en columnas y tasa de crecimiento en línea.
2. Añade un eje secundario para la tasa de crecimiento.
3. Aplica el formato adecuado a ambos ejes con las unidades correspondientes (€ y %).

## 8.4. Conceptos básicos de los paneles de control

###  Concepto: todas las métricas importantes de un vistazo

Un panel de control es una página de resumen que reúne varios gráficos, indicadores y tablas
en una sola pantalla, como el salpicadero de un coche. Toda la información importante
se puede ver de un vistazo, sin que el usuario tenga que
cambiar de hoja de cálculo.

**Los componentes de un panel de control sencillo:**

| Elemento | Función | Ejemplo |
|---------|----------|----------|
| Tarjetas de KPI | Mostrar un indicador concreto en grande | "Facturación total: 1,2 millones de €" |
| Gráfico de tendencias | Mostrar la evolución a lo largo del tiempo | Gráfico de líneas de los últimos 12 meses |
| Gráfico comparativo | Comparar categorías | Gráfico de barras por región |
| Gráfico de porcentajes | Mostrar la composición | Gráfico circular por grupo de productos |

**Ejercicio 8.4 — Crear un panel de control sencillo**

La siguiente tabla de ejercicios **Módulo 8.4: Panel de control** ya está cargada.

1. En una hoja nueva, crea tres gráficos a partir de los datos de origen:

   un gráfico de barras (por región), un gráfico de líneas (por mes) y

   un gráfico circular (por categoría de producto).
2. Organice los gráficos de forma clara en la hoja.
3. Añada un texto explicativo encima de cada gráfico.



## Módulo 9: Tablas dinámicas

**Objetivo de aprendizaje:** Agrupar, resumir y analizar grandes volúmenes de datos con tablas dinámicas

**Nota sobre la plataforma Excel-lenz:** La creación de tablas dinámicas no está
disponible en el simulador web. Los siguientes ejercicios requieren Microsoft
Excel. En la plataforma hay preguntas de cuestionario sobre conceptos de tablas dinámicas
disponibles.

analizar.

## 9.1. ¿Qué es una tabla dinámica?

###  Concepto: girar y voltear los datos como si fuera un cubo de Rubik

Una tabla dinámica es una de las herramientas más revolucionarias de Excel. Imagínese
que tiene 10 000 registros de ventas y quiere saber: "¿Cuál fue el volumen de negocio por
región y por trimestre?". Una tabla dinámica responde a esta pregunta en segundos, y usted
puede cambiar la perspectiva ("girar") en cualquier momento sin tener que escribir ni una sola fórmula
.

El principio básico es sencillo: **agrupar y resumir**. Solo tienes que arrastrar los campos a
cuatro áreas y Excel se encarga del resto: sin fórmulas, sin ordenar manualmente.

**Las cuatro áreas de una tabla dinámica:**

| Área | Función | Ejemplo |
|---------|----------|----------|
| **Filas** | ¿Qué aparece a la izquierda de la tabla? | Región, producto, mes |
| **Columnas** | ¿Qué aparece en la parte superior de la tabla? | Trimestre, año, categoría |
| **Valores** | ¿Qué se debe calcular? | Suma de la facturación, número de pedidos |
| **Filtro** | ¿Qué datos se deben excluir? | Solo el año 2026, solo la región Norte |

 **Consejo:** Puedes mover campos entre las áreas en cualquier momento; la
tabla se actualiza al instante. ¡Experimenta! No hay nada "incorrecto" a la hora de
explorar datos con tablas dinámicas.

**Ejercicio 9.1 — Primera tabla dinámica**

La siguiente tabla de ejercicios **Módulo 9 1 Pivot** ya está cargada.

1. Selecciona una celda de la tabla de datos y elige

   "Insertar → Tabla dinámica".
2. Arrastra "Región" al área de filas y "Volumen de negocio" al área de valores.
3. Observa cómo Excel calcula automáticamente la suma por región.

## 9.2. Personalizar la tabla dinámica

###  Concepto: No solo SUMA — diversos resúmenes

Por defecto, una tabla dinámica muestra la **suma** de los valores numéricos. Pero puede
cambiar la función de resumen en cualquier momento: media, recuento, máximo, mínimo,
porcentaje... e incluso "diferencia respecto al año anterior" o "% del resultado total".
Esto convierte a la tabla dinámica en una herramienta de análisis flexible.

**Funciones de resumen disponibles:**

| Función | Pregunta a la que responde |
|----------|---------------------------|
| Suma | ¿A cuánto asciende el total? |
| Recuento | ¿Cuántas entradas hay? |
| Media | ¿Cuál es la media? |
| Máximo / Mínimo | ¿Cuál es el valor más alto / más bajo? |
| % del resultado total | ¿Qué porcentaje representa este valor? |
| Diferencia respecto al mes anterior | ¿Cómo ha variado el valor? |

**Ejercicio 9.2 — Personalizar una tabla dinámica**

La siguiente tabla de ejercicios **Módulo 9.2: Personalización de la tabla dinámica** ya está cargada.

1. Cambia el resumen de "Suma" a "Media".
2. Agrupa las fechas por meses y trimestres

   (clic con el botón derecho → Agrupar).
3. Muestra los valores como "% del resultado total".
4. Añade un campo calculado: "Bonificación" = Facturación × 5 %.

## 9.3. Filtrar con segmentadores

###  Concepto: filtros visuales para tablas dinámicas

Los segmentadores son botones interactivos que permiten filtrar tablas dinámicas, pero
de una forma mucho más elegante que los filtros desplegables convencionales. Al hacer clic en "Norte" en el segmentador,
todas las tablas dinámicas y gráficos vinculados mostrarán únicamente los datos de esa región.
Esto convierte a los segmentadores en la herramienta perfecta para paneles de control y presentaciones.

 **Consejo:** Un filtro se puede vincular a varias tablas dinámicas a la vez
(clic con el botón derecho → Vínculos de informe). De este modo, puedes controlar todo un panel de control
con un solo clic.

**Ejercicio 9.3 — Uso de los segmentadores**

La siguiente tabla de ejercicios **Módulo 9.3 Filtros** ya está cargada.

1. Inserta un filtro para el campo "Región"

   (Análisis de tabla dinámica → Insertar filtro).
2. Filtra con el filtro una región concreta.
3. Añade un segundo filtro para "Categoría de producto" y combina

   ambos filtros.

## 9.4. Gráficos dinámicos

###  Concepto: gráficos vinculados a la tabla dinámica

Un gráfico dinámico es un gráfico que está directamente vinculado a una tabla dinámica.
Si modificas la tabla dinámica (cambio de agrupación, cambio de filtro),
el gráfico se adapta automáticamente. Es la combinación perfecta entre análisis
(tabla dinámica) y presentación (gráfico).

**Ejercicio 9.4 — Crear un gráfico dinámico**

La siguiente tabla de ejercicios **Módulo 9.4 Gráfico dinámico** ya está cargada.

1. Crea un gráfico dinámico a partir de tu tabla dinámica

   (Análisis de tabla dinámica → Gráfico dinámico).
2. Seleccione un tipo de gráfico adecuado.
3. Pruebe la interactividad: modifique la tabla dinámica y observe

   cómo se adapta el gráfico.



## Módulo 10: Análisis y funciones financieras

**Objetivo de aprendizaje:** Realizar análisis de "qué pasaría si" y utilizar funciones financieras básicas
.

## 10.1. Búsqueda de objetivo (Goal Seek)

###  Concepto: calcular a la inversa, del resultado a la causa

Normalmente, se introducen valores y Excel calcula el resultado (p. ej., cantidad × precio =
volumen de negocio). La función **Búsqueda de objetivo** hace lo contrario: usted dice "Quiero alcanzar un volumen de negocio de 100 000 €",
y Excel calcula el precio o la cantidad necesarios. Esto resulta
especialmente útil para la planificación y la elaboración de presupuestos.

 **Consejo:** La función "Búsqueda de valor objetivo" se encuentra en "Datos → Análisis hipotético →
Búsqueda de valor objetivo". Necesitas tres datos: la celda de destino (con fórmula), el valor objetivo y
la celda variable.

**Ejercicio 10.1 — Aplicar la búsqueda de valor objetivo**

La siguiente hoja de ejercicios **Módulo 10.1 Búsqueda de valor objetivo** ya está cargada.

1. Desea alcanzar una facturación total de 100 000 €. Utilice la

   búsqueda de valor objetivo para determinar el precio unitario necesario.
2. Un crédito de 200 000 € debe tener una cuota mensual de 1 500 €.

   ¿Cuál es el tipo de interés máximo admisible para ello?

## 10.2. Funciones financieras

###  Concepto: el valor temporal del dinero — simplificado

El dinero de hoy vale más que el dinero de mañana. ¿Por qué? Porque hoy puede invertir el dinero y
este se multiplica gracias a los intereses (principio de oportunidad). Excel reproduce este principio básico de las
matemáticas financieras mediante funciones especiales; solo tiene que conocer los parámetros.

**Las funciones financieras más importantes para principiantes:**

| Función | Qué calcula | Ejemplo |
|----------|------------------|----------|
| `RMZ()` (cuota) | Cuota mensual de un préstamo | `=RMZ(tipo de interés/12; meses; -importe del préstamo)` |
| `ZW()` (valor futuro) | Capital final de un plan de ahorro | `=ZW(tipo de interés; años; -cuota; -capital inicial)` |
| `NBW()` (valor actual neto) | Valor actual de los pagos futuros | `=NBW(tipo de interés; pago1; pago2...)` |
| `IKV()` (tasa interna de rendimiento) | Rentabilidad de una inversión | `=IKV(rango de valores)` |

 **Consejo:** En las funciones RMZ y ZW, los pagos que realizas (cuota de crédito, cuota de ahorro)
deben indicarse como números negativos. El importe del crédito es positivo desde el punto de vista del banco.

**Ejercicio 10.2 — Aplicar funciones financieras**

La siguiente tabla de ejercicios **Módulo 10.2 Funciones financieras** ya está cargada.

1. Calcula con `RMZ()` la cuota mensual de un préstamo de 250 000 €

   con un tipo de interés del 4,5 % y un plazo de 30 años.
2. Calcula con `ZW()` el capital final al cabo de 20 años si ahorras mensualmente

   200 € al mes con un interés del 3 %.
3. Compara dos inversiones con `NBW()` y decide cuál

   es más ventajosa.



## Módulo 11: Impresión y colaboración

**Objetivo de aprendizaje:** Preparar hojas de cálculo de forma profesional para su impresión y colaborar con otros

**Nota sobre la plataforma Excel-lenz:** Las funciones de impresión no están
disponibles en el simulador web. Los siguientes ejercicios requieren Microsoft
Excel. En la plataforma hay preguntas de test sobre conceptos de impresión.

colaborar.

## 11.1. Configurar el diseño de página

###  Concepto: De la pantalla al papel: una forma diferente de pensar

Una hoja de cálculo que se ve perfecta en pantalla puede ser un desastre al imprimirla:
columnas cortadas, encabezados que faltan, sin márgenes. La impresión requiere
una forma diferente de pensar: hay que indicarle a Excel qué cabe en una página, cómo
deben ser los márgenes y si es mejor el formato vertical u horizontal.

**Los ajustes de impresión más importantes:**

| Configuración | Opciones | Recomendación |
|-------------|----------|------------|
| Orientación | Vertical / Horizontal | Tablas anchas → Horizontal |
| Escala | Ajustar a la página / % | "Todas las columnas en una página" |
| Márgenes | Normal / Estrecho / Personalizado | Si hay muchas columnas: "Estrecho" |
| Tamaño del papel | A4, Carta... | Europa Central y del Norte: A4 |

 **Consejo:** Antes de cada impresión, acceda a la **vista previa de saltos de página**
(Ver → Vista previa de saltos de página). Verá inmediatamente dónde se encuentran los saltos de página
y podrá moverlos arrastrando y soltando.

**Ejercicio 11.1 — Configurar el diseño de página**

La siguiente tabla de ejercicios **Módulo 11.1 Diseño de impresión** ya está cargada.

1. Cambie la orientación a apaisada.
2. Ajuste el tamaño de la tabla para que todas las columnas quepan en una página.
3. Establezca los márgenes en "Estrechos".
4. Centre la tabla horizontal y verticalmente en la página.

## 11.2. Área de impresión y saltos de página

###  Concepto: no es necesario imprimirlo todo

A menudo, una hoja de cálculo contiene cálculos auxiliares, resultados provisionales o notas
que no deben imprimirse. Con el **área de impresión** se define exactamente
qué parte de la hoja se imprime; el resto se ignora. Mediante
**saltos de página** manuales se controla dónde comienza una nueva página.

**Ejercicio 11.2 — Definir el rango de presión**

La siguiente tabla de ejercicios **Módulo 11.2 Rango de impresión** ya está cargada.

1. Define un rango de impresión que incluya únicamente la tabla principal (sin columnas auxiliares)

   .
2. Inserte un salto de página manual después de la línea 30.
3. Utilice la vista previa de saltos de página para comprobar los saltos.

## 11.3. Encabezados y pies de página

###  Concepto: los documentos profesionales necesitan metadatos

Una hoja de Excel impresa sin encabezado da una impresión poco profesional. Los encabezados y pies de página
contienen números de página, la fecha, nombres de archivo o logotipos de empresa, es decir, información que
sirve de orientación al lector. Una vez configurados, aparecen automáticamente en cada
página.

 **Consejo:** Utilice los elementos predefinidos (número de página, número total de páginas,
fecha actual, ruta del archivo) mediante los botones del cuadro de diálogo de encabezados y pies de página.
Esto le ahorra tener que escribir y se mantiene actualizado automáticamente.

**Ejercicio 11.3 — Crear encabezados y pies de página**

La siguiente tabla de ejercicios **Módulo 11.3 Encabezados** ya está cargada.

1. Inserta un encabezado con el nombre de la empresa (a la izquierda) y la fecha (a la derecha).
2. Inserta un pie de página con "Página X de Y" (centrado).
3. Activa "Repetir filas en la parte superior" para que el encabezado de la tabla aparezca en

   cada página impresa.

## 11.4. Colaboración y exportación

###  Concepto: compartir archivos de Excel como un profesional

Antes de enviar un archivo de Excel por correo electrónico, asegúrate de que el destinatario
pueda abrirlo y leerlo. No todo el mundo tiene Excel; una versión en PDF como alternativa es
el estándar profesional. Los comentarios permiten realizar consultas directamente en la hoja de cálculo sin
modificar los datos.

| Formato de exportación | ¿Cuándo utilizarlo? |
|-------------|-----------------|
| `.xlsx` | El destinatario debe poder seguir trabajando con el archivo |
| `.pdf` | Versión definitiva, no editable |
| `.csv` | Datos sin procesar para otros programas |

**Ejercicio 11.4 — Preparar para compartir**

La siguiente tabla de ejercicios **Módulo 11.4 Colaboración** ya está cargada.

1. Exporte la tabla como PDF.
2. Inserte un comentario en una celda (Revisar → Nuevo comentario).
3. Guarde el archivo tanto como `.xlsx` como `.pdf`.



## Módulo 12: Protección y seguridad

**Objetivo de aprendizaje:** Proteger libros y celdas, así como aumentar la productividad mediante
combinaciones de teclas.

## 12.1. Proteger celdas y hojas

###  Concepto: no todo el mundo debe poder modificarlo todo

Imagina una hoja de cálculo con el presupuesto que se envía a varios jefes de departamento. Las
fórmulas deben estar protegidas, pero cada uno debe poder introducir sus propias cifras.
La **protección de hojas** en Excel hace precisamente eso: tú determinas qué celdas se pueden editar
y cuáles están bloqueadas. Opcionalmente, con contraseña, para datos confidenciales.

**Los niveles de protección en Excel:**

| Nivel | Qué protege | Uso habitual |
|-------|----------------|-------------------|
| Bloqueo de celdas | Celdas individuales contra modificaciones | Fórmulas, valores de referencia |
| Protección de hoja | Hoja completa | Contra el borrado accidental |
| Protección de libro | Estructura (borrar/insertar hojas) | Impide la reestructuración |
| Contraseña de apertura | Archivo completo | Datos confidenciales |

 **Importante:** Todas las celdas están bloqueadas de forma predeterminada, pero el bloqueo solo
se aplica cuando se activa la protección de la hoja. Desbloquee primero las celdas que
deben seguir siendo editables (Ctrl+1 → Protección → Desmarcar "Bloqueado").

**Ejercicio 12.1 — Configurar la protección**

La siguiente tabla de ejercicios **Módulo 12.1 Protección** ya está cargada.

1. Desbloquee las celdas de entrada (B2:B10) y deje bloqueadas las celdas con fórmulas.
2. Active la protección de la hoja y compruebe que las celdas de entrada se pueden editar,

   las demás no.
3. Protege la estructura del libro para que no se puedan eliminar hojas

   .

## 12.2. Los atajos de teclado más importantes

###  Concepto: el ratón ahorra tiempo, pero el teclado ahorra aún más

Cada vez que la mano se aleja del teclado, se pierden unos 2 segundos. Con
cientos de acciones por hora, esto supone una suma considerable. Dominar los
atajos de teclado más importantes no solo te hace más rápido, sino también
más preciso, ya que la memoria muscular es menos propensa a cometer errores que los clics del ratón.

**Los 10 atajos imprescindibles:**

| Atajo de teclado | Acción | Ayuda para recordarlo |
|-------------------|--------|-----------|
| `Ctrl+C` / `Ctrl+V` / `Ctrl+X` | Copiar / Pegar / Cortar | Como en todas partes |
| `Ctrl+Z` / `Ctrl+Y` | Deshacer / Rehacer | Tu red de seguridad |
| `Ctrl+S` | Guardar | ¡Cada 5 minutos! |
| `Ctrl+1` | Dar formato a las celdas (cuadro de diálogo) | Todo en un solo lugar |
| `Ctrl+Mayús+L` | Activar/desactivar el filtro automático | L de "lista" |
| `Ctrl+Inicio` / `Ctrl+Fin` | Saltar al principio / al final | Navegación |
| `Ctrl+teclas de flecha` | Ir al borde del rango de datos | Tablas grandes |
| `F4` | Repetir la última acción / Cambiar el tipo de referencia | Dos funciones, una tecla |
| `Alt+=` | Autosuma | Suma rápida |
| `Ctrl+T` | Dar formato de tabla | T de "tabla" |

**Ejercicio 12.2 — Practicar atajos de teclado**

La siguiente tabla de ejercicios **Módulo 12_2 Atajos de teclado** ya está cargada. Edítala
utilizando exclusivamente atajos de teclado:

1. `Ctrl+Mayús+L` para aplicar un filtro; a continuación, navega con las teclas de flecha.
2. `F4` para repetir un formato.
3. `Ctrl+1` para abrir el cuadro de diálogo de formato.
4. `Alt+=` para la suma automática.

## 12.3. Inspección del documento

###  Concepto: lo que tu archivo de Excel revela sobre ti

Los archivos de Excel suelen contener información oculta: el nombre del autor,
comentarios, filas o columnas ocultas e incluso versiones anteriores de
los datos. Antes de compartir un archivo con terceros, debes eliminar estos metadatos,
del mismo modo que borras tu nombre de un regalo antes de
regalarlo a otra persona.

**La inspección de documentos comprueba lo siguiente:**

- Comentarios y notas
- Propiedades del documento (autor, empresa, fecha de creación)
- Filas, columnas y hojas ocultas
- Encabezados y pies de página
- Vínculos externos a otros archivos

**Ejercicio 12.3 — Inspeccionar un documento**

La siguiente tabla de ejercicios **Módulo 12.3 Inspección** ya está cargada.

1. Realice la inspección del documento (Archivo → Información → Buscar problemas

   → Comprobar documento).
2. Elimina toda la información personal que encuentres.
3. Guarda la versión depurada.



## Módulo 13: Automatización con macros

**Objetivo de aprendizaje:** Comprender el concepto de las macros y grabar automatizaciones sencillas.

**Nota sobre la plataforma Excel-lenz:** Las macros y VBA no están disponibles en el simulador web
. Los siguientes ejercicios requieren Microsoft Excel (versión de escritorio
con archivos `.xlsm`). En la plataforma hay disponibles preguntas de cuestionario sobre conceptos de macros
.


## 13.1. ¿Qué son las macros?

###  Concepto: realizar tareas recurrentes una sola vez

Una macro es un **paso de trabajo grabado** que Excel puede repetir con solo pulsar un botón
. Imagínese que tuviera que realizar cada mañana los mismos cinco
pasos de formato en un informe diario. Con una macro,
puede realizar los cinco pasos con un solo clic, una vez que los haya grabado.

Las macros se guardan en el lenguaje de programación **VBA** (Visual Basic for Applications)
. La buena noticia es que no es necesario saber VBA para grabarlas:
Excel escribe el código automáticamente.

 **Importante:** Las macros solo funcionan en archivos `.xlsm` (libretas de Excel
con macros), no en archivos normales `.xlsx`. Guarde siempre las libretas con macros
en formato `.xlsm`.

**Ejercicio 13.1 — Activar las herramientas de desarrollo**

La siguiente tabla de ejercicios **Módulo 13.1 Herramientas de desarrollo** ya está cargada.

1. Activa la pestaña "Herramientas de desarrollo"

   (Archivo → Opciones → Personalizar cinta → Herramientas de desarrollo).
2. Guarda el archivo como `.xlsm` (libro de Excel con macros).
3. Explora la nueva pestaña e identifica el

   botón "Grabar macro".

## 13.2. Grabar macros

###  Concepto: Excel te observa y recuerda cada paso

Grabar una macro es muy sencillo: haz clic en "Grabar",
realiza los pasos de tu trabajo con normalidad y haz clic en "Detener grabación".
Excel ha traducido cada clic del ratón y cada pulsación del teclado a código VBA y
lo ha guardado.

Es importante distinguir entre referencias **absolutas** y **relativas**
durante la grabación:
- **Grabación absoluta**: la macro siempre opera en las mismas celdas (p. ej., A1)
- **Grabación relativa**: la macro opera en relación con la posición actual

 **Consejo:** Para las macros de formato que desee aplicar a diferentes hojas de cálculo,
utilice **referencias relativas** durante la grabación.

**Ejercicio 13.2 — Grabar una macro**

La siguiente hoja de ejercicios **Módulo 13.2 Grabar macro** ya está cargada.

1. Graba una macro que aplique negrita a la fila de encabezados,

   le aplique un fondo gris y dibuje un borde alrededor del área de datos.
2. Guarde la macro con el nombre "FormatoInforme".
3. Ejecute la macro en una segunda hoja de cálculo.
4. Asigne la macro a un botón o a un objeto.

## 13.3. El editor de VBA

###  Concepto: echar un vistazo "bajo el capó"

Tras la grabación, puede ver el código VBA generado en el **editor de VBA** (`Alt+F11`)
y aprender a entenderlo. El editor muestra el código que Excel ha generado automáticamente
—a menudo con más detalle del que escribiría un programador, pero
es una excelente fuente de aprendizaje.

**Las áreas más importantes del editor de VBA:**

| Área | Función |
|---------|----------|
| Explorador de proyectos | Todos los libros abiertos y sus componentes |
| Ventana de código | El código VBA propiamente dicho |
| Ventana de propiedades | Propiedades de hojas y controles |
| Área de ejecución | Probar comandos directamente (Ctrl+G para mostrarla) |

**Ejercicio 13.3 — Explorar el editor de VBA**

La siguiente tabla de ejercicios **Módulo 13.3 Editor de VBA** ya está cargada.

1. Abre el editor de VBA con `Alt+F11`.
2. En el Explorador de proyectos, busca la macro grabada en el

   ejercicio anterior.
3. Lee el código e identifica las líneas que realizan cambios de formato

   (`.Font.Bold = True`, `.Interior.Color`).

## 13.4. Conceptos básicos de la programación en VBA

###  Concepto: de la grabación a la programación

Las macros grabadas funcionan de forma rígida según un esquema; no pueden tomar decisiones
. La verdadera automatización comienza con conceptos básicos de programación:

| Concepto | Significado | Ejemplo |
|---------|-----------|----------|
| **Variable** | Un espacio de memoria con nombre para almacenar valores | `Dim anzahl As Integer` |
| **Condición** | Ejecutar código solo en determinadas circunstancias | `If valor > 100 Then...` |
| **Bucle** | Repetir código varias veces | `For i = 1 To 10... Next i` |
| **Sub** | Una macro con nombre (subprograma) | `Sub MiMacro()... End Sub` |

 **Consejo:** Aunque no tenga intención de convertirse en programador de VBA,
comprender estos conceptos básicos le ayudará a leer,
adaptar y corregir errores en las macros grabadas.

**Ejercicio 13.4 — Programación sencilla en VBA**

La siguiente tabla de ejercicios **Módulo 13.4 Programación en VBA** ya está cargada.

1. Escribe en el editor de VBA (`Alt+F11`) una macro que, mediante un bucle `For`,

   escriba los números del 1 al 10 en las celdas A1 a A10.
2. Amplíe la macro con una condición `If`: los números superiores a 5 deben

   .
3. Ejecute la macro y compruebe el resultado.
