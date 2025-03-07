import React, { useRef, useEffect } from 'react';
import './Dropdown.css';

interface DropdownProps {
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ onClose, className, children }) => {
  const dropRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: MouseEvent) => {
    if (dropRef.current && !dropRef.current.contains(event.target as Node) && onClose) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [onClose]);

  return (
    <div ref={dropRef} className={`dropdown ${className || ''}`}>
      {children}
    </div>
  );
};

export default Dropdown;
