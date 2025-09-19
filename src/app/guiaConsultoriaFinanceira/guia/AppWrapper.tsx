"use client";
import React from 'react';
import GuiaNavbar from './GuiaNavbar';
import {BookOpen, Target, TrendingUp, Users, Calculator, PieChart, FileText, Award} from 'lucide-react';
import { 
  Modulo1,
  Modulo3,
  Modulo4,
  Modulo5,
  DiagnosticoFinanceiro,
  DiagnosticoEmpresarial,
  FluxoCaixaEmpresarial,
  OrcamentoPessoal,
  Capa,
  CapaPF,
  CapaPJ,
  Conclusao
} from './components';

// Copia simplificada do App.tsx original adaptada para Next
export default function AppWrapper(){
  const [activeModule, setActiveModule] = React.useState('capa');
  const modules = [
    { id: 'capa', title: 'Capa', icon: BookOpen, component: Capa },
    { id: 'capa-pf', title: 'Pessoa Física', icon: Users, component: CapaPF },
    { id: 'modulo4', title: 'Planejamento Estratégico', icon: Calculator, component: Modulo4 },
    { id: 'orcamento', title: 'Orçamento Pessoal', icon: Calculator, component: OrcamentoPessoal },
    { id: 'diagnostico-pf', title: 'Diagnóstico Financeiro', icon: FileText, component: DiagnosticoFinanceiro },
    { id: 'modulo5', title: 'Estratégias de Investimento', icon: Award, component: Modulo5 },
    { id: 'capa-pj', title: 'Pessoa Jurídica', icon: Target, component: CapaPJ },
    { id: 'diagnostico-pj', title: 'Diagnóstico PJ', icon: TrendingUp, component: DiagnosticoEmpresarial },
    { id: 'fluxo-caixa', title: 'Gestão de Dados', icon: PieChart, component: FluxoCaixaEmpresarial },
    { id: 'modulo1', title: 'Metodologia Empresarial', icon: Target, component: Modulo1 },
    { id: 'modulo3', title: 'Contabilidade', icon: PieChart, component: Modulo3 },
    { id: 'conclusao', title: 'Conclusão', icon: Award, component: Conclusao }
  ];
  const ActiveComponent = modules.find(m => m.id === activeModule)?.component || Capa;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <GuiaNavbar />
      <div className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-blue-600 mr-4" />
            <h1 className="text-3xl font-bold text-gray-800">Guia de Consultoria Financeira</h1>
          </div>
          <p className="text-center text-lg text-gray-600 mt-2">Metodologia prática baseada em análise de extratos bancários</p>
        </div>
      </div>
      <div className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-2">
            {modules.map(module => {
              const Icon = module.icon;
              return (
                <button key={module.id} onClick={() => setActiveModule(module.id)} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all ${activeModule === module.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}>
                  <Icon className="w-4 h-4 mr-2" />
                  {module.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8"><div className="fade-in"><ActiveComponent /></div></div>
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">Guia de Consultoria Financeira</p>
          <p className="text-gray-400">Metodologia prática para consultores financeiros</p>
        </div>
      </div>
    </div>
  );
}
