"use client";

import React, { useState, useEffect } from "react";
import { FaDivide, FaEdit, FaHandPointer, FaPaperclip, FaSave, FaTrash, FaTimes } from "react-icons/fa";
import CustomDropdown from "../dropdown/CustomDropdown";

const TabelaExtrato: React.FC<{ dados: any[], saldoInicial?: number, mesAno?: string, banco?: string }> = ({
  dados,
  saldoInicial = 0,
  mesAno = "03/2024",
  banco = "Banco X"
}) => {
  const [saldoFinal, setSaldoFinal] = useState(saldoInicial);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    let saldoAcumulado = saldoInicial;
    dados.forEach((row) => {
      const entrada = parseFloat(row.entrada?.replace(/\./g, "").replace(",", ".") || "0");
      const saida = parseFloat(row.saida?.replace(/\./g, "").replace(",", ".") || "0");
      saldoAcumulado = saldoAcumulado + entrada - saida;
    });
    setSaldoFinal(saldoAcumulado);
  }, [dados, saldoInicial]);

  let saldoAcumulado = saldoInicial;

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditData(dados[index]);
  };

  const handleSave = (index: number) => {
    // Aqui você pode adicionar a lógica para salvar os dados editados
    dados[index] = editData;
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    setEditData({ ...editData, [field]: e.target.value });
  };
  const formatarMoeda = (valor: string) => {
    // Remove qualquer caractere que não seja número
    const numeroLimpo = valor.replace(/\D/g, "");

    if (!numeroLimpo) return "";

    // Converte para número e divide por 100 para manter casas decimais
    const numero = parseFloat(numeroLimpo) / 100;

    // Retorna no formato BRL
    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  };
  return (
    <div className="flex justify-center items-center mt-8">
      <div className="w-3/4 bg-white rounded-lg shadow-lg p-4 overflow-auto">

        {/* Linha de Saldos e Título */}
        <div className="flex justify-center items-center mt-4">
          <div className="text-center flex-1">
            <h2 className="text-lg font-bold">Extrato {mesAno} - {banco}</h2>
          </div>
          <div className="flex space-x-4">
            <div className="text-center mb-4">
              <div className="bg-blue-700 text-white px-4 py-2 rounded-t">
                Saldo Inicial
              </div>
              <div className="border px-4 py-2 rounded-b">
                {saldoInicial.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-center">
              <div className="bg-blue-700 text-white px-4 py-2 rounded-t">
                Saldo Final
              </div>
              <div className="border px-4 py-2 rounded-b">
                {saldoFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="border px-2 py-2">Data</th>
              <th className="border px-2 py-2">Rubrica Financeira</th>
              <th className="border px-2 py-2">Fornecedor</th>
              <th className="border px-2 py-2">Observação</th>
              <th className="border px-2 py-2">Nome no Extrato</th>
              <th className="border px-2 py-2">Rubrica Contábil</th>
              <th className="border px-2 py-2">Entrada</th>
              <th className="border px-2 py-2">Saída</th>
              <th className="border px-2 py-2">Saldo</th>
              <th className="border px-2 py-2">Anexos</th>
              <th className="border px-2 py-2">Ferramentas</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((row, index) => {
              const entrada = parseFloat(row.entrada?.replace(/\./g, "").replace(",", ".") || "0");
              const saida = parseFloat(row.saida?.replace(/\./g, "").replace(",", ".") || "0");

              saldoAcumulado = saldoAcumulado + entrada - saida;

              return (
                <tr key={index} className="odd:bg-white even:bg-gray-100">
                  <td className="border px-2 py-2 whitespace-nowrap">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editData.data}
                        onChange={(e) => handleChange(e, "data")}
                        className="w-full border px-2 py-1"
                      />
                    ) : (
                      row.data
                    )}
                  </td>
                  <td className="border px-2 py-2 whitespace-nowrap">
                    {editIndex === index ? (
                      <CustomDropdown
                        label="Selecione uma rubrica"
                        options={["Aluguel", "Salários", "Impostos", "Materiais", "Marketing"]}
                        selectedValue={editData.rubricaSelecionada}
                        onSelect={(value) => setEditData({ ...editData, rubricaSelecionada: value })}
                      />


                    ) : (
                      row.rubricaSelecionada
                    )}
                  </td>
                  <td className="border px-2 py-2 whitespace-nowrap">
                    {editIndex === index ? (
                      <CustomDropdown
                        label="Selecione um fornecedor"
                        options={["Fornecedor A", "Fornecedor B", "Fornecedor C", "Fornecedor D"]}
                        selectedValue={editData.fornecedorSelecionado}
                        onSelect={(value) => setEditData({ ...editData, fornecedorSelecionado: value })}
                      />


                    ) : (
                      row.fornecedorSelecionado
                    )}
                  </td>
                  <td className="border px-2 py-2 whitespace-nowrap">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editData.observacao}
                        onChange={(e) => handleChange(e, "observacao")}
                        className="w-full border px-2 py-1"
                      />
                    ) : (
                      row.observacao
                    )}
                  </td>
                  <td className="border px-2 py-2 whitespace-nowrap">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editData.nomeExtrato}
                        onChange={(e) => handleChange(e, "nomeExtrato")}
                        className="w-full border px-2 py-1"
                      />
                    ) : (
                      row.nomeExtrato
                    )}
                  </td>
                  <td className="border px-2 py-2 whitespace-nowrap">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editData.rubricaContabil}
                        onChange={(e) => handleChange(e, "rubricaContabil")}
                        className="w-full border px-2 py-1"
                      />
                    ) : (
                      row.rubricaContabil
                    )}
                  </td>
                  <td className="border px-2 py-2 text-right whitespace-nowrap">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editData.entrada}
                        onChange={(e) => setEditData({ ...editData, entrada: formatarMoeda(e.target.value) })}
                        className="w-full border px-2 py-1 text-right"
                      />

                    ) : (
                      row.entrada || '-'
                    )}
                  </td>
                  <td className="border px-2 py-2 text-right whitespace-nowrap">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editData.saida}
                        onChange={(e) => setEditData({ ...editData, saida: formatarMoeda(e.target.value) })}
                        className="w-full border px-2 py-1 text-right"
                      />

                    ) : (
                      row.saida || '-'
                    )}
                  </td>
                  <td className="border px-2 py-2 text-right whitespace-nowrap">
                    {saldoAcumulado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="border px-2 py-2 text-center">
                    <button className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
                      <FaPaperclip size={16} className="text-gray-700" />
                    </button>
                  </td>
                  <td className="border px-2 py-2 text-center">
                    <div className="flex justify-center items-center space-x-4 h-full">
                      {editIndex === index ? (
                        <>
                          <button className="text-green-500 hover:text-green-700" onClick={() => handleSave(index)}>
                            <FaSave size={20} />
                          </button>
                          <button className="text-red-500 hover:text-red-700" onClick={handleCancel}>
                            <FaTimes size={20} />
                          </button>

                        </>
                      ) : (
                        <>


                          <button className="text-black text-lg">
                            <FaDivide size={20} />
                          </button>
                          <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(index)}>
                            <FaEdit size={20} />
                          </button>

                          <button className="text-green-500 hover:text-green-700">
                            <FaHandPointer size={20} />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <FaTrash size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaExtrato;