import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import WithdrawRequests from "./components/page/WithdrawRequests";
import Login from "./components/Login/Login"
import GameCard from "./components/page/GameCard";
import Number from "./components/page/Number"
import ProtectedRoute from "./protectedRoute";
import User from "./components/page/User";
import TodayReport from "./components/page/TodayReport";
const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
         <Route
          path="/Login"
          element={<Login />}
        />
        <Route
          path="/gameCard"
          element={
            <>
              <ProtectedRoute>
                <Navbar />
                <GameCard />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/User"
          element={
            <>
              <ProtectedRoute>
                <Navbar />
                <User />
              </ProtectedRoute>

            </>
          }
        />
        <Route
          path="/Number"
          element={
            <>
              <ProtectedRoute>

                <Navbar />
                <Number />
              </ProtectedRoute>

            </>
          }
        />
        <Route
          path="/withdrawRequests"
          element={
            <>
              <ProtectedRoute>
                <Navbar />
                <WithdrawRequests />
              </ProtectedRoute>
            </>
          }
        />
   <Route
          path="/todayReport"
          element={
            <>
              <ProtectedRoute>
                <Navbar />
                <TodayReport />
              </ProtectedRoute>
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
