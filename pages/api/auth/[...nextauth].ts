import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { dbUsers } from "../../../database";

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        Credentials({
            name: "Custom Login",
            credentials: {
                email: {
                    label: "Correo",
                    type: "email",
                    placeholder: "correo@google.com",
                },
                password: {
                    label: "Contraseña",
                    type: "password",
                    placeholder: "Contraseña",
                },
            },
            async authorize(credentials) {
                return await dbUsers.checkUserEmailPassword(
                    credentials!.email,
                    credentials!.password
                );
            },
        }),

        // ...add more providers here

        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],

    // Callbacks
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token;

                switch (account.type) {
                    case "oauth":
                        token.user = await dbUsers.oAuthToDbUse(
                            user?.email || "",
                            user?.name || ""
                        );
                        break;

                    case "credentials":
                        token.user = user;
                        break;
                }
            }

            return token;
        },

        async session({ session, token, user }) {
            session.accessToken = token.accessToken;
            session.user = token.user as any;

            return session;
        },
    },
};

export default NextAuth(authOptions);
