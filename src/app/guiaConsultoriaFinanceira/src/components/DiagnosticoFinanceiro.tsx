
import React, { useState } from 'react'
import {Calculator, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, DollarSign, PieChart} from 'lucide-react'

const DiagnosticoFinanceiro = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [patrimonio, setPatrimonio] = useState({
    bens: 0,
    dividas: 0,
    investimentos: 0,
    reserva: 0
  })
  const [renda, setRenda] = useState({
    salario: 0,
    extras: 0,
    investimentos: 0
  })
  const [gastos, setGastos] = useState({
    fixos: 0,
    variaveis: 0,
    lazer: 0
  })

  const tabs = [
    { title: "Patrimônio Líquido", icon: Calculator },
    { title: "Fluxo de Caixa", icon: TrendingUp },
    { title: "Análise de Saúde", icon: PieChart },
    { title: "Plano de Ação", icon: CheckCircle }
  ]

  const patrimonioLiquido = patrimonio.bens + patrimonio.investimentos + patrimonio.reserva - patrimonio.dividas
  const rendaTotal = renda.salario + renda.extras + renda.investimentos
  const gastosTotal = gastos.fixos + gastos.variaveis + gastos.lazer
  const saldo = rendaTotal - gastosTotal

  const getSaudeFinanceira = () => {
    const score = Math.min(100, Math.max(0, 
      (saldo > 0 ? 30 : 0) + 
      (patrimonio.reserva >= gastosTotal * 6 ? 25 : (patrimonio.reserva / (gastosTotal * 6)) * 25) +
      (patrimonio.dividas / Math.max(1, patrimonio.bens) < 0.3 ? 25 : 25 * (1 - patrimonio.dividas / Math.max(1, patrimonio.bens))) +
      (patrimonio.investimentos > 0 ? 20 : 0)
    ))
    
    if (score >= 80) return { nivel: "Excelente", cor: "text-green-600", bg: "bg-green-100" }
    if (score >= 60) return { nivel: "Boa", cor: "text-blue-600", bg: "bg-blue-100" }
    if (score >= 40) return { nivel: "Regular", cor: "text-yellow-600", bg: "bg-yellow-100" }
    return { nivel: "Crítica", cor: "text-red-600", bg: "bg-red-100" }
  }

  const saude = getSaudeFinanceira()

  const renderTab = () => {
    switch(activeTab) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Cálculo do Patrimônio Líquido</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Ativos (Bens e Direitos)
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bens (Imóveis, Veículos, etc.)</label>
                    <input
                      type="number"
                      value={patrimonio.bens}
                      onChange={(e) => setPatrimonio({...patrimonio, bens: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Investimentos</label>
                    <input
                      type="number"
                      value={patrimonio.investimentos}
                      onChange={(e) => setPatrimonio({...patrimonio, investimentos: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Reserva de Emergência</label>
                    <input
                      type="number"
                      value={patrimonio.reserva}
                      onChange={(e) => setPatrimonio({...patrimonio, reserva: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="R$ 0,00"
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <span className="font-semibold">Total de Ativos: </span>
                  <span className="text-green-600 font-bold">
                    R$ {(patrimonio.bens + patrimonio.investimentos + patrimonio.reserva).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
                <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  Passivos (Dívidas)
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Total de Dívidas</label>
                    <input
                      type="number"
                      value={patrimonio.dividas}
                      onChange={(e) => setPatrimonio({...patrimonio, dividas: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Inclua:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Financiamentos</li>
                      <li>Cartão de crédito</li>
                      <li>Empréstimos</li>
                      <li>Cheque especial</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                  <span className="font-semibold">Total de Passivos: </span>
                  <span className="text-red-600 font-bold">
                    R$ {patrimonio.dividas.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <h4 className="text-xl font-semibold text-blue-800 mb-4 text-center">
                Seu Patrimônio Líquido
              </h4>
              
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  <span className={patrimonioLiquido >= 0 ? 'text-green-600' : 'text-red-600'}>
                    R$ {patrimonioLiquido.toLocaleString('pt-BR')}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {patrimonioLiquido >= 0 
                    ? 'Parabéns! Seu patrimônio é positivo.' 
                    : 'Atenção: Suas dívidas superam seus bens.'}
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Ativos:</span>
                    <div className="font-semibold text-green-600">
                      R$ {(patrimonio.bens + patrimonio.investimentos + patrimonio.reserva).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Passivos:</span>
                    <div className="font-semibold text-red-600">
                      R$ {patrimonio.dividas.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Líquido:</span>
                    <div className={`font-semibold ${patrimonioLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {patrimonioLiquido.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Análise do Fluxo de Caixa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                <h4 className="text-lg font-semibold text-green-800 mb-4">Receitas Mensais</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Salário Líquido</label>
                    <input
                      type="number"
                      value={renda.salario}
                      onChange={(e) => setRenda({...renda, salario: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Renda Extra</label>
                    <input
                      type="number"
                      value={renda.extras}
                      onChange={(e) => setRenda({...renda, extras: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Rendimentos de Investimentos</label>
                    <input
                      type="number"
                      value={renda.investimentos}
                      onChange={(e) => setRenda({...renda, investimentos: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="R$ 0,00"
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <span className="font-semibold">Total de Receitas: </span>
                  <span className="text-green-600 font-bold">
                    R$ {rendaTotal.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
                <h4 className="text-lg font-semibold text-red-800 mb-4">Despesas Mensais</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Gastos Fixos</label>
                    <input
                      type="number"
                      value={gastos.fixos}
                      onChange={(e) => setGastos({...gastos, fixos: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Gastos Variáveis</label>
                    <input
                      type="number"
                      value={gastos.variaveis}
                      onChange={(e) => setGastos({...gastos, variaveis: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Lazer e Supérfluos</label>
                    <input
                      type="number"
                      value={gastos.lazer}
                      onChange={(e) => setGastos({...gastos, lazer: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="R$ 0,00"
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                  <span className="font-semibold">Total de Despesas: </span>
                  <span className="text-red-600 font-bold">
                    R$ {gastosTotal.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <h4 className="text-xl font-semibold text-blue-800 mb-4 text-center">
                Resultado Mensal
              </h4>
              
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  <span className={saldo >= 0 ? 'text-green-600' : 'text-red-600'}>
                    R$ {saldo.toLocaleString('pt-BR')}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {saldo >= 0 
                    ? 'Excelente! Você tem sobra para investir.' 
                    : 'Atenção: Seus gastos superam sua renda.'}
                </p>
                
                {rendaTotal > 0 && (
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">% Poupado:</span>
                      <div className={`font-semibold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {((saldo / rendaTotal) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">% Gasto:</span>
                      <div className="font-semibold text-orange-600">
                        {((gastosTotal / rendaTotal) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Meta Ideal:</span>
                      <div className="font-semibold text-blue-600">20%</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Análise de Saúde Financeira</h3>
            
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <div className="text-center mb-6">
                <h4 className="text-xl font-semibold mb-4">Sua Saúde Financeira</h4>
                <div className={`text-3xl font-bold ${saude.cor} mb-2`}>
                  {saude.nivel}
                </div>
                <div className={`inline-block px-4 py-2 rounded-full ${saude.bg} ${saude.cor}`}>
                  Score: {Math.round((saldo > 0 ? 30 : 0) + 
                    (patrimonio.reserva >= gastosTotal * 6 ? 25 : (patrimonio.reserva / (gastosTotal * 6)) * 25) +
                    (patrimonio.dividas / Math.max(1, patrimonio.bens) < 0.3 ? 25 : 25 * (1 - patrimonio.dividas / Math.max(1, patrimonio.bens))) +
                    (patrimonio.investimentos > 0 ? 20 : 0))}/100
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-semibold text-gray-800">Indicadores Positivos</h5>
                  
                  {saldo >= 0 && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm">Sobra mensal positiva</span>
                    </div>
                  )}
                  
                  {patrimonio.reserva >= gastosTotal * 6 && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm">Reserva de emergência adequada</span>
                    </div>
                  )}
                  
                  {patrimonio.investimentos > 0 && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm">Possui investimentos</span>
                    </div>
                  )}
                  
                  {patrimonio.dividas / Math.max(1, patrimonio.bens) < 0.3 && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm">Baixo endividamento</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h5 className="font-semibold text-gray-800">Pontos de Atenção</h5>
                  
                  {saldo < 0 && (
                    <div className="flex items-center p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                      <span className="text-sm">Gastos excedem a renda</span>
                    </div>
                  )}
                  
                  {patrimonio.reserva < gastosTotal * 6 && (
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                      <span className="text-sm">Reserva de emergência insuficiente</span>
                    </div>
                  )}
                  
                  {patrimonio.investimentos === 0 && (
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                      <span className="text-sm">Não possui investimentos</span>
                    </div>
                  )}
                  
                  {patrimonio.dividas / Math.max(1, patrimonio.bens) >= 0.3 && (
                    <div className="flex items-center p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                      <span className="text-sm">Alto nível de endividamento</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <h5 className="font-semibold text-blue-800 mb-2">Reserva de Emergência</h5>
                <div className="text-2xl font-bold text-blue-600">
                  {gastosTotal > 0 ? (patrimonio.reserva / gastosTotal).toFixed(1) : 0} meses
                </div>
                <p className="text-sm text-gray-600">Meta: 6-12 meses</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl">
                <h5 className="font-semibold text-green-800 mb-2">Taxa de Poupança</h5>
                <div className="text-2xl font-bold text-green-600">
                  {rendaTotal > 0 ? ((saldo / rendaTotal) * 100).toFixed(1) : 0}%
                </div>
                <p className="text-sm text-gray-600">Meta: 20%</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl">
                <h5 className="font-semibold text-purple-800 mb-2">Endividamento</h5>
                <div className="text-2xl font-bold text-purple-600">
                  {patrimonio.bens > 0 ? ((patrimonio.dividas / patrimonio.bens) * 100).toFixed(1) : 0}%
                </div>
                <p className="text-sm text-gray-600">Meta: &lt;30%</p>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Plano de Ação Personalizado</h3>
            
            <div className="space-y-6">
              {saldo < 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                  <h4 className="text-lg font-semibold text-red-800 mb-3">🚨 PRIORIDADE MÁXIMA</h4>
                  <h5 className="font-semibold mb-2">Equilibrar o Orçamento</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Revisar todos os gastos e cortar supérfluos</li>
                    <li>Renegociar dívidas e contratos</li>
                    <li>Buscar renda extra imediatamente</li>
                    <li>Estabelecer um orçamento rigoroso</li>
                  </ul>
                </div>
              )}

              {patrimonio.reserva < gastosTotal * 3 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ ALTA PRIORIDADE</h4>
                  <h5 className="font-semibold mb-2">Construir Reserva de Emergência</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Meta inicial: R$ {(gastosTotal * 3).toLocaleString('pt-BR')} (3 meses de gastos)</li>
                    <li>Meta ideal: R$ {(gastosTotal * 6).toLocaleString('pt-BR')} (6 meses de gastos)</li>
                    <li>Guardar {saldo > 0 ? `R$ ${Math.min(saldo, gastosTotal * 0.5).toLocaleString('pt-BR')}` : 'parte da sobra'} mensalmente</li>
                    <li>Manter em investimentos líquidos (poupança, CDB)</li>
                  </ul>
                </div>
              )}

              {patrimonio.dividas > patrimonio.bens * 0.3 && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                  <h4 className="text-lg font-semibold text-orange-800 mb-3">🎯 FOCO NECESSÁRIO</h4>
                  <h5 className="font-semibold mb-2">Reduzir Endividamento</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Listar todas as dívidas por taxa de juros</li>
                    <li>Priorizar quitação das mais caras (cartão, cheque especial)</li>
                    <li>Negociar desconto à vista quando possível</li>
                    <li>Evitar novas dívidas desnecessárias</li>
                  </ul>
                </div>
              )}

              {patrimonio.investimentos === 0 && saldo > 0 && (
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">📈 OPORTUNIDADE</h4>
                  <h5 className="font-semibold mb-2">Começar a Investir</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Começar com R$ {Math.min(saldo * 0.3, 500).toLocaleString('pt-BR')} mensais</li>
                    <li>Perfil conservador: Tesouro Direto, CDB</li>
                    <li>Estudar sobre investimentos gradualmente</li>
                    <li>Diversificar conforme conhecimento aumenta</li>
                  </ul>
                </div>
              )}

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">📋 PRÓXIMOS PASSOS</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold mb-2">Próximos 30 dias:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Implementar controle de gastos</li>
                      <li>Abrir conta em banco digital</li>
                      <li>Pesquisar sobre investimentos</li>
                      <li>Definir metas específicas</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Próximos 90 dias:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Atingir primeiro mês de reserva</li>
                      <li>Fazer primeiro investimento</li>
                      <li>Revisar e ajustar orçamento</li>
                      <li>Buscar educação financeira</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">💡 Lembre-se:</h4>
              <p>
                O diagnóstico financeiro é o primeiro passo para a independência financeira. 
                Revise estes números mensalmente e ajuste seu plano conforme necessário.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Diagnóstico Financeiro
        </h2>
        <p className="text-lg text-gray-600">
          Conheça sua situação financeira atual e identifique oportunidades de melhoria
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center mb-8 bg-gray-100 p-2 rounded-xl">
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          return (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex items-center px-4 py-3 rounded-lg m-1 transition-all ${
                activeTab === index
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.title}
            </button>
          )
        })}
      </div>

      {/* Conteúdo da aba ativa */}
      <div className="bg-white rounded-xl p-6">
        {renderTab()}
      </div>
    </div>
  )
}

export default DiagnosticoFinanceiro
