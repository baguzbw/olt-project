import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Device from "./Device";
import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import SensorDetail from "./components/SensorDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/:id"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/device/:id"
          element={
            <PrivateRoute>
              <Device />
            </PrivateRoute>
          }
        />
        <Route
          path="/sensor-detail/:sensorType"
          element={
            <PrivateRoute>
              <SensorDetail />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route index element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
