import CredentialsProvider from "next-auth/providers/credentials";
import { JWT as NextAuthJWT } from "next-auth/jwt";
import { Session } from "next-auth";

interface JWT extends NextAuthJWT {
    id?: string;
    cpf?: string;
    role?: string;
    accessToken?: string;
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                cpf: { label: "CPF", type: "text" },
                senha: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                try {
                    console.log("Tentando login com CPF:", credentials.cpf);

                    const response = await fetch(`${process.env.API_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            cpf: credentials.cpf,
                            senha: credentials.senha,
                        }),
                    });

                    console.log("Status da resposta:", response.status);

                    const user = await response.json();
                    console.log("Resposta da API:", user);

                    if (response.ok && user) {
                        return {
                            id: user.idusuarios,
                            name: user.name,
                            cpf: user.cpf,
                            role: user.role,
                            accessToken: user.token,
                        };
                    } else {
                        console.error("Erro ao autorizar:", user);
                        throw new Error(user.message || "Falha ao autenticar");
                    }
                } catch (error: any) {
                    console.error("Erro na autenticação:", error);
                    throw new Error(error.message || "Erro inesperado ao autenticar");
                }
            },
        }),
    ],
    session: {
        strategy: "jwt" as const,
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    pages: {
        signIn: "/auth",
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: any }) {
            if (user) {
                token.id = user.id;
                token.cpf = user.cpf;
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token.id && token.cpf && token.role) {
                session.user = {
                    id: token.id,
                    cpf: token.cpf,
                    role: token.role,
                };
            }
            if (token.accessToken) {
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },
};
