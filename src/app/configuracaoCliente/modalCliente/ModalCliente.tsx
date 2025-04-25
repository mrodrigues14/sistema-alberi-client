import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Cliente } from "../../../../types/Cliente";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (cliente: Cliente) => void;
  cliente?: Cliente | null;
}

export default function ModalCliente({ open, onClose, onSave, cliente }: Props) {
  const [formData, setFormData] = useState<Omit<Cliente, "idcliente" | "ativo">>({
    nome: "",
    apelido: "",
    telefone: "",
    email: "",
    endereco: "",
    cep: "",
    cpf: "",
    cnpj: "",
    nomeResponsavel: "",
    cpfResponsavel: "",
    inscricaoEstadual: "",
    cnaePrincipal: "",
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome,
        apelido: cliente.apelido || "",
        telefone: cliente.telefone || "",
        email: cliente.email || "",
        endereco: cliente.endereco || "",
        cep: cliente.cep || "",
        cpf: cliente.cpf || "",
        cnpj: cliente.cnpj || "",
        nomeResponsavel: cliente.nomeResponsavel || "",
        cpfResponsavel: cliente.cpfResponsavel || "",
        inscricaoEstadual: cliente.inscricaoEstadual || "",
        cnaePrincipal: cliente.cnaePrincipal || "",
      });
    } else {
      // Se não tiver cliente (é um novo cadastro), limpa o form
      limparFormulario();
    }
  }, [cliente, open]);

  const limparFormulario = () => {
    setFormData({
      nome: "",
      apelido: "",
      telefone: "",
      email: "",
      endereco: "",
      cep: "",
      cpf: "",
      cnpj: "",
      nomeResponsavel: "",
      cpfResponsavel: "",
      inscricaoEstadual: "",
      cnaePrincipal: "",
    });
  };

  if (!open) return null;

  const handleChange = (field: keyof typeof formData, value: string) => {
    if (field === "cpf" || field === "cnpj" || field === "cpfResponsavel") {
      value = value.replace(/[^\d.-/]/g, ""); // permite apenas números, pontos, barras e hífens
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSalvar = () => {
    if (!formData.nome || (!formData.cpf && !formData.cnpj)) {
      alert("Preencha o nome e o CPF/CNPJ");
      return;
    }

    const clienteParaSalvar: Cliente = {
      ...formData,
      idcliente: cliente?.idcliente || Math.floor(Math.random() * 10000),
      ativo: cliente?.ativo ?? true,
    };

    onSave(clienteParaSalvar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={onClose}>
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-4">{cliente ? "Editar Cliente" : "Adicionar Novo Cliente"}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Nome"
            className="border px-3 py-2 rounded"
            value={formData.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
          />
          <input
            placeholder="Apelido"
            className="border px-3 py-2 rounded"
            value={formData.apelido}
            onChange={(e) => handleChange("apelido", e.target.value)}
          />
          <input
            placeholder="Telefone"
            className="border px-3 py-2 rounded"
            value={formData.telefone}
            onChange={(e) => handleChange("telefone", e.target.value)}
          />
          <input
            placeholder="Email"
            className="border px-3 py-2 rounded"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <input
            placeholder="Endereço"
            className="border px-3 py-2 rounded"
            value={formData.endereco}
            onChange={(e) => handleChange("endereco", e.target.value)}
          />
          <input
            placeholder="CEP"
            className="border px-3 py-2 rounded"
            value={formData.cep}
            onChange={(e) => handleChange("cep", e.target.value)}
          />
          <input
            placeholder="CPF"
            className="border px-3 py-2 rounded"
            value={formData.cpf}
            onChange={(e) => handleChange("cpf", e.target.value)}
          />
          <input
            placeholder="CNPJ"
            className="border px-3 py-2 rounded"
            value={formData.cnpj}
            onChange={(e) => handleChange("cnpj", e.target.value)}
          />
          <input
            placeholder="Nome do Responsável"
            className="border px-3 py-2 rounded"
            value={formData.nomeResponsavel}
            onChange={(e) => handleChange("nomeResponsavel", e.target.value)}
          />
          <input
            placeholder="CPF do Responsável"
            className="border px-3 py-2 rounded"
            value={formData.cpfResponsavel}
            onChange={(e) => handleChange("cpfResponsavel", e.target.value)}
          />
          <input
            placeholder="Inscrição Estadual"
            className="border px-3 py-2 rounded"
            value={formData.inscricaoEstadual}
            onChange={(e) => handleChange("inscricaoEstadual", e.target.value)}
          />
          <input
            placeholder="CNAE Principal"
            className="border px-3 py-2 rounded"
            value={formData.cnaePrincipal}
            onChange={(e) => handleChange("cnaePrincipal", e.target.value)}
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
