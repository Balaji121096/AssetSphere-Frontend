import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    LockKeyhole,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowLeft,
    CheckCircle,
    AlertCircle
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


function ChangePassword() {

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =====================================================
    // PASSWORD STRENGTH
    // =====================================================

    const getPasswordStrength = () => {

        if (!newPassword) {
            return {
                label: "",
                color: "",
                width: "0%"
            };
        }

        let score = 0;

        if (newPassword.length >= 6) score++;
        if (newPassword.length >= 10) score++;
        if (/[A-Z]/.test(newPassword)) score++;
        if (/[0-9]/.test(newPassword)) score++;
        if (/[^A-Za-z0-9]/.test(newPassword)) score++;

        if (score <= 1) {
            return {
                label: "Weak",
                color: "#ef4444",
                width: "25%"
            };
        }

        if (score <= 3) {
            return {
                label: "Medium",
                color: "#f59e0b",
                width: "60%"
            };
        }

        return {
            label: "Strong",
            color: "#22c55e",
            width: "100%"
        };
    };

    const strength = getPasswordStrength();


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!currentPassword) {
            setError("Please enter your current password.");
            return;
        }

        if (!newPassword) {
            setError("Please enter a new password.");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        if (!confirmPassword) {
            setError("Please confirm your new password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        if (currentPassword === newPassword) {
            setError(
                "New password must be different from your current password."
            );
            return;
        }

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.put(
                "http://localhost:5000/api/users/password",
                {
                    current_password: currentPassword,
                    new_password: newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data.success) {

                setMessage("Password changed successfully.");

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                setTimeout(() => {
                    navigate("/settings");
                }, 1500);
            }

        } catch (err) {

            console.error("Change Password Error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to change password. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            style={{
                display: "flex",
                width: "100%",
                minWidth: 0,
                minHeight: "100vh",
                background: "#f8fafc",
                margin: 0,
                padding: 0,
                boxSizing: "border-box"
            }}
        >

            {/* SIDEBAR */}

            <div
                style={{
                    flexShrink: 0,
                    minHeight: "100vh"
                }}
            >
                <Sidebar />
            </div>


            {/* MAIN APPLICATION AREA */}

            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    width: "100%",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column"
                }}
            >

                {/* NAVBAR */}

                <div
                    style={{
                        width: "100%",
                        flexShrink: 0
                    }}
                >
                    <Navbar />
                </div>


                {/* PAGE */}

                <main
                    style={{
                        flex: 1,
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "30px 32px 50px"
                    }}
                >

                    {/* BACK BUTTON */}

                    <div
                        style={{
                            width: "100%",
                            maxWidth: "1200px",
                            margin: "0 auto 22px"
                        }}
                    >

                        <button
                            type="button"
                            onClick={() => navigate("/settings")}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "10px 16px",
                                borderRadius: "9px",
                                border: "1px solid #e2e8f0",
                                background: "#ffffff",
                                color: "#475569",
                                fontSize: "14px",
                                fontWeight: 600,
                                cursor: "pointer"
                            }}
                        >
                            <ArrowLeft size={17} />
                            Back to Settings
                        </button>

                    </div>


                    {/* MAIN CARD */}

                    <div
                        style={{
                            width: "100%",
                            maxWidth: "1200px",
                            margin: "0 auto",
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "0 4px 20px rgba(15,23,42,0.06)"
                        }}
                    >

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "minmax(280px, 0.85fr) minmax(420px, 1.15fr)"
                            }}
                        >

                            {/* =================================================
                                LEFT SECURITY PANEL
                            ================================================= */}

                            <div
                                style={{
                                    background:
                                        "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #3730a3 100%)",
                                    color: "#ffffff",
                                    padding: "42px",
                                    minHeight: "560px",
                                    boxSizing: "border-box"
                                }}
                            >

                                <div
                                    style={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}
                                >

                                    <div>

                                        {/* ICON */}

                                        <div
                                            style={{
                                                width: "64px",
                                                height: "64px",
                                                borderRadius: "16px",
                                                background:
                                                    "rgba(255,255,255,0.15)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginBottom: "28px"
                                            }}
                                        >
                                            <ShieldCheck size={32} />
                                        </div>


                                        <div
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: 700,
                                                textTransform: "uppercase",
                                                letterSpacing: "1px",
                                                color: "#dbeafe",
                                                marginBottom: "12px"
                                            }}
                                        >
                                            Account Security
                                        </div>


                                        <h1
                                            style={{
                                                margin: 0,
                                                fontSize: "32px",
                                                lineHeight: 1.2,
                                                fontWeight: 700,
                                                color: "#ffffff"
                                            }}
                                        >
                                            Keep your account secure
                                        </h1>


                                        <p
                                            style={{
                                                marginTop: "18px",
                                                marginBottom: 0,
                                                color: "#dbeafe",
                                                fontSize: "15px",
                                                lineHeight: 1.7
                                            }}
                                        >
                                            Update your password regularly
                                            to keep your AssetSphere account
                                            protected.
                                        </p>

                                    </div>


                                    {/* SECURITY TIPS */}

                                    <div
                                        style={{
                                            marginTop: "40px",
                                            padding: "20px",
                                            borderRadius: "15px",
                                            background:
                                                "rgba(255,255,255,0.10)",
                                            border:
                                                "1px solid rgba(255,255,255,0.12)"
                                        }}
                                    >

                                        <div
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: 700,
                                                marginBottom: "16px"
                                            }}
                                        >
                                            Password Security Tips
                                        </div>


                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "13px"
                                            }}
                                        >

                                            <SecurityTip text="Use at least 6 characters" />

                                            <SecurityTip text="Mix uppercase and lowercase letters" />

                                            <SecurityTip text="Include numbers and special characters" />

                                            <SecurityTip text="Don't reuse your old password" />

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                RIGHT PASSWORD FORM
                            ================================================= */}

                            <div
                                style={{
                                    padding: "42px 48px",
                                    boxSizing: "border-box"
                                }}
                            >

                                <div
                                    style={{
                                        width: "100%",
                                        maxWidth: "560px",
                                        margin: "0 auto"
                                    }}
                                >

                                    {/* FORM HEADER */}

                                    <div
                                        style={{
                                            marginBottom: "28px"
                                        }}
                                    >

                                        <div
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                                borderRadius: "12px",
                                                background: "#eff6ff",
                                                color: "#2563eb",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginBottom: "15px"
                                            }}
                                        >
                                            <LockKeyhole size={24} />
                                        </div>


                                        <h2
                                            style={{
                                                margin: 0,
                                                fontSize: "28px",
                                                lineHeight: 1.25,
                                                fontWeight: 700,
                                                color: "#1e293b"
                                            }}
                                        >
                                            Change Password
                                        </h2>


                                        <p
                                            style={{
                                                margin: "8px 0 0",
                                                color: "#64748b",
                                                fontSize: "14px",
                                                lineHeight: 1.6
                                            }}
                                        >
                                            Update your account password securely.
                                        </p>

                                    </div>


                                    {/* SUCCESS */}

                                    {message && (

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                padding: "13px 15px",
                                                marginBottom: "18px",
                                                borderRadius: "10px",
                                                background: "#f0fdf4",
                                                border: "1px solid #bbf7d0",
                                                color: "#15803d",
                                                fontSize: "14px"
                                            }}
                                        >
                                            <CheckCircle size={19} />
                                            {message}
                                        </div>

                                    )}


                                    {/* ERROR */}

                                    {error && (

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                padding: "13px 15px",
                                                marginBottom: "18px",
                                                borderRadius: "10px",
                                                background: "#fef2f2",
                                                border: "1px solid #fecaca",
                                                color: "#dc2626",
                                                fontSize: "14px"
                                            }}
                                        >
                                            <AlertCircle size={19} />
                                            {error}
                                        </div>

                                    )}


                                    {/* FORM */}

                                    <form onSubmit={handleSubmit}>

                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "20px"
                                            }}
                                        >

                                            <PasswordInput
                                                label="Current Password"
                                                value={currentPassword}
                                                setValue={setCurrentPassword}
                                                show={showCurrent}
                                                setShow={setShowCurrent}
                                                placeholder="Enter your current password"
                                            />


                                            <div>

                                                <PasswordInput
                                                    label="New Password"
                                                    value={newPassword}
                                                    setValue={setNewPassword}
                                                    show={showNew}
                                                    setShow={setShowNew}
                                                    placeholder="Enter your new password"
                                                />


                                                {/* STRENGTH */}

                                                {newPassword && (

                                                    <div
                                                        style={{
                                                            marginTop: "10px"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                marginBottom: "7px",
                                                                fontSize: "12px"
                                                            }}
                                                        >

                                                            <span
                                                                style={{
                                                                    color: "#64748b"
                                                                }}
                                                            >
                                                                Password strength
                                                            </span>


                                                            <span
                                                                style={{
                                                                    color: strength.color,
                                                                    fontWeight: 700
                                                                }}
                                                            >
                                                                {strength.label}
                                                            </span>

                                                        </div>


                                                        <div
                                                            style={{
                                                                height: "6px",
                                                                background: "#e2e8f0",
                                                                borderRadius: "999px",
                                                                overflow: "hidden"
                                                            }}
                                                        >

                                                            <div
                                                                style={{
                                                                    width: strength.width,
                                                                    height: "100%",
                                                                    background: strength.color,
                                                                    borderRadius: "999px",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                            />

                                                        </div>

                                                    </div>

                                                )}

                                            </div>


                                            <PasswordInput
                                                label="Confirm New Password"
                                                value={confirmPassword}
                                                setValue={setConfirmPassword}
                                                show={showConfirm}
                                                setShow={setShowConfirm}
                                                placeholder="Re-enter your new password"
                                            />


                                            {/* MATCH */}

                                            {confirmPassword && (

                                                <div
                                                    style={{
                                                        marginTop: "-10px",
                                                        fontSize: "12px",
                                                        fontWeight: 600,
                                                        color:
                                                            newPassword === confirmPassword
                                                                ? "#16a34a"
                                                                : "#dc2626"
                                                    }}
                                                >
                                                    {newPassword === confirmPassword
                                                        ? "✓ Passwords match"
                                                        : "✕ Passwords do not match"}
                                                </div>

                                            )}


                                            {/* BUTTONS */}

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "12px",
                                                    paddingTop: "8px"
                                                }}
                                            >

                                                <button
                                                    type="button"
                                                    onClick={() => navigate("/settings")}
                                                    style={{
                                                        flex: 1,
                                                        height: "48px",
                                                        borderRadius: "10px",
                                                        border: "1px solid #cbd5e1",
                                                        background: "#ffffff",
                                                        color: "#475569",
                                                        fontSize: "14px",
                                                        fontWeight: 600,
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Cancel
                                                </button>


                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    style={{
                                                        flex: 1,
                                                        height: "48px",
                                                        borderRadius: "10px",
                                                        border: "none",
                                                        background: loading
                                                            ? "#93c5fd"
                                                            : "#2563eb",
                                                        color: "#ffffff",
                                                        fontSize: "14px",
                                                        fontWeight: 600,
                                                        cursor: loading
                                                            ? "not-allowed"
                                                            : "pointer",
                                                        boxShadow:
                                                            "0 3px 8px rgba(37,99,235,0.25)"
                                                    }}
                                                >
                                                    {loading
                                                        ? "Updating..."
                                                        : "Update Password"}
                                                </button>

                                            </div>

                                        </div>

                                    </form>

                                </div>

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
}


// =====================================================
// PASSWORD INPUT
// =====================================================

function PasswordInput({
    label,
    value,
    setValue,
    show,
    setShow,
    placeholder
}) {

    return (

        <div>

            <label
                style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#334155",
                    fontSize: "14px",
                    fontWeight: 600
                }}
            >
                {label}
            </label>


            <div
                style={{
                    position: "relative"
                }}
            >

                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    style={{
                        width: "100%",
                        height: "48px",
                        boxSizing: "border-box",
                        padding: "0 46px 0 14px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        background: "#f8fafc",
                        color: "#1e293b",
                        fontSize: "14px",
                        outline: "none"
                    }}
                />


                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label={
                        show
                            ? "Hide password"
                            : "Show password"
                    }
                    style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        border: "none",
                        background: "transparent",
                        color: "#64748b",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {show
                        ? <EyeOff size={19} />
                        : <Eye size={19} />
                    }
                </button>

            </div>

        </div>
    );
}


// =====================================================
// SECURITY TIP
// =====================================================

function SecurityTip({ text }) {

    return (

        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }}
        >

            <div
                style={{
                    width: "20px",
                    height: "20px",
                    minWidth: "20px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700
                }}
            >
                ✓
            </div>


            <span
                style={{
                    color: "#dbeafe",
                    fontSize: "13px",
                    lineHeight: 1.4
                }}
            >
                {text}
            </span>

        </div>
    );
}


export default ChangePassword;