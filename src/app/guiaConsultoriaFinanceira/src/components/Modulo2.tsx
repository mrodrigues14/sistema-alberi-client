
import React, { useState } from 'react'
import {Calculator, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, CreditCard, Banknote, PieChart} from 'lucide-react'

const Modulo2 = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [extratoData, setExtratoData] = useState({
    saldoInicial: 50000,
    entradas: [
      { data: '01/12', descricao: 'PIX Recebido - Cliente A', valor: 15000, categoria: 'Vendas' },
      { data: '03/12', descricao: 'TED Recebida - Cliente B', valor: 8500, categoria: 'Vendas' },
      { data: '05/12', descricao: 'Cartão de Crédito', valor: 12000, categoria: 'Vendas' },
      { data: '08/12', descricao: 'PIX Recebido - Cliente C', valor: 6800, categoria: 'Vendas' },
      { data: '10/12', descricao: 'Empréstimo Bancário', valor: 25000, categoria: 'Financiamento' }
    ],
    saidas: [
      { data: '02/12', descricao: 'Fornecedor XYZ Ltda', valor: 18000, categoria: 'Fornecedores' },
      { data: '05/12', descricao: 'Folha Pagamento', valor: 22000, categoria: 'Pessoal' },
      { data: '07/12', descricao: 'Aluguel Loja', valor: 4500, categoria: 'Fixos' },
      { data: '09/12', descricao: 'Energia Elétrica', valor: 1200, categoria: 'Fixos' },
      { data: '12/12', descricao: 'Juros Empréstimo', valor: 2800, categoria: 'Financeiro' }
    ]
  })

  const tabs = [
    { title: "Análise do Extrato", icon: Banknote },
    { title: "Categorização", icon: PieChart },
    { title: "Indicadores", icon: Calculator },
    { title: "Relatório", icon: TrendingUp }
  ]

  const calcularResumo = () => {
    const totalEntradas = extratoData.entradas.reduce((sum, item) => sum + item.valor, 0)
    const totalSaidas = extratoData.saidas.reduce((sum, item) => sum + item.valor, 0)
    const saldoFinal = extratoData.saldoInicial + totalEntradas - totalSaidas
    const resultado = totalEntradas - totalSaidas

    return { totalEntradas, totalSaidas, saldoFinal, resultado }
  }

  const categorizarMovimentacoes = () => {
    const categoriasEntrada = {}
    const categoriasSaida = {}

    extratoData.entradas.forEach(item => {
      categoriasEntrada[item.categoria] = (categoriasEntrada[item.categoria] || 0) + item.valor
    })

    extratoData.saidas.forEach(item => {
      categoriasSaida[item.categoria] = (categoriasSaida[item.categoria] || 0) + item.valor
    })

    return { categoriasEntrada, categoriasSaida }
  }

  const resumo = calcularResumo()
  const categorias = categorizarMovimentacoes()

  const renderTab = () => {
    switch(activeTab) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Análise Detalhada do Extrato Bancário</h3>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">💡 METODOLOGIA</h4>
              <p className="text-gray-700">
                O extrato bancário é a fonte mais confiável de informações financeiras. Ele mostra exatamente 
                o que entrou e saiu da conta, sem manipulações contábeis ou estimativas.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Saldo Inicial</h4>
                <div className="text-2xl font-bold text-green-600">
                  R$ {extratoData.saldoInicial.toLocaleString('pt-BR')}
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Total Entradas</h4>
                <div className="text-2xl font-bold text-blue-600">
                  R$ {resumo.totalEntradas.toLocaleString('pt-BR')}
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">Total Saídas</h4>
                <div className="text-2xl font-bold text-red-600">
                  R$ {resumo.totalSaidas.toLocaleString('pt-BR')}
                </div>
              </div>

              <div className={`p-6 rounded-xl border-2 ${
                resumo.saldoFinal >= 0 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <h4 className={`font-semibold mb-2 ${
                  resumo.saldoFinal >= 0 ? 'text-green-800' : 'text-red-800'
                }`}>
                  Saldo Final
                </h4>
                <div className={`text-2xl font-bold ${
                  resumo.saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  R$ {resumo.saldoFinal.toLocaleString('pt-BR')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  ENTRADAS
                </h4>
                
                <div className="space-y-3">
                  {extratoData.entradas.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium">{item.descricao}</div>
                        <div className="text-sm text-gray-600">{item.data} • {item.categoria}</div>
                      </div>
                      <div className="text-green-600 font-bold">
                        +R$ {item.valor.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border-2 border-red-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-red-800 mb-4 flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  SAÍDAS
                </h4>
                
                <div className="space-y-3">
                  {extratoData.saidas.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium">{item.descricao}</div>
                        <div className="text-sm text-gray-600">{item.data} • {item.categoria}</div>
                      </div>
                      <div className="text-red-600 font-bold">
                        -R$ {item.valor.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl border-2 ${
              resumo.resultado >= 0 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h4 className="text-lg font-bold mb-4">📊 Resumo do Período</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    resumo.resultado >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    R$ {resumo.resultado.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-sm text-gray-600">Resultado do Período</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {resumo.totalSaidas > 0 ? ((resumo.totalEntradas / resumo.totalSaidas) * 100).toFixed(1) : 0}%
                  </div>
                  <p className="text-sm text-gray-600">Cobertura das Saídas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {extratoData.saldoInicial > 0 ? ((resumo.resultado / extratoData.saldoInicial) * 100).toFixed(1) : 0}%
                  </div>
                  <p className="text-sm text-gray-600">Variação do Saldo</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Categorização das Movimentações</h3>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-yellow-800 mb-3">🏷️ IMPORTÂNCIA DA CATEGORIZAÇÃO</h4>
              <p className="text-gray-700">
                Categorizar corretamente as movimentações permite identificar padrões, gargalos 
                e oportunidades de otimização no fluxo de caixa da empresa.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-800 mb-4">📈 ENTRADAS POR CATEGORIA</h4>
                
                <div className="space-y-4">
                  {Object.entries(categorias.categoriasEntrada).map(([categoria, valor]) => {
                    const percentual = (valor / resumo.totalEntradas) * 100
                    return (
                      <div key={categoria} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{categoria}</span>
                          <span className="text-green-600 font-bold">
                            R$ {valor.toLocaleString('pt-BR')} ({percentual.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentual}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-2">Análise das Entradas</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Vendas:</strong> {((categorias.categoriasEntrada.Vendas || 0) / resumo.totalEntradas * 100).toFixed(1)}% das entradas</li>
                    <li>• <strong>Dependência:</strong> {categorias.categoriasEntrada.Financiamento ? 'Alta dependência de financiamento' : 'Baixa dependência externa'}</li>
                    <li>• <strong>Diversificação:</strong> {Object.keys(categorias.categoriasEntrada).length} fontes de receita</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border-2 border-red-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-red-800 mb-4">📉 SAÍDAS POR CATEGORIA</h4>
                
                <div className="space-y-4">
                  {Object.entries(categorias.categoriasSaida).map(([categoria, valor]) => {
                    const percentual = (valor / resumo.totalSaidas) * 100
                    return (
                      <div key={categoria} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{categoria}</span>
                          <span className="text-red-600 font-bold">
                            R$ {valor.toLocaleString('pt-BR')} ({percentual.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentual}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 p-4 bg-red-50 rounded-lg">
                  <h5 className="font-semibold text-red-800 mb-2">Análise das Saídas</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Pessoal:</strong> {((categorias.categoriasSaida.Pessoal || 0) / resumo.totalSaidas * 100).toFixed(1)}% dos gastos</li>
                    <li>• <strong>Fornecedores:</strong> {((categorias.categoriasSaida.Fornecedores || 0) / resumo.totalSaidas * 100).toFixed(1)}% dos gastos</li>
                    <li>• <strong>Custos Fixos:</strong> {((categorias.categoriasSaida.Fixos || 0) / resumo.totalSaidas * 100).toFixed(1)}% dos gastos</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">🎯 Padrões Identificados</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {((categorias.categoriasEntrada.Vendas || 0) / resumo.totalEntradas * 100).toFixed(0)}%
                  </div>
                  <p className="text-sm font-medium">Receita Operacional</p>
                  <p className="text-xs text-gray-600">vs. Financiamentos</p>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {(((categorias.categoriasSaida.Pessoal || 0) + (categorias.categoriasSaida.Fixos || 0)) / resumo.totalSaidas * 100).toFixed(0)}%
                  </div>
                  <p className="text-sm font-medium">Custos Fixos</p>
                  <p className="text-xs text-gray-600">Pessoal + Fixos</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {((categorias.categoriasSaida.Fornecedores || 0) / resumo.totalSaidas * 100).toFixed(0)}%
                  </div>
                  <p className="text-sm font-medium">Custos Variáveis</p>
                  <p className="text-xs text-gray-600">Fornecedores</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">💡 INSIGHTS DA CATEGORIZAÇÃO</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">Pontos Positivos:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Boa diversificação de recebimentos</li>
                    <li>• Controle adequado de custos fixos</li>
                    <li>• Margem operacional preservada</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Pontos de Atenção:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Dependência de financiamentos</li>
                    <li>• Custos financeiros elevados</li>
                    <li>• Necessidade de capital de giro</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Indicadores Financeiros do Extrato</h3>
            
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-purple-800 mb-3">📊 INDICADORES PRÁTICOS</h4>
              <p className="text-gray-700">
                Estes indicadores são calculados diretamente do extrato bancário e refletem 
                a realidade financeira da empresa sem distorções contábeis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                <h4 className="font-semibold text-green-800 mb-4">Liquidez Imediata</h4>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {(resumo.saldoFinal / (resumo.totalSaidas / 30)).toFixed(1)}
                </div>
                <p className="text-sm text-gray-600 mb-3">dias de cobertura</p>
                <div className={`text-xs px-2 py-1 rounded ${
                  (resumo.saldoFinal / (resumo.totalSaidas / 30)) >= 30 ? 'bg-green-100 text-green-800' :
                  (resumo.saldoFinal / (resumo.totalSaidas / 30)) >= 15 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {(resumo.saldoFinal / (resumo.totalSaidas / 30)) >= 30 ? 'Excelente' :
                   (resumo.saldoFinal / (resumo.totalSaidas / 30)) >= 15 ? 'Adequado' : 'Crítico'}
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-4">Cobertura Operacional</h4>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {((categorias.categoriasEntrada.Vendas || 0) / resumo.totalSaidas * 100).toFixed(0)}%
                </div>
                <p className="text-sm text-gray-600 mb-3">vendas vs. gastos</p>
                <div className={`text-xs px-2 py-1 rounded ${
                  ((categorias.categoriasEntrada.Vendas || 0) / resumo.totalSaidas * 100) >= 120 ? 'bg-green-100 text-green-800' :
                  ((categorias.categoriasEntrada.Vendas || 0) / resumo.totalSaidas * 100) >= 100 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {((categorias.categoriasEntrada.Vendas || 0) / resumo.totalSaidas * 100) >= 120 ? 'Excelente' :
                   ((categorias.categoriasEntrada.Vendas || 0) / resumo.totalSaidas * 100) >= 100 ? 'Equilibrado' : 'Deficitário'}
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
                <h4 className="font-semibold text-red-800 mb-4">Dependência Externa</h4>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {((categorias.categoriasEntrada.Financiamento || 0) / resumo.totalEntradas * 100).toFixed(0)}%
                </div>
                <p className="text-sm text-gray-600 mb-3">financiamentos</p>
                <div className={`text-xs px-2 py-1 rounded ${
                  ((categorias.categoriasEntrada.Financiamento || 0) / resumo.totalEntradas * 100) <= 10 ? 'bg-green-100 text-green-800' :
                  ((categorias.categoriasEntrada.Financiamento || 0) / resumo.totalEntradas * 100) <= 30 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {((categorias.categoriasEntrada.Financiamento || 0) / resumo.totalEntradas * 100) <= 10 ? 'Baixa' :
                   ((categorias.categoriasEntrada.Financiamento || 0) / resumo.totalEntradas * 100) <= 30 ? 'Moderada' : 'Alta'}
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-4">Eficiência Financeira</h4>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {((categorias.categoriasSaida.Financeiro || 0) / resumo.totalSaidas * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mb-3">custos financeiros</p>
                <div className={`text-xs px-2 py-1 rounded ${
                  ((categorias.categoriasSaida.Financeiro || 0) / resumo.totalSaidas * 100) <= 5 ? 'bg-green-100 text-green-800' :
                  ((categorias.categoriasSaida.Financeiro || 0) / resumo.totalSaidas * 100) <= 10 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {((categorias.categoriasSaida.Financeiro || 0) / resumo.totalSaidas * 100) <= 5 ? 'Eficiente' :
                   ((categorias.categoriasSaida.Financeiro || 0) / resumo.totalSaidas * 100) <= 10 ? 'Moderado' : 'Ineficiente'}
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">📈 Análise de Tendências</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-semibold text-blue-800 mb-2">Fluxo Positivo</h5>
                  <p className="text-sm text-gray-600">
                    Entradas superam saídas em {((resumo.resultado / resumo.totalSaidas) * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h5 className="font-semibold text-green-800 mb-2">Crescimento</h5>
                  <p className="text-sm text-gray-600">
                    Capacidade de reinvestimento e crescimento sustentável
                  </p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Calculator className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h5 className="font-semibold text-purple-800 mb-2">Planejamento</h5>
                  <p className="text-sm text-gray-600">
                    Base sólida para projeções e planejamento financeiro
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">🎯 RECOMENDAÇÕES BASEADAS NOS INDICADORES</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <h5 className="font-semibold mb-2">Ações Imediatas:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Manter reserva de emergência</li>
                    <li>• Reduzir dependência de financiamentos</li>
                    <li>• Otimizar custos financeiros</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Planejamento Futuro:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Diversificar fontes de receita</li>
                    <li>• Implementar controles de fluxo</li>
                    <li>• Estabelecer metas de crescimento</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Relatório Executivo de Análise</h3>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-2">📋 DIAGNÓSTICO FINANCEIRO COMPLETO</h4>
              <p>Baseado na análise detalhada do extrato bancário e movimentações reais</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  PONTOS FORTES
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-start p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Fluxo de Caixa Positivo</div>
                      <div className="text-sm text-gray-600">
                        Resultado positivo de R$ {resumo.resultado.toLocaleString('pt-BR')} no período
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Diversificação de Recebimentos</div>
                      <div className="text-sm text-gray-600">
                        Múltiplas formas de pagamento e clientes diversos
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Controle de Custos Fixos</div>
                      <div className="text-sm text-gray-600">
                        Custos fixos representam {(((categorias.categoriasSaida.Pessoal || 0) + (categorias.categoriasSaida.Fixos || 0)) / resumo.totalSaidas * 100).toFixed(0)}% dos gastos
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-red-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-red-800 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  PONTOS DE ATENÇÃO
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-start p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Dependência de Financiamentos</div>
                      <div className="text-sm text-gray-600">
                        {((categorias.categoriasEntrada.Financiamento || 0) / resumo.totalEntradas * 100).toFixed(0)}% das entradas são de empréstimos
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Custos Financeiros</div>
                      <div className="text-sm text-gray-600">
                        R$ {(categorias.categoriasSaida.Financeiro || 0).toLocaleString('pt-BR')} em juros e tarifas
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Capital de Giro</div>
                      <div className="text-sm text-gray-600">
                        Necessidade de monitoramento contínuo do fluxo
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-blue-800 mb-4">🎯 PLANO DE AÇÃO RECOMENDADO</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-3">Próximos 30 dias</h5>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      Implementar controle diário de fluxo de caixa
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      Revisar e renegociar condições bancárias
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      Estabelecer reserva de emergência
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-3">Próximos 60 dias</h5>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      Diversificar fontes de receita
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      Otimizar estrutura de custos
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      Implementar indicadores de performance
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-purple-800 mb-3">Próximos 90 dias</h5>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      Estruturar planejamento estratégico
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      Buscar linhas de crédito mais vantajosas
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      Avaliar oportunidades de investimento
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-3">📊 RESUMO EXECUTIVO</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {resumo.saldoFinal >= 0 ? 'POSITIVO' : 'NEGATIVO'}
                  </div>
                  <p className="text-sm">Resultado Geral</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {(resumo.saldoFinal / (resumo.totalSaidas / 30)).toFixed(0)}
                  </div>
                  <p className="text-sm">Dias de Cobertura</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {((categorias.categoriasEntrada.Vendas || 0) / resumo.totalSaidas * 100).toFixed(0)}%
                  </div>
                  <p className="text-sm">Cobertura Operacional</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    VIÁVEL
                  </div>
                  <p className="text-sm">Situação Geral</p>
                </div>
              </div>
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
          Módulo 2: Análise de Extratos Bancários
        </h2>
        <p className="text-lg text-gray-600">
          Metodologia prática para análise financeira baseada em dados reais
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
                  ? 'bg-blue-600 text-white shadow-lg'
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

export default Modulo2
