import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Draggable = ({ id, onDrag, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = d3.select(ref.current);
    const drag = d3.drag()
      .on("start", (event) => {})
      .on("drag", (event) => {
        onDrag(event);
        element.attr("transform", `translate(${event.x},${event.y})`);
      })
      .on("end", (event) => {});

    element.call(drag);
  }, [onDrag]);

  return (
    <g ref={ref} id={id}>
      {children}
    </g>
  );
};

export default Draggable;
