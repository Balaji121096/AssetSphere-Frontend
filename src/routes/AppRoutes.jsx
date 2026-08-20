import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import Assets from "../pages/Assets";
import AddAsset from "../pages/AddAsset";
import AssignAsset from "../pages/AssignAsset";
import AssetHistory from "../pages/AssetHistory";

import Employees from "../pages/Employees";
import AddEmployee from "../pages/AddEmployee";
import EditEmployee from "../pages/EditEmployee";

import Vendors from "../pages/Vendors";
import AddVendor from "../pages/AddVendor";
import EditVendor from "../pages/EditVendor";
import VendorDetails from "../pages/VendorDetails";
import VendorDocuments from "../pages/VendorDocuments";

import Software from "../pages/Software";
import AddSoftware from "../pages/AddSoftware";
import SoftwareEdit from "../pages/SoftwareEdit";

import Reports from "../pages/Reports";

import Purchase from "../pages/Purchase";
import AddPurchase from "../pages/AddPurchase";
import EditPurchase from "../pages/EditPurchase";

import ProtectedRoute from "../components/ProtectedRoute";


function AppRoutes() {

    return (

        <Routes>

            {/* =====================================================
                LOGIN
            ===================================================== */}

            <Route
                path="/"
                element={<Login />}
            />


            {/* =====================================================
                DASHBOARD
            ===================================================== */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />


            {/* =====================================================
                HARDWARE ASSETS
            ===================================================== */}

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

            <Route
                path="/asset-history"
                element={
                    <ProtectedRoute>
                        <AssetHistory />
                    </ProtectedRoute>
                }
            />


            {/* =====================================================
                EMPLOYEES
            ===================================================== */}

            <Route
                path="/employees"
                element={
                    <ProtectedRoute>
                        <Employees />
                    </ProtectedRoute>
                }
            />

            {/* ADD EMPLOYEE */}

            <Route
                path="/employees/add"
                element={
                    <ProtectedRoute>
                        <AddEmployee />
                    </ProtectedRoute>
                }
            />

            {/* EDIT EMPLOYEE */}

            <Route
                path="/employees/edit/:id"
                element={
                    <ProtectedRoute>
                        <EditEmployee />
                    </ProtectedRoute>
                }
            />


            {/* =====================================================
                VENDORS
            ===================================================== */}

            <Route
                path="/vendors"
                element={
                    <ProtectedRoute>
                        <Vendors />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/vendors/add"
                element={
                    <ProtectedRoute>
                        <AddVendor />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/vendors/edit/:id"
                element={
                    <ProtectedRoute>
                        <EditVendor />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/vendors/:id/documents"
                element={
                    <ProtectedRoute>
                        <VendorDocuments />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/vendors/:id"
                element={
                    <ProtectedRoute>
                        <VendorDetails />
                    </ProtectedRoute>
                }
            />


            {/* =====================================================
                SOFTWARE
            ===================================================== */}

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


            {/* =====================================================
                REPORTS
            ===================================================== */}

            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <Reports />
                    </ProtectedRoute>
                }
            />


            {/* =====================================================
                PURCHASES
            ===================================================== */}

            {/* EDIT PURCHASE */}

            <Route
                path="/purchases/edit/:id"
                element={
                    <ProtectedRoute>
                        <EditPurchase />
                    </ProtectedRoute>
                }
            />

            {/* ADD PURCHASE */}

            <Route
                path="/purchases/add"
                element={
                    <ProtectedRoute>
                        <AddPurchase />
                    </ProtectedRoute>
                }
            />

            {/* PURCHASE LIST */}

            <Route
                path="/purchases"
                element={
                    <ProtectedRoute>
                        <Purchase />
                    </ProtectedRoute>
                }
            />

        </Routes>

    );

}

export default AppRoutes;