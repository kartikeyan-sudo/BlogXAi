#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing dependencies..."
npm ci

# Generate Prisma client and push database schema
echo "Setting up Prisma..."
npx prisma generate
npx prisma db push --accept-data-loss

# Build the Next.js application
echo "Building Next.js application..."
npm run build
