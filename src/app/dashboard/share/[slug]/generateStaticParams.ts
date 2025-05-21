// This function is used by Next.js to generate static paths for the dashboard share pages
export async function generateStaticParams() {
  // For static export, we'll return a minimal set of paths
  // In a real deployment with server components, we would fetch from the database
  return [
    { slug: 'the-future-of-artificial-intelligence-in-daily-life' },
    { slug: 'sustainable-living-small-changes-with-big-impact' },
    { slug: 'quantum-computing-explained' }
  ];
}
