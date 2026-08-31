// =====================================================
// Settings.jsx
// =====================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


// =====================================================
// GET CURRENT USER
// =====================================================

const getCurrentUser = () => {

    let user = null;

    try {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {
            user = JSON.parse(storedUser);
        }

    } catch (error) {

        console.error(
            "localStorage user parse error:",
            error
        );

    }


    if (!user) {

        try {

            const sessionUser =
                sessionStorage.getItem("user");

            if (sessionUser) {
                user = JSON.parse(sessionUser);
            }

        } catch (error) {

            console.error(
                "sessionStorage user parse error:",
                error
            );

        }

    }


    if (!user) {

        try {

            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            if (token) {

                const parts =
                    token.split(".");

                if (parts.length === 3) {

                    const payload =
                        JSON.parse(
                            atob(parts[1])
                        );

                    user = payload;

                }

            }

        } catch (error) {

            console.error(
                "JWT decode error:",
                error
            );

        }

    }


    return user;

};


// =====================================================
// GET ROLE
// =====================================================

const getUserRole = (user) => {

    if (!user) {
        return "";
    }

    const role =
        user.role ||
        user.user_role ||
        user.userRole ||
        "";

    return String(role).trim();

};


// =====================================================
// SETTINGS PAGE
// =====================================================

function Settings() {

    const navigate = useNavigate();

    const currentUser =
        getCurrentUser();

    const currentRole =
        getUserRole(currentUser);


    const settingsItems = [

        {
            title: "My Profile",

            description:
                "View and manage your personal account information.",

            icon: "👤",

            path: "/settings/profile",

            color: "#2563eb",

            background: "#eff6ff",

            allowedRoles: [
                "Super Admin",
                "Admin",
                "Manager",
                "Viewer"
            ]

        },


        {
            title: "Change Password",

            description:
                "Update your account password securely.",

            icon: "🔐",

            path: "/settings/change-password",

            color: "#7c3aed",

            background: "#f5f3ff",

            allowedRoles: [
                "Super Admin",
                "Admin",
                "Manager",
                "Viewer"
            ]

        },


        {
            title: "User Management",

            description:
                "Manage users, roles and account access.",

            icon: "👥",

            path: "/settings/users",

            color: "#059669",

            background: "#ecfdf5",

            allowedRoles: [
                "Super Admin",
                "Admin"
            ]

        },


        {
            title: "Theme",

            description:
                "Customize the appearance of AssetSphere with your preferred theme.",

            icon: "🎨",

            path: "/settings/theme",

            color: "#db2777",

            background: "#fdf2f8",

            allowedRoles: [
                "Super Admin",
                "Admin",
                "Manager",
                "Viewer"
            ]

        },


        {
            title: "Company Settings",

            description:
                "Manage your company information and details.",

            icon: "🏢",

            path: "/settings/company",

            color: "#ea580c",

            background: "#fff7ed",

            allowedRoles: [
                "Super Admin",
                "Admin",
                "Manager",
                "Viewer"
            ]

        },


        {
            title: "Master Data",

            description:
                "Manage categories, locations and departments.",

            icon: "🗂️",

            path: "/settings/master-data",

            color: "#0891b2",

            background: "#ecfeff",

            allowedRoles: [
                "Super Admin",
                "Admin",
                "Manager",
                "Viewer"
            ]

        },


        {
            title: "Document Settings",

            description:
                "Manage supported document formats and upload limits.",

            icon: "📁",

            path: "/settings/documents",

            color: "#ca8a04",

            background: "#fefce8",

            allowedRoles: [
                "Super Admin",
                "Admin",
                "Manager",
                "Viewer"
            ]

        }

    ];


    const visibleItems =
        settingsItems.filter((item) => {

            if (!currentRole) {
                return false;
            }

            if (
                currentRole === "Super Admin"
            ) {

                return true;

            }

            return item.allowedRoles.includes(
                currentRole
            );

        });


    const handleOpen = (path) => {

        navigate(path);

    };


    return (

        <div style={pageStyle}>

            <Sidebar />

            <div style={mainStyle}>

                <Navbar />

                <main
                    className="settings-content"
                    style={contentStyle}
                >

                    <section className="settings-hero">

                        <div>

                            <div className="settings-eyebrow">
                                ASSETSPHERE • SETTINGS
                            </div>

                            <h1>
                                Settings
                            </h1>

                            <p>
                                Manage your account, users and
                                company configuration.
                            </p>

                        </div>

                        <div className="settings-hero-icon">
                            ⚙️
                        </div>

                    </section>


                    <section>

                        <div style={sectionHeadingStyle}>

                            <div>

                                <h2
                                    style={sectionTitleStyle}
                                >
                                    Settings & Preferences
                                </h2>

                                <p
                                    style={
                                        sectionDescriptionStyle
                                    }
                                >
                                    Choose a section below to manage
                                    your AssetSphere configuration.
                                </p>

                            </div>

                            <div
                                style={
                                    sectionCountStyle
                                }
                            >

                                {visibleItems.length} Options

                            </div>

                        </div>


                        <div
                            className="settings-grid"
                            style={settingsGridStyle}
                        >

                            {visibleItems.map(
                                (item) => (

                                    <SettingCard
                                        key={item.path}
                                        item={item}
                                        onOpen={handleOpen}
                                    />

                                )
                            )}

                        </div>

                    </section>


                    {currentRole && (

                        <section
                            style={
                                accountSectionStyle
                            }
                        >

                            <div
                                style={
                                    accountHeaderStyle
                                }
                            >

                                <div>

                                    <div
                                        style={
                                            accountEyebrowStyle
                                        }
                                    >
                                        ACCOUNT ACCESS
                                    </div>

                                    <h2
                                        style={
                                            accountTitleStyle
                                        }
                                    >
                                        Your Access Level
                                    </h2>

                                </div>

                                <div
                                    style={
                                        accountIconStyle
                                    }
                                >
                                    👤
                                </div>

                            </div>


                            <div
                                style={
                                    accountContentStyle
                                }
                            >

                                <div
                                    style={
                                        userAvatarStyle
                                    }
                                >

                                    {(
                                        currentUser?.name ||
                                        currentUser?.username ||
                                        "U"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}

                                </div>


                                <div
                                    style={
                                        userInfoStyle
                                    }
                                >

                                    <div
                                        style={
                                            userNameStyle
                                        }
                                    >

                                        {
                                            currentUser?.name ||
                                            currentUser?.username ||
                                            "Current User"
                                        }

                                    </div>


                                    <div
                                        style={
                                            userEmailStyle
                                        }
                                    >

                                        {
                                            currentUser?.email ||
                                            "Account user"
                                        }

                                    </div>

                                </div>


                                <div
                                    style={
                                        roleContainerStyle
                                    }
                                >

                                    <span
                                        style={
                                            roleLabelStyle
                                        }
                                    >
                                        CURRENT ROLE
                                    </span>


                                    <span
                                        style={{
                                            ...roleBadgeStyle,

                                            background:
                                                currentRole ===
                                                "Super Admin"
                                                    ? "#fef2f2"
                                                    : currentRole ===
                                                      "Admin"
                                                        ? "#eff6ff"
                                                        : "var(--card-color)",

                                            color:
                                                currentRole ===
                                                "Super Admin"
                                                    ? "#dc2626"
                                                    : currentRole ===
                                                      "Admin"
                                                        ? "#2563eb"
                                                        : "var(--muted-text-color)",

                                            borderColor:
                                                currentRole ===
                                                "Super Admin"
                                                    ? "#fecaca"
                                                    : currentRole ===
                                                      "Admin"
                                                        ? "#bfdbfe"
                                                        : "var(--border-color)"
                                        }}
                                    >

                                        <span
                                            style={{
                                                ...roleDotStyle,

                                                background:
                                                    currentRole ===
                                                    "Super Admin"
                                                        ? "#dc2626"
                                                        : currentRole ===
                                                          "Admin"
                                                            ? "#2563eb"
                                                            : "var(--muted-text-color)"
                                            }}
                                        />

                                        {currentRole}

                                    </span>

                                </div>

                            </div>

                        </section>

                    )}


                    <div
                        style={
                            helpCardStyle
                        }
                    >

                        <div
                            style={
                                helpIconStyle
                            }
                        >
                            💡
                        </div>


                        <div
                            style={
                                helpTextStyle
                            }
                        >

                            <h3
                                style={
                                    helpTitleStyle
                                }
                            >
                                Need help with settings?
                            </h3>


                            <p
                                style={
                                    helpDescriptionStyle
                                }
                            >
                                Use the options above to manage
                                your AssetSphere account and
                                system configuration.
                            </p>

                        </div>

                    </div>

                </main>

            </div>


            <style>
                {`

                    * {
                        box-sizing: border-box;
                    }


                    body {
                        margin: 0;
                        transition:
                            background-color .25s ease,
                            color .25s ease;
                    }


                    .settings-hero {

                        display: flex;

                        justify-content:
                            space-between;

                        align-items:
                            center;

                        gap: 20px;

                        padding:
                            28px 24px;

                        margin-bottom:
                            28px;

                        border-radius:
                            16px;

                        background:
                            linear-gradient(
                                135deg,
                                var(--sidebar-color) 0%,
                                var(--primary-color) 100%
                            );

                        color:
                            #ffffff;

                        box-shadow:
                            0 12px 30px
                            rgba(
                                15,
                                23,
                                42,
                                0.12
                            );

                    }


                    .settings-eyebrow {

                        color:
                            #dbeafe;

                        font-size:
                            10px;

                        font-weight:
                            800;

                        letter-spacing:
                            1.3px;

                        margin-bottom:
                            8px;

                    }


                    .settings-hero h1 {

                        margin:
                            0;

                        color:
                            #ffffff;

                        font-size:
                            28px;

                        line-height:
                            1.2;

                        font-weight:
                            800;

                        letter-spacing:
                            -0.5px;

                    }


                    .settings-hero p {

                        margin:
                            7px 0 0;

                        color:
                            #dbeafe;

                        font-size:
                            12px;

                        line-height:
                            1.5;

                    }


                    .settings-hero-icon {

                        width:
                            48px;

                        height:
                            48px;

                        border-radius:
                            11px;

                        background:
                            rgba(
                                255,
                                255,
                                255,
                                0.12
                            );

                        border:
                            1px solid
                            rgba(
                                255,
                                255,
                                255,
                                0.20
                            );

                        display:
                            flex;

                        align-items:
                            center;

                        justify-content:
                            center;

                        font-size:
                            22px;

                        flex-shrink:
                            0;

                    }


                    .settings-card {

                        transition:
                            transform 0.18s ease,
                            box-shadow 0.18s ease,
                            border-color 0.18s ease;

                    }


                    .settings-card:hover {

                        transform:
                            translateY(-3px);

                        box-shadow:
                            0 12px 28px
                            rgba(
                                15,
                                23,
                                42,
                                0.09
                            );

                        border-color:
                            var(--primary-color) !important;

                    }


                    .settings-card:hover
                    .settings-arrow {

                        transform:
                            translateX(4px);

                        color:
                            var(--primary-color) !important;

                    }


                    .settings-card:hover
                    .settings-icon {

                        transform:
                            scale(1.05);

                    }


                    .settings-icon {

                        transition:
                            transform 0.18s ease;

                    }


                    .settings-arrow {

                        transition:
                            transform 0.18s ease,
                            color 0.18s ease;

                    }


                    @media (max-width: 900px) {

                        .settings-content {

                            padding:
                                24px !important;

                        }

                    }


                    @media (max-width: 700px) {

                        .settings-grid {

                            grid-template-columns:
                                1fr !important;

                        }


                        .settings-content {

                            padding:
                                20px !important;

                        }


                        .settings-hero {

                            padding:
                                22px 20px;

                        }


                        .settings-hero h1 {

                            font-size:
                                25px;

                        }


                        .settings-hero-icon {

                            display:
                                none !important;

                        }

                    }


                    @media (max-width: 450px) {

                        .settings-content {

                            padding:
                                14px !important;

                        }


                        .settings-hero {

                            margin-bottom:
                                22px;

                            border-radius:
                                14px;

                            padding:
                                20px 18px;

                        }


                        .settings-hero h1 {

                            font-size:
                                23px;

                        }


                        .settings-card {

                            padding:
                                16px !important;

                        }

                    }

                `}
            </style>

        </div>

    );

}


// =====================================================
// SETTING CARD
// =====================================================

function SettingCard({
    item,
    onOpen
}) {

    const [isFocused, setIsFocused] =
        useState(false);


    return (

        <div

            className="settings-card"

            tabIndex="0"

            onClick={() =>
                onOpen(item.path)
            }

            onKeyDown={(e) => {

                if (
                    e.key === "Enter" ||
                    e.key === " "
                ) {

                    e.preventDefault();

                    onOpen(item.path);

                }

            }}

            onFocus={() =>
                setIsFocused(true)
            }

            onBlur={() =>
                setIsFocused(false)
            }

            style={{

                ...settingCardStyle,

                borderColor:
                    isFocused
                        ? "var(--primary-color)"
                        : "var(--border-color)"

            }}

        >

            <div

                className="settings-icon"

                style={{

                    ...settingIconStyle,

                    background:
                        item.background,

                    color:
                        item.color

                }}

            >

                {item.icon}

            </div>


            <div
                style={
                    settingContentStyle
                }
            >

                <div
                    style={
                        settingTitleRowStyle
                    }
                >

                    <h3
                        style={
                            settingTitleStyle
                        }
                    >

                        {item.title}

                    </h3>

                </div>


                <p
                    style={
                        settingDescriptionStyle
                    }
                >

                    {item.description}

                </p>

            </div>


            <div

                className="settings-arrow"

                style={
                    settingArrowStyle
                }

            >

                →

            </div>

        </div>

    );

}


// =====================================================
// STYLES
// =====================================================

const pageStyle = {

    display:
        "flex",

    minHeight:
        "100vh",

    background:
        "var(--app-background)",

    color:
        "var(--text-color)"

};


const mainStyle = {

    flex:
        1,

    minWidth:
        0

};


const contentStyle = {

    width:
        "100%",

    maxWidth:
        "1250px",

    margin:
        "0 auto",

    padding:
        "32px",

    boxSizing:
        "border-box"

};


const sectionHeadingStyle = {

    display:
        "flex",

    justifyContent:
        "space-between",

    alignItems:
        "flex-end",

    gap:
        "20px",

    marginBottom:
        "18px",

    flexWrap:
        "wrap"

};


const sectionTitleStyle = {

    margin:
        0,

    fontSize:
        "18px",

    fontWeight:
        "700",

    color:
        "var(--text-color)"

};


const sectionDescriptionStyle = {

    margin:
        "5px 0 0",

    color:
        "var(--muted-text-color)",

    fontSize:
        "13px"

};


const sectionCountStyle = {

    padding:
        "6px 10px",

    borderRadius:
        "20px",

    background:
        "var(--card-color)",

    border:
        "1px solid var(--border-color)",

    color:
        "var(--muted-text-color)",

    fontSize:
        "11px",

    fontWeight:
        "700"

};


const settingsGridStyle = {

    display:
        "grid",

    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",

    gap:
        "16px"

};


const settingCardStyle = {

    background:
        "var(--card-color)",

    border:
        "1px solid var(--border-color)",

    borderRadius:
        "14px",

    padding:
        "20px",

    minHeight:
        "118px",

    boxSizing:
        "border-box",

    display:
        "flex",

    alignItems:
        "center",

    gap:
        "16px",

    cursor:
        "pointer",

    outline:
        "none"

};


const settingIconStyle = {

    width:
        "52px",

    height:
        "52px",

    minWidth:
        "52px",

    borderRadius:
        "13px",

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "center",

    fontSize:
        "24px",

    border:
        "1px solid rgba(0,0,0,0.03)"

};


const settingContentStyle = {

    flex:
        1,

    minWidth:
        0

};


const settingTitleRowStyle = {

    display:
        "flex",

    alignItems:
        "center",

    gap:
        "8px"

};


const settingTitleStyle = {

    margin:
        0,

    fontSize:
        "15px",

    fontWeight:
        "700",

    color:
        "var(--text-color)"

};


const settingDescriptionStyle = {

    margin:
        "6px 0 0",

    fontSize:
        "12.5px",

    lineHeight:
        "1.55",

    color:
        "var(--muted-text-color)",

    maxWidth:
        "420px"

};


const settingArrowStyle = {

    fontSize:
        "21px",

    color:
        "var(--muted-text-color)",

    flexShrink:
        0

};


const accountSectionStyle = {

    marginTop:
        "28px",

    background:
        "var(--card-color)",

    border:
        "1px solid var(--border-color)",

    borderRadius:
        "14px",

    overflow:
        "hidden",

    boxShadow:
        "0 3px 10px rgba(15,23,42,0.03)"

};


const accountHeaderStyle = {

    display:
        "flex",

    justifyContent:
        "space-between",

    alignItems:
        "center",

    padding:
        "18px 20px",

    borderBottom:
        "1px solid var(--border-color)"

};


const accountEyebrowStyle = {

    color:
        "var(--muted-text-color)",

    fontSize:
        "10px",

    fontWeight:
        "700",

    letterSpacing:
        "1.2px",

    marginBottom:
        "5px"

};


const accountTitleStyle = {

    margin:
        0,

    fontSize:
        "16px",

    fontWeight:
        "700",

    color:
        "var(--text-color)"

};


const accountIconStyle = {

    width:
        "40px",

    height:
        "40px",

    borderRadius:
        "10px",

    background:
        "var(--app-background)",

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "center",

    fontSize:
        "19px"

};


const accountContentStyle = {

    display:
        "flex",

    alignItems:
        "center",

    gap:
        "14px",

    padding:
        "18px 20px",

    flexWrap:
        "wrap"

};


const userAvatarStyle = {

    width:
        "44px",

    height:
        "44px",

    minWidth:
        "44px",

    borderRadius:
        "50%",

    background:
        "linear-gradient(135deg, var(--primary-color), var(--primary-color))",

    color:
        "#ffffff",

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "center",

    fontSize:
        "17px",

    fontWeight:
        "700"

};


const userInfoStyle = {

    flex:
        1,

    minWidth:
        "180px"

};


const userNameStyle = {

    fontSize:
        "14px",

    fontWeight:
        "700",

    color:
        "var(--text-color)"

};


const userEmailStyle = {

    marginTop:
        "3px",

    fontSize:
        "12px",

    color:
        "var(--muted-text-color)"

};


const roleContainerStyle = {

    display:
        "flex",

    flexDirection:
        "column",

    alignItems:
        "flex-end",

    gap:
        "5px",

    marginLeft:
        "auto"

};


const roleLabelStyle = {

    fontSize:
        "9px",

    fontWeight:
        "700",

    letterSpacing:
        "1px",

    color:
        "var(--muted-text-color)"

};


const roleBadgeStyle = {

    display:
        "inline-flex",

    alignItems:
        "center",

    gap:
        "6px",

    padding:
        "6px 10px",

    borderRadius:
        "20px",

    border:
        "1px solid",

    fontSize:
        "11px",

    fontWeight:
        "700"

};


const roleDotStyle = {

    width:
        "6px",

    height:
        "6px",

    borderRadius:
        "50%"

};


const helpCardStyle = {

    marginTop:
        "18px",

    display:
        "flex",

    alignItems:
        "center",

    gap:
        "14px",

    padding:
        "16px 18px",

    background:
        "var(--app-background)",

    border:
        "1px solid var(--border-color)",

    borderRadius:
        "12px"

};


const helpIconStyle = {

    width:
        "38px",

    height:
        "38px",

    minWidth:
        "38px",

    borderRadius:
        "10px",

    background:
        "#fffbeb",

    border:
        "1px solid #fef3c7",

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "center",

    fontSize:
        "18px"

};


const helpTextStyle = {

    minWidth:
        0

};


const helpTitleStyle = {

    margin:
        0,

    fontSize:
        "13px",

    fontWeight:
        "700",

    color:
        "var(--text-color)"

};


const helpDescriptionStyle = {

    margin:
        "4px 0 0",

    fontSize:
        "11.5px",

    color:
        "var(--muted-text-color)",

    lineHeight:
        "1.5"

};


export default Settings;