import { useEffect, useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    // =====================================================
    // LOAD REMEMBERED USERNAME
    // =====================================================

    useEffect(() => {

        const savedUsername =
            localStorage.getItem("rememberedUsername");

        if (savedUsername) {

            setUsername(savedUsername);
            setRememberMe(true);

        }

    }, []);


    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setErrorMessage("");

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

                username: username.trim(),
                password

            });

            localStorage.setItem(
                "token",
                result.token
            );


            // =================================================
            // REMEMBER ME
            // =================================================

            if (rememberMe) {

                localStorage.setItem(
                    "rememberedUsername",
                    username.trim()
                );

            } else {

                localStorage.removeItem(
                    "rememberedUsername"
                );

            }


            navigate("/dashboard");

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


    // =====================================================
    // FORGOT PASSWORD
    // =====================================================

    const handleForgotPassword = () => {

        navigate("/forgot-password");

    };


    return (

        <div style={styles.page}>

            <div style={styles.backgroundOrbOne} />
            <div style={styles.backgroundOrbTwo} />


            {/* =================================================
                LOGIN CONTAINER
            ================================================= */}

            <div style={styles.loginContainer}>


                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div style={styles.brandSection}>

                    <div>

                        <div style={styles.logoWrapper}>

                            <div style={styles.logoIcon}>
                                A
                            </div>

                            <span style={styles.logoText}>
                                AssetSphere
                            </span>

                        </div>


                        <div style={styles.badge}>

                            <span style={styles.badgeDot} />

                            ASSET MANAGEMENT PLATFORM

                        </div>


                        <h1 style={styles.brandHeading}>

                            Manage your assets.

                            <br />

                            <span style={styles.highlight}>
                                Smarter.
                            </span>

                        </h1>


                        <p style={styles.brandDescription}>

                            A centralized platform to manage
                            hardware assets, software licenses,
                            employees, vendors, purchases and
                            complete asset lifecycle operations.

                        </p>


                        <div style={styles.features}>

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


                    <div style={styles.brandFooter}>

                        <span>
                            © {new Date().getFullYear()} AssetSphere
                        </span>

                        <span>
                            Enterprise Asset Management
                        </span>

                    </div>

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div style={styles.formSection}>

                    <div style={styles.loginCard}>


                        {/* HEADER */}

                        <div style={styles.loginHeader}>

                            <div style={styles.loginIcon}>
                                🔐
                            </div>

                            <h2 style={styles.loginTitle}>
                                Welcome back
                            </h2>

                            <p style={styles.loginSubtitle}>
                                Sign in to your AssetSphere account
                            </p>

                        </div>


                        {/* ERROR */}

                        {errorMessage && (

                            <div style={styles.errorBox}>

                                <span>⚠</span>

                                <span>
                                    {errorMessage}
                                </span>

                            </div>

                        )}


                        <form onSubmit={handleLogin}>


                            {/* USERNAME */}

                            <div style={styles.fieldGroup}>

                                <label style={styles.label}>
                                    Username
                                </label>

                                <div style={styles.inputWrapper}>

                                    <span style={styles.inputIcon}>
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
                                        style={styles.input}
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div style={styles.fieldGroup}>

                                <label style={styles.label}>
                                    Password
                                </label>

                                <div style={styles.inputWrapper}>

                                    <span style={styles.inputIcon}>
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
                                            paddingRight: "48px"
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        style={styles.passwordButton}
                                    >

                                        {showPassword
                                            ? "🙈"
                                            : "👁"
                                        }

                                    </button>

                                </div>

                            </div>


                            {/* REMEMBER + FORGOT */}

                            <div style={styles.optionsRow}>

                                <label style={styles.rememberLabel}>

                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(
                                                e.target.checked
                                            )
                                        }
                                        style={styles.checkbox}
                                    />

                                    <span>
                                        Remember me
                                    </span>

                                </label>


                                <button
                                    type="button"
                                    onClick={
                                        handleForgotPassword
                                    }
                                    style={
                                        styles.forgotButton
                                    }
                                >
                                    Forgot password?
                                </button>

                            </div>


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    ...styles.loginButton,
                                    opacity:
                                        loading ? 0.7 : 1,
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
                                            style={styles.arrow}
                                        >
                                            →
                                        </span>
                                    </>

                                )}

                            </button>

                        </form>


                        {/* SECURITY */}

                        <div style={styles.securityBox}>

                            <div style={styles.securityIcon}>
                                ✓
                            </div>

                            <div>

                                <div style={styles.securityTitle}>
                                    Secure access
                                </div>

                                <div style={styles.securityText}>
                                    Your account is protected with secure authentication.
                                </div>

                            </div>

                        </div>


                        <div style={styles.bottomInfo}>

                            <div style={styles.divider} />

                            <p style={styles.bottomText}>
                                Authorized personnel only
                            </p>

                            <p style={styles.bottomSubText}>
                                Your access and session activity
                                are securely monitored.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                RESPONSIVE
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
                    color: #64748b;
                }

                input:focus {
                    outline: none;
                    border-color: #3b82f6 !important;
                    box-shadow:
                        0 0 0 3px rgba(59,130,246,0.10);
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
                            translateY(15px)
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
                        padding: 35px !important;
                    }

                }

                @media (max-width: 500px) {

                    .assetsphere-form-section {
                        padding: 20px !important;
                    }

                    .assetsphere-login-card {
                        padding: 10px !important;
                    }

                }

                `}

            </style>

        </div>

    );

}


// =====================================================
// FEATURE
// =====================================================

function Feature({
    icon,
    title,
    description
}) {

    return (

        <div style={styles.feature}>

            <div style={styles.featureIcon}>
                {icon}
            </div>

            <div>

                <div style={styles.featureTitle}>
                    {title}
                </div>

                <div style={styles.featureDescription}>
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
            "linear-gradient(135deg, #020617 0%, #0f172a 50%, #111827 100%)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: "30px",

        position: "relative",

        overflow: "hidden"

    },


    backgroundOrbOne: {

        position: "absolute",

        width: "450px",

        height: "450px",

        borderRadius: "50%",

        background: "#2563eb",

        filter: "blur(130px)",

        opacity: 0.16,

        top: "-220px",

        left: "-180px",

        animation:
            "floatOrb 8s ease-in-out infinite"

    },


    backgroundOrbTwo: {

        position: "absolute",

        width: "450px",

        height: "450px",

        borderRadius: "50%",

        background: "#7c3aed",

        filter: "blur(130px)",

        opacity: 0.14,

        bottom: "-230px",

        right: "-180px",

        animation:
            "floatOrb 9s ease-in-out infinite",

        animationDelay: "2s"

    },


    loginContainer: {

        width: "100%",

        maxWidth: "1120px",

        minHeight: "650px",

        display: "grid",

        gridTemplateColumns:
            "1fr 0.9fr",

        background:
            "rgba(15,23,42,0.82)",

        border:
            "1px solid rgba(148,163,184,0.12)",

        borderRadius: "22px",

        overflow: "hidden",

        position: "relative",

        zIndex: 2,

        boxShadow:
            "0 35px 100px rgba(0,0,0,0.55)",

        backdropFilter:
            "blur(25px)"

    },


    brandSection: {

        padding: "52px",

        display: "flex",

        flexDirection: "column",

        justifyContent: "space-between",

        background:
            "linear-gradient(145deg, rgba(37,99,235,0.13), rgba(15,23,42,0.20))",

        borderRight:
            "1px solid rgba(148,163,184,0.10)"

    },


    logoWrapper: {

        display: "flex",

        alignItems: "center",

        gap: "12px"

    },


    logoIcon: {

        width: "43px",

        height: "43px",

        borderRadius: "12px",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        background:
            "linear-gradient(135deg, #2563eb, #6366f1)",

        color: "#ffffff",

        fontSize: "21px",

        fontWeight: "800",

        boxShadow:
            "0 8px 25px rgba(37,99,235,0.35)"

    },


    logoText: {

        color: "#f8fafc",

        fontSize: "21px",

        fontWeight: "700"

    },


    badge: {

        display: "inline-flex",

        alignItems: "center",

        gap: "8px",

        marginTop: "75px",

        padding: "7px 11px",

        borderRadius: "30px",

        background:
            "rgba(59,130,246,0.08)",

        border:
            "1px solid rgba(59,130,246,0.18)",

        color: "#93c5fd",

        fontSize: "9px",

        fontWeight: "700",

        letterSpacing: "1px"

    },


    badgeDot: {

        width: "6px",

        height: "6px",

        borderRadius: "50%",

        background: "#22c55e",

        boxShadow:
            "0 0 9px #22c55e"

    },


    brandHeading: {

        color: "#ffffff",

        fontSize: "46px",

        lineHeight: "1.08",

        letterSpacing: "-1.8px",

        margin: "25px 0 18px",

        fontWeight: "750"

    },


    highlight: {

        color: "#60a5fa"

    },


    brandDescription: {

        color: "#94a3b8",

        fontSize: "14px",

        lineHeight: "1.8",

        maxWidth: "510px",

        margin: 0

    },


    features: {

        display: "flex",

        flexDirection: "column",

        gap: "17px",

        marginTop: "32px"

    },


    feature: {

        display: "flex",

        alignItems: "flex-start",

        gap: "13px"

    },


    featureIcon: {

        width: "27px",

        height: "27px",

        flexShrink: 0,

        borderRadius: "50%",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        background:
            "rgba(34,197,94,0.10)",

        color: "#4ade80",

        fontSize: "12px",

        fontWeight: "800"

    },


    featureTitle: {

        color: "#e2e8f0",

        fontSize: "13px",

        fontWeight: "650",

        marginBottom: "3px"

    },


    featureDescription: {

        color: "#64748b",

        fontSize: "11px",

        lineHeight: "1.5"

    },


    brandFooter: {

        display: "flex",

        justifyContent: "space-between",

        gap: "15px",

        color: "#475569",

        fontSize: "10px"

    },


    formSection: {

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        padding: "45px"

    },


    loginCard: {

        width: "100%",

        maxWidth: "390px",

        animation:
            "cardAppear 0.55s ease-out"

    },


    loginHeader: {

        marginBottom: "27px"

    },


    loginIcon: {

        width: "46px",

        height: "46px",

        borderRadius: "13px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        background:
            "rgba(59,130,246,0.10)",

        border:
            "1px solid rgba(59,130,246,0.18)",

        fontSize: "19px",

        marginBottom: "17px"

    },


    loginTitle: {

        margin: 0,

        color: "#f8fafc",

        fontSize: "29px",

        fontWeight: "700",

        letterSpacing: "-0.7px"

    },


    loginSubtitle: {

        margin: "7px 0 0",

        color: "#64748b",

        fontSize: "12px"

    },


    errorBox: {

        display: "flex",

        alignItems: "center",

        gap: "8px",

        padding: "10px 12px",

        marginBottom: "18px",

        borderRadius: "8px",

        background:
            "rgba(239,68,68,0.08)",

        border:
            "1px solid rgba(239,68,68,0.18)",

        color: "#fca5a5",

        fontSize: "11px"

    },


    fieldGroup: {

        marginBottom: "18px"

    },


    label: {

        display: "block",

        color: "#cbd5e1",

        fontSize: "11px",

        fontWeight: "600",

        marginBottom: "7px"

    },


    inputWrapper: {

        position: "relative",

        width: "100%"

    },


    inputIcon: {

        position: "absolute",

        left: "14px",

        top: "50%",

        transform:
            "translateY(-50%)",

        fontSize: "14px",

        opacity: 0.65,

        zIndex: 1

    },


    input: {

        width: "100%",

        height: "48px",

        padding:
            "0 15px 0 43px",

        borderRadius: "9px",

        border:
            "1px solid #26364d",

        background:
            "#0f1a2b",

        color: "#f8fafc",

        fontSize: "12px",

        transition:
            "all 0.2s ease"

    },


    passwordButton: {

        position: "absolute",

        right: "8px",

        top: "50%",

        transform:
            "translateY(-50%)",

        border: "none",

        background: "transparent",

        color: "#64748b",

        cursor: "pointer",

        fontSize: "14px",

        padding: "6px"

    },


    optionsRow: {

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        margin:
            "2px 0 22px"

    },


    rememberLabel: {

        display: "flex",

        alignItems: "center",

        gap: "7px",

        color: "#94a3b8",

        fontSize: "11px",

        cursor: "pointer"

    },


    checkbox: {

        width: "14px",

        height: "14px",

        accentColor: "#2563eb",

        cursor: "pointer"

    },


    forgotButton: {

        border: "none",

        background: "transparent",

        color: "#60a5fa",

        fontSize: "11px",

        fontWeight: "600",

        cursor: "pointer",

        padding: 0

    },


    loginButton: {

        width: "100%",

        height: "50px",

        border: "none",

        borderRadius: "9px",

        background:
            "linear-gradient(135deg, #2563eb, #4f46e5)",

        color: "#ffffff",

        fontSize: "13px",

        fontWeight: "700",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        gap: "9px",

        boxShadow:
            "0 10px 25px rgba(37,99,235,0.22)",

        transition:
            "all 0.2s ease"

    },


    arrow: {

        fontSize: "18px"

    },


    spinner: {

        width: "15px",

        height: "15px",

        border:
            "2px solid rgba(255,255,255,0.35)",

        borderTopColor:
            "#ffffff",

        borderRadius: "50%",

        animation:
            "spin 0.7s linear infinite"

    },


    securityBox: {

        display: "flex",

        alignItems: "center",

        gap: "10px",

        marginTop: "22px",

        padding: "11px 12px",

        borderRadius: "9px",

        background:
            "rgba(34,197,94,0.045)",

        border:
            "1px solid rgba(34,197,94,0.10)"

    },


    securityIcon: {

        width: "24px",

        height: "24px",

        borderRadius: "50%",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        background:
            "rgba(34,197,94,0.12)",

        color: "#4ade80",

        fontSize: "11px",

        fontWeight: "700"

    },


    securityTitle: {

        color: "#94a3b8",

        fontSize: "10px",

        fontWeight: "600",

        marginBottom: "2px"

    },


    securityText: {

        color: "#475569",

        fontSize: "9px"

    },


    bottomInfo: {

        textAlign: "center",

        marginTop: "23px"

    },


    divider: {

        height: "1px",

        background: "#1e293b",

        marginBottom: "15px"

    },


    bottomText: {

        margin: 0,

        color: "#64748b",

        fontSize: "10px",

        fontWeight: "600"

    },


    bottomSubText: {

        margin: "4px 0 0",

        color: "#475569",

        fontSize: "9px",

        lineHeight: "1.5"

    }

};


export default Login;