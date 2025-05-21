// This file serves as a layout for the edit-post/[id] route
// It allows us to separate server and client components

// This function is used by Next.js to generate static paths for the dashboard edit post pages
export async function generateStaticParams() {
  // For static export, we'll return a minimal set of paths
  // In a real deployment with server components, we would fetch from the database
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ];
}

export default function EditPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
