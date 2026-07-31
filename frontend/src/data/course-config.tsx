import { Sprout, BarChart3, Zap, Brain } from 'lucide-react';

export const COURSE_ICONS: Record<string, React.ReactNode> = {
  'Excel für Anfänger':                <Sprout size={28} />,
  'Datenanalyse & Statistik':          <BarChart3 size={28} />,
  'Fortgeschrittene Funktionen':       <Zap size={28} />,
  'Datenbank & Business Intelligence': <Brain size={28} />,
};

export const COURSE_THEME: Record<string, { gradient: string; accent: string; bg: string }> = {
  'Excel für Anfänger':                { gradient: 'linear-gradient(170deg, #E2E8F0 0%, #CBD5E1 100%)', accent: '#1E293B', bg: '#E2E8F0' },
  'Datenanalyse & Statistik':          { gradient: 'linear-gradient(170deg, #FBF7F0 0%, #F0E4D0 100%)', accent: '#C5A065', bg: '#FBF7F0' },
  'Fortgeschrittene Funktionen':       { gradient: 'linear-gradient(170deg, #F1F5F9 0%, #CBD5E1 100%)', accent: '#2563EB', bg: '#F1F5F9' },
  'Datenbank & Business Intelligence': { gradient: 'linear-gradient(170deg, #EFF6FF 0%, #DBEAFE 100%)', accent: '#2563EB', bg: '#EFF6FF' },
};

export const COURSE_TRANSLATIONS: Record<string, { title: string; description: string }> = {
  'Excel für Anfänger': {
    title: 'Excel-Grundlagen',
    description: 'Von der ersten Formel bis zur professionellen Tabelle: Erlernen Sie die Excel-Oberfläche, grundlegende Funktionen, Zellformatierung und Datenverwaltung. 7 strukturierte Module mit 27 praxisnahen Übungen — perfekt für Berufseinsteiger und Quereinsteiger.',
  },
  'Datenanalyse & Statistik': {
    title: 'Datenanalyse & Statistik',
    description: 'Datenanalyse mit grundlegenden statistischen Funktionen und Diagrammen in Excel.',
  },
  'Fortgeschrittene Funktionen': {
    title: 'Excel für Fortgeschrittene',
    description: 'Beherrschen Sie komplexe Verweisfunktionen, Pivot-Tabellen, Matrixformeln und bedingte Berechnungen. 108 praxisorientierte Übungen zu SVERWEIS, WENN, INDEX, Datumsfunktionen und Datenbankanalyse — entwickelt für Controller, Analysten und Power-User.',
  },
  'Datenbank & Business Intelligence': {
    title: 'Datenbank & Business Intelligence',
    description: 'Datenbank- und Business-Intelligence-Kurs mit fortgeschrittenen Excel-Funktionen.',
  },
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Anfänger',
  intermediate: 'Mittelstufe',
  advanced: 'Experte',
  expert: 'Experte',
};

export function translateCourse(course: { title: string; description: string }) {
  const tr = COURSE_TRANSLATIONS[course.title];
  return {
    title: tr ? tr.title : course.title,
    description: tr ? tr.description : course.description,
  };
}
