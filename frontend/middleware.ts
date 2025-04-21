import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip auth check for login and signup pages
  if (
    request.nextUrl.pathname.includes('/login') ||
    request.nextUrl.pathname.includes('/signup') ||
    request.nextUrl.pathname.includes('/recruiters/signup') ||
    request.nextUrl.pathname.includes('/companies/login') ||
    request.nextUrl.pathname.includes('/companies/signin') ||
    request.nextUrl.pathname.includes('/companies/signup')
  ) {
    return NextResponse.next()
  }

  // Check if this is an intentional role switch with bypass parameter
  const bypassRoleCheck = request.nextUrl.searchParams.has('bypass-role-check')
  
  // If bypass parameter is present, allow the request to proceed and remove the parameter
  if (bypassRoleCheck) {
    const cleanUrl = new URL(request.nextUrl.toString())
    cleanUrl.searchParams.delete('bypass-role-check')
    
    // Create a new response with the cleaned URL
    const response = NextResponse.redirect(cleanUrl)
    return response
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
  console.log('Session data:', session)
  // Redirect unauthenticated users to the appropriate login page
  if (!session) {
    if (request.nextUrl.pathname.startsWith('/candidates')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/recruiters')) {
      return NextResponse.redirect(new URL('/recruiters/login', request.url))
    }
    
    if (request.nextUrl.pathname.startsWith('/companies')) {
      return NextResponse.redirect(new URL('/companies/login', request.url))
    }
  } else {
    const user = session.user
    const roles = user?.user_metadata?.app_metadata?.roles || []
    const isRecruiter = roles.includes('recruiter')
    const isCompanyAdmin = roles.includes('company_admin')
    console.log('User roles:', roles)

    // For authenticated users trying to access a route that doesn't match their role,
    // offer a role switch prompt instead of an immediate redirect
    
    // If a recruiter tries to access candidate routes, show role switch prompt
    if (isRecruiter && request.nextUrl.pathname.startsWith('/candidates')) {
      // Check if user is already getting redirected to avoid loops
      if (request.nextUrl.searchParams.has('role-switch')) {
        return NextResponse.next()
      }

      // Redirect to their current dashboard with role switch params
      const roleSwitchUrl = new URL('/recruiters', request.url)
      roleSwitchUrl.searchParams.set('role-switch', 'true')
      roleSwitchUrl.searchParams.set('current-role', 'recruiter')
      roleSwitchUrl.searchParams.set('target-role', 'candidate')
      roleSwitchUrl.searchParams.set('target-path', request.nextUrl.pathname)
      
      return NextResponse.redirect(roleSwitchUrl)
    }

    // If a candidate tries to access recruiter routes, show role switch prompt
    if (!isRecruiter && !isCompanyAdmin && request.nextUrl.pathname.startsWith('/recruiters')) {
      // Check if user is already getting redirected to avoid loops
      if (request.nextUrl.searchParams.has('role-switch')) {
        return NextResponse.next()
      }
      
      // Redirect to their current dashboard with role switch params
      const roleSwitchUrl = new URL('/', request.url)
      roleSwitchUrl.searchParams.set('role-switch', 'true')
      roleSwitchUrl.searchParams.set('current-role', 'candidate')
      roleSwitchUrl.searchParams.set('target-role', 'recruiter')
      roleSwitchUrl.searchParams.set('target-path', request.nextUrl.pathname)
      
      return NextResponse.redirect(roleSwitchUrl)
    }
    
    // If a company admin tries to access candidate routes, show role switch prompt
    if (isCompanyAdmin && request.nextUrl.pathname.startsWith('/candidates')) {
      // Check if user is already getting redirected to avoid loops
      if (request.nextUrl.searchParams.has('role-switch')) {
        return NextResponse.next()
      }
      
      // Redirect to their current dashboard with role switch params
      const roleSwitchUrl = new URL('/companies/dashboard', request.url)
      roleSwitchUrl.searchParams.set('role-switch', 'true')
      roleSwitchUrl.searchParams.set('current-role', 'company_admin')
      roleSwitchUrl.searchParams.set('target-role', 'candidate')
      roleSwitchUrl.searchParams.set('target-path', request.nextUrl.pathname)
      
      return NextResponse.redirect(roleSwitchUrl)
    }
    
    // If a company admin tries to access recruiter routes, show role switch prompt
    if (isCompanyAdmin && request.nextUrl.pathname.startsWith('/recruiters')) {
      // Check if user is already getting redirected to avoid loops
      if (request.nextUrl.searchParams.has('role-switch')) {
        return NextResponse.next()
      }
      
      // Redirect to their current dashboard with role switch params
      const roleSwitchUrl = new URL('/companies/dashboard', request.url)
      roleSwitchUrl.searchParams.set('role-switch', 'true')
      roleSwitchUrl.searchParams.set('current-role', 'company_admin')
      roleSwitchUrl.searchParams.set('target-role', 'recruiter')
      roleSwitchUrl.searchParams.set('target-path', request.nextUrl.pathname)
      
      return NextResponse.redirect(roleSwitchUrl)
    }
    
    // If a candidate or recruiter tries to access company routes, show role switch prompt
    if (!isCompanyAdmin && request.nextUrl.pathname.startsWith('/companies')) {
      // Check if user is already getting redirected to avoid loops
      if (request.nextUrl.searchParams.has('role-switch')) {
        return NextResponse.next()
      }
      
      // Redirect to their current dashboard with role switch params
      const roleSwitchUrl = new URL(isRecruiter ? '/recruiters' : '/', request.url)
      roleSwitchUrl.searchParams.set('role-switch', 'true')
      roleSwitchUrl.searchParams.set('current-role', isRecruiter ? 'recruiter' : 'candidate')
      roleSwitchUrl.searchParams.set('target-role', 'company_admin')
      roleSwitchUrl.searchParams.set('target-path', request.nextUrl.pathname)
      
      return NextResponse.redirect(roleSwitchUrl)
    }
  }

  return response
}

export const config = {
  matcher: ['/candidates/:path*', '/recruiters/:path*', '/companies/:path*']
}

