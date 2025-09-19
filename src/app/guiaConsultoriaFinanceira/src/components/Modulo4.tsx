
import React, { useState } from 'react'
import {TrendingUp, Calculator, Map, Heart, DollarSign} from 'lucide-react'

const Modulo4 = () => {
  const [activeSection, setActiveSection] = useState(0)

  const sections = [
    { title: "Saúde Financeira e Economia", icon: Heart },
    { title: "Fazendo as Contas", icon: Calculator },
    { title: "Traçando Novos Caminhos", icon: Map },
    { title: "Simulador Financeiro", icon: DollarSign }
  ]

  const impactoEconomico = [
    {
      comportamento: "Famílias Endividadas",
      consumo: "Redução de 30-40%",
      impacto: "Recessão econômica",
      juros: "Aumento para conter inflação"
    },
    {
      comportamento: "Famílias Poupando",
      consumo: "Estável e planejado",
      impacto: "Crescimento sustentável",
      juros: "Estabilidade nas taxas"
    },
    {
      comportamento: "Famílias Investindo",
      consumo: "Consumo consciente",
      impacto: "Desenvolvimento econômico",
      juros: "Redução gradual"
    }
  ]

  const calculoJuros = {
    emprestimo: 50000,
    taxa: 2.5,
    prazo: 24,
    parcela: 2500,
    totalPago: 60000,
    jurosTotal: 10000
  }

  const [simulacao, setSimulacao] = useState({
    valorInicial: 1000,
    aporteMensal: 500,
    taxa: 10,
    prazo: 60
  })

  const calcularInvestimento = () => {
    const { valorInicial, aporteMensal, taxa, prazo } = simulacao
    const taxaMensal = taxa / 100 / 12
    
    let valor = valorInicial
    for (let i = 0; i < prazo; i++) {
      valor = valor * (1 + taxaMensal) + aporteMensal
    }
    
    return {
      valorFinal: valor,
      totalAportado: valorInicial + (aporteMensal * prazo),
      rendimento: valor - (valorInicial + (aporteMensal * prazo))
    }
  }

  const resultado = calcularInvestimento()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Planejamento Estratégico: Construindo Novos Caminhos</h1>
        <p className="text-gray-600">Entendendo o impacto econômico e planejando estrategicamente</p>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {sections.map((section, index) => {
          const Icon = section.icon
          return (
            <button
              key={index}
              onClick={() => setActiveSection(index)}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md transition-all ${
                activeSection === index 
                  ? 'bg-white shadow-md text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span className="font-medium text-sm">{section.title}</span>
            </button>
          )
        })}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {activeSection === 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Heart className="w-6 h-6 mr-3 text-red-600" />
              Importância da Saúde Financeira para a Economia
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th className="p-4 text-left">Comportamento das Famílias</th>
                    <th className="p-4 text-center">Impacto no Consumo</th>
                    <th className="p-4 text-center">Efeito na Economia</th>
                    <th className="p-4 text-center">Resposta dos Juros</th>
                  </tr>
                </thead>
                <tbody>
                  {impactoEconomico.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-4 font-medium">{item.comportamento}</td>
                      <td className="p-4 text-center">{item.consumo}</td>
                      <td className="p-4 text-center">{item.impacto}</td>
                      <td className="p-4 text-center">{item.juros}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
                <h3 className="font-bold text-red-800 mb-3">📉 Ciclo Vicioso</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded border border-red-200">
                    <p className="font-medium text-red-700">1. Endividamento</p>
                    <p className="text-red-600">Famílias gastam mais que ganham</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-red-200">
                    <p className="font-medium text-red-700">2. Redução do Consumo</p>
                    <p className="text-red-600">Menos dinheiro para gastos</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-red-200">
                    <p className="font-medium text-red-700">3. Recessão</p>
                    <p className="text-red-600">Empresas vendem menos</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-red-200">
                    <p className="font-medium text-red-700">4. Desemprego</p>
                    <p className="text-red-600">Mais famílias em dificuldade</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
                <h3 className="font-bold text-green-800 mb-3">📈 Ciclo Virtuoso</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="font-medium text-green-700">1. Organização</p>
                    <p className="text-green-600">Famílias controlam gastos</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="font-medium text-green-700">2. Consumo Consciente</p>
                    <p className="text-green-600">Gastos planejados e sustentáveis</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="font-medium text-green-700">3. Crescimento</p>
                    <p className="text-green-600">Economia estável e previsível</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="font-medium text-green-700">4. Oportunidades</p>
                    <p className="text-green-600">Mais empregos e renda</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-bold text-blue-800 mb-3">🎯 Papel do Consultor</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <p className="font-medium text-blue-700">Educar</p>
                    <p className="text-blue-600">Ensinar conceitos financeiros</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <p className="font-medium text-blue-700">Orientar</p>
                    <p className="text-blue-600">Guiar decisões inteligentes</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <p className="font-medium text-blue-700">Transformar</p>
                    <p className="text-blue-600">Mudar comportamentos</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <p className="font-medium text-blue-700">Impactar</p>
                    <p className="text-blue-600">Contribuir para economia saudável</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
              <h4 className="font-bold text-yellow-800 mb-3">💡 Dados Econômicos Brasileiros</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-yellow-700">67%</p>
                  <p className="text-yellow-600 text-sm">das famílias estão endividadas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-700">29%</p>
                  <p className="text-yellow-600 text-sm">não conseguem pagar as contas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-700">R$ 4.600</p>
                  <p className="text-yellow-600 text-sm">dívida média por família</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-700">13,75%</p>
                  <p className="text-yellow-600 text-sm">taxa Selic atual</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Calculator className="w-6 h-6 mr-3 text-blue-600" />
              Fazendo as Contas: Juros, Impostos, Extras
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-blue-800">💰 Exemplo: Empréstimo de R$ 50.000</h3>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Valor do empréstimo:</span>
                      <span className="text-xl font-bold text-blue-600">R$ {calculoJuros.emprestimo.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Taxa de juros:</span>
                      <span className="text-xl font-bold text-blue-600">{calculoJuros.taxa}% ao mês</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Prazo:</span>
                      <span className="text-xl font-bold text-blue-600">{calculoJuros.prazo} meses</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Parcela mensal:</span>
                        <span className="text-xl font-bold text-red-600">R$ {calculoJuros.parcela.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total pago:</span>
                        <span className="text-xl font-bold text-red-600">R$ {calculoJuros.totalPago.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total de juros:</span>
                        <span className="text-xl font-bold text-red-700">R$ {calculoJuros.jurosTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-green-800">📊 Comparativo de Custos</h3>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                    <h4 className="font-medium text-red-800 mb-2">Cartão de Crédito Rotativo</h4>
                    <p className="text-red-600 text-sm mb-2">R$ 5.000 por 12 meses a 10% a.m.</p>
                    <p className="text-2xl font-bold text-red-700">R$ 15.529</p>
                    <p className="text-red-500 text-sm">Total pago (210% de juros)</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <h4 className="font-medium text-yellow-800 mb-2">Empréstimo Pessoal</h4>
                    <p className="text-yellow-600 text-sm mb-2">R$ 5.000 por 12 meses a 5% a.m.</p>
                    <p className="text-2xl font-bold text-yellow-700">R$ 8.985</p>
                    <p className="text-yellow-500 text-sm">Total pago (80% de juros)</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h4 className="font-medium text-green-800 mb-2">Financiamento Garantido</h4>
                    <p className="text-green-600 text-sm mb-2">R$ 5.000 por 12 meses a 1,5% a.m.</p>
                    <p className="text-2xl font-bold text-green-700">R$ 5.956</p>
                    <p className="text-green-500 text-sm">Total pago (19% de juros)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-bold text-purple-800 mb-4">🧮 Calculadora de Impacto dos Gastos</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <h4 className="font-medium text-purple-700 mb-2">Café Diário</h4>
                  <p className="text-sm text-purple-600 mb-2">R$ 6/dia</p>
                  <p className="text-xl font-bold text-purple-800">R$ 2.190</p>
                  <p className="text-purple-500 text-sm">por ano</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <h4 className="font-medium text-purple-700 mb-2">Streaming</h4>
                  <p className="text-sm text-purple-600 mb-2">R$ 40/mês</p>
                  <p className="text-xl font-bold text-purple-800">R$ 480</p>
                  <p className="text-purple-500 text-sm">por ano</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <h4 className="font-medium text-purple-700 mb-2">Delivery</h4>
                  <p className="text-sm text-purple-600 mb-2">R$ 50/semana</p>
                  <p className="text-xl font-bold text-purple-800">R$ 2.600</p>
                  <p className="text-purple-500 text-sm">por ano</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center border-2 border-purple-400">
                  <h4 className="font-medium text-purple-700 mb-2">Total</h4>
                  <p className="text-sm text-purple-600 mb-2">Economia possível</p>
                  <p className="text-2xl font-bold text-purple-800">R$ 5.270</p>
                  <p className="text-purple-500 text-sm">por ano</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
              <h4 className="font-bold text-gray-800 mb-2">💭 Reflexão: O Custo Real do Dinheiro</h4>
              <p className="text-gray-700 text-sm">
                Quando explicamos ao cliente que R$ 5.270 economizados e investidos a 10% ao ano se transformam em 
                R$ 8.547 em 5 anos, ele começa a entender o verdadeiro custo de oportunidade de seus pequenos gastos.
              </p>
            </div>
          </div>
        )}

        {activeSection === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Map className="w-6 h-6 mr-3 text-green-600" />
              Traçando Novos Caminhos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
                <h3 className="font-bold text-red-800 mb-4">🚨 Situação Atual</h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-red-700">Endividamento</p>
                    <p className="text-red-600 text-sm">Cartão, empréstimos, financiamentos</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-red-700">Sem Reserva</p>
                    <p className="text-red-600 text-sm">Vulnerável a emergências</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-red-700">Gastos Descontrolados</p>
                    <p className="text-red-600 text-sm">Não sabe para onde vai o dinheiro</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-red-700">Sem Objetivos</p>
                    <p className="text-red-600 text-sm">Vive o presente sem planejar</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                <h3 className="font-bold text-yellow-800 mb-4">⚡ Transição</h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-yellow-700">1. Parar Sangria</p>
                    <p className="text-yellow-600 text-sm">Cortar gastos desnecessários</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-yellow-700">2. Renegociar Dívidas</p>
                    <p className="text-yellow-600 text-sm">Buscar melhores condições</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-yellow-700">3. Aumentar Renda</p>
                    <p className="text-yellow-600 text-sm">Trabalhos extras, qualificação</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-yellow-700">4. Criar Disciplina</p>
                    <p className="text-yellow-600 text-sm">Novos hábitos financeiros</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
                <h3 className="font-bold text-green-800 mb-4">🎯 Futuro Desejado</h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-green-700">Liberdade Financeira</p>
                    <p className="text-green-600 text-sm">Sem dívidas, com reservas</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-green-700">Investimentos</p>
                    <p className="text-green-600 text-sm">Dinheiro trabalhando para você</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-green-700">Objetivos Realizados</p>
                    <p className="text-green-600 text-sm">Casa, viagens, aposentadoria</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium text-green-700">Tranquilidade</p>
                    <p className="text-green-600 text-sm">Dormir sem preocupações</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-4">🗺️ Roadmap Financeiro</h3>
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mb-2">1</div>
                    <p className="text-sm font-medium text-center">Emergência<br/>Financeira</p>
                  </div>
                  <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold mb-2">2</div>
                    <p className="text-sm font-medium text-center">Estabilização<br/>e Controle</p>
                  </div>
                  <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-2">3</div>
                    <p className="text-sm font-medium text-center">Construção<br/>de Reservas</p>
                  </div>
                  <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mb-2">4</div>
                    <p className="text-sm font-medium text-center">Investimentos<br/>e Objetivos</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white p-3 rounded border border-red-200">
                    <p className="font-medium text-red-700 mb-2">Duração: 1-3 meses</p>
                    <ul className="text-red-600 space-y-1">
                      <li>• Parar endividamento</li>
                      <li>• Cortar gastos supérfluos</li>
                      <li>• Renegociar dívidas</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded border border-yellow-200">
                    <p className="font-medium text-yellow-700 mb-2">Duração: 6-12 meses</p>
                    <ul className="text-yellow-600 space-y-1">
                      <li>• Quitar dívidas caras</li>
                      <li>• Organizar orçamento</li>
                      <li>• Aumentar renda</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <p className="font-medium text-blue-700 mb-2">Duração: 6-18 meses</p>
                    <ul className="text-blue-600 space-y-1">
                      <li>• Reserva emergência</li>
                      <li>• Fundo oportunidades</li>
                      <li>• Proteção familiar</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="font-medium text-green-700 mb-2">Duração: Contínua</p>
                    <ul className="text-green-600 space-y-1">
                      <li>• Investir para objetivos</li>
                      <li>• Diversificar portfolio</li>
                      <li>• Planejar aposentadoria</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
              <h4 className="font-bold text-purple-800 mb-2">🎯 Metodologia do Consultor</h4>
              <p className="text-purple-700 text-sm">
                Cada cliente está em uma fase diferente deste roadmap. O papel do consultor é identificar onde o cliente está, 
                definir o próximo passo e criar um plano realista e motivador para chegar lá.
              </p>
            </div>
          </div>
        )}

        {activeSection === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <DollarSign className="w-6 h-6 mr-3 text-green-600" />
              Simulador Financeiro Interativo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-4">📊 Parâmetros da Simulação</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Valor Inicial (R$)
                    </label>
                    <input
                      type="number"
                      value={simulacao.valorInicial}
                      onChange={(e) => setSimulacao({...simulacao, valorInicial: Number(e.target.value)})}
                      className="w-full p-3 border border-blue-200 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Aporte Mensal (R$)
                    </label>
                    <input
                      type="number"
                      value={simulacao.aporteMensal}
                      onChange={(e) => setSimulacao({...simulacao, aporteMensal: Number(e.target.value)})}
                      className="w-full p-3 border border-blue-200 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Taxa de Retorno Anual (%)
                    </label>
                    <input
                      type="number"
                      value={simulacao.taxa}
                      onChange={(e) => setSimulacao({...simulacao, taxa: Number(e.target.value)})}
                      className="w-full p-3 border border-blue-200 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Prazo (meses)
                    </label>
                    <input
                      type="number"
                      value={simulacao.prazo}
                      onChange={(e) => setSimulacao({...simulacao, prazo: Number(e.target.value)})}
                      className="w-full p-3 border border-blue-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-green-800 mb-4">💰 Resultados da Simulação</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600 mb-1">Total Aportado</p>
                    <p className="text-2xl font-bold text-green-700">
                      R$ {resultado.totalAportado.toLocaleString('pt-BR', {maximumFractionDigits: 0})}
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600 mb-1">Rendimento</p>
                    <p className="text-2xl font-bold text-green-700">
                      R$ {resultado.rendimento.toLocaleString('pt-BR', {maximumFractionDigits: 0})}
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border-2 border-green-400">
                    <p className="text-sm text-green-600 mb-1">Valor Final</p>
                    <p className="text-3xl font-bold text-green-800">
                      R$ {resultado.valorFinal.toLocaleString('pt-BR', {maximumFractionDigits: 0})}
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600 mb-1">Multiplicação do Investimento</p>
                    <p className="text-xl font-bold text-green-700">
                      {(resultado.valorFinal / resultado.totalAportado).toFixed(1)}x
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-4">📈 Cenários Comparativos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <h4 className="font-medium text-yellow-700 mb-2">Conservador</h4>
                  <p className="text-sm text-yellow-600 mb-2">6% ao ano (Tesouro)</p>
                  <p className="text-xl font-bold text-yellow-800">R$ 41.580</p>
                  <p className="text-yellow-500 text-sm">em 5 anos</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center border-2 border-yellow-400">
                  <h4 className="font-medium text-yellow-700 mb-2">Moderado</h4>
                  <p className="text-sm text-yellow-600 mb-2">10% ao ano (Fundos)</p>
                  <p className="text-xl font-bold text-yellow-800">R$ 47.804</p>
                  <p className="text-yellow-500 text-sm">em 5 anos</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <h4 className="font-medium text-yellow-700 mb-2">Arrojado</h4>
                  <p className="text-sm text-yellow-600 mb-2">15% ao ano (Ações)</p>
                  <p className="text-xl font-bold text-yellow-800">R$ 56.328</p>
                  <p className="text-yellow-500 text-sm">em 5 anos</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
              <h4 className="font-bold text-gray-800 mb-2">🎯 Como Usar Esta Ferramenta</h4>
              <p className="text-gray-700 text-sm">
                Use este simulador para mostrar ao cliente o poder dos juros compostos. Altere os valores conforme 
                a realidade dele e demonstre como pequenas mudanças nos aportes ou no tempo podem gerar grandes diferenças no resultado final.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Modulo4
