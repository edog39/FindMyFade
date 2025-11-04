# Neon Database Branching for Pull Requests

This project uses Neon's database branching feature to automatically create preview databases for each pull request.

## 🎯 What This Does

When you create a pull request:
1. ✅ Creates a new Neon database branch
2. ✅ Runs Prisma migrations automatically
3. ✅ Comments on the PR with database info
4. ✅ Shows schema diff in PR comments
5. ✅ Auto-deletes the branch when PR is closed
6. ✅ Branches expire after 2 weeks

## 🔧 Setup Instructions

### Step 1: Get Your Neon Project ID

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Go to **Settings** → **General**
4. Copy your **Project ID** (starts with `ep-`)

### Step 2: Create a Neon API Key

1. In Neon Console, go to **Account Settings** (top right)
2. Click **Developer Settings** → **API Keys**
3. Click **Create new API key**
4. Give it a name like "GitHub Actions"
5. Copy the API key (you won't see it again!)

### Step 3: Add GitHub Secrets & Variables

#### Add Repository Secret:
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NEON_API_KEY`
5. Value: Paste your Neon API key
6. Click **Add secret**

#### Add Repository Variable:
1. Still in **Settings** → **Secrets and variables** → **Actions**
2. Click the **Variables** tab
3. Click **New repository variable**
4. Name: `NEON_PROJECT_ID`
5. Value: Paste your Neon Project ID
6. Click **Add variable**

## ✅ That's It!

Now when you create a pull request:
- A preview database will be created automatically
- You'll see a comment with the database details
- The database will be deleted when you close/merge the PR

## 📋 Example PR Comment

```
🎉 Preview Database Created!

✅ Branch: preview/pr-123-feature-branch
✅ Migrations applied
✅ Expires: 2024-01-15T12:00:00Z

This database branch will be automatically deleted when the PR is closed.
```

## 🔍 Troubleshooting

### Workflow fails on first run?
- Make sure you've added both `NEON_API_KEY` (secret) and `NEON_PROJECT_ID` (variable)
- Check that your API key has the correct permissions

### Migration errors?
- Ensure your `prisma/schema.prisma` is valid
- Check that `DATABASE_URL` in your main branch works

### Need to test locally?
You can manually create branches:
```bash
# Using Neon CLI
npx neonctl branches create --name test-branch
```

## 🎉 Benefits

✅ **Isolated Testing**: Each PR gets its own database  
✅ **Safe Migrations**: Test schema changes before merging  
✅ **No Conflicts**: Multiple PRs don't interfere with each other  
✅ **Automatic Cleanup**: Branches auto-delete after PR closes  
✅ **Cost Efficient**: Branches expire after 2 weeks  

## 📚 Learn More

- [Neon Branching Docs](https://neon.tech/docs/guides/branching)
- [GitHub Actions Workflow](https://docs.github.com/en/actions)
- [Prisma with Neon](https://www.prisma.io/docs/guides/database/neon)

