import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            role: string;
        };
        accessToken: string;
    }

    interface User {
        id: string;
        name: string;
        role: string;
        accessToken: string;
    }
}
