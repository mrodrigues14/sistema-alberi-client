import React from "react";
import "./NavbarKanban.css";

interface NavbarProps {
  switchTheme: () => void;
}

const NavbarKanban: React.FC<NavbarProps> = (props) => {
  return (
    <div className="navbar">
      <h2>Kanban Board</h2>
      <div>
        <input
          type="checkbox"
          className="checkbox"
          id="checkbox"
          style={{ transition: "all 200ms" }}
          onChange={props.switchTheme}
        />
        <label htmlFor="checkbox" className="label">
          <i className="fas fa-moon fa-sm"></i>
          <i className="fas fa-sun fa-sm"></i>
          <div className="ball" />
        </label>
      </div>
      {/* <button>Switch theme</button> */}
    </div>
  );
};

export default NavbarKanban;