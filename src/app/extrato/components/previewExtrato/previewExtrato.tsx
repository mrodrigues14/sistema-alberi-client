"use client";

import React from "react";

interface LinhaExtrato {
    data: string;
    categoria: string;
    fornecedor: string;
    descricao: string;
    nome: string;
    rubricaContabil: string;
    tipo: string;
    valor: string;
}

interface Props {
    dados: LinhaExtrato[];
}

const PreviewExtrato: React.FC<Props> = ({ dados }) => {
    if (!dados.length) return null;

    return (
        <div className="p-6">
            <div className="overflow-auto border rounded shadow">
                <table className="table-auto w-full text-sm border-collapse">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-3 py-2 border">Data</th>
                            <th className="px-3 py-2 border">Rubrica</th>
                            <th className="px-3 py-2 border">Fornecedor</th>
                            <th className="px-3 py-2 border">Nome</th>
                            <th className="px-3 py-2 border">Observação</th>
                            <th className="px-3 py-2 border">Rubrica Contábil</th>
                            <th className="px-3 py-2 border">Entrada</th>
                            <th className="px-3 py-2 border">Saída</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dados.map((linha, i) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                                <td className="border px-2 py-1"><input value={linha.data} className="w-full" readOnly /></td>
                                <td className="border px-2 py-1"><input value={linha.categoria} className="w-full" readOnly /></td>
                                <td className="border px-2 py-1"><input value={linha.fornecedor} className="w-full" readOnly /></td>
                                <td className="border px-2 py-1"><input value={linha.nome} className="w-full" readOnly /></td>
                                <td className="border px-2 py-1"><input value={linha.descricao} className="w-full" readOnly /></td>
                                <td className="border px-2 py-1"><input value={linha.rubricaContabil} className="w-full" readOnly /></td>
                                <td className="border px-2 py-1">{linha.tipo === "entrada" ? linha.valor : ""}</td>
                                <td className="border px-2 py-1">{linha.tipo === "saida" ? linha.valor : ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PreviewExtrato;
