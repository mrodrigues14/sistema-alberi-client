export interface BufferArquivo {
  type: "Buffer";
  data: number[];
}

export interface Chamado {
  id: number;
  titulo: string | null;
  descricao: string | null;
  data: string | null;
  arquivo?: BufferArquivo | null;
  idUsuario: number | null;
  prioridade: string | null;
  situacao: string | null;
  tipo: string | null;
  funcionalidadeAfetada: string | null;
  descricaoRecusa: string | null;
  temArquivo: boolean | null;
}
