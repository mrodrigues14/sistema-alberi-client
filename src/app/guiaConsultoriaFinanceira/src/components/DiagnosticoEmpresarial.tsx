
import React, { useState } from 'react'
import {Building2, Search, Heart, MapPin, Star, Users, Globe, CheckCircle, AlertTriangle, Lightbulb, Target} from 'lucide-react'

const DiagnosticoEmpresarial = () => {
  const [activeSection, setActiveSection] = useState(0)
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>({})

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }))
  }

  const sections = [
    { title: "Conhecendo a Empresa", icon: Building2 },
    { title: "Criando Conexão", icon: Heart },
    { title: "Estrutura Empresarial", icon: MapPin },
    { title: "Diferencial e Carro-chefe", icon: Star }
  ]

  const renderSection = () => {
    switch(activeSection) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">1. Conhecendo Quem é a Empresa</h3>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">🎯 PRIMEIRA PERGUNTA CRUCIAL</h4>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-xl font-semibold text-center text-blue-700">
                  "Qual é o ramo de atuação da empresa?"
                </p>
              </div>
              <p className="text-gray-700 mt-3">
                <strong>Esta pergunta deve ser feita ANTES da primeira reunião!</strong> Com essa informação, 
                você consegue fazer uma pesquisa prévia e já iniciar suas primeiras anotações.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-green-600" />
                Pesquisa Prévia - Checklist Obrigatório
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-green-700 mb-3">🔍 Investigação Online</h5>
                  <div className="space-y-2">
                    {[
                      "Pesquisar no Google sobre a empresa",
                      "Verificar se tem site institucional",
                      "Analisar redes sociais (Instagram, Facebook)",
                      "Buscar avaliações no Google Maps",
                      "Verificar no Reclame Aqui"
                    ].map((item, index) => (
                      <label key={index} className="flex items-start cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mt-1 mr-2"
                          checked={checkedItems[`pesquisa_${index}`] || false}
                          onChange={() => toggleCheck(`pesquisa_${index}`)}
                        />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-blue-700 mb-3">📞 Investigação Direta</h5>
                  <div className="space-y-2">
                    {[
                      "Ligar no estabelecimento como cliente",
                      "Visitar fisicamente (se possível)",
                      "Verificar produtos/serviços oferecidos",
                      "Observar atendimento ao cliente",
                      "Avaliar estrutura e localização"
                    ].map((item, index) => (
                      <label key={index} className="flex items-start cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mt-1 mr-2"
                          checked={checkedItems[`direta_${index}`] || false}
                          onChange={() => toggleCheck(`direta_${index}`)}
                        />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-yellow-800 mb-3">💡 VANTAGENS DA PESQUISA PRÉVIA</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-yellow-700 mb-2">Para Precificação:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Tamanho e complexidade do negócio</li>
                    <li>• Potencial de faturamento</li>
                    <li>• Nível de profissionalização</li>
                    <li>• Urgência das necessidades</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-yellow-700 mb-2">Para Credibilidade:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Demonstra profissionalismo</li>
                    <li>• Mostra interesse genuíno</li>
                    <li>• Permite perguntas específicas</li>
                    <li>• Facilita a primeira conversa</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-red-800 mb-3">⚠️ IMPORTANTE</h4>
              <p className="text-gray-700">
                <strong>Mesmo que o cliente não feche a consultoria, SEMPRE faça a pesquisa prévia!</strong> 
                Isso pode te ajudar a entender padrões de mercado, conhecer concorrentes e aprimorar 
                sua abordagem para futuros clientes do mesmo segmento.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">🎯 RESULTADO ESPERADO</h4>
              <p>
                Chegar na primeira reunião com conhecimento prévio da empresa, demonstrando 
                profissionalismo e permitindo uma conversa mais direcionada e produtiva.
              </p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">2. Criando Conexão com o Cliente</h3>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-green-800 mb-3">💚 SEGUNDA ETAPA: Construindo Confiança</h4>
              <p className="text-gray-700">
                Antes de qualquer negociação, é fundamental entender <strong>por que o cliente procurou a consultoria</strong>. 
                Este momento é crucial para estabelecer confiança e compreender as reais necessidades.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-600" />
                Perguntas para Criar Conexão
              </h4>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-3">🎯 Pergunta Principal</h5>
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <p className="text-lg font-semibold text-center text-blue-700">
                      "O que te motivou a procurar uma consultoria financeira?"
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">Perguntas de Aprofundamento</h5>
                    <ul className="text-sm space-y-1">
                      <li>• "Quais são suas principais preocupações?"</li>
                      <li>• "O que você gostaria de melhorar?"</li>
                      <li>• "Qual resultado você espera?"</li>
                      <li>• "Já tentou resolver isso antes?"</li>
                      <li>• "O que não deu certo anteriormente?"</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-800 mb-2">Sinais de Urgência</h5>
                    <ul className="text-sm space-y-1">
                      <li>• "Estou perdendo dinheiro"</li>
                      <li>• "Não sei se tenho lucro"</li>
                      <li>• "Preciso organizar as finanças"</li>
                      <li>• "Quero expandir o negócio"</li>
                      <li>• "Tenho problemas com fluxo de caixa"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">🧠 Técnicas de Escuta Ativa</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">👂</span>
                  </div>
                  <h5 className="font-semibold mb-2">Escute Mais, Fale Menos</h5>
                  <p className="text-sm text-gray-600">
                    Deixe o cliente falar 70% do tempo. Suas dores vão aparecer naturalmente.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h5 className="font-semibold mb-2">Demonstre Empatia</h5>
                  <p className="text-sm text-gray-600">
                    "Entendo sua preocupação..." "Isso deve ser muito estressante..."
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h5 className="font-semibold mb-2">Faça Reflexões</h5>
                  <p className="text-sm text-gray-600">
                    Ajude o cliente a refletir sobre as necessidades empresariais.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-yellow-800 mb-3">🎭 POSICIONAMENTO ESTRATÉGICO</h4>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-700 mb-3">
                  <strong>"Você está entrando na empresa como um profissional apto a apresentar 
                  resultados que supram as expectativas do cliente."</strong>
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ Posicione-se como especialista técnico</li>
                  <li>✅ Demonstre confiança sem arrogância</li>
                  <li>✅ Mostre que já resolveu problemas similares</li>
                  <li>✅ Seja a opinião técnica e imparcial</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">📝 CHECKLIST DE CONEXÃO</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-blue-700 mb-2">Durante a Conversa:</h5>
                  <div className="space-y-1">
                    {[
                      "Cliente se sente confortável para falar",
                      "Você entendeu a principal dor",
                      "Cliente demonstra confiança em você",
                      "Expectativas foram alinhadas"
                    ].map((item, index) => (
                      <label key={index} className="flex items-start cursor-pointer text-sm">
                        <input 
                          type="checkbox" 
                          className="mt-1 mr-2"
                          checked={checkedItems[`conexao_${index}`] || false}
                          onChange={() => toggleCheck(`conexao_${index}`)}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-blue-700 mb-2">Sinais Positivos:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Cliente fala abertamente dos problemas</li>
                    <li>• Faz perguntas sobre sua experiência</li>
                    <li>• Demonstra interesse nos próximos passos</li>
                    <li>• Menciona urgência em resolver</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">🎯 RESULTADO ESPERADO</h4>
              <p>
                Cliente confortável, confiante e aberto para compartilhar informações. 
                Você posicionado como especialista técnico capaz de resolver os problemas identificados.
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">3. Conhecendo a Estrutura Empresarial</h3>
            
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-purple-800 mb-3">🏢 TERCEIRA ETAPA: Mapeando a Empresa</h4>
              <p className="text-gray-700">
                Tempo de mercado, localização e estrutura revelam o perfil do público-alvo, 
                consumidores e se a estrutura atual condiz com os objetivos empresariais.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                Perguntas Estruturais Essenciais
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-3">📍 Estrutura Física</h5>
                  <div className="space-y-2">
                    {[
                      "Quantos setores a empresa possui?",
                      "Qual é o tempo de mercado?",
                      "Qual a localização da empresa?",
                      "Qual é o tamanho da estrutura?"
                    ].map((pergunta, index) => (
                      <div key={index} className="bg-white p-2 rounded border border-blue-200">
                        <p className="text-sm font-medium text-blue-700">{pergunta}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-3">🎯 Análise Estratégica</h5>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Tempo de mercado:</strong> Credibilidade e experiência</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Localização:</strong> Público-alvo e concorrência</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Estrutura:</strong> Capacidade vs. demanda</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Setores:</strong> Organização e eficiência</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ ATENÇÃO ESPECIAL</h4>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-700 mb-3">
                  <strong>"Muitas vezes o que o proprietário quer transparecer não é o que de fato se apresenta."</strong>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-red-700 mb-2">🔍 Sinais de Alerta:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Estrutura desproporcional ao movimento</li>
                      <li>• Localização inadequada ao público</li>
                      <li>• Tempo de mercado x conhecimento</li>
                      <li>• Discurso x realidade observada</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-green-700 mb-2">✅ Validações:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Visite pessoalmente a empresa</li>
                      <li>• Observe o movimento real</li>
                      <li>• Converse com funcionários</li>
                      <li>• Analise a vizinhança/concorrência</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">📱 Verificação Digital</h4>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h5 className="font-semibold text-blue-800 mb-3">🌐 Presença Digital</h5>
                <div className="space-y-2">
                  {[
                    "A empresa possui site?",
                    "Está ativa nas redes sociais?",
                    "As informações online batem com a realidade?",
                    "Funcionários, proprietários e mídias seguem a mesma linha?"
                  ].map((pergunta, index) => (
                    <label key={index} className="flex items-start cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mt-1 mr-2"
                        checked={checkedItems[`digital_${index}`] || false}
                        onChange={() => toggleCheck(`digital_${index}`)}
                      />
                      <span className="text-sm">{pergunta}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">💡 DICA IMPORTANTE</h5>
                <p className="text-sm text-gray-700">
                  <strong>Funcionários, proprietários e mídias sociais devem seguir a mesma linha de raciocínio.</strong> 
                  Discrepâncias podem indicar problemas de comunicação interna ou posicionamento confuso no mercado.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">🎯 RESULTADO ESPERADO</h4>
              <p>
                Compreensão clara da estrutura empresarial real, identificação de possíveis 
                discrepâncias entre discurso e prática, e mapeamento do potencial de crescimento.
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">4. Identificando Diferencial e Carro-chefe</h3>
            
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-orange-800 mb-3">⭐ QUARTA ETAPA: Encontrando o Ouro da Empresa</h4>
              <p className="text-gray-700">
                O diferencial da empresa é crucial para avaliar o poder de mercado. 
                O carro-chefe é o produto que ganhará holofotes e destaques na estratégia.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-600" />
                Perguntas para Identificar o Diferencial
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-yellow-800 mb-3">🌟 Pergunta Principal</h5>
                  <div className="bg-white p-3 rounded border border-yellow-200 mb-3">
                    <p className="text-lg font-semibold text-center text-yellow-700">
                      "Qual é o diferencial da empresa?"
                    </p>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• O que vocês fazem melhor que a concorrência?</li>
                    <li>• Por que os clientes escolhem vocês?</li>
                    <li>• Qual é o seu ponto forte único?</li>
                    <li>• O que vocês oferecem que ninguém mais oferece?</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-3">🚗 Pergunta do Carro-chefe</h5>
                  <div className="bg-white p-3 rounded border border-green-200 mb-3">
                    <p className="text-lg font-semibold text-center text-green-700">
                      "Qual é o carro-chefe?"
                    </p>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Qual produto/serviço vende mais?</li>
                    <li>• Qual tem maior margem de lucro?</li>
                    <li>• Qual os clientes mais procuram?</li>
                    <li>• Qual representa a empresa?</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">🔍 Análise de Qualidade e Apresentação</h4>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h5 className="font-semibold text-blue-800 mb-3">📋 Checklist de Avaliação</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-blue-700 mb-2">Qualidade do Produto/Serviço:</h6>
                    <div className="space-y-1">
                      {[
                        "Qualidade superior à concorrência",
                        "Apresentação profissional",
                        "Padronização dos processos",
                        "Controle de qualidade definido"
                      ].map((item, index) => (
                        <label key={index} className="flex items-start cursor-pointer text-sm">
                          <input 
                            type="checkbox" 
                            className="mt-1 mr-2"
                            checked={checkedItems[`qualidade_${index}`] || false}
                            onChange={() => toggleCheck(`qualidade_${index}`)}
                          />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h6 className="font-semibold text-blue-700 mb-2">Apresentação e Marketing:</h6>
                    <div className="space-y-1">
                      {[
                        "Embalagem/apresentação atrativa",
                        "Material de divulgação profissional",
                        "Fotos de qualidade nas redes sociais",
                        "Comunicação clara do diferencial"
                      ].map((item, index) => (
                        <label key={index} className="flex items-start cursor-pointer text-sm">
                          <input 
                            type="checkbox" 
                            className="mt-1 mr-2"
                            checked={checkedItems[`apresentacao_${index}`] || false}
                            onChange={() => toggleCheck(`apresentacao_${index}`)}
                          />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-red-800 mb-3">🚨 SINAIS DE ALERTA</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-red-700 mb-2">Diferencial Inexistente:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• "Fazemos igual todo mundo"</li>
                    <li>• "Nosso diferencial é o preço baixo"</li>
                    <li>• "Não sei o que nos diferencia"</li>
                    <li>• "Fazemos de tudo um pouco"</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-red-700 mb-2">Carro-chefe Confuso:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Múltiplos produtos sem foco</li>
                    <li>• Não sabe qual vende mais</li>
                    <li>• Carro-chefe com baixa margem</li>
                    <li>• Produto principal sem destaque</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-green-800 mb-3">✅ OPORTUNIDADES IDENTIFICADAS</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-green-700 mb-2">Quando há Diferencial Claro:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Potencializar o marketing deste diferencial</li>
                    <li>• Aumentar margem baseada no valor único</li>
                    <li>• Expandir este diferencial para outros produtos</li>
                    <li>• Treinar equipe para vender o diferencial</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-700 mb-2">Quando NÃO há Diferencial:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Criar diferencial baseado em qualidade</li>
                    <li>• Desenvolver atendimento excepcional</li>
                    <li>• Especializar em nicho específico</li>
                    <li>• Inovar em produto/serviço</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
              <h4 className="text-lg font-semibold text-purple-800 mb-3">💰 IMPACTO FINANCEIRO</h4>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-700 mb-3">
                  <strong>O carro-chefe bem identificado e potencializado pode:</strong>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-sm space-y-1">
                    <li>✅ Aumentar ticket médio em 20-40%</li>
                    <li>✅ Melhorar margem de lucro</li>
                    <li>✅ Reduzir custos de marketing</li>
                  </ul>
                  <ul className="text-sm space-y-1">
                    <li>✅ Fidelizar clientes</li>
                    <li>✅ Facilitar expansão</li>
                    <li>✅ Aumentar valor da empresa</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-2">🎯 RESULTADO ESPERADO</h4>
              <p>
                Identificação clara do diferencial competitivo e do carro-chefe da empresa, 
                com análise da qualidade e oportunidades de potencialização financeira.
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
          Visão Geral da Empresa
        </h2>
        <p className="text-lg text-gray-600">
          Metodologia prática para conhecer profundamente o negócio do cliente
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
      <div className="bg-white rounded-xl p-6 shadow-lg">
        {renderSection()}
      </div>
    </div>
  )
}

export default DiagnosticoEmpresarial
