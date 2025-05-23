import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            name: string;
            id: string;
            cpf: string;
            role: string;
        };
        accessToken: string;
    }

    interface User {
        name: string;
        id: string;
        cpf: string;
        role: string;
        accessToken: string;
    }
}
