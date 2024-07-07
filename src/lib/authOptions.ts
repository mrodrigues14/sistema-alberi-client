import CredentialsProvider from "next-auth/providers/credentials";
import dotenv from 'dotenv';

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

                const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
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
                    return user;
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: '/auth/login',
    }
}
