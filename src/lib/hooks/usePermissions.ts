import { useSession } from 'next-auth/react';
import { 
  getModulesByRole, 
  getNavigationByRole, 
  hasModuleAccess, 
  hasRouteAccess,
  AVAILABLE_ROLES,
  AVAILABLE_MODULES,
  ROLE_DESCRIPTIONS,
  type ModulePermission,
  type NavigationItem
} from '../permissions';

export function usePermissions() {
  const { data: session } = useSession();
  
  // Obtém o role do usuário da sessão
  const userRole = session?.user?.role;
  
  // Obtém os módulos que o usuário pode acessar
  const userModules = getModulesByRole(userRole);
  
  // Obtém os itens de navegação que o usuário pode acessar
  const userNavigation = getNavigationByRole(userRole);
  
  // Verifica se o usuário tem acesso a um módulo específico
  const canAccessModule = (moduleId: string): boolean => {
    return hasModuleAccess(userRole, moduleId);
  };
  
  // Verifica se o usuário tem acesso a uma rota específica
  const canAccessRoute = (route: string): boolean => {
    return hasRouteAccess(userRole, route);
  };
  
  // Verifica se o usuário tem um role específico
  const hasRole = (role: string): boolean => {
    return userRole === role;
  };
  
  // Verifica se o usuário tem pelo menos um dos roles especificados
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.includes(userRole || '');
  };
  
  // Verifica se o usuário tem todos os roles especificados
  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every(role => userRole === role);
  };
  
  // Obtém o nome do role do usuário
  const getRoleName = (): string => {
    return userRole || 'sem_role';
  };
  
  // Obtém a descrição do role do usuário
  const getRoleDescription = (): string => {
    return userRole && userRole in ROLE_DESCRIPTIONS 
      ? ROLE_DESCRIPTIONS[userRole as keyof typeof ROLE_DESCRIPTIONS] 
      : 'Role não definido';
  };
  
  // Verifica se o usuário é administrador
  const isAdmin = (): boolean => userRole === 'administrador';

  // Verifica se o usuário é interno (níveis internos, incluindo restrito)
  const isInternal = (): boolean => ['usuario interno', 'usuario interno (restrito)'].includes(userRole || '');

  // Verifica se o usuário é externo
  const isExternal = (): boolean => ['usuario externo (consulta)', 'usuario externo (financeiro)'].includes(userRole || '');
  
  // Filtra uma lista de itens baseado nas permissões do usuário
  const filterByPermissions = <T extends { roles?: string[] }>(items: T[]): T[] => {
    if (!userRole) return [];
    return items.filter(item => !item.roles || item.roles.includes(userRole));
  };
  
  // Obtém estatísticas das permissões do usuário
  const getPermissionStats = () => {
    return {
      totalModules: AVAILABLE_MODULES.length,
      accessibleModules: userModules.length,
  totalNavigation: getNavigationByRole('administrador').length, // Compara com administrador
      accessibleNavigation: userNavigation.length,
      role: userRole,
      roleDescription: getRoleDescription()
    };
  };
  
  return {
    // Estado do usuário
    userRole,
    isAuthenticated: !!session,
    
    // Módulos e navegação
    userModules,
    userNavigation,
    
    // Funções de verificação de permissão
    canAccessModule,
    canAccessRoute,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    
    // Informações do role
    getRoleName,
    getRoleDescription,
    
    // Verificações de nível de acesso
    isAdmin,
  isInternal,
  isExternal,
    
    // Utilitários
    filterByPermissions,
    getPermissionStats,
    
    // Roles disponíveis (para referência)
    availableRoles: AVAILABLE_ROLES
  };
}
