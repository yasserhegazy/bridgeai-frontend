import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Get the redirect path based on user role
 * @param role - User role ('ba' or 'client')
 * @returns The path to redirect to
 */
function getRoleBasedRedirectPath(role: string | undefined): string {
  // Both BA and Client redirect to teams
  return "/teams"
}

export function middleware(request: NextRequest) {
  // Get the token and role from cookies
  const token = request.cookies.get("token")?.value
  const role = request.cookies.get("role")?.value

  // Check if the user is trying to access a protected route
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/teams') ||
    request.nextUrl.pathname.startsWith('/projects') ||
    request.nextUrl.pathname.startsWith('/chats')
  
  // Check if accessing role selection page
  const isRoleSelectionPage = request.nextUrl.pathname.startsWith('/auth/select-role')

  // If accessing a protected route and not authenticated, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // If authenticated but no role selected, redirect to role selection page
  if (isProtectedRoute && token && !role) {
    return NextResponse.redirect(new URL("/auth/select-role", request.url))
  }

  // If accessing role selection page
  if (isRoleSelectionPage) {
    // Not authenticated -> redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    // Already has role -> redirect to teams
    if (role && (role === 'ba' || role === 'client')) {
      return NextResponse.redirect(new URL("/teams", request.url))
    }
    // Has token but no role -> allow access to role selection
  }

  // If accessing login page and already authenticated with role, redirect to teams
  if (request.nextUrl.pathname.startsWith('/auth/login') && token && role) {
    const redirectPath = getRoleBasedRedirectPath(role)
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Protected routes
    '/teams/:path*',
    '/projects/:path*',
    '/chats/:path*',
    // Auth routes
    '/auth/login',
    '/auth/select-role',
  ],
}