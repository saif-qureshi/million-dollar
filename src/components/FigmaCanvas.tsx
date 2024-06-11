import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";

const gridSize = 100;

const generateRandomColor = () => {
  return (
    "rgb(" +
    [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ].join(",") +
    ")"
  );
};

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

export default function FigmaCanvas() {
  const tileSize = 100;

  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    const stage = stageRef.current as any;
    if (!stage) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const scaleBy = 1.01;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      let direction = e.deltaY > 0 ? 1 : -1;

      if (e.ctrlKey) {
        direction = -direction;
      }

      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
    };

    const handleDocumentWheel = (e) => {
      e.preventDefault();
    };

    stage.container().addEventListener("wheel", handleWheel);
    document.addEventListener("wheel", handleDocumentWheel, { passive: false });

    return () => {
      stage.container().removeEventListener("wheel", handleWheel);
      document.removeEventListener("wheel", handleDocumentWheel);
    };
  }, []);

  useEffect(() => {
    const gridArray = Array.from({ length: gridSize * gridSize }).map(
      (_, index) => {
        const x = index % gridSize;
        const y = Math.floor(index / gridSize);
        return {
          x: x * tileSize,
          y: y * tileSize,
          width: tileSize,
          height: tileSize,
          fill: generateRandomColor(),
        };
      }
    );
    setRectangles(gridArray);
  }, [tileSize]);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      ref={stageRef}
      style={{ backgroundColor: "#fef7ef" }}
    >
      <Layer fill="black">
        {rectangles.map((rect, i) => (
          <Rect
            key={i}
            x={rect.x * scale}
            y={rect.y * scale}
            width={rect.width * scale}
            height={rect.height * scale}
            fill={rect.fill}
          />
        ))}
      </Layer>
    </Stage>
  );
}
