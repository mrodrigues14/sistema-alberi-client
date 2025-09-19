
import React from 'react'
import {Building, TrendingUp, Users, Target, BarChart3, Zap, Shield, Award} from 'lucide-react'

const CapaPJ = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 rounded-2xl shadow-2xl">
          <Building className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">
            Consultoria Financeira
          </h1>
          <h2 className="text-3xl font-semibold mb-6">
            Pessoa Jurídica
          </h2>
          <p className="text-xl mb-6">
            Gestão Financeira Empresarial Estratégica
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-lg font-semibold">
              Maximize a Performance do seu Negócio
            </p>
          </div>
        </div>
      </div>

      {/* Segmentos de Atuação */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
          <div className="text-center mb-4">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-blue-800">Varejo</h3>
          </div>
          
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm">Gestão de Estoque</h4>
              <p className="text-xs text-gray-600">Otimização do capital de giro</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm">Fluxo de Caixa</h4>
              <p className="text-xs text-gray-600">Controle de recebimentos</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm">Margem de Lucro</h4>
              <p className="text-xs text-gray-600">Precificação estratégica</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
          <div className="text-center mb-4">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-800">Serviços</h3>
          </div>
          
          <div className="space-y-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm">Precificação</h4>
              <p className="text-xs text-gray-600">Valor hora adequado</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm">Produtividade</h4>
              <p className="text-xs text-gray-600">Eficiência da equipe</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm">Recorrência</h4>
              <p className="text-xs text-gray-600">Fidelização de clientes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
          <div className="text-center mb-4">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-purple-800">Indústria</h3>
          </div>
          
          <div className="space-y-3">
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm">Custos Industriais</h4>
              <p className="text-xs text-gray-600">Controle de produção</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm">Capacidade</h4>
              <p className="text-xs text-gray-600">Utilização de ativos</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm">Qualidade</h4>
              <p className="text-xs text-gray-600">Redução de perdas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metodologia PJ */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-3" />
          Metodologia Empresarial
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="font-bold text-blue-800 mb-2">Análise do Segmento</h3>
            <p className="text-sm text-gray-600">Compreensão do modelo de negócio</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="font-bold text-green-800 mb-2">Estrutura da Equipe</h3>
            <p className="text-sm text-gray-600">Análise organizacional e custos</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="font-bold text-purple-800 mb-2">Diagnóstico Financeiro</h3>
            <p className="text-sm text-gray-600">Extrato bancário e fluxo real</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">4</span>
            </div>
            <h3 className="font-bold text-orange-800 mb-2">Sistema de Vendas</h3>
            <p className="text-sm text-gray-600">Dados operacionais e rentabilidade</p>
          </div>
        </div>
      </div>

      {/* Áreas de Impacto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-200">
          <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3" />
            Áreas de Impacto
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-green-50 rounded-lg">
              <Shield className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Gestão de Riscos</h3>
                <p className="text-gray-600 text-sm">Identificação e mitigação de riscos financeiros</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-blue-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Controle Financeiro</h3>
                <p className="text-gray-600 text-sm">Implementação de controles e indicadores</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-purple-50 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Planejamento Estratégico</h3>
                <p className="text-gray-600 text-sm">Definição de metas e estratégias</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-orange-50 rounded-lg">
              <Award className="w-6 h-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Performance</h3>
                <p className="text-gray-600 text-sm">Otimização de resultados e produtividade</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
            <Building className="w-6 h-6 mr-3" />
            Benefícios Empresariais
          </h2>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h3 className="font-semibold text-yellow-800">Redução de Custos</h3>
              <p className="text-sm text-gray-600">Identificação de desperdícios e otimizações</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <h3 className="font-semibold text-green-800">Aumento de Receita</h3>
              <p className="text-sm text-gray-600">Estratégias de crescimento sustentável</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-800">Melhoria do Fluxo</h3>
              <p className="text-sm text-gray-600">Gestão eficiente do capital de giro</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-semibold text-purple-800">Tomada de Decisão</h3>
              <p className="text-sm text-gray-600">Dados precisos para decisões estratégicas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ferramentas PJ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">📊 Diagnóstico Empresarial</h3>
          <ul className="space-y-2 text-sm">
            <li>• Análise de extratos bancários</li>
            <li>• Avaliação do sistema de vendas</li>
            <li>• Indicadores de performance</li>
            <li>• Relatórios executivos</li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">💰 Fluxo de Caixa Empresarial</h3>
          <ul className="space-y-2 text-sm">
            <li>• Projeções financeiras</li>
            <li>• Controle de recebimentos</li>
            <li>• Gestão de pagamentos</li>
            <li>• Planejamento de investimentos</li>
          </ul>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">
          Transforme sua Empresa
        </h2>
        <p className="text-lg mb-6">
          Implemente uma gestão financeira profissional e alcance resultados excepcionais
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
            <strong>Eficiência</strong><br />
            Processos otimizados
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
            <strong>Rentabilidade</strong><br />
            Margens maximizadas
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
            <strong>Crescimento</strong><br />
            Expansão sustentável
          </div>
        </div>
      </div>
    </div>
  )
}

export default CapaPJ
