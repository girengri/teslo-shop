import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const session: any = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const { protocol, host, pathname } = req.nextUrl;

    if (!session) {
        if (pathname.startsWith("/api/admin")) {
            return NextResponse.redirect(`${protocol}//${host}/api/unauthorized`);
        }

        return NextResponse.redirect(
            `${protocol}//${host}/auth/login?p=${pathname}`
        );
    }

    const validRoles = ["admin", "client"];

    if (pathname.startsWith("/api/admin")) {
        if (!validRoles.includes(session.user.role)) {
            return NextResponse.redirect(`${protocol}//${host}/api/unauthorized`);
        }
    }

    if (pathname.startsWith("/admin")) {
        if (!validRoles.includes(session.user.role)) {
            return NextResponse.redirect(`${protocol}//${host}/`);
        }
    }

    return NextResponse.next();
}
// Sólo las rutas declaradas aquí ejecutarán el middleware
export const config = {
    matcher: ["/checkout/:path*", "/admin/:path*", "/api/admin/:path*"],
};
