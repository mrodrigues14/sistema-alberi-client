import { Categoria, useCategoriasPorCliente } from "@/lib/hooks/useCategoria";
import { useFornecedoresPorCliente } from "@/lib/hooks/useFornecedor";
import { createExtratosLote } from "@/lib/hooks/useExtrato";
import { LinhaExtrato } from "../../../../../types/LinhaExtrato";
import { useEffect, useMemo, useState } from "react";
import CustomDropdown from "../dropdown/CustomDropdown";

interface Props {
  dados: LinhaExtrato[];
  idCliente: number;
  idBanco: number;
  onImportarFinalizado?: () => void;
}

const PreviewExtrato: React.FC<Props> = ({ dados, idCliente, idBanco, onImportarFinalizado }) => {
  const [linhas, setLinhas] = useState<LinhaExtrato[]>(dados);
  const { categoriasCliente } = useCategoriasPorCliente(idCliente);
  const { fornecedores } = useFornecedoresPorCliente(idCliente);
  const [loadingImport, setLoadingImport] = useState(false);

  const categoriasFormatadas = useMemo(() => {
    if (!categoriasCliente) return [];

    const pais = categoriasCliente.filter((c: Categoria) => !c.idCategoriaPai);
    const filhas = categoriasCliente.filter((c: Categoria) => c.idCategoriaPai);

    return pais.flatMap((pai: Categoria) => {
      const filhosDoPai = filhas.filter((f: Categoria) => f.idCategoriaPai === pai.idcategoria);

      return [
        {
          label: pai.nome,
          value: pai.idcategoria,
          disabled: filhosDoPai.length > 0,
        },
        ...filhosDoPai.map((f: Categoria) => ({
          label: `   └ ${f.nome}`,
          value: f.idcategoria,
        })),
      ];
    });
  }, [categoriasCliente]);

  const fornecedoresFormatados = useMemo(() => {
    return fornecedores?.map((f) => ({ label: f.nome, value: f.idfornecedor })) || [];
  }, [fornecedores]);

  const handleChange = (index: number, field: keyof LinhaExtrato, value: string | number) => {
    setLinhas((prev) => {
      const atualizadas = [...prev];
      atualizadas[index] = { ...atualizadas[index], [field]: value };
      return atualizadas;
    });
  };

  const handleImportar = async () => {
    const categoriasInvalidas = linhas.some(
      (linha) => !categoriasFormatadas.some((opt: { label: string }) => opt.label === linha.categoria)
    );

    const fornecedoresInvalidos = linhas.some(
      (linha) => linha.fornecedor && !fornecedoresFormatados.some((opt) => opt.label === linha.fornecedor)
    );

    if (categoriasInvalidas || fornecedoresInvalidos) {
      alert("Existem categorias ou fornecedores inválidos! Corrija os campos destacados em vermelho antes de importar.");
      return;
    }

    try {
      setLoadingImport(true);

      const extratos = linhas.map((linha) => ({
        idCliente,
        idBanco,
        idCategoria: Number(linha.categoria),
        idFornecedor: linha.fornecedor ? Number(linha.fornecedor) : null,
        data: linha.data.split("/").reverse().join("-"),
        nomeNoExtrato: linha.nome,
        descricao: linha.descricao,
        rubricaContabil: linha.rubricaContabil || null,
        valor: Number(linha.valor.replace(/\D/g, "")) / 100,
        tipoDeTransacao: linha.tipo.toUpperCase() === "ENTRADA" ? "ENTRADA" as "ENTRADA" : "SAIDA" as "SAIDA",
      }));

      await createExtratosLote(extratos);

      alert("Extratos importados com sucesso!");
      onImportarFinalizado?.();
    } catch (error) {
      console.error("Erro ao importar extratos:", error);
      alert("Erro ao importar extratos.");
    } finally {
      setLoadingImport(false);
    }
  };

    return (
        <div className="relative p-6">
                  {loadingImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl font-bold animate-pulse">Importando...</div>
        </div>
      )}

            <div className="overflow-auto border rounded shadow max-h-[65vh]">
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
                        {linhas.map((linha, i) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                                <td className="border px-2 py-1">
                                    <input value={linha.data} onChange={(e) => handleChange(i, "data", e.target.value)} className="w-full" />
                                </td>
                                <td className="border px-2 py-1">
                                    <div className={`
    ${!categoriasFormatadas.some((opt: { label: string; }) => opt.label === linha.categoria)
                                            ? "text-red-600 font-semibold border border-red-500 rounded"
                                            : ""}
  `}>
                                        <CustomDropdown
                                            label={
                                                !categoriasFormatadas.some((opt: { label: string; }) => opt.label === linha.categoria)
                                                    ? `❗${linha.categoria || "Categoria desconhecida"}`
                                                    : "Selecione a rubrica"
                                            }
                                            options={
                                                categoriasFormatadas.some((opt: { label: string; }) => opt.label === linha.categoria)
                                                    ? categoriasFormatadas
                                                    : [
                                                        {
                                                            label: `❗${linha.categoria || "Categoria desconhecida"}`,
                                                            value: linha.categoria,
                                                            disabled: true,
                                                        },
                                                        ...categoriasFormatadas,
                                                    ]
                                            }
                                            selectedValue={linha.categoria}
                                            onSelect={(val) => handleChange(i, "categoria", val as string)}
                                            type="rubrica"
                                        />
                                    </div>
                                </td>


                                <td className="border px-2 py-1">
                                    <div className={`
    ${!fornecedoresFormatados.some(opt => opt.label === linha.fornecedor)
                                            ? "text-red-600 font-semibold border border-red-500 rounded"
                                            : ""}
  `}>
                                        <CustomDropdown
                                            label={
                                                !fornecedoresFormatados.some(opt => opt.label === linha.fornecedor)
                                                    ? `❗${linha.fornecedor || "Fornecedor desconhecido"}`
                                                    : "Selecione o fornecedor"
                                            }
                                            options={
                                                fornecedoresFormatados.some(opt => opt.label === linha.fornecedor)
                                                    ? fornecedoresFormatados
                                                    : [
                                                        {
                                                            label: `❗${linha.fornecedor || "Fornecedor desconhecido"}`,
                                                            value: linha.fornecedor,
                                                            disabled: true,
                                                        },
                                                        ...fornecedoresFormatados,
                                                    ]
                                            }
                                            selectedValue={linha.fornecedor}
                                            onSelect={(val) => handleChange(i, "fornecedor", val)}
                                            type="fornecedor"
                                        />
                                    </div>
                                </td>

                                <td className="border px-2 py-1">
                                    <input value={linha.nome} onChange={(e) => handleChange(i, "nome", e.target.value)} className="w-full" />
                                </td>
                                <td className="border px-2 py-1">
                                    <input value={linha.descricao} onChange={(e) => handleChange(i, "descricao", e.target.value)} className="w-full" />
                                </td>
                                <td className="border px-2 py-1">
                                    <input value={linha.rubricaContabil} onChange={(e) => handleChange(i, "rubricaContabil", e.target.value)} className="w-full" />
                                </td>
                                <td className="border px-2 py-1">
                                    <input
                                        value={linha.tipo === "entrada" ? linha.valor : ""}
                                        onChange={(e) => {
                                            handleChange(i, "valor", e.target.value);
                                            handleChange(i, "tipo", "entrada");
                                        }}
                                        className="w-full"
                                    />
                                </td>
                                <td className="border px-2 py-1">
                                    <input
                                        value={linha.tipo === "saida" ? linha.valor : ""}
                                        onChange={(e) => {
                                            handleChange(i, "valor", e.target.value);
                                            handleChange(i, "tipo", "saida");
                                        }}
                                        className="w-full"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-right">
                <button
                    onClick={handleImportar}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Importar Extratos
                </button>
            </div>
        </div>
    );
};

export default PreviewExtrato;
