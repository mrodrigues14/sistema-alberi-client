'use client';

import Image from "next/image";
import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const font = Poppins({
    subsets: ["latin"],
    weight: ["400"],
});

const isValidCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;

    let sum = 0;
    let remainder;

    if (cpf === "00000000000") return false;

    for (let i = 1; i <= 9; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
};

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [cpfError, setCpfError] = useState('');
    const [loginError, setLoginError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (cpf && !isValidCPF(cpf)) {
            setCpfError('CPF inválido');
        } else {
            setCpfError('');
        }
    }, [cpf]);

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (!isValidCPF(cpf)) {
            setCpfError('CPF inválido');
            return;
        }

        setCpfError('');
        setLoginError('');

        try {
            const result = await signIn('credentials', {
                redirect: false,
                cpf,
                password,
            });

            if (result?.error) {
                setLoginError('Erro ao fazer login');
            } else {
                setLoginError('Login bem-sucedido!');
                setTimeout(() => {
                    router.push('/home');
                }, 2000);
            }
        } catch (error) {
            console.error('Erro:', error);
            setLoginError('Erro ao fazer login');
        }
    };

    return (
        <main className={`bg-[#2d3692] h-screen w-full flex justify-center items-center ${font.className}`}>
            <div className="flex flex-col items-center" style={{
                marginTop: '-13rem',
            }}>
                <Image
                    src="/logo3.png"
                    alt="Alberi Consult"
                    width={380}
                    height={200}
                    style={{
                        filter: 'brightness(0) invert(1)',
                        marginBottom: '-4rem',
                    }}
                />
                <div className="bg-white p-8 rounded-lg shadow-md mt-4 w-96">
                    {loginError && <p className={`text-center mb-4 ${loginError.includes('Erro') ? 'text-red-500' : 'text-green-500'}`}>{loginError}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="cpf" className="block text-gray-700">
                                CPF
                            </label>
                            <input
                                type="text"
                                id="cpf"
                                className="mt-1 p-2 w-full border border-gray-300 rounded"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                required
                            />
                            {cpfError && <p className="text-red-500 mt-2">{cpfError}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700">
                                Senha
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="mt-1 p-2 w-full border border-gray-300 rounded"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="showPassword"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                    className="cursor-pointer"
                                />
                                <label htmlFor="showPassword" className="ml-2 text-gray-700 cursor-pointer">
                                    Mostrar Senha
                                </label>
                            </div>
                            <a href="/auth/forgot-password" className="text-gray-700 hover:text-[#115C5E] hover:underline">
                                Esqueci minha senha
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white p-2 rounded mt-4 hover:bg-gray-800 transition duration-200"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
