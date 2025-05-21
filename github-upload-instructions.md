# GitHub Upload Instructions

## Step 1: Create a GitHub Repository
1. Go to [GitHub](https://github.com) and sign in to your account
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "fullstack-ai-blog")
4. Add a description (optional)
5. Choose whether to make it public or private
6. Do NOT initialize with a README, .gitignore, or license
7. Click "Create repository"

## Step 2: Upload Your Project
After creating the repository, you'll see instructions for "…or push an existing repository from the command line"

1. Open a new command prompt or PowerShell window (this is important as we just installed Git)
2. Navigate to your project directory:
   ```
   cd "C:\Users\UN Dubey\Desktop\VS CODE\FullstackAi\blog-site"
   ```

3. Run the following commands (replace YOUR_USERNAME with your GitHub username and YOUR_REPO with your repository name):
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

4. When prompted, enter your GitHub credentials

## Important Notes
- The `.gitignore` file has been updated to exclude sensitive information like environment files and database files
- Make sure to set up your environment variables in Netlify and Vercel dashboards after connecting your GitHub repository
- If you encounter any issues with Git commands, you may need to restart your computer to ensure Git is properly installed

## After Uploading
Once your code is on GitHub, you can:
1. Connect your GitHub repository to Vercel for automatic deployments
2. Claim your Vercel site for full control
3. Set up environment variables in the Vercel dashboard
