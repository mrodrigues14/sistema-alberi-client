export interface Categoria {
    idcategoria: number;
    nome: string;
  }
  
  export interface Fornecedor {
    idfornecedor: number;
    nome: string;
  }
  
  export interface Subextrato {
    idSubextrato: number;
    data: string;
    categoria: Categoria | null;
    nomeNoExtrato: string | null;
    valor: string;
    tipoDeTransacao: string;
    fornecedor: Fornecedor | null;
    ordem: number | null;
    idExtratoPrincipal: number;
    observacao: string | null;
    rubricaContabil: string | null;
  }
  