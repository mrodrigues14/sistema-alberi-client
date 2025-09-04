'use client';

import { usePermissions } from "@/lib/hooks/usePermissions";
import { AVAILABLE_MODULES, AVAILABLE_ROLES, ROLE_DESCRIPTIONS } from "@/lib/permissions";
import Navbar from "@/components/Navbar";

export default function TestePermissoesPage() {
  const { 
    userRole, 
    userModules, 
    userNavigation, 
    getRoleDescription, 
    getPermissionStats,
    canAccessModule,
    canAccessRoute,
    isAdmin,
  isInternal,
  isExternal
  } = usePermissions();

  const stats = getPermissionStats();

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Teste de Permissões
            </h1>
            <p className="text-gray-600">
              Página para testar e visualizar o sistema de permissões baseado em roles
            </p>
          </div>

          {/* Status do usuário */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Status do Usuário</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-600">Role Atual</p>
                <p className="text-2xl font-bold text-blue-900">{userRole || 'Não definido'}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-600">Módulos Acessíveis</p>
                <p className="text-2xl font-bold text-green-900">{stats.accessibleModules}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-600">Navegação Acessível</p>
                <p className="text-2xl font-bold text-purple-900">{stats.accessibleNavigation}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm font-medium text-orange-600">Total de Módulos</p>
                <p className="text-2xl font-bold text-orange-900">{stats.totalModules}</p>
              </div>
            </div>
            
            {userRole && (
              <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Descrição:</strong> {getRoleDescription()}
                </p>
              </div>
            )}
          </div>

          {/* Verificações de permissão */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Verificações de Permissão</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${isAdmin() ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm font-medium mb-2">É Administrador?</p>
                <p className={`text-lg font-bold ${isAdmin() ? 'text-green-900' : 'text-red-900'}`}>
                  {isAdmin() ? '✅ Sim' : '❌ Não'}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isInternal() ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm font-medium mb-2">É Usuário Interno?</p>
                <p className={`text-lg font-bold ${isInternal() ? 'text-green-900' : 'text-red-900'}`}>
                  {isInternal() ? '✅ Sim' : '❌ Não'}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isExternal() ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm font-medium mb-2">É Usuário Externo?</p>
                <p className={`text-lg font-bold ${isExternal() ? 'text-green-900' : 'text-red-900'}`}>
                  {isExternal() ? '✅ Sim' : '❌ Não'}
                </p>
              </div>
            </div>
          </div>

          {/* Módulos disponíveis para o usuário */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Módulos Disponíveis para Você</h2>
            {userModules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userModules.map((module) => (
                  <div key={module.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{module.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {module.id}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Rota: {module.href}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {module.colorClass || 'padrão'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum módulo disponível para seu role</p>
              </div>
            )}
          </div>

          {/* Navegação disponível para o usuário */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Navegação Disponível para Você</h2>
            {userNavigation.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userNavigation.map((item) => (
                  <div key={item.href} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{item.label}</h3>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {item.icon}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Rota: {item.href}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum item de navegação disponível para seu role</p>
              </div>
            )}
          </div>

          {/* Todos os módulos do sistema (para referência) */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Todos os Módulos do Sistema</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Módulo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roles Permitidos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seu Acesso
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {AVAILABLE_MODULES.map((module) => (
                    <tr key={module.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{module.title}</div>
                        <div className="text-sm text-gray-500">{module.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {module.href}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {module.roles.map((role) => (
                            <span
                              key={role}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                role === userRole
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            canAccessModule(module.id)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {canAccessModule(module.id) ? '✅ Acesso' : '❌ Negado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Roles disponíveis no sistema */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Roles Disponíveis no Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_ROLES.map((role) => (
                <div key={role} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 capitalize">{role}</h3>
                    {role === userRole && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Seu Role
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
