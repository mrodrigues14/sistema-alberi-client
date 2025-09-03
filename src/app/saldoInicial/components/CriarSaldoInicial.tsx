'use client';

import { upsertSaldoInicial, useSaldoInicial } from '@/lib/hooks/useSaldoInicial';
import { useEffect, useState, useMemo } from 'react';

interface Props {
  idBanco: number;
  idCliente: number;
  onClose?: () => void;
  onSuccess?: () => void;
  mesSelecionado?: number | null;
  anoSelecionado?: number | null;
}
export default function CriarSaldoInicial({
  idBanco,
  idCliente,
  onClose,
  onSuccess,
  mesSelecionado,
  anoSelecionado,
}: Props) {
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [valorFormatado, setValorFormatado] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState(String(new Date().getFullYear()));
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const meses = useMemo(() => [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ], []);

   useEffect(() => {
    if (mesSelecionado && mesSelecionado >= 1 && mesSelecionado <= 12) {
      setMes(meses[mesSelecionado - 1]);
    }

    if (anoSelecionado) {
      setAno(String(anoSelecionado));
    }
  }, [mesSelecionado, anoSelecionado, meses]);

  const { saldoInicial, isLoading: loadingSaldo } = useSaldoInicial(
    idCliente,
    idBanco,
    mes,
    ano
  );
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    
    // Permite apenas números, vírgula, ponto e sinal negativo no início
    const cleaned = raw.replace(/[^\d,.-]/g, '');
    
    // Se tem sinal negativo, só permite no início
    const isNegative = cleaned.startsWith('-');
    const withoutSign = isNegative ? cleaned.substring(1) : cleaned;
    
    // Remove pontos extras (separadores de milhares) mas mantém vírgula decimal
    const withoutThousands = withoutSign.replace(/\./g, '');
    
    // Reconstrói o valor
    const finalValue = isNegative ? '-' + withoutThousands : withoutThousands;
    
    setValorFormatado(finalValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mes || !ano || !valorFormatado) {
      setErro('Preencha todos os campos!');
      return;
    }

    const mesNumerico = {
      Janeiro: '01', Fevereiro: '02', Março: '03', Abril: '04',
      Maio: '05', Junho: '06', Julho: '07', Agosto: '08',
      Setembro: '09', Outubro: '10', Novembro: '11', Dezembro: '12',
    }[mes] || '01';

    const mesAno = `${ano}-${mesNumerico}`;
    // Converte o valor formatado para número, tratando vírgula como decimal
    const valorNumerico = parseFloat(valorFormatado.replace(',', '.'));

    try {
      setLoading(true);
      await upsertSaldoInicial({
        idCliente,
        idBanco,
        mesAno,
        saldo: valorNumerico,
        definidoManualmente: true,
      });
      
      setMensagemSucesso(`Saldo atualizado com sucesso: R$ ${valorNumerico.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`);

      if (onSuccess) onSuccess();
      if (onClose) onClose();
      window.parent.postMessage({ type: 'SALDO_CRIADO' }, '*');
    } catch (err) {
      console.error(err);
      setErro('Erro ao criar saldo inicial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white shadow-md rounded-md max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Novo Saldo Inicial</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
        <select
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        >
          <option value="">Selecione o mês</option>
          {[
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
          ].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
        <input
          type="number"
          placeholder="Ex: 2025"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
        />
      </div>

      {!loadingSaldo && saldoInicial !== 0 && (
  <div className={`font-semibold border rounded p-2 mb-2 ${
    saldoInicial >= 0 
      ? "text-green-700 bg-green-50 border-green-300" 
      : "text-red-700 bg-red-50 border-red-300"
  }`}>
    Saldo já definido: R$ {saldoInicial.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
  </div>
)}

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {saldoInicial !== 0 ? "Novo Saldo" : "Valor do Saldo"}
  </label>
  <input
    type="text"
    inputMode="numeric"
    placeholder="0,00 (use - para valores negativos)"
    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={valorFormatado}
    onChange={handleValorChange}
  />
</div>


      {erro && (
        <p className="text-red-600 text-sm">{erro}</p>
      )}

{mensagemSucesso && (
  <div className="text-green-600 font-semibold bg-green-50 border border-green-300 rounded p-2">
    {mensagemSucesso}
  </div>
)}

      <div className="flex justify-end gap-3 pt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
