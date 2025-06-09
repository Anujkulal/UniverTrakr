import React from "react";
import LandingScreen from "./screens/other/LandingScreen";
import { Route, Routes } from "react-router";
import Signin from "./screens/other/Signin";
import HomeScreen from "./screens/other/HomeScreen";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/signin" element={<Signin />} />

        {/* Dashboard routes */}
        <Route path="/admin/*" element={<HomeScreen />} />
        <Route path="/faculty/*" element={<HomeScreen />} />
        <Route path="/student/*" element={<HomeScreen />} />
      </Routes>
    </div>
  );
};

export default App;
