export interface Extrato {
    idextrato: number;
    idCliente: number;
    data: string;
    nomeNoExtrato: string | null;
    valor: number;
    tipoDeTransacao: "ENTRADA" | "SAIDA";
    idFornecedor?: number | null;
    idCategoria?: number | null;
    rubricaContabil?: string | null;
  // Backend column name is DESCRICAO; keep both for compatibility with UI
  descricao?: string | null;
  observacao?: string | null;
    ordem?: number | null;
    extratoAnexo?: string | null;
    idSubextrato?: number | null;
    rubricaDoMes?: boolean | null;
    lancamentoFuturo?: boolean | null;
  }
  