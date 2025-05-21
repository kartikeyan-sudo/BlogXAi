#!/bin/bash

# Install dependencies explicitly
echo "Installing dependencies..."
npm install

# Install Tailwind CSS explicitly
echo "Installing Tailwind CSS explicitly..."
npm install tailwindcss postcss autoprefixer --no-save

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build the application
echo "Building the application..."
npm run build

echo "Build process completed!"
