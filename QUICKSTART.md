# Quick Start Guide

## 5-Minute Setup

### Step 1: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy your:
   - Project URL
   - Anon Key (public)

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and paste your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### Step 3: Run Development Server

```bash
# Install dependencies (if not already done)
pnpm install

# Start dev server
pnpm dev
```

### Step 4: Access the Application

1. Open [http://localhost:3000](http://localhost:3000)
2. You'll be redirected to login page
3. Create a new account:
   - Email: your-email@example.com
   - Password: Secure password
   - Role: Choose Student, Teacher, or Admin

### Step 5: Test Features

#### As a Student
- View dashboard with attendance and grades
- Check assignments
- See timetable
- View profile

#### As a Teacher  
- Create assignments
- Mark attendance
- Enter grades for students
- View student list

#### As an Admin
- Create classes
- Assign teachers
- Manage users
- View system reports

## Creating Test Data

### Option 1: Manual Entry (Recommended for Testing)

1. **Create Admin Account**
   - Sign up with email: `admin@school.edu`
   - Select role: Admin
   - Verify you can access admin dashboard

2. **Create Teacher Account**
   - Sign up with email: `teacher@school.edu`
   - Select role: Teacher
   - Go to admin and create classes

3. **Create Student Accounts**
   - Sign up with emails: `student1@school.edu`, `student2@school.edu`
   - Select role: Student
   - Admin assigns them to classes

### Option 2: Direct Database Insert (Advanced)

Using Supabase SQL Editor:

```sql
-- Create test admin
INSERT INTO auth.users (email, raw_user_meta_data, email_confirmed_at)
VALUES ('admin@school.edu', '{"role":"admin"}', NOW());

-- Create test teacher
INSERT INTO auth.users (email, raw_user_meta_data, email_confirmed_at)
VALUES ('teacher@school.edu', '{"role":"teacher"}', NOW());

-- Create test students
INSERT INTO auth.users (email, raw_user_meta_data, email_confirmed_at)
VALUES ('student@school.edu', '{"role":"student"}', NOW());
```

## Common Troubleshooting

### "Supabase URL and API key are required"

**Solution**: 
- Check `.env.local` file exists
- Verify credentials are correct
- Restart dev server after updating env file

```bash
# Stop dev server (Ctrl+C)
# Restart
pnpm dev
```

### "RLS policy violation" Error

**Solution**:
- Ensure you're logged in
- Check user role in profiles table
- Verify RLS policies are enabled in Supabase

### "User already exists" on signup

**Solution**:
- Use different email address
- Or delete user from Supabase Auth dashboard

### Application stuck on loading

**Solution**:
- Check browser console for errors
- Verify Supabase credentials
- Clear browser cache and cookies
- Try incognito/private window

## Verifying Setup

### 1. Check Database Tables

In Supabase Dashboard:
1. Go to SQL Editor
2. Run: `SELECT * FROM pg_tables WHERE schemaname = 'public';`
3. You should see 10 tables created

### 2. Verify Auth Is Working

1. Signup with new account
2. Check "Authentication" → "Users" in Supabase
3. New user should appear

### 3. Test Dashboard Access

1. Login with different roles
2. Each should see different dashboard
3. Navigation should work

## Next Steps

### Development
- Customize colors in `app/globals.css`
- Add more features using Supabase
- Create additional reports
- Add email notifications

### Deployment
- Connect GitHub to Vercel
- Set environment variables in Vercel
- Deploy with single click

### Production
- Set up custom domain
- Enable email verification
- Configure password reset
- Set up monitoring
- Enable automatic backups

## File Structure Quick Reference

```
app/
├── auth/           ← Login, signup pages
├── dashboard/
│   ├── student/    ← Student pages
│   ├── teacher/    ← Teacher pages
│   └── admin/      ← Admin pages
├── components/     ← Shared UI components
├── context/        ← Auth context
├── hooks/          ← Custom hooks
├── layout.tsx      ← Root layout
├── page.tsx        ← Home redirect
└── globals.css     ← Global styles

lib/
├── supabase/       ← Supabase clients
└── types.ts        ← TypeScript types
```

## Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

## Support

If you encounter issues:

1. Check the [README.md](./README.md)
2. Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
3. Check Supabase dashboard for errors
4. Review browser console for JavaScript errors

## Success Checklist

- ✅ Environment variables set in `.env.local`
- ✅ Dev server running on `http://localhost:3000`
- ✅ Can login/signup without errors
- ✅ Can access appropriate dashboard for your role
- ✅ Can navigate between pages
- ✅ Database queries working

Once all checks pass, you're ready to develop or deploy! 🚀
