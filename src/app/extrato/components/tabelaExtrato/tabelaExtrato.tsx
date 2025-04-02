"use client";

import React, { useState, useEffect } from "react";
import { FaDivide, FaEdit, FaHandPointer, FaPaperclip, FaSave, FaTrash, FaTimes } from "react-icons/fa";
import CustomDropdown from "../dropdown/CustomDropdown";

interface Props {
  dados: any[];
  saldoInicial?: number;
  mesAno?: string;
  banco?: string;
  selecionados: number[];
  onToggleSelecionado: (id: number) => void;
  onSelecionarTodos: () => void;
  categoriasFormatadas: { label: string; value: number }[];
  fornecedoresFormatados: { label: string; value: number }[];
}


const TabelaExtrato: React.FC<Props> = ({
  dados,
  saldoInicial ,
  mesAno = "03/2024",
  banco = "Banco X",
  selecionados,
  onToggleSelecionado,
  onSelecionarTodos,
  categoriasFormatadas,
  fornecedoresFormatados
}) => {


  const [saldoFinal, setSaldoFinal] = useState(saldoInicial);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    let saldoAcumulado = saldoInicial ?? 0; // Provide a default value of 0 if saldoInicial is undefined
    dados.forEach((row) => {
      const entrada = parseFloat(row.entrada?.replace(/\./g, "").replace(",", ".") || "0");
      const saida = parseFloat(row.saida?.replace(/\./g, "").replace(",", ".") || "0");
      saldoAcumulado += entrada - saida;
    });

    setSaldoFinal(prevSaldo => (prevSaldo !== saldoAcumulado ? saldoAcumulado : prevSaldo));
  }, [dados, saldoInicial]);

  let saldoAcumulado = saldoInicial ?? 0;

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

  const formatarMoeda = (valor: string | number) => {
    let numero: number;
  
    if (typeof valor === "number") {
      numero = valor;
    } else if (typeof valor === "string") {
      const semEspacos = valor.trim();
      const somenteNumeros = parseFloat(semEspacos);
  
      if (!isNaN(somenteNumeros)) {
        numero = somenteNumeros;
      } else {
        const convertido = parseFloat(valor.replace(/\./g, "").replace(",", "."));
        if (isNaN(convertido)) return "-";
        numero = convertido;
      }
    } else {
      return "-";
    }
  
    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  

  return (
    <div className="flex justify-center items-center mt-8">
      <div className="w-[5000px] bg-white rounded-lg shadow-lg p-4 overflow-auto">

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
                {saldoInicial?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-center">
              <div className="bg-blue-700 text-white px-4 py-2 rounded-t">
                Saldo Final
              </div>
              <div className="border px-4 py-2 rounded-b">
                {saldoFinal?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              const entrada = parseFloat(row.entrada || "0");
              const saida = parseFloat(row.saida || "0");
              
              saldoAcumulado = saldoAcumulado + entrada - saida;
              
              return (
                <tr
                  key={index}
                  className={`odd:bg-white even:bg-gray-100 transition ${selecionados.includes(row.id) ? "bg-green-100 border-2 border-green-500" : ""
                    }`}
                >
                  <td className="border px-2 py-2 whitespace-nowrap">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editData.data}
                        onChange={(e) => handleChange(e, "data")}
                        className="w-28 border px-2 py-1" // largura fixa
                      />
                    ) : (
                      row.data
                    )}
                  </td>

                  <td className={`border px-2 py-2 whitespace-nowrap relative group ${editIndex === index ? "min-w-[250px]" : ""}`}>
                  {editIndex === index ? (
                      <CustomDropdown
                        label="Rubrica"
                        options={categoriasFormatadas}
                        selectedValue={editData.rubricaSelecionada}
                        onSelect={(value) => handleChange({ target: { value } } as any, "rubricaSelecionada")}
                        type="rubrica"
                      />

                    ) : (
                      <span className="group relative cursor-pointer">
                        {row.rubricaSelecionada.length > 30 ? row.rubricaSelecionada.slice(0, 30) + "..." : row.rubricaSelecionada}
                        {row.rubricaSelecionada.length > 30 && (
                          <span className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {row.rubricaSelecionada}
                          </span>
                        )}
                      </span>
                    )}
                  </td>

                  <td className={`border px-2 py-2 whitespace-nowrap relative group ${editIndex === index ? "min-w-[250px]" : ""}`}>
                  {editIndex === index ? (
                      <CustomDropdown
                        label="Fornecedor"
                        options={fornecedoresFormatados}
                        selectedValue={editData.fornecedorSelecionado}
                        onSelect={(value) => handleChange({ target: { value } } as any, "fornecedorSelecionado")}
                        type="fornecedor"
                      />

                    ) : (
                      <span className="group relative cursor-pointer">
                        {row.fornecedorSelecionado.length > 30 ? row.fornecedorSelecionado.slice(0, 30) + "..." : row.fornecedorSelecionado}
                        {row.fornecedorSelecionado.length > 30 && (
                          <span className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {row.fornecedorSelecionado}
                          </span>
                        )}
                      </span>
                    )}
                  </td>

                  <td className="border px-2 py-2 whitespace-nowrap relative group">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editData.observacao}
                        onChange={(e) => handleChange(e, "observacao")}
                        className="w-full border px-2 py-1"
                      />
                    ) : (
                      <span className="group relative cursor-pointer">
                        {row.observacao.length > 30 ? row.observacao.slice(0, 30) + "..." : row.observacao}
                        {row.observacao.length > 30 && (
                          <span className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {row.observacao}
                          </span>
                        )}
                      </span>
                    )}
                  </td>

                  <td className="border px-2 py-2 whitespace-nowrap relative group">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editData.nomeNoExtrato}
                        onChange={(e) => handleChange(e, "nomeNoExtrato")}
                        className="w-full border px-2 py-1"
                      />
                    ) : (
                      <span className="group relative cursor-pointer">
                        {row.nomeNoExtrato.length > 30 ? row.nomeNoExtrato.slice(0, 30) + "..." : row.nomeNoExtrato}
                        {row.nomeNoExtrato.length > 30 && (
                          <span className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {row.nomeNoExtrato}
                          </span>
                        )}
                      </span>
                    )}
                  </td>

                  <td className="border px-2 py-2 whitespace-nowrap relative group">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editData.rubricaContabil}
                        onChange={(e) => handleChange(e, "rubricaContabil")}
                        className="w-full border px-2 py-1"
                      />
                    ) : (
                      <span className="group relative cursor-pointer">
                        {row.rubricaContabil.length > 30 ? row.rubricaContabil.slice(0, 30) + "..." : row.rubricaContabil}
                        {row.rubricaContabil.length > 30 && (
                          <span className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {row.rubricaContabil}
                          </span>
                        )}
                      </span>
                    )}
                  </td>

                  <td className="border px-2 py-2 text-right whitespace-nowrap">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={formatarMoeda(editData.entrada)} // Formata na exibição
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/[^\d,]/g, "").replace(",", ".");
                          setEditData({ ...editData, entrada: rawValue });
                        }}
                        className="w-full border px-2 py-1 text-right"
                      />
                    ) : (
                      formatarMoeda(row.entrada) || '-'
                    )}
                  </td>
                  <td className="border px-2 py-2 text-right whitespace-nowrap">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={formatarMoeda(editData.saida)} // Formata na exibição
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/[^\d,]/g, "").replace(",", ".");
                          setEditData({ ...editData, saida: rawValue });
                        }}
                        className="w-full border px-2 py-1 text-right"
                      />
                    ) : (
                      formatarMoeda(row.saida) || '-'
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

                          <button
                            className={`hover:text-green-700 ${selecionados.includes(row.id) ? "text-green-700" : "text-gray-400"}`}
                            title="Selecionar linha"
                            onClick={() => onToggleSelecionado(row.id)}
                          >
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