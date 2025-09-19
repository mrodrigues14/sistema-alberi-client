/* eslint-disable react/no-unescaped-entities */
// React import removido (JSX runtime automático)
import {Award, CheckCircle, TrendingUp, Users, Target, BookOpen, Star, Zap} from 'lucide-react'

const Conclusao = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-12 rounded-2xl shadow-2xl">
          <Award className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">
            Conclusão
          </h1>
          <p className="text-xl mb-6">
            Parabéns! Você completou o Guia de Consultoria Financeira
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-lg font-semibold">
              Agora você está pronto para transformar vidas financeiras
            </p>
          </div>
        </div>
      </div>

      {/* Resumo dos Aprendizados */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-3" />
          O que Você Aprendeu
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
            <h3 className="font-bold text-blue-800 mb-3">Metodologia Prática</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                Análise baseada em extratos bancários
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                Diagnóstico financeiro preciso
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                Indicadores práticos e objetivos
              </li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
            <h3 className="font-bold text-green-800 mb-3">Consultoria PF e PJ</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                Planejamento financeiro pessoal
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                Gestão financeira empresarial
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                Estratégias personalizadas
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
            <h3 className="font-bold text-purple-800 mb-3">Ferramentas Práticas</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                Calculadoras automáticas
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                Modelos de relatórios
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                Checklists de implementação
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Próximos Passos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3" />
            Próximos Passos
          </h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">1. Pratique a Metodologia</h3>
              <p className="text-sm text-gray-600">
                Comece aplicando os conceitos com casos reais, mesmo que sejam seus próprios dados financeiros
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">2. Desenvolva seu Portfólio</h3>
              <p className="text-sm text-gray-600">
                Crie estudos de caso e exemplos práticos para demonstrar sua competência
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">3. Continue Aprendendo</h3>
              <p className="text-sm text-gray-600">
                Mantenha-se atualizado com tendências do mercado e novas ferramentas
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-200">
          <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-3" />
            Construindo sua Carreira
          </h2>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h3 className="font-semibold text-yellow-800">Networking</h3>
              <p className="text-sm text-gray-600">Conecte-se com outros profissionais da área</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-800">Especialização</h3>
              <p className="text-sm text-gray-600">Foque em segmentos específicos do mercado</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <h3 className="font-semibold text-green-800">Certificações</h3>
              <p className="text-sm text-gray-600">Busque certificações reconhecidas pelo mercado</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-semibold text-purple-800">Marketing Pessoal</h3>
              <p className="text-sm text-gray-600">Desenvolva sua marca pessoal e presença digital</p>
            </div>
          </div>
        </div>
      </div>

      {/* Impacto da Consultoria */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3" />
          O Impacto da Consultoria Financeira
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <Star className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-blue-800 mb-2">Transformação Pessoal</h3>
            <p className="text-sm text-gray-600">
              Ajude pessoas a conquistarem seus sonhos e objetivos financeiros
            </p>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <Zap className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-bold text-green-800 mb-2">Crescimento Empresarial</h3>
            <p className="text-sm text-gray-600">
              Contribua para o sucesso e sustentabilidade de negócios
            </p>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-bold text-purple-800 mb-2">Impacto Social</h3>
            <p className="text-sm text-gray-600">
              Promova educação financeira e bem-estar social
            </p>
          </div>
          
          <div className="text-center p-6 bg-orange-50 rounded-lg">
            <Award className="w-12 h-12 text-orange-600 mx-auto mb-3" />
            <h3 className="font-bold text-orange-800 mb-2">Realização Profissional</h3>
            <p className="text-sm text-gray-600">
              Construa uma carreira de propósito e significado
            </p>
          </div>
        </div>
      </div>

      {/* Mensagem Final */}
      <div className="bg-gradient-to-r from-gold-600 via-yellow-500 to-orange-500 text-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">
          🎉 Parabéns pela Jornada!
        </h2>
        <p className="text-lg mb-6">
          Você agora possui as ferramentas e conhecimentos necessários para se tornar 
          um consultor financeiro de excelência. Lembre-se: o sucesso vem da prática 
          constante e do compromisso com a melhoria contínua.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="font-bold mb-2">🎯 Foque na Prática</h3>
            <p className="text-sm">Aplique os conhecimentos em casos reais</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="font-bold mb-2">📈 Meça Resultados</h3>
            <p className="text-sm">Acompanhe o impacto do seu trabalho</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="font-bold mb-2">🚀 Continue Evoluindo</h3>
            <p className="text-sm">Mantenha-se sempre atualizado</p>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg">
          <h3 className="text-xl font-bold mb-2">
            "O futuro pertence àqueles que acreditam na beleza de seus sonhos"
          </h3>
          <p className="text-sm opacity-90">
            Eleanor Roosevelt
          </p>
        </div>
      </div>
    </div>
  )
}

export default Conclusao
