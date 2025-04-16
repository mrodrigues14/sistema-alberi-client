import { Cliente } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (cliente: Cliente) => void;
  }

  export default function ModalAdicionarCliente({ open, onClose, onSave }: Props) {
    const [documento, setDocumento] = useState("");
    const [tipo, setTipo] = useState<"CPF" | "CNPJ" | null>(null);
  
    const [nome, setNome] = useState("");
    const [apelido, setApelido] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [endereco, setEndereco] = useState("");
    const [cep, setCep] = useState("");
  
    // Somente CNPJ
    const [nomeResponsavel, setNomeResponsavel] = useState("");
    const [cpfResponsavel, setCpfResponsavel] = useState("");
    const [inscricaoEstadual, setInscricaoEstadual] = useState("");
    const [cnaePrincipal, setCnaePrincipal] = useState("");
  
    useEffect(() => {
      if (!documento) {
        setTipo(null);
      } else if (documento.length <= 11) {
        setTipo("CPF");
      } else {
        setTipo("CNPJ");
      }
    }, [documento]);
  
    if (!open) return null;
  
    const handleSalvar = () => {
      if (!nome || !documento) {
        alert("Preencha os campos obrigatórios");
        return;
      }
    
      const novoCliente: Cliente = {
        idcliente: Math.floor(Math.random() * 10000), 
        nome,
        apelido,
        telefone,
        email,
        endereco,
        cep,
        cpf: tipo === "CPF" ? documento : null,
        cnpj: tipo === "CNPJ" ? documento : null,
        nome_responsavel: tipo === "CNPJ" ? nomeResponsavel : null,
        cpf_responsavel: tipo === "CNPJ" ? cpfResponsavel : null,
        inscricao_estadual: tipo === "CNPJ" ? inscricaoEstadual : null,
        cnae_principal: tipo === "CNPJ" ? cnaePrincipal : null,
        ativo: true,
        socio: []
      };
    
      onSave(novoCliente);
      onClose();
    };
    
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
            onClick={onClose}
          >
            <FaTimes />
          </button>
  
          <h2 className="text-xl font-bold mb-4">Adicionar Novo Cliente</h2>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">CPF/CNPJ *</label>
              <input
                type="text"
                value={documento}
                onChange={(e) => setDocumento(e.target.value.replace(/\D/g, ""))}
                className="w-full border px-3 py-2 rounded"
                placeholder="Apenas números"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium">Nome *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Razão social ou nome"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium">Apelido</label>
              <input
                type="text"
                value={apelido}
                onChange={(e) => setApelido(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium">Telefone</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium">Endereço</label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium">CEP</label>
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
  
            {tipo === "CNPJ" && (
              <>
                <div>
                  <label className="block text-sm font-medium">Nome do Responsável</label>
                  <input
                    type="text"
                    value={nomeResponsavel}
                    onChange={(e) => setNomeResponsavel(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium">CPF do Responsável</label>
                  <input
                    type="text"
                    value={cpfResponsavel}
                    onChange={(e) => setCpfResponsavel(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium">Inscrição Estadual</label>
                  <input
                    type="text"
                    value={inscricaoEstadual}
                    onChange={(e) => setInscricaoEstadual(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium">CNAE Principal</label>
                  <input
                    type="text"
                    value={cnaePrincipal}
                    onChange={(e) => setCnaePrincipal(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </>
            )}
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
