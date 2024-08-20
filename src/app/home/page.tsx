'use client'

import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Home() {
    return (
        <>
            {/* Navbar fixa no topo */}
            <div className="fixed top-0 left-0 w-full z-10">
                <Navbar />
            </div>

            {/* Conteúdo da página */}
            <div className={`bg-[#115C5E] ${font.className} h-screen flex flex-col items-center justify-center overflow-hidden`}>
                <div className="flex w-full justify-around items-center h-full pt-20">
                    {/* Seção de Links à Esquerda */}
                    <div className="text-white space-y-4">
                        <a href="#" className="block text-center">CALENDÁRIO</a>
                        <a href="#" className="block text-center">NOTÍCIAS</a>
                        <a href="#" className="block text-center">FOTOS</a>
                    </div>

                    {/* Logotipo Centralizado */}
                    <div className="flex justify-center">
                        <img src="/logo.png" alt="Alberi Consult Logo" className="h-48" />
                    </div>

                    {/* Cartão de Notícia à Direita */}
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-xs">
                        <img src="/logo.png" alt="Notícia" className="h-24 mx-auto mb-4" />
                        <h2 className="text-black text-center font-bold">NOTÍCIA</h2>
                    </div>
                </div>
            </div>
        </>
    );
}
