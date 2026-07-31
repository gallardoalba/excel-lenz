# Excel-lenz — Rediseño de la Página de Detalle de Curso

> **Fecha**: 2026-07-31  
> **URL**: `/courses/:id` (ej: `/courses/8f42e51a-e5b7-4168-afe7-edd22211d47e`)  
> **Archivo**: `frontend/src/pages/CourseDetail.tsx` + `frontend/src/index.css`

---

## 1. Índice

1. [Diagnóstico de la Implementación Actual](#2-diagnóstico-de-la-implementación-actual)
2. [Datos Disponibles (API)](#3-datos-disponibles-api)
3. [Problemas Identificados](#4-problemas-identificados)
4. [Propuestas de Mejora](#5-propuestas-de-mejora)
5. [Mockup del Diseño Propuesto](#6-mockup-del-diseño-propuesto)
6. [Plan de Implementación](#7-plan-de-implementación)

---

## 2. Diagnóstico de la Implementación Actual

### 2.1 Estructura Visual Actual

```
┌─────────────────────────────────────────────────┐
│ [← Zurück]                                      │ ← Link de retorno
│ [ICONO]  Excel-Grundlagen  [Anfänger]           │ ← Título + badge
│          Descripción del curso...                │
│          ▓▓▓▓▓▓▓░░░ 15/27 · 56%                 │ ← Barra de progreso
└─────────────────────────────────────────────────┘
│                                                 │
│  📚  Kursinhalte                                │ ← Título de sección
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ Modul 1: Einführung...              [>] │    │ ← Módulo clickeable
│  │ 4 Übungen · ~20 Min · 4/4 erledigt     │    │
│  │ ▓▓▓▓▓▓▓▓▓▓ 100%                        │    │
│  └─────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────┐    │
│  │ Modul 2: Dateneingabe...           [>] │    │
│  │ 4 Übungen · ~22 Min · 2/4 erledigt     │    │
│  │ ▓▓▓▓▓░░░░░ 50%                          │    │
│  └─────────────────────────────────────────┘    │
│  ... (7 módulos)                                │
│                                                 │
│  ┌─── Function Map (solo logueado) ─────────┐   │
│  │   Visualización de skills                │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
│  (MUCHO ESPACIO EN BLANCO a los lados)          │
└─────────────────────────────────────────────────┘
```

### 2.2 Componentes Actuales

| Componente | Estado | Problema |
|-----------|--------|----------|
| Hero header | ✅ | Descriptivo pero ocupa poco espacio visual; no hay CTA |
| Módulos (lista) | ✅ | Funciona, pero todos los módulos son idénticos visualmente |
| Lista de ejercicios | ✅ | Bien implementada con scores, lock, números |
| Function Map | ✅ | Solo visible para usuarios logueados |
| **Sidebar/TOC** | ❌ | No existe — el usuario no tiene vista general |
| **CTA "Comenzar/Continuar"** | ❌ | No hay botón para iniciar el curso |
| **Panel de skills/objetivos** | ❌ | Los learningObjectives están en los datos pero no se muestran |
| **Tiempo total estimado** | ❌ | Cada módulo muestra tiempo, pero no hay suma total |
| **Indicador de prerequisite chain** | ❌ | Los prerrequisitos existen en los datos pero no se visualizan |

### 2.3 CSS Actual

| Selector | Rol |
|----------|-----|
| `.course-hero-header` | Header con icono, título, descripción, progreso |
| `.module-row` | Cada módulo clickeable |
| `.exercise-row` | Cada ejercicio en la lista expandida |
| `.hero-img` | Contenedor del icono del curso (80×80, fondo primary) |

### 2.4 Flujo de Navegación

```
Courses (/courses)
  └─→ CourseDetail (/courses/:id)
        ├─ Vista general: lista de módulos
        │    └─→ Click en módulo: lista de ejercicios de ese módulo
        │         └─→ Click en ejercicio: Exercise (/exercises/:id)
        └─ Function Map (si logueado)
```

---

## 3. Datos Disponibles (API)

### 3.1 Endpoint: `GET /courses/:id`

```typescript
{
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  user_progress?: { completed: number; total: number };
  exercises: [{
    id: string;
    title: string;
    description: string;
    order_index: number;
    estimated_minutes?: number;
    prerequisites?: string[];
    moduleId?: string;
    moduleSection?: string;
    moduleTitle?: string;
    sectionTitle?: string;
    // + user_score, completed (si logueado)
  }];
  modules: [{
    id: string;
    title: string;
    description?: string;
    sections: [{
      id: string;
      title: string;
      exercises: Exercise[];
    }];
  }];
}
```

### 3.2 Datos del JSON de ejercicios (template_data)

```json
{
  "learningObjectives": ["Objetivo 1", "Objetivo 2", ...],
  "estimated_minutes": 5,
  "theoryTitle": "Título de la teoría",
  "theory": "Contenido markdown de teoría",
  "prerequisites": [],
  "hint1": "...",
  "hint2": "...",
  "hint3": "...",
  "formulaHint": "..."
}
```

**⚠️ Nota**: `learningObjectives`, `theoryTitle`, `theory`, y los hints **no se exponen en la API actual**. El backend solo extrae `estimated_minutes`, `prerequisites`, y los campos de módulo. Ver sección "Anexo Técnico" para la modificación necesaria del backend.

### 3.3 Datos del JSON de curso (modules_meta)

```json
{
  "modules": [{
    "id": "m1",
    "title": "Modul 1: Einführung in Excel...",
    "description": "Vertrautwerden mit der Excel-Oberfläche...",
    "sections": [{
      "id": "1.1",
      "title": "¿Qué es Excel y para qué sirve?",
      "desc": "Diferencia entre libro y hoja."
    }]
  }]
}
```

**⚠️ Nota**: El campo `desc` de las secciones no se usa actualmente en el frontend.

---

## 4. Problemas Identificados

### 🔴 Críticos

| # | Problema | Impacto |
|---|----------|---------|
| P1 | **Sin CTA principal** — no hay botón "Comenzar curso" o "Continuar" | El usuario no sabe por dónde empezar |
| P2 | **Espacio desaprovechado** — el 50% del ancho está vacío en desktop | Mala experiencia visual, parece incompleto |
| P3 | **Sin tabla de contenidos (TOC)** — 7 módulos en lista plana, sin navegación rápida | El usuario debe hacer scroll para ver todos |

### 🟡 Medios

| # | Problema | Impacto |
|---|----------|---------|
| P4 | **Módulos visualmente idénticos** — no hay iconos, colores, ni distinción | Monótono, difícil escanear |
| P5 | **Learning objectives no visibles** — existen en los datos pero no se muestran | Pierde valor pedagógico |
| P6 | **Sin tiempo total del curso** — solo se ve por módulo | El usuario no sabe el compromiso total |
| P7 | **Function Map descontextualizado** — aparece al final sin explicación | Parece un añadido, no integrado |
| P8 | **Sin breadcrumb contextual** — actualmente muestra "Kursdetails" genérico | Poco informativo |

### 🟢 Menores

| # | Problema | Impacto |
|---|----------|---------|
| P9 | **Sin animaciones de transición** entre vista general y módulo | Cambio brusco |
| P10 | **Header no sticky** — al hacer scroll en ejercicios se pierde el contexto | Navegación menos fluida |
| P11 | **Sin información del instructor/dificultad visual** | Falta calidez pedagógica |

---

## 5. Propuestas de Mejora

### 5.1 Layout de 2 Columnas (Desktop) ⭐ *Recomendado*

Transformar la página en un **layout de dos columnas**:

```
┌──────────────────────────────────────────────────────────────┐
│  ← Zurück                                                   │
│                                                              │
│  ┌──────────────────────────────┐  ┌──────────────────────┐  │
│  │                              │  │  📋 TABLA DE         │  │
│  │  🟢 ICONO CURSO              │  │     CONTENIDOS       │  │
│  │                              │  │                      │  │
│  │  Excel-Grundlagen            │  │  ● Modul 1 ✓        │  │
│  │  [Anfänger] [27 Übungen]     │  │  ● Modul 2 ◐        │  │
│  │                              │  │  ○ Modul 3           │  │
│  │  Von der ersten Formel bis   │  │  ○ Modul 4           │  │
│  │  zur professionellen...      │  │  ○ Modul 5           │  │
│  │                              │  │  ○ Modul 6           │  │
│  │  ▓▓▓▓▓▓▓▓░░░ 56% completo   │  │  ○ Modul 7           │  │
│  │                              │  │                      │  │
│  │  ⏱ ~135 Min total           │  │  ──────────────────  │  │
│  │  📚 7 Module · 27 Übungen   │  │  🎯 Objetivos:       │  │
│  │                              │  │  • Navegar Excel     │  │
│  │  [▶ CONTINUAR / COMENZAR]   │  │  • Crear fórmulas    │  │
│  │                              │  │  • Formatear datos   │  │
│  └──────────────────────────────┘  └──────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  📚  MODULOS                                         │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐    │    │
│  │  │ 📘  Modul 1: Einführung in Excel        ✓   │    │    │
│  │  │     4 Übungen · ~20 Min · Completado        │    │    │
│  │  │     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%              │    │    │
│  │  │     Vertrautwerden mit der Excel-           │    │    │
│  │  │     Oberfläche, Grundkonzepten...           │    │    │
│  │  │     [▶ Wiederholen]                         │    │    │
│  │  └──────────────────────────────────────────────┘    │    │
│  │  ┌──────────────────────────────────────────────┐    │    │
│  │  │ 📙  Modul 2: Dateneingabe              ◐    │    │    │
│  │  │     4 Übungen · ~22 Min · 2/4 completado    │    │    │
│  │  │     ▓▓▓▓▓▓▓▓▓░░░░░░░░ 50%                   │    │    │
│  │  │     Daten effizient eingeben, bearbeiten     │    │    │
│  │  │     und organisieren.                        │    │    │
│  │  │     [▶ Continuar]                            │    │    │
│  │  └──────────────────────────────────────────────┘    │    │
│  │  ... (7 cards)                                      │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 Hero Mejorado con Stats Dashboard

Reemplazar el hero actual por un banner rico en información:

```
┌──────────────────────────────────────────────────────────┐
│  ← Zurück zu den Kursen                                  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  🟢  Excel-Grundlagen          [Anfänger]         │    │
│  │                                                  │    │
│  │  Von der ersten Formel bis zur professionellen   │    │
│  │  Tabelle — 7 strukturierte Module mit 27         │    │
│  │  praxisnahen Übungen.                            │    │
│  │                                                  │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │    │
│  │  │ 27       │ │ 7        │ │ ~135 Min │         │    │
│  │  │ Übungen  │ │ Module   │ │ Dauer    │         │    │
│  │  └──────────┘ └──────────┘ └──────────┘         │    │
│  │                                                  │    │
│  │  Fortschritt: ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░ 56%         │    │
│  │                                                  │    │
│  │  [▶ Jetzt starten]  [📋 Kursinhalte ↓]          │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

**Esfuerzo**: 2-3h

### 5.3 Sidebar / Tabla de Contenidos (TOC) Sticky ⭐ *Recomendado*

En desktop (≥1024px), añadir una columna lateral derecha con:

```
┌─────────────────────────┐
│  📋  Kursinhalte        │
│                         │
│  ● Modul 1  ✓  (4/4)   │  ← Click → scroll al módulo
│  ◐ Modul 2     (2/4)   │
│  ○ Modul 3     (0/4)   │
│  ○ Modul 4     (0/4)   │
│  ○ Modul 5     (0/4)   │
│  ○ Modul 6     (0/3)   │
│  ○ Modul 7     (0/4)   │
│                         │
│  ─────────────────────  │
│  🎯  Lernziele          │
│  • Excel-Grundlagen     │
│  • Formeln & Funktionen │
│  • Datenvisualisierung  │
│  • Formatierung         │
│                         │
│  ─────────────────────  │
│  👨‍🏫  Niveau: Anfänger  │
│  ⏱  ~135 Min           │
│  📝  27 Übungen         │
│  🏆  Zertifikat         │
└─────────────────────────┘
```

- **Sticky** al hacer scroll
- **Resalta** el módulo visible actual (IntersectionObserver)
- **Click** en un módulo → scroll suave a esa sección

**Esfuerzo**: 3-4h

### 5.4 Tarjetas de Módulo Enriquecidas

Transformar cada `module-row` en una **tarjeta completa** (no solo fila):

```html
<div class="module-card">
  <div class="module-card-header">
    <span class="module-icon">📘</span>
    <span class="module-number">Modul 1</span>
    <span class="module-status">✓ Completado</span>
  </div>
  <h3>Einführung in Excel und die Arbeitsumgebung</h3>
  <p class="module-desc">Vertrautwerden mit der Excel-Oberfläche, Grundkonzepten und Dateiverwaltung.</p>
  <div class="module-stats">
    <span>📝 4 Übungen</span>
    <span>⏱ ~20 Min</span>
  </div>
  <div class="module-topics">
    <span class="topic-tag">Interfaz</span>
    <span class="topic-tag">Navegación</span>
    <span class="topic-tag">Archivos</span>
    <span class="topic-tag">Componentes</span>
  </div>
  <div class="progress-bar">...</div>
  <button class="btn btn-outline btn-sm">▶ {Continuar | Wiederholen | Starten}</button>
</div>
```

**Esfuerzo**: 2-3h

### 5.5 CTA Principal "Continuar / Empezar"

Añadir un botón prominente que detecte el primer ejercicio no completado:

```
[▶ Jetzt starten]          ← si no ha empezado
[▶ Weiter mit Modul 3]     ← si está a medias
[✓ Alle abgeschlossen!]    ← si completó todo
```

**Lógica**: Buscar el primer ejercicio con `completed !== 1` y navegar a él.

**Esfuerzo**: 1h

### 5.6 Panel de Objetivos de Aprendizaje (Learning Objectives)

Extraer y agrupar los `learningObjectives` de todos los ejercicios del curso:

```html
<div class="objectives-panel">
  <h3>🎯 Was Sie lernen werden</h3>
  <ul>
    <li>✓ Excel-Oberfläche sicher bedienen</li>
    <li>✓ Daten eingeben und formatieren</li>
    <li>◐ Grundlegende Formeln erstellen</li>
    <li>○ Diagramme erstellen</li>
  </ul>
</div>
```

**Nota**: Requiere modificar el backend para exponer `learningObjectives` en la API.

**Esfuerzo**: 1h backend + 2h frontend = 3h

### 5.7 Vista de Módulo con Teoría

Cuando se selecciona un módulo, además de la lista de ejercicios, mostrar un **resumen de teoría** del módulo:

```
┌──────────────────────────────────────────────┐
│  ← Zurück zur Übersicht                      │
│                                              │
│  📘  Modul 1: Einführung in Excel            │
│                                              │
│  Beschreibung: Vertrautwerden mit der        │
│  Excel-Oberfläche, Grundkonzepten...         │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │ 01  ¿Qué es Excel y para qué sirve?  │    │
│  │     Diferenciar libro vs. hoja...    │    │
│  │     ⏱ 5 Min  [▶ Starten]     85%    │    │
│  ├──────────────────────────────────────┤    │
│  │ 02  Die Benutzeroberfläche erkennen  │    │
│  │     Namen der Hauptelemente...       │    │
│  │     ⏱ 5 Min  [▶ Starten]     90%    │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

**Esfuerzo**: 2h

---

## 6. Mockup del Diseño Propuesto (Layout Completo)

```
┌──────────────────────────────────────────────────────────────────────┐
│  🏠 Home › 📚 Kurse › Excel-Grundlagen                               │ ← Breadcrumbs
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ← Zurück zu den Kursen                                              │
│                                                                      │
│  ┌──────────────────────────────────┐ ┌─────────────────────────┐   │
│  │                                  │ │  📋  KURSINHALTE         │   │
│  │  📗  Excel-Grundlagen            │ │                         │   │
│  │  [Anfänger]  [Kostenlos]        │ │  ● Modul 1  ✓  (4/4)   │   │
│  │                                  │ │  ◐ Modul 2     (2/4)   │   │
│  │  7 strukturierte Module mit 27  │ │  ○ Modul 3     (0/4)   │   │
│  │  praxisnahen Übungen — perfekt  │ │  ○ Modul 4     (0/4)   │   │
│  │  für Berufseinsteiger.          │ │  ○ Modul 5     (0/4)   │   │
│  │                                  │ │  ○ Modul 6     (0/3)   │   │
│  │  ┌────────┐┌────────┐┌───────┐ │ │  ○ Modul 7     (0/4)   │   │
│  │  │ 27     ││ 7      ││ ~135  │ │ │                         │   │
│  │  │Übungen ││ Module ││ Min   │ │ │  ──────────────────     │   │
│  │  └────────┘└────────┘└───────┘ │ │  🎯  LERNZIELE          │   │
│  │                                  │ │  ✓ Grundlagen           │   │
│  │  Fortschritt: ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ │  ◐ Formeln              │   │
│  │               ░░░░░░ 56%       │ │  ○ Diagramme            │   │
│  │                                  │ │  ○ Datenanalyse         │   │
│  │  [▶ Jetzt starten]              │ │                         │   │
│  └──────────────────────────────────┘ └─────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  📘 MODUL 1: Einführung in Excel                  ✓ 100%    │   │
│  │  ─────────────────────────────────────────────────────────── │   │
│  │  Vertrautwerden mit der Excel-Oberfläche, Grundkonzepten    │   │
│  │  und Dateiverwaltung.                                        │   │
│  │                                                              │   │
│  │  📝 4 Übungen  ⏱ ~20 Min                                    │   │
│  │                                                              │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │ 01  ¿Qué es Excel?                          ✓ 100%  │   │   │
│  │  │ 02  Die Benutzeroberfläche                  ✓  90%  │   │   │
│  │  │ 03  Navegación Básica                       ✓  85%  │   │   │
│  │  │ 04  Dateiverwaltung                         ✓  95%  │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  📙 MODUL 2: Dateneingabe und -bearbeitung         ◐ 50%    │   │
│  │  ─────────────────────────────────────────────────────────── │   │
│  │  Daten effizient eingeben, bearbeiten und organisieren.      │   │
│  │  📝 4 Übungen  ⏱ ~22 Min                                    │   │
│  │  [▶ Weiter mit 05: Tipos de Datos]                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ...                                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 7. Plan de Implementación

### Fase 1 — Hero + Stats (3-4h)

| Tarea | Archivos | Esfuerzo |
|-------|----------|----------|
| Rediseñar hero con stats cards (ejercicios, módulos, tiempo) | `CourseDetail.tsx`, `index.css` | 1.5h |
| Añadir CTA "Jetzt starten" / "Weitermachen" | `CourseDetail.tsx` | 1h |
| Calcular tiempo total del curso | `CourseDetail.tsx` (fn auxiliar) | 30min |
| Mejorar badges visuales (dificultad, gratis) | `index.css` | 30min |

### Fase 2 — Módulos como Tarjetas (2-3h)

| Tarea | Archivos | Esfuerzo |
|-------|----------|----------|
| Rediseñar `module-row` → `module-card` con icono, descripción, topics | `CourseDetail.tsx`, `index.css` | 2h |
| Añadir botones "Continuar/Wiederholen" por módulo | `CourseDetail.tsx` | 30min |
| Animación de expansión suave al seleccionar módulo | `index.css` | 30min |

### Fase 3 — Sidebar TOC + Learning Objectives (3-5h)

| Tarea | Archivos | Esfuerzo |
|-------|----------|----------|
| Backend: exponer `learningObjectives` en API | `backend/src/routes/courses.ts` | 1h |
| Crear componente `CourseSidebar.tsx` | `frontend/src/components/navigation/CourseSidebar.tsx` | 2h |
| Sticky sidebar + IntersectionObserver para resaltar módulo activo | `CourseSidebar.tsx` | 1.5h |
| Panel de objetivos de aprendizaje en sidebar | `CourseSidebar.tsx` | 30min |

### Fase 4 — Pulido (1-2h)

| Tarea | Archivos | Esfuerzo |
|-------|----------|----------|
| Animaciones de transición entre vista general y módulo | `CourseDetail.tsx`, `index.css` | 30min |
| Responsive: sidebar → bottom en móvil | `index.css` | 30min |
| Breadcrumb contextual con título real del curso | `Breadcrumbs.tsx` (o pasar prop) | 30min |

### Resumen

| Fase | Horas | Impacto |
|------|-------|---------|
| Fase 1 — Hero + Stats | 3-4h | 🔴 Alto |
| Fase 2 — Módulos como Tarjetas | 2-3h | 🔴 Alto |
| Fase 3 — Sidebar TOC + Objetivos | 3-5h | 🟡 Medio |
| Fase 4 — Pulido | 1-2h | 🟢 Bajo |
| **Total** | **9-14h** | |

---

## 8. Anexo Técnico

### 8.1 Modificación del Backend para exponer learningObjectives

```typescript
// backend/src/routes/courses.ts — dentro del bucle for (const ex of exercises)
for (const ex of exercises) {
  try {
    const tmpl = JSON.parse(ex.template_data || '{}');
    ex.estimated_minutes = tmpl.estimated_minutes || null;
    ex.prerequisites = tmpl.prerequisites || [];
    ex.learningObjectives = tmpl.learningObjectives || [];  // ← NUEVO
    ex.theoryTitle = tmpl.theoryTitle || null;               // ← NUEVO
    ex.theory = tmpl.theory || null;                         // ← NUEVO
    ex.moduleId = tmpl._moduleId || tmpl.moduleId || null;
    ex.moduleSection = tmpl._moduleSection || tmpl.moduleSection || null;
    ex.moduleTitle = tmpl._moduleTitle || tmpl.moduleTitle || null;
    ex.sectionTitle = tmpl._sectionTitle || tmpl.sectionTitle || null;
  } catch { ex.estimated_minutes = null; ex.prerequisites = []; ex.learningObjectives = []; }
  delete ex.template_data; // no enviar el JSON crudo al frontend
}
```

### 8.2 Cálculo de Tiempo Total (Frontend)

```typescript
function computeCourseStats(exercises: ExerciseItem[]) {
  const totalMin = exercises.reduce((sum, e) => sum + (e.estimated_minutes || 0), 0);
  const totalExercises = exercises.length;
  const completedCount = exercises.filter(e => e.completed).length;
  const uniqueModules = new Set(exercises.map(e => e.moduleId).filter(Boolean)).size;
  
  return { totalMin, totalExercises, completedCount, uniqueModules };
}
```

### 8.3 Encontrar el Primer Ejercicio No Completado (CTA)

```typescript
function findNextExercise(exercises: ExerciseItem[]): ExerciseItem | null {
  for (const ex of exercises) {
    if (!ex.completed || (ex.user_score || 0) < 80) return ex;
  }
  return null; // todos completados
}
```

### 8.4 Sidebar con IntersectionObserver

```typescript
// Dentro de CourseSidebar.tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveModule(entry.target.id);
        }
      }
    },
    { rootMargin: '-80px 0px -70% 0px' }
  );

  document.querySelectorAll('[data-module-id]').forEach(el => observer.observe(el));
  return () => observer.disconnect();
}, []);
```

### 8.5 Estructura de Archivos Propuesta

```
frontend/src/
├── components/
│   └── navigation/
│       └── CourseSidebar.tsx          ← NUEVO
├── pages/
│   └── CourseDetail.tsx               ← MODIFICAR (refactor completo)
└── index.css                          ← MODIFICAR (añadir estilos)

backend/src/
└── routes/
    └── courses.ts                     ← MODIFICAR (exponer learningObjectives, theory)
```

---

## Conclusión

La página de detalle de curso actual es **funcional pero minimalista**. Tiene todos los datos necesarios pero no los presenta de forma pedagógica ni visualmente atractiva. Las mejoras propuestas transforman la página en una experiencia de aprendizaje rica con:

- **Hero informativo** con stats del curso y CTA
- **Sidebar/TOC** para navegación rápida entre módulos
- **Tarjetas de módulo** visualmente distintas con descripciones y tags
- **Objetivos de aprendizaje** visibles para el estudiante
- **Layout de 2 columnas** que aprovecha el espacio en desktop

La Fase 1 (Hero + Stats + CTA) es la de mayor impacto con menor esfuerzo y se recomienda implementar primero.
