// =====================================================
// AppRoutes.jsx
// =====================================================

import { Routes, Route } from "react-router-dom";

// =====================================================
// AUTH
// =====================================================

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";

// =====================================================
// ASSETS
// =====================================================

import Assets from "../pages/Assets";
import AddAsset from "../pages/AddAsset";
import AssignAsset from "../pages/AssignAsset";
import AssetHistory from "../pages/AssetHistory";
import EditAsset from "../pages/EditAsset";

// =====================================================
// EMPLOYEES
// =====================================================

import Employees from "../pages/Employees";
import AddEmployee from "../pages/AddEmployee";
import EditEmployee from "../pages/EditEmployee";

// =====================================================
// VENDORS
// =====================================================

import Vendors from "../pages/Vendors";
import AddVendor from "../pages/AddVendor";
import EditVendor from "../pages/EditVendor";
import VendorDetails from "../pages/VendorDetails";
import VendorDocuments from "../pages/VendorDocuments";

// =====================================================
// SOFTWARE
// =====================================================

import Software from "../pages/Software";
import AddSoftware from "../pages/AddSoftware";
import SoftwareEdit from "../pages/SoftwareEdit";

// =====================================================
// REPORTS
// =====================================================

import Reports from "../pages/Reports";

// =====================================================
// SETTINGS
// =====================================================

import Settings from "../pages/Settings";
import SettingsProfile from "../pages/SettingsProfile";
import SettingSecurity from "../pages/SettingSecurity";
import ChangePassword from "../pages/ChangePassword";
import UserManagement from "../pages/UserManagement";
import Theme from "../pages/Theme";

// =====================================================
// PURCHASE
// =====================================================

import Purchase from "../pages/Purchase";
import AddPurchase from "../pages/AddPurchase";
import EditPurchase from "../pages/EditPurchase";


function AppRoutes() {

    return (

        <Routes>

            {/* =================================================
                LOGIN
            ================================================= */}

            <Route
                path="/"
                element={<Login />}
            />


            {/* =================================================
                DASHBOARD
            ================================================= */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />


            {/* =================================================
                ASSETS
            ================================================= */}

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
                path="/assets/edit/:id"
                element={
                    <ProtectedRoute>
                        <EditAsset />
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


            {/* =================================================
                EMPLOYEES
            ================================================= */}

            <Route
                path="/employees"
                element={
                    <ProtectedRoute>
                        <Employees />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employees/add"
                element={
                    <ProtectedRoute>
                        <AddEmployee />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employees/edit/:id"
                element={
                    <ProtectedRoute>
                        <EditEmployee />
                    </ProtectedRoute>
                }
            />


            {/* =================================================
                VENDORS
            ================================================= */}

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


            {/* =================================================
                SOFTWARE
            ================================================= */}

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


            {/* =================================================
                REPORTS
            ================================================= */}

            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <Reports />
                    </ProtectedRoute>
                }
            />


            {/* =================================================
                SETTINGS
            ================================================= */}

            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings/profile"
                element={
                    <ProtectedRoute>
                        <SettingsProfile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings/security"
                element={
                    <ProtectedRoute>
                        <SettingSecurity />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings/change-password"
                element={
                    <ProtectedRoute>
                        <ChangePassword />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings/users"
                element={
                    <ProtectedRoute>
                        <UserManagement />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings/theme"
                element={
                    <ProtectedRoute>
                        <Theme />
                    </ProtectedRoute>
                }
            />


            {/* =================================================
                PURCHASE
            ================================================= */}

            <Route
                path="/purchases"
                element={
                    <ProtectedRoute>
                        <Purchase />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/purchases/add"
                element={
                    <ProtectedRoute>
                        <AddPurchase />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/purchases/edit/:id"
                element={
                    <ProtectedRoute>
                        <EditPurchase />
                    </ProtectedRoute>
                }
            />


            {/* =================================================
                FALLBACK
            ================================================= */}

            <Route
                path="*"
                element={
                    <div
                        style={{
                            minHeight: "100vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: "12px",
                            fontFamily: "Arial, sans-serif"
                        }}
                    >

                        <h2>
                            Page Not Found
                        </h2>

                        <p>
                            The page you are looking for does not exist.
                        </p>

                        <button
                            onClick={() =>
                                window.location.href = "/settings"
                            }
                            style={{
                                padding: "10px 16px",
                                border: "none",
                                borderRadius: "8px",
                                background: "#2563eb",
                                color: "#ffffff",
                                cursor: "pointer"
                            }}
                        >
                            Go to Settings
                        </button>

                    </div>
                }
            />

        </Routes>

    );

}


export default AppRoutes;