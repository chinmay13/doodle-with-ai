import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DashboardStyle.css";

function Dashboard() {
  const [doodleModel, setDoodleModel] = useState("");

  const updateModel = (e) => {
    setDoodleModel(e.target.selectedOptions[0].getAttribute("value"));
  };
  return (
    <div className="dashboard-body">
      <h1>Doodle with AI</h1>
      <p className="dashboard-p">
        {" "}
        Let's play a doodling game with AI! Every time you lift your pen while
        drawing a sketch, AI
        <br />
        completes it for you. With our machine learning algorithm, AI will
        finish your drawing and give
        <br />
        different iterations from your chosen category
      </p>
      <p>Start doodling and let AI complete your design</p>
      <div className="header-up">What you want to draw?</div>
      <div className="header-down" style={{ marginTop: "15px" }}>
        <select
          className="ui dropdown ui raised segment"
          onChange={updateModel}
          style={{ width: "20rem" }}
        >
          <option value="">Select a design</option>
          <option value="bus">Bus</option>
          <option value="butterfly">Butterfly</option>
          <option value="bird">Bird</option>
          <option value="cat">Cat</option>
          <option value="cactus">Cactus</option>
          <option value="spider">Spider</option>
          <option value="skull">Skull</option>
        </select>
      </div>
      <Link
        className="start-button ui raised padded text custom-container button segment"
        state={{ doodleModel: doodleModel }}
        to="/DrawCanvas"
      >
        CLICK HERE TO START DRAWING
      </Link>
    </div>
  );
}

export default Dashboard;
