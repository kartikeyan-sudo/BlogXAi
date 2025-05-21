// This file serves as a layout for the posts/[slug] route
// It allows us to separate server and client components

// This function is used by Next.js to generate static paths for the post pages
export async function generateStaticParams() {
  // For static export, we'll return a minimal set of paths
  // In a real deployment with server components, we would fetch from the database
  return [
    { slug: 'the-future-of-artificial-intelligence' },
    { slug: 'sustainable-living-small-changes' },
    { slug: 'web-development-trends-2025' },
    { slug: 'getting-started-with-nextjs' },
    { slug: 'introduction-to-react' }
  ];
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
