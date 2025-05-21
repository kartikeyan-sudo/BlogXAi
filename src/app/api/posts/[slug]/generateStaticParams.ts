// This function is used by Next.js to generate static paths for the API routes
export async function generateStaticParams() {
  // For static export, we'll return an empty array
  // In a real deployment with server components, we would fetch from the database
  return [];
}
