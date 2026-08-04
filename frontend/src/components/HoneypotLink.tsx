/**
 * HoneypotLink — Invisible trap for AI scrapers.
 *
 * Renders a link that is visually hidden (off-screen, 1px, transparent)
 * and marked with rel="nofollow" + aria-hidden="true". Humans and
 * screen readers never interact with it. Scrapers that blindly crawl
 * all <a href> links will follow it, hitting /api/honeypot and
 * triggering a 24-hour IP ban on the backend.
 */

export default function HoneypotLink() {
  return (
    <a
      href="/api/honeypot"
      rel="nofollow"
      aria-hidden="true"
      tabIndex={-1}
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      .
    </a>
  );
}
