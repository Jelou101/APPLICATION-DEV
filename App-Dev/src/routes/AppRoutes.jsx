import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import ChoosePuzzle from "../pages/ChoosePuzzle";
import Riddles from "../pages/Riddles";
import Correct from "../pages/Correct";
import Incorrect from "../pages/Incorrect";
import Logic from "../pages/Logic";
import LogicCorrect from "../pages/LogicCorrect";
import LogicIncorrect from "../pages/LogicIncorrect";
import LogicSummary from "../pages/LogicSummary";
import Endurance from "../pages/Endurance";
import EnduranceCorrect from "../pages/EnduranceCorrect";
import EnduranceIncorrect from "../pages/EnduranceIncorrect";
import EnduranceSummary from "../pages/EnduranceSummary";
import LeaderBoard from "../pages/LeaderBoard";
import Register from "../pages/Register";
import Summary from "../pages/Summary";



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="HomePage" element={<HomePage />} />
      <Route path="Login" element={<Login />} />
      <Route path="Dashboard" element={<Dashboard />} />
      <Route path="ChoosePuzzle" element={<ChoosePuzzle />} />
      <Route path="Riddles" element={<Riddles />} />
      <Route path="Correct" element={<Correct />} />
      <Route path="Incorrect" element={<Incorrect />} />
      <Route path="Logic" element={<Logic />} />
      <Route path="LogicCorrect" element={<LogicCorrect />} />
      <Route path="LogicIncorrect" element={<LogicIncorrect />} />
      <Route path="LogicSummary" element={<LogicSummary />} />
      <Route path="Endurance" element={<Endurance />} />
      <Route path="EnduranceCorrect" element={<EnduranceCorrect />} />
      <Route path="EnduranceIncorrect" element={<EnduranceIncorrect />} />
      <Route path="EnduranceSummary" element={<EnduranceSummary />} />
      <Route path="LeaderBoard" element={<LeaderBoard />} />
      <Route path="Register" element={<Register />} />
      <Route path="Summary" element={<Summary />} />
    </Routes>
  );
}