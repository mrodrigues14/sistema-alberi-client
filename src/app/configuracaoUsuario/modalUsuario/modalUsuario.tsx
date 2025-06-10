import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { Usuario } from "../../../../types/Usuario";
import { remove as removeAccents } from "diacritics"; // instalar com: npm install diacritics

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (usuario: Usuario) => void;
  usuario?: Usuario | null;
}

export default function ModalUsuario({ open, onClose, onSave, usuario }: Props) {
  const [formData, setFormData] = useState<Omit<Usuario, "idusuarios" | "usuarioLogin"> & { senha?: string }>({
    nomeDoUsuario: "",
    cpf: "",
    usuarioEmail: "",
    role: "",
    senha: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    if (usuario) {
      const roleNormalizado = removeAccents(usuario.role?.toLowerCase() || "");
      setFormData({
        nomeDoUsuario: usuario.nomeDoUsuario || "",
        cpf: usuario.cpf || "",
        usuarioEmail: usuario.usuarioEmail || "",
        role: roleNormalizado,
        senha: "", // senha não vem preenchida
      });
    } else {
      limparFormulario();
    }
  }, [usuario, open]);

  const limparFormulario = () => {
    setFormData({
      nomeDoUsuario: "",
      cpf: "",
      usuarioEmail: "",
      role: "usuario",
      senha: "",
    });
  };

  if (!open) return null;

  const handleChange = (field: keyof typeof formData, value: string) => {
    if (field === "cpf") value = value.replace(/[^\d]/g, "").slice(0, 11);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalvar = () => {
    if (!formData.nomeDoUsuario || !formData.usuarioEmail || !formData.senha) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const usuarioParaSalvar: Usuario = {
      ...formData,
      idusuarios: usuario?.idusuarios || Math.floor(Math.random() * 10000),
      usuarioLogin: "", // se necessário, pode ser preenchido com base no nome/email
    };

    onSave(usuarioParaSalvar);
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
              placeholder="Senha"
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
