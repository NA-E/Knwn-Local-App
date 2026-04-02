import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function copySupabaseCookies(from: NextResponse, to: NextResponse): NextResponse {
  from.cookies.getAll().forEach(cookie => {
    to.cookies.set(cookie.name, cookie.value)
  })
  return to
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Unauthenticated → login
  if (!user && pathname !== '/login') {
    return copySupabaseCookies(supabaseResponse, NextResponse.redirect(new URL('/login', request.url)))
  }

  // Authenticated on login → dashboard
  if (user && pathname === '/login') {
    return copySupabaseCookies(supabaseResponse, NextResponse.redirect(new URL('/dashboard', request.url)))
  }

  // Root → dashboard
  if (user && pathname === '/') {
    return copySupabaseCookies(supabaseResponse, NextResponse.redirect(new URL('/dashboard', request.url)))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
