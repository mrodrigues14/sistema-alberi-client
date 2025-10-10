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
  descricao?: string | null;
  observacao?: string | null;
  ordem?: number | null;
  extratoAnexo?: string | null;
  idSubextrato?: number | null;
  rubricaDoMes?: boolean | null;
  lancamentoFuturo?: boolean | null;
  juros?: number | null;
  mesReferencia?: string | null;
  tipo?: string | null; 
}
