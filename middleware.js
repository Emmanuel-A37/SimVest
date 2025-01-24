import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const protectedRoutes = ['/dashboard', '/portfolio', '/trade'];
const authProtectedRoutes = ['/signin', '/signup'];

export async function middleware(req) {
  try {
    const url = new URL(req.url);
    const path = url.pathname;
    
    
    const isProtectedRoute = protectedRoutes.includes(path);
    const isAuthRoute = authProtectedRoutes.includes(path);
    
    
    const cookie = await cookies();
    const session = await cookie.get('session')?.value;
    
    if (path === '/signout') {
      const response = NextResponse.redirect(new URL('/', req.url));
      response.cookies.set('session', '', { path: '/', maxAge: 0 });
      return response;
    }

    if (!session) {
     
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      return NextResponse.next();
    }

   
    let userSession;
    try {
      const { payload } = await jwtVerify(session,  new TextEncoder().encode(process.env.SECRET_KEY));
  
      userSession = payload
    } catch (err) {
      console.error('JWT Verification Error:', err.message);
      
      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL('/auth/signin', req.url));
        response.cookies.set('session', '', { path: '/', maxAge: 0 });
        return response;
      }
      return NextResponse.next();
    }

    if (isAuthRoute && userSession?.username) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    

   
    const response = NextResponse.next();
    if (userSession?.username) {
      response.headers.set('X-Custom-Username', userSession.username);
    }
    return response;
  } catch (error) {
    console.error('Middleware Error:', error.message);
    return NextResponse.redirect(new URL('/error', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/portfolio/:path*', '/trade/:path*', '/api/:path*','/signout', '/auth/signin', '/auth/signup'],
};
