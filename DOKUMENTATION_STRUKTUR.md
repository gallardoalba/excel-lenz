# Excel-lenz — Dokumentation der Webseitenstruktur & Architektur

> **Version**: 5.1 — Aktuell  
> **Stand**: 1. August 2026 (abends)  
> **Status**: Beta — Produktionsbereit für kontrollierte Umgebungen  
> **Sprache**: Deutsch (primär), Spanisch (Code of Conduct)  
> **Stack**: React 18 + Vite 6 | Express 4 + SQLite | Handsontable + HyperFormula  
> **Design**: Enterprise SaaS — Lucide Icons, CSS Utilities, Dark Mode, Focus Mode, Exam Mode  
> **Lizenz**: AGPLv3 (GNU Affero General Public License)  
> **Tests**: 158 Tests in 13 Suiten (Jest + Supertest)  
> **CI/CD**: GitHub Actions (Backend Tests + Frontend Build)

---

## Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Systemarchitektur](#2-systemarchitektur)
3. [Backend-Struktur](#3-backend-struktur)
4. [Frontend-Struktur](#4-frontend-struktur)
5. [Datenmodell](#5-datenmodell)
6. [API-Endpunkte](#6-api-endpunkte)
7. [Komponentenhierarchie](#7-komponentenhierarchie)
8. [Routing & Navigation](#8-routing--navigation)
9. [Design-System](#9-design-system)
10. [Authentifizierung & Sicherheit](#10-authentifizierung--sicherheit)
11. [Spreadsheet-Simulation](#11-spreadsheet-simulation)
12. [Scoring-System](#12-scoring-system)
13. [Gamification-System](#13-gamification-system)
14. [Enterprise & Monetarisierung](#14-enterprise--monetarisierung)
15. [Deployment & Skalierung](#15-deployment--skalierung)
16. [Analytics-System](#16-analytics-system)
17. [Testing & Qualitätssicherung](#17-testing--qualitätssicherung)
18. [Verzeichnisstruktur](#18-verzeichnisstruktur)

---

## 1. Projektübersicht

**Excel-lenz** ist ein interaktives Lernportal für Excel, das es Benutzern ermöglicht, Excel-Übungen direkt im Browser durchzuführen — mit realistischen Tabellenkalkulationen, automatischer Korrektur und Fortschrittsverfolgung.

### Kernfunktionen (Ist-Stand)

| Kategorie | Funktionen |
|-----------|-----------|
| 📝 **Interaktive Übungen** | Handsontable + HyperFormula, ExcelRibbon (3 Tabs), FormulaBar mit Autocomplete, Error-Highlighting (rot + grünes Dreieck), Guided Steps |
| ✅ **Automatische Korrektur** | Server-Zellvergleich, Error-Highlighting in Zellen, Progressive Hints (4 Stufen), Cell Feedback |
| ⏱️ **Prüfungsmodus** | Countdown-Timer im Ribbon, Automatische Abgabe, Practice/Exam Toggle |
| 📊 **Daten-Tools** | SVG-Diagramme (Balken/Linie), Datenvalidierung (Min/Max/Liste), Pivot-Tabellen (react-pivottable) |
| 📊 **Fortschritt** | Dashboard: XP, Level, Streaks, Badges, Skill-Bars, Spaced Repetition |
| 🎨 **Design-System** | Corporate Blue/Gold, Lucide Icons, CSS Utilities, Focus Mode, Glass-Morphism |
| 📚 **Kursstruktur** | 4 Kurse, 7 Module, Guided Steps pro Übung, Seitenleisten-TOC |
| 🧭 **Navigation** | UserMenu (Avatar + Dropdown), CommandPalette (⌘K), Breadcrumbs, MobileDrawer |
| 👨‍🏫 **Lehrer-Panel** | CRUD, Schüler mit Avataren + Progress Bars, Klassen-Analyse |
| 🏆 **Gamification** | XP, Badges, Daily Goals, Leaderboard |
| 🎯 **Focus Mode** | Blendet Navbar/Footer aus — nur Instructions + Spreadsheet |
| 💬 **Community** | Kommentare mit Initial-Avataren, Threading |
| ♿ **Accessibility** | SkipNav, LiveRegion, FocusTrap, ReducedMotion, KeyboardHelp |
| 🌙 **Dark Mode** | CSS-Variablen, vollständig |
| 📱 **Responsive** | Ribbon Mobile-Collapse (☰), Grids adaptiv |
| 🐳 **Deployment** | Docker + Compose, Nginx Reverse Proxy, Production-Build |
| 📧 **Auth-Flows** | Registrierung, Login, Passwort-Reset, E-Mail-Verifikation |
| 📈 **Analytics** | Nutzungs-Tracking, Lernmetriken, Engagement-Analyse |
| 📖 **API-Dokumentation** | Swagger/OpenAPI unter `/api/docs` |
| 🧪 **Testing** | 158 Tests (13 Suiten), Jest + Supertest, CI/CD via GitHub Actions |
| 🔓 **Lizenz** | AGPLv3 — Copyleft stark, Verbesserungen fließen zurück ins Gemeingut |
| 📈 **Analytics** | Session-Tracking, Batching, sendBeacon, node-cache, Indizes, Validation |

---

## 2. Systemarchitektur

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              React 18 SPA (Vite)                        ││
│  │  ┌───────────┐ ┌───────────┐ ┌───────────────────────┐ ││
│  │  │ React     │ │ Lucide    │ │ Handsontable          │ ││
│  │  │ Router v6 │ │ Icons     │ │ + HyperFormula        │ ││
│  │  └───────────┘ └───────────┘ │ + ExcelRibbon          │ ││
│  │                               │ + FormulaBar          │ ││
│  │                               │ + StatusBar           │ ││
│  │                               │ + ContextMenu         │ ││
│  │                               │ + ConditionalFormat   │ ││
│  │                               └───────────────────────┘ ││
│  └──────────────────────┬──────────────────────────────────┘│
└─────────────────────────┼────────────────────────────────────┘
                          │ HTTP REST (JSON)
                          │ JWT Bearer Token
┌─────────────────────────┼────────────────────────────────────┐
│              SERVER (Node.js + Express)                      │
│  ┌──────────────────────┴──────────────────────────────────┐│
│  │  Express 4.x API (Port 3001)                            ││
│  │  ┌──────────┐ ┌──────────┐ ┌────────────┐             ││
│  │  │ Auth     │ │ Courses  │ │ Exercises  │             ││
│  │  │ Router   │ │ Router   │ │ Router     │             ││
│  │  └──────────┘ └──────────┘ └────────────┘             ││
│  │  ┌──────────┐ ┌──────────┐ ┌────────────┐             ││
│  │  │ Teacher  │ │ Gamifica │ │ Enterprise │             ││
│  │  │ Router   │ │ -tion    │ │ Router     │             ││
│  │  └──────────┘ └──────────┘ └────────────┘             ││
│  │  ┌──────────┐ ┌──────────┐                            ││
│  │  │ Adaptive │ │Community │                            ││
│  │  │ Router   │ │ Router   │                            ││
│  │  └──────────┘ └──────────┘                            ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Technologie-Stack

| Schicht | Technologie | Version | Begründung |
|---------|------------|---------|------------|
| **Frontend** | React | 18.3 | Komponentenbasiert |
| **Build-Tool** | Vite | 6.4 | Schnelle HMR, TypeScript-nativ |
| **Sprache** | TypeScript | 5.6 | Typensicherheit |
| **Routing** | React Router | 6.28 | Client-seitiges Routing |
| **Icons** | lucide-react | 0.x | SVG-Icons, konsistent |
| **Spreadsheet** | Handsontable | 14.6 | Excel-ähnliche UI |
| **Formula Engine** | HyperFormula | 3.3 | Excel-Formelauswertung |
| **Confetti** | canvas-confetti | 1.x | Feier-Animationen |
| **Backend** | Express | 4.21 | Bewährt, minimalistisch |
| **Runtime** | tsx | 4.x | TypeScript ohne Build-Step |
| **Datenbank** | better-sqlite3 | 11.x | Synchron, embedded, WAL-Mode |
| **Auth** | jsonwebtoken + bcryptjs | 9.x / 2.x | JWT-Stateless-Auth |

---

## 3. Backend-Struktur

### 3.1 Server (`src/server.ts`)

```
Express App
├── CORS (origin: http://localhost:5173)
├── JSON Parser (limit: 10MB)
├── Routes
│   ├── /api/auth        → authRoutes
│   ├── /api/courses     → courseRoutes
│   ├── /api/exercises   → exerciseRoutes
│   ├── /api/teacher     → teacherRoutes
│   ├── /api/gamification→ gamificationRoutes
│   ├── /api/enterprise  → enterpriseRoutes
│   ├── /api/adaptive    → adaptiveRoutes
│   └── /api/community   → communityRoutes
└── /api/health (Health Check)
```

### 3.2 Routen

| Router | Datei | Endpunkte |
|--------|-------|-----------|
| Auth | `routes/auth.ts` | 3 (Register, Login, Me) |
| Courses | `routes/courses.ts` | 2 (Liste, Detail) |
| Exercises | `routes/exercises.ts` | 3 (Detail, Submit, Progress) |
| Teacher | `routes/teacher.ts` | 8 (CRUD Kurse/Übungen, Schüler) |
| Gamification | `routes/gamification.ts` | 2 (Stats, Leaderboard) |
| Enterprise | `routes/enterprise.ts` | 8 (Pricing, Subs, API Keys, SCORM) |
| Adaptive | `routes/adaptive.ts` | 2 (Review-Due, Skills) |
| Community | `routes/community.ts` | 2 (Comments CRUD) |

---

## 4. Frontend-Struktur

### 4.1 Einstiegspunkt (`src/main.tsx`)

```
main.tsx
├── React.StrictMode
├── BrowserRouter
├── ThemeProvider (Dark Mode Context)
├── AuthProvider (JWT Context)
└── App (Root-Komponente)
    ├── SkipNav (Accessibility)
    ├── LiveRegion (Screen Reader)
    ├── Navbar
    │   ├── Brand (Link: /)
    │   ├── Nav-Links (Kurse, Fortschritt)
    │   ├── Auth-Buttons (Login/Logout)
    │   ├── Dark Mode Toggle (Sun/Moon Icons)
    │   └── NotificationCenter (Bell Icon)
    ├── Routes (siehe §8)
    └── Footer (4 Kolumnen)
```

### 4.2 Context

| Context | Datei | Zustand |
|---------|-------|---------|
| `AuthContext` | `context/AuthContext.tsx` | user, token, login(), logout(), apiFetch() |
| `ThemeContext` | `context/ThemeContext.tsx` | dark, toggle() → localStorage |

---

## 5. Datenmodell

### Tabellen (8+)

| Tabelle | Beschreibung |
|---------|-------------|
| `users` | Benutzer (id, email, password_hash, name, role) |
| `courses` | Kurse (id, title, description, difficulty) |
| `exercises` | Übungen (id, course_id FK, title, template_data JSON, solution_data JSON) |
| `progress` | Fortschritt (user_id FK, exercise_id FK, score, completed_at) |
| `user_xp` | XP-System (total_xp, level, streak_days) |
| `badges` | Badge-Definitionen |
| `user_badges` | Verliehene Badges |
| `subscriptions` | Tarife (Free/Pro/Team) |

### Template-Datenstruktur (JSON)

```json
{
  "cols": 5, "rows": 6,
  "headers": ["Produkt", "Jan", "Feb", "Mär", "Total"],
  "data": [["Laptops", 1200, 1350, 1100, null]],
  "taskCols": [4],
  "formulaHint": "=SUMME(B2:D2)",
  "learningObjectives": ["SUMME-Funktion anwenden", "Zellbezüge verstehen"],
  "theory": "Die SUMME-Funktion addiert...",
  "theoryTitle": "SUMME-Funktion",
  "estimated_minutes": 5
}
```

---

## 6. API-Endpunkte (30 total)

| Bereich | Endpunkte |
|---------|-----------|
| Auth | 3 |
| Courses | 2 |
| Exercises | 3 |
| Teacher | 8 |
| Gamification | 2 |
| Enterprise | 8 |
| Adaptive | 2 |
| Community | 2 |

---

## 7. Komponentenhierarchie

```
App
├── Navbar
│   ├── Brand (BarChart3 Icon)
│   ├── SearchButton (öffnet CommandPalette)
│   ├── UserMenu (Avatar + Dropdown: Profil, Abmelden)
│   ├── DarkModeToggle (Sun/Moon)
│   └── MobileDrawer (☰ Seitenleiste)
│
├── CommandPalette (⌘K Modal: Suche Übungen/Kurse)
├── Breadcrumbs (Home > Kurse > Kurs > Übung)
│
├── Pages
│   ├── Home
│   │   ├── Hero (Badge, Titel, DailyGoal, ContinueButton)
│   │   ├── StatsBar
│   │   ├── Services (3 Cards)
│   │   ├── USPs (6 Cards mit Lucide Icons)
│   │   ├── Testimonials (3 Zitate)
│   │   └── CTA Section
│   │
│   ├── Login / Register
│   │   └── AuthForm
│   │
│   ├── Courses
│   │   └── CourseCard[] (3-Kolumnen Grid)
│   │
│   ├── CourseDetail
│   │   ├── Hero Dashboard (Stats: Übungen, Fortschritt, Dauer)
│   │   ├── Module Cards (01-07, Titel, Übungsanzahl, Progress)
│   │   ├── Sidebar TOC (Learning Objectives, Theory)
│   │   ├── CTA Button (Weitermachen/Starten)
│   │   └── ExerciseList (StatusIcon, Titel, Score Badge)
│   │
│   ├── Exercise
│   │   ├── Back Button (← Zurück zum Kurs)
│   │   ├── Focus Mode Toggle
│   │   ├── Instructions Panel (linke Spalte 40%)
│   │   │   ├── Tabs: Anleitung | Theorie | Community
│   │   │   ├── Formula Hint
│   │   │   ├── Progressive Hints (4 Stufen: Tipp 1-3 + Lösung)
│   │   │   ├── Cell Feedback (Fehlerliste mit Dreieck-Indikator)
│   │   │   ├── Score Display (Kreis + Nachricht)
│   │   │   ├── Next Exercise Link
│   │   │   └── Sticky Bar: Mode Toggle (Üben/Prüfung) + Submit
│   │   ├── Spreadsheet Panel (rechte Spalte 60%)
│   │   │   ├── ExcelRibbon (3 Tabs: Start | Formeln | Daten)
│   │   │   │   └── Exam Timer (Countdown + Pulse bei <5min)
│   │   │   ├── FormulaBar (Name Box + fx Input + Autocomplete)
│   │   │   ├── Handsontable Grid
│   │   │   │   ├── Renderer: Task-Highlighting, Error-Zellen (rot + grünes Dreieck)
│   │   │   │   ├── Renderer: Conditional Formatting, Formel-Fehler
│   │   │   │   └── Renderer: Format Painter, Zoom (CSS zoom)
│   │   │   ├── StatusBar (Mode, Aggregates, Zoom)
│   │   │   └── ContextMenu (Submenus, Unhide Column)
│   │   ├── ChartDialog (SVG Bar/Line Charts)
│   │   ├── DataValidationDialog (Min/Max/Liste)
│   │   ├── PivotTableDialog (react-pivottable)
│   │   ├── KeyboardHelp (?, Escape)
│   │   ├── XPFlying Animation
│   │   └── BadgeModal
│   │
│   ├── Dashboard
│   │   ├── KPIs (XP, Level, Streak, Abgeschlossen)
│   │   ├── Weitermachen (Reviews) + Badges
│   │   ├── Skill-Übersicht (Progress Bars)
│   │   ├── Leaderboard (collapsible) + Verlauf
│   │   └── ScoreProgressChart (SVG Line Chart)
│   │
│   ├── TeacherPanel
│   │   ├── Tabs: Schüler | Kurse | Neuer Kurs | Neue Übung
│   │   ├── StudentTable (Avatare, Progress Bars)
│   │   ├── CourseList + Delete
│   │   └── Exercise Form (Komplette CRUD UI)
│   │
│   └── NotFound (404)
│
├── Components (Shared)
│   ├── navigation/
│   │   ├── UserMenu.tsx (Avatar + Dropdown)
│   │   ├── CommandPalette.tsx (⌘K Modal)
│   │   ├── Breadcrumbs.tsx (Route-basiert)
│   │   └── MobileDrawer.tsx (Responsive Sidebar)
│   ├── spreadsheet/
│   │   ├── SpreadsheetHandsontable.tsx (Hauptkomponente, ~1400 Zeilen)
│   │   ├── ExcelRibbon.tsx (3 Tabs, Exam Timer, Mobile-Collapse)
│   │   ├── FormulaBar.tsx (Name Box, Autocomplete, Syntax)
│   │   ├── StatusBar.tsx (Aggregates, Zoom)
│   │   ├── ContextMenu.tsx (Submenus, Unhide)
│   │   ├── ChartDialog.tsx (SVG Charts)
│   │   ├── DataValidationDialog.tsx (Regeln pro Spalte)
│   │   ├── PivotTableDialog.tsx (react-pivottable)
│   │   └── types.ts (CellPosition, CellRange)
│   ├── animations/
│   │   └── Celebrations.tsx (Confetti, XPFlying, BadgeModal)
│   ├── visualizations/
│   │   └── Charts.tsx (ScoreProgress + StreakCalendar)
│   ├── gamification/
│   │   ├── DailyGoal.tsx
│   │   └── Notifications.tsx
│   ├── community/
│   │   └── Comments.tsx (Avatare + Replies)
│   ├── tour/
│   │   └── OnboardingTour.tsx (Tooltip + Spotlight)
│   ├── a11y/
│   │   └── Accessibility.tsx (SkipNav, LiveRegion, FocusTrap)
│   ├── help/
│   │   └── KeyboardHelp.tsx
│   └── ErrorBoundary.tsx
│
├── Hooks
│   ├── useExamTimer.ts (Countdown + Auto-Submit)
│   └── useAutosave.ts
│
└── Context Providers
    ├── AuthProvider (JWT State + apiFetch)
    └── ThemeProvider (Dark Mode)

---

## 8. Routing & Navigation

| Pfad | Komponente | Auth | Beschreibung |
|------|-----------|------|-------------|
| `/` | Home | Nein | Landing Page mit DailyGoal |
| `/login` | Login | Redirect | Anmeldung |
| `/register` | Register | Redirect | Registrierung |
| `/courses` | Courses | Nein | Kursübersicht |
| `/courses/:id` | CourseDetail | Nein | Kursdetails + Module + Sidebar TOC |
| `/exercises/:id` | Exercise | Ja | Interaktive Übung (Üben/Prüfung) |
| `/dashboard` | Dashboard | Ja | Fortschritt + Stats |
| `/teacher` | TeacherPanel | Teacher | Lehrer-Admin |
| `*` | NotFound | Nein | 404-Seite |

---

## 9. Design-System

### 9.1 Palette (Triadisches Farbschema)

| Rolle | Farbe | Variable |
|-------|-------|----------|
| Primär | Corporate Blue `#1a5276` | `--primary` |
| Sekundär | Pine Green `#217346` | `--secondary` |
| Akzent | Amber/Gold `#d4a017` | `--accent` |
| Hintergrund | Cool Grays `#F8FAFC` | `--bg` |

### 9.2 Typografie

| Element | Font |
|---------|------|
| UI-Text | Inter, system-ui |
| Überschriften | Inter (SemiBold/Bold) |
| Spreadsheet | Calibri 11px (Excel-identisch) |

### 9.3 Icons

- **100% Lucide React** — keine Emojis in der UI
- Konsistente stroke-width, 24px Basisgröße
- Beispiele: `BarChart3`, `Trophy`, `BookOpen`, `Lightbulb`, `CheckCircle`, `Lock`

### 9.4 Dark Mode

```css
body.dark {
  --bg: #0D1114;        /* Nicht reines Schwarz */
  --surface: #161B22;   /* GitHub-dark inspiriert */
  --border: #21262D;
  --text: #E6EDF3;
}
```

### 9.5 Shadows (Apple/Vercel Stil)

```css
--shadow-xs: 0 1px 2px rgba(0,0,0,0.03);
--shadow-sm: 0 2px 8px rgba(0,0,0,0.04);
--shadow:    0 4px 20px rgba(0,0,0,0.05);
--shadow-lg: 0 8px 40px rgba(0,0,0,0.07);
```

### 9.6 CSS Utility Classes

```css
.flex, .flex-col, .flex-wrap, .items-center, .justify-between
.gap-xs(4px), .gap-sm(8px), .gap-md(16px), .gap-lg(24px)
.p-sm, .p-md, .p-lg
.mb-xs → .mb-lg, .mt-sm, .mt-md
.text-xs, .text-sm, .text-muted
.bordered, .rounded-sm, .hover-lift
```

---

## 10. Authentifizierung & Sicherheit

### JWT-Flow

```
1. Login → Server generiert JWT (24h)
2. Client speichert in localStorage
3. apiFetch() fügt Authorization: Bearer <token> hinzu
4. Server: authMiddleware validiert Token
5. 401 → Client redirect zu /login
```

### Rollen

| Rolle | Rechte |
|-------|--------|
| **student** | Übungen, Dashboard, Community, Gamification |
| **teacher** | Zusätzlich: CRUD Kurse/Übungen, Schüler-Übersicht |

---

## 11. Spreadsheet-Simulation

### Komponenten

| Komponente | Datei | Funktion |
|-----------|-------|----------|
| **ExcelRibbon** | `ExcelRibbon.tsx` | 3 Tabs (Start, Formeln, Daten), Exam Timer, Mobile-Collapse |
| **FormulaBar** | `FormulaBar.tsx` | Name Box, fx Button, Autocomplete (DE/ES Funktionen) |
| **SpreadsheetHandsontable** | `SpreadsheetHandsontable.tsx` | Handsontable Grid, Task-Highlighting, Renderer (Error-Zellen, Conditional Formatting, Format Painter), Zoom (CSS zoom) |
| **StatusBar** | `StatusBar.tsx` | Mode Indicator, Aggregates (SUMME/MITTELWERT/ANZAHL), Zoom Slider |
| **ContextMenu** | `ContextMenu.tsx` | Rechtsklick-Menü mit Submenus, Unhide Column |
| **ChartDialog** | `ChartDialog.tsx` | SVG Balken-/Linien-Diagramme |
| **DataValidationDialog** | `DataValidationDialog.tsx` | Spalten-Regeln (Min/Max/Liste) |
| **PivotTableDialog** | `PivotTableDialog.tsx` | Interaktive Pivot-Tabellen |

### Error-Highlighting

- **Rote Zelle** + roter linker Rand + Tooltip (`Erwartet: X`)
- **Grünes Dreieck** (`.excel-error-triangle`) in der oberen linken Ecke — Excel-ähnlich
- Renderer setzt `td.style.position = 'relative'` und appended ein `<div>` mit CSS-Border-Trick

### Prüfungsmodus

- **useExamTimer Hook**: Countdown in Minuten, Auto-Submit bei 0
- **Timer im Ribbon**: Grüne Titlebar mit `exam-timer` Badge, Pulse-Animation bei <5 Minuten
- **Mode Toggle**: Üben ↔ Prüfung im Instructions Panel
- **Practice Mode**: `checkCellPractice()` evaluiert jede Zelle sofort gegen `solution.evaluatedData`

### Datenfluss

```
Template (JSON) → Handsontable Grid
    ↓ afterChange
onChange → React State
    ↓ Submit Button
POST /api/exercises/:id/submit
    ↓ Server
Score (0-100%) → ScoreDisplay + XP + Badges + Confetti
```

---

## 12. Scoring-System

### Score-Kategorien

| Score | Klasse | Nachricht |
|-------|--------|-----------|
| 80-100% | `score-success` | Kompetenz nachgewiesen |
| 50-79% | `score-partial` | Gute Fortschritte — weiter üben |
| 0-49% | `score-fail` | Grundlagen vertiefen |

- Server-seitiger Zellvergleich mit numerischer Toleranz (<0.01)
- Nur `taskCols` werden bewertet
- **Error Highlighting**: Falsche Zellen rot + grünes Dreieck + Tooltip
- **Guided Steps**: Nummerierte Schritte, abgeschlossene zeigen ✓
- **Partial Credit**: `correctCells/totalCells` Anzeige
- **Practice Mode**: Echtzeit-Evaluierung via `checkCellPractice()`

### 12.2 Feedback-Flow

```
Submit → Server-Vergleich → Score
  ├── errorCells → Spreadsheet rot + Dreieck (Tooltip)
  ├── cellFeedback → Liste der Fehler im Panel
  ├── feedbackHint → Kontextsensitive Hinweise (3 Stufen)
  └── nextExercise → Link zur nächsten Übung
```

---

## 13. Gamification-System

| Aktion | XP |
|--------|-----|
| Übung abgeschlossen | +50 |
| 100% Score | +25 Bonus |
| 7-Tage-Streak | +100 Bonus |

**Level**: `⌊√(total_xp) / 10⌋ + 1`

### 13.2 Badges (9 Stück, professionell)

| ID | Name | Icon | Kriterium |
|----|------|------|-----------|
| ersteschritte | Fundament | 🎖️ | 1 Übung |
| fleissig | Praxis | 📋 | 10 Übungen |
| profi | Spezialist | 🏅 | 25 Übungen |
| streak3 | Kontinuität | 📅 | 3 Tage Streak |
| streak7 | Disziplin | 📆 | 7 Tage Streak |
| streak30 | Engagement | 🗓️ | 30 Tage Streak |
| level5 | Fortgeschritten | 🔷 | Stufe 5 |
| level10 | Experte | 🔶 | Stufe 10 |
| perfekt | Präzision | ✓ | 5× 100% |

### 13.3 Leaderboard
- Top 20, **standardmäßig eingeklappt**
- Confetti subtil, Reduced-Motion aware

---

## 14. Enterprise & Monetarisierung

| Tarif | Features |
|-------|----------|
| Free | Basis-Übungen |
| Pro | Alle Kurse, Zertifikate, API |
| Team | Pro + Team-Dashboard, SSO |

- API Keys (`enterprise.ts`): Generate, Revoke, List
- Audit Log: Track key usage
- SCORM Export (vorbereitet)

---

## 15. Deployment & Skalierung

```bash
# Development
npm run dev           # Startet Backend (:3001) + Frontend (:5173)
npm run db:seed       # Datenbank mit Übungen befüllen

# Production
docker compose up -d --build
```

- Docker Multi-stage Build, Nginx Reverse Proxy, SPA Fallback
- SQLite (dev) → PostgreSQL (prod) via docker-compose
- Skalierungspfad: Redis Caching + CDN

---

## 16. Analytics-System

### Architektur

```
Frontend (useAnalytics.ts)
  ├── sessionStorage (persistiert über F5, stirbt bei Tab-Schließung)
  ├── Event Queue (Batching alle 5s + sofort bei kritischen Events)
  ├── navigator.sendBeacon (garantiert delivery bei page close)
  └── Fallback: fetch() mit static import
         │
         ▼ POST /api/analytics/track-batch  { events: [...] }
Backend (analytics.ts)
  ├── rate-limit: 200 req / 15 min
  ├── Transaktion: db.transaction() — 50 Inserts in einer Operation
  ├── Validation: event_type ≤ 50 Zeichen, metadata ≤ 2KB
  └── Keine Cache-Invalidierung (5-Min-TTL reicht für Dashboards)
         │
         ▼ SQLite (analytics_events)
Datenbank
  ├── Indizes: user_id, event_type, created_at
  └── WAL-Mode + synchronous=NORMAL
         │
         ▼ GET /api/analytics/summary (nur Teacher)
Cache (node-cache)
  └── TTL 300s — Antwort in <5ms aus dem RAM
```

### Erfasste Events

| Event | Metadaten |
|-------|-----------|
| `page_view` | resource_id = URL |
| `exercise_start` | resource_id = Exercise-ID |
| `exercise_complete` | duration_seconds |
| `exercise_submit` | score (0-100) |

### Metriken für das Teacher-Dashboard

- **totalUsers**: Unique user_id (all time)
- **activeUsers**: Unique user_id (letzte 7 Tage)
- **eventsByType**: page_view / exercise_start / exercise_submit
- **eventsByDay**: Zeitreihe (30 Tage)
- **topExercises**: Meistversuchte Übungen (Top 10)
- **avgSessionDuration**: Durchschnittliche Bearbeitungszeit
- **completionRate**: % der Submits mit Score ≥ 80%

---

## 17. Testing & Qualitätssicherung

### Test-Suiten (158 Tests, 13 Suiten)

| Suite | Tests | Fokus |
|-------|-------|-------|
| `auth.test.ts` | 23 | Register, Login, /me, Passwort-Reset, E-Mail-Verifikation, Validierung |
| `exercises.test.ts` | 17 | Submit, Scoring, XP-Re-Submission, Last-Exercise, Progress, Mastery |
| `teacher.test.ts` | 16 | CRUD Courses, CRUD Exercises, Students, Analytics |
| `analytics.test.ts` | 18 | Track, Track-Batch, Validation, Summary (Teacher-only), Cache |
| `enterprise.test.ts` | 12 | Pricing, Subscription, Upgrade, Checkout, SCORM Export |
| `validation.test.ts` | 12 | Zod: Login/Register Schemas, Passwort-Regeln |
| `exercise-validation.test.ts` | 11 | Alle 229 Übungen: Struktur, Scoring-Pipeline, Edge Cases |
| `spacedRepetition.test.ts` | 10 | SM-2 Algorithmus: Qualität, Intervalle, Caps |
| `courses.test.ts` | 8 | Kursliste, Kursdetails, User Progress, Guest Access |
| `community.test.ts` | 8 | Kommentare CRUD, Replies, Limits |
| `adaptive.test.ts` | 7 | Review-Due, Review-Complete, Skills |
| `gamification.test.ts` | 7 | Stats, Leaderboard, XP Gain, Streaks |
| `seed.test.ts` | 7 | Seed-Validierung, Idempotenz, Badges |

### CI/CD Pipeline

```yaml
GitHub Actions (.github/workflows/ci.yml):
  backend-tests:
    - npm ci → npm test → npx tsc --noEmit
  frontend-build:
    - npm ci → npx tsc --noEmit → npm run build
```

---

## 18. Verzeichnisstruktur

```
excel-lenz/
├── README.md
├── LICENSE (AGPLv3)
├── .gitignore
├── .env.example
├── package.json              # Root: concurrently scripts
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── DEPLOY.md
├── DOKUMENTATION_STRUKTUR.md
│
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css              # ~1900 Zeilen, CSS custom properties
│       ├── context/
│       │   ├── AuthContext.tsx     # JWT State + apiFetch
│       │   └── ThemeContext.tsx    # Dark Mode
│       ├── hooks/
│       │   ├── useExamTimer.ts    # Countdown + Auto-Submit
│       │   └── useAutosave.ts
│       ├── types/
│       │   └── react-pivottable.d.ts
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Login.tsx
│       │   ├── Register.tsx
│       │   ├── Courses.tsx
│       │   ├── CourseDetail.tsx    # Hero Dashboard + Sidebar TOC
│       │   ├── Exercise.tsx        # Üben/Prüfung Toggle
│       │   ├── Dashboard.tsx
│       │   ├── TeacherPanel.tsx
│       │   └── NotFound.tsx
│       └── components/
│           ├── ErrorBoundary.tsx
│           ├── navigation/
│           │   ├── UserMenu.tsx
│           │   ├── CommandPalette.tsx
│           │   ├── Breadcrumbs.tsx
│           │   └── MobileDrawer.tsx
│           ├── spreadsheet/
│           │   ├── SpreadsheetHandsontable.tsx  # ~1400 Zeilen
│           │   ├── ExcelRibbon.tsx
│           │   ├── FormulaBar.tsx
│           │   ├── StatusBar.tsx
│           │   ├── ContextMenu.tsx
│           │   ├── ChartDialog.tsx
│           │   ├── DataValidationDialog.tsx
│           │   ├── PivotTableDialog.tsx
│           │   └── types.ts
│           ├── animations/
│           │   └── Celebrations.tsx
│           ├── visualizations/
│           │   └── Charts.tsx
│           ├── gamification/
│           │   ├── DailyGoal.tsx
│           │   └── Notifications.tsx
│           ├── community/
│           │   └── Comments.tsx
│           ├── tour/
│           │   └── OnboardingTour.tsx
│           ├── a11y/
│           │   └── Accessibility.tsx
│           └── help/
│               └── KeyboardHelp.tsx
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── data/                    # SQLite DB files (gitignored)
│   └── src/
│       ├── server.ts
│       ├── db/
│       │   ├── database.ts      # SQLite WAL mode
│       │   ├── seed.ts          # Seeder (imports JSON)
│       │   └── exercises/       # course1-4.json
│       ├── middleware/
│       │   └── auth.ts          # JWT Middleware
│       ├── routes/
│       │   ├── auth.ts
│       │   ├── courses.ts       # + learningObjectives, theory
│       │   ├── exercises.ts
│       │   ├── teacher.ts
│       │   ├── gamification.ts
│       │   ├── enterprise.ts
│       │   ├── adaptive.ts
│       │   └── community.ts
│       └── utils/
│           └── spacedRepetition.ts
│
├── docs/
│   ├── screen.jpg               # README Screenshot
│   ├── examen.md
│   ├── examen2.md
│   ├── mejoras5.md
│   ├── course-detail-redesign-proposal.md
│   └── navbar-redesign-proposal.md
│
└── .github/
    ├── copilot-instructions.md
    ├── agents/
    │   ├── backend.agent.md
    │   └── spreadsheet.agent.md
    └── prompts/
        └── spreadsheet-dev.prompt.md
```

### Statistiken

| Metrik | Wert |
|--------|------|
| Source-Dateien | 45+ (.tsx/.ts/.css) |
| Code-Zeilen | ~12.000 |
| Komponenten | 25 + 9 Pages |
| API-Endpunkte | 30 |
| DB-Tabellen | 8+ |
| Lucide Icons | 60+ |
| CSS Utilities | 30+ |
| Sprache | Deutsch |

---

> **Autor**: Excel-lenz Development Team  
> **Letzte Aktualisierung**: 31. Juli 2026  
> **Status**: 🟢 **v3.1** — Dokumentation aktuell

