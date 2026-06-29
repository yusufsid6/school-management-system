import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile?.role) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check if accessing correct dashboard for role
    const role = profile.role
    const pathname = request.nextUrl.pathname

    if (
      (pathname.startsWith('/dashboard/student') && role !== 'student') ||
      (pathname.startsWith('/dashboard/teacher') && role !== 'teacher') ||
      (pathname.startsWith('/dashboard/admin') && role !== 'admin')
    ) {
      return NextResponse.redirect(
        new URL(`/dashboard/${role}`, request.url)
      )
    }
  }

  // Redirect authenticated users away from auth pages
  if (request.nextUrl.pathname.startsWith('/auth/') && user) {
    // Get user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role) {
      return NextResponse.redirect(
        new URL(`/dashboard/${profile.role}`, request.url)
      )
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
