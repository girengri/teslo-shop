import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith("/checkout")) {
        const token = req.cookies.get("token");

        try {
            await jose.jwtVerify(
                token || "",
                new TextEncoder().encode(process.env.JWT_SECRET_SEED || "")
            );
            //Si no se lanza ningún error, el JWT es válido, puede ser igual al payload si es necesario
            return NextResponse.next();
        } catch (error) {
            console.error(`JWT Invalid or not signed in`, { error });
            const { protocol, host, pathname } = req.nextUrl;
            // aquí el instructor utiliza p en lugar de previousPath
            return NextResponse.redirect(
                `${protocol}//${host}/auth/login?p=${pathname}`
            );
        }
    }
}
// Sólo las rutas declaradas aquí ejecutarán el middleware
export const config = {
    matcher: ["/checkout/:path*"],
};
