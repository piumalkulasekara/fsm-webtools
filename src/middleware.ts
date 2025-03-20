import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Add caching headers for static assets as part of the middleware
export default clerkMiddleware((auth, req) => {
  // Apply caching headers for static assets
  const url = req.nextUrl.pathname;
  if (
    url.includes('/_next/') || 
    url.includes('/images/') ||
    url.endsWith('.js') ||
    url.endsWith('.css') ||
    url.endsWith('.svg') ||
    url.endsWith('.png') ||
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg') ||
    url.endsWith('.ico') ||
    url.endsWith('.woff') ||
    url.endsWith('.woff2')
  ) {
    // Cache static assets for 1 year (31536000 seconds)
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }
  
  // For all other requests, continue with standard auth middleware
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};