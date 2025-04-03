"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isValidCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, "");
    return cpf.length === 11;
  };

  useEffect(() => {
    if (cpf && !isValidCPF(cpf)) {
      setCpfError("CPF inválido");
    } else {
      setCpfError("");
    }
  }, [cpf]);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!isValidCPF(cpf)) {
      setCpfError("CPF inválido");
      return;
    }

    setCpfError("");
    setLoginError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        cpf,
        senha,
      });
      if (result?.error) {
        setLoginError(result.error);
      } else {
        router.push("/home");
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      setLoginError(error.message || "Erro desconhecido ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={`bg-[#2d3692] h-screen w-full flex justify-center items-center ${font.className}`}>
      <div className="flex flex-col items-center" style={{ marginTop: '-17rem' }}>
        <Image src="/logo3.png" alt="Alberi Consult" width={680} height={300} />
        <div className="bg-white p-8 rounded-lg shadow-md mt-4 w-96" style={{ marginTop: '-10rem' }}>
          {/* Exibe a mensagem de erro vinda do servidor */}
          {loginError && <p className="text-red-500 text-center mb-4">{loginError}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="cpf" className="block text-gray-700">CPF</label>
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
              <label htmlFor="senha" className="block text-gray-700">Senha</label>
              <input
                type={showPassword ? "text" : "password"}
                id="senha"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
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
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
