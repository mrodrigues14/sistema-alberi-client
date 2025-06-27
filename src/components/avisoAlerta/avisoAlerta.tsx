import { useEffect, useState } from "react";

interface AvisoAlertaProps {
  mensagem: string;
  tipo?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
  duracao?: number;
  onClose?: () => void;
}

export default function AvisoAlerta({ mensagem, tipo = "danger", duracao = 5000, onClose }: AvisoAlertaProps) {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (mensagem) {
      setShow(false);
      setTimeout(() => setShow(true), 50);
      setProgress(100);

      const interval = setInterval(() => {
        setProgress((prev) => Math.max(prev - 100 / (duracao / 100), 0));
      }, 100);

      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, duracao);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [mensagem, duracao, onClose]);

  const getColorClasses = () => {
    switch (tipo) {
      case "success":
        return {
          bg: "bg-green-500",
          border: "border-green-600",
          text: "text-white",
          progress: "bg-green-300"
        };
      case "danger":
        return {
          bg: "bg-red-500",
          border: "border-red-600",
          text: "text-white",
          progress: "bg-red-300"
        };
      case "warning":
        return {
          bg: "bg-yellow-500",
          border: "border-yellow-600",
          text: "text-white",
          progress: "bg-yellow-300"
        };
      case "info":
        return {
          bg: "bg-blue-500",
          border: "border-blue-600",
          text: "text-white",
          progress: "bg-blue-300"
        };
      case "primary":
        return {
          bg: "bg-blue-600",
          border: "border-blue-700",
          text: "text-white",
          progress: "bg-blue-300"
        };
      default:
        return {
          bg: "bg-red-500",
          border: "border-red-600",
          text: "text-white",
          progress: "bg-red-300"
        };
    }
  };

  const colors = getColorClasses();

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 p-3">
      <div 
        className={`
          ${colors.bg} ${colors.border} ${colors.text}
          min-w-80 max-w-sm rounded-lg shadow-lg border
          transform transition-all duration-300 ease-in-out
          ${show ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3 pb-2">
          <strong className="text-sm font-medium">
            {tipo === "success" ? "✅ Sucesso" : "⚠️ Aviso"}
          </strong>
          <button
            onClick={() => setShow(false)}
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="px-3 pb-3">
          <p className="text-sm">{mensagem}</p>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-black bg-opacity-20 rounded-b-lg overflow-hidden">
          <div 
            className={`h-full ${colors.progress} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
