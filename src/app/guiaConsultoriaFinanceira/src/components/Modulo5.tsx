
import React, { useState } from 'react'
import {BookOpen, Target, TrendingDown, BarChart3, Award, Calculator, DollarSign, PiggyBank, TrendingUp} from 'lucide-react'

const Modulo5 = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [rendaMensal, setRendaMensal] = useState(5000)
  const [percentualEconomia, setPercentualEconomia] = useState(10)
  const [prazoAnos, setPrazoAnos] = useState(10)

  const tabs = [
    { title: "Melhor Investimento", icon: Target },
    { title: "Capacidade de Economia", icon: TrendingDown },
    { title: "Formas de Investir", icon: BarChart3 },
    { title: "Capacidade de Produção", icon: Award }
  ]

  const tiposInvestimento = [
    {
      categoria: "Educação/Qualificação",
      opcoes: ["MBA", "Curso Técnico", "Idiomas", "Certificações"],
      retorno: "Aumento de 20-50% na renda",
      prazo: "1-3 anos",
      risco: "Baixo",
      cor: "bg-green-100 border-green-300",
      exemplo: "MBA custando R$ 30.000 pode gerar aumento salarial de R$ 2.000/mês"
    },
    {
      categoria: "Imóveis",
      opcoes: ["Casa própria", "Imóvel para renda", "Terrenos", "Fundos Imobiliários"],
      retorno: "6-12% ao ano + valorização",
      prazo: "5-20 anos",
      risco: "Médio",
      cor: "bg-blue-100 border-blue-300",
      exemplo: "Apartamento de R$ 300.000 gerando R$ 2.000/mês de aluguel"
    },
    {
      categoria: "Negócio Próprio",
      opcoes: ["Franquia", "E-commerce", "Prestação de serviços", "Consultoria"],
      retorno: "Variável (pode ser alto)",
      prazo: "2-5 anos",
      risco: "Alto",
      cor: "bg-orange-100 border-orange-300",
      exemplo: "Franquia de R$ 80.000 com potencial de R$ 10.000/mês"
    },
    {
      categoria: "Investimentos Financeiros",
      opcoes: ["Tesouro Direto", "Fundos", "Ações", "Previdência"],
      retorno: "6-15% ao ano",
      prazo: "1-30 anos",
      risco: "Baixo a Alto",
      cor: "bg-purple-100 border-purple-300",
      exemplo: "R$ 1.000/mês por 20 anos = R$ 735.000 a 10% a.a."
    }
  ]

  const niveisEconomia = [
    { 
      nivel: "Iniciante", 
      percentual: "5-10%", 
      exemplo: "R$ 250-500", 
      cor: "bg-yellow-100",
      estrategias: ["Cortar supérfluos", "Trocar marcas", "Cozinhar mais", "Cancelar assinaturas não usadas"] 
    },
    { 
      nivel: "Intermediário", 
      percentual: "15-20%", 
      exemplo: "R$ 750-1000", 
      cor: "bg-orange-100",
      estrategias: ["Renegociar contratos", "Transporte público", "Planos mais baratos", "Energia solar"] 
    },
    { 
      nivel: "Avançado", 
      percentual: "25-30%", 
      exemplo: "R$ 1250-1500", 
      cor: "bg-green-100",
      estrategias: ["Mudança de casa", "Venda de bens", "Renda extra", "Lifestyle minimalista"] 
    }
  ]

  const formasInvestir = [
    {
      tipo: "Conservador",
      perfil: "Baixo risco, liquidez",
      opcoes: ["Poupança", "CDB", "Tesouro SELIC"],
      rentabilidade: "6-8% a.a.",
      cor: "bg-green-50 border-green-200"
    },
    {
      tipo: "Moderado",
      perfil: "Risco médio, crescimento",
      opcoes: ["Tesouro IPCA", "Fundos DI", "LCI/LCA"],
      rentabilidade: "8-12% a.a.",
      cor: "bg-blue-50 border-blue-200"
    },
    {
      tipo: "Arrojado",
      perfil: "Alto risco, alto retorno",
      opcoes: ["Ações", "Fundos de Ações", "REITs"],
      rentabilidade: "12-20% a.a.",
      cor: "bg-purple-50 border-purple-200"
    }
  ]

  const calcularInvestimento = () => {
    const valorMensal = (rendaMensal * percentualEconomia) / 100
    const meses = prazoAnos * 12
    const taxaMensal = 0.008 // 10% ao ano
    const montante = valorMensal * (((1 + taxaMensal) ** meses - 1) / taxaMensal)
    return { valorMensal, montante }
  }

  const { valorMensal, montante } = calcularInvestimento()

  const renderTab = () => {
    switch(activeTab) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Qual é o Melhor Investimento para o Meu Cenário?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tiposInvestimento.map((investimento, index) => (
                <div key={index} className={`p-6 rounded-xl border-2 ${investimento.cor}`}>
                  <h4 className="text-xl font-semibold mb-4">{investimento.categoria}</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Opções:</span>
                      <ul className="list-disc list-inside text-sm mt-1">
                        {investimento.opcoes.map((opcao, i) => (
                          <li key={i}>{opcao}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Retorno:</span>
                        <p className="text-green-600">{investimento.retorno}</p>
                      </div>
                      <div>
                        <span className="font-medium">Prazo:</span>
                        <p className="text-blue-600">{investimento.prazo}</p>
                      </div>
                      <div>
                        <span className="font-medium">Risco:</span>
                        <p className="text-orange-600">{investimento.risco}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg">
                      <span className="font-medium text-sm">Exemplo:</span>
                      <p className="text-sm text-gray-700">{investimento.exemplo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Matriz de Decisão de Investimento
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white">
                      <th className="p-3 text-left">Critério</th>
                      <th className="p-3 text-center">Educação</th>
                      <th className="p-3 text-center">Imóveis</th>
                      <th className="p-3 text-center">Negócio</th>
                      <th className="p-3 text-center">Financeiro</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 font-medium">Liquidez</td>
                      <td className="p-3 text-center">Baixa</td>
                      <td className="p-3 text-center">Baixa</td>
                      <td className="p-3 text-center">Média</td>
                      <td className="p-3 text-center">Alta</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium">Valor Inicial</td>
                      <td className="p-3 text-center">R$ 10-50k</td>
                      <td className="p-3 text-center">R$ 200k+</td>
                      <td className="p-3 text-center">R$ 20-100k</td>
                      <td className="p-3 text-center">R$ 100+</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Tempo de Retorno</td>
                      <td className="p-3 text-center">1-3 anos</td>
                      <td className="p-3 text-center">5-10 anos</td>
                      <td className="p-3 text-center">2-5 anos</td>
                      <td className="p-3 text-center">1-30 anos</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Quanto Estou Disposto a Economizar?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {niveisEconomia.map((nivel, index) => (
                <div key={index} className={`p-6 rounded-xl ${nivel.cor} border-2`}>
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold">{nivel.nivel}</h4>
                    <div className="text-2xl font-bold text-blue-600 mt-2">{nivel.percentual}</div>
                    <div className="text-sm text-gray-600">da renda</div>
                    <div className="text-lg font-semibold mt-1">{nivel.exemplo}</div>
                  </div>
                  
                  <div>
                    <span className="font-medium mb-2 block">Estratégias:</span>
                    <ul className="space-y-1">
                      {nivel.estrategias.map((estrategia, i) => (
                        <li key={i} className="text-sm flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {estrategia}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <PiggyBank className="w-5 h-5 mr-2" />
                Calculadora de Economia
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Renda Mensal (R$)</label>
                  <input
                    type="number"
                    value={rendaMensal}
                    onChange={(e) => setRendaMensal(Number(e.target.value))}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">% de Economia</label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={percentualEconomia}
                    onChange={(e) => setPercentualEconomia(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-lg font-bold text-blue-600">{percentualEconomia}%</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Prazo (anos)</label>
                  <input
                    type="number"
                    value={prazoAnos}
                    onChange={(e) => setPrazoAnos(Number(e.target.value))}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-800">Economia Mensal</h5>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-800">Total em {prazoAnos} anos</h5>
                  <div className="text-2xl font-bold text-blue-600">
                    R$ {montante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Formas de Investir</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formasInvestir.map((forma, index) => (
                <div key={index} className={`p-6 rounded-xl border-2 ${forma.cor}`}>
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold">{forma.tipo}</h4>
                    <p className="text-sm text-gray-600 mt-1">{forma.perfil}</p>
                    <div className="text-lg font-bold text-green-600 mt-2">{forma.rentabilidade}</div>
                  </div>
                  
                  <div>
                    <span className="font-medium mb-2 block">Opções:</span>
                    <ul className="space-y-1">
                      {forma.opcoes.map((opcao, i) => (
                        <li key={i} className="text-sm flex items-center">
                          <DollarSign className="w-3 h-3 mr-2 text-green-500" />
                          {opcao}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold mb-4">Estratégia de Diversificação</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-green-600 mb-2">Reserva de Emergência</h5>
                  <p className="text-sm">6-12 meses de gastos em investimentos líquidos e seguros</p>
                  <div className="mt-2 text-lg font-bold">30% do total</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-600 mb-2">Crescimento</h5>
                  <p className="text-sm">Investimentos com maior rentabilidade e prazo médio</p>
                  <div className="mt-2 text-lg font-bold">50% do total</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-purple-600 mb-2">Especulação</h5>
                  <p className="text-sm">Alto risco e alto retorno para objetivos específicos</p>
                  <div className="mt-2 text-lg font-bold">20% do total</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Diminuição da Capacidade de Produção</h3>
            
            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                <TrendingDown className="w-5 h-5 mr-2" />
                Fatores que Reduzem a Capacidade Produtiva
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-3">Fatores Pessoais</h5>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      Idade avançada
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      Problemas de saúde
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      Falta de qualificação
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      Desatualização profissional
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3">Fatores Econômicos</h5>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      Recessão econômica
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      Automação do trabalho
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      Mudanças no mercado
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      Inflação descontrolada
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Estratégias de Proteção
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-3">Proteção Financeira</h5>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Reserva de emergência robusta
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Diversificação de renda
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Investimentos passivos
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Seguros adequados
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3">Proteção Profissional</h5>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Educação continuada
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Network profissional
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Múltiplas habilidades
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Adaptabilidade
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">Planejamento por Faixa Etária</h4>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-600">20-30 anos: Construção</h5>
                  <p className="text-sm mt-1">Foco em educação, carreira e formação de reservas</p>
                  <div className="text-xs text-gray-600 mt-1">70% crescimento, 20% reserva, 10% especulação</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-green-600">30-50 anos: Acumulação</h5>
                  <p className="text-sm mt-1">Maximizar investimentos e diversificar fontes de renda</p>
                  <div className="text-xs text-gray-600 mt-1">60% crescimento, 30% reserva, 10% especulação</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-orange-600">50+ anos: Preservação</h5>
                  <p className="text-sm mt-1">Proteger patrimônio e garantir renda passiva</p>
                  <div className="text-xs text-gray-600 mt-1">40% crescimento, 50% reserva, 10% especulação</div>
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
          Estratégias de Investimento
        </h2>
        <p className="text-lg text-gray-600">
          Direcionando o cliente para estratégias de hoje com impacto a longo prazo
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

      {/* Conclusão do módulo */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-3">Lembre-se:</h3>
        <p className="text-lg">
          O consultor financeiro é o caminho mais consciente para alcançar o sucesso financeiro. 
          Cada decisão de investimento deve considerar o perfil, objetivos e momento de vida do cliente.
        </p>
      </div>
    </div>
  )
}

export default Modulo5
