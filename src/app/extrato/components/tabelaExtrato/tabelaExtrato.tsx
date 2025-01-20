"use client";

import React from "react";

const TabelaExtrato: React.FC = () => {
  const data = [
    {
      data: "02/01/2025",
      rubrica: "CUSTO FIXO",
      fornecedor: "TAR/CUSTAS COBRANÇA",
      observacao: "",
      nomeExtrato: "",
      rubricaContabil: "",
      entrada: "8,16",
      saida: "-3.812,86",
      saldo: "-3.812,86",
    },
    {
      data: "02/01/2025",
      rubrica: "EMPRÉSTIMOS",
      fornecedor: "JUROS DE LIMITE",
      observacao: "",
      nomeExtrato: "",
      rubricaContabil: "",
      entrada: "84,77",
      saida: "-3.897,63",
      saldo: "-3.897,63",
    },
  ];

  return (
    <div className="flex justify-center items-center mt-8">
      <div className="w-3/4 bg-white rounded-lg shadow-lg p-4 overflow-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="border border-gray-300 px-2 py-2">Data</th>
              <th className="border border-gray-300 px-2 py-2">Rubrica Financeira</th>
              <th className="border border-gray-300 px-2 py-2">Fornecedor</th>
              <th className="border border-gray-300 px-2 py-2">Observação</th>
              <th className="border border-gray-300 px-2 py-2">Nome no Extrato</th>
              <th className="border border-gray-300 px-2 py-2">Rubrica Contábil</th>
              <th className="border border-gray-300 px-2 py-2">Entrada</th>
              <th className="border border-gray-300 px-2 py-2">Saída</th>
              <th className="border border-gray-300 px-2 py-2">Saldo</th>
              <th className="border border-gray-300 px-2 py-2">Anexos</th>
              <th className="border border-gray-300 px-2 py-2">Ferramentas</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-100">
                <td className="border border-gray-300 px-2 py-2">{row.data}</td>
                <td className="border border-gray-300 px-2 py-2">{row.rubrica}</td>
                <td className="border border-gray-300 px-2 py-2">{row.fornecedor}</td>
                <td className="border border-gray-300 px-2 py-2">{row.observacao}</td>
                <td className="border border-gray-300 px-2 py-2">{row.nomeExtrato}</td>
                <td className="border border-gray-300 px-2 py-2">{row.rubricaContabil}</td>
                <td className="border border-gray-300 px-2 py-2">{row.entrada}</td>
                <td className="border border-gray-300 px-2 py-2">{row.saida}</td>
                <td className="border border-gray-300 px-2 py-2">{row.saldo}</td>
                <td className="border border-gray-300 px-2 py-2 text-center">
                  <button className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
                    📎
                  </button>
                </td>
                <td className="border border-gray-300 px-2 py-2 text-center">
                  <button className="text-blue-500 px-1 hover:text-blue-700">✏️</button>
                  <button className="text-green-500 px-1 hover:text-green-700">👍</button>
                  <button className="text-red-500 px-1 hover:text-red-700">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaExtrato;
