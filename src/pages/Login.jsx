import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setErrorMessage("");


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!username.trim()) {

            setErrorMessage(
                "Please enter your username."
            );

            return;
        }


        if (!password) {

            setErrorMessage(
                "Please enter your password."
            );

            return;
        }


        try {

            setLoading(true);


            const result = await loginUser({

                username:
                    username.trim(),

                password

            });


            console.log(
                "Login Result:",
                result
            );


            // -------------------------------------------------
            // SAVE TOKEN
            // -------------------------------------------------

            localStorage.setItem(
                "token",
                result.token
            );


            // -------------------------------------------------
            // REDIRECT
            // -------------------------------------------------

            navigate(
                "/dashboard"
            );


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            setErrorMessage(

                error.response?.data?.message ||

                "Invalid username or password."

            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div
            style={styles.page}
        >

            {/* =================================================
                BACKGROUND DECORATION
            ================================================= */}

            <div
                style={{
                    ...styles.backgroundOrb,
                    ...styles.orbOne
                }}
            />

            <div
                style={{
                    ...styles.backgroundOrb,
                    ...styles.orbTwo
                }}
            />


            {/* =================================================
                MAIN CONTAINER
            ================================================= */}

            <div
                style={styles.loginContainer}
            >


                {/* =================================================
                    LEFT BRAND SECTION
                ================================================= */}

                <div
                    style={styles.brandSection}
                >

                    {/* Logo */}

                    <div
                        style={styles.logoWrapper}
                    >

                        <div
                            style={styles.logoIcon}
                        >
                            A
                        </div>

                        <span
                            style={styles.logoText}
                        >
                            AssetSphere
                        </span>

                    </div>


                    {/* Main Heading */}

                    <div
                        style={styles.brandContent}
                    >

                        <div
                            style={styles.smallBadge}
                        >

                            <span
                                style={
                                    styles.statusDot
                                }
                            />

                            ASSET MANAGEMENT PLATFORM

                        </div>


                        <h1
                            style={styles.brandHeading}
                        >

                            Manage your assets.

                            <br />

                            <span
                                style={
                                    styles.highlightText
                                }
                            >
                                Smarter.
                            </span>

                        </h1>


                        <p
                            style={styles.brandDescription}
                        >

                            A centralized platform to manage
                            hardware assets, software licenses,
                            employees, vendors, purchases and
                            complete asset lifecycle operations.

                        </p>


                        {/* =================================================
                            FEATURE LIST
                        ================================================= */}

                        <div
                            style={styles.featureList}
                        >

                            <Feature
                                icon="✓"
                                title="Complete Asset Visibility"
                                description="Track every company asset in one place."
                            />

                            <Feature
                                icon="✓"
                                title="Lifecycle Management"
                                description="Monitor assigned, stock, repair and retired assets."
                            />

                            <Feature
                                icon="✓"
                                title="Management Insights"
                                description="Get clear insights through powerful dashboards."
                            />

                        </div>

                    </div>


                    {/* Footer */}

                    <div
                        style={styles.brandFooter}
                    >

                        <span>
                            © {new Date().getFullYear()} AssetSphere
                        </span>

                        <span>
                            Enterprise Asset Management
                        </span>

                    </div>

                </div>


                {/* =================================================
                    RIGHT LOGIN SECTION
                ================================================= */}

                <div
                    style={styles.formSection}
                >

                    <div
                        style={styles.loginCard}
                    >


                        {/* =================================================
                            LOGIN HEADER
                        ================================================= */}

                        <div
                            style={styles.loginHeader}
                        >

                            <div
                                style={styles.welcomeIcon}
                            >
                                🔐
                            </div>


                            <h2
                                style={styles.loginTitle}
                            >
                                Welcome back
                            </h2>


                            <p
                                style={styles.loginSubtitle}
                            >
                                Sign in to continue to AssetSphere
                            </p>

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {errorMessage && (

                            <div
                                style={
                                    styles.errorBox
                                }
                            >

                                <span>
                                    ⚠
                                </span>

                                <span>
                                    {errorMessage}
                                </span>

                            </div>

                        )}


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <form
                            onSubmit={handleLogin}
                        >


                            {/* USERNAME */}

                            <div
                                style={styles.fieldGroup}
                            >

                                <label
                                    style={
                                        styles.label
                                    }
                                >
                                    Username
                                </label>


                                <div
                                    style={
                                        styles.inputWrapper
                                    }
                                >

                                    <span
                                        style={
                                            styles.inputIcon
                                        }
                                    >
                                        👤
                                    </span>


                                    <input
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => {

                                            setUsername(
                                                e.target.value
                                            );

                                            setErrorMessage("");

                                        }}
                                        autoComplete="username"
                                        style={
                                            styles.input
                                        }
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div
                                style={styles.fieldGroup}
                            >

                                <label
                                    style={
                                        styles.label
                                    }
                                >
                                    Password
                                </label>


                                <div
                                    style={
                                        styles.inputWrapper
                                    }
                                >

                                    <span
                                        style={
                                            styles.inputIcon
                                        }
                                    >
                                        🔒
                                    </span>


                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => {

                                            setPassword(
                                                e.target.value
                                            );

                                            setErrorMessage("");

                                        }}
                                        autoComplete="current-password"
                                        style={{
                                            ...styles.input,
                                            paddingRight:
                                                "50px"
                                        }}
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        style={
                                            styles.passwordButton
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showPassword
                                            ? "🙈"
                                            : "👁"
                                        }

                                    </button>

                                </div>

                            </div>


                            {/* =================================================
                                REMEMBER / SECURITY
                            ================================================= */}

                            <div
                                style={
                                    styles.securityRow
                                }
                            >

                                <div
                                    style={
                                        styles.secureLogin
                                    }
                                >

                                    <span
                                        style={
                                            styles.greenDot
                                        }
                                    />

                                    Secure login

                                </div>

                                <span
                                    style={
                                        styles.securityText
                                    }
                                >
                                    Protected access
                                </span>

                            </div>


                            {/* =================================================
                                LOGIN BUTTON
                            ================================================= */}

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    ...styles.loginButton,
                                    opacity:
                                        loading
                                            ? 0.75
                                            : 1,
                                    cursor:
                                        loading
                                            ? "not-allowed"
                                            : "pointer"
                                }}
                            >

                                {loading ? (

                                    <>

                                        <span
                                            style={
                                                styles.spinner
                                            }
                                        />

                                        Signing in...

                                    </>

                                ) : (

                                    <>

                                        Sign in

                                        <span
                                            style={
                                                styles.arrow
                                            }
                                        >
                                            →
                                        </span>

                                    </>

                                )}

                            </button>


                        </form>


                        {/* =================================================
                            BOTTOM INFO
                        ================================================= */}

                        <div
                            style={
                                styles.bottomInfo
                            }
                        >

                            <div
                                style={
                                    styles.divider
                                }
                            />

                            <p
                                style={
                                    styles.bottomText
                                }
                            >

                                Authorized personnel only

                            </p>

                            <p
                                style={
                                    styles.bottomSubText
                                }
                            >

                                Your access and session activity
                                are securely monitored.

                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                RESPONSIVE STYLE
            ================================================= */}

            <style>

                {`

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }

                input::placeholder {
                    color: #94a3b8;
                }

                input:focus {
                    outline: none;
                }

                button {
                    font-family: inherit;
                }

                @keyframes floatOrb {

                    0% {
                        transform: translateY(0px);
                    }

                    50% {
                        transform: translateY(-25px);
                    }

                    100% {
                        transform: translateY(0px);
                    }

                }

                @keyframes cardAppear {

                    from {
                        opacity: 0;
                        transform:
                            translateY(20px)
                            scale(0.98);
                    }

                    to {
                        opacity: 1;
                        transform:
                            translateY(0)
                            scale(1);
                    }

                }

                @keyframes spin {

                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }

                }

                @media (max-width: 900px) {

                    .assetsphere-login-container {
                        grid-template-columns: 1fr !important;
                        max-width: 500px !important;
                    }

                    .assetsphere-brand-section {
                        display: none !important;
                    }

                    .assetsphere-form-section {
                        padding: 25px !important;
                    }

                }

                @media (max-width: 500px) {

                    .assetsphere-form-section {
                        padding: 15px !important;
                    }

                    .assetsphere-login-card {
                        padding: 28px 22px !important;
                    }

                }

                `}

            </style>

        </div>

    );

}


// =====================================================
// FEATURE COMPONENT
// =====================================================

function Feature({
    icon,
    title,
    description
}) {

    return (

        <div
            style={styles.feature}
        >

            <div
                style={styles.featureIcon}
            >
                {icon}
            </div>


            <div>

                <div
                    style={styles.featureTitle}
                >
                    {title}
                </div>

                <div
                    style={styles.featureDescription}
                >
                    {description}
                </div>

            </div>

        </div>

    );

}


// =====================================================
// STYLES
// =====================================================

const styles = {

    page: {

        minHeight: "100vh",

        background:
            "linear-gradient(135deg, #07111f 0%, #0b1728 45%, #101d31 100%)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: "30px",

        position: "relative",

        overflow: "hidden"

    },


    backgroundOrb: {

        position: "absolute",

        width: "420px",

        height: "420px",

        borderRadius: "50%",

        filter: "blur(100px)",

        opacity: 0.22,

        animation:
            "floatOrb 8s ease-in-out infinite"

    },


    orbOne: {

        background: "#2563eb",

        top: "-180px",

        left: "-150px"

    },


    orbTwo: {

        background: "#7c3aed",

        bottom: "-220px",

        right: "-150px",

        animationDelay: "2s"

    },


    loginContainer: {

        width: "100%",

        maxWidth: "1180px",

        minHeight: "680px",

        display: "grid",

        gridTemplateColumns:
            "1.05fr 0.95fr",

        background:
            "rgba(255,255,255,0.04)",

        border:
            "1px solid rgba(255,255,255,0.10)",

        borderRadius: "24px",

        overflow: "hidden",

        position: "relative",

        zIndex: 2,

        boxShadow:
            "0 30px 80px rgba(0,0,0,0.45)",

        backdropFilter:
            "blur(20px)"

    },


    brandSection: {

        padding: "55px",

        display: "flex",

        flexDirection: "column",

        justifyContent: "space-between",

        background:
            "linear-gradient(145deg, rgba(37,99,235,0.16), rgba(15,23,42,0.35))",

        borderRight:
            "1px solid rgba(255,255,255,0.08)"

    },


    logoWrapper: {

        display: "flex",

        alignItems: "center",

        gap: "12px"

    },


    logoIcon: {

        width: "44px",

        height: "44px",

        borderRadius: "12px",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        background:
            "linear-gradient(135deg, #3b82f6, #6366f1)",

        color: "#ffffff",

        fontSize: "22px",

        fontWeight: "800",

        boxShadow:
            "0 8px 25px rgba(59,130,246,0.35)"

    },


    logoText: {

        color: "#ffffff",

        fontSize: "22px",

        fontWeight: "700",

        letterSpacing: "-0.5px"

    },


    brandContent: {

        marginTop: "20px"

    },


    smallBadge: {

        display: "inline-flex",

        alignItems: "center",

        gap: "8px",

        padding: "8px 12px",

        borderRadius: "30px",

        background:
            "rgba(59,130,246,0.10)",

        border:
            "1px solid rgba(59,130,246,0.20)",

        color: "#93c5fd",

        fontSize: "10px",

        fontWeight: "700",

        letterSpacing: "1px"

    },


    statusDot: {

        width: "7px",

        height: "7px",

        borderRadius: "50%",

        background: "#22c55e",

        boxShadow:
            "0 0 10px #22c55e"

    },


    brandHeading: {

        color: "#ffffff",

        fontSize: "48px",

        lineHeight: "1.08",

        letterSpacing: "-1.8px",

        margin:
            "28px 0 18px",

        fontWeight: "750"

    },


    highlightText: {

        color: "#60a5fa"

    },


    brandDescription: {

        color: "#94a3b8",

        fontSize: "15px",

        lineHeight: "1.8",

        maxWidth: "500px",

        margin: 0

    },


    featureList: {

        display: "flex",

        flexDirection: "column",

        gap: "18px",

        marginTop: "38px"

    },


    feature: {

        display: "flex",

        alignItems: "flex-start",

        gap: "14px"

    },


    featureIcon: {

        width: "28px",

        height: "28px",

        flexShrink: 0,

        borderRadius: "50%",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        background:
            "rgba(34,197,94,0.12)",

        color: "#4ade80",

        fontSize: "13px",

        fontWeight: "800"

    },


    featureTitle: {

        color: "#e2e8f0",

        fontSize: "14px",

        fontWeight: "650",

        marginBottom: "3px"

    },


    featureDescription: {

        color: "#64748b",

        fontSize: "12px",

        lineHeight: "1.5"

    },


    brandFooter: {

        display: "flex",

        justifyContent: "space-between",

        gap: "20px",

        color: "#475569",

        fontSize: "11px"

    },


    formSection: {

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        padding: "45px",

        background:
            "rgba(255,255,255,0.025)"

    },


    loginCard: {

        width: "100%",

        maxWidth: "420px",

        animation:
            "cardAppear 0.6s ease-out"

    },


    loginHeader: {

        marginBottom: "30px"

    },


    welcomeIcon: {

        width: "48px",

        height: "48px",

        borderRadius: "14px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        background:
            "rgba(59,130,246,0.12)",

        border:
            "1px solid rgba(59,130,246,0.18)",

        fontSize: "20px",

        marginBottom: "18px"

    },


    loginTitle: {

        margin: 0,

        color: "#f8fafc",

        fontSize: "30px",

        fontWeight: "700",

        letterSpacing: "-0.8px"

    },


    loginSubtitle: {

        margin:
            "8px 0 0",

        color: "#64748b",

        fontSize: "13px"

    },


    errorBox: {

        display: "flex",

        alignItems: "center",

        gap: "9px",

        padding: "11px 13px",

        marginBottom: "20px",

        borderRadius: "9px",

        background:
            "rgba(239,68,68,0.08)",

        border:
            "1px solid rgba(239,68,68,0.20)",

        color: "#fca5a5",

        fontSize: "12px"

    },


    fieldGroup: {

        marginBottom: "20px"

    },


    label: {

        display: "block",

        color: "#cbd5e1",

        fontSize: "12px",

        fontWeight: "600",

        marginBottom: "8px"

    },


    inputWrapper: {

        position: "relative",

        width: "100%"

    },


    inputIcon: {

        position: "absolute",

        left: "15px",

        top: "50%",

        transform:
            "translateY(-50%)",

        fontSize: "15px",

        opacity: 0.7,

        zIndex: 1

    },


    input: {

        width: "100%",

        height: "50px",

        padding:
            "0 15px 0 45px",

        borderRadius: "10px",

        border:
            "1px solid #26364d",

        background:
            "#111c2c",

        color: "#f8fafc",

        fontSize: "13px",

        transition:
            "all 0.2s ease"

    },


    passwordButton: {

        position: "absolute",

        right: "10px",

        top: "50%",

        transform:
            "translateY(-50%)",

        border: "none",

        background: "transparent",

        color: "#64748b",

        cursor: "pointer",

        fontSize: "15px",

        padding: "6px"

    },


    securityRow: {

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        margin:
            "5px 0 22px"

    },


    secureLogin: {

        display: "flex",

        alignItems: "center",

        gap: "7px",

        color: "#94a3b8",

        fontSize: "11px"

    },


    greenDot: {

        width: "6px",

        height: "6px",

        borderRadius: "50%",

        background: "#22c55e",

        boxShadow:
            "0 0 8px rgba(34,197,94,0.7)"

    },


    securityText: {

        color: "#475569",

        fontSize: "11px"

    },


    loginButton: {

        width: "100%",

        height: "52px",

        border: "none",

        borderRadius: "10px",

        background:
            "linear-gradient(135deg, #2563eb, #4f46e5)",

        color: "#ffffff",

        fontSize: "14px",

        fontWeight: "700",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        gap: "10px",

        boxShadow:
            "0 10px 25px rgba(37,99,235,0.25)",

        transition:
            "all 0.2s ease"

    },


    arrow: {

        fontSize: "19px",

        lineHeight: 1

    },


    spinner: {

        width: "16px",

        height: "16px",

        border:
            "2px solid rgba(255,255,255,0.35)",

        borderTopColor:
            "#ffffff",

        borderRadius: "50%",

        animation:
            "spin 0.7s linear infinite"

    },


    bottomInfo: {

        textAlign: "center",

        marginTop: "30px"

    },


    divider: {

        height: "1px",

        background:
            "#1e293b",

        marginBottom: "18px"

    },


    bottomText: {

        margin: 0,

        color: "#64748b",

        fontSize: "11px",

        fontWeight: "600"

    },


    bottomSubText: {

        margin:
            "5px 0 0",

        color: "#475569",

        fontSize: "10px",

        lineHeight: "1.5"

    }

};


export default Login;