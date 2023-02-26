import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import io from "socket.io-client";
import Dashboard from "./components/Dashboard/Dashboard";
import DrawCanvas from "./components/DrawCanvas/DrawCanvas";
import cors from "cors";

// const socket = io("http://localhost:5000", {
//   withCredentials: true,
//   extraHeaders: {
//     "my-custom-header": "abcd",
//   },
// });

function App() {
  const [text, setText] = useState("");
  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("Connected to server");
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("Disconnected from server");
  //   });

  //   socket.on("text", (data) => {
  //     console.log("Received text:", data);
  //     setText(data);
  //   });
  // }, []);

  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Home" element={<Dashboard />} />
            <Route path="/DrawCanvas" element={<DrawCanvas />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
