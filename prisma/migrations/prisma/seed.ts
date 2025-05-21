import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user if it doesn't exist
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
      },
    });
    console.log('Admin user created');
  }

  // Create default categories if they don't exist
  const categories = [
    { name: 'Technology', slug: 'technology' },
    { name: 'Travel', slug: 'travel' },
    { name: 'Food', slug: 'food' },
    { name: 'Lifestyle', slug: 'lifestyle' },
  ];

  for (const category of categories) {
    const exists = await prisma.category.findUnique({
      where: { slug: category.slug },
    });

    if (!exists) {
      await prisma.category.create({
        data: category,
      });
      console.log(`Category ${category.name} created`);
    }
  }

  // Create default tags if they don't exist
  const tags = [
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'React', slug: 'react' },
    { name: 'NextJS', slug: 'nextjs' },
    { name: 'Prisma', slug: 'prisma' },
  ];

  for (const tag of tags) {
    const exists = await prisma.tag.findUnique({
      where: { slug: tag.slug },
    });

    if (!exists) {
      await prisma.tag.create({
        data: tag,
      });
      console.log(`Tag ${tag.name} created`);
    }
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
