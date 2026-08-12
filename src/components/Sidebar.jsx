import { NavLink, useNavigate } from "react-router-dom";
import {
    FaTachometerAlt,
    FaDesktop,
    FaLaptop,
    FaUsers,
    FaBuilding,
    FaChartBar,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();

        navigate("/");
    };

    const menuStyle = ({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "7px 10px",
        color: isActive ? "#ffffff" : "#ffffff",
        textDecoration: "none",
        background: isActive ? "#334155" : "transparent",
        borderRadius: "5px",
        marginBottom: "2px",
        fontSize: "14px"
    });

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

            {/* Logo / Application Name */}
            <div
                style={{
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "15px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #ffffff"
                }}
            >
                AssetSphere
            </div>

            {/* Navigation */}
            <nav>

                <NavLink
                    to="/dashboard"
                    style={menuStyle}
                >
                    <FaTachometerAlt />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/assets"
                    style={menuStyle}
                >
                    <FaDesktop />
                    Hardware
                </NavLink>

                <NavLink
                    to="/software"
                    style={menuStyle}
                >
                    <FaLaptop />
                    Software
                </NavLink>

                <NavLink
                    to="/employees"
                    style={menuStyle}
                >
                    <FaUsers />
                    Employees
                </NavLink>

                <NavLink
                    to="/vendors"
                    style={menuStyle}
                >
                    <FaBuilding />
                    Vendors
                </NavLink>

                <NavLink
                    to="/asset-history"
                    style={menuStyle}
                >
                    <FaChartBar />
                    Reports
                </NavLink>

                <NavLink
                    to="/settings"
                    style={menuStyle}
                >
                    <FaCog />
                    Settings
                </NavLink>

            </nav>

            {/* Logout */}
            <div
                style={{
                    marginTop: "15px",
                    paddingTop: "12px",
                    borderTop: "1px solid #ffffff"
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
                        background: "transparent",
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