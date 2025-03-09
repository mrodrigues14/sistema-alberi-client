import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            cpf: string;
            role: string;
        };
        accessToken: string;
    }

    interface User {
        id: string;
        cpf: string;
        role: string;
        accessToken: string;
    }
}
