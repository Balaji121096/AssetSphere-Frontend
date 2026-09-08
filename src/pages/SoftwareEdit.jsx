import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function SoftwareEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        software_code: "",
        software_name: "",
        publisher: "",
        version: "",
        license_type: "",
        total_licenses: "",
        purchase_date: "",
        expiry_date: "",
        cost: "",
        vendor_id: "",
        status: "Active",
        description: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // =========================
    // LOAD SOFTWARE
    // =========================
    const loadSoftware = async () => {
        try {
            setLoading(true);

            const response = await API.get(`/software/${id}`);

            const data = response.data.data;

            if (!data) {
                alert("Software not found");
                navigate("/software");
                return;
            }

            setForm({
                software_code: data.software_code || "",
                software_name: data.software_name || "",
                publisher: data.publisher || "",
                version: data.version || "",
                license_type: data.license_type || "",
                total_licenses: data.total_licenses ?? "",
                purchase_date: data.purchase_date
                    ? data.purchase_date.substring(0, 10)
                    : "",
                expiry_date: data.expiry_date
                    ? data.expiry_date.substring(0, 10)
                    : "",
                cost: data.cost ?? "",
                vendor_id: data.vendor_id ?? "",
                status: data.status || "Active",
                description: data.description || ""
            });
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to load software"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSoftware();
    }, [id]);

    // =========================
    // HANDLE CHANGE
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            await API.put(`/software/${id}`, {
                software_code: form.software_code,
                software_name: form.software_name,
                publisher: form.publisher || null,
                version: form.version || null,
                license_type: form.license_type || null,

                total_licenses: Number(form.total_licenses),

                purchase_date: form.purchase_date || null,
                expiry_date: form.expiry_date || null,

                cost: form.cost
                    ? Number(form.cost)
                    : 0,

                vendor_id: form.vendor_id
                    ? Number(form.vendor_id)
                    : null,

                status: form.status || "Active",

                description: form.description || null
            });

            alert("Software updated successfully");

            navigate("/software");
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update software"
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f4f6f9",
                    color: "#555",
                    fontFamily: "Arial, sans-serif"
                }}
            >
                Loading software...
            </div>
        );
    }

    // =========================
    // STYLES
    // =========================

    const fieldStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "7px"
    };

    const labelStyle = {
        fontSize: "13px",
        fontWeight: "600",
        color: "#374151"
    };

    const inputStyle = {
        width: "100%",
        height: "42px",
        padding: "0 12px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        background: "#fff",
        color: "#111827",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s, box-shadow 0.2s"
    };

    const selectStyle = {
        ...inputStyle,
        cursor: "pointer"
    };

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f4f6f9",
                fontFamily: "Arial, sans-serif"
            }}
        >
            {/* =========================
                SIDEBAR
            ========================= */}
            <Sidebar />

            {/* =========================
                MAIN
            ========================= */}
            <div
                style={{
                    flex: 1,
                    minWidth: 0
                }}
            >
                <Navbar />

                {/* =========================
                    PAGE CONTENT
                ========================= */}
                <div
                    style={{
                        padding: "30px 35px 50px"
                    }}
                >
                    {/*{/* PAGE HEADER */}
<div
    style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "25px"
    }}
>
    <div>
        <h1
            style={{
                margin: "0 0 7px",
                fontSize: "28px",
                fontWeight: "600",
                color: "#1f2937"
            }}
        >
            Edit Software
        </h1>

        <p
            style={{
                margin: 0,
                fontSize: "14px",
                color: "#6b7280"
            }}
        >
            Update software license details
        </p>
    </div>

    {/* BACK BUTTON */}
    <button
        type="button"
        onClick={() => navigate("/software")}
        style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            height: "40px",
            padding: "0 17px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            background: "#ffffff",
            color: "#374151",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
        }}
    >
        <span
            style={{
                fontSize: "18px",
                lineHeight: "1"
            }}
        >
            ←
        </span>

        Back
    </button>
</div>

                    {/* =========================
                        FORM CARD
                    ========================= */}
                    <div
                        style={{
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "10px",
                            boxShadow:
                                "0 2px 8px rgba(0,0,0,0.06)",
                            maxWidth: "1000px",
                            overflow: "hidden"
                        }}
                    >
                        {/* CARD HEADER */}
                        <div
                            style={{
                                padding: "20px 25px",
                                borderBottom:
                                    "1px solid #e5e7eb",
                                background: "#fafafa"
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "17px",
                                    fontWeight: "600",
                                    color: "#1f2937"
                                }}
                            >
                                Software Information
                            </h2>

                            <p
                                style={{
                                    margin:
                                        "5px 0 0",
                                    fontSize: "12px",
                                    color: "#6b7280"
                                }}
                            >
                                Enter the software license
                                information below.
                            </p>
                        </div>

                        {/* FORM */}
                        <form onSubmit={handleSubmit}>
                            <div
                                style={{
                                    padding: "25px"
                                }}
                            >
                                {/* =====================
                                    ROW 1
                                ====================== */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1fr 1fr",
                                        gap: "22px",
                                        marginBottom:
                                            "22px"
                                    }}
                                >
                                    {/* SOFTWARE CODE */}
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>
                                            Software Code
                                            <span
                                                style={{
                                                    color: "#dc2626",
                                                    marginLeft: "3px"
                                                }}
                                            >
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="software_code"
                                            value={
                                                form.software_code
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            style={inputStyle}
                                            placeholder="Enter software code"
                                        />
                                    </div>

                                    {/* SOFTWARE NAME */}
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>
                                            Software Name
                                            <span
                                                style={{
                                                    color: "#dc2626",
                                                    marginLeft: "3px"
                                                }}
                                            >
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="software_name"
                                            value={
                                                form.software_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            style={inputStyle}
                                            placeholder="Enter software name"
                                        />
                                    </div>
                                </div>

                                {/* =====================
                                    ROW 2
                                ====================== */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1fr 1fr",
                                        gap: "22px",
                                        marginBottom:
                                            "22px"
                                    }}
                                >
                                    {/* PUBLISHER */}
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>
                                            Publisher
                                        </label>

                                        <input
                                            type="text"
                                            name="publisher"
                                            value={
                                                form.publisher
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            style={inputStyle}
                                            placeholder="Enter publisher"
                                        />
                                    </div>

                                    {/* VERSION */}
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>
                                            Version
                                        </label>

                                        <input
                                            type="text"
                                            name="version"
                                            value={
                                                form.version
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            style={inputStyle}
                                            placeholder="Enter version"
                                        />
                                    </div>
                                </div>

                                {/* =====================
                                    ROW 3
                                ====================== */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1fr 1fr",
                                        gap: "22px",
                                        marginBottom:
                                            "22px"
                                    }}
                                >
                                    {/* LICENSE TYPE */}
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>
                                            License Type
                                        </label>

                                        <select
                                            name="license_type"
                                            value={
                                                form.license_type
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            style={selectStyle}
                                        >
                                            <option value="">
                                                Select license type
                                            </option>

                                            <option value="Subscription">
                                                Subscription
                                            </option>

                                            <option value="Perpetual">
                                                Perpetual
                                            </option>

                                            <option value="Trial">
                                                Trial
                                            </option>
                                        </select>
                                    </div>

                                    {/* TOTAL LICENSES */}
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>
                                            Total Licenses
                                            <span
                                                style={{
                                                    color: "#dc2626",
                                                    marginLeft: "3px"
                                                }}
                                            >
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            name="total_licenses"
                                            value={
                                                form.total_licenses
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            min="0"
                                            style={inputStyle}
                                            placeholder="Enter total licenses"
                                        />
                                    </div>
                                </div>

                                {/* =====================
                                    ROW 4
                                ====================== */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1fr 1fr",
                                        gap: "22px",
                                        marginBottom:
                                            "22px"
                                    }}
                                >
                                    {/* PURCHASE DATE */}
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>
                                            Purchase Date
                                        </label>

                                        <input
                                            type="date"
                                            name="purchase_date"
                                            value={
                                                form.purchase_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            style={inputStyle}
                                        />
                                    </div>

                                    {/* EXPIRY DATE */}
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>
                                            Expiry Date
                                        </label>

                                        <input
                                            type="date"
                                            name="expiry_date"
                                            value={
                                                form.expiry_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                {/* =====================
                                    ROW 5
                                ====================== */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1fr 1fr",
                                        gap: "22px",
                                        marginBottom:
                                            "22px"
                                    }}
                                >
                                    {/* COST */}
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>
                                            Cost
                                        </label>

                                        <input
                                            type="number"
                                            name="cost"
                                            value={
                                                form.cost
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            step="0.01"
                                            min="0"
                                            style={inputStyle}
                                            placeholder="Enter cost"
                                        />
                                    </div>

                                    {/* VENDOR ID */}
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>
                                            Vendor ID
                                        </label>

                                        <input
                                            type="number"
                                            name="vendor_id"
                                            value={
                                                form.vendor_id
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            style={inputStyle}
                                            placeholder="Enter vendor ID"
                                        />
                                    </div>
                                </div>

                                {/* =====================
                                    ROW 6
                                ====================== */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1fr 1fr",
                                        gap: "22px",
                                        marginBottom:
                                            "22px"
                                    }}
                                >
                                    {/* STATUS */}
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>
                                            Status
                                        </label>

                                        <select
                                            name="status"
                                            value={
                                                form.status
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            style={selectStyle}
                                        >
                                            <option value="Active">
                                                Active
                                            </option>

                                            <option value="Inactive">
                                                Inactive
                                            </option>
                                        </select>
                                    </div>

                                    {/* EMPTY */}
                                    <div></div>
                                </div>

                                {/* =====================
                                    DESCRIPTION
                                ====================== */}
                                <div
                                    style={{
                                        ...fieldStyle,
                                        marginBottom: "5px"
                                    }}
                                >
                                    <label style={labelStyle}>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="4"
                                        style={{
                                            ...inputStyle,
                                            height: "95px",
                                            padding:
                                                "11px 12px",
                                            resize: "vertical"
                                        }}
                                        placeholder="Enter software description"
                                    />
                                </div>
                            </div>

                            {/* =========================
                                CARD FOOTER / BUTTONS
                            ========================= */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: "10px",
                                    padding:
                                        "16px 25px",
                                    borderTop:
                                        "1px solid #e5e7eb",
                                    background: "#fafafa"
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/software"
                                        )
                                    }
                                    style={{
                                        height: "40px",
                                        padding:
                                            "0 20px",
                                        border:
                                            "1px solid #d1d5db",
                                        borderRadius:
                                            "6px",
                                        background:
                                            "#ffffff",
                                        color:
                                            "#374151",
                                        fontSize:
                                            "14px",
                                        fontWeight:
                                            "500",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        height: "40px",
                                        padding:
                                            "0 22px",
                                        border: "none",
                                        borderRadius:
                                            "6px",
                                        background:
                                            "#1f2937",
                                        color:
                                            "#ffffff",
                                        fontSize:
                                            "14px",
                                        fontWeight:
                                            "500",
                                        cursor: saving
                                            ? "not-allowed"
                                            : "pointer",
                                        opacity: saving
                                            ? 0.7
                                            : 1
                                    }}
                                >
                                    {saving
                                        ? "Updating..."
                                        : "Update Software"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SoftwareEdit;