# Implementation Plan: Vercel Deployment Fix

## Overview

This implementation plan addresses the Vercel deployment failures by fixing the Prisma schema configuration, validating all configuration files, and ensuring proper environment variable handling. Tasks are ordered to fix the most critical blocking issues first.

## Tasks

- [ ] 1. Fix Prisma Schema Configuration
  - Update `prisma/schema.prisma` to include `url = env("DATABASE_URL")` in the datasource block
  - This is the primary blocking issue preventing deployment
  - _Requirements: 1.1, 1.3, 3.2_

- [ ]* 1.1 Write unit test for Prisma schema structure
  - Verify schema file contains datasource with provider and url properties
  - Verify url uses env("DATABASE_URL") syntax
  - _Requirements: 1.1, 1.3_

- [ ]* 1.2 Write property test for Prisma client generation
  - **Property 3: Build Process Independence**
  - **Validates: Requirements 1.2, 4.1, 4.2, 4.3**

- [ ] 2. Validate and Test Build Process Locally
  - Run `npx prisma generate` to verify Prisma client generation works
  - Run `npm run build` to verify Next.js build succeeds
  - Verify build completes without errors
  - _Requirements: 1.2, 3.1, 3.2_

- [ ]* 2.1 Write unit test for build script configuration
  - Verify package.json build script includes "prisma generate && next build"
  - Verify correct command ordering
  - _Requirements: 3.1_

- [ ] 3. Optimize Next.js Configuration
  - Update `next.config.ts` to remove unnecessary env exposure
  - Keep only `outputFileTracingRoot` configuration
  - Verify configuration is valid TypeScript
  - _Requirements: 5.2_

- [ ]* 3.1 Write unit test for Next.js configuration
  - Verify next.config.ts exports valid NextConfig object
  - Verify it can be imported without errors
  - _Requirements: 5.2_

- [ ] 4. Validate All Configuration Files
  - Verify `vercel.json` has correct buildCommand and installCommand
  - Verify `tsconfig.json` is valid and compatible with Next.js
  - Verify `package.json` has all required scripts
  - _Requirements: 5.1, 5.3, 5.4, 5.5_

- [ ]* 4.1 Write property test for configuration file parsing
  - **Property 1: Configuration Files Validity**
  - **Validates: Requirements 1.1, 1.3, 3.1, 5.1, 5.2, 5.3, 5.4, 5.5**

- [ ] 5. Add Environment Variable Validation
  - Create utility function to check for required environment variables
  - Add validation for DATABASE_URL, JWT_SECRET, SMTP_* variables
  - Provide clear error messages when variables are missing
  - Add validation check at application startup
  - _Requirements: 2.5, 4.4_

- [ ]* 5.1 Write unit tests for environment variable validation
  - Test that validation function detects missing variables
  - Test that clear error messages are provided
  - _Requirements: 2.5_

- [ ]* 5.2 Write property test for environment variable handling
  - **Property 5: Environment Variable Handling**
  - **Validates: Requirements 2.5, 4.4**

- [ ] 6. Checkpoint - Verify Local Build Success
  - Ensure all tests pass
  - Ensure `npm run build` completes successfully
  - Ensure Prisma client is generated correctly
  - Ask the user if questions arise

- [ ] 7. Create Deployment Documentation
  - Document required Vercel environment variables
  - Document DATABASE_URL format for MySQL
  - Create checklist for Vercel configuration
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 8. Final Checkpoint - Ready for Deployment
  - Confirm all configuration files are valid
  - Confirm build process works locally
  - Provide user with Vercel environment variable checklist
  - Ask the user to configure Vercel environment variables before deployment

## Notes

- Tasks marked with `*` are optional and can be skipped for faster deployment fix
- Task 1 is the critical blocking issue and must be completed first
- Tasks 2-6 ensure the fix is robust and properly tested
- Task 7 provides documentation for Vercel configuration (manual step)
- Task 8 is a final verification before attempting Vercel deployment
- The user will need to manually configure environment variables in Vercel dashboard (Requirements 2.1-2.4)

## Required Vercel Environment Variables

The following environment variables must be configured in Vercel project settings:

```
DATABASE_URL=mysql://username:password@host:port/database
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
SMTP_SECURE=false
NEXT_PUBLIC_APP_NAME=HireMe Rwanda
```
