import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./DrawCanvas.css";
import "./Board";
import "./rdp.js";
import Board from "./Board";

function DrawCanvas() {
  // Initialization when the component
  // mounts for the first time

  // Function for starting the drawing
  const [clearBoard, setClearBoard] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("white");
  const [lineOpacity, setLineOpacity] = useState(1);
  const [stopGeneration, setStopGeneration] = useState(false);
  const [statusText, setStatusText] = useState("Loading Model");
  const location = useLocation();
  const { doodleModel } = location.state;

  const clearCanvas = () => {
    setClearBoard(true);
    console.log("Clear Board Updated");
  };

  const stopGenerationFunc = () => {
    setStopGeneration(true);
  };

  const updateColor = (e) => {
    setLineColor(e.target.getAttribute("color"));
  };

  return (
    <div className="App">
      <div className="menu-header">
        <Link to="/" className="homepage-button ui button">
          Homepage
        </Link>
        <div className="header-middle-div">{statusText}</div>
        <div className="header-save-art ui button" style={{ display: "none" }}>
          Save your art
        </div>
      </div>
      <div className="pen-color-list" style={{ display: "none" }}>
        <div
          className="color-button"
          color="pink"
          style={{ background: "pink" }}
          onClick={updateColor}
        ></div>
        <div
          className="color-button white"
          color="white"
          style={{ background: "white" }}
          onClick={updateColor}
        ></div>
        <div
          className="color-button red"
          color="red"
          style={{ background: "red" }}
          onClick={updateColor}
        ></div>
        <div
          className="color-button green"
          color="green"
          style={{ background: "green" }}
          onClick={updateColor}
        ></div>
        <div
          className="color-button blue"
          color="blue"
          style={{ background: "blue" }}
          onClick={updateColor}
        ></div>
        <div
          className="color-button yellow"
          color="yellow"
          style={{ background: "yellow" }}
          onClick={updateColor}
        ></div>
      </div>
      <Board
        clearBoard={clearBoard}
        setClearBoard={setClearBoard}
        isDrawing={isDrawing}
        lineWidth={lineWidth}
        lineColor={lineColor}
        lineOpacity={lineOpacity}
        setIsDrawing={setIsDrawing}
        doodleModel={doodleModel}
        stopGeneration={stopGeneration}
        setStatusText={setStatusText}
      />
      <div className="footer-div" style={{ display: "none" }}>
        <div className="draw-again ui button">Draw Again</div>
        <div className="clear ui button" onClick={clearCanvas}>
          Clear
        </div>
        <div className="stop-drawing ui button" onClick={stopGenerationFunc}>
          Stop Drawing
        </div>
      </div>
    </div>
  );
}

export default DrawCanvas;
