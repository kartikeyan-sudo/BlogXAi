// This file is used to configure the API routes for static export
// By exporting this configuration, we tell Next.js to exclude these routes from static generation
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
