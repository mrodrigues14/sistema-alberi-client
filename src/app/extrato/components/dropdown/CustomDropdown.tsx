"use client";

import React, { useState, useRef, useEffect } from "react";

interface CustomDropdownProps {
  label: string;
  options: { label: string; value: any; disabled?: boolean }[];
  selectedValue: any;
  onSelect: (value: any) => void;
  allowSearch?: boolean;
  type?: "rubrica" | "fornecedor"; // 🔹 Define se é um dropdown de rubrica ou fornecedor
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  allowSearch = true,
  type,
}) => {
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(
    [...options].sort((a, b) => a.label.localeCompare(b.label))
  );
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false); // 🔹 Estado para o modal
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSelect = (value: any, disabled?: boolean) => {
    if (disabled) return;
    onSelect(value);
    setShowOptions(false);
    setSearch("");
  };

  const handleDropdownToggle = () => {
    setShowOptions(!showOptions);
    if (allowSearch) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTimeout(() => setShowOptions(false), 100);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown principal */}
      <div
        className={`border rounded w-full px-2 py-1 bg-white cursor-pointer transition-all ${
          selectedValue ? "text-black font-medium" : "text-gray-500"
        }`}
        onClick={handleDropdownToggle}
      >
        {options.find((opt) => opt.value === selectedValue)?.label || label}
      </div>

      {/* Opções do Dropdown */}
      {showOptions && (
        <div className="absolute bg-white border rounded shadow-md mt-1 w-full z-50">
          {allowSearch && (
            <input
              ref={inputRef}
              type="text"
              className="border-b w-full px-2 py-1"
              placeholder="Pesquisar..."
              value={search}
              onChange={handleSearch}
              autoFocus
            />
          )}

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(({ label, value, disabled }, index) => (
                <div
                  key={index}
                  className={`px-2 py-1 ${
                    disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"
                  }`}
                  onMouseDown={() => handleSelect(value, disabled)}
                >
                  {label}
                </div>
              ))
            ) : (
              <div className="px-2 py-2 flex justify-center">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  onClick={() => setShowModal(true)}
                >
                  {type === "rubrica" ? "Adicionar Rubrica" : "Adicionar Fornecedor"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal para adicionar rubrica ou fornecedor */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[800px]">
            <h2 className="text-xl font-bold mb-4">
              {type === "rubrica" ? "Adicionar Rubrica" : "Adicionar Fornecedor"}
            </h2>
            <iframe
              src={type === "rubrica" ? "/categoria" : "/fornecedor"}
              className="w-full h-[600px] border-none"
            ></iframe>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => setShowModal(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
