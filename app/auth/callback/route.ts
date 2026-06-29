import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient(); // ← await add kiya
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${request.nextUrl.origin}/auth/error`);
}
