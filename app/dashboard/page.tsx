// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const role = user.user_metadata?.role

  if (role === 'admin') {
    redirect('/dashboard/admin')
  } else if (role === 'teacher') {
    redirect('/dashboard/teacher')
  } else {
    redirect('/dashboard/student')
  }
}