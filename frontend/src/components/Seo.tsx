import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description?: string;
  ogImage?: string;
}

/**
 * Reusable SEO component for per-page meta tags.
 * Falls back to document.title for non-JS environments.
 */
export default function Seo({ title, description, ogImage }: SeoProps) {
  const fullTitle = `${title} — Excel-lenz`;
  const defaultDesc = 'Excel-lenz — Interaktives Lerninstitut fur Excel mit Ubungen und integriertem Simulator.';
  const defaultImage = 'https://excel-lenz.com/og-image.png';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
    </Helmet>
  );
}
