'use client';

import { useSearchParams } from 'next/navigation';
import CriarSaldoInicial from './components/CriarSaldoInicial';

export default function Page() {
  const searchParams = useSearchParams();

  const idBanco = Number(searchParams.get('idBanco'));
  const idCliente = Number(searchParams.get('idCliente'));

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
      />
    </div>
  );
}
