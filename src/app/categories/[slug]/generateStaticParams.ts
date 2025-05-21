// This function is used by Next.js to generate static paths for the categories
export async function generateStaticParams() {
  // For static export, we'll return a minimal set of paths
  // In a real deployment with server components, we would fetch from the database
  return [
    { slug: 'technology' },
    { slug: 'science' },
    { slug: 'lifestyle' },
    { slug: 'health' },
    { slug: 'business' }
  ];
}
