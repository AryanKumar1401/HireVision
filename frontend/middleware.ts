import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip auth check for login and signup pages
  if (
    request.nextUrl.pathname.includes('/login') ||
    request.nextUrl.pathname.includes('/signup') ||
    request.nextUrl.pathname.includes('/recruiters/signup')
  ) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Redirect unauthenticated users to the appropriate login page
  if (!session) {
    if (request.nextUrl.pathname.startsWith('/candidates')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/recruiters')) {
      return NextResponse.redirect(new URL('/recruiters/login', request.url))
    }
  } else {
    const user = session.user
    const roles = user?.user_metadata?.app_metadata?.roles || []
    const isRecruiter = roles.includes('recruiter')
    console.log('User roles:', roles)

    // If a recruiter tries to access candidate routes, redirect them
    if (isRecruiter && request.nextUrl.pathname.startsWith('/candidates')) {
      return NextResponse.redirect(new URL('/recruiters', request.url))
    }

    // If a candidate (non-recruiter) tries to access recruiter routes, redirect them
    if (!isRecruiter && request.nextUrl.pathname.startsWith('/recruiters')) {
      return NextResponse.redirect(new URL('/candidates', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/candidates/:path*', '/recruiters/:path*']
}

