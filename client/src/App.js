import React, { useState } from 'react';
import * as d3 from 'd3';

const DraggableDiv = ({ id, width, height, className, onDelete, x, y, onRightClick, updatePosition }) => {
  const divRef = React.useRef();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const data = { x, y };
    const div = d3.select(divRef.current)
      .data([data])
      .call(
        d3.drag()
          .on('start', function () {
            d3.select(this).classed('bg-orange-400', true);
          })
          .on('drag', function (event, d) {
            d.x = Math.max(0, Math.min(400 - width, event.x));
            d.y = Math.max(0, Math.min(400 - height, event.y));
            d3.select(this)
              .style('left', `${d.x}px`)
              .style('top', `${d.y}px`);

            updatePosition(id, d.x, d.y);
          })
          .on('end', function () {
            d3.select(this).classed('bg-orange-400', false);
          })
      );
  }, [x, y, width, height, id, updatePosition]);

  const handleRightClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const parentRect = divRef.current.parentElement.getBoundingClientRect();
    setDialogPosition({
      x: event.clientX - parentRect.left,
      y: event.clientY - parentRect.top,
    });
    setShowDialog(true);
    onRightClick();
  };

  const handleDelete = () => {
    onDelete(id);
    setShowDialog(false);
  };

  return (
    <>
      <div
        ref={divRef}
        className={`absolute cursor-grab ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          left: `${x}px`,
          top: `${y}px`,
        }}
        onContextMenu={handleRightClick}
      >
        <h1 className="text-white text-sm text-center">VM</h1>
      </div>

      {showDialog && (
        <div
          className="absolute bg-white border shadow-lg rounded p-2"
          style={{
            left: `${dialogPosition.x}px`,
            top: `${dialogPosition.y}px`,
          }}
        >
          <button
            className="bg-red-500 text-white px-2 py-1 rounded mr-2"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="bg-gray-300 px-2 py-1 rounded"
            onClick={() => setShowDialog(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
};

export default function App() {
  const [vms, setVms] = useState([{ id: 1, x: 50, y: 50 }]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVmPosition, setNewVmPosition] = useState({ x: 0, y: 0 });
  const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });

  const handleCanvasRightClick = (event) => {
    event.preventDefault();
    const canvas = event.currentTarget;
    const canvasRect = canvas.getBoundingClientRect();

    setDialogPosition({
      x: event.pageX,
      y: event.pageY,
    });

    setNewVmPosition({
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top,
    });
    setShowAddDialog(true);
  };

  const addNewVM = () => {
    const newVm = {
      id: vms.length + 1,
      x: newVmPosition.x,
      y: newVmPosition.y,
    };
    setVms([...vms, newVm]);
    setShowAddDialog(false);
  };

  const updateVmPosition = (id, x, y) => {
    setVms((prevVms) =>
      prevVms.map((vm) => (vm.id === id ? { ...vm, x, y } : vm))
    );
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center bg-black text-white">
      <h1 className="text-xl font-bold mb-4">VM Network Diagram</h1>
      <div
        className="relative w-[400px] h-[400px] border-2 border-white bg-gray-500 rounded-md"
        onContextMenu={handleCanvasRightClick}
      >
        {/* line */}
        <svg className="absolute w-full h-full pointer-events-none">
  {vms.map((vm, index) => {
    const nextVm = vms[(index + 1) % vms.length];
    return (
      <line
        key={vm.id}
        x1={vm.x + 25}
        y1={vm.y + 15}
        x2={nextVm.x + 25}
        y2={nextVm.y + 15}
        stroke="black"
        strokeWidth="1"
        strokeDasharray="3,5" // This creates a dotted line (5px dash, 5px gap)
      />
    );
  })}
</svg>


        {vms.map((vm) => (
          <DraggableDiv
            key={vm.id}
            id={vm.id}
            width={50}
            height={30}
            className="rounded-md bg-blue-500 shadow-lg flex items-center justify-center"
            x={vm.x}
            y={vm.y}
            onDelete={(id) => setVms(vms.filter((vm) => vm.id !== id))}
            onRightClick={() => {}}
            updatePosition={updateVmPosition}
          />
        ))}
      </div>

      {showAddDialog && (
        <div
          className="absolute bg-white border shadow-lg rounded p-2"
          style={{
            left: `${dialogPosition.x}px`,
            top: `${dialogPosition.y}px`,
          }}
        >
          <p>Add a new VM</p>
          <button
            className="bg-green-500 text-white px-2 py-1 rounded"
            onClick={addNewVM}
          >
            Add VM
          </button>
          <button
            className="bg-gray-300 px-2 py-1 rounded ml-2"
            onClick={() => setShowAddDialog(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
