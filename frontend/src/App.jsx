import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import EquipmentManagement from "./pages/EquipmentManagement";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["student", "staff", "admin"]}><Dashboard /></ProtectedRoute>}/>
        <Route path="/equipment-management" element={<ProtectedRoute allowedRoles={["admin"]}><EquipmentManagement /></ProtectedRoute>}/>
        <Route path="/unauthorized" element={<h2>Access Denied</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
