import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Device from "./Device";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/device/:id" element={<Device />} />
        <Route index element={<Navigate to="/device/1" />} />
      </Routes>
    </Router>
  );
}

export default App;
