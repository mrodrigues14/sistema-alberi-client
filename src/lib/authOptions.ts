import CredentialsProvider from "next-auth/providers/credentials";
import { JWT as NextAuthJWT } from "next-auth/jwt";
import { Session } from "next-auth";

interface JWT extends NextAuthJWT {
    id?: string;
    cpf?: string;
    role?: string;
    nomeDoUsuario?: string;
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

                    const response = await fetch(`${process.env.API_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            cpf: credentials.cpf,
                            senha: credentials.senha,
                        }),
                    });

                    const userResponse = await response.json();

                    if (response.ok && userResponse.user) {
                        const { user } = userResponse;

                        return {
                            id: user.idusuarios, // 🔑 importante!
                            name: user.nomeDoUsuario, // será usado como session.user.name
                            cpf: user.cpf,
                            role: user.role,
                            accessToken: user.token,
                        };
                    } else {
                        console.error("Erro ao autorizar:", userResponse);
                        throw new Error(userResponse.message || "Falha ao autenticar");
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
        signIn: "/auth", // ajuste conforme sua rota de login
    },

    callbacks: {
        // 🔐 Salva os dados no token JWT
        async jwt({ token, user }: { token: JWT; user?: any }) {
            if (user) {
                token.id = user.id;
                token.cpf = user.cpf;
                token.role = user.role;
                token.nomeDoUsuario = user.name ?? "Sem nome";
                token.accessToken = user.accessToken;
            }
            return token;
        },

        // 💾 Injeta os dados na session acessível no front-end
        async session({ session, token }: { session: Session; token: JWT }) {
            session.user = {
                id: token.id ?? "",
                cpf: token.cpf ?? "",
                role: token.role ?? "",
                name: token.nomeDoUsuario ?? "Sem nome",
            };

            if (token.accessToken) {
                session.accessToken = token.accessToken;
            }

            return session;
        }
        ,
    },
};
