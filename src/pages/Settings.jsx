import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


function Settings() {

    const navigate = useNavigate();


    // =====================================================
    // SETTINGS MENU
    // =====================================================

    const settingsItems = [

        {
            title: "My Profile",
            description:
                "View and manage your personal account information.",
            icon: "👤",
            path: "/settings/profile",
            color: "#2563eb"
        },

        {
            title: "Change Password",
            description:
                "Update your account password securely.",
            icon: "🔐",
            path: "/settings/change-password",
            color: "#7c3aed"
        },

        {
            title: "User Management",
            description:
                "Manage users, roles and account access.",
            icon: "👥",
            path: "/settings/users",
            color: "#059669",
            adminOnly: true
        },

        {
            title: "Company Settings",
            description:
                "Manage your company information and details.",
            icon: "🏢",
            path: "/settings/company",
            color: "#ea580c"
        },

        {
            title: "Master Data",
            description:
                "Manage categories, locations and departments.",
            icon: "🗂️",
            path: "/settings/master-data",
            color: "#0891b2"
        },

        {
            title: "Document Settings",
            description:
                "Manage supported document formats and upload limits.",
            icon: "📁",
            path: "/settings/documents",
            color: "#ca8a04"
        }

    ];


    // =====================================================
    // GET CURRENT USER ROLE
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


    const currentRole =
        currentUser?.role ||
        currentUser?.user_role ||
        "";


    // =====================================================
    // FILTER SETTINGS
    // =====================================================

    const visibleItems =
        settingsItems.filter((item) => {

            if (item.adminOnly) {

                return currentRole === "Admin";

            }

            return true;

        });


    // =====================================================
    // OPEN SETTING
    // =====================================================

    const handleOpen = (path) => {

        navigate(path);

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f5f5f5"
            }}
        >

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar />


            {/* =================================================
                MAIN AREA
            ================================================= */}

            <div
                style={{
                    flex: 1,
                    minWidth: 0
                }}
            >

                {/* =================================================
                    NAVBAR
                ================================================= */}

                <Navbar />


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div
                    style={{
                        padding: "30px"
                    }}
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        style={{
                            marginBottom: "30px"
                        }}
                    >

                        <h1
                            style={{
                                margin: 0,
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "#111827"
                            }}
                        >
                            Settings
                        </h1>


                        <p
                            style={{
                                marginTop: "8px",
                                marginBottom: 0,
                                color: "#6b7280",
                                fontSize: "15px"
                            }}
                        >
                            Manage your account, users and
                            company settings
                        </p>

                    </div>


                    {/* =================================================
                        SETTINGS GRID
                    ================================================= */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "20px",
                            maxWidth: "1100px"
                        }}
                    >

                        {visibleItems.map(
                            (item) => (

                                <div
                                    key={item.path}
                                    onClick={() =>
                                        handleOpen(
                                            item.path
                                        )
                                    }
                                    style={{
                                        background:
                                            "#ffffff",
                                        borderRadius:
                                            "12px",
                                        padding:
                                            "22px",
                                        border:
                                            "1px solid #e5e7eb",
                                        boxShadow:
                                            "0 2px 6px rgba(0,0,0,0.06)",
                                        cursor:
                                            "pointer",
                                        transition:
                                            "all 0.2s ease",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap:
                                            "18px"
                                    }}

                                    onMouseEnter={(e) => {

                                        e.currentTarget.style
                                            .boxShadow =
                                            "0 6px 18px rgba(0,0,0,0.10)";

                                        e.currentTarget.style
                                            .transform =
                                            "translateY(-2px)";

                                    }}

                                    onMouseLeave={(e) => {

                                        e.currentTarget.style
                                            .boxShadow =
                                            "0 2px 6px rgba(0,0,0,0.06)";

                                        e.currentTarget.style
                                            .transform =
                                            "translateY(0)";

                                    }}
                                >

                                    {/* =================================================
                                        ICON
                                    ================================================= */}

                                    <div
                                        style={{
                                            width: "55px",
                                            height: "55px",
                                            minWidth: "55px",
                                            borderRadius: "12px",
                                            background:
                                                `${item.color}15`,
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            fontSize: "26px"
                                        }}
                                    >
                                        {item.icon}
                                    </div>


                                    {/* =================================================
                                        TEXT
                                    ================================================= */}

                                    <div
                                        style={{
                                            flex: 1
                                        }}
                                    >

                                        <h3
                                            style={{
                                                margin: 0,
                                                marginBottom:
                                                    "6px",
                                                fontSize:
                                                    "17px",
                                                fontWeight:
                                                    "600",
                                                color:
                                                    "#111827"
                                            }}
                                        >
                                            {item.title}
                                        </h3>


                                        <p
                                            style={{
                                                margin: 0,
                                                color:
                                                    "#6b7280",
                                                fontSize:
                                                    "13px",
                                                lineHeight:
                                                    "1.5"
                                            }}
                                        >
                                            {
                                                item.description
                                            }
                                        </p>

                                    </div>


                                    {/* =================================================
                                        ARROW
                                    ================================================= */}

                                    <div
                                        style={{
                                            fontSize:
                                                "22px",
                                            color:
                                                "#9ca3af"
                                        }}
                                    >
                                        →
                                    </div>

                                </div>

                            )
                        )}

                    </div>


                    {/* =================================================
                        ROLE INFORMATION
                    ================================================= */}

                    {currentRole && (

                        <div
                            style={{
                                marginTop: "30px",
                                maxWidth: "1100px",
                                background: "#ffffff",
                                borderRadius: "10px",
                                padding: "15px 20px",
                                border:
                                    "1px solid #e5e7eb"
                            }}
                        >

                            <span
                                style={{
                                    color: "#6b7280",
                                    fontSize: "13px"
                                }}
                            >
                                Current Role
                            </span>


                            <div
                                style={{
                                    marginTop: "4px",
                                    fontWeight: "600",
                                    color: "#111827"
                                }}
                            >
                                {currentRole}
                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );
}


export default Settings;