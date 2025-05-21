# BlogX - Modern Blogging Platform

A full-featured blogging platform built with Next.js, TypeScript, and Tailwind CSS. This application provides a modern, responsive interface for creating, managing, and engaging with blog content.

## Features

### Content Creation & Management
- Rich text editor for post creation
- Draft saving and publishing
- Categories and tags for content organization
- Post metadata (author, date, reading time)

### User & Author Management
- User authentication (login/register)
- User profiles with bio and published posts
- Role-based permissions

### Frontend Features
- Responsive design for all devices
- Dark mode support
- Modern UI with Tailwind CSS
- Category and tag browsing

### Engagement & Community
- Comments section with nested replies
- Like/reaction system
- Share functionality
- Newsletter subscription

### SEO & Performance
- SEO-friendly URLs
- Optimized for performance
- Mobile-first approach

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, React
- **Backend**: Next.js API Routes
- **Database**: Prisma with SQLite (can be configured for other databases)
- **Authentication**: NextAuth.js
- **Content**: React Quill for rich text editing

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd blog-site
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up the database
```bash
npx prisma migrate dev --name init
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
blog-site/
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions and shared logic
│   └── styles/           # Global styles and Tailwind config
├── .gitignore
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Deployment

This application can be deployed to any platform that supports Next.js applications. Below are instructions for deploying to Vercel and Netlify.

### Environment Variables

Before deploying, you need to set up the following environment variables in your deployment platform:

- `DATABASE_URL`: Your PostgreSQL database connection string
- `NEXTAUTH_SECRET`: A secret key for NextAuth.js (can be generated with `openssl rand -hex 32`)
- `NEXTAUTH_URL`: The URL of your deployed application
- `ADMIN_USERNAME`: Admin username for initial setup
- `ADMIN_PASSWORD`: Admin password for initial setup
- `NODE_ENV`: Set to `production` for production deployments

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and sign up or log in
3. Click "New Project" and import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npx prisma generate && npm run build
5. Add the environment variables mentioned above
6. Click "Deploy"

### Deploying to Netlify

1. Push your code to a GitHub repository
2. Go to [Netlify](https://netlify.com) and sign up or log in
3. Click "New site from Git" and select your GitHub repository
4. Configure the build settings:
   - Build command: npx prisma generate && npm run build
   - Publish directory: .next
5. Add the environment variables mentioned above in the "Environment" section
6. Click "Deploy site"

### Using the Deployment Tools

You can also use the deployment tools provided in this repository:

```bash
# Build for production
npm run build
# or
yarn build

# Start production server
npm start
# or
yarn start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
