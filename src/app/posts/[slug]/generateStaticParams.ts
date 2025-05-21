// This function is used by Next.js to generate static paths for the posts
export async function generateStaticParams() {
  // For static export, we'll return a minimal set of paths
  // In a real deployment with server components, we would fetch from the database
  return [
    { slug: 'the-future-of-artificial-intelligence-in-daily-life' },
    { slug: 'sustainable-living-small-changes-with-big-impact' },
    { slug: 'quantum-computing-explained' },
    { slug: 'welcome-to-our-blog' },
    { slug: 'getting-started' },
    { slug: 'about-us' }
  ];
}
