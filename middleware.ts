import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        const { protocol, host, pathname } = req.nextUrl;
        return NextResponse.redirect(
            `${protocol}//${host}/auth/login?p=${pathname}`
        );
    }

    return NextResponse.next();
}
// Sólo las rutas declaradas aquí ejecutarán el middleware
export const config = {
    matcher: ["/checkout/:path*"],
};
