import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

import {
    UserRound,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    ShieldCheck
} from "lucide-react";


function SettingsProfile() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        user_id: "",
        employee_id: "",
        username: "",
        role: "",
        status: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    const loadProfile = async () => {

        try {

            setLoading(true);

            const response = await API.get("/users/profile");

            const user = response.data.data;

            setFormData({
                user_id: user?.user_id || "",
                employee_id: user?.employee_id || "",
                username: user?.username || "",
                role: user?.role || "",
                status: user?.status || ""
            });

        } catch (error) {

            console.error("Profile Load Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load profile."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadProfile();
    }, []);


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!formData.username.trim()) {

            setError("Username cannot be empty.");

            return;
        }

        try {

            setSaving(true);

            const response = await API.put(
                "/users/profile",
                {
                    username: formData.username.trim()
                }
            );

            if (response.data?.success) {

                setMessage(
                    "Profile updated successfully."
                );

                await loadProfile();

            } else {

                setError(
                    response.data?.message ||
                    "Failed to update profile."
                );

            }

        } catch (error) {

            console.error(
                "Profile Update Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update profile."
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div
                className="min-h-screen bg-slate-50"
                style={{
                    display: "flex",
                    width: "100%"
                }}
            >

                <div
                    className="no-print"
                    style={{
                        flexShrink: 0
                    }}
                >
                    <Sidebar />
                </div>


                <div
                    style={{
                        flex: 1,
                        minWidth: 0
                    }}
                >

                    <div className="no-print">
                        <Navbar />
                    </div>


                    <div
                        style={{
                            minHeight: "400px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#64748b",
                            fontSize: "14px"
                        }}
                    >
                        Loading profile...
                    </div>

                </div>

            </div>

        );
    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div
            className="min-h-screen bg-slate-50"
            style={{
                display: "flex",
                width: "100%"
            }}
        >

            {/* SIDEBAR */}

            <div
                className="no-print"
                style={{
                    flexShrink: 0
                }}
            >
                <Sidebar />
            </div>


            {/* MAIN */}

            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    width: "100%"
                }}
            >

                {/* NAVBAR */}

                <div className="no-print">
                    <Navbar />
                </div>


                {/* PAGE */}

                <main
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "28px 28px 40px"
                    }}
                >

                    {/* BACK BUTTON */}

                    <div
                        style={{
                            width: "100%",
                            maxWidth: "1100px",
                            margin: "0 auto 18px"
                        }}
                    >

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/settings")
                            }
                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                font-semibold
                                text-slate-600
                                bg-white
                                border
                                border-slate-200
                                hover:text-blue-600
                                hover:border-blue-200
                                transition
                            "
                        >

                            <ArrowLeft size={17} />

                            Back to Settings

                        </button>

                    </div>


                    {/* MAIN CARD */}

                    <div
                        style={{
                            width: "100%",
                            maxWidth: "1100px",
                            margin: "0 auto"
                        }}
                        className="
                            bg-white
                            rounded-3xl
                            shadow-sm
                            border
                            border-slate-200
                            overflow-hidden
                        "
                    >

                        <div
                            className="
                                grid
                                grid-cols-1
                                lg:grid-cols-5
                            "
                        >

                            {/* =================================================
                                LEFT BLUE PANEL
                            ================================================= */}

                            <div
                                className="
                                    lg:col-span-2
                                    bg-gradient-to-br
                                    from-blue-600
                                    via-blue-700
                                    to-indigo-800
                                    p-8
                                    lg:p-10
                                    text-white
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        justify-between
                                        h-full
                                        min-h-[450px]
                                    "
                                >

                                    <div>

                                        {/* ICON */}

                                        <div
                                            className="
                                                w-16
                                                h-16
                                                rounded-2xl
                                                bg-white/15
                                                flex
                                                items-center
                                                justify-center
                                                mb-7
                                            "
                                        >

                                            <UserRound size={32} />

                                        </div>


                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-blue-100
                                                uppercase
                                                tracking-wider
                                                mb-3
                                            "
                                        >
                                            Account Profile
                                        </p>


                                        <h1
                                            className="
                                                text-3xl
                                                lg:text-4xl
                                                font-bold
                                                leading-tight
                                                mb-5
                                            "
                                            style={{
                                                color: "#ffffff",
                                                marginTop: 0
                                            }}
                                        >
                                            Profile Settings
                                        </h1>


                                        <p
                                            className="
                                                text-blue-100
                                                leading-7
                                                text-sm
                                                lg:text-base
                                            "
                                        >
                                            Manage your account
                                            information and keep
                                            your profile details
                                            up to date.
                                        </p>

                                    </div>


                                    {/* ACCOUNT SUMMARY */}

                                    <div
                                        className="
                                            mt-10
                                            p-5
                                            rounded-2xl
                                            bg-white/10
                                            border
                                            border-white/10
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                mb-5
                                            "
                                        >

                                            <ShieldCheck size={18} />

                                            <p
                                                className="
                                                    text-sm
                                                    font-bold
                                                    m-0
                                                "
                                            >
                                                Account Summary
                                            </p>

                                        </div>


                                        <InfoRow
                                            label="Employee ID"
                                            value={
                                                formData.employee_id ||
                                                "Not assigned"
                                            }
                                        />


                                        <InfoRow
                                            label="Role"
                                            value={
                                                formData.role ||
                                                "Not assigned"
                                            }
                                        />


                                        <div className="mt-4">

                                            <p
                                                className="
                                                    text-xs
                                                    text-blue-200
                                                    mb-2
                                                "
                                            >
                                                Account Status
                                            </p>


                                            <StatusBadge
                                                status={
                                                    formData.status
                                                }
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                RIGHT FORM
                            ================================================= */}

                            <div
                                className="
                                    lg:col-span-3
                                    p-8
                                    lg:p-12
                                "
                            >

                                <div
                                    className="
                                        w-full
                                        max-w-xl
                                        mx-auto
                                    "
                                >

                                    {/* HEADER */}

                                    <div className="mb-7">

                                        <div
                                            className="
                                                w-12
                                                h-12
                                                rounded-xl
                                                bg-blue-50
                                                text-blue-600
                                                flex
                                                items-center
                                                justify-center
                                                mb-4
                                            "
                                        >

                                            <UserRound size={24} />

                                        </div>


                                        <h2
                                            className="
                                                text-2xl
                                                lg:text-3xl
                                                font-bold
                                                text-slate-800
                                                m-0
                                            "
                                        >
                                            Personal Information
                                        </h2>


                                        <p
                                            className="
                                                text-sm
                                                text-slate-500
                                                mt-2
                                            "
                                        >
                                            Update the information
                                            associated with your account.
                                        </p>

                                    </div>


                                    {/* SUCCESS */}

                                    {message && (

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                p-4
                                                mb-5
                                                rounded-xl
                                                bg-green-50
                                                border
                                                border-green-200
                                                text-green-700
                                                text-sm
                                            "
                                        >

                                            <CheckCircle size={20} />

                                            <span>
                                                {message}
                                            </span>

                                        </div>

                                    )}


                                    {/* ERROR */}

                                    {error && (

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                p-4
                                                mb-5
                                                rounded-xl
                                                bg-red-50
                                                border
                                                border-red-200
                                                text-red-700
                                                text-sm
                                            "
                                        >

                                            <AlertCircle size={20} />

                                            <span>
                                                {error}
                                            </span>

                                        </div>

                                    )}


                                    {/* FORM */}

                                    <form
                                        onSubmit={handleSubmit}
                                    >

                                        <div
                                            className="
                                                grid
                                                grid-cols-1
                                                sm:grid-cols-2
                                                gap-5
                                            "
                                        >

                                            {/* USER ID */}

                                            <ProfileInput
                                                label="User ID"
                                                value={
                                                    formData.user_id
                                                }
                                            />


                                            {/* EMPLOYEE ID */}

                                            <ProfileInput
                                                label="Employee ID"
                                                value={
                                                    formData.employee_id
                                                }
                                            />


                                            {/* USERNAME */}

                                            <div
                                                className="
                                                    sm:col-span-2
                                                "
                                            >

                                                <label
                                                    className="
                                                        block
                                                        text-sm
                                                        font-semibold
                                                        text-slate-700
                                                        mb-2
                                                    "
                                                >
                                                    Username
                                                </label>


                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={
                                                        formData.username
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    required
                                                    className="
                                                        w-full
                                                        h-12
                                                        px-4
                                                        rounded-xl
                                                        border
                                                        border-slate-200
                                                        bg-slate-50
                                                        text-slate-800
                                                        outline-none
                                                        focus:bg-white
                                                        focus:border-blue-500
                                                        focus:ring-4
                                                        focus:ring-blue-500/10
                                                        transition
                                                    "
                                                />

                                            </div>


                                            {/* ROLE */}

                                            <ProfileInput
                                                label="Role"
                                                value={
                                                    formData.role
                                                }
                                            />


                                            {/* STATUS */}

                                            <div>

                                                <label
                                                    className="
                                                        block
                                                        text-sm
                                                        font-semibold
                                                        text-slate-700
                                                        mb-2
                                                    "
                                                >
                                                    Account Status
                                                </label>


                                                <div
                                                    className="
                                                        w-full
                                                        h-12
                                                        px-4
                                                        rounded-xl
                                                        border
                                                        border-slate-200
                                                        bg-slate-50
                                                        flex
                                                        items-center
                                                    "
                                                >

                                                    <StatusBadge
                                                        status={
                                                            formData.status
                                                        }
                                                    />

                                                </div>

                                            </div>

                                        </div>


                                        {/* BUTTONS */}

                                        <div
                                            className="
                                                flex
                                                flex-col-reverse
                                                sm:flex-row
                                                gap-3
                                                pt-6
                                            "
                                        >

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        "/settings"
                                                    )
                                                }
                                                className="
                                                    flex-1
                                                    h-12
                                                    rounded-xl
                                                    border
                                                    border-slate-200
                                                    text-slate-700
                                                    font-semibold
                                                    bg-white
                                                    hover:bg-slate-50
                                                    transition
                                                "
                                            >
                                                Cancel
                                            </button>


                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="
                                                    flex-1
                                                    h-12
                                                    rounded-xl
                                                    bg-blue-600
                                                    text-white
                                                    font-semibold
                                                    hover:bg-blue-700
                                                    disabled:opacity-60
                                                    disabled:cursor-not-allowed
                                                    transition
                                                    shadow-sm
                                                "
                                            >

                                                {saving
                                                    ? "Saving..."
                                                    : "Save Changes"}

                                            </button>

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
// PROFILE INPUT
// =====================================================

function ProfileInput({
    label,
    value
}) {

    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                "
            >
                {label}
            </label>


            <input
                type="text"
                value={value || ""}
                disabled
                readOnly
                className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-100
                    text-slate-500
                    outline-none
                    cursor-not-allowed
                "
            />

        </div>

    );
}


// =====================================================
// INFO ROW
// =====================================================

function InfoRow({
    label,
    value
}) {

    return (

        <div className="mb-4">

            <p
                className="
                    text-xs
                    text-blue-200
                    mb-1
                "
            >
                {label}
            </p>


            <p
                className="
                    text-sm
                    font-semibold
                    text-white
                    m-0
                "
            >
                {value}
            </p>

        </div>

    );
}


// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({
    status
}) {

    const isActive =
        String(status || "")
            .toLowerCase() === "active";


    return (

        <span
            className={`
                inline-flex
                items-center
                gap-2
                px-3
                py-1.5
                rounded-full
                text-xs
                font-bold
                ${
                    isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                }
            `}
        >

            <span
                className={`
                    w-2
                    h-2
                    rounded-full
                    ${
                        isActive
                            ? "bg-green-500"
                            : "bg-slate-400"
                    }
                `}
            />

            {status || "Unknown"}

        </span>

    );
}


export default SettingsProfile;