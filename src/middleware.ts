import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const loginPage = '/auth/login';

    const protectedRoutes = ['/home'];

    if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        const token = req.cookies.get('next-auth.session-token')?.value || req.cookies.get('__Secure-next-auth.session-token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL(loginPage, req.url));
        }
    }

    return NextResponse.next();
}
