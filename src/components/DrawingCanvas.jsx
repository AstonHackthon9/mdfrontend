import React, { useState, useRef, useEffect } from 'react';
import '../styles/DrawingCanvas.css';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      setContext(ctx);
    }
  }, []);
  
  const startDrawing = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (context) {
      setIsDrawing(true);
      context.beginPath();
      context.moveTo(offsetX, offsetY);
    }
  };
  
  const draw = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (isDrawing && context) {
      context.lineTo(offsetX, offsetY);
      context.stroke();
    }
  };
  
  const stopDrawing = () => {
    if (isDrawing && context) {
      context.closePath();
      setIsDrawing(false);
    }
  };
  
  const clearCanvas = () => {
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
  };

  return (
    <div className="drawing-canvas">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
      <button onClick={clearCanvas}>Clear</button>
    </div>
  );
};

export default DrawingCanvas;
