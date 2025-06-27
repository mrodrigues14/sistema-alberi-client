import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { Usuario } from "../../../../types/Usuario";
import { Cliente } from "../../../../types/Cliente";
import { remove as removeAccents } from "diacritics"; // instalar com: npm install diacritics
import { useCliente } from "@/lib/hooks/useCliente";
import { useClientesDoUsuario, updateClientesDoUsuario } from "@/lib/hooks/useRelacaoUsuarioCliente";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (usuario: Usuario) => void;
  usuario?: Usuario | null;
}

export default function ModalUsuario({ open, onClose, onSave, usuario }: Props) {
  const { clientes } = useCliente();
  const { clientesVinculados, mutate: mutateClientesVinculados } = useClientesDoUsuario(usuario?.idusuarios);
  
  const [formData, setFormData] = useState<Omit<Usuario, "idusuarios" | "usuarioLogin"> & { senha?: string; confirmarSenha?: string }>({
    nomeDoUsuario: "",
    cpf: "",
    usuarioEmail: "",
    role: "",
    senha: "",
    confirmarSenha: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [clientesSelecionados, setClientesSelecionados] = useState<number[]>([]);
  const [clientesOriginais, setClientesOriginais] = useState<number[]>([]);
  const [showClientesSection, setShowClientesSection] = useState(false);

  useEffect(() => {
    if (usuario) {
      const roleNormalizado = removeAccents(usuario.role?.toLowerCase() || "");
      setFormData({
        nomeDoUsuario: usuario.nomeDoUsuario || "",
        cpf: usuario.cpf || "",
        usuarioEmail: usuario.usuarioEmail || "",
        role: roleNormalizado,
        senha: "", // senha não vem preenchida
        confirmarSenha: "",
      });
      setShowClientesSection(true);
    } else {
      // Limpar formulário diretamente sem chamar a função
      setFormData({
        nomeDoUsuario: "",
        cpf: "",
        usuarioEmail: "",
        role: "usuario",
        senha: "",
        confirmarSenha: "",
      });
      setClientesSelecionados([]);
      setShowClientesSection(true);
    }
  }, [usuario, open]);

  // Efeito separado para carregar clientes vinculados
  useEffect(() => {
    if (usuario?.idusuarios && clientesVinculados && Array.isArray(clientesVinculados)) {
      const clienteIds = clientesVinculados.map((c: Cliente) => c.idcliente);
      setClientesSelecionados(clienteIds);
      setClientesOriginais(clienteIds); // Salva o estado original
    }
  }, [usuario?.idusuarios, clientesVinculados]);

  const limparFormulario = () => {
    setFormData({
      nomeDoUsuario: "",
      cpf: "",
      usuarioEmail: "",
      role: "usuario",
      senha: "",
      confirmarSenha: "",
    });
    setClientesSelecionados([]);
  };

  if (!open) return null;

  const handleChange = (field: keyof typeof formData, value: string) => {
    if (field === "cpf") value = value.replace(/[^\d]/g, "").slice(0, 11);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleClienteSelection = (clienteId: number) => {
    setClientesSelecionados(prev => 
      prev.includes(clienteId)
        ? prev.filter(id => id !== clienteId)
        : [...prev, clienteId]
    );
  };

  // Filtrar clientes ativos
  const clientesAtivos = clientes?.filter((cliente: Cliente) => cliente.ativo === 1) || [];

  const handleSalvar = async () => {
    // Validação básica
    if (!formData.nomeDoUsuario || !formData.usuarioEmail) {
      alert("Preencha todos os campos obrigatórios (Nome e Email).");
      return;
    }

    // Validação de senha para novos usuários
    if (!usuario && !formData.senha) {
      alert("Senha é obrigatória para novos usuários.");
      return;
    }

    // Validação de confirmação de senha se senha foi preenchida
    if (formData.senha && formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    // Preparar dados do usuário (só incluir senha se foi preenchida)
    const usuarioParaSalvar: Usuario = {
      nomeDoUsuario: formData.nomeDoUsuario,
      cpf: formData.cpf,
      usuarioEmail: formData.usuarioEmail,
      role: formData.role,
      idusuarios: usuario?.idusuarios || Math.floor(Math.random() * 10000),
      usuarioLogin: "", // se necessário, pode ser preenchido com base no nome/email
    };

    // Só incluir senha se foi preenchida
    if (formData.senha) {
      (usuarioParaSalvar as any).senha = formData.senha;
    }

    try {
      // Primeiro salva o usuário
      await onSave(usuarioParaSalvar);
      
      // Para usuários existentes, verifica se houve mudanças nos clientes
      if (usuario?.idusuarios) {
        const clientesMudaram = JSON.stringify([...clientesSelecionados].sort()) !== 
                              JSON.stringify([...clientesOriginais].sort());
        
        if (clientesMudaram) {
          console.log("Atualizando relações de clientes...");
          await updateClientesDoUsuario(usuario.idusuarios, clientesSelecionados);
          await mutateClientesVinculados();
          console.log("Relações atualizadas com sucesso!");
        } else {
          console.log("Nenhuma mudança nos clientes detectada.");
        }
      }
      
      // Fechar modal após sucesso
      onClose();
      
    } catch (error) {
      console.error("Erro ao salvar usuário e relações:", error);
      alert("Erro ao salvar usuário. Tente novamente.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative overflow-y-auto max-h-[90vh]">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={onClose}>
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {usuario ? "Editar Usuário" : "Adicionar Novo Usuário"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Nome"
            className="border px-3 py-2 rounded"
            value={formData.nomeDoUsuario}
            onChange={(e) => handleChange("nomeDoUsuario", e.target.value)}
          />
          <input
            placeholder="Email"
            className="border px-3 py-2 rounded"
            value={formData.usuarioEmail}
            onChange={(e) => handleChange("usuarioEmail", e.target.value)}
          />
          <input
            placeholder="CPF"
            className="border px-3 py-2 rounded"
            value={formData.cpf}
            onChange={(e) => handleChange("cpf", e.target.value)}
          />
          <div className="relative">
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder={usuario ? "Nova senha (deixe vazio para não alterar)" : "Senha"}
              className="border px-3 py-2 pr-10 rounded w-full"
              value={formData.senha}
              onChange={(e) => handleChange("senha", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="relative">
            <input
              type={mostrarConfirmarSenha ? "text" : "password"}
              placeholder="Confirmar senha"
              className="border px-3 py-2 pr-10 rounded w-full"
              value={formData.confirmarSenha}
              onChange={(e) => handleChange("confirmarSenha", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setMostrarConfirmarSenha((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
            <select
              className="border px-3 py-2 rounded w-full"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <option value="administrador">Administrador</option>
              <option value="usuario interno">Usuário Interno</option>
              <option value="usuario externo">Usuário Externo</option>
              <option value="cliente">Cliente</option>
              <option value="configurador">Configurador</option>
            </select>
          </div>
        </div>

        {/* Seção de Gerenciamento de Clientes */}
        {showClientesSection && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Clientes Vinculados</h3>
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-50">
              {clientesAtivos.length > 0 ? (
                <div className="space-y-2">
                  {clientesAtivos.map((cliente: Cliente) => (
                    <label
                      key={cliente.idcliente}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        clientesSelecionados.includes(cliente.idcliente)
                          ? 'bg-blue-100 border-blue-200 border'
                          : 'bg-white hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={clientesSelecionados.includes(cliente.idcliente)}
                        onChange={() => toggleClienteSelection(cliente.idcliente)}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">
                          {cliente.apelido || cliente.nome}
                        </span>
                        {(cliente.cnpj || cliente.cpf) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {cliente.cnpj && `CNPJ: ${cliente.cnpj}`}
                            {cliente.cpf && `CPF: ${cliente.cpf}`}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Nenhum cliente ativo encontrado.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Adicione clientes no sistema para poder vinculá-los ao usuário.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-gray-600">
                Selecione os clientes que este usuário poderá acessar.
              </p>
              {clientesSelecionados.length > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {clientesSelecionados.length} selecionado{clientesSelecionados.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleSalvar}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
