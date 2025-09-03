// Configuração centralizada de permissões por role
export interface ModulePermission {
  id: string;
  title: string;
  href: string;
  description: string;
  icon: string;
  colorClass?: string;
  roles: string[];
  visible: boolean;
}

export interface NavigationItem {
  href: string;
  label: string;
  icon: string;
  roles: string[];
  visible: boolean;
}

// Definição dos módulos disponíveis no sistema
export const AVAILABLE_MODULES: ModulePermission[] = [
  {
    id: 'tasks',
    title: 'Tarefas',
    href: '/kanban',
    description: 'Organize suas tarefas e projetos',
    icon: 'tasks',
    colorClass: 'greenModule',
    roles: ['administrador', 'gerente', 'usuario', 'analista'],
    visible: true
  },
  {
    id: 'studies',
    title: 'Estudos',
    href: '/estudos/resumoMensal',
    description: 'Acesse relatórios e estudos financeiros',
    icon: 'studies',
    colorClass: 'blueModule',
    roles: ['administrador', 'gerente', 'analista'],
    visible: true
  },
  {
    id: 'extrato',
    title: 'Extrato bancário',
    href: '/extrato',
    description: 'Gerencie extratos e lançamentos',
    icon: 'bank',
    colorClass: 'purpleModule',
    roles: ['administrador', 'gerente', 'usuario', 'analista'],
    visible: true
  },
  {
    id: 'configuracaoCliente',
    title: 'Configuração de Cliente',
    href: '/configuracaoCliente',
    description: 'Configure clientes e suas informações',
    icon: 'client',
    colorClass: 'greenModule',
    roles: ['administrador', 'gerente'],
    visible: true
  },
  {
    id: 'configuracaoUsuario',
    title: 'Configuração de Usuário',
    href: '/configuracaoUsuario',
    description: 'Gerencie usuários e permissões',
    icon: 'user',
    colorClass: 'purpleModule',
    roles: ['administrador'],
    visible: true
  },
  {
    id: 'chamados',
    title: 'Reportar Falha',
    href: '/chamados',
    description: 'Reporte problemas e solicite suporte',
    icon: 'bug',
    colorClass: 'redModule',
    roles: ['administrador', 'gerente', 'usuario', 'analista'],
    visible: true
  },
  {
    id: 'gestaoAssas',
    title: 'Gestão Asaas',
    href: '/gestaoAssas',
    description: 'Gerencie cobranças e clientes Asaas',
    icon: 'asaas',
    colorClass: 'orangeModule',
    roles: ['administrador', 'gerente'],
    visible: true
  },
  {
    id: 'contrato',
    title: 'Contratos',
    href: '/contrato',
    description: 'Gerencie contratos e documentos',
    icon: 'contract',
    colorClass: 'blueModule',
    roles: ['administrador', 'gerente', 'analista'],
    visible: true
  },
  {
    id: 'banco',
    title: 'Bancos',
    href: '/banco',
    description: 'Gerencie bancos e contas',
    icon: 'bank',
    colorClass: 'blueModule',
    roles: ['administrador', 'gerente'],
    visible: true
  },
  {
    id: 'categoria',
    title: 'Categorias',
    href: '/categoria',
    description: 'Gerencie categorias contábeis',
    icon: 'category',
    colorClass: 'greenModule',
    roles: ['administrador', 'gerente'],
    visible: true
  },
  {
    id: 'fornecedor',
    title: 'Fornecedores',
    href: '/fornecedor',
    description: 'Gerencie fornecedores',
    icon: 'supplier',
    colorClass: 'purpleModule',
    roles: ['administrador', 'gerente'],
    visible: true
  },
  {
    id: 'saldoInicial',
    title: 'Saldo Inicial',
    href: '/saldoInicial',
    description: 'Configure saldos iniciais',
    icon: 'balance',
    colorClass: 'yellowModule',
    roles: ['administrador', 'gerente'],
    visible: true
  }
];

// Definição dos itens de navegação da navbar
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: '/kanban',
    label: 'Tarefas',
    icon: 'tasks',
    roles: ['administrador', 'gerente', 'usuario', 'analista'],
    visible: true
  },
  {
    href: '/estudos',
    label: 'Estudos',
    icon: 'studies',
    roles: ['administrador', 'gerente', 'analista', 'usuarioExterno'],
    visible: true
  },
  {
    href: '/extrato',
    label: 'Extrato bancário',
    icon: 'bank',
    roles: ['administrador', 'gerente', 'usuario', 'analista', 'usuarioExterno'],
    visible: true
  },
  {
    href: '/configuracaoCliente',
    label: 'Configuração de Cliente',
    icon: 'client',
    roles: ['administrador', 'gerente'],
    visible: true
  },
  {
    href: '/configuracaoUsuario',
    label: 'Configuração de Usuário',
    icon: 'user',
    roles: ['administrador'],
    visible: true
  },
  {
    href: '/chamados',
    label: 'Reportar Falha',
    icon: 'bug',
    roles: ['administrador', 'gerente', 'usuario', 'analista', 'usuarioExterno'
    ],
    visible: true
  },
  {
    href: '/gestaoAssas',
    label: 'Gestão Asaas',
    icon: 'asaas',
    roles: ['administrador', 'gerente'],
    visible: true
  }
];

// Subitens do menu Estudos
export const ESTUDOS_SUBITEMS = [
  { href: '/estudos/resumoMensal', label: 'Resumo Mensal', icon: '📊' },
  { href: '/estudos/resumo-financeiro', label: 'Resumo Financeiro', icon: '💰' },
  { href: '/estudos/resumo-anual', label: 'Resumo Anual', icon: '📈' },
  { href: '/estudos/resumo-faturamento', label: 'Resumo Faturamento Mensal', icon: '📋' },
  { href: '/estudos/resumo-conta', label: 'Resumo da Conta', icon: '🏦' },
  { href: '/estudos/metas', label: 'Metas', icon: '🎯' }
];

// Função para filtrar módulos por role
export function getModulesByRole(userRole: string | undefined): ModulePermission[] {
  if (!userRole) return [];
  
  return AVAILABLE_MODULES.filter(module => 
    module.roles.includes(userRole) && module.visible
  );
}

// Função para filtrar itens de navegação por role
export function getNavigationByRole(userRole: string | undefined): NavigationItem[] {
  if (!userRole) return [];
  
  return NAVIGATION_ITEMS.filter(item => 
    item.roles.includes(userRole) && item.visible
  );
}

// Função para verificar se um usuário tem acesso a um módulo específico
export function hasModuleAccess(userRole: string | undefined, moduleId: string): boolean {
  if (!userRole) return false;
  
  const foundModule = AVAILABLE_MODULES.find(m => m.id === moduleId);
  return foundModule ? foundModule.roles.includes(userRole) && foundModule.visible : false;
}

// Função para verificar se um usuário tem acesso a uma rota específica
export function hasRouteAccess(userRole: string | undefined, route: string): boolean {
  if (!userRole) return false;
  
  // Verifica se a rota está nos módulos
  const foundModule = AVAILABLE_MODULES.find(m => m.href === route);
  if (foundModule) {
    return foundModule.roles.includes(userRole) && foundModule.visible;
  }
  
  // Verifica se a rota está na navegação
  const navItem = NAVIGATION_ITEMS.find(n => n.href === route);
  if (navItem) {
    return navItem.roles.includes(userRole) && navItem.visible;
  }
  
  // Verifica rotas de estudos
  if (route.startsWith('/estudos/')) {
    return ['administrador', 'gerente', 'analista'].includes(userRole);
  }
  
  return false;
}

// Roles disponíveis no sistema
export const AVAILABLE_ROLES = [
  'administrador',      // Administrador - acesso total
  'gerente',    // Gerente - acesso a maioria dos módulos
  'analista',   // Analista - acesso a módulos de análise
  'usuario',
  'usuario externo'     // Usuário básico - acesso limitado
];

// Descrições dos roles
export const ROLE_DESCRIPTIONS = {
  administrador: 'Administrador - Acesso total ao sistema',
  gerente: 'Gerente - Acesso à maioria dos módulos',
  analista: 'Analista - Acesso a módulos de análise e relatórios',
  usuario: 'Usuário - Acesso básico limitado',
  usuarioExterno: 'Usuário externo - Acesso a módulos de análise e relatórios'
};
