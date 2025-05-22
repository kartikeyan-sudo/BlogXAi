import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    posts: number;
    comments: number;
    likes: number;
  };
};

// This function generates the static params at build time
export async function generateStaticParams() {
  // Fetch all user IDs for static generation
  const users = await prisma.user.findMany({
    select: { id: true },
    where: { status: 'ACTIVE' }, // Only include active users for static generation
  });

  return users.map((user) => ({
    id: user.id,
  }));
}

// Revalidate the page every 60 seconds
// This ensures data freshness while still benefiting from static generation
export const revalidate = 60;

async function getUserData(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            posts: true,
            comments: true,
            likes: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUserData(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Details</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6 mb-6">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || 'User'}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-500">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-semibold">{user.name || 'No Name'}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.status}
              </span>
              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700">Account Information</h3>
            <dl className="mt-2 space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
                <dd className="text-sm text-gray-900">
                  {user.emailVerified ? 
                    new Date(user.emailVerified).toLocaleDateString() : 
                    'Not verified'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700">Activity</h3>
            <dl className="mt-2 space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Posts</dt>
                <dd className="text-sm text-gray-900">{user._count.posts}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Comments</dt>
                <dd className="text-sm text-gray-900">{user._count.comments}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Likes</dt>
                <dd className="text-sm text-gray-900">{user._count.likes}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
