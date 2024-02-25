import React, { useLayoutEffect } from "react";
import "../styles/Whiteboard.css";

const Whiteboard = () => {
  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    if (canvas) {
      canvas.width = window.innerWidth - 60;
      canvas.height = 400;

      let context = canvas.getContext("2d");
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);

      let draw_color = "black";
      let draw_width = "2";
      let is_drawing = false; 
      let start_background_color ="white"

      let restore_array =[];
      let index = -1;

      function change_color(element) {
        draw_color = element.style.background;
      }

      canvas.addEventListener("touchstart", start, false);
      canvas.addEventListener("touchmove", draw, false);
      canvas.addEventListener("mousedown", start, false);
      canvas.addEventListener("mousemove", draw, false);

      canvas.addEventListener("touchend", stop, false);
      canvas.addEventListener("mouseup", stop, false);
      canvas.addEventListener("mouseout", stop, false);

      function start(event) {
        is_drawing = true;
        context.beginPath();
        context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        event.preventDefault();
      }
      
     

      function draw(event) {
        if (is_drawing) {
            context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop); // Fixed the reference to canvas.offsetTop
            context.strokeStyle = draw_color;
            context.lineWidth = draw_width;
            context.lineCap = "round";
            context.lineJoin = "round";
            context.stroke();
        }
    }
    }
    function stop(event) {
      if (is_drawing) {
          context.stroke(); 
          context.closePath();
          is_drawing = false; 
      }
      event.preventDefault();

      restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
      index +=1;
    }

    function clear_canvas() {
      context.fillStyle = start_background_color;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function undo_last() {

    }

  }, []);

  

  return (
    <div className="field">
      <canvas id="canvas"></canvas>
      <div className="tool">
        <button onClick="undo_last()"  type="button" className="button">Undo</button>
        <button onClick="clear_canvas()" type="button" className="button">Clear</button>

        <div onClick="change_color(this)" className="color-field" style={{ background: 'red' }}></div>
        <div onClick="change_color(this)" className="color-field" style={{ background: 'blue' }}></div>
        <div onClick="change_color(this)" className="color-field" style={{ background: 'green' }}></div>
        <div onClick="change_color(this)" className="color-field" style={{ background: 'yellow' }}></div>

        <input onInput="draw_color = this.value" type="color" 
            className="color-picker"></input>
        <input type="range" min={1} max={100} className="pen-range" onInput="draw_input = this.value"></input>
      </div>
    </div>
  );
};

export default Whiteboard;
