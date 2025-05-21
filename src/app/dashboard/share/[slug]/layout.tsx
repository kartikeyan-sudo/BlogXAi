// This file serves as a layout for the dashboard/share/[slug] route
// It allows us to separate server and client components

// This function is used by Next.js to generate static paths for the dashboard share pages
export async function generateStaticParams() {
  // For static export, we'll return a minimal set of paths
  // In a real deployment with server components, we would fetch from the database
  return [
    { slug: 'getting-started-with-nextjs' },
    { slug: 'introduction-to-react' },
    { slug: 'web-development-trends' }
  ];
}

export default function SharePostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
