import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev-only",
});

export const config = {
    // Protect dashboard routes
    matcher: ["/dashboard/:path*"],
};
