# Database Setup Guide

## 📊 Database: SQLite (Simplest & Recommended)

SQLite is a file-based database - perfect for development and small to medium projects. No server needed!

## 🚀 Quick Setup

### 1. Create/Update Environment File

Create `.env` file in project root (or update existing):

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key-here"
```

### 2. Generate Prisma Client

```bash
npm run db:generate
```

### 3. Create Database Tables

```bash
npm run db:push
```

This creates the database file at `prisma/dev.db` with all tables.

### 4. Seed Database (Optional)

Add test data:

```bash
npm run db:seed
```

This creates:
- Admin user: `admin@vita.ma` / `admin123`
- Customer user: `user@test.com` / `user123`
- Sample products

## 🔍 View & Debug Database

### Option 1: Prisma Studio (Visual Database Browser)

```bash
npm run db:studio
```

Opens browser at `http://localhost:5555` - you can:
- View all tables
- Edit data
- Add/delete records
- See relationships

### Option 2: Test Script

```bash
npm run db:test
```

Shows:
- Connection status
- Record counts
- Sample data

## 🛠️ Database Commands

| Command | What it does |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Create/update database tables |
| `npm run db:seed` | Add test data |
| `npm run db:studio` | Open visual database browser |
| `npm run db:reset` | Reset database (deletes all data) |
| `npm run db:test` | Test connection & show data |

## 📁 Database Location

- **Database file**: `prisma/dev.db`
- **Schema**: `prisma/schema.prisma`
- **Seed script**: `prisma/seed.ts`

## 🔧 Troubleshooting

### Database not found?
```bash
npm run db:push
```

### Tables missing?
```bash
npm run db:push
```

### Reset everything?
```bash
npm run db:reset
npm run db:seed
```

### Check connection?
```bash
npm run db:test
```

## 📊 Database Schema

**Models:**
- `User` - User accounts (admin/customer)
- `Product` - Product catalog
- `Order` - Customer orders
- `OrderItem` - Order line items

## 🎯 Next Steps

1. **View database**: `npm run db:studio`
2. **Test connection**: `npm run db:test`
3. **Start dev server**: `npm run dev`

## 💡 Tips

- Database file is in `.gitignore` (won't be committed)
- Use Prisma Studio for debugging
- All changes to `schema.prisma` require `npm run db:push`
- Use `npm run db:test` to verify setup

