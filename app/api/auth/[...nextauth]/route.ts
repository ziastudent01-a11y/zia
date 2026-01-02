import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Hardcoded admin for demo/prototype
                if (
                    credentials?.username === (process.env.ADMIN_USERNAME || "admin") &&
                    credentials?.password === (process.env.ADMIN_PASSWORD || "admin123")
                ) {
                    return { id: "1", name: "Admin User", email: "admin@example.com" };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // session.user.id = token.id as string; 
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev-only",
});

if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    console.warn("⚠️  WARNING: Using default admin credentials. Set ADMIN_USERNAME and ADMIN_PASSWORD in .env for security.");
}

export { handler as GET, handler as POST };
