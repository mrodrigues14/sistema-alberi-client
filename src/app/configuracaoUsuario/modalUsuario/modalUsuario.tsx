import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Usuario } from "../../../../types/Usuario";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (usuario: Usuario) => void;
  usuario?: Usuario | null;
}

export default function ModalUsuario({ open, onClose, onSave, usuario }: Props) {
  const [formData, setFormData] = useState<Omit<Usuario, "idusuarios">>({
    nomeDoUsuario: "",
    usuarioLogin: "",
    cpf: "",
    usuarioEmail: "",
    role: "usuario",
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nomeDoUsuario: usuario.nomeDoUsuario || "",
        usuarioLogin: usuario.usuarioLogin || "",
        cpf: usuario.cpf || "",
        usuarioEmail: usuario.usuarioEmail || "",
        role: usuario.role || "usuario",
      });
    } else {
      limparFormulario();
    }
  }, [usuario, open]);

  const limparFormulario = () => {
    setFormData({
      nomeDoUsuario: "",
      usuarioLogin: "",
      cpf: "",
      usuarioEmail: "",
      role: "usuario",
    });
  };

  if (!open) return null;

  const handleChange = (field: keyof typeof formData, value: string) => {
    if (field === "cpf") value = value.replace(/[^\d]/g, "").slice(0, 11);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalvar = () => {
    if (!formData.nomeDoUsuario || !formData.usuarioLogin || !formData.usuarioEmail) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const usuarioParaSalvar: Usuario = {
      ...formData,
      idusuarios: usuario?.idusuarios || Math.floor(Math.random() * 10000),
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
            placeholder="Login"
            className="border px-3 py-2 rounded"
            value={formData.usuarioLogin}
            onChange={(e) => handleChange("usuarioLogin", e.target.value)}
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
