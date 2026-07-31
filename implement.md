¡Continuamos con la undécima entrega de la revisión! En esta fase, vamos a destapar **el desequilibrio estructural en los módulos**, **inconsistencias en los datos de prueba (seed)**, **peligros de seguridad en el backend**, la **pedagogía de las pistas** y **el manejo de filas vacías**.

---

### 1. Desequilibrio Estructural en los Módulos (Course 3)

El Curso 3 (`course3_fortgeschrittene.json`) presume de tener 10 módulos y 108 ejercicios. Sin embargo, la distribución de los ejercicios por módulo es alarmantemente desigual, lo que arruinará la experiencia de aprendizaje (UX) en tu frontend.

*   **Módulo 2 (Funciones Avanzadas):** Contiene casi la mitad del curso (Ejercicios 5 al 41 = **37 ejercicios**). Un módulo tan masivo abrumará al alumno y hará que el menú de navegación lateral (sidebar) sea interminable.
*   **Módulo 4 (Bases de Datos):** Tiene 13 ejercicios (51 al 63).
*   **Módulo 6 (Análisis de Datos):** Tiene 32 ejercicios (69 al 100).
*   **Los "Módulos Fantasma" (M7 a M10):**
    *   Módulo 7 (Gráficos): 2 ejercicios (101, 102).
    *   Módulo 8 (Macros): 2 ejercicios (103, 104).
    *   Módulo 9 (VBA): 2 ejercicios (105, 106).
    *   Módulo 10 (Colaboración): 2 ejercicios (107, 108).
*   **El Problema:** Un módulo con solo 2 ejercicios no es un módulo, es un apéndice. El alumno sentirá que le faltan contenidos.
*   **Solución:** Reestructura los módulos. Divide el M2 en M2 (Búsqueda), M3 (Lógica), M4 (Texto/Fecha). Agrupa M7 y M8 en un módulo de "Visualización y Automatización", o elimina los módulos vacíos y fusiona sus ejercicios en un módulo de "Productividad y Extras".

---

### 2. Inconsistencias en los Datos de Prueba (`seed_data.ts`)

En el archivo `seed_data.ts`, creas un entorno de demostración para profesores y alumnos. Hay problemas de coherencia cultural y de roles:

*   **Mezcla de Idiomas en Usuarios:**
    *   Email: `profesor@excel-lenz.edu` (Español)
    *   Nombre: `Profesor García` (Español)
    *   vs. Email: `alumno@excel-lenz.edu` (Español) / Nombre: `María López` (Español)
    *   *Problema:* Si la plataforma es para el mercado alemán (los USPs en `home_content.json` están en alemán), tener usuarios de prueba en español confunde al equipo de ventas o a los beta testers.
    *   *Solución:* Cámbialos a `dozent@excel-lenz.edu` (`Lehrer Müller`) y `student@excel-lenz.edu` (`Anna Schmidt`).
*   **Rol "teacher" vs "student":**
    *   Si tu backend utiliza estos roles para mostrar dashboards diferentes (ej. el profesor ve el progreso de todos), asegúrate de que tu middleware de Next.js/Express proteja las rutas `/api/progress` para que un `student` no pueda ver las respuestas correctas o los datos de otros usuarios. El archivo `seed_data.ts` no muestra la lógica de RBAC, pero es un recordatorio crítico.

---

### 3. Peligro de Seguridad: Contraseñas Hardcodeadas

En `seed_data.ts`, línea 17:
`const hash = bcrypt.hashSync('password123', 10);`

*   **El Problema:** Aunque es un script de seeding, si este código se sube a un repositorio público (GitHub) y la base de datos de producción no se reinicia, cualquiera que lea el código sabrá que el usuario `profesor@excel-lenz.edu` tiene la contraseña `password123`.
*   **Solución:** Usa variables de entorno para las contraseñas de seedeo:
    `const hash = bcrypt.hashSync(process.env.SEED_PASSWORD || 'devpassword', 10);`

---

### 4. La Pedagogía de las Pistas: El "Spoiler" Automático

En muchos ejercicios, el campo `formulaHint` contiene la respuesta exacta, y los campos `hint1`, `hint2`, `hint3` repiten la misma información de forma incremental.

*   **Ejemplo (Curso 1, Ex 12):**
    *   `hint1`: "MwSt = Nettopreis × 19% → =B2*0,19"
    *   `hint2`: "Bruttopreis = Nettopreis + MwSt → =B2+C2"
    *   `hint3`: "Ziehe beide Formeln für alle Zeilen herunter"
    *   `formulaHint`: "=B2*0,19 / =B2+C2"
*   **El Problema UX:** Si el frontend muestra un botón "Pista 1" y el alumno hace clic, inmediatamente ve la fórmula completa (`=B2*0,19`). Esto no es una pista, es la solución. No hay proceso de descubrimiento.
*   **Solución (Mejora Pedagógica):**
    *   **Hint 1 (Conceptual):** "Überlege: Wie viel sind 19% vom Nettopreis? Welche Funktion brauchst du dafür?"
    *   **Hint 2 (Sintaxis):** "Die Formel beginnt mit einem Gleichheitszeichen. Multipliziere die Zelle B2 mit 0,19."
    *   **Hint 3 (Construcción):** "Schreibe =B2*0,19 in C2 und =B2+C2 in D2."
    *   De esta manera, el alumno tiene que pensar un poco antes de llegar a la respuesta final.

---

### 5. Manejo de Filas Vacías en las Plantillas

En tus `template.data`, es común ver filas vacías intercaladas para separar secciones visualmente:
`["", "", "", ""]`

*   **El Problema de Validación:** Cuando el alumno envíe su cuadrícula, tu backend recorrerá las filas. Si una fila está vacía en la plantilla (`["", "", "", ""]`) pero en la solución tiene datos, o viceversa, la comparación fallará.
*   **El Problema de UI:** Las librerías como Handsontable a veces eliminan automáticamente las filas completamente vacías al final, pero no en el medio.
*   **Solución:** En lugar de usar arrays de strings vacíos `["", "", "", ""]`, usa `null` para las celdas vacías: `[null, null, null, null]`. Y en tu backend, ignora las filas que son `Array.every(cell => cell === null || cell === "")` antes de comparar con la solución.

---

### 6. Redundancia en las Descripciones de los Cursos

En `course_theory.tsx`, el objeto `COURSE_TRANSLATIONS` tiene descripciones que no coinciden con la realidad del JSON:

*   Curso 1: `"description": "...7 strukturierte Module mit 27 praxisnahen Übungen..."`
    *   *Realidad:* El JSON del Curso 1 no tiene la propiedad `modules` definida (solo tiene `exercises`). El Curso 3 y el Curso 4 sí tienen la propiedad `modules`. Deberías añadir la estructura de módulos al Curso 1 y 2 para que el frontend pueda renderizar el índice.
*   Curso 3: `"description": "...108 praxisorientierte Übungen..."`
    *   *Realidad:* Aunque hay 108 ejercicios, recordemos que el Curso 4 copia 22 de ellos. Si un alumno hace el Curso 3 y luego el 4, sentirá que le han engañado.

### Resumen de la Fase 11:
1. **Reestructura los módulos del Curso 3:** No puedes tener un módulo con 37 ejercicios y tres módulos con solo 2 ejercicios cada uno.
2. **Limpia el `seed_data.ts`:** Cambia los nombres a alemán y usa variables de entorno para las contraseñas.
3. **Mejora las pistas:** Conviértelas en pistas progresivas reales, no en soluciones instantáneas.
4. **Maneja los `nulls`:** Estandariza las celdas vacías en las plantillas para que tu backend no se confunda al evaluar.
5. **Añade `modules` a todos los cursos:** Asegúrate de que Curso 1 y 2 también tengan su estructura de módulos en el JSON para que el frontend pueda pintar el sidebar.