import React, { useState, useEffect, useRef } from "react";
import GridBg from "../assets/gird-1000x1000.png"; // Adjust path as necessary

const Grid: React.FC = () => {
  const [scale, setScale] = useState<number>(1);
  const [minScale, setMinScale] = useState<number>(1);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      const gridElement = gridRef.current;
      const rect = gridElement.getBoundingClientRect();
      const initialWidth = rect.width;
      const initialHeight = rect.height;

      // Calculate initial scale based on the container size
      const calculatedMinScale = Math.min(
        gridElement.clientWidth / initialWidth,
        gridElement.clientHeight / initialHeight
      );
      setMinScale(calculatedMinScale);
    }
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomIntensity = 0.1;
      const newScale = scale + (e.deltaY < 0 ? zoomIntensity : -zoomIntensity);
      setScale(Math.min(Math.max(newScale, minScale), 3)); // Limit zoom scale between minScale and 3
    };

    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, [scale, minScale]);

  const handleAreaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Area clicked: "+e.currentTarget.alt);
  };

  const areas = [];
  const cellSize = 10;
  for (let row = 0; row < 100; row++) {
    for (let col = 0; col < 100; col++) {
      const x1 = col * cellSize;
      const y1 = row * cellSize;
      const x2 = x1 + cellSize;
      const y2 = y1 + cellSize;
      const coords = `${x1},${y1},${x2},${y2}`;
      areas.push(
        <area
          key={`${row}-${col}`}
          shape="rect"
          coords={coords}
          alt={`Cell ${row},${col}`}
          href="#"
          onClick={handleAreaClick}
        />
      );
    }
  }

  return (
    <div
      className="grid-container"
      style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
      ref={gridRef}
    >
      <img src={GridBg} alt="grid" id="sf-grid" useMap="#sf-grid-map" />
      <map name="sf-grid-map">{areas}</map>
    </div>
  );
};

export default Grid;
