import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Assets from "../pages/Assets";
import AddAsset from "../pages/AddAsset";
import AssignAsset from "../pages/AssignAsset";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>

            <Route path="/" element={<Login />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/assets"
                element={
                    <ProtectedRoute>
                        <Assets />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/assets/add"
                element={
                    <ProtectedRoute>
                        <AddAsset />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/assets/assign/:id"
                element={
                    <ProtectedRoute>
                        <AssignAsset />
                    </ProtectedRoute>
                }
            />
            
        </Routes>
    );
}

export default AppRoutes;