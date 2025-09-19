
import React, { useState } from 'react'
import {Target, Users, Building, TrendingUp, Search, CheckCircle, AlertTriangle, BarChart3, PieChart} from 'lucide-react'

const Modulo1 = () => {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    { title: "Análise do Segmento", icon: Search },
    { title: "Estrutura da Equipe", icon: Users },
    { title: "Diagnóstico Financeiro", icon: BarChart3 },
    { title: "Plano de Ação", icon: Target }
  ]

  const segmentos = [
    {
      nome: "Varejo",
      caracteristicas: ["Alto giro de estoque", "Pagamento à vista predominante", "Sazonalidade marcante"],
      indicadores: ["Ticket médio", "Frequência de compra", "Margem bruta"],
      desafios: ["Gestão de estoque", "Fluxo de caixa irregular", "Concorrência acirrada"]
    },
    {
      nome: "Serviços",
      caracteristicas: ["Baixo investimento em estoque", "Receita baseada em tempo/projeto", "Equipe especializada"],
      indicadores: ["Valor hora", "Utilização da equipe", "Recorrência"],
      desafios: ["Precificação adequada", "Gestão de projetos", "Retenção de talentos"]
    },
    {
      nome: "Indústria",
      caracteristicas: ["Alto investimento em ativos", "Processo produtivo complexo", "Cadeia de suprimentos"],
      indicadores: ["Capacidade utilizada", "Custo por unidade", "Eficiência operacional"],
      desafios: ["Controle de custos", "Qualidade", "Inovação tecnológica"]
    }
  ]

  const renderStep = () => {
    switch(activeStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">1. Análise do Segmento</h3>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">🎯 PRIMEIRO PASSO: Entender o Negócio</h4>
              <p className="text-gray-700">
                Antes de analisar números, precisamos entender profundamente o segmento em que a empresa atua. 
                Cada setor tem suas particularidades, desafios e oportunidades específicas.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {segmentos.map((segmento, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">{segmento.nome}</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-green-700 mb-2">Características</h5>
                      <ul className="text-sm space-y-1">
                        {segmento.caracteristicas.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-blue-700 mb-2">Indicadores-Chave</h5>
                      <ul className="text-sm space-y-1">
                        {segmento.indicadores.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <BarChart3 className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-red-700 mb-2">Principais Desafios</h5>
                      <ul className="text-sm space-y-1">
                        {segmento.desafios.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-yellow-800 mb-3">💡 DICA PRÁTICA</h4>
              <p className="text-gray-700">
                <strong>Perguntas essenciais para fazer ao cliente:</strong>
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Qual o principal produto/serviço e como é vendido?</li>
                <li>• Quem são os principais concorrentes?</li>
                <li>• Qual a sazonalidade do negócio?</li>
                <li>• Como funciona o ciclo de vendas?</li>
                <li>• Quais são os maiores gargalos operacionais?</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">🚀 RESULTADO ESPERADO</h4>
              <p>
                Ao final desta etapa, você deve ter uma visão clara do modelo de negócio, 
                principais desafios do setor e oportunidades de melhoria específicas para aquele segmento.
              </p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">2. Análise da Estrutura da Equipe</h3>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-green-800 mb-3">👥 SEGUNDO PASSO: Mapear a Organização</h4>
              <p className="text-gray-700">
                A estrutura da equipe revela muito sobre a eficiência operacional e os custos da empresa. 
                Precisamos entender como o trabalho é organizado e distribuído.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Estrutura Organizacional
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">Liderança</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Quantos sócios/diretores?</li>
                      <li>• Divisão de responsabilidades</li>
                      <li>• Nível de envolvimento operacional</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">Operacional</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Número de funcionários por área</li>
                      <li>• Terceirizados vs. CLT</li>
                      <li>• Produtividade por pessoa</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-yellow-800 mb-2">Administrativo</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Estrutura financeira/contábil</li>
                      <li>• Sistemas de controle</li>
                      <li>• Processos documentados</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                  Análise de Custos com Pessoal
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-800 mb-2">Custos Diretos</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Salários + encargos</li>
                      <li>• Benefícios e vale-transporte</li>
                      <li>• Comissões e bonificações</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-800 mb-2">Custos Indiretos</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Treinamentos e capacitação</li>
                      <li>• Equipamentos e ferramentas</li>
                      <li>• Espaço físico por funcionário</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-800 mb-2">Eficiência</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Receita por funcionário</li>
                      <li>• Horas produtivas vs. totais</li>
                      <li>• Taxa de rotatividade</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">🔍 Checklist de Análise da Equipe</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-blue-800 mb-3">Perguntas Estratégicas</h5>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-2" />
                      A empresa tem organograma definido?
                    </label>
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-2" />
                      Existem descrições de cargo claras?
                    </label>
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-2" />
                      Há metas individuais e por equipe?
                    </label>
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-2" />
                      Os processos são documentados?
                    </label>
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-2" />
                      Existe plano de carreira?
                    </label>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-green-800 mb-3">Indicadores de Performance</h5>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-2" />
                      Controle de ponto/produtividade
                    </label>
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-2" />
                      Avaliação de desempenho regular
                    </label>
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-2" />
                      Sistema de recompensas
                    </label>
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-2" />
                      Feedback contínuo
                    </label>
                    <label className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-2" />
                      Plano de desenvolvimento
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">🎯 RESULTADO ESPERADO</h4>
              <p>
                Compreensão clara da estrutura organizacional, custos com pessoal e oportunidades de 
                otimização na gestão de pessoas e processos.
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">3. Diagnóstico Financeiro via Extrato Bancário</h3>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">💰 TERCEIRO PASSO: Análise Real do Fluxo de Caixa</h4>
              <p className="text-gray-700">
                Ao invés de depender de DREs que podem estar desatualizadas, analisamos o extrato bancário 
                para entender o fluxo real de entrada e saída de recursos.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Análise das Entradas
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Receitas Operacionais</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Vendas à vista (PIX, dinheiro, cartão)</li>
                      <li>• Recebimentos de vendas a prazo</li>
                      <li>• Prestação de serviços</li>
                      <li>• Outras receitas operacionais</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">Receitas Não Operacionais</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Empréstimos e financiamentos</li>
                      <li>• Aporte de sócios</li>
                      <li>• Vendas de ativos</li>
                      <li>• Rendimentos de aplicações</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-yellow-700 mb-2">Padrões a Identificar</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Sazonalidade das vendas</li>
                      <li>• Concentração em poucos clientes</li>
                      <li>• Prazo médio de recebimento</li>
                      <li>• Dependência de empréstimos</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-red-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-red-800 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Análise das Saídas
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">Custos Operacionais</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Fornecedores e mercadorias</li>
                      <li>• Folha de pagamento</li>
                      <li>• Aluguel e contas fixas</li>
                      <li>• Impostos e taxas</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-700 mb-2">Custos Financeiros</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Juros de empréstimos</li>
                      <li>• Tarifas bancárias</li>
                      <li>• Descontos concedidos</li>
                      <li>• Multas e penalidades</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-700 mb-2">Investimentos</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Compra de equipamentos</li>
                      <li>• Reformas e melhorias</li>
                      <li>• Marketing e publicidade</li>
                      <li>• Capacitação da equipe</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">📊 Metodologia de Análise do Extrato</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h5 className="font-semibold mb-2">Categorização</h5>
                  <p className="text-sm text-gray-600">
                    Classificar todas as movimentações por categoria e natureza
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h5 className="font-semibold mb-2">Periodicidade</h5>
                  <p className="text-sm text-gray-600">
                    Identificar padrões mensais, sazonais e tendências
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h5 className="font-semibold mb-2">Indicadores</h5>
                  <p className="text-sm text-gray-600">
                    Calcular métricas de liquidez, giro e rentabilidade
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">⚠️ SINAIS DE ALERTA NO EXTRATO</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <ul className="space-y-1 text-sm">
                  <li>• Saldo negativo frequente</li>
                  <li>• Dependência de empréstimos</li>
                  <li>• Juros e tarifas excessivas</li>
                </ul>
                <ul className="space-y-1 text-sm">
                  <li>• Concentração de recebimentos</li>
                  <li>• Gastos sem padrão definido</li>
                  <li>• Retiradas excessivas dos sócios</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">4. Análise do Sistema de Vendas</h3>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-green-800 mb-3">📈 QUARTO PASSO: Dados Operacionais Reais</h4>
              <p className="text-gray-700">
                Os dados do sistema de vendas revelam a performance operacional real da empresa, 
                permitindo análises precisas de rentabilidade e eficiência.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Análise de Vendas
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">Volume e Frequência</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Número de vendas por período</li>
                      <li>• Ticket médio por venda</li>
                      <li>• Sazonalidade das vendas</li>
                      <li>• Crescimento mês a mês</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Produtos/Serviços</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Produtos mais vendidos</li>
                      <li>• Margem por produto/categoria</li>
                      <li>• Produtos com baixo giro</li>
                      <li>• Análise ABC de produtos</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-yellow-700 mb-2">Clientes</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Clientes mais importantes</li>
                      <li>• Frequência de compra</li>
                      <li>• Ticket médio por cliente</li>
                      <li>• Taxa de retenção</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Análise de Rentabilidade
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-700 mb-2">Margem por Produto</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Custo vs. preço de venda</li>
                      <li>• Margem bruta real</li>
                      <li>• Produtos deficitários</li>
                      <li>• Oportunidades de repricing</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">Custos Operacionais</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Custo por venda realizada</li>
                      <li>• Comissões e incentivos</li>
                      <li>• Custos de logística</li>
                      <li>• Perdas e devoluções</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-700 mb-2">Performance da Equipe</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Vendas por vendedor</li>
                      <li>• Conversão de leads</li>
                      <li>• Tempo médio de venda</li>
                      <li>• Meta vs. realizado</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">🔍 Cruzamento de Dados: Sistema vs. Extrato</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-blue-800 mb-3">Validações Importantes</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Vendas registradas = Recebimentos no extrato</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Prazos de recebimento reais vs. cadastrados</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Inadimplência real vs. estimada</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Custos reais vs. custos cadastrados</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-red-800 mb-3">Discrepâncias Comuns</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Vendas não faturadas ou subfaturadas</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Custos não cadastrados no sistema</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Recebimentos em contas não monitoradas</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Diferenças de prazo e condições</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">🎯 RESULTADO FINAL</h4>
              <p>
                Com a análise completa de segmento, equipe, extrato bancário e sistema de vendas, 
                você terá um diagnóstico preciso e um plano de ação customizado para cada empresa.
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
          Metodologia de Consultoria Financeira Empresarial
        </h2>
        <p className="text-lg text-gray-600">
          Passo a passo prático para análise e consultoria baseada em dados reais
        </p>
      </div>

      {/* Steps Navigation */}
      <div className="flex flex-wrap justify-center mb-8 bg-gray-100 p-2 rounded-xl">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`flex items-center px-4 py-3 rounded-lg m-1 transition-all ${
                activeStep === index
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {step.title}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-6">
        {renderStep()}
      </div>
    </div>
  )
}

export default Modulo1
