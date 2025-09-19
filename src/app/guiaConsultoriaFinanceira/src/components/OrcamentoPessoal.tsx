
import React, { useState } from 'react'
import {Calculator, PieChart, Target, TrendingUp, DollarSign, Calendar, CheckCircle, AlertCircle} from 'lucide-react'

const OrcamentoPessoal = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [orcamento, setOrcamento] = useState({
    renda: 5000,
    habitacao: 1500,
    alimentacao: 800,
    transporte: 400,
    saude: 300,
    educacao: 200,
    lazer: 300,
    vestuario: 200,
    outros: 200,
    reserva: 500,
    investimentos: 600
  })

  const tabs = [
    { title: "Planejamento", icon: Calculator },
    { title: "Categorias", icon: PieChart },
    { title: "Metas", icon: Target },
    { title: "Métodos", icon: TrendingUp }
  ]

  const totalGastos = orcamento.habitacao + orcamento.alimentacao + orcamento.transporte + 
                     orcamento.saude + orcamento.educacao + orcamento.lazer + 
                     orcamento.vestuario + orcamento.outros + orcamento.reserva + orcamento.investimentos

  const saldo = orcamento.renda - totalGastos

  const categorias = [
    { nome: "Habitação", valor: orcamento.habitacao, cor: "bg-blue-500", percentual: 30 },
    { nome: "Alimentação", valor: orcamento.alimentacao, cor: "bg-green-500", percentual: 15 },
    { nome: "Transporte", valor: orcamento.transporte, cor: "bg-yellow-500", percentual: 10 },
    { nome: "Saúde", valor: orcamento.saude, cor: "bg-red-500", percentual: 8 },
    { nome: "Educação", valor: orcamento.educacao, cor: "bg-purple-500", percentual: 5 },
    { nome: "Lazer", valor: orcamento.lazer, cor: "bg-pink-500", percentual: 8 },
    { nome: "Vestuário", valor: orcamento.vestuario, cor: "bg-indigo-500", percentual: 5 },
    { nome: "Outros", valor: orcamento.outros, cor: "bg-gray-500", percentual: 4 },
    { nome: "Reserva", valor: orcamento.reserva, cor: "bg-orange-500", percentual: 10 },
    { nome: "Investimentos", valor: orcamento.investimentos, cor: "bg-teal-500", percentual: 15 }
  ]

  const metodos = [
    {
      nome: "Método 50/30/20",
      descricao: "50% necessidades, 30% desejos, 20% poupança",
      vantagens: ["Simples de aplicar", "Equilibrado", "Flexível"],
      exemplo: {
        necessidades: orcamento.renda * 0.5,
        desejos: orcamento.renda * 0.3,
        poupanca: orcamento.renda * 0.2
      }
    },
    {
      nome: "Orçamento Base Zero",
      descricao: "Toda receita deve ter destino específico",
      vantagens: ["Controle total", "Consciência de gastos", "Eficiente"],
      exemplo: "Receita - Gastos = 0"
    },
    {
      nome: "Envelope",
      descricao: "Separar dinheiro em categorias físicas ou digitais",
      vantagens: ["Visual", "Limite claro", "Disciplina"],
      exemplo: "Um envelope para cada categoria de gasto"
    }
  ]

  const renderTab = () => {
    switch(activeTab) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Planejamento do Orçamento</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-xl">
                  <label className="block text-sm font-medium mb-2">Renda Mensal Líquida</label>
                  <input
                    type="number"
                    value={orcamento.renda}
                    onChange={(e) => setOrcamento({...orcamento, renda: Number(e.target.value)})}
                    className="w-full p-3 border rounded-lg text-lg font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Habitação (30%)</label>
                    <input
                      type="number"
                      value={orcamento.habitacao}
                      onChange={(e) => setOrcamento({...orcamento, habitacao: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sugerido: R$ {(orcamento.renda * 0.3).toLocaleString('pt-BR')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Alimentação (15%)</label>
                    <input
                      type="number"
                      value={orcamento.alimentacao}
                      onChange={(e) => setOrcamento({...orcamento, alimentacao: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sugerido: R$ {(orcamento.renda * 0.15).toLocaleString('pt-BR')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Transporte (10%)</label>
                    <input
                      type="number"
                      value={orcamento.transporte}
                      onChange={(e) => setOrcamento({...orcamento, transporte: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sugerido: R$ {(orcamento.renda * 0.1).toLocaleString('pt-BR')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Saúde (8%)</label>
                    <input
                      type="number"
                      value={orcamento.saude}
                      onChange={(e) => setOrcamento({...orcamento, saude: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sugerido: R$ {(orcamento.renda * 0.08).toLocaleString('pt-BR')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Educação (5%)</label>
                    <input
                      type="number"
                      value={orcamento.educacao}
                      onChange={(e) => setOrcamento({...orcamento, educacao: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sugerido: R$ {(orcamento.renda * 0.05).toLocaleString('pt-BR')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Lazer (8%)</label>
                    <input
                      type="number"
                      value={orcamento.lazer}
                      onChange={(e) => setOrcamento({...orcamento, lazer: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sugerido: R$ {(orcamento.renda * 0.08).toLocaleString('pt-BR')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Vestuário (5%)</label>
                    <input
                      type="number"
                      value={orcamento.vestuario}
                      onChange={(e) => setOrcamento({...orcamento, vestuario: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sugerido: R$ {(orcamento.renda * 0.05).toLocaleString('pt-BR')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Outros (4%)</label>
                    <input
                      type="number"
                      value={orcamento.outros}
                      onChange={(e) => setOrcamento({...orcamento, outros: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sugerido: R$ {(orcamento.renda * 0.04).toLocaleString('pt-BR')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Reserva (10%)</label>
                    <input
                      type="number"
                      value={orcamento.reserva}
                      onChange={(e) => setOrcamento({...orcamento, reserva: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sugerido: R$ {(orcamento.renda * 0.1).toLocaleString('pt-BR')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Investimentos (15%)</label>
                    <input
                      type="number"
                      value={orcamento.investimentos}
                      onChange={(e) => setOrcamento({...orcamento, investimentos: Number(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sugerido: R$ {(orcamento.renda * 0.15).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className={`p-6 rounded-xl ${saldo >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-2`}>
                  <h4 className="text-lg font-semibold mb-4">Resumo do Orçamento</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Renda Total:</span>
                      <span className="font-semibold">R$ {orcamento.renda.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Planejado:</span>
                      <span className="font-semibold">R$ {totalGastos.toLocaleString('pt-BR')}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg">
                      <span>Saldo:</span>
                      <span className={`font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {saldo.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {saldo < 0 && (
                    <div className="mt-4 p-3 bg-red-100 rounded-lg">
                      <p className="text-red-800 text-sm">
                        ⚠️ Seu orçamento está estourando! Revise os valores para equilibrar as contas.
                      </p>
                    </div>
                  )}

                  {saldo >= 0 && (
                    <div className="mt-4 p-3 bg-green-100 rounded-lg">
                      <p className="text-green-800 text-sm">
                        ✅ Parabéns! Seu orçamento está equilibrado com sobra de R$ {saldo.toLocaleString('pt-BR')}.
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold mb-4">Distribuição Percentual</h4>
                  <div className="space-y-2">
                    {categorias.map((categoria, index) => {
                      const percentualAtual = orcamento.renda > 0 ? (categoria.valor / orcamento.renda) * 100 : 0
                      return (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${categoria.cor} mr-2`}></div>
                            <span>{categoria.nome}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={percentualAtual > categoria.percentual ? 'text-red-600' : 'text-green-600'}>
                              {percentualAtual.toFixed(1)}%
                            </span>
                            <span className="text-gray-500">({categoria.percentual}%)</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Categorias de Gastos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorias.map((categoria, index) => {
                const percentualAtual = orcamento.renda > 0 ? (categoria.valor / orcamento.renda) * 100 : 0
                const status = percentualAtual <= categoria.percentual ? 'ok' : 'alto'
                
                return (
                  <div key={index} className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${categoria.cor} mr-3`}></div>
                        <h4 className="font-semibold">{categoria.nome}</h4>
                      </div>
                      {status === 'ok' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">
                        R$ {categoria.valor.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {percentualAtual.toFixed(1)}% da renda
                      </div>
                      <div className="text-xs text-gray-500">
                        Recomendado: {categoria.percentual}% (R$ {(orcamento.renda * categoria.percentual / 100).toLocaleString('pt-BR')})
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div 
                          className={`h-2 rounded-full ${status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, (percentualAtual / categoria.percentual) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold mb-4">Dicas por Categoria</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-blue-800 mb-3">Gastos Essenciais</h5>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Habitação:</strong> Inclui aluguel, financiamento, condomínio, IPTU</li>
                    <li><strong>Alimentação:</strong> Supermercado, feira, refeições básicas</li>
                    <li><strong>Transporte:</strong> Combustível, transporte público, manutenção</li>
                    <li><strong>Saúde:</strong> Plano de saúde, medicamentos, consultas</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-green-800 mb-3">Crescimento Pessoal</h5>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Educação:</strong> Cursos, livros, capacitação profissional</li>
                    <li><strong>Reserva:</strong> Emergências, imprevistos, segurança</li>
                    <li><strong>Investimentos:</strong> Crescimento patrimonial, aposentadoria</li>
                    <li><strong>Lazer:</strong> Entretenimento, hobbies, qualidade de vida</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Metas Financeiras</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                <h4 className="text-lg font-semibold text-green-800 mb-4">Curto Prazo (1-12 meses)</h4>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Reserva de Emergência</h5>
                    <div className="text-2xl font-bold text-green-600">
                      R$ {(totalGastos * 6).toLocaleString('pt-BR')}
                    </div>
                    <p className="text-sm text-gray-600">6 meses de gastos</p>
                    <div className="mt-2 text-xs">
                      Economizando R$ {orcamento.reserva.toLocaleString('pt-BR')}/mês = {orcamento.reserva > 0 ? Math.ceil((totalGastos * 6) / orcamento.reserva) : '∞'} meses
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Viagem</h5>
                    <div className="text-lg font-bold text-green-600">R$ 5.000</div>
                    <p className="text-sm text-gray-600">Férias dos sonhos</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Curso</h5>
                    <div className="text-lg font-bold text-green-600">R$ 2.000</div>
                    <p className="text-sm text-gray-600">Qualificação profissional</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">Médio Prazo (1-5 anos)</h4>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Entrada do Imóvel</h5>
                    <div className="text-2xl font-bold text-blue-600">R$ 50.000</div>
                    <p className="text-sm text-gray-600">20% de R$ 250.000</p>
                    <div className="mt-2 text-xs">
                      Economizando R$ {orcamento.investimentos.toLocaleString('pt-BR')}/mês = {orcamento.investimentos > 0 ? Math.ceil(50000 / orcamento.investimentos) : '∞'} meses
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Carro Novo</h5>
                    <div className="text-lg font-bold text-blue-600">R$ 30.000</div>
                    <p className="text-sm text-gray-600">Upgrade de veículo</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Negócio Próprio</h5>
                    <div className="text-lg font-bold text-blue-600">R$ 20.000</div>
                    <p className="text-sm text-gray-600">Capital inicial</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
                <h4 className="text-lg font-semibold text-purple-800 mb-4">Longo Prazo (5+ anos)</h4>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Aposentadoria</h5>
                    <div className="text-2xl font-bold text-purple-600">R$ 1.000.000</div>
                    <p className="text-sm text-gray-600">Independência financeira</p>
                    <div className="mt-2 text-xs">
                      R$ {orcamento.investimentos.toLocaleString('pt-BR')}/mês por 30 anos a 10% a.a.
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Educação dos Filhos</h5>
                    <div className="text-lg font-bold text-purple-600">R$ 200.000</div>
                    <p className="text-sm text-gray-600">Universidade privada</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Casa dos Sonhos</h5>
                    <div className="text-lg font-bold text-purple-600">R$ 500.000</div>
                    <p className="text-sm text-gray-600">Imóvel próprio</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold mb-4">Estratégias para Atingir Metas</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-green-800 mb-3">Técnicas de Economia</h5>
                  <ul className="space-y-2 text-sm">
                    <li>🎯 <strong>Pague-se primeiro:</strong> Separe a poupança antes dos gastos</li>
                    <li>🏦 <strong>Automatize:</strong> Débito automático para investimentos</li>
                    <li>📱 <strong>Apps de controle:</strong> Monitore gastos em tempo real</li>
                    <li>🛒 <strong>Lista de compras:</strong> Evite compras por impulso</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-blue-800 mb-3">Aumento de Renda</h5>
                  <ul className="space-y-2 text-sm">
                    <li>📚 <strong>Qualificação:</strong> Cursos para promoção</li>
                    <li>💼 <strong>Freelances:</strong> Trabalhos extras</li>
                    <li>🏪 <strong>Negócio paralelo:</strong> Renda complementar</li>
                    <li>📈 <strong>Investimentos:</strong> Renda passiva crescente</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Métodos de Orçamento</h3>
            
            <div className="space-y-6">
              {metodos.map((metodo, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:shadow-lg transition-shadow">
                  <h4 className="text-xl font-semibold mb-3">{metodo.nome}</h4>
                  <p className="text-gray-600 mb-4">{metodo.descricao}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold mb-2">Vantagens:</h5>
                      <ul className="space-y-1">
                        {metodo.vantagens.map((vantagem, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            {vantagem}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold mb-2">Aplicação na sua renda:</h5>
                      {metodo.exemplo && typeof metodo.exemplo === 'object' ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Necessidades (50%):</span>
                            <span className="font-semibold">R$ {metodo.exemplo.necessidades.toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Desejos (30%):</span>
                            <span className="font-semibold">R$ {metodo.exemplo.desejos.toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Poupança (20%):</span>
                            <span className="font-semibold">R$ {metodo.exemplo.poupanca.toLocaleString('pt-BR')}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">{metodo.exemplo}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold mb-4">Ferramentas Recomendadas</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Apps Mobile</h5>
                  <ul className="text-sm space-y-1">
                    <li>• GuiaBolso</li>
                    <li>• Organizze</li>
                    <li>• Mobills</li>
                    <li>• Minhas Economias</li>
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Planilhas</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Excel/Google Sheets</li>
                    <li>• Templates prontos</li>
                    <li>• Controle personalizado</li>
                    <li>• Gráficos automáticos</li>
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Bancos Digitais</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Nubank</li>
                    <li>• Inter</li>
                    <li>• C6 Bank</li>
                    <li>• Categorização automática</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">💡 Dica de Ouro:</h4>
              <p>
                O melhor método de orçamento é aquele que você consegue seguir consistentemente. 
                Comece simples e vá evoluindo conforme ganha experiência e disciplina.
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
          Orçamento Pessoal
        </h2>
        <p className="text-lg text-gray-600">
          Domine a arte de planejar, controlar e otimizar suas finanças pessoais
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

export default OrcamentoPessoal
