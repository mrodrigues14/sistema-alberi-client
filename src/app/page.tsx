'use client';

import Image from "next/image";
import { Poppins } from "next/font/google";
import { useState } from "react";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Home() {

    return (
        <main className={`bg-[#115C5E] h-screen w-full flex justify-center items-center ${font.className}`}>
            <div className="flex flex-col items-center">
                <Image
                    src="/logo.png"
                    alt="Alberi Consult"
                    width={200}
                    height={200}
                />
                <div className="bg-white p-8 rounded-lg shadow-md mt-4 w-80">
                    <h1 className="text-2xl font-bold text-center mb-4">Bem-vindo ao Sistema Alberi</h1>
                    <div className="flex space-x-4 justify-center">
                        <div className="flex">
                            <a href="/auth/login" className="px-4 py-2 border rounded hover:bg-gray-100 transition">
                                Login
                            </a>
                        </div>
                        <div className="flex">
                            <a href="/auth/register" className="px-4 py-2 border rounded hover:bg-gray-100 transition">
                                Cadastro
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
