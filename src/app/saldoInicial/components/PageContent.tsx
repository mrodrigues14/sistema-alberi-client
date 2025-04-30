'use client';

import { useSearchParams } from 'next/navigation';
import CriarSaldoInicial from './CriarSaldoInicial';

const nomeMesParaNumero = (mesNome: string | null): number | null => {
  if (!mesNome) return null;

  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];

  const index = meses.findIndex(
    (m) => m.toLowerCase() === mesNome.toLowerCase()
  );

  return index >= 0 ? index + 1 : null;
};

export default function PageContent() {
  const searchParams = useSearchParams();
  const idBanco = Number(searchParams.get('idBanco'));
  const idCliente = Number(searchParams.get('idCliente'));
  const mesNome = searchParams.get('mes');
  const ano = Number(searchParams.get('ano'));

  const mes = nomeMesParaNumero(mesNome);

  if (!idBanco || !idCliente) {
    return (
      <div className="p-4 text-red-600">
        ⚠️ Erro: parâmetros obrigatórios ausentes na URL (idBanco, idCliente).
      </div>
    );
  }

  return (
    <div className="p-6">
      <CriarSaldoInicial
        idBanco={idBanco}
        idCliente={idCliente}
        mesSelecionado={mes}
        anoSelecionado={ano}
      />
    </div>
  );
}
