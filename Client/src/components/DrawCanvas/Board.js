import React from "react";
import "./DrawCanvas.css";
import p5 from "p5";
import * as ml5 from "ml5";
import { useEffect, useRef, useState } from "react";
import * as rdp from "./rdp";

function Board(parentState) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isSetupDone, setIsSetupDone] = useState(false);
  const isDrawing = parentState.isDrawing;
  const clearBoard = parentState.clearBoard;
  const setClearBoard = parentState.setClearBoard;
  const lineWidth = parentState.lineWidth;
  const lineColor = parentState.lineColor;
  const lineOpacity = parentState.lineOpacity;
  const setIsDrawing = parentState.setIsDrawing;
  const doodleModel = parentState.doodleModel;
  const setStatusText = parentState.setStatusText;

  let sketchRNN;
  let currentStroke;
  let x, y;
  let nextPen = "down";
  let seedPath = [];
  let seedPoints = [];
  let personDrawing = false;
  let sketchRNNDrawStart = false;

  const sketchRNNStart = (p5) => {
    personDrawing = false;
    sketchRNNDrawStart = true;
  };

  const preload = (doodleModel) => {
    sketchRNN = ml5.sketchRNN(doodleModel);
    console.log("model loaded");
    setStatusText("Model Loaded!");
  };

  const startDrawing = () => {
    personDrawing = true;
    x = p5.mouseX;
    y = p5.mouseY;
  };

  const gotStrokePath = (error, strokePath) => {
    currentStroke = strokePath;
  };

  const Sketch = (p5) => {
    let radius;
    if (!isSetupDone) {
      setIsSetupDone(true);
      p5.setup = () => {
        let canvas = p5.createCanvas(1200, 430);
        p5.background(0);
        canvas.mousePressed(startDrawing);
        canvas.mouseReleased(sketchRNNStart);
        radius = 0;
      };
    }

    p5.draw = () => {
      p5.stroke(255);
      p5.strokeWeight(4);

      if (personDrawing) {
        p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
        seedPoints.push(p5.createVector(p5.mouseX, p5.mouseY));
      }
      if (clearBoard) {
        console.log("Inside clear Board");
        setClearBoard(false);
        currentStroke = false;
        x = undefined;
        y = undefined;
        nextPen = "down";
        seedPath = [];
        seedPoints = [];
        personDrawing = false;
        sketchRNNDrawStart = false;
        p5.background(0);
      }

      if (sketchRNNDrawStart) {
        const rdpPoints = [];
        const total = seedPoints.length;
        const start = seedPoints[0];
        const end = seedPoints[total - 1];
        rdpPoints.push(start);
        rdp.rdp(0, total - 1, seedPoints, rdpPoints, p5);
        rdpPoints.push(end);

        // Drawing simplified path
        //debugger;
        p5.background(0);
        p5.stroke(255);
        p5.strokeWeight(4);
        p5.beginShape();
        p5.noFill();
        for (let v of rdpPoints) {
          p5.vertex(v.x, v.y);
        }
        p5.endShape();

        x = rdpPoints[rdpPoints.length - 1].x;
        y = rdpPoints[rdpPoints.length - 1].y;

        seedPath = [];
        // Converting to SketchRNN states
        for (let i = 1; i < rdpPoints.length; i++) {
          let strokePath = {
            dx: rdpPoints[i].x - rdpPoints[i - 1].x,
            dy: rdpPoints[i].y - rdpPoints[i - 1].y,
            pen: "down",
          };
          //line(x, y, x + strokePath.dx, y + strokePath.dy);
          //x += strokePath.dx;
          //y += strokePath.dy;
          seedPath.push(strokePath);
        }

        sketchRNN.generate(seedPath, gotStrokePath);
        sketchRNNDrawStart = false;
      }

      if (currentStroke) {
        if (nextPen == "end") {
          sketchRNN.reset();
          sketchRNNStart();
          currentStroke = null;
          nextPen = "down";
          return;
        }

        if (nextPen == "down") {
          p5.line(x, y, x + currentStroke.dx, y + currentStroke.dy);
        }
        x += currentStroke.dx;
        y += currentStroke.dy;
        nextPen = currentStroke.pen;
        currentStroke = null;
        sketchRNN.generate(gotStrokePath);
      }
    };
  };
  useEffect(() => {
    preload(doodleModel);
    new p5(Sketch, "drawArea");
  }, []);

  return (
    <div id="drawArea" className="draw-area"></div>
    //   <canvas
    //     onMouseDown={startDrawing}
    //     onMouseUp={endDrawing}
    //     onMouseMove={draw}
    //     ref={canvasRef}
    //     width={`1200px`}
    //     height={`430px`}
    //   />
    // </div>
  );
}

export default Board;
