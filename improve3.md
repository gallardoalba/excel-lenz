Continuando con la revisión exhaustiva, entraremos ahora en detalles de **mantenibilidad del código, validación de datos en el backend, manejo de errores de red y características avanzadas para el simulador de Excel**.

---

### 🧹 11. Mantenibilidad y Buenas Prácticas (Código Limpio)

**11.1. Año hardcodeado en el Footer (`App.tsx`)**
*   **El problema:** En el footer tienes `© 2026 Excel-lenz. Alle Rechte vorbehalten.`. El año está escrito a mano en el código. Llegado el año 2027, tendrás que acordarte de entrar a modificarlo.
*   **Solución:** Usa el objeto `Date` de JavaScript para que sea dinámico:
    ```tsx
    © {new Date().getFullYear()} Excel-lenz. Alle Rechte vorbehalten.
    ```

**11.2. Abuso de estilos en línea (Inline Styles)**
*   **El problema:** A lo largo de `App.tsx`, `Login.tsx` y `Register.tsx` hay muchos estilos inline, por ejemplo: `style={{ borderColor: 'var(--danger)', marginBottom: 20, background: 'var(--danger-light)' }}` o `style={{marginRight:4}}`.
*   **Solución:** Para componentes que se repiten (como las alertas de error o los iconos), es mucho más limpio crear clases CSS reutilizables en tu hoja de estilos. Por ejemplo, en lugar de todo ese estilo inline, usa `<div className="alert alert-danger">`. Esto reduce el peso del componente, facilita la lectura y permite que el navegador cachee el CSS.

**11.3. Centralización de constantes mágicas**
*   **El problema:** En `auth.ts` tienes `MAX_ATTEMPTS = 5` y `WINDOW_MS = 15 * 60 * 1000`. En `App.tsx` tienes `30_000` para el intervalo de la meta diaria.
*   **Solución:** Aunque está bien para variables locales, a medida que la app crezca, deberías crear un archivo `config.ts` o usar variables de entorno (`.env`) para valores que podrían cambiar en el futuro (ej: el tiempo de expiración del token, los límites del rate limiter, etc.).

---

### 🛡️ 12. Seguridad y Validación de Datos (Backend)

**12.1. Falta validación de formato de Email (`auth.ts`)**
*   **El problema:** En el endpoint `/register`, compruebas que exista el email, pero no validas su formato. Un alumno podría introducir `"asdfasdf"` como email. La base de datos lo aceptará, pero luego el alumno no podrá recuperar su contraseña ni recibir notificaciones.
*   **Solución:** Añade una validación con Regex simple antes de hashear la contraseña:
    ```typescript
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Ungültiges E-Mail-Format' });
      return;
    }
    ```

**12.2. Desactualización del Rol en el Token JWT (`auth_middleware.ts` y `auth.ts`)**
*   **El problema:** Cuando un usuario inicia sesión, firmas un JWT con su `role: 'student'`. El token dura 24 horas. Si durante esas 24 horas un administrador cambia el rol del usuario a `'teacher'` en la base de datos, el usuario seguirá teniendo rol de `'student'` en el frontend hasta que el token expire y vuelva a iniciar sesión.
*   **Solución (a considerar):** Esto es un problema común en arquitecturas JWT. Para una plataforma educativa pequeña, es aceptable. Pero si necesitas seguridad estricta, puedes añadir un campo `tokenVersion` en la tabla de usuarios. Si cambias el rol, incrementas la versión. El middleware comprueba si la versión del token coincide con la de la base de datos.

**12.3. Rate Limiter en memoria (No escala) (`auth.ts`)**
*   **El problema:** Usas `const loginAttempts = new Map<string, ...>()`. Esto vive en la RAM de tu servidor Node.js. Si despliegas tu aplicación en múltiples instancias (ej. un clúster en AWS o Railway con 2 contenedores), la instancia A no sabrá los intentos fallidos que registró la instancia B. Un atacante podría eludir el límite de 5 intentos.
*   **Solución:** Para producción, si escalas horizontalmente, necesitarás almacenar el rate limiting en una base de datos rápida como **Redis** usando librerías como `rate-limit-redis`.

---

### 🌐 13. Robustez de la Red y Fetching

**13.1. Errores de red no capturados (`AuthContext.tsx`)**
*   **El problema:** Tu función `apiFetch` asume que la petición `fetch` siempre llegará al servidor. Pero, ¿qué pasa si el alumno se queda sin internet a mitad de un ejercicio, o si el servidor está caído? `fetch` lanzará un error de red (`TypeError: Failed to fetch`), y el mensaje que verá el alumno será poco amigable.
*   **Solución:** Envuelve el `fetch` en un try-catch para interceptar errores de red y devolver un mensaje estándar:
    ```typescript
    try {
      const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
      // ... tu lógica existente
    } catch (networkError) {
      throw new Error('Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.');
    }
    ```

---

### ⌨️ 14. Mejoras de UX en Formularios (`Login.tsx` y `Register.tsx`)

**14.1. Prevención de envíos múltiples**
*   **El problema:** Aunque desactivas el botón de envío con `disabled={loading}`, un alumno impaciente podría presionar "Enter" varias veces rápidamente antes de que el estado `loading` se ponga en `true` (por la latencia del primer renderizado).
*   **Solución:** Añade una protección a nivel de función en `handleSubmit`:
    ```typescript
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (loading) return; // Guard clause adicional
      // ...
    }
    ```

**14.2. Mantenimiento del foco en errores**
*   **El problema:** Cuando el login falla, muestras un mensaje de error en la parte superior del formulario. Los usuarios de lectores de pantalla no sabrán que ha ocurrido un error a menos que muevas el foco a ese elemento.
*   **Solución:** Usa un `ref` en el div del error y haz `errorRef.current?.focus()` cuando el estado de error cambie. Asegúrate de darle `tabIndex={-1}` al div para que pueda recibir el foco programáticamente.

---

### 📝 15. Detalles Específicos para el Simulador de Excel (EdTech Avanzado)

Como tu plataforma se centra en un simulador de Excel (componente `Exercise.tsx`), hay ciertas características que los alumnos esperan intensamente:

**15.1. Autoguardado local (Local Storage Protection)**
*   **El problema:** Si el alumno está escribiendo una fórmula larga como `=WENN(SVERWEIS(A1;Daten!A:B;2;FALSCH)>100;"Alto";"Bajo")` y recarga la página accidentalmente o se cierra el navegador, perderá todo su trabajo.
*   **Solución:** En el componente `Exercise.tsx` (cuando lo desarrolles), guarda el estado de las celdas del alumno en el `localStorage` cada pocos segundos o ante cada cambio significativo (debounce). Al cargar el componente, comprueba si hay un borrador guardado y ofrécele al alumno "Restaurar trabajo no guardado".

**15.2. Diferenciación entre fórmulas y texto plano**
*   **El problema:** En la interfaz visual de tu simulador, el alumno debe saber claramente qué celdas aceptan texto y cuáles requieren fórmulas.
*   **Mejora Visual:** Usa colores sutiles de fondo en las celdas de la tabla simulada. Por ejemplo, celdas con fondo gris claro para datos de entrada (input) y celdas con fondo blanco para fórmulas (output/cálculo). Es el estándar visual no escrito en el modelado de hojas de cálculo.

**15.3. Resaltado de referencias (Cross-referencing)**
*   **El problema:** En Excel real, cuando seleccionas una celda que tiene una fórmula como `=A1+B1`, las celdas A1 y B1 se resaltan con bordes de colores.
*   **Mejora Visual:** Si tu simulador evalúa cadenas de texto como fórmulas, intentar implementar un parser básico con Regex que detecte referencias como `A1`, `B2:C5` y resalte esas celdas temporalmente. Esto mejora brutalmente la curva de aprendizaje del alumno.

### Resumen de esta fase:
1. **Valida siempre los formatos** (emails, números) en el backend, nunca confíes en el frontend.
2. Protege la experiencia del alumno ante **caídas de red** con mensajes claros.
3. Si vas a escalar, el rate limiter en memoria te traerá problemas de seguridad; valora **Redis**.
4. El **autoguardado en localStorage** es la característica número uno que debes implementar en tu componente de ejercicios de Excel para evitar la frustración del alumno.