import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Device from "./Device";
import Home from "./components/Home";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";

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
          path="/device/:id"
          element={
            <PrivateRoute>
              <Device />
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
