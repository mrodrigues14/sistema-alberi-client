"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

interface CustomDropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  selectedValue,
  onSelect
}) => {
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showOptions, setShowOptions] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    setFilteredOptions(
      options.filter(option => option.toLowerCase().includes(value.toLowerCase()))
    );
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setShowOptions(false);
  };

  const handleDropdownPosition = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showOptions) {
      setShowOptions(false);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + 5, left: rect.left, width: rect.width });
    setShowOptions(true);
  };

  // ✅ Fecha dropdown ao clicar fora, mas permite seleção antes do fechamento
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => setShowOptions(false), 100); // 🔥 Delay para processar clique
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Campo de seleção */}
      <div
        className={`border rounded w-full px-2 py-1 bg-white cursor-pointer transition-all ${
          selectedValue ? "text-black font-medium" : "text-gray-500"
        }`}
        onClick={handleDropdownPosition} 
      >
        {selectedValue || label}
      </div>

      {/* Dropdown aparece no BODY */}
      {showOptions &&
        ReactDOM.createPortal(
          <div
            className="fixed bg-white border rounded shadow-md z-[9999] w-auto"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`
            }}
          >
            {/* Campo de pesquisa */}
            <input
              type="text"
              className="border-b w-full px-2 py-1"
              placeholder="Pesquisar..."
              value={search}
              onChange={handleSearch}
              autoFocus
            />

            {/* Opções filtradas */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                  onMouseDown={() => handleSelect(option)} 
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-2 py-1 text-gray-500">Nenhuma opção encontrada</div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default CustomDropdown;
