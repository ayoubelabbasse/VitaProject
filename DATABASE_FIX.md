# Database Setup Instructions

## Issue Fixed
The database tables were missing. The database has been created and seeded.

## Database Location
- Database file: `dev.db` (in project root)
- Schema: `prisma/schema.prisma`

## To Fix Database Issues:

1. **Delete existing database** (if needed):
   ```bash
   Remove-Item dev.db -Force
   Remove-Item prisma\dev.db -Force
   ```

2. **Create database and tables**:
   ```bash
   npx prisma db push
   ```

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Seed database with test users**:
   ```bash
   npm run db:seed
   ```

## Test Credentials
- **Admin**: admin@vita.ma / admin123
- **User**: user@test.com / user123

## If Login Still Fails:

1. **Restart the dev server**:
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

2. **Check database file exists**:
   - Verify `dev.db` exists in project root
   - File should be at least a few KB in size

3. **Verify Prisma Client**:
   - Check that `src/lib/prisma` directory exists
   - Contains generated Prisma client files

## Important Notes:
- The EPERM error when generating is a Windows file locking issue - it's not critical
- Always restart the dev server after database changes
- Database file is in `.gitignore` by default







