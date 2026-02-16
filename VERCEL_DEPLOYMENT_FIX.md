# Vercel Deployment Fix Guide

## Issue Summary

Your Vercel deployment is failing. The build process works locally but fails on Vercel. This is likely due to missing environment variables in your Vercel project settings.

## ✅ What's Already Working

- ✅ Prisma 7 configuration is correct (`prisma.config.ts`)
- ✅ Build script is correct (`prisma generate && next build`)
- ✅ Local build succeeds
- ✅ Prisma client generates successfully

## 🔧 Required Fixes

### 1. Configure Environment Variables in Vercel

Your application requires these environment variables to be set in Vercel:

**Critical (Required for Build & Runtime):**
```
DATABASE_URL=mysql://username:password@host:port/database_name
```

**Required for Runtime:**
```
JWT_SECRET=your_secure_jwt_secret_key_here
SESSION_SECRET=your_secure_session_secret_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=your_email@gmail.com
SMTP_SECURE=false
NEXT_PUBLIC_APP_NAME=HireMe Rwanda
```

### 2. How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project (HireMe-Rwanda)
3. Go to **Settings** → **Environment Variables**
4. Add each variable above with its value
5. Make sure to select all environments: **Production**, **Preview**, and **Development**
6. Click **Save**

### 3. Database URL Format

For MySQL/MariaDB on Vercel, use this format:

```
mysql://username:password@host:port/database_name
```

**Example:**
```
mysql://admin:mypassword@db.example.com:3306/hireme
```

**For connection pooling (recommended for serverless):**
```
mysql://username:password@host:port/database_name?connection_limit=10
```

### 4. Getting Your Database Credentials

If you're using:
- **PlanetScale**: Get connection string from PlanetScale dashboard
- **Railway**: Get connection string from Railway dashboard
- **AWS RDS**: Get endpoint from RDS console
- **DigitalOcean**: Get connection details from database cluster page
- **Aiven**: Get connection string from Aiven console

### 5. SMTP Configuration for Gmail

To use Gmail for sending emails:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password
3. Use this app password as `SMTP_PASS` (not your regular Gmail password)

## 🚀 Deployment Steps

1. **Add all environment variables to Vercel** (see step 2 above)
2. **Commit and push your code** (if you made any local changes)
3. **Trigger a new deployment** in Vercel:
   - Go to your project → Deployments
   - Click "Redeploy" on the latest deployment
   - OR push a new commit to trigger automatic deployment

## 🔍 Verifying the Fix

After adding environment variables and redeploying:

1. Check the deployment logs in Vercel
2. Look for "✓ Generated Prisma Client" in the build logs
3. Look for "✓ Compiled successfully" in the build logs
4. If build succeeds, test your deployed application

## 📋 Checklist

- [ ] DATABASE_URL added to Vercel environment variables
- [ ] JWT_SECRET added to Vercel environment variables
- [ ] SESSION_SECRET added to Vercel environment variables
- [ ] SMTP_* variables added to Vercel environment variables
- [ ] NEXT_PUBLIC_APP_NAME added to Vercel environment variables
- [ ] All variables set for Production, Preview, and Development
- [ ] Triggered new deployment in Vercel
- [ ] Build logs show successful Prisma client generation
- [ ] Build logs show successful Next.js compilation
- [ ] Deployed application is accessible

## 🐛 Troubleshooting

### If build still fails after adding environment variables:

1. **Check Vercel build logs** for specific error messages
2. **Verify DATABASE_URL format** - must be valid MySQL connection string
3. **Check if prisma.config.ts is committed** to your repository
4. **Verify Node.js version** - Vercel should use Node 20+ (specified in package.json engines if needed)

### Common Error Messages:

**"Error: P1012 - datasource property url is no longer supported"**
- This means Prisma is not reading `prisma.config.ts`
- Ensure `prisma.config.ts` is committed to git
- Ensure it's not in `.gitignore`

**"DATABASE_URL is not defined"**
- Environment variable not set in Vercel
- Go to Vercel Settings → Environment Variables and add it

**"Cannot connect to database"**
- Database URL is incorrect
- Database is not accessible from Vercel's servers
- Check firewall rules on your database host

## 📞 Need Help?

If you're still experiencing issues after following this guide:

1. Check the Vercel deployment logs for specific error messages
2. Verify your database is accessible from external connections
3. Test your DATABASE_URL locally by setting it in `.env` and running `npm run build`

## 🎯 Quick Fix Summary

**The most likely issue:** Missing `DATABASE_URL` in Vercel environment variables.

**Quick fix:**
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add: `DATABASE_URL` = `mysql://user:pass@host:port/dbname`
3. Redeploy

Your local build works, so once environment variables are configured in Vercel, your deployment should succeed!
