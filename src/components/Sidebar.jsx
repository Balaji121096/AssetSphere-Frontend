import { NavLink, useNavigate } from "react-router-dom";

import {
    FaTachometerAlt,
    FaDesktop,
    FaLaptop,
    FaUsers,
    FaBuilding,
    FaChartBar,
    FaCog,
    FaSignOutAlt,
    FaHistory,
    FaShoppingCart
} from "react-icons/fa";


function Sidebar() {

    const navigate = useNavigate();


    // =====================================================
    // GET CURRENT USER
    // =====================================================

    let currentUser = null;

    try {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            currentUser =
                JSON.parse(storedUser);

        }

    } catch (error) {

        console.error(
            "User data parse error:",
            error
        );

    }


    // =====================================================
    // CURRENT ROLE
    // =====================================================

    const currentRole =
        currentUser?.role ||
        currentUser?.user_role ||
        "";


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.clear();

        sessionStorage.clear();

        navigate("/");

    };


    // =====================================================
    // MENU STYLE
    // =====================================================

    const menuStyle = ({ isActive }) => ({

        display: "flex",

        alignItems: "center",

        gap: "8px",

        padding: "7px 10px",

        color: "#ffffff",

        textDecoration: "none",

        background:
            isActive
                ? "#334155"
                : "transparent",

        borderRadius: "5px",

        marginBottom: "2px",

        fontSize: "14px"

    });


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            style={{
                width: "180px",
                minHeight: "100vh",
                background: "#1e293b",
                color: "#ffffff",
                padding: "15px",
                boxSizing: "border-box"
            }}
        >

            {/* =================================================
                APPLICATION NAME
            ================================================= */}

            <div
                style={{
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "15px",
                    paddingBottom: "10px",
                    borderBottom:
                        "1px solid #ffffff"
                }}
            >

                AssetSphere

            </div>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav>

                {/* =================================================
                    DASHBOARD
                ================================================= */}

                <NavLink
                    to="/dashboard"
                    style={menuStyle}
                >

                    <FaTachometerAlt />

                    Dashboard

                </NavLink>


                {/* =================================================
                    HARDWARE
                ================================================= */}

                <NavLink
                    to="/assets"
                    style={menuStyle}
                >

                    <FaDesktop />

                    Hardware

                </NavLink>


                {/* =================================================
                    SOFTWARE
                ================================================= */}

                <NavLink
                    to="/software"
                    style={menuStyle}
                >

                    <FaLaptop />

                    Software

                </NavLink>


                {/* =================================================
                    EMPLOYEES
                ================================================= */}

                <NavLink
                    to="/employees"
                    style={menuStyle}
                >

                    <FaUsers />

                    Employees

                </NavLink>


                {/* =================================================
                    VENDORS
                ================================================= */}

                <NavLink
                    to="/vendors"
                    style={menuStyle}
                >

                    <FaBuilding />

                    Vendors

                </NavLink>


                {/* =================================================
                    PURCHASE MANAGEMENT
                ================================================= */}

                <NavLink
                    to="/purchases"
                    style={menuStyle}
                >

                    <FaShoppingCart />

                    Purchases

                </NavLink>


                {/* =================================================
                    REPORTS
                ================================================= */}

                <NavLink
                    to="/reports"
                    style={menuStyle}
                >

                    <FaChartBar />

                    Reports

                </NavLink>


                {/* =================================================
                    ASSET HISTORY
                ================================================= */}

                <NavLink
                    to="/asset-history"
                    style={menuStyle}
                >

                    <FaHistory />

                    Asset History

                </NavLink>


                {/* =================================================
                    SETTINGS
                ================================================= */}

                <NavLink
                    to="/settings"
                    style={menuStyle}
                >

                    <FaCog />

                    Settings

                </NavLink>

            </nav>


            {/* =================================================
                ACCOUNT ROLE INFO
            ================================================= */}

            {currentRole && (

                <div
                    style={{
                        marginTop: "15px",
                        paddingTop: "10px",
                        borderTop:
                            "1px solid rgba(255,255,255,0.25)",
                        fontSize: "11px",
                        color: "#cbd5e1"
                    }}
                >

                    <div
                        style={{
                            marginBottom: "4px",
                            fontSize: "9px",
                            letterSpacing: "1px",
                            color: "#94a3b8"
                        }}
                    >
                        CURRENT ROLE
                    </div>


                    <div
                        style={{
                            fontWeight: "700",
                            color:
                                currentRole ===
                                "Super Admin"
                                    ? "#fca5a5"
                                    : "#ffffff"
                        }}
                    >
                        {currentRole}
                    </div>

                </div>

            )}


            {/* =================================================
                LOGOUT
            ================================================= */}

            <div
                style={{
                    marginTop: "15px",
                    paddingTop: "12px",
                    borderTop:
                        "1px solid #ffffff"
                }}
            >

                <button

                    onClick={handleLogout}

                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "100%",
                        padding: "7px 10px",
                        border: "none",
                        background:
                            "transparent",
                        color: "#ffffff",
                        cursor: "pointer",
                        fontSize: "14px",
                        textAlign: "left"
                    }}

                >

                    <FaSignOutAlt />

                    Logout

                </button>

            </div>

        </div>

    );

}


export default Sidebar;