// This file serves as a layout for the API route
// It provides the generateStaticParams function for static export

export async function generateStaticParams() {
  // For static export, we'll return a minimal set of paths
  return [
    { slug: 'getting-started-with-nextjs' },
    { slug: 'introduction-to-react' },
    { slug: 'web-development-trends' },
    { slug: 'the-future-of-artificial-intelligence' },
    { slug: 'sustainable-living-small-changes' }
  ];
}

export default function PostsSlugApiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
