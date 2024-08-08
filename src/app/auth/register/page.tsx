'use client';

import Image from "next/image";
import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

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
        sum = sum + parseInt(cpf.substring(i-1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum = sum + parseInt(cpf.substring(i-1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [cpfError, setCpfError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (password !== confirmPassword) {
            setPasswordError('As senhas não correspondem');
        } else {
            setPasswordError('');
        }
    }, [password, confirmPassword]);

    useEffect(() => {
        if (cpf && !isValidCPF(cpf)) {
            setCpfError('CPF inválido');
        } else {
            setCpfError('');
        }
    }, [cpf]);

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setPasswordError('As senhas não correspondem');
            return;
        }

        if (!isValidCPF(cpf)) {
            setCpfError('CPF inválido');
            return;
        }

        setPasswordError('');
        setCpfError('');
        setSuccessMessage('');

        const userData = {
            nome: fullName,
            cpf: cpf,
            password: password,
            email: email
        };

        console.log('Enviando dados do usuário:', userData);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTER_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Erro ao registrar usuário');
            }

            const data = await response.json();
            console.log('Usuário registrado com sucesso:', data);
            setSuccessMessage('Usuário registrado com sucesso!');

            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        } catch (error) {
            console.error('Erro:', error);
            setSuccessMessage('Erro ao registrar usuário');
        }
    };

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
                    {successMessage && <p className={`text-center mb-4 ${successMessage.includes('Erro') ? 'text-red-500' : 'text-green-500'}`}>{successMessage}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="fullName" className="block text-gray-700">
                                Nome completo
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                className="mt-1 p-2 w-full border border-gray-300 rounded"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
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
                            <label htmlFor="email" className="block text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 p-2 w-full border border-gray-300 rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
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
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-gray-700">
                                Confirmar Senha
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                className="mt-1 p-2 w-full border border-gray-300 rounded"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-2 text-gray-700">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                className="cursor-pointer"
                            />
                            <label htmlFor="showPassword" className="ml-2 text-gray-700 ">
                                Mostrar Senha
                            </label>
                        </div>
                        {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
                        <button
                            type="submit"
                            className="w-full bg-black text-white p-2 rounded mt-4 hover:bg-gray-800 transition duration-200"
                        >
                            Registrar
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
