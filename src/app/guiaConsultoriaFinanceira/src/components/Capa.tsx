
import React from 'react'
import {BookOpen, Target, Users, TrendingUp, Award, CheckCircle} from 'lucide-react'

const Capa = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 rounded-2xl shadow-2xl">
          <BookOpen className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">
            Guia de Consultoria Financeira
          </h1>
          <p className="text-xl mb-6">
            Metodologia Prática Baseada em Análise de Extratos Bancários
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-lg font-semibold">
              Da Análise à Implementação: Um Guia Completo
            </p>
          </div>
        </div>
      </div>

      {/* Objetivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3" />
            Objetivos do Curso
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Metodologia Prática</h3>
                <p className="text-gray-600 text-sm">Análise baseada em dados reais dos extratos bancários</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Diagnóstico Preciso</h3>
                <p className="text-gray-600 text-sm">Identificação de problemas e oportunidades reais</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Planos Personalizados</h3>
                <p className="text-gray-600 text-sm">Soluções específicas para cada perfil de cliente</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Implementação Efetiva</h3>
                <p className="text-gray-600 text-sm">Acompanhamento e monitoramento de resultados</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-200">
          <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-3" />
            Público-Alvo
          </h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Consultores Financeiros</h3>
              <p className="text-sm text-gray-600">Profissionais que desejam aprimorar suas técnicas de análise</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Contadores e Administradores</h3>
              <p className="text-sm text-gray-600">Que buscam expandir seus serviços para consultoria</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Empreendedores</h3>
              <p className="text-sm text-gray-600">Interessados em entender melhor suas finanças</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800">Estudantes</h3>
              <p className="text-sm text-gray-600">De administração, contabilidade e economia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estrutura do Curso */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3" />
          Estrutura do Curso
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
            <h3 className="font-bold text-blue-800 mb-2">Módulo 1</h3>
            <h4 className="font-semibold mb-2">Metodologia Empresarial</h4>
            <p className="text-sm text-gray-600">Análise de segmento, estrutura da equipe e diagnóstico inicial</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
            <h3 className="font-bold text-green-800 mb-2">Módulo 2</h3>
            <h4 className="font-semibold mb-2">Análise de Extratos</h4>
            <p className="text-sm text-gray-600">Categorização e interpretação de movimentações bancárias</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
            <h3 className="font-bold text-purple-800 mb-2">Módulo 3</h3>
            <h4 className="font-semibold mb-2">Sistema de Vendas</h4>
            <p className="text-sm text-gray-600">Análise de dados operacionais e rentabilidade</p>
          </div>
          
          <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-600">
            <h3 className="font-bold text-orange-800 mb-2">Módulo 4</h3>
            <h4 className="font-semibold mb-2">Planejamento Estratégico</h4>
            <p className="text-sm text-gray-600">Elaboração de planos de ação e metas</p>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-600">
            <h3 className="font-bold text-red-800 mb-2">Módulo 5</h3>
            <h4 className="font-semibold mb-2">Implementação</h4>
            <p className="text-sm text-gray-600">Acompanhamento e monitoramento de resultados</p>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-600">
            <h3 className="font-bold text-yellow-800 mb-2">Ferramentas</h3>
            <h4 className="font-semibold mb-2">Diagnósticos Práticos</h4>
            <p className="text-sm text-gray-600">Calculadoras e modelos para aplicação imediata</p>
          </div>
        </div>
      </div>

      {/* Diferenciais */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Award className="w-6 h-6 mr-3" />
          Diferenciais da Metodologia
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-3">🎯 Foco na Realidade</h3>
            <ul className="space-y-2 text-sm">
              <li>• Análise baseada em extratos bancários reais</li>
              <li>• Dados do sistema de vendas efetivos</li>
              <li>• Identificação de discrepâncias entre teoria e prática</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-3">⚡ Resultados Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>• Diagnóstico em até 2 horas</li>
              <li>• Plano de ação imediato</li>
              <li>• Implementação gradual e monitorada</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-3">🔧 Ferramentas Práticas</h3>
            <ul className="space-y-2 text-sm">
              <li>• Calculadoras automáticas</li>
              <li>• Modelos de relatórios</li>
              <li>• Checklists de implementação</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-3">📈 Acompanhamento Contínuo</h3>
            <ul className="space-y-2 text-sm">
              <li>• Indicadores de performance</li>
              <li>• Revisões periódicas</li>
              <li>• Ajustes conforme necessário</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Capa
