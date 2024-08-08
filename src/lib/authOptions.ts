import CredentialsProvider from "next-auth/providers/credentials";
import {JWT as NextAuthJWT} from "next-auth/jwt";
import {Session as NextAuthSession} from "node:inspector";

interface JWT extends NextAuthJWT {
    id?: string;
}

interface Session extends NextAuthSession {
    user: {
        id?: string;
    };
}

export const authOptions= {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                cpf: { label: 'CPF', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    return null;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_LOGIN_URL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cpf: credentials.cpf,
                        password: credentials.password,
                    })
                });

                const user = await response.json();

                if (user && response.ok)
                    return user;
                else
                    return null;
            }
        })
    ],
    session:{
        strategy: 'jwt' as const,
    },
    jwt:{
        secret: process.env.NEXT_PUBLIC_JWT_SECRET,
    },
    pages: {
        signIn: '/auth/login',
    },
    callbacks:{
        //@ts-ignore
        async session({ session, token }) {
            session.user = token.user;
            return session;
        },
        //@ts-ignore
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        }
    }
}
