import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const { pathname } = request.nextUrl;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // No refreshToken = definitely not logged in
  if (!refreshToken) {
    // Redirect to sign-in if trying to access private routes
    if (isPrivateRoute) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // Has refreshToken = potentially logged in
  // (client will verify with session endpoint and get accessToken)

  // Redirect away from auth pages if user has refreshToken
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access to private routes
  // Client-side AuthProvider will handle getting the accessToken
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/sign-in', '/sign-up', '/notes/:path*'],
};
