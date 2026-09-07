// Navbar.jsx - WORKING VERSION
// Reads user name directly from localStorage (works on ALL pages, not just Dashboard)

import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, User } from "lucide-react";

// ========================================================
// PAGE TITLE MAPPING (ROUTES TO DISPLAY NAMES)
// ========================================================

const PAGE_TITLES = {
    "/dashboard": "Dashboard",
    "/assets": "Hardware",
    "/assets/add": "Add Hardware",
    "/assets/edit": "Edit Hardware",
    "/software": "Software",
    "/software/add": "Add Software",
    "/software/edit": "Edit Software",
    "/employees": "Employees",
    "/employees/add": "Add Employee",
    "/employees/edit": "Edit Employee",
    "/purchases": "Purchases",
    "/purchases/add": "Add Purchase",
    "/purchases/edit": "Edit Purchase",
    "/vendors": "Vendors",
    "/vendors/add": "Add Vendor",
    "/vendors/edit": "Edit Vendor",
    "/reports": "Reports",
    "/settings": "Settings",
    "/settings/profile": "Profile Settings",
    "/settings/security": "Security Settings",
    "/settings/change-password": "Change Password",
    "/settings/users": "User Management",
    "/settings/theme": "Theme Settings",
    "/asset-history": "Asset History"
};

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();
    const [showUserMenu, setShowUserMenu] = useState(false);

    // ========================================================
    // GET USER NAME FROM LOCALSTORAGE (NEW)
    // ========================================================
    const userFullName = useMemo(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("userFullName") || "User";
        }
        return "User";
    }, []);

    // ========================================================
    // GET CURRENT PAGE TITLE FROM ROUTE (NEW)
    // ========================================================
    const currentPageTitle = useMemo(() => {
        const pathname = location.pathname;
        
        // Check exact match first
        if (PAGE_TITLES[pathname]) {
            return PAGE_TITLES[pathname];
        }
        
        // Check for dynamic routes (like /assets/edit/123)
        const basePath = pathname.split('/').slice(0, 2).join('/');
        if (PAGE_TITLES[basePath]) {
            return PAGE_TITLES[basePath];
        }
        
        // Default to Dashboard
        return "Dashboard";
    }, [location.pathname]);

    const handleLogout = () => {
        // Clear all auth data from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userFullName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("rememberedUsername");
        
        // Navigate to root "/" where Login page is located
        navigate("/");
    };

    return (
        <nav style={navbarStyle}>

            {/* =========================================
                LEFT SIDE - PAGE TITLE (DYNAMIC)
            ========================================= */}
            
            <div style={navLeftStyle}>
                <h2 style={pageTitle}>
                    {currentPageTitle}
                </h2>
            </div>


            {/* =========================================
                RIGHT SIDE - USER INFO & MENU
            ========================================= */}
            
            <div style={navRightStyle}>

                {/* Dynamic Welcome Message */}
                <span style={welcomeText}>
                    Welcome {userFullName}
                </span>

                {/* User Menu Button */}
                <div style={userMenuContainerStyle}>
                    <button
                        type="button"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={userButtonStyle}
                        title={userFullName}
                        aria-label="User menu"
                    >
                        <User size={16} />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <div style={dropdownMenuStyle}>
                            <div style={dropdownItemStyle}>
                                <span style={userNameStyle}>
                                    {userFullName}
                                </span>
                            </div>
                            <div style={dividerStyle} />
                            <button
                                type="button"
                                onClick={handleLogout}
                                style={logoutButtonStyle}
                                aria-label="Logout"
                            >
                                <LogOut size={14} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>

            </div>

        </nav>
    );
}


/* ============================================================
   STYLES
============================================================ */

const navbarStyle = {
    width: "100%",
    height: "60px",
    padding: "0 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "var(--app-card)",
    borderBottom: "1px solid var(--app-border)",
    boxSizing: "border-box",
    gap: "20px",
    transition: "background 0.25s ease, border-color 0.25s ease"
};

const navLeftStyle = {
    flex: 1,
    minWidth: 0
};

const pageTitle = {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "var(--app-text)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
};

const navRightStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0
};

const welcomeText = {
    fontSize: "12px",
    color: "var(--app-muted)",
    fontWeight: 500,
    whiteSpace: "nowrap"
};

const userMenuContainerStyle = {
    position: "relative"
};

const userButtonStyle = {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "1px solid var(--app-border)",
    background: "var(--app-surface)",
    color: "var(--app-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease"
};

const dropdownMenuStyle = {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "8px",
    minWidth: "200px",
    background: "var(--app-card)",
    border: "1px solid var(--app-border)",
    borderRadius: "8px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    zIndex: 1000,
    overflow: "hidden"
};

const dropdownItemStyle = {
    padding: "10px 12px",
    color: "var(--app-muted)",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.3px"
};

const userNameStyle = {
    color: "var(--app-text)",
    fontWeight: 700
};

const dividerStyle = {
    height: "1px",
    background: "var(--app-border)"
};

const logoutButtonStyle = {
    width: "100%",
    padding: "8px 12px",
    border: "none",
    background: "transparent",
    color: "var(--danger-color)",
    fontSize: "11px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "background 0.2s ease",
    justifyContent: "flex-start"
};


export default Navbar;