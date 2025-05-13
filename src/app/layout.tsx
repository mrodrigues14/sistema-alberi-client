import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/providers/sessionProvider";
import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ClienteProvider } from "@/context/ClienteContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Alberi Consult",
    description: "Sistema de gerenciamento financeiro Alberi Consult para Alberi Consultoria",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="icone_alberi.png" />
        </head>
        <body className={inter.className}>
            <NextAuthSessionProvider>
                <ClienteProvider> 
                    {children}
                </ClienteProvider>
            </NextAuthSessionProvider>
        </body>
        </html>
    );
}
