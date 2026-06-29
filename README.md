# School Management System

A complete, production-ready School Management System built with Next.js 16, React, Supabase, and Tailwind CSS.

## Features

### Student Features
- 📊 Dashboard with attendance, grades, and assignments overview
- 📝 View assignments and submit work
- 📈 Track grades and academic performance
- 📅 View class timetable
- 👤 Manage personal profile
- 📋 View attendance records
- 🔔 Receive notifications

### Teacher Features
- 👨‍🏫 Dashboard with class and student management
- 📋 Mark attendance for classes
- ✏️ Create and manage assignments
- 📊 Enter and track student grades
- 👥 View and manage enrolled students
- 📈 View class reports and statistics

### Admin Features
- 🎓 System-wide dashboard and analytics
- 👥 Manage all users (students, teachers, admins)
- 🏫 Create and manage classes
- 📊 View system-wide reports and analytics
- ⚙️ System management and configuration

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with email/password
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Row-Level Security (RLS)
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm, npm, or yarn
- Supabase account and project

### Installation

1. **Clone and install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/           # Login page
│   │   ├── signup/          # Registration page
│   │   ├── forgot-password/ # Password recovery
│   │   └── callback/        # OAuth callback
│   ├── dashboard/
│   │   ├── student/         # Student pages
│   │   ├── teacher/         # Teacher pages
│   │   └── admin/           # Admin pages
│   ├── components/          # Shared components
│   ├── context/             # React context (Auth)
│   ├── hooks/               # Custom React hooks
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home redirect
│   └── globals.css          # Global styles
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Client-side Supabase
│   │   └── server.ts        # Server-side Supabase
│   └── types.ts             # TypeScript types
└── middleware.ts            # Next.js middleware
```

## Key Components

### Navbar
- User greeting and navigation
- Logout functionality
- Responsive design

### Sidebar
- Role-based navigation menu
- Collapsible on mobile
- Quick access to all sections

### DashboardLayout
- Combines Navbar and Sidebar
- Consistent layout for all dashboards
- Protected routes with auth checks

### StatCard
- Displays key metrics
- Icons and color-coded categories
- Shows trends and statistics

## Database Schema

### Tables
- **profiles** - User information and roles
- **classes** - Class details and teacher assignments
- **students** - Student-specific information
- **students_classes** - Student-class enrollment
- **attendance** - Attendance records
- **assignments** - Assignment details
- **assignment_submissions** - Student submissions
- **grades** - Grade records
- **notifications** - User notifications
- **timetable** - Class schedule

### Row-Level Security (RLS)
All tables have comprehensive RLS policies to ensure:
- Students can only see their own data
- Teachers can only manage their classes and students
- Admins have system-wide access
- Data isolation by role

## Authentication Flow

1. User signs up/logs in with email and password
2. Supabase creates user account
3. Profile automatically created via trigger
4. User role stored in profile
5. Auth context provides user data to app
6. Middleware protects routes based on auth status
7. Role-based redirects on login

## Features in Detail

### Student Dashboard
- Quick overview of attendance, grades, and assignments
- Recent assignments with due dates
- Quick links to key features
- Attendance tracker with statistics
- Grade history and comments
- Assignment submission interface
- Timetable view by day
- Profile management

### Teacher Dashboard
- Class and student overview
- Quick actions for common tasks
- Recent activity feed
- Student management with filtering
- Attendance marking with bulk operations
- Assignment creation and submission tracking
- Grade entry interface
- Student profile access

### Admin Dashboard
- System-wide statistics
- User management by role
- Class creation and management
- Teacher assignment to classes
- System reports and analytics
- User filtering and search
- Activity monitoring

## Deployment

### Deploy to Vercel

1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy with one click

```bash
vercel deploy
```

## Security Features

- ✅ Row-Level Security (RLS) on all tables
- ✅ Authentication required for all pages
- ✅ Role-based access control (RBAC)
- ✅ Secure password hashing
- ✅ Session management
- ✅ CSRF protection
- ✅ Input validation
- ✅ SQL injection prevention via parameterized queries

## Testing Credentials

After setup, create test accounts with these roles:

**Admin Account**
- Email: admin@school.edu
- Password: Password123!

**Teacher Account**
- Email: teacher@school.edu
- Password: Password123!

**Student Account**
- Email: student@school.edu
- Password: Password123!

## API Routes

All data operations go through Supabase's REST API with RLS policies. No custom API routes are needed as Supabase handles authentication and authorization.

## Performance Optimizations

- ✅ Image optimization
- ✅ Code splitting
- ✅ CSS optimization with Tailwind
- ✅ Lazy loading of components
- ✅ Database query optimization
- ✅ Caching with SWR (where applicable)

## Troubleshooting

### "Supabase URL and API key not found"
- Ensure `.env.local` has correct Supabase credentials
- Restart dev server after adding env variables

### "RLS policy violation"
- Check that user is authenticated
- Verify user role matches the operation
- Check RLS policies in Supabase dashboard

### "User already exists"
- Use different email for signup
- Or reset auth in Supabase dashboard for testing

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT

## Support

For issues and support, please create an issue in the repository or contact the development team.

---

Built with ❤️ using Next.js and Supabase
