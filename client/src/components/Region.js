import React from "react";
import Draggable from "./Draggable";

const Region = ({ id, position, size, color, onDrag }) => {
  return (
    <Draggable id={id} onDrag={onDrag}>
      <rect
        x={position.x}
        y={position.y}
        width={size}
        height={size}
        fill={color}
        stroke="black"
        strokeWidth="2"
      />
    </Draggable>
  );
};

export default Region;
