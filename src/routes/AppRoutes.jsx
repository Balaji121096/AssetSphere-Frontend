import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Assets from "../pages/Assets";
import AddAsset from "../pages/AddAsset";
import AssignAsset from "../pages/AssignAsset";
import AssetHistory from "../pages/AssetHistory";
import Employees from "../pages/Employees";
import Vendors from "../pages/Vendors";
import Software from "../pages/Software";
import AddSoftware from "../pages/AddSoftware";
import SoftwareEdit from "../pages/SoftwareEdit";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>

            {/* Login */}
            <Route
                path="/"
                element={<Login />}
            />

            {/* Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Hardware Assets */}
            <Route
                path="/assets"
                element={
                    <ProtectedRoute>
                        <Assets />
                    </ProtectedRoute>
                }
            />

            {/* Add Asset */}
            <Route
                path="/assets/add"
                element={
                    <ProtectedRoute>
                        <AddAsset />
                    </ProtectedRoute>
                }
            />

            {/* Assign Asset */}
            <Route
                path="/assets/assign/:id"
                element={
                    <ProtectedRoute>
                        <AssignAsset />
                    </ProtectedRoute>
                }
            />

            {/* Asset History */}
            <Route
                path="/asset-history"
                element={
                    <ProtectedRoute>
                        <AssetHistory />
                    </ProtectedRoute>
                }
            />

            {/* Employees */}
            <Route
                path="/employees"
                element={
                    <ProtectedRoute>
                        <Employees />
                    </ProtectedRoute>
                }
            />

            {/* Vendors */}
            <Route
                path="/vendors"
                element={
                    <ProtectedRoute>
                        <Vendors />
                    </ProtectedRoute>
                }
            />

            {/* Software */}
            <Route
                path="/software"
                element={
                    <ProtectedRoute>
                        <Software />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/software/add"
                element={
                    <ProtectedRoute>
                        <AddSoftware />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/software/edit/:id"
                element={
                    <ProtectedRoute>
                        <SoftwareEdit />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default AppRoutes;