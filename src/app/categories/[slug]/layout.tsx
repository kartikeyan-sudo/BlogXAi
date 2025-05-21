// This file serves as a layout for the categories/[slug] route
// It allows us to separate server and client components

// This function is used by Next.js to generate static paths for the category pages
export async function generateStaticParams() {
  // For static export, we'll return a minimal set of paths
  // In a real deployment with server components, we would fetch from the database
  return [
    { slug: 'technology' },
    { slug: 'programming' },
    { slug: 'web-development' },
    { slug: 'javascript' },
    { slug: 'react' }
  ];
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
