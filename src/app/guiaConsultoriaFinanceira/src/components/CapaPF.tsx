
import React from 'react'
import {User, Heart, Home, GraduationCap, Car, Plane, Shield, TrendingUp} from 'lucide-react'

const CapaPF = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-12 rounded-2xl shadow-2xl">
          <User className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">
            Consultoria Financeira
          </h1>
          <h2 className="text-3xl font-semibold mb-6">
            Pessoa Física
          </h2>
          <p className="text-xl mb-6">
            Planejamento Financeiro Pessoal e Familiar
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-lg font-semibold">
              Conquiste sua Independência Financeira
            </p>
          </div>
        </div>
      </div>

      {/* Áreas de Atuação */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-200">
          <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3" />
            Áreas de Consultoria PF
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-green-50 rounded-lg">
              <Home className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Orçamento Familiar</h3>
                <p className="text-gray-600 text-sm">Controle de gastos e organização financeira</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-blue-50 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Reserva de Emergência</h3>
                <p className="text-gray-600 text-sm">Proteção financeira para imprevistos</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-purple-50 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Educação Financeira</h3>
                <p className="text-gray-600 text-sm">Investimentos e planejamento de longo prazo</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-orange-50 rounded-lg">
              <Heart className="w-6 h-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Aposentadoria</h3>
                <p className="text-gray-600 text-sm">Planejamento previdenciário personalizado</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
            <Car className="w-6 h-6 mr-3" />
            Objetivos Pessoais
          </h2>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h3 className="font-semibold text-yellow-800">Sonhos de Curto Prazo</h3>
              <p className="text-sm text-gray-600">Viagens, equipamentos, cursos</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <h3 className="font-semibold text-green-800">Sonhos de Médio Prazo</h3>
              <p className="text-sm text-gray-600">Carro, casa própria, especialização</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-800">Sonhos de Longo Prazo</h3>
              <p className="text-sm text-gray-600">Aposentadoria, independência financeira</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-semibold text-purple-800">Proteção Familiar</h3>
              <p className="text-sm text-gray-600">Seguros, previdência, sucessão</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metodologia PF */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Plane className="w-6 h-6 mr-3" />
          Metodologia para Pessoa Física
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-bold text-blue-800 mb-2">Diagnóstico</h3>
            <p className="text-sm text-gray-600">Análise da situação financeira atual</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="font-bold text-green-800 mb-2">Objetivos</h3>
            <p className="text-sm text-gray-600">Definição de metas e sonhos</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="font-bold text-purple-800 mb-2">Estratégia</h3>
            <p className="text-sm text-gray-600">Plano personalizado de ação</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-orange-600">4</span>
            </div>
            <h3 className="font-bold text-orange-800 mb-2">Acompanhamento</h3>
            <p className="text-sm text-gray-600">Monitoramento e ajustes</p>
          </div>
        </div>
      </div>

      {/* Ferramentas PF */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">🎯 Diagnóstico Financeiro PF</h3>
          <ul className="space-y-2 text-sm">
            <li>• Cálculo do patrimônio líquido</li>
            <li>• Análise do fluxo de caixa pessoal</li>
            <li>• Avaliação da saúde financeira</li>
            <li>• Identificação de oportunidades</li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">📊 Orçamento Pessoal</h3>
          <ul className="space-y-2 text-sm">
            <li>• Controle de receitas e despesas</li>
            <li>• Categorização inteligente</li>
            <li>• Metas de economia</li>
            <li>• Planejamento de investimentos</li>
          </ul>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">
          Transforme sua Vida Financeira
        </h2>
        <p className="text-lg mb-6">
          Comece hoje mesmo a construir um futuro financeiro sólido e próspero
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
            <strong>Organização</strong><br />
            Controle total dos seus gastos
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
            <strong>Crescimento</strong><br />
            Investimentos inteligentes
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
            <strong>Tranquilidade</strong><br />
            Segurança para o futuro
          </div>
        </div>
      </div>
    </div>
  )
}

export default CapaPF
