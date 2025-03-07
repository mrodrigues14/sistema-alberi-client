import React from "react";
import "./Tag.css";

interface TagProps {
  color?: string;
  tagName?: string;
}

const Tag: React.FC<TagProps> = (props) => {
  return (
    <span className="tag" style={{ backgroundColor: `${props?.color}` }}>
      {props?.tagName}
    </span>
  );
};

export default Tag;