'use client';

import { Poppins } from "next/font/google";
import {SetStateAction, useEffect, useState} from "react";
import {useSession} from "next-auth/react";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Navbar() {
    const {data: session} =  useSession();
    const [usuario, setUsuario] = useState('Carregando...');

    useEffect(() => {
        if (session && session.user) {
            console.log("ID do usuário:", session.user.id);
            console.log("Nome do usuário:", session.user.name);
            console.log("Role do usuário:", session.user.role);
            console.log("Token de acesso:", session.accessToken);
            setUsuario(session.user.name || 'Desconhecido');
        } else {
            setUsuario('Usuário não autenticado');
        }
    }, [session]);

    return (
        <nav className={`bg-white shadow-md py-2 ${font.className}`}>
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <a href="/home" className="px-4 py-2 border rounded hover:bg-[#8BACAF] transition">
                        Menu inicial
                    </a>
                    <a href="/estudos" className="px-4 py-2 border rounded hover:bg-[#8BACAF] transition">
                        Estudos
                    </a>
                    <a href="/extrato-bancario" className="px-4 py-2 border rounded hover:bg-[#8BACAF] transition">
                        Extrato bancário
                    </a>
                    <a href="/configuracao-cliente" className="px-4 py-2 border rounded hover:bg-[#8BACAF] transition">
                        Configuração de Cliente
                    </a>
                    <a href="/configuracao-usuario" className="px-4 py-2 border rounded hover:bg-[#8BACAF] transition">
                        Configuração de Usuário
                    </a>
                    <a href="/reportar-falha" className="px-4 py-2 border rounded hover:bg-[#8BACAF] transition">
                        Reportar Falha ou melhoria
                    </a>
                    <a href="" className="px-4 py-2 border rounded hover:bg-[#8BACAF] transition">
                        Seletor empresa
                    </a>
                </div>
                <div>
                    <a href="/" className="px-4 py-2 border rounded bg-gray-300 hover:bg-[#8BACAF] transition">
                        {usuario}
                    </a>
                </div>
            </div>
        </nav>
    );
}
