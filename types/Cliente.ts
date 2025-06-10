export interface Cliente {
    idcliente: number;
    cnpj?: string;
    cpf?: string;
    telefone?: string;
    nome: string;
    endereco?: string;
    cep?: string;
    nomeResponsavel?: string;
    cpfResponsavel?: string;
    inscricaoEstadual?: string;
    cnaePrincipal?: string;
    apelido?: string;
    email?: string;
    ativo?: number;
  }