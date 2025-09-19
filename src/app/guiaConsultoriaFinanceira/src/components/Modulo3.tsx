
/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react'
import {FileText, Building2, Calculator, AlertTriangle, CheckCircle, Users, BookOpen, BarChart3} from 'lucide-react'

const Modulo3 = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { title: "Funcionamento da Contabilidade", icon: BookOpen },
    { title: "Departamentos Contábeis", icon: Users },
    { title: "Enquadramento Empresarial", icon: Building2 },
    { title: "Regime Tributário", icon: Calculator },
    { title: "Análise Contábil", icon: BarChart3 },
    { title: "Riscos e Impactos", icon: AlertTriangle }
  ]

  const enquadramentos = [
    {
      tipo: "MEI",
      nome: "Microempreendedor Individual",
      faturamento: "Até R$ 81 mil/ano",
      caracteristicas: [
        "Formalizar trabalhadores autônomos",
        "Contribui para o INSS",
        "Até 1 funcionário",
        "Tributo fixo R$ 51,95 + R$ 5,00 (serviços) ou R$ 1,00 (comércio)",
        "Não exige contabilidade"
      ],
      cor: "green"
    },
    {
      tipo: "ME",
      nome: "Microempresa",
      faturamento: "Até R$ 360 mil/ano",
      caracteristicas: [
        "Permite sócios",
        "Exige controle de faturamento",
        "Registro correto do fluxo de caixa",
        "Simples Nacional disponível"
      ],
      cor: "blue"
    },
    {
      tipo: "EI",
      nome: "Empresário Individual",
      faturamento: "Até R$ 360 mil/ano",
      caracteristicas: [
        "Não pode ter sócio",
        "Patrimônio pessoal e empresarial unificado",
        "Exige controle de faturamento",
        "Exige contabilidade"
      ],
      cor: "purple"
    },
    {
      tipo: "EIRELI",
      nome: "Empresa Individual de Responsabilidade Limitada",
      faturamento: "Até R$ 4,8 milhões/ano",
      caracteristicas: [
        "Não pode ter sócio",
        "Patrimônio pessoal protegido",
        "Capital mínimo: 100x salário mínimo",
        "Exige contabilidade",
        "Simples, Presumido ou Real"
      ],
      cor: "orange"
    },
    {
      tipo: "EPP",
      nome: "Empresa de Pequeno Porte",
      faturamento: "Até R$ 4,8 milhões/ano",
      caracteristicas: [
        "Permite sócios",
        "Exige contabilidade",
        "Vista pelo fisco como 'em crescimento'",
        "Benefícios fiscais disponíveis"
      ],
      cor: "indigo"
    },
    {
      tipo: "LTDA",
      nome: "Sociedade Limitada",
      faturamento: "Sem limite",
      caracteristicas: [
        "Até 7 sócios",
        "Patrimônio pessoal protegido",
        "Responsabilidade conforme cota",
        "Exige contabilidade completa"
      ],
      cor: "red"
    }
  ]

  const regimesTributarios = [
    {
      nome: "Simples Nacional",
      descricao: "Regime simplificado para micro e pequenas empresas",
      limites: "Faturamento até R$ 4,8 milhões/ano",
      vantagens: [
        "Unifica vários impostos em uma guia",
        "Alíquotas reduzidas",
        "Menos burocracia",
        "Facilita a gestão tributária"
      ],
      desvantagens: [
        "Limitações de faturamento",
        "Restrições de atividades",
        "Não permite aproveitamento de créditos"
      ],
      cor: "green"
    },
    {
      nome: "Lucro Presumido",
      descricao: "Presunção de lucro baseada no faturamento",
      limites: "Faturamento até R$ 78 milhões/ano",
      vantagens: [
        "Simplicidade no cálculo",
        "Menor burocracia que Lucro Real",
        "Adequado para margens altas"
      ],
      desvantagens: [
        "Pode ser mais caro que Simples",
        "Tributação sobre presunção, não lucro real",
        "Limitações para alguns setores"
      ],
      cor: "blue"
    },
    {
      nome: "Lucro Real",
      descricao: "Tributação sobre o lucro efetivo da empresa",
      limites: "Sem limite de faturamento",
      vantagens: [
        "Tributação sobre lucro real",
        "Aproveitamento de créditos",
        "Dedução de despesas",
        "Compensação de prejuízos"
      ],
      desvantagens: [
        "Maior complexidade",
        "Mais burocracia",
        "Exige controles rigorosos"
      ],
      cor: "purple"
    }
  ]

  const renderTab = () => {
    switch(activeTab) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Entendendo o Funcionamento da Contabilidade</h3>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">🔗 A CONTABILIDADE COMO ELO</h4>
              <p className="text-gray-700">
                A contabilidade é o elo entre empresa e governo. Muitos empresários vivem o tabu de que 
                pagar imposto quebra empresas, mas na verdade, <strong>não pagar o imposto corretamente</strong> é 
                que vem quebrando muitas empresas.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-red-800 mb-4">❌ PROBLEMAS DA SONEGAÇÃO</h4>
                
                <div className="space-y-4">
                  <div className="bg-red-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">Registros Incompletos</h5>
                    <p className="text-sm text-gray-700">
                      Empresários omitem recursos nos lançamentos contábeis, prejudicando 
                      todo o controle e registro das informações.
                    </p>
                  </div>

                  <div className="bg-red-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">Impactos Diretos</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Dificuldade para conseguir empréstimos</li>
                      <li>• Problemas na venda da empresa</li>
                      <li>• Impossibilidade de implementar franquias</li>
                      <li>• Perda de benefícios fiscais</li>
                    </ul>
                  </div>

                  <div className="bg-red-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">Consequências Legais</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Multas e juros da Receita Federal</li>
                      <li>• Bloqueio de contas e bens</li>
                      <li>• Impossibilidade de parcelamentos</li>
                      <li>• Restrições comerciais</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-800 mb-4">✅ BENEFÍCIOS DA REGULARIDADE</h4>
                
                <div className="space-y-4">
                  <div className="bg-green-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Incentivos Fiscais</h5>
                    <p className="text-sm text-gray-700">
                      O governo oferece diversos benefícios fiscais para reduzir impostos, 
                      mas poucos sabem da existência ou não conseguem aplicar devido à 
                      falha de contabilização.
                    </p>
                  </div>

                  <div className="bg-green-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Acesso a Crédito</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Facilidade para empréstimos bancários</li>
                      <li>• Melhores taxas de juros</li>
                      <li>• Linhas de crédito especiais</li>
                      <li>• Programas governamentais</li>
                    </ul>
                  </div>

                  <div className="bg-green-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Valorização da Empresa</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Maior valor na venda</li>
                      <li>• Possibilidade de franquias</li>
                      <li>• Atração de investidores</li>
                      <li>• Credibilidade no mercado</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-blue-800 mb-4">📋 REGRAS PARA REGISTRO CONTÁBIL CORRETO</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-blue-700 mb-3">📅 ROTINA DIÁRIA</h5>
                  <div className="space-y-2">
                    {[
                      "Emitir notas fiscais diariamente",
                      "Não emitir notas fora do mês",
                      "Declarar TODAS as entradas (cartão, dinheiro, PIX, etc.)",
                      "Solicitar todas as notas fiscais de entrada",
                      "Emitir notas dentro do mês correto"
                    ].map((regra, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{regra}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-blue-700 mb-3">🏦 CONTROLES BANCÁRIOS</h5>
                  <div className="space-y-2">
                    {[
                      "Utilizar conta bancária exclusiva para empresa",
                      "Transferir pró-labore formalmente",
                      "Fazer pagamentos pela conta empresarial",
                      "Registrar todas as movimentações",
                      "Conciliar extratos mensalmente"
                    ].map((regra, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{regra}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">💡 DICA DO CONSULTOR</h4>
              <p className="mb-3">
                Ao pegar um cliente, sempre analise se há algum incentivo fiscal para aquele ramo 
                e se certifique com um contador quanto à sua aplicabilidade.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">Verifique:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Benefícios do setor</li>
                    <li>• Incentivos regionais</li>
                    <li>• Programas especiais</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Analise:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Enquadramento atual</li>
                    <li>• Regime tributário</li>
                    <li>• Oportunidades perdidas</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Implemente:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Mudanças necessárias</li>
                    <li>• Controles adequados</li>
                    <li>• Acompanhamento mensal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Conhecendo os Departamentos de uma Contabilidade</h3>
            
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-purple-800 mb-3">🏢 ESTRUTURA ORGANIZACIONAL</h4>
              <p className="text-gray-700">
                Para dialogar efetivamente com a contabilidade, o consultor precisa entender 
                como cada departamento funciona e suas responsabilidades específicas.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Calculator className="w-8 h-8 text-blue-600 mr-3" />
                  <h4 className="text-lg font-bold text-blue-800">Departamento Fiscal</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">Responsabilidades:</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Receber todas as notas fiscais</li>
                      <li>• Realizar escrituração das notas</li>
                      <li>• Apuração dos impostos mensais</li>
                      <li>• Apuração dos impostos anuais</li>
                      <li>• Declarações obrigatórias</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">Documentos que Manuseia:</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Notas fiscais de entrada</li>
                      <li>• Notas fiscais de saída</li>
                      <li>• Guias de impostos</li>
                      <li>• Declarações fiscais</li>
                    </ul>
                  </div>

                  <div className="bg-blue-100 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      💡 É o departamento que mais impacta diretamente nos custos da empresa
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-8 h-8 text-green-600 mr-3" />
                  <h4 className="text-lg font-bold text-green-800">Departamento Contábil</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Responsabilidades:</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Verificação das movimentações financeiras</li>
                      <li>• Análise das movimentações do negócio</li>
                      <li>• Elaboração de demonstrativos</li>
                      <li>• Conciliações bancárias</li>
                      <li>• Relatórios gerenciais</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Relatórios que Produz:</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Balanço Patrimonial</li>
                      <li>• DRE (Demonstrativo de Resultado)</li>
                      <li>• Fluxo de Caixa</li>
                      <li>• Análises gerenciais</li>
                    </ul>
                  </div>

                  <div className="bg-green-100 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      💡 É o departamento que fornece informações para tomada de decisão
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-8 h-8 text-orange-600 mr-3" />
                  <h4 className="text-lg font-bold text-orange-800">Departamento Pessoal</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-700 mb-2">Responsabilidades:</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Admissão e demissão de empregados</li>
                      <li>• Cálculo de pró-labore</li>
                      <li>• Contratos de experiência</li>
                      <li>• Aviso prévio de trabalho</li>
                      <li>• FGTS e rescisões</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-700 mb-2">Processos que Gerencia:</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 13º salário</li>
                      <li>• Vale transporte</li>
                      <li>• Folha de pagamento</li>
                      <li>• Férias e benefícios</li>
                    </ul>
                  </div>

                  <div className="bg-orange-100 p-3 rounded-lg">
                    <p className="text-sm font-medium text-orange-800">
                      💡 É o departamento que mais impacta nos custos fixos mensais
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">🔄 FLUXO DE INFORMAÇÕES ENTRE DEPARTAMENTOS</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-lg mb-3">
                    <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h5 className="font-semibold text-blue-800">FISCAL</h5>
                    <p className="text-sm text-gray-600">Recebe documentos</p>
                  </div>
                  <div className="text-sm text-gray-700">
                    Notas fiscais → Escrituração → Impostos
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-lg mb-3">
                    <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h5 className="font-semibold text-green-800">CONTÁBIL</h5>
                    <p className="text-sm text-gray-600">Processa informações</p>
                  </div>
                  <div className="text-sm text-gray-700">
                    Movimentações → Análises → Relatórios
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 p-4 rounded-lg mb-3">
                    <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h5 className="font-semibold text-orange-800">PESSOAL</h5>
                    <p className="text-sm text-gray-600">Gerencia pessoas</p>
                  </div>
                  <div className="text-sm text-gray-700">
                    Funcionários → Folha → Obrigações
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">🎯 COMO O CONSULTOR DEVE INTERAGIR</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div>
                  <h5 className="font-semibold mb-2">Com o Fiscal:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Questione sobre benefícios fiscais</li>
                    <li>• Verifique regularidade das declarações</li>
                    <li>• Analise carga tributária atual</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Com o Contábil:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Solicite relatórios gerenciais</li>
                    <li>• Peça análises de rentabilidade</li>
                    <li>• Discuta indicadores financeiros</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Com o Pessoal:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Analise custos com pessoal</li>
                    <li>• Verifique produtividade</li>
                    <li>• Discuta otimizações</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Enquadramento Empresarial</h3>
            
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-orange-800 mb-3">🏢 TIPOS DE ENQUADRAMENTO</h4>
              <p className="text-gray-700">
                O enquadramento empresarial serve para classificar as empresas de acordo com o faturamento. 
                Você já deve ter visto siglas no final do nome das empresas - cada uma tem um significado específico!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enquadramentos.map((item, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className={`bg-${item.cor}-100 p-3 rounded-lg mr-4`}>
                      <Building2 className={`w-6 h-6 text-${item.cor}-600`} />
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold text-${item.cor}-800`}>{item.tipo}</h4>
                      <p className="text-sm text-gray-600">{item.nome}</p>
                    </div>
                  </div>

                  <div className={`bg-${item.cor}-50 p-4 rounded-lg mb-4`}>
                    <h5 className={`font-semibold text-${item.cor}-700 mb-2`}>💰 Faturamento</h5>
                    <p className={`text-${item.cor}-800 font-bold`}>{item.faturamento}</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-700 mb-2">Características:</h5>
                    {item.caracteristicas.map((carac, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircle className={`w-4 h-4 text-${item.cor}-600 mr-2 mt-0.5 flex-shrink-0`} />
                        <span className="text-sm text-gray-700">{carac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-purple-800 mb-4">🆕 SOCIEDADE LIMITADA UNIPESSOAL</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-purple-700 mb-2">✅ Vantagens</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Pode abrir empresa sem sócio</li>
                    <li>• Não existe capital social mínimo</li>
                    <li>• Patrimônio pessoal protegido</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-purple-700 mb-2">📋 Características</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Empresário responde apenas com patrimônio investido</li>
                    <li>• Modalidade mais recente</li>
                    <li>• Ideal para profissionais liberais</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-purple-700 mb-2">🎯 Indicação</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Substitui a EIRELI</li>
                    <li>• Mais flexível</li>
                    <li>• Menor burocracia inicial</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">⚠️ IMPACTOS DO ENQUADRAMENTO INCORRETO</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <h5 className="font-semibold mb-2">Problemas Comuns:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Pagamento de impostos em excesso</li>
                    <li>• Perda de benefícios fiscais</li>
                    <li>• Limitações desnecessárias</li>
                    <li>• Burocracia excessiva</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Como Evitar:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Análise prévia com contador</li>
                    <li>• Revisão anual do enquadramento</li>
                    <li>• Projeção de crescimento</li>
                    <li>• Comparação de cenários</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Regime Tributário</h3>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-red-800 mb-3">⚖️ ESCOLHA ESTRATÉGICA</h4>
              <p className="text-gray-700">
                Antes de abrir uma empresa é recomendado entrar em contato com um contador para avaliar 
                qual enquadramento tributário deverá ser registrado. Quando essa análise é feita corretamente, 
                evita-se pagar imposto acima do que a lei prevê.
              </p>
            </div>

            <div className="space-y-6">
              {regimesTributarios.map((regime, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className={`bg-${regime.cor}-100 p-3 rounded-lg mr-4`}>
                      <Calculator className={`w-6 h-6 text-${regime.cor}-600`} />
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold text-${regime.cor}-800`}>{regime.nome}</h4>
                      <p className="text-gray-600">{regime.descricao}</p>
                    </div>
                  </div>

                  <div className={`bg-${regime.cor}-50 p-4 rounded-lg mb-4`}>
                    <h5 className={`font-semibold text-${regime.cor}-700 mb-2`}>📊 Limites</h5>
                    <p className={`text-${regime.cor}-800 font-bold`}>{regime.limites}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className={`font-semibold text-${regime.cor}-700 mb-3`}>✅ Vantagens</h5>
                      <div className="space-y-2">
                        {regime.vantagens.map((vantagem, idx) => (
                          <div key={idx} className="flex items-start">
                            <CheckCircle className={`w-4 h-4 text-${regime.cor}-600 mr-2 mt-0.5 flex-shrink-0`} />
                            <span className="text-sm text-gray-700">{vantagem}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className={`font-semibold text-${regime.cor}-700 mb-3`}>⚠️ Desvantagens</h5>
                      <div className="space-y-2">
                        {regime.desvantagens.map((desvantagem, idx) => (
                          <div key={idx} className="flex items-start">
                            <AlertTriangle className={`w-4 h-4 text-${regime.cor}-600 mr-2 mt-0.5 flex-shrink-0`} />
                            <span className="text-sm text-gray-700">{desvantagem}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">🎯 COMO ESCOLHER O REGIME IDEAL</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-700 mb-2">📊 Análise Quantitativa</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Projeção de faturamento anual</li>
                    <li>• Cálculo de impostos por regime</li>
                    <li>• Margem de lucro esperada</li>
                    <li>• Custos operacionais</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-700 mb-2">🔍 Análise Qualitativa</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Tipo de atividade exercida</li>
                    <li>• Necessidade de créditos</li>
                    <li>• Complexidade operacional</li>
                    <li>• Estrutura administrativa</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-purple-700 mb-2">⏰ Análise Temporal</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Fase da empresa (início/crescimento)</li>
                    <li>• Sazonalidade do negócio</li>
                    <li>• Planos de expansão</li>
                    <li>• Ciclo de vida do produto</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">💡 DICAS PARA O CONSULTOR</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <h5 className="font-semibold mb-2">Perguntas Essenciais:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Qual o faturamento atual e projetado?</li>
                    <li>• Há sazonalidade no negócio?</li>
                    <li>• A empresa tem prejuízos acumulados?</li>
                    <li>• Há necessidade de créditos fiscais?</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Sinais de Alerta:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Empresa no Simples pagando muito imposto</li>
                    <li>• Lucro Real sem aproveitamento de créditos</li>
                    <li>• Presumido com margem baixa</li>
                    <li>• Mudanças não acompanhadas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">O que Avaliar do Contábil</h3>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-green-800 mb-3">🔍 ANÁLISE CONTÁBIL ESTRATÉGICA</h4>
              <p className="text-gray-700">
                O consultor financeiro deve saber interpretar as informações contábeis para 
                identificar oportunidades de melhoria e pontos de atenção no negócio.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-blue-800 mb-4">📊 DEMONSTRATIVOS ESSENCIAIS</h4>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">DRE - Demonstrativo de Resultado</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Receitas brutas e líquidas</li>
                      <li>• Custos dos produtos/serviços</li>
                      <li>• Despesas operacionais</li>
                      <li>• Resultado líquido</li>
                      <li>• Margem de contribuição</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">Balanço Patrimonial</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Ativo circulante e não circulante</li>
                      <li>• Passivo circulante e não circulante</li>
                      <li>• Patrimônio líquido</li>
                      <li>• Capital de giro</li>
                      <li>• Endividamento</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">Fluxo de Caixa</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Entradas operacionais</li>
                      <li>• Saídas operacionais</li>
                      <li>• Investimentos</li>
                      <li>• Financiamentos</li>
                      <li>• Saldo final</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-800 mb-4">🎯 INDICADORES-CHAVE</h4>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Rentabilidade</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Margem bruta: (Receita - CMV) / Receita</li>
                      <li>• Margem líquida: Lucro Líquido / Receita</li>
                      <li>• ROI: Lucro / Investimento</li>
                      <li>• ROE: Lucro / Patrimônio Líquido</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Liquidez</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Liquidez corrente: AC / PC</li>
                      <li>• Liquidez seca: (AC - Estoque) / PC</li>
                      <li>• Capital de giro: AC - PC</li>
                      <li>• Ciclo financeiro</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">Endividamento</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Endividamento geral: PT / AT</li>
                      <li>• Endividamento de curto prazo</li>
                      <li>• Composição do endividamento</li>
                      <li>• Cobertura de juros</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-purple-800 mb-4">🔍 PONTOS DE ATENÇÃO NA ANÁLISE</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-red-700 mb-2">🚨 Sinais de Alerta</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Margem bruta decrescente</li>
                    <li>• Aumento desproporcional de despesas</li>
                    <li>• Capital de giro negativo</li>
                    <li>• Endividamento crescente</li>
                    <li>• Fluxo de caixa negativo recorrente</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-yellow-700 mb-2">⚠️ Pontos de Melhoria</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Gestão de estoque ineficiente</li>
                    <li>• Prazo médio de recebimento alto</li>
                    <li>• Custos fixos elevados</li>
                    <li>• Baixa rotatividade de ativos</li>
                    <li>• Dependência de poucos clientes</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-700 mb-2">✅ Oportunidades</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Otimização de custos</li>
                    <li>• Melhoria do mix de produtos</li>
                    <li>• Renegociação de prazos</li>
                    <li>• Diversificação de receitas</li>
                    <li>• Melhoria da eficiência operacional</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">📋 CHECKLIST DE ANÁLISE CONTÁBIL</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <h5 className="font-semibold mb-2">Documentos Necessários:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• DRE dos últimos 12 meses</li>
                    <li>• Balanço Patrimonial atual</li>
                    <li>• Fluxo de caixa detalhado</li>
                    <li>• Extratos bancários</li>
                    <li>• Relatórios de vendas</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Análises Obrigatórias:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Evolução das margens</li>
                    <li>• Composição dos custos</li>
                    <li>• Análise vertical e horizontal</li>
                    <li>• Indicadores de liquidez</li>
                    <li>• Projeções e tendências</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Riscos Contábeis para o Financeiro</h3>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-red-800 mb-3">⚠️ IMPACTOS DIRETOS NO FINANCEIRO</h4>
              <p className="text-gray-700">
                Problemas contábeis podem gerar consequências financeiras graves, desde multas 
                até a impossibilidade de crescimento da empresa. O consultor deve identificar 
                e prevenir esses riscos.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-red-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-red-800 mb-4">🚨 RISCOS CRÍTICOS</h4>
                
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">Sonegação e Omissão</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Multas de 75% a 150% do imposto devido</li>
                      <li>• Juros de mora acumulados</li>
                      <li>• Bloqueio de contas bancárias</li>
                      <li>• Impossibilidade de parcelamentos</li>
                      <li>• Protesto em cartório</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">Atraso em Declarações</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Multa mínima de R$ 500,00</li>
                      <li>• Perda de benefícios fiscais</li>
                      <li>• Suspensão do CNPJ</li>
                      <li>• Impedimento para emitir notas</li>
                      <li>• Restrições bancárias</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-700 mb-2">Contabilidade Inadequada</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Perda de crédito bancário</li>
                      <li>• Dificuldade para vender a empresa</li>
                      <li>• Impossibilidade de franquear</li>
                      <li>• Problemas com investidores</li>
                      <li>• Decisões baseadas em dados incorretos</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-orange-800 mb-4">⚠️ RISCOS MODERADOS</h4>
                
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-700 mb-2">Enquadramento Incorreto</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Pagamento de impostos em excesso</li>
                      <li>• Perda de benefícios do Simples</li>
                      <li>• Limitações desnecessárias</li>
                      <li>• Custos contábeis elevados</li>
                      <li>• Burocracia excessiva</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-700 mb-2">Desorganização Documental</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Dificuldade em auditorias</li>
                      <li>• Perda de tempo em fiscalizações</li>
                      <li>• Impossibilidade de comprovar despesas</li>
                      <li>• Problemas em financiamentos</li>
                      <li>• Dificuldade para análises gerenciais</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-700 mb-2">Falta de Controles</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Decisões baseadas em "achismo"</li>
                      <li>• Dificuldade para crescer</li>
                      <li>• Perda de oportunidades</li>
                      <li>• Gestão ineficiente</li>
                      <li>• Baixa competitividade</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-green-800 mb-4">✅ COMO PREVENIR OS RISCOS</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-700 mb-2">🔍 Auditoria Preventiva</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Revisão mensal das obrigações</li>
                    <li>• Verificação de prazos</li>
                    <li>• Conferência de cálculos</li>
                    <li>• Análise de enquadramento</li>
                    <li>• Checklist de compliance</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-700 mb-2">📋 Controles Internos</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Segregação de funções</li>
                    <li>• Aprovações hierárquicas</li>
                    <li>• Conciliações periódicas</li>
                    <li>• Backup de documentos</li>
                    <li>• Treinamento da equipe</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-700 mb-2">🤝 Parceria Contábil</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Escolha de contador qualificado</li>
                    <li>• Comunicação constante</li>
                    <li>• Reuniões mensais</li>
                    <li>• Relatórios gerenciais</li>
                    <li>• Planejamento tributário</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-blue-800 mb-4">💰 IMPACTO FINANCEIRO DOS RISCOS</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-700 mb-2">Custos Diretos</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Multas fiscais:</span>
                      <span className="text-sm font-bold">R$ 500 a R$ 50.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Juros de mora:</span>
                      <span className="text-sm font-bold">1% ao mês + Selic</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Honorários advocatícios:</span>
                      <span className="text-sm font-bold">10% a 20% do débito</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Custos cartorários:</span>
                      <span className="text-sm font-bold">R$ 200 a R$ 2.000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-700 mb-2">Custos Indiretos</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Perda de tempo da gestão</li>
                    <li>• Stress e desgaste emocional</li>
                    <li>• Perda de oportunidades de negócio</li>
                    <li>• Deterioração da imagem</li>
                    <li>• Dificuldade para crescer</li>
                    <li>• Perda de competitividade</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">🎯 AÇÕES IMEDIATAS PARA O CONSULTOR</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <h5 className="font-semibold mb-2">Diagnóstico Urgente:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Verificar pendências na Receita Federal</li>
                    <li>• Checar situação do CNPJ</li>
                    <li>• Analisar declarações em atraso</li>
                    <li>• Avaliar enquadramento atual</li>
                    <li>• Revisar controles internos</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Plano de Ação:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Regularizar pendências imediatas</li>
                    <li>• Implementar controles preventivos</li>
                    <li>• Treinar equipe interna</li>
                    <li>• Estabelecer rotinas de verificação</li>
                    <li>• Monitorar mensalmente</li>
                  </ul>
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
          Entendendo a Linguagem Fiscal e Contábil
        </h2>
        <p className="text-lg text-gray-600">
          Conhecimentos essenciais para dialogar efetivamente com contadores e identificar oportunidades
        </p>
      </div>

      {/* Navigation */}
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

      {/* Content */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        {renderTab()}
      </div>
    </div>
  )
}

export default Modulo3
