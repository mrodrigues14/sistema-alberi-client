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

  const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const handleImportar = async () => {
    const camposObrigatoriosInvalidos = linhas.some((linha) => {
      const rubricaValida = categoriasFormatadas.some(
        (opt: { label: string; }) => normalize(opt.label) === normalize(String(linha.categoria))
      );
      const fornecedorValido = fornecedoresFormatados.some(
        (opt) => normalize(opt.label) === normalize(String(linha.fornecedor))
      );
      const rubricaContabilValida = linha.rubricaContabil?.trim().length > 0;

      return (
        !linha.data ||
        !linha.categoria ||
        !linha.fornecedor ||
        !linha.rubricaContabil ||
        !rubricaValida ||
        !fornecedorValido ||
        !rubricaContabilValida
      );
    });

    if (camposObrigatoriosInvalidos) {
      const confirmar = confirm("Alguns campos obrigatórios estão vazios ou inválidos. Deseja importar mesmo assim?");
      if (!confirmar) return;
    }

    try {
      setLoadingImport(true);

      const extratos = linhas.map((linha) => {
        const rubricaValida = categoriasFormatadas.find((opt: { label: string; }) => normalize(opt.label) === normalize(String(linha.categoria)));
        const fornecedorValido = fornecedoresFormatados.find(opt => normalize(opt.label) === normalize(String(linha.fornecedor)));
        const rubricaContabilValida = linha.rubricaContabil?.trim() || null;
      
        return {
          idCliente,
          idBanco,
          idCategoria: rubricaValida ? rubricaValida.value : null,
          idFornecedor: fornecedorValido ? fornecedorValido.value : null,
          data: linha.data?.includes("/") ? linha.data.split("/").reverse().join("-") : "",
          nomeNoExtrato: linha.nome || null,
          descricao: linha.descricao || null,
          rubricaContabil: rubricaContabilValida,
          valor: linha.valor ? Number(linha.valor.replace(/\D/g, "")) / 100 : 0,
          tipoDeTransacao: linha.tipo?.toUpperCase() === "ENTRADA" ? "ENTRADA" as const : "SAIDA" as const,
        };
      });
      

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
            {linhas.map((linha, i) => {
              const rubricaInvalida = !categoriasFormatadas.some((opt: { label: string; }) => normalize(opt.label) === normalize(String(linha.categoria)));
              const fornecedorInvalido = !fornecedoresFormatados.some(opt => normalize(opt.label) === normalize(String(linha.fornecedor)));
              const rubricaContabilInvalida = !linha.rubricaContabil?.trim();

              return (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  {/* DATA */}
                  <td className={`border px-2 py-1 ${!linha.data ? "text-red-600 border-red-500 font-semibold" : ""}`}>
                    <input
                      value={linha.data}
                      onChange={(e) => handleChange(i, "data", e.target.value)}
                      className="w-full"
                    />
                  </td>

                  {/* RUBRICA */}
                  <td className={`border px-2 py-1 ${rubricaInvalida ? "text-red-600 border-red-500 font-semibold" : ""}`}>
                    <CustomDropdown
                      label={
                        rubricaInvalida
                          ? `❗${linha.categoria}`
                          : "Selecione a rubrica"
                      }
                      options={
                        rubricaInvalida
                          ? [{ label: `❗${linha.categoria}`, value: linha.categoria, disabled: true }, ...categoriasFormatadas]
                          : categoriasFormatadas
                      }
                      selectedValue={
                        categoriasFormatadas.find((opt: { label: string; }) => normalize(opt.label) === normalize(String(linha.categoria))) ||
                        { label: String(linha.categoria), value: linha.categoria }
                      }
                      onSelect={(val) => handleChange(i, "categoria", val.label)}
                      type="rubrica"
                    />
                  </td>

                  {/* FORNECEDOR */}
                  <td className={`border px-2 py-1 ${fornecedorInvalido ? "text-red-600 border-red-500 font-semibold" : ""}`}>
                    <CustomDropdown
                      label={
                        fornecedorInvalido
                          ? `❗${linha.fornecedor || "Fornecedor inválido"}`
                          : "Selecione o fornecedor"
                      }
                      options={
                        fornecedorInvalido
                          ? [{ label: `❗${linha.fornecedor || "Fornecedor inválido"}`, value: linha.fornecedor, disabled: true }, ...fornecedoresFormatados]
                          : fornecedoresFormatados
                      }
                      selectedValue={
                        fornecedoresFormatados.find(opt => normalize(opt.label) === normalize(String(linha.fornecedor))) ||
                        { label: String(linha.fornecedor), value: linha.fornecedor }
                      }
                      onSelect={(val) => handleChange(i, "fornecedor", val.label)}
                      type="fornecedor"
                    />
                  </td>

                  {/* NOME */}
                  <td className="border px-2 py-1">
                    <input
                      value={linha.nome}
                      onChange={(e) => handleChange(i, "nome", e.target.value)}
                      className="w-full"
                    />
                  </td>

                  {/* DESCRICAO */}
                  <td className="border px-2 py-1">
                    <input
                      value={linha.descricao}
                      onChange={(e) => handleChange(i, "descricao", e.target.value)}
                      className="w-full"
                    />
                  </td>

                  {/* RUBRICA CONTÁBIL */}
                  <td className={`border px-2 py-1 ${rubricaContabilInvalida ? "text-red-600 border-red-500 font-semibold" : ""}`}>
                    <input
                      value={linha.rubricaContabil}
                      onChange={(e) => handleChange(i, "rubricaContabil", e.target.value)}
                      className="w-full"
                    />
                  </td>

                  {/* ENTRADA */}
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

                  {/* SAÍDA */}
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
              );
            })}
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
