import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student", "staff", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<h2>Access Denied</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
