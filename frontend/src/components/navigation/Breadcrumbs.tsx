import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

interface Crumb {
  label: string;
  path: string;
  isLast: boolean;
}

// Route-to-label mapping
const ROUTE_LABELS: Record<string, string> = {
  courses: 'Kurse',
  exercises: 'Übungen',
  dashboard: 'Mein Fortschritt',
  teacher: 'Lehrer-Panel',
  login: 'Anmelden',
  register: 'Registrieren',
  didaktik: 'Didaktik',
};

// UUID pattern: 8-4-4-4-12 hex digits
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Pages where breadcrumbs should appear (not on home or 404)
const CRUMB_ROUTES = ['/courses', '/dashboard', '/teacher', '/exercises', '/didaktik'];

export default function Breadcrumbs() {
  const location = useLocation();

  // Don't show global breadcrumbs on exercise page (rendered inline there)
  if (location.pathname.startsWith('/exercises/')) return null;

  const crumbs = useMemo((): Crumb[] => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length === 0) return [];

    const result: Crumb[] = [{ label: 'Home', path: '/', isLast: pathParts.length === 0 }];

    let accumulated = '';
    for (let i = 0; i < pathParts.length; i++) {
      accumulated += '/' + pathParts[i];
      const isLast = i === pathParts.length - 1;

      let label = ROUTE_LABELS[pathParts[i]] || '';

      // For dynamic segments (UUIDs) or segments without a label, derive a sensible name
      if (!label) {
        const isUuid = UUID_RE.test(pathParts[i]);

        if (isUuid) {
          // Determine context from the parent route segment
          const parentSegment = pathParts[i - 1] || '';
          if (parentSegment === 'courses') {
            label = 'Kursdetails';
          } else if (parentSegment === 'exercises') {
            label = 'Übung';
          } else {
            label = 'Details';
          }
        } else {
          // Non-UUID unknown segment: capitalize it
          label = pathParts[i].charAt(0).toUpperCase() + pathParts[i].slice(1);
        }
      }

      result.push({ label, path: accumulated, isLast });
    }

    return result;
  }, [location.pathname]);

  // Only show on internal pages
  const shouldShow = CRUMB_ROUTES.some(r => location.pathname.startsWith(r));
  if (!shouldShow || crumbs.length <= 1) return null;

  // Detect pages that need a back button in the breadcrumbs
  const isCourseDetail = /^\/courses\/[0-9a-f-]+$/i.test(location.pathname);
  const isCoursesList = location.pathname === '/courses';

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <div className="breadcrumbs-inner">
        {isCourseDetail && (
          <Link to="/courses" className="btn btn-outline btn-sm" style={{ marginRight: 12, display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <ArrowLeft size={14} />
            Zurück zur Übersicht
          </Link>
        )}
        {isCoursesList && (
          <Link to="/" className="btn btn-outline btn-sm" style={{ marginRight: 12, display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <ArrowLeft size={14} />
            Zurück zur Startseite
          </Link>
        )}
        {crumbs.map((crumb, i) => (
          <span key={crumb.path} className="breadcrumb-item">
            {i > 0 && <ChevronRight size={14} className="breadcrumb-sep" />}
            {crumb.isLast ? (
              <span className="breadcrumb-current" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.path} className="breadcrumb-link">
                {i === 0 && <Home size={14} style={{ marginRight: 4 }} />}
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
