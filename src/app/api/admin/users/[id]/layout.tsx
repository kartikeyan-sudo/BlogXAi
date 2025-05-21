// This file serves as a layout for the API route
// It provides the generateStaticParams function for static export

export async function generateStaticParams() {
  // For static export, we'll return a minimal set of paths
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ];
}

export default function AdminUsersIdApiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
