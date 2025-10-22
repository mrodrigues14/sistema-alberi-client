"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface CustomDropdownProps<T = { label: string; value: string | number }> {
  label: string;
  options: Option[];
  selectedValue: T;
  onSelect: (value: T) => void;
  allowSearch?: boolean;
  type?: "rubrica" | "rubricaContabil" | "fornecedor";
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
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
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
  const computeMenuPosition = () => {
    const trigger = dropdownRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    // Using fixed positioning: use viewport coordinates directly (no scroll offsets)
    setMenuStyle({
      top: rect.bottom,
      left: rect.left,
      width: rect.width,
    });
  };

  const handleDropdownToggle = () => {
    const next = !showOptions;
    setShowOptions(next);
    if (next) {
      computeMenuPosition();
      if (allowSearch) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const triggerContains = dropdownRef.current?.contains(target);
      const menuContains = menuRef.current?.contains(target);
      if (!triggerContains && !menuContains) {
        setShowOptions(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowOptions(false);
      }
    };

    const handleScrollOrResize = () => {
      if (showOptions) computeMenuPosition();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [showOptions]);
  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown principal */}
      <div
        className={`border rounded w-full px-2 py-1 bg-white cursor-pointer transition-all ${selectedValue ? "text-black font-medium" : "text-gray-500"
          }`}
        onClick={handleDropdownToggle}
      >
        {options.find((opt) => opt.label === selectedValue.label)?.label || label}
      </div>

      {/* Opções do Dropdown via portal */}
      {showOptions && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: menuStyle.top, left: menuStyle.left, width: menuStyle.width, zIndex: 10000 }}
          className="bg-white border rounded shadow-md mt-1"
        >
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

          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(({ label, value, disabled }, index) => (
                <div
                  key={index}
                  className={`px-2 py-1 ${disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"}`}
                  onMouseDown={() => handleSelect({ label, value }, disabled)}
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
                  {type === "rubrica"
                    ? "Adicionar Rubrica"
                    : type === "rubricaContabil"
                      ? "Adicionar Rubrica Contábil"
                      : "Adicionar Fornecedor"}
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[800px]">
            <h2 className="text-xl font-bold mb-4">
              {type === "rubrica"
                ? "Adicionar Rubrica"
                : type === "rubricaContabil"
                  ? "Adicionar Rubrica Contábil"
                  : "Adicionar "}
            </h2>
            <iframe
              src={
                type === "rubrica"
                  ? "/categoria"
                  : type === "rubricaContabil"
                    ? "/categoria"
                    : "/fornecedor"
              }
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
