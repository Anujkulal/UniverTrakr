import React from "react";
import LandingScreen from "./screens/other/LandingScreen";
import { Route, Routes } from "react-router";
import Signin from "./screens/other/Signin";
import ProfileScreen from "./screens/other/ProfileScreen";
import StudentScreen from "./screens/student/StudentScreen";
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
        {/* <Route path='/admin'>
            <Route index path='profile' element={<ProfileScreen />} />
            <Route path='student' element={<StudentScreen />} />
          </Route>
          <Route path='/faculty'>
            <Route index path='profile' element={<ProfileScreen />} />
          </Route>
          <Route path='/student'>
            <Route index path='profile' element={<ProfileScreen />} />
          </Route> */}
      </Routes>
    </div>
  );
};

export default App;
