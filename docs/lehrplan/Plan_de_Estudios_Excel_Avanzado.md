---
pdftitle: «Programa de estudios: Excel para usuarios avanzados»
author: «Cristbal Gallardo»
date: «agosto de 2026»
location: «Friburgo de Brisgovia»
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
{\Large\sffamily Excel para usuarios avanzados\par}
\vspace{0.3em}
{\large\sffamily para usuarios profesionales\par}
\vspace{1.5em}
{\large\sffamily Programa completo con teoría y ejercicios prácticos\par}
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
\textbf{Nivel:} Avanzado (se requieren conocimientos básicos de Excel)\par
}
\end{center}
\vfill

\tableofcontents

## Introducción

Este programa de formación ofrece una formación completa y en profundidad en Microsoft Excel para
usuarios profesionales que ya cuentan con conocimientos operativos de Excel.
Combina teoría avanzada con ejercicios prácticos y ha sido diseñado para
clases presenciales individuales.

**Conocimientos previos necesarios:**
- Manejo seguro de fórmulas y referencias (relativas, absolutas, mixtas)
- Funciones básicas: SUMME, MITTELWERT, WENN, SVERWEIS
- Formato básico y creación de gráficos
- Experiencia con tablas dinámicas sencillas

## ¿A quién va dirigido este plan de estudios?

Este plan de estudios está dirigido a **profesionales con conocimientos previos de Excel** que
deseen automatizar tareas, modelar escenarios complejos y extraer conclusiones a partir de grandes
volúmenes de datos.

## ¿Cómo está estructurado el plan de estudios?

1. **Objetivo de aprendizaje**  Lo que serás capaz de hacer tras completar este módulo
2. **Teoría**  Explicaciones claras a nivel avanzado
3. **Ejercicios**  Tareas prácticas para afianzar los conocimientos


## Módulo 1: Formatos avanzados, formato condicional y validación de datos

**Objetivo de aprendizaje:** Diseñar formatos numéricos personalizados, aplicar el formato condicional basado en fórmulas
y combinar la validación avanzada de datos con la protección.

## 1.1. Fundamentos pedagógicos

Este plan de estudios sigue los mismos principios andragógicos que el
curso para principiantes. Las decisiones didácticas se basan en:

1. **Andragogía** (Knowles, 1980): los adultos aprenden orientándose a los problemas y
   aportan una amplia experiencia previa.
2. **Conectivismo** (Siemens, 2005): la plataforma web complementaria Excel-lenz
   sirve como recurso de aprendizaje continuo entre las sesiones presenciales.
3. **Aprendizaje transformativo** (Mezirow, 1991): las técnicas avanzadas
   transforman de forma fundamental la forma en que el participante aborda las tareas de Excel.
4. **Modelo TPACK** (Mishra y Koehler, 2006): Los conocimientos técnicos de Excel se
   combinan con estrategias pedagógicas adaptadas al ritmo de aprendizaje individual
   de cada uno.

La justificación didáctica detallada se encuentra en la **Guía didáctica:
Excel para avanzados**.

## 1.2. Formatos numéricos personalizados

### Concepto: los códigos de formato como lenguaje

Un formato numérico definido por el usuario consta de hasta cuatro secciones, separadas
por punto y coma: `positivo;negativo;cero;texto`. Cada sección define cómo se muestra un
valor en la categoría correspondiente.

| Sección | Significado | Ejemplo |
|-----------|-----------|----------|
| 1.ª sección | Números positivos | `#.##0,00` |
| 2.ª sección | Números negativos | `[Rojo]-#.##0,00` |
| 3.ª sección | Cero | `"-"` |
| 4.ª sección | Texto | `@" (Texto)"` |

**Los caracteres de formato más importantes:**

| Carácter | Significado | Ejemplo (entrada) | Visualización |
|---------|-----------|-------------------|---------|
| `0` | Dígito o cero | `000` (5) | `005` |
| `#` | Dígito (sin cero a la izquierda) | `###` (5) | `5` |
| `?` | Marcador de posición para la alineación | `???.??` (5.1) | `5.1 ` |
| `@` | Marcador de posición de texto | `"Artículo: "@` (libro) | `Artículo: libro` |
| `[Color]` | Color condicional | `[Rojo]#.##0;[Azul]-#.##0` | Rojo/Azul |

**Consejo:** El signo de porcentaje en el formato multiplicado por 100: `0%` muestra 0,19 como
19 %. Para mostrar 19 como 19 %: `0"%"`.

**Ejercicio 1.1  Formatos personalizados**

La siguiente tabla de ejercicios **Módulo 1.1 Formatos numéricos** ya está cargada.

> 1. Crea un formato que muestre los números positivos en negro (`#.##0,00 `),
>    los negativos en rojo (`[Rojo]-#.##0,00 `) y el cero como `-`.
> 2. Crea un formato que muestre los números inferiores a 1000 de forma normal y los superiores a 1000
>    en miles: `[<1000]#.##0;[>999]#.##0." T"`.

## 1.3. Formato condicional con fórmulas
### Concepto: reglas que piensan por sí mismas

El formato condicional basado en fórmulas va mucho más allá de las reglas predefinidas
. Puede utilizar cualquier fórmula de Excel como condición  y el
formato se adapta en tiempo real.

| Caso de uso | Fórmula | Efecto |
|---------------|--------|--------|
| Resaltar toda la fila | `=$F5="TX"` | Se resalta la fila si la columna F contiene «TX» |
| Avisar de fechas vencidas | `=UND(B4>HOUND();B4<=HOUND()+30)` | Fechas en los próximos 30 días |
| Detectar discrepancias | `=$B4<>$C4` | Diferencias entre las columnas B y C |
| Valores duplicados | `=ZÄHLENWENN(A:A;A1)>1` | Duplicados en la columna A |

**Importante:** En las reglas basadas en fórmulas, hay que referirse siempre a la
**celda activa** de la selección. Si selecciona A1:D100 y A1 es la celda activa,
la fórmula debe ser `=$F1="TX"` (no `=$F5`).

**Ejercicio 1.2  Formato condicional basado en fórmulas**

La siguiente tabla de ejercicios **Módulo 1 2 Formato_condicional** ya está cargada.

> 1. Resalte todas las filas cuyo importe sea > 10 000 (fórmula: `=$C2>10000`).
> 2. Resalte con fondo amarillo las filas cuyo estado sea «Pendiente».
> 3. Cree una regla que resalte en rojo la fecha de vencimiento si
>    queda a menos de 7 días en el futuro: `=UND($D2>HOUND();$D2<=HOUND()+7)`.

## 1.4. Validación avanzada de datos
### Concepto: garantizar la calidad de los datos desde el momento de la introducción

La validación de datos evita que se introduzcan datos erróneos antes de que se
incorporen a la tabla. Para los usuarios avanzados resultan especialmente útiles:

- **Fórmulas definidas por el usuario** como criterio de validación
- **Mensajes de entrada** que ofrecen indicaciones al usuario
- **Mensajes de error** con textos personalizados y niveles de parada/advertencia

| Tipo de validación | Ejemplo | Evita |
|----------------|---------|------------|
| Lista | `=Departamentos` (rango nombrado) | Errores tipográficos, entrada libre |
| Definido por el usuario | `=UND(A1>=18;A1<=65)` | Valores fuera del rango de edad |
| Definido por el usuario | `=LONG(B1)=5` | ID con longitud incorrecta |
| Fecha | entre HOUND() y HOUND()+90 | Fechas pasadas o demasiado lejanas |

**Consejo:** Utilice **nombres** para las listas de validación en lugar de referencias directas
a celdas; esto hace que el libro sea más fácil de mantener y más comprensible.

**Ejercicio 1.3:  Configurar la validación de datos**

La siguiente tabla de ejercicios **Módulo 1.3 Validación** ya está cargada.

> 1. Crea una lista desplegable para los departamentos a partir del rango nombrado
>    `Departamentos` (TI, Ventas, RR. HH., Finanzas, Marketing).
> 2. Limite el salario a un rango de 30 000 a 120 000 mediante una fórmula definida por el usuario.
> 3. Añada un mensaje de entrada: «Seleccione un departamento de la lista».
> 4. Cree un mensaje de error de parada: «Salario no válido (30 000-120 000)».

## 1.5. Protección selectiva
### Concepto: proteger solo lo que es necesario proteger

Por defecto, todas las celdas están **bloqueadas**, pero el bloqueo solo surte efecto cuando se
activa la protección de la hoja. Por lo tanto, el procedimiento es el siguiente:

1. **Desbloquear las celdas** que deben seguir siendo editables (`Ctrl+1`  Protección  Bloqueado)
2. **Activar la protección de la hoja** (Revisar  Proteger hoja)

| Nivel de protección | Qué protege | Uso típico |
|------------|-----------------|-------------------|
| Bloqueo de celdas | Celdas individuales frente a modificaciones | Celdas con fórmulas, valores de referencia |
| Protección de hoja | Hoja completa | Formularios de entrada |
| Protección de libro | Estructura (eliminar/insertar hojas) | Plantillas |
| Ocultar fórmulas | Fórmulas no visibles en la barra de edición | Cálculos propios |

**Ejercicio 1.4  Configurar la protección**

La siguiente hoja de ejercicios **Módulo 1.4 Protección** ya está cargada.

> 1. Desbloquee las celdas de entrada (B2:B10) y deje bloqueadas las celdas de fórmula.
> 2. Active la protección de la hoja (sin contraseña).
> 3. Oculte las fórmulas de la columna D (Formato de celdas  Protección).
> 4. Compruébelo: las celdas de entrada se pueden editar, las celdas de fórmula no.


## Módulo 2: Funciones avanzadas y fórmulas complejas

**Objetivo de aprendizaje:** Dominar las funciones de búsqueda multidimensionales, la lógica anidada,
las funciones financieras y las fórmulas matriciales.

## 2.1. ÍNDICE + COMPARAR: la alternativa flexible a SVERWEIS

### Concepto: buscar en cualquier dirección

SVERWEIS solo puede buscar de izquierda a derecha. ÍNDICE + COMPARAR elimina esta
restricción y, además, es más resistente a los cambios en las tablas.

```
=ÍNDICE(rango; número de fila; [número de columna])
=COMPARAR(criterio de búsqueda; rango de búsqueda; [tipo de comparación])
```

**Búsqueda bidimensional:** `=ÍNDICE(B3:E9; COMPARAR(B13; B3:B9; 0); COMPARAR(B14; B3:E3; 0))`

| Tipo de comparación | Significado |
|--------------|-----------|
| `0` | Coincidencia exacta (sin ordenar) |
| `1` | Valor mayor &lt;= criterio de búsqueda (ordenado de menor a mayor) |
| `-1` | Valor menor &gt;= criterio de búsqueda (ordenado de mayor a menor) |

**Consejo:** ÍNDICE+COMPARACIÓN también es más rápido que SVERWEIS en tablas grandes
**Consejo:** En Excel 365/2021, `XVERWEIS` (XLOOKUP) sustituye tanto a SVERWEIS como
a ÍNDICE+COMPARACIÓN con una sintaxis más sencilla:
`=XVERWEIS(valor_buscado; columna_de_búsqueda; columna_de_resultado; [si_no_se_encuentra]; [modo_de_comparación])`.
XVERWEIS busca en ambas direcciones y ya no necesita un índice de columna,
ni se interrumpe si se insertan columnas.

**Ejercicio 2.1: Aplicar ÍNDICE + COMPARAR**

La siguiente tabla de ejercicios **Módulo 2.1 ÍNDICE_COMPARAR** ya está cargada.

> 1. Busque el precio de un producto con ÍNDICE + COMPARAR, teniendo en cuenta que la
>    columna del producto se encuentra **a la derecha** del precio (CONVERSIÓN no puede hacerlo).
> 2. Crea una búsqueda bidireccional: producto (fila)  mes (columna).
> 3. Compara la fórmula con una variante de SVERWEIS. ¿Cuál es más flexible?

## 2.2. Referencias dinámicas con DESPLAZAR.RANGO

### Concepto: rangos que «respiran»

DESPLAZAR.ÁREA (OFFSET) devuelve una referencia desplazada un número determinado
de filas/columnas desde una celda inicial, con altura
y anchura variables.

**Sintaxis:** `=DESPLAZAR.RANGODER(referencia; filas; columnas; [altura]; [anchura])`

```
=SUMME(DESPLAZAR.RANGODER(A1;0;0;E2;1))
 Suma desde A1 hasta A[E2] (tamaño dinámico del rango)
```

| Aplicación | Fórmula |
|-----------|--------|
| Suma dinámica | `=SUMME(DESPLAZAR.RANGODER(B1;0;0;CONTO2(B:B);1))` |
| Últimos 3 meses | `=MITTELWERT(DESPLAZAR.RANGODER(B1;NÚMERODER(B:B)-3;0;3))` |
| Media móvil | En combinación con ZÄHLENWENN para ventanas móviles |

**Importante:** DESPLAZAR.RANGO es una **función volátil**, es decir,
se vuelve a calcular cada vez que se modifica el libro. Si hay muchas fórmulas con DESPLAZAR.RANGO,
el rendimiento puede verse afectado.

**Ejercicio 2.2  Referencias dinámicas**

La siguiente tabla de ejercicios **Módulo 2 2 DESPLAZAR_ÁREA** ya está cargada.

> 1. Crea una fórmula de suma dinámica que tenga en cuenta automáticamente las nuevas filas
>    (utilizando ANZAHL2 para el número de filas).
> 2. Crea una fórmula para calcular la media de los últimos 6 meses que
>    se ajuste automáticamente cuando se añadan nuevos datos.

## 2.3. Lógica anidada y gestión de errores

### Concepto: encadenar varias condiciones de forma elegante

En lugar de anidamientos profundos de funciones WENN, Excel ofrece varias alternativas:

| Función | Sintaxis | Aplicación |
|----------|--------|-----------|
| SI (Excel 2019+) | `=WENN(B2>=90;"A";B2>=80;"B";B2>=70;"C";VERD;"F")` | Varias condiciones sin anidamiento |
| SIERRO | `=SIERRODER(SVERWEIS(A2;Lista;2;0);"No encontrado")` | Capturar #NV y otros errores |
| WAHL | `=WAHL(B2;"Pequeño";"Mediano";"Grande")` | Valor de una lista basado en el índice |

**Consejo:** ERROR.SI detecta TODOS los errores. Para un tratamiento de errores más preciso,
existe ERROR.SI.NV (solo #NV) en Excel 2013 y versiones posteriores.

**Ejercicio 2.3  Funciones anidadas**

La siguiente tabla de ejercicios **Módulo 2.3 Lógica** ya está cargada.

> 1. Crea un cálculo de comisiones con una función SI anidada:
>    - Facturación < 10 000: 5 %
>    - Facturación entre 10 000 y 50 000: 8 %
>    - Facturación > 50 000: 12 %
> 2. Utilice la función ERROR.SI para una fórmula VLOOKUP que, en caso de que falte
>    el término de búsqueda, muestre «No está en el catálogo».
> 3. Opcional: reescriba la fórmula de comisiones utilizando la función SI (Excel 2019+).

## 2.4. Funciones financieras para la práctica

### Concepto: calcular el valor actual del dinero

| Función | Qué calcula | Ejemplo |
|----------|------------------|----------|
| RMZ (PMT) | Pago periódico (cuota) | `=RMZ(4,5 %/12; 30*12; -250000)` |
| NBW (NPV) | Valor actual neto de una inversión | `=NBW(8 %; B2:B6)+B1` |
| IKV (IRR) | Tasa interna de rendimiento (rendimiento) | `=IKV(B1:B6)` |
| ZW (FV) | Valor futuro de una inversión | `=ZW(3 %/12; 20*12; -200; -10000)` |

**Importante:** En RMZ y ZW, los pagos que realices deben indicarse como **números negativos**.
El tipo de interés debe ajustarse al período: el tipo de interés anual dividido entre 12
para cuotas mensuales.

**Ejercicio 2.4: Aplicar funciones financieras**

La siguiente tabla de ejercicios **Módulo 2.4 Funciones financieras** ya está cargada.

> 1. Calcule la cuota mensual de un préstamo de 250 000  con un
>    tipo de interés del 4,5 % y un plazo de 30 años utilizando RMZ.
> 2. Calcule el valor actual neto (VAN) de una inversión: inversión inicial
>    100 000, flujos de caja anuales de 25 000  durante 6 años, tipo de interés del 8 %.
> 3. Calcula con la función ZW el capital final de un ahorro mensual de 200 
>    durante 20 años con un interés anual del 3 %.

## 2.5. Fórmulas matriciales

### Concepto: una fórmula, muchos resultados

Las fórmulas matriciales realizan varios cálculos a la vez y pueden
devolver toda una serie de resultados.

**Fórmula matricial clásica (Ctrl+Mayús+Intro):**
```
{=SUMME(SI(A1:A10>10; B1:B10; 0))}
```

**Fórmulas matriciales dinámicas (Excel 365/2021):**
```
=SORTIEREN(FILTERN(A1:C100; C1:C100>1000))
```

**Consejo:** En Excel 365, las fórmulas matriciales se tratan automáticamente como matrices dinámicas;
ya no es necesario pulsar Ctrl+Mayús+Intro. La fórmula se aplica
automáticamente a todas las celdas afectadas.

**Ejercicio 2.5: Fórmulas matriciales**

La siguiente tabla de ejercicios **Módulo 2.5 Fórmulas matriciales** ya está cargada.

> 1. Crea una fórmula matricial que sume todas las ventas > 1.000:
>    `{=SUMME(SI(C2:C20>1000; C2:C20; 0))}`
> 2. Crea una fórmula matricial que encuentre la venta más alta por región.
> 3. Pruebe (Excel 365): `=SORTIEREN(ÚNICODER(A2:A50))` para obtener valores únicos.


## 2.6. Funciones de fecha y hora

### Concepto: calcular con los datos, no solo mostrarlos

Excel almacena las fechas como números consecutivos (1 = 01/01/1900) y
las horas como fracciones decimales (0,5 = 12:00). Este sistema permite realizar
cálculos de tiempo precisos.

| Función | Sintaxis | Ejemplo | Resultado |
|----------|--------|----------|----------|
| HOY | `=HOUND()` | `=HOUND()` | Fecha actual |
| AHORA | `=JETZT()` | `=JETZT()` | Fecha + hora |
| AÑO | `=AÑODER(fecha)` | `=AÑODER(B2)` | Extraer el año |
| MES | `=MONAT(fecha)` | `=MONAT(B2)` | Mes (1-12) |
| DÍA | `=DÍA(fecha)` | `=DÍA(B2)` | Día (1-31) |
| FIN DE MES | `=FIN DE MONAT(Fecha; Meses)` | `=FIN DE MONAT(B2;0)` | Último día del mes |
| AÑOS PARCIALES | `=AÑOS PARCIALES(Inicio; Fin)` | `=AÑOS PARCIALES(B2;C2)` | Años entre fechas |
| DÍA LABORABLE | `=DÍA LABORABLE(fecha; días)` | `=DÍA LABORABLE(B2;10)` | Fecha tras X días laborables |
| DÍAS LABORABLES NETOS | `=DÍAS LABORABLES NETOS(inicio; fin)` | `=DÍAS LABORABLES NETOS(B2;C2)` | Días laborables entre fechas |

**Consejo:** `=DATEDIF(fecha de inicio; fecha de fin; "Y")` calcula los años completos entre
fechas, lo que resulta ideal para calcular la edad. La función no está documentada, pero
está disponible en todas las versiones de Excel.

**Ejercicio 2.6  Funciones de fecha y hora**

La siguiente tabla de ejercicios **Módulo 2.6 Fecha_Hora** ya está cargada.

> 1. Calcula la edad de las personas a partir de la fecha de nacimiento con
>    `=AÑOS(B2;HOUND())`.
> 2. Determina con `FINAL_MES` el último día del mes actual.
> 3. Calcule la fecha de vencimiento 30 días laborables después de la fecha del pedido con
>    `DÍAS_LABORABLES`.
> 4. Calcule el número de días laborables entre dos fechas con
>    `DÍAS_LABORABLES_NETOS`.

## Módulo 3: Referencias 3D, nombres y vínculos externos

**Objetivo de aprendizaje:** Utilizar de forma profesional los nombres definidos, consolidar datos de varias hojas
mediante referencias 3D y vincular libros de trabajo externos.

## 3.1. Nombres definidos para usuarios avanzados

### Concepto: nombres para fórmulas, constantes y rangos

Los nombres hacen que las fórmulas sean legibles y fáciles de mantener. En lugar de `=B2*$F$1`, escriba
`=B2*Tipo_IVA`.

| Tipo de nombre | Ejemplo | Uso |
|----------|---------|------------|
| Nombre de rango | `=SUMME(Ventas)` | Suma el rango nombrado |
| Nombre de fórmula | `IVA = 0,19` | Constante en cálculos |
| Nombre dinámico | `Datos = DESPLAZAR.RANGODER(Tabla1!$A$1;0;0;CONTO2(Tabla1!$A:$A);5)` | Crece automáticamente |

**El Administrador de nombres** (`Ctrl+F3`) muestra todos los nombres definidos con su
ámbito de validez (libro o hoja individual).

**Ejercicio 3.1: Definir y gestionar nombres**

La siguiente tabla de ejercicios **Módulo 3.1 Nombres** ya está cargada.

> 1. Defina nombres para: Tipo_IVA (19 %), Impuesto sobre la renta (25 %),
>    Cotizaciones sociales (15 %).
> 2. Cree un nombre dinámico `TodosLosDatos` con DESPLAZAR.RANGO,
>    que incluya automáticamente las nuevas filas.
> 3. Utilice los nombres en una fórmula de nómina.

## 3.2. Referencias 3D: datos entre hojas

### Concepto: misma celda, varias hojas

Una referencia 3D hace referencia a la misma celda o al mismo rango a lo largo de varias
hojas de cálculo.

**Sintaxis:** `=SUMME(Enero:Diciembre!B2)`

| Función | ¿Compatible con 3D? | Ejemplo |
|----------|:---------:|----------|
| SUMME |  | `=SUMME(Q1:Q4!B5)` |
| MITTELWERT |  | `=MITTELWERT(2019:2026!C10)` |
| MÁX / MÍN |  | `=MÁX(Región1:Región5!D20)` |
| SVERWEIS |  | No es posible en referencias 3D |

**Importante:** Todas las hojas deben tener la misma estructura (los mismos datos en
las mismas posiciones). Las hojas que se inserten entre la primera y la última hoja
se incluyen automáticamente en la referencia 3D.

**Ejercicio 3.2  Crear referencias 3D**

La siguiente tabla de ejercicios **Módulo 3 2 Referencias 3D** ya está cargada.

> 1. Crea un resumen anual que, con `=SUMME(Enero:Diciembre!B2)`,
>    calcule el total de todas las hojas mensuales.
> 2. Inserta una nueva hoja entre enero y febrero; comprueba
>    si la referencia 3D incluye automáticamente la nueva hoja.

## 3.3. Vínculos entre libros de trabajo

### Concepto: integrar datos de otros archivos en tiempo real

Los vínculos externos extraen datos de otros archivos de Excel. Si se producen cambios en
el archivo de origen, los datos del archivo de destino se actualizan.

**Sintaxis:** `='C:\ruta\[archivo de origen.xlsx]hoja'!celda`

| Acción | Ruta del menú |
|--------|----------|
| Editar vínculos | Consultar datos y conexiones  Editar vínculos |
| Actualizar vínculo | Actualizar valores |
| Desvincular | Desvincular (los valores se conservan) |

**Consejo:** Evita utilizar demasiados enlaces externos, ya que ralentizan
considerablemente la apertura del archivo. Para grandes volúmenes de datos, Power Query es la
mejor alternativa.

**Ejercicio 3.3  Vínculos externos**

La siguiente tabla de ejercicios **Módulo 3.3 Vínculos** ya está cargada.

> 1. Cree un enlace a un libro externo
>    `Datos del presupuesto.xlsx`, hoja `Q1`, celda `B5`.
> 2. Compruébelo: modifique el valor en el archivo de origen y actualice
>    el enlace (Datos  Actualizar todo).
> 3. Desvincule el enlace y compruebe si los valores se conservan.


## 3.4. Consolidación de datos

### Concepto: una única verdad a partir de múltiples fuentes

La consolidación (Datos → Herramientas de datos → Consolidar) agrupa datos de varios
rangos, incluso si las categorías aparecen en un orden diferente
.

**Consolidación por posición:** todas las áreas de origen tienen exactamente la misma estructura.
**Consolidación por categoría:** Excel agrupa automáticamente las etiquetas iguales.

| Función | Uso |
|----------|-----------|
| Suma | Predeterminada: suma los valores de las mismas categorías |
| Media | Media de varias fuentes |
| Máx./Mín. | Valores extremos de todas las fuentes |
| Número | ¿Cuántas entradas hay por categoría? |

**Consejo:** Active «Vincular a los datos de origen» para que la
consolidación se actualice automáticamente cuando cambien los datos de origen.

**Ejercicio 3.4  Consolidar datos**

La siguiente tabla de ejercicios **Módulo 3.4 Consolidación** ya está cargada.

> 1. Dispone de tres hojas (Q1, Q2, Q3) con las ventas por producto. Consolide
>    los datos en una hoja de resumen anual (Datos → Consolidar).
> 2. Consolide por categoría: los productos aparecen en un orden diferente
>    en las hojas trimestrales.
> 3. Active el vínculo con los datos de origen y modifique un valor
>    en Q1: ¿se actualiza la consolidación?

## Módulo 4: Bases de datos en Excel. Filtros especiales y funciones de base de datos

**Objetivo de aprendizaje:** aplicar filtros especiales con criterios complejos, utilizar funciones de base de datos
(DBSUMME, DBMITTELWERT) y calcular resultados parciales en varias etapas.

## 4.1. Filtros especiales con rango de criterios

### Concepto: filtrar como con SQL, pero en Excel

El filtro especial (Datos  Ordenar y filtrar  Avanzado) permite
aplicar una lógica de filtrado compleja con operadores Y/O a través de un
rango de criterios independiente.

**Configurar el rango de criterios:**
- Criterios en la misma fila = operador **Y**
- Criterios en filas diferentes = operador **O**

| Producto | Facturación |
|---------|--------|
| Portátil | >5000 |
| Monitor | >5000 |

 Muestra todos los portátiles O monitores con volumen de ventas > 5000

**Consejo:** puede copiar el resultado a otra ubicación
(«Copiar selección a otra área») y eliminar los duplicados con «Solo registros únicos».

**Ejercicio 4.1: Aplicar filtros especiales**

La siguiente tabla de ejercicios **Módulo 4.1 Filtros especiales** ya está cargada.

> 1. Cree un rango de criterios para: Región «Norte» Y volumen de ventas > 10 000.
> 2. Amplíe: Región «Norte» O Región «Sur» (en ambos casos, volumen de ventas > 10 000).
> 3. Extraiga los registros únicos a un nuevo rango.

## 4.2. Funciones de base de datos

### Concepto: cálculos condicionales a nivel de tabla

Las funciones de base de datos funcionan como SUMMEWENN, pero con un
rango de criterios independiente, lo que resulta ideal para condiciones complejas de varios niveles.

| Función | Equivalente | Sintaxis |
|----------|-------------|--------|
| DBSUMME | SUMME con criterios | `=DBSUMME(base de datos; «Volumen de negocio»; criterios)` |
| DBMITTELWERT | MITTELWERT con criterios | `=DBMITTELWERT(base de datos; «Edad»; criterios)` |
| DBCONTO | CONTO con criterios | `=DBCONTODER(base de datos; «ID»; criterios)` |
| DBEXTRACCIÓN | Extraer un valor individual | `=DBEXTRACCIÓN(base de datos; «Nombre»; criterios)` |

**Ventaja frente a SUMMEWENNS:** los criterios se pueden gestionar en un rango
y modificarse rápidamente sin tener que modificar las fórmulas.

**Ejercicio 4.2  Funciones de base de datos**

La siguiente tabla de ejercicios **Módulo 4.2 Funciones de base de datos** ya está cargada.

> 1. Calcula con DBSUMME la facturación total de la región «Oeste».
> 2. Calcula con DBMITTELWERT la edad media de los clientes de «Berlín».
> 3. Extrae con DBAUSZUG el nombre del cliente con el ID 1042.

## 4.3. Resultados parciales en varios niveles

### Concepto: sumas por grupo  y subgrupos

Los resultados parciales (datos  estructuración  resultado parcial) insertan automáticamente
líneas de resumen después de cada cambio de grupo.

**Requisito:** Los datos deben estar **ordenados** según la característica de agrupación.

| Nivel de estructura | Visibilidad |
|-----------------|-------------|
| Nivel 1 | Solo suma total |
| Nivel 2 | Totales por grupo principal |
| Nivel 3 | Todas las líneas detalladas |

**Ejercicio 4.3: Calcular resultados parciales**

La siguiente tabla de ejercicios **Módulo 4.3 Resultados parciales** ya está cargada.

> 1. Ordena la tabla por región y, a continuación, por producto.
> 2. Añade resultados parciales para la suma de la facturación por región.
> 3. Añade un segundo nivel de resultados parciales para el número por producto.


## 4.4. Hojas de cálculo de Excel y referencias estructuradas

### Concepto: inteligencia en lugar de mero formato

Una tabla de Excel (`Ctrl+T`) es más que un rango formateado: es
una estructura de datos inteligente con sus propias reglas y referencias.

| Propiedad | Rango normal | Tabla de Excel |
|------------|-----------------|---------------|
| Formato | Manual | Automático (cintas, encabezado) |
| Nuevas filas | Formateadas manualmente | Aplicadas automáticamente |
| Fórmulas | Copiadas manualmente | Aplicadas automáticamente a todas las filas |
| Filtros | Establecidos manualmente | Aplicados automáticamente en el encabezado |
| Referencias | `=B2*C2` | `=[@Precio]*[@Cantidad]` |

**Las referencias estructuradas** utilizan nombres de tablas y columnas en lugar de direcciones de celda:
```
=SUMME(Tabla1[Volumen de negocio])
=SVERWEIS(A2;Lista de precios;2;0)
=[@Volumen de negocio]-[@Costes]
```

**Consejo:** Las referencias estructuradas hacen que las fórmulas sean intuitivas; incluso meses
más tarde, sabrá de inmediato qué se está calculando. Se adaptan automáticamente
cuando la hoja de cálculo crece.

**Ejercicio 4.4  Utilizar hojas de cálculo de Excel**

La siguiente tabla de ejercicios **Módulo 4.4 Tablas** ya está cargada.

> 1. Convierte el rango de datos en una tabla de Excel con `Ctrl+T`.
> 2. Calcule una nueva columna con una referencia estructurada: `=[@Cantidad]*[@Precio]`.
> 3. Añada una fila de resultados (Diseño de tabla → Fila de resultados).
> 4. Añada nuevas filas de datos: ¿se aplican automáticamente el formato y las fórmulas
>    ?

## Módulo 5: Tablas dinámicas avanzadas

**Objetivo de aprendizaje:** Crear tablas dinámicas complejas con agrupaciones, filtrados,
campos calculados y gráficos dinámicos.

## 5.1. Tablas dinámicas para usuarios avanzados

### Concepto: varios campos, una tabla

Una tabla dinámica agrupa y agrega datos de forma dinámica. Las cuatro áreas
son:

| Área | Función | Ejemplo |
|---------|----------|----------|
| **Filas** | Agrupación por categoría | Región, producto |
| **Columnas** | Tabulación cruzada | Trimestre, año |
| **Valores** | Función de agregación | Suma de facturación, número de pedidos |
| **Filtros** | Restricción global | Solo 2026, solo región Norte |

**Funciones de resumen disponibles:** suma, recuento, media, máximo, mínimo,
% del resultado total, diferencia respecto al mes anterior, suma acumulada.

**Ejercicio 5.1: Crear una tabla dinámica**

La siguiente tabla de ejercicios **Módulo 5.1 Tabla dinámica** ya está cargada.

> 1. Crea una tabla dinámica: Región y Producto como filas,
>    trimestre como columnas, suma de la facturación como valores.
> 2. Cambia el resumen a media.
> 3. Muestra los valores como % del resultado total.

## 5.2. Agrupaciones y campos calculados

### Concepto: agrupar los datos en categorías significativas

**Agrupación por fecha:** haz clic con el botón derecho en un campo de fecha  Agrupar 
Selecciona meses, trimestres o años.

**Campos calculados** (Análisis de tabla dinámica  Campo calculado):
Crea nuevos campos basados en fórmulas, p. ej.:
```
Margen de beneficio = Beneficio / Facturación
```

**Importante:** Los campos calculados trabajan con los valores **agregados**, no con
los datos brutos. `Beneficio / Facturación` divide la suma de los beneficios entre la suma de la
facturación,  no fila por fila.

**Ejercicio 5.2: Agrupación y campos calculados**

La siguiente tabla de ejercicios **Módulo 5.2 Pivot_Adaptación** ya está cargada.

> 1. Agrupa los valores de fecha por meses y trimestres.
> 2. Crea un campo calculado `Bonificación = Facturación * 0,05`.
> 3. Crea un campo calculado `Margen = (Facturación - Costes) / Facturación`,
>    formateado como porcentaje.

## 5.3. Segmentaciones de datos y ejes temporales

### Concepto: filtros visuales para paneles de control

Los segmentadores (slicers) son botones interactivos que permiten filtrar
tablas dinámicas. Los ejes temporales filtran específicamente por intervalos de fechas.

**Consejo:** Un filtro se puede vincular a **varias tablas dinámicas**
(clic con el botón derecho del ratón en «Conexiones del informe»). Con un solo clic se filtran todas las tablas vinculadas
al mismo tiempo.

**Ejercicio 5.3: Utilizar filtros**

La siguiente tabla de ejercicios **Módulo 5.3 Filtros** ya está cargada.

> 1. Añade segmentadores para «Región» y «Categoría de producto».
> 2. Crea una segunda tabla dinámica («Número por región») y conecta
>    ambas tablas con los mismos segmentadores.
> 3. Añade un eje temporal para la «Fecha del pedido».

## 5.4. Gráficos dinámicos

### Concepto: gráficos que se actualizan al mismo tiempo que la tabla dinámica

Un gráfico dinámico es un gráfico que está directamente vinculado
a una tabla dinámica. Los cambios en los campos, filtros o segmentadores se reflejan inmediatamente en el gráfico
.

**Ejercicio 5.4: Crear un gráfico dinámico**

La siguiente tabla de ejercicios **Módulo 5.4 Gráfico dinámico** ya está cargada.

> 1. Crea un gráfico dinámico (gráfico de columnas) a partir de tu tabla dinámica.
> 2. Añade un segundo filtro y observa cómo el
>    gráfico se adapta automáticamente.
> 3. Cambia el tipo de gráfico a un gráfico de columnas apiladas.

## 5.5. Power Pivot y el modelo de datos (perspectivas)

### Concepto: millones de filas, varias tablas

Power Pivot es un complemento de Excel que amplía el modelo de datos:

- Procesar **varios millones de filas** (muy por encima del límite de 1 millón de filas)
- **Vincular varias tablas** (como en una base de datos)
- **Fórmulas DAX** (Data Analysis Expressions) para cálculos complejos

**Activación:** Archivo → Opciones → Complementos → Administrar: Complementos COM → Power Pivot.

**Importante:** Power Pivot solo está disponible en Excel para Windows (no en Excel
para Mac ni en Excel Online). Para este curso, se trata de una visión general: los
conocimientos básicos sobre tablas dinámicas de los apartados 5.1 a 5.4 constituyen la base.


## Módulo 6: Análisis de datos, escenarios y Solver

**Objetivo de aprendizaje:** Realizar análisis de «qué pasaría si» con la búsqueda de valor objetivo, escenarios y Solver,
así como utilizar minigráficos y líneas de tendencia.

## 6.1. Búsqueda de valores objetivo y tablas de datos

### Concepto: del resultado deseado a la entrada necesaria

La búsqueda de valor objetivo (Datos  Análisis de «qué pasaría si»  Búsqueda de valor objetivo) encuentra el
valor de entrada que conduce al resultado deseado de la fórmula.

**Parámetros:**
- **Celdas de destino:** la celda que contiene la fórmula
- **Valor objetivo:** el valor deseado
- **Celdas variables:** las celdas que Excel debe ajustar

**Las tablas de datos** calculan varios escenarios a la vez:
- **Tabla de datos unidimensional:** variar una variable
- **Tabla de datos bidimensional:** variar dos variables (p. ej., tipo de interés  plazo)

**Ejercicio 6.1: Búsqueda del valor objetivo y tablas de datos**

La siguiente tabla de ejercicios **Módulo 6.1 Búsqueda de valor objetivo** ya está cargada.

> 1. Utilice la búsqueda de valor objetivo: ¿qué precio unitario se necesita para alcanzar unos 100 000 
>    de facturación total?
> 2. Cree una tabla de datos que muestre la cuota mensual para diferentes
>    tipos de interés (3 %-8 %) y plazos (10-30 años).

## 6.2. Gestor de escenarios

### Concepto: comparar varias perspectivas de futuro

El Gestor de escenarios almacena diferentes combinaciones de valores y permite
cambiar rápidamente entre escenarios optimistas, pesimistas y neutros.
**Procedimiento:**

**Procedimiento:**
1. Datos  Análisis de «qué pasaría si...»  Gestor de escenarios
2. Añadir un escenario: nombre, celdas modificables, valores
3. Cambiar entre escenarios o crear un informe resumido

**Ejercicio 6.2  Crear escenarios**

La siguiente tabla de ejercicios **Módulo 6 2 escenarios** ya está cargada.

> 1. Crea tres escenarios: optimista (crecimiento del 10 %), neutral (5 %),
>    pesimista (-2 %).
> 2. Crea un informe de resumen de escenarios.
> 3. Cambia entre los escenarios y observa los efectos
>    sobre el beneficio total.

## 6.3. El Solver

### Concepto: optimización con restricciones

El Solver es una herramienta de optimización que va mucho más allá de la búsqueda de valores objetivo
. Encuentra valores óptimos bajo **varias restricciones**.

**Activar el Solver:** Archivo  Opciones  Complementos  Solver

| Parámetro | Significado | Ejemplo |
|-----------|-----------|----------|
| Celda objetivo | ¿Qué se debe maximizar/minimizar? | $B$10 (beneficio) |
| Valor objetivo | Máximo, mínimo o valor determinado | Máx. |
| Celdas modificables | ¿Qué puede ajustar Excel? | $B$2:$B$5 (cantidades de producción) |
| Restricciones | Limitaciones | $B$2:$B$5 <= $C$2:$C$5 (capacidad máxima) |

**Ejercicio 6.3: Utilizar el Solver**

La siguiente tabla de ejercicios **Módulo 6.3 Solver** ya está cargada.

> 1. Maximice el beneficio bajo las siguientes restricciones:
>    - Cantidad de producción &gt;= 0 (sin cantidades negativas)
>    - Costes totales &lt;= presupuesto (50 000)
>    - Tenga en cuenta la capacidad máxima de producción por producto
> 2. Modifique las restricciones y compare los resultados.

## 6.4. Minigráficos y líneas de tendencia

### Concepto: gráficos en miniatura directamente en las celdas

Las minigráficas son gráficos diminutos dentro de una celda que permiten visualizar las tendencias de un
solo vistazo.

| Tipo de sparkline | Uso |
|--------------|------------|
| Línea | Series temporales, tendencias |
| Columna | Comparaciones entre categorías |
| Ganancias/pérdidas | Evolución positiva/negativa |

**Las líneas de tendencia** en los gráficos normales muestran la tendencia y pueden cuantificar la calidad del ajuste mediante R
.

**Ejercicio 6.4  Sparklines y líneas de tendencia**

La siguiente tabla de ejercicios **Módulo 6.4 Sparklines** ya está cargada.

> 1. Inserta sparklines de línea para las cifras de facturación mensuales.
> 2. Añade una línea de tendencia lineal al gráfico de facturación y haz que
>    R la muestre.
> 3. Interpreta R = 0,87: ¿se trata de una correlación fuerte?


## Módulo 7: Gráficos avanzados y paneles de control

**Objetivo de aprendizaje:** Crear gráficos combinados con eje secundario, gráficos en cascada y
cuadros de mando ejecutivos profesionales.

## 7.1. Tipos de gráficos avanzados

### Concepto: el gráfico adecuado para cada tipo de datos

| Tipo de gráfico | Uso | Ejemplo |
|------------|---------|----------|
| Gráfico combinado (columna + línea) | Dos escalas diferentes | Facturación () + tasa de crecimiento (%) |
| Gráfico en cascada | Efectos acumulados | Cuenta de pérdidas y ganancias |
| Histograma | Distribución de frecuencias | Distribución por edades de los clientes |
| Diagrama de cajas | Distribución estadística | Cuartiles, valores atípicos |

**Consejo:** Un gráfico combinado con eje secundario resulta ideal para
comparaciones entre valores teóricos y reales: columnas para los valores reales, línea para los valores teóricos.

**Ejercicio 7.1  Crear un diagrama combinado**

La siguiente tabla de ejercicios **Módulo 7.1 Diagrama combinado** ya está cargada.

> 1. Crea un gráfico combinado: volumen de negocio en columnas, tasa de crecimiento en línea
>    con eje secundario.
> 2. Formatea el eje izquierdo en y el eje derecho en %.
> 3. Añade indicadores de error (desviación estándar).

## 7.2. Gráficos en cascada y gráficos especiales

### Concepto: visualizar efectos acumulados

Un gráfico en cascada muestra cómo un valor inicial se convierte en un valor final a través de una serie de variaciones positivas
y negativas; es ideal para análisis financieros.

**Ejercicio 7.2  Diagrama en cascada**

La siguiente tabla de ejercicios **Módulo 7.2 Cascada** ya está cargada.

> 1. Crea un diagrama en cascada a partir de una cuenta de resultados.
> 2. Aplica el formato siguiente: aumentos en verde, disminuciones en rojo y valor total en azul.
> 3. Añade etiquetas de datos a las columnas.

## 7.3. Diseño de cuadros de mando

### Concepto: todos los KPI de un vistazo

Un panel de control reúne varios gráficos, minigráficos y métricas en una
hoja clara y ordenada. Los principios de diseño son los siguientes:

1. **Arriba a la izquierda = información más importante**: la mirada se dirige primero hacia allí
2. **Máximo 46 elementos**: menos es más
3. **Colores coherentes**: mismo significado = mismo color
4. **Filtros para mayor interactividad**: con un clic se filtran todos los gráficos

**Ejercicio 7.3: Crear un panel de control**

La siguiente tabla de ejercicios **Módulo 7.3: Panel de control** ya está cargada.

> 1. Cree en una hoja nueva:
>    - Un gráfico de líneas (evolución de la facturación en los últimos 12 meses)
>    - Un gráfico de columnas (volumen de negocio por región)
>    - Gráficos minúsculos por categoría de producto
>    - Filtros para región y año
> 2. Organice los elementos de forma clara (utilice la cuadrícula).
> 3. Oculte las líneas de la cuadrícula y los encabezados para conseguir un
>    aspecto profesional.


## Módulo 8: Automatización con macros

**Objetivo de aprendizaje:** Grabar, ejecutar y editar macros de forma básica en VBA.

## 8.1. Comprender y grabar macros

### Concepto: realizar una sola vez las tareas recurrentes

Una macro es una secuencia grabada de pasos de trabajo que Excel puede
repetir con solo pulsar un botón. Las macros se guardan en el lenguaje de programación VBA
(Visual Basic for Applications).

**Grabación absoluta frente a relativa:**
- **Grabación absoluta**: la macro siempre opera en las mismas celdas (p. ej., A1)
- **Grabación relativa**: la macro opera en relación con la posición actual

**Importante:** Las macros solo funcionan en archivos `.xlsm`, no en `.xlsx`.
Activa primero la pestaña «Herramientas de desarrollo».

**Ejercicio 8.1: Activar la pestaña «Herramientas de desarrollo» y grabar una macro**

La siguiente tabla de ejercicios **Módulo 8.1 Grabación de macros** ya está cargada.

> 1. Activa la pestaña «Herramientas de desarrollo» y guarda el archivo como `.xlsm`.
> 2. Graba una macro que formatee un informe: título en negrita
>    y centrado, encabezado en azul, borde alrededor del área de datos.
> 3. Ejecuta la macro en una segunda hoja de cálculo.

## 8.2. Ejecutar y asignar macros

### Concepto: iniciar macros con solo pulsar un botón

| Método de ejecución | Ventaja |
|-------------------|---------|
| Cuadro de diálogo «Macros» (vista «Macros») | Resumen de todas las macros |
| Combinación de teclas (definida durante la grabación) | Acceso más rápido |
| Botón (control de formulario) | Intuitivo para otros usuarios |
| Forma (objeto gráfico insertado) | Diseño flexible |

**Ejercicio 8.2  Asignar una macro**

La siguiente tabla de ejercicios **Módulo 8.2 Asignar macro** ya está cargada.

> 1. Asigne su macro a un botón (Herramientas de desarrollo  Insertar 
>    Botón).
> 2. Configure una combinación de teclas `Ctrl+Mayús+F` para la macro.
> 3. Pruebe ambos métodos de ejecución.

## 8.3. El editor de VBA

### Concepto: comprender el código grabado

El editor de VBA (`Alt+F11`) muestra el código generado. Incluso sin
conocimientos de programación, puede realizar cambios sencillos.

| Área | Función |
|---------|----------|
| Explorador de proyectos | Todos los libros y módulos abiertos |
| Ventana de código | El código VBA |
| Ventana de propiedades | Propiedades de hojas y controles |
| Área de ejecución (`Ctrl+G`) | Probar el código en tiempo real |

**Ejercicio 8.3: Explorar el editor de VBA**

La siguiente tabla de ejercicios **Módulo 8.3 Editor de VBA** ya está cargada.

> 1. Abre el editor de VBA con `Alt+F11`.
> 2. Busca la macro que has grabado en el Explorador de proyectos.
> 3. Cambia un color en el código (por ejemplo, `.Color = RGB(0, 0, 255)` para el azul).


## Módulo 9: Programación en VBA (conceptos básicos)

**Objetivo de aprendizaje:** comprender los conceptos básicos de VBA, escribir procedimientos sencillos
y utilizar los eventos de Excel.

## 9.1. Variables y tipos de datos

### Concepto: almacenar y procesar valores

| Tipo de datos | Uso | Ejemplo |
|----------|-----------|----------|
| Integer | Números enteros | `Dim número As Integer` |
| Double | Números decimales | `Dim precio As Double` |
| String | Texto | `Dim nombre As String` |
| Boolean | Verdadero/Falso | `Dim encontrado As Boolean` |
| Range | Rango de celdas | `Dim celda As Range` |

```vba
Dim volumenAsDouble
volumen = Range("B2").Value * Range("C2").Value
```

**Ejercicio 9.1  Variables y cálculos sencillos**

La siguiente tabla de ejercicios **Módulo 9.1 VBA_Variables** ya está cargada.

> 1. Escribe una macro que lea dos valores de celdas y escriba el producto
>    en una tercera celda.
> 2. Amplía la macro: muestra el resultado con `MsgBox`.
> 3. Prueba con diferentes valores de entrada.

## 9.2. Estructuras de control: condiciones y bucles

### Concepto: ejecutar código solo en determinadas circunstancias

**If-Then-Else:**
```vba
If Range("B2").Value > 1000 Then
    Range("C2").Value = "Pedido grande"
Else
    Range("C2").Value = "Estándar"
End If
```

**Bucle «For»:**
```vba
For i = 1 To 10
    Range("A" & i).Value = i
Next i
```

**Ejercicio 9.2: Condiciones y bucles**

La siguiente tabla de ejercicios **Módulo 9.2 Estructuras de control de VBA** ya está cargada.

> 1. Escribe una macro con un bucle «For» que escriba el número 110 en las celdas A1 a A10
>    .
> 2. Amplía la macro con una condición «If»: los números > 5 se formatearán en negrita
>    .
> 3. Escribe un bucle «For Each» que resalte en amarillo todas las celdas con un valor > 1000
>    .

## 9.3. Eventos de Excel

### Concepto: código que reacciona automáticamente

Los eventos ejecutan código VBA automáticamente cuando ocurre algo concreto.

| Evento | Cuándo se activa |
|----------|---------------|
| `Worksheet_Change` | Cuando se modifica una celda |
| `Workbook_Open` | Cuando se abre el libro |
| `Worksheet_SelectionChange` | Cuando se selecciona otra celda |

```vba
Private Sub Worksheet_Change(ByVal Target As Range)
    If Target.Column = 2 And Target.Value > 10000 Then
        MsgBox "Importe elevado: " & Target.Value
    End If
End Sub
```

**Ejercicio 9.3  Programación de eventos**

La siguiente hoja de ejercicios **Módulo 9.3 Eventos VBA** ya está cargada.

> 1. Crea un evento Worksheet_Change que muestre un mensaje
>    cuando se introduzca un valor superior a 10 000 en la columna B.
> 2. Crea un evento Workbook_Open que, al abrir el libro,
>    escriba la fecha de hoy en la celda A1.

## 9.4. Funciones definidas por el usuario (UDF)

### Concepto: escribir funciones propias de Excel en VBA

```vba
Function IVA(Importe As Double) As Double
    IVA = Importe * 0,19
End Function
```

A continuación, puede escribir en Excel `=IVA(100)`.  Resultado: 19.

**Ejercicio 9.4: Crear una UDF**

La siguiente tabla de ejercicios **Módulo 9.4 VBA_UDF** ya está cargada.

> 1. Escribe una función definida por el usuario (UDF) `Bonus(Volumen de ventas)` que calcule un 5 % de bonificación a partir de 10 000,
>    y 0 % en los demás casos.
> 2. Utilice su función definida por el usuario en una fórmula: `=Bonus(B2)`.
> 3. Cree una función definida por el usuario `Kategorie(Alter)` con If/ElseIf para los
>    grupos de edad <30, 30-50 y >50.


## 9.5. Buenas prácticas para macros

### Concepto: código que se pueda entender mañana

| Práctica | Ejemplo |
|--------|----------|
| **Nombres descriptivos** | `Sub FormatoInformeMensual()` en lugar de `Sub Macro1()` |
| **Comentarios** | `' Cálculo del IVA (19 %)` antes de las líneas importantes |
| **Gestión de errores** | `On Error GoTo Error` con mensajes descriptivos |
| **Option Explicit** | Al principio de cada módulo: obliga a declarar las variables |
| **Sangría coherente** | `Tab` para cada nivel de anidación |

**Consejo:** `Option Explicit` al principio del módulo VBA protege contra errores tipográficos en
los nombres de las variables, la fuente de errores más habitual en las macros.

## Módulo 10: Colaboración, plantillas y productividad

**Objetivo de aprendizaje:** Optimizar los libros de trabajo para la colaboración, crear
plantillas profesionales y dominar técnicas de productividad.

## 10.1. Plantillas profesionales

### Concepto: crearlas una vez, reutilizarlas siempre

Una plantilla de Excel (`.xltx`) contiene el diseño, las fórmulas y el formato, 
pero no datos específicos. Al abrirla, se crea un nuevo libro
basado en la plantilla.

**Crear una plantilla:** Archivo  Guardar como  Tipo de archivo: Plantilla de Excel (`.xltx`)

| Elemento de la plantilla | Ejemplo |
|----------------|----------|
| Celdas de fórmula protegidas | Cálculo del IVA bloqueado |
| Áreas con nombre | `Ingresos_2026`, `Gastos_2026` |
| Listas desplegables | Departamentos, categorías de productos |
| Formato condicional | Superación del presupuesto en rojo |

**Ejercicio 10.1: Crear una plantilla**

La siguiente tabla de ejercicios **Módulo 10 1 Plantillas** ya está cargada.

> 1. Crea una plantilla de factura con: un área con el logotipo de la empresa en el encabezado,
>    número de factura automático, cálculo del IVA y celdas de fórmula protegidas.
> 2. Guárdala como `.xltx`.
> 3. Abre la plantilla y comprueba si se crea un nuevo libro.

## 10.2. Colaboración y uso compartido

### Concepto: trabajar conjuntamente en un archivo

| Función | Uso |
|----------|-----------|
| Comentarios | Consultas directamente en las celdas (Revisar  Nuevo comentario) |
| Seguimiento de cambios | ¿Quién ha cambiado qué y cuándo? (solo versiones antiguas de Excel) |
| Compartir el libro | Edición simultánea (Excel 365: automática con OneDrive/SharePoint) |
| Protección de hojas con permisos | Solo determinados usuarios pueden editar áreas concretas |

**Formatos de exportación:**

| Formato | ¿Cuándo utilizarlo? |
|--------|----------------|
| `.xlsx` | El destinatario debe seguir trabajando en el archivo |
| `.pdf` | Versión definitiva, independiente de la plataforma |
| `.xlsb` | Archivos grandes (binario, más rápido) |

**Ejercicio 10.2: Preparar para la colaboración**

La siguiente tabla de ejercicios **Módulo 10.2 Colaboración** ya está cargada.

> 1. Añade un comentario a una celda (clic con el botón derecho  Nuevo comentario).
> 2. Exporta la hoja como PDF con saltos de página.
> 3. Configura la protección de la hoja de modo que solo las celdas de entrada sean editables
>    para los colaboradores externos.

## 10.3. Complementos y Power Query (perspectiva)

### Concepto: ampliar las posibilidades de Excel más allá de sus límites

Los **complementos** (Archivo → Opciones → Complementos) amplían las funciones de Excel con herramientas especializadas:
- **Solver**: optimización (se trata en el módulo 6)
- **Funciones de análisis**: funciones estadísticas avanzadas
- **Power Pivot**: modelo de datos para grandes volúmenes de datos

**Power Query** (Datos → Obtener y transformar) es la herramienta ETL moderna
de Excel. Importa, limpia y transforma datos de cualquier fuente:
- Archivos CSV, TXT y de Excel
- Bases de datos SQL, páginas web, API
- Carpetas completas con archivos de estructura uniforme

Todos los pasos de transformación se registran y son repetibles,
de forma similar a una macro, pero para fuentes de datos.

**Consejo:** Power Query es el sucesor del antiguo Asistente para la importación de texto y
debería utilizarse para todas las tareas de importación de datos.

## 10.4. Combinaciones de teclas avanzadas

### Concepto: el teclado en lugar del ratón: eficiencia profesional

| Atajo | Acción |
|--------|--------|
| `Ctrl+1` | Dar formato a celdas (cuadro de diálogo universal) |
| `Ctrl+F3` | Administrador de nombres |
| `Alt+F11` | Editor de VBA |
| `Ctrl+Mayús+L` | Activar/desactivar el filtro automático |
| `Ctrl+Mayús+Intro` | Completar fórmula matricial |
| `F4` | Repetir la última acción / Cambiar el tipo de referencia |
| `Ctrl+[` | Mostrar celdas anteriores |
| `Ctrl+]` | Mostrar celdas posteriores |
| `Alt+=` | Autosuma |
| `F9` | Volver a calcular todas las fórmulas (en cálculo manual) |

**Ejercicio 10.4: Practicar atajos de teclado**

La siguiente tabla de ejercicios **Módulo 10.4 Atajos de teclado** ya está cargada.

> 1. Utiliza exclusivamente combinaciones de teclas para
>    dar formato a una tabla, calcular una suma y aplicar un filtro.
> 2. Utiliza `Ctrl+[` y `Ctrl+]` para analizar fórmulas.
> 3. Utiliza la tecla F4 para cambiar entre los tipos de referencia al editar una fórmula.

---

*Plan de estudios elaborado según los principios de la andragogía (Knowles, 1980) y el
marco europeo de competencias digitales DigComp 2.2 (Vuorikari et al., 2022).*
