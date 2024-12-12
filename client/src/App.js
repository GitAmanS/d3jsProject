import React, { useState } from 'react';
import * as d3 from 'd3';

// DraggableDiv Component
const DraggableDiv = ({ id, width, height, className, onDelete, x, y, onRightClick }) => {
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
            d3.select(this).classed('bg-orange-400', true); // Change color when drag starts
          })
          .on('drag', function (event, d) {
            d.x = Math.max(0, Math.min(400 - width, event.x));
            d.y = Math.max(0, Math.min(400 - height, event.y));
            d3.select(this)
              .style('left', `${d.x}px`)
              .style('top', `${d.y}px`);
          })
          .on('end', function () {
            d3.select(this).classed('bg-orange-400', false); // Reset color when drag ends
          })
      );
  }, [x, y, width, height]);

  const handleRightClick = (event) => {
    event.preventDefault(); // Prevent the default right-click menu
    event.stopPropagation(); // Prevent event from propagating further

    const parentRect = divRef.current.parentElement.getBoundingClientRect();
    setDialogPosition({
      x: event.clientX - parentRect.left,
      y: event.clientY - parentRect.top,
    });
    setShowDialog(true);
    onRightClick(); // Indicate that a VM was right-clicked
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
        onContextMenu={handleRightClick} // Attach right-click handler
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
  const [rightClickedOnVm, setRightClickedOnVm] = useState(false); // Track right-click on VM

  const handleCanvasClick = (event) => {
    // Ensure we don't show the add VM dialog when right-clicking
    if (event.button === 2) return; // Right-click, do nothing

    const parentRect = event.currentTarget.getBoundingClientRect();
    setNewVmPosition({
      x: event.clientX - parentRect.left,
      y: event.clientY - parentRect.top,
    });

    if (!rightClickedOnVm) { // Only show the Add dialog if the right-click was not on a VM
      setShowAddDialog(true);
    }
  };

  const handleRightClickOnVm = () => {
    setRightClickedOnVm(true); // Track that a right-click occurred on a VM
  };

  const addNewVM = () => {
    const newVm = {
      id: vms.length + 1,
      x: newVmPosition.x,
      y: newVmPosition.y,
    };
    setVms([...vms, newVm]);
    setShowAddDialog(false);
    setRightClickedOnVm(false); // Reset VM right-click state
  };

  const deleteVM = (id) => {
    setVms(vms.filter((vm) => vm.id !== id));
    setRightClickedOnVm(false); // Reset VM right-click state
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <h1 className="text-xl font-bold mb-4">VM Network Diagram</h1>
      <div
        className="relative w-[400px] h-[400px] border-2 border-black"
        onClick={handleCanvasClick} // Handle canvas click for adding VMs
        onContextMenu={(e) => e.preventDefault()} // Prevent default right-click for the canvas
      >
        {vms.map((vm) => (
          <DraggableDiv
            key={vm.id}
            id={vm.id}
            width={50}
            height={30}
            className="rounded-md bg-blue-500 shadow-lg flex items-center justify-center"
            x={vm.x}
            y={vm.y}
            onDelete={deleteVM}
            onRightClick={handleRightClickOnVm}
          />
        ))}
      </div>

      {showAddDialog && !rightClickedOnVm && (
        <div className="absolute bg-white border shadow-lg rounded p-2">
          <p>Add a new VM at the clicked position</p>
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
