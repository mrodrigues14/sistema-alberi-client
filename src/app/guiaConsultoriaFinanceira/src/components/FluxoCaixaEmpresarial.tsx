
import React, { useState } from 'react'
import {Users, Building, TrendingUp, Search, CheckCircle, AlertTriangle, BarChart3, Target, Lightbulb, Settings, Megaphone, Shield, ArrowRight, Star, Zap, Globe, Award} from 'lucide-react'

const FluxoCaixaEmpresarial = () => {
  const [activeSection, setActiveSection] = useState(0)

  const sections = [
    { title: "Análise da Equipe", icon: Users },
    { title: "Diagnóstico Financeiro", icon: BarChart3 },
    { title: "Perfil Empresarial", icon: Target },
    { title: "Perfil Estratégico", icon: Lightbulb },
    { title: "Marketing Integrado", icon: Megaphone },
    { title: "Padronização", icon: Settings }
  ]

  const renderSection = () => {
    switch(activeSection) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Análise da Equipe</h3>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">👥 CONHECENDO A EQUIPE</h4>
              <p className="text-gray-700">
                Os funcionários são os primeiros clientes da empresa. A forma como o proprietário se refere a eles 
                revela muito sobre a cultura organizacional e possíveis problemas internos.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-600" />
                  Perguntas Essenciais
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">Estrutura da Equipe</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Quantos funcionários?</li>
                      <li>• Quantos são contratados (CLT)?</li>
                      <li>• Quantos são comissionados? Qual porcentagem?</li>
                      <li>• Quantos não possuem contrato formal?</li>
                      <li>• Quais são os salários e cargos?</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">Relacionamento</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Como o proprietário se refere aos funcionários?</li>
                      <li>• Há relação de respeito mútuo?</li>
                      <li>• Existe satisfação entre funcionário e patrão?</li>
                      <li>• Funcionários conhecem seus papéis?</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Metodologia de Avaliação
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-yellow-800 mb-2">🔍 Observação Durante a Conversa</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Tone de voz ao falar dos funcionários</li>
                      <li>• Expressões faciais e linguagem corporal</li>
                      <li>• Palavras utilizadas (positivas/negativas)</li>
                      <li>• Nível de conhecimento sobre cada funcionário</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-800 mb-2">👤 Reuniões Individuais</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Solicitar reunião com cada funcionário</li>
                      <li>• Entender de qual lado está o problema</li>
                      <li>• Deixar funcionário ciente do seu papel</li>
                      <li>• Coletar sugestões e dificuldades</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-red-800 mb-3">⚠️ SINAIS DE ALERTA</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    Proprietário fala mal dos funcionários
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    Alta rotatividade de pessoal
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    Funcionários sem contrato formal
                  </li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    Falta de clareza sobre funções
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    Salários em atraso
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    Ambiente de trabalho tenso
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Diagnóstico Financeiro</h3>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-green-800 mb-3">💰 CONHECENDO AS FINANÇAS</h4>
              <p className="text-gray-700">
                Tema delicado que requer sutileza. Aproveite aberturas na conversa e demonstre conhecimento 
                técnico para ganhar confiança do cliente.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  Estrutura Societária
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">Sócios e Participação</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Tem sócios? Qual a participação de cada um?</li>
                      <li>• Há divergência de ideias entre sócios?</li>
                      <li>• Todos participam da operação?</li>
                      <li>• Como são tomadas as decisões?</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">Remuneração dos Sócios</h5>
                    <ul className="text-sm space-y-1">
                      <li>• O sócio recebe pró-labore?</li>
                      <li>• Faz retirada de lucro?</li>
                      <li>• Qual salário precisa retirar por mês?</li>
                      <li>• Entende a diferença entre pró-labore e lucro?</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                  Controle Financeiro
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-yellow-800 mb-2">Contas e Controles</h5>
                    <ul className="text-sm space-y-1">
                      <li>• A conta corrente é de uso exclusivo da empresa?</li>
                      <li>• Como é feito o controle financeiro?</li>
                      <li>• Possui sistema ou usa cadernos/blocos?</li>
                      <li>• Os dados são inseridos corretamente?</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-800 mb-2">Contabilidade</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Possui contrato com escritório contábil?</li>
                      <li>• Qual o regime tributário?</li>
                      <li>• Impostos em dia?</li>
                      <li>• Entende o impacto dos impostos no faturamento?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">📊 Onde Estou e Para Onde Vou?</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-red-800 mb-3">Situação Atual</h5>
                  <div className="space-y-2 text-sm">
                    <div className="bg-red-50 p-3 rounded">
                      <strong>Perguntas Críticas:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• A empresa tem lucro ou prejuízo?</li>
                        <li>• Qual a margem de lucratividade?</li>
                        <li>• Onde está vazando dinheiro?</li>
                        <li>• Quais os maiores gastos?</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-green-800 mb-3">Categorização de Gastos</h5>
                  <div className="space-y-2 text-sm">
                    <div className="bg-green-50 p-3 rounded">
                      <strong>Itens a Listar:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Custos fixos e variáveis</li>
                        <li>• Impostos e salários</li>
                        <li>• Pró-labore e insumos</li>
                        <li>• Dívidas e investimentos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-orange-50 p-4 rounded-lg">
                <h5 className="font-semibold text-orange-800 mb-2">💡 DICA IMPORTANTE</h5>
                <p className="text-sm">
                  <strong>Apresente os gastos em porcentagem!</strong> Isso ajuda o empresário a avaliar 
                  com menos emoção e mais razão. Dê atenção especial aos gastos pessoais dos sócios.
                </p>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Perfil Empresarial</h3>
            
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-purple-800 mb-3">🎯 PRIMEIRO PASSO PARA AGIR</h4>
              <p className="text-gray-700">
                O perfil empresarial é crucial para identificar as tomadas de decisão específicas para cada tipo de empresa. 
                Cada perfil demanda estratégias e ações diferenciadas.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-red-200 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <h4 className="text-lg font-bold text-red-800">Empresa Endividada</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">Sinais Identificadores</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Alto volume de empréstimos</li>
                      <li>• Juros comprometem o fluxo</li>
                      <li>• Dificuldade para quitar dívidas</li>
                      <li>• Saldo negativo frequente</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-700 mb-2">Ações Imediatas</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Análise detalhada dos empréstimos</li>
                      <li>• Renegociação de dívidas</li>
                      <li>• Portabilidade de crédito</li>
                      <li>• Corte de gastos não essenciais</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-yellow-700 mb-2">Estratégias</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Foco na geração de caixa</li>
                      <li>• Priorização de pagamentos</li>
                      <li>• Plano de quitação escalonado</li>
                      <li>• Monitoramento rigoroso</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-bold text-blue-800">Baixo Faturamento</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">Sinais Identificadores</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Vendas abaixo do potencial</li>
                      <li>• Baixo ticket médio</li>
                      <li>• Poucos clientes ativos</li>
                      <li>• Sazonalidade prejudicial</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Ações Imediatas</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Estratégias de aumento de vendas</li>
                      <li>• Melhoria no atendimento</li>
                      <li>• Campanhas promocionais</li>
                      <li>• Expansão de canais</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-700 mb-2">Estratégias</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Análise de mercado</li>
                      <li>• Melhoria de produtos</li>
                      <li>• Marketing direcionado</li>
                      <li>• Fidelização de clientes</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold text-green-800">Problemas de Equipe</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Sinais Identificadores</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Alta rotatividade</li>
                      <li>• Baixa produtividade</li>
                      <li>• Conflitos internos</li>
                      <li>• Falta de motivação</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">Ações Imediatas</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Melhoria do clima organizacional</li>
                      <li>• Treinamentos e capacitação</li>
                      <li>• Definição clara de funções</li>
                      <li>• Sistema de metas e recompensas</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-yellow-700 mb-2">Estratégias</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Plano de carreira</li>
                      <li>• Comunicação efetiva</li>
                      <li>• Benefícios motivacionais</li>
                      <li>• Cultura organizacional</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                METODOLOGIA DE IDENTIFICAÇÃO DO PERFIL
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">1</div>
                  <h5 className="font-semibold mb-1">DIAGNÓSTICO</h5>
                  <p className="text-sm opacity-90">Análise dos dados coletados</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">2</div>
                  <h5 className="font-semibold mb-1">PRIORIZAÇÃO</h5>
                  <p className="text-sm opacity-90">Identificar problema principal</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">3</div>
                  <h5 className="font-semibold mb-1">AÇÃO</h5>
                  <p className="text-sm opacity-90">Estratégia específica para o perfil</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Criação do Perfil Estratégico</h3>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">🗺️ MAPA ESTRATÉGICO INTEGRADO</h4>
              <p className="text-gray-700">
                Criar um mapa onde todos os segmentos trabalhem em conjunto, com regras de prioridade claras 
                para vendas, redução de custos, melhoria de equipe e demais estratégias.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">🎯 MATRIZ DE PRIORIDADES ESTRATÉGICAS</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                    <h5 className="font-bold text-red-800 mb-2 flex items-center">
                      <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                      PRIORIDADE CRÍTICA
                    </h5>
                    <ul className="text-sm space-y-1">
                      <li>• Problemas que impedem funcionamento</li>
                      <li>• Questões que geram prejuízo imediato</li>
                      <li>• Riscos de fechamento da empresa</li>
                      <li>• Questões legais/trabalhistas urgentes</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r">
                    <h5 className="font-bold text-orange-800 mb-2 flex items-center">
                      <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                      PRIORIDADE ALTA
                    </h5>
                    <ul className="text-sm space-y-1">
                      <li>• Melhorias que geram receita rápida</li>
                      <li>• Reduções de custo significativas</li>
                      <li>• Otimizações de processo</li>
                      <li>• Treinamentos essenciais</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r">
                    <h5 className="font-bold text-yellow-800 mb-2 flex items-center">
                      <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                      PRIORIDADE MÉDIA
                    </h5>
                    <ul className="text-sm space-y-1">
                      <li>• Melhorias de médio prazo</li>
                      <li>• Investimentos em tecnologia</li>
                      <li>• Expansão de mercado</li>
                      <li>• Desenvolvimento de produtos</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                    <h5 className="font-bold text-green-800 mb-2 flex items-center">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
                      PRIORIDADE BAIXA
                    </h5>
                    <ul className="text-sm space-y-1">
                      <li>• Melhorias estéticas</li>
                      <li>• Projetos de longo prazo</li>
                      <li>• Investimentos não essenciais</li>
                      <li>• Expansões futuras</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Estratégias de Vendas
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">Ações Imediatas</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Treinamento da equipe de vendas</li>
                      <li>• Melhoria do processo de atendimento</li>
                      <li>• Campanhas promocionais direcionadas</li>
                      <li>• Follow-up de clientes inativos</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Médio Prazo</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Expansão de canais de venda</li>
                      <li>• Desenvolvimento de novos produtos</li>
                      <li>• Parcerias estratégicas</li>
                      <li>• Sistema de CRM</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-700 mb-2">Longo Prazo</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Expansão geográfica</li>
                      <li>• Novos mercados</li>
                      <li>• Franchising</li>
                      <li>• E-commerce robusto</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-red-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-red-800 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Redução de Custos
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">Ações Imediatas</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Renegociação de contratos</li>
                      <li>• Eliminação de gastos supérfluos</li>
                      <li>• Otimização de processos</li>
                      <li>• Controle rigoroso de estoque</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-700 mb-2">Médio Prazo</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Automação de processos</li>
                      <li>• Terceirização estratégica</li>
                      <li>• Melhoria de fornecedores</li>
                      <li>• Eficiência energética</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-yellow-700 mb-2">Longo Prazo</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Investimentos em tecnologia</li>
                      <li>• Reestruturação organizacional</li>
                      <li>• Mudança de localização</li>
                      <li>• Verticalização</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Melhoria de Equipe
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-700 mb-2">Capacitação</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Treinamentos técnicos</li>
                    <li>• Desenvolvimento de liderança</li>
                    <li>• Cursos de atendimento</li>
                    <li>• Certificações profissionais</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-700 mb-2">Motivação</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Sistema de metas</li>
                    <li>• Programa de incentivos</li>
                    <li>• Reconhecimento público</li>
                    <li>• Plano de carreira</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-purple-700 mb-2">Organização</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Descrição de cargos</li>
                    <li>• Organograma claro</li>
                    <li>• Processos documentados</li>
                    <li>• Avaliação de desempenho</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                CRONOGRAMA DE IMPLEMENTAÇÃO
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold mb-2">30 dias</div>
                  <p className="text-sm opacity-90">Ações críticas e emergenciais</p>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-2">90 dias</div>
                  <p className="text-sm opacity-90">Melhorias de alto impacto</p>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-2">6 meses</div>
                  <p className="text-sm opacity-90">Projetos de médio prazo</p>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-2">1 ano</div>
                  <p className="text-sm opacity-90">Transformação completa</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Marketing Integrado</h3>
            
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-orange-800 mb-3">📢 CONECTANDO ESTRATÉGIAS COM VENDAS</h4>
              <p className="text-gray-700">
                É super importante conectar as estratégias com o que se vende da empresa. A conexão dos setores 
                e apresentação clara de tudo que está sendo feito de forma estratégica é fundamental.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-orange-800 mb-4 flex items-center">
                  <Megaphone className="w-5 h-5 mr-2" />
                  Alinhamento de Mensagem
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-700 mb-2">Unificação da Comunicação</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Funcionários falam a mesma linguagem</li>
                      <li>• Proprietários alinhados com o discurso</li>
                      <li>• Mídias sociais coerentes</li>
                      <li>• Material promocional consistente</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">Canais de Comunicação</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Site atualizado e profissional</li>
                      <li>• Redes sociais ativas</li>
                      <li>• WhatsApp Business</li>
                      <li>• E-mail marketing</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Diferencial Competitivo</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Identificar e comunicar o diferencial</li>
                      <li>• Destacar o produto carro-chefe</li>
                      <li>• Qualidade e apresentação</li>
                      <li>• Proposta de valor clara</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Estratégias de Marketing
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-700 mb-2">Marketing Digital</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Google Meu Negócio otimizado</li>
                      <li>• Campanhas no Facebook/Instagram</li>
                      <li>• Marketing de conteúdo</li>
                      <li>• SEO local</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-yellow-700 mb-2">Marketing Tradicional</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Panfletos e material gráfico</li>
                      <li>• Parcerias locais</li>
                      <li>• Eventos e feiras</li>
                      <li>• Boca a boca estruturado</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">Marketing de Relacionamento</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Programa de fidelidade</li>
                      <li>• Atendimento pós-venda</li>
                      <li>• Pesquisa de satisfação</li>
                      <li>• Clube de benefícios</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">🔗 Integração Marketing → Vendas</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-green-800 mb-3">Processo de Conversão</h5>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <strong className="text-sm">Atração</strong>
                        <p className="text-xs text-gray-600">Marketing gera interesse</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <strong className="text-sm">Contato</strong>
                        <p className="text-xs text-gray-600">Cliente entra em contato</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <strong className="text-sm">Atendimento</strong>
                        <p className="text-xs text-gray-600">Equipe preparada recebe</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-orange-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        <span className="text-orange-600 font-bold text-sm">4</span>
                      </div>
                      <div>
                        <strong className="text-sm">Fechamento</strong>
                        <p className="text-xs text-gray-600">Venda concretizada</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-red-800 mb-3">Pontos de Atenção</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Marketing promete algo que vendas não entrega</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Equipe não conhece as promoções</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Atendimento não reflete a marca</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Falta de follow-up pós-venda</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h5 className="font-semibold text-green-800 mb-2">Consistência</h5>
                <p className="text-sm text-gray-600">Mesma mensagem em todos os canais</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h5 className="font-semibold text-blue-800 mb-2">Foco</h5>
                <p className="text-sm text-gray-600">Público-alvo bem definido</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h5 className="font-semibold text-purple-800 mb-2">Mensuração</h5>
                <p className="text-sm text-gray-600">Resultados acompanhados</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                RESULTADO ESPERADO
              </h4>
              <p>
                Marketing e vendas trabalhando em perfeita sintonia, com mensagem unificada, 
                equipe alinhada e resultados mensuráveis que impactem diretamente no faturamento.
              </p>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Padronização</h3>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-green-800 mb-3">⚙️ NOVO PADRÃO DE TRABALHO</h4>
              <p className="text-gray-700">
                A empresa entra em um modo de conhecimento do novo padrão de trabalho. Toda a equipe, 
                parceiros, donos e demais estão em sintonia para um trabalho em massa e profissional! 
                Isso é de extrema importância para os números começarem a melhorar.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Padronização de Processos
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Atendimento</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Script de atendimento padrão</li>
                      <li>• Tempo de resposta definido</li>
                      <li>• Protocolo de reclamações</li>
                      <li>• Follow-up estruturado</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">Vendas</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Processo de vendas documentado</li>
                      <li>• Argumentos de venda padronizados</li>
                      <li>• Propostas comerciais uniformes</li>
                      <li>• Contratos e documentos padrão</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-700 mb-2">Operacional</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Procedimentos operacionais</li>
                      <li>• Checklists de qualidade</li>
                      <li>• Cronogramas de atividades</li>
                      <li>• Controles de produtividade</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Padronização da Equipe
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-yellow-700 mb-2">Uniformização</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Uniforme ou dress code</li>
                      <li>• Crachás de identificação</li>
                      <li>• Postura profissional</li>
                      <li>• Linguagem corporativa</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-700 mb-2">Treinamento</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Manual do funcionário</li>
                      <li>• Treinamento de integração</li>
                      <li>• Capacitação continuada</li>
                      <li>• Avaliação periódica</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">Comportamento</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Código de conduta</li>
                      <li>• Valores da empresa</li>
                      <li>• Ética profissional</li>
                      <li>• Trabalho em equipe</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">🎯 Implementação da Padronização</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h5 className="font-semibold mb-2">DOCUMENTAÇÃO</h5>
                  <p className="text-sm text-gray-600">
                    Criar manuais e procedimentos escritos
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h5 className="font-semibold mb-2">TREINAMENTO</h5>
                  <p className="text-sm text-gray-600">
                    Capacitar toda a equipe nos novos padrões
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h5 className="font-semibold mb-2">MONITORAMENTO</h5>
                  <p className="text-sm text-gray-600">
                    Acompanhar a aplicação dos padrões
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-orange-600">4</span>
                  </div>
                  <h5 className="font-semibold mb-2">AJUSTES</h5>
                  <p className="text-sm text-gray-600">
                    Melhorar continuamente os processos
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Equipe Alinhada
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Todos conhecem sua função</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Processos claros e documentados</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Comunicação eficiente</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Metas e objetivos compartilhados</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Parceiros Integrados
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Fornecedores alinhados</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Prestadores de serviço padronizados</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Contratos e acordos claros</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Qualidade garantida</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Donos Engajados
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Liderança pelo exemplo</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Decisões baseadas em dados</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Investimento em melhorias</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Comprometimento com resultados</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                TRANSFORMAÇÃO COMPLETA
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">Antes da Padronização:</h5>
                  <ul className="text-sm space-y-1 opacity-90">
                    <li>• Processos desorganizados</li>
                    <li>• Equipe desmotivada</li>
                    <li>• Resultados inconsistentes</li>
                    <li>• Retrabalho constante</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Após a Padronização:</h5>
                  <ul className="text-sm space-y-1 opacity-90">
                    <li>• Operação profissional</li>
                    <li>• Equipe engajada</li>
                    <li>• Resultados previsíveis</li>
                    <li>• Eficiência máxima</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg">
                <p className="text-center font-semibold">
                  🚀 RESULTADO: Números começam a melhorar de forma sustentável e consistente!
                </p>
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
          Análise da Equipe e Diagnóstico Financeiro
        </h2>
        <p className="text-lg text-gray-600">
          Metodologia completa para avaliação de funcionários, estrutura societária e implementação de padrões profissionais
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap justify-center mb-8 bg-gray-100 p-2 rounded-xl">
        {sections.map((section, index) => {
          const Icon = section.icon
          return (
            <button
              key={index}
              onClick={() => setActiveSection(index)}
              className={`flex items-center px-4 py-3 rounded-lg m-1 transition-all ${
                activeSection === index
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {section.title}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-6">
        {renderSection()}
      </div>
    </div>
  )
}

export default FluxoCaixaEmpresarial
