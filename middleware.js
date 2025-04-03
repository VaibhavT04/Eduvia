import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)','/Create','/course(.*)'])

export default clerkMiddleware(async (auth, req)=> {
    if (isProtectedRoute(req)) await auth.protect()
})

export function middleware(request) {
  // Allow Inngest to access the API
  if (request.nextUrl.pathname.startsWith('/api/inngest')) {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/api/inngest/:path*',
  ],
};