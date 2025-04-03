export interface Label {
    label: string;
    color: string;
  }
  
  export interface Tarefa {
    idtarefa?: number;
    titulo?: string | null;
    dataLimite?: string | null;
    idCliente?: number | null;
    status: string;
    idUsuario?: number | null;
    dataInicio: string;
    dataConclusao?: string | null;
    recorrencia?: string | null;
    descricao?: string | null;
    descricoes?: string | null;
    prioridade?: string | null;
    labels?: Label[] | null;
  }
  