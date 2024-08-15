import CredentialsProvider from "next-auth/providers/credentials";
import {JWT as NextAuthJWT} from "next-auth/jwt";
import {Session, Session as NextAuthSession} from "next-auth";

interface JWT extends NextAuthJWT {
    id?: string;
    username?: string;
    role?: string;
    accessToken?: string;
}

export const authOptions= {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                cpf: { label: 'CPF', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
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

                if (user && response.ok) {
                    console.log("Dados do usuário autenticado:", user);
                    return {
                        id: user.sub,
                        name: user.username,
                        role: user.role,
                        accessToken: user.access_token,
                    };
                } else {
                    console.log("Autenticação falhou:", user);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: 'jwt' as const,
    },
    jwt: {
        secret: process.env.NEXT_PUBLIC_JWT_SECRET,
    },
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT, user?: any }) {
            if (user) {
                token.id = user.id;
                token.username = user.name;
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            if(token.id != null && token.username != null && token.role != null && token.accessToken != null) {
                session.user.id = token.id;
                session.user.name = token.username;
                session.user.role = token.role;
            }
            if (token.accessToken != null) {
                session.accessToken = token.accessToken;
            }
            return session;
        }
    }
}
