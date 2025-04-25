"use client";

import Navbar from "@/components/Navbar";
import React from "react";

export default function ResumoMensalPage() {
  return (
    <div>
                        <Navbar />
                        <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Resumo Mensal</h1>

      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl">
        <p className="text-gray-600 text-center">
          Esta página é destinada ao Resumo Mensal dos seus estudos.
        </p>

        {/* Conteúdo que você quiser adicionar futuramente */}

        <div className="mt-8 text-center">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Adicionar Novo Resumo
          </button>
        </div>
      </div>
    </div>
    </div>
    
  );
}
