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
    observacao?: string | null;
    ordem?: number | null;
    extratoAnexo?: string | null;
    idSubextrato?: number | null;
    rubricaDoMes?: boolean | null;
  }
  