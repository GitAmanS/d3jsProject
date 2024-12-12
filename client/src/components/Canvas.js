import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Canvas = ({ children }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(canvasRef.current);
    const zoom = d3.zoom().on("zoom", (event) => {
      svg.select("g").attr("transform", event.transform);
    });

    svg.call(zoom).append("g");
  }, []);

  return (
    <svg ref={canvasRef} width="100%" height="500px" style={{ border: "1px solid black" }}>
      <g>{children}</g>
    </svg>
  );
};

export default Canvas;
