// AddSoftware.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function AddSoftware() {
    const navigate = useNavigate();

    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [vendorLoading, setVendorLoading] = useState(true);

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

    useEffect(() => {
        const loadVendors = async () => {
            try {
                setVendorLoading(true);

                const response = await API.get("/vendors");

                setVendors(response.data.data || []);
            } catch (error) {
                console.error("Vendor Load Error:", error);

                alert(
                    error.response?.data?.message ||
                    "Failed to load vendors"
                );
            } finally {
                setVendorLoading(false);
            }
        };

        loadVendors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!form.software_code.trim()) {
            alert("Software Code is required");
            return false;
        }

        if (!form.software_name.trim()) {
            alert("Software Name is required");
            return false;
        }

        if (!form.license_type) {
            alert("Please select a license type");
            return false;
        }

        if (
            form.total_licenses === "" ||
            Number(form.total_licenses) < 1
        ) {
            alert("Please enter a valid license quantity");
            return false;
        }

        if (
            form.purchase_date &&
            form.expiry_date &&
            new Date(form.expiry_date) <
                new Date(form.purchase_date)
        ) {
            alert("Expiry date cannot be before purchase date");
            return false;
        }

        if (Number(form.cost || 0) < 0) {
            alert("Cost cannot be negative");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            const payload = {
                software_code: form.software_code.trim(),
                software_name: form.software_name.trim(),
                publisher: form.publisher.trim(),
                version: form.version.trim(),
                license_type: form.license_type,
                total_licenses: Number(form.total_licenses),
                purchase_date: form.purchase_date || null,
                expiry_date: form.expiry_date || null,
                cost: Number(form.cost || 0),
                vendor_id: form.vendor_id
                    ? Number(form.vendor_id)
                    : null,
                status: form.status,
                description: form.description.trim()
            };

            await API.post("/software", payload);

            alert("Software added successfully");

            navigate("/software");
        } catch (error) {
            console.error("Add Software Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to add software"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (loading) return;

        navigate("/software");
    };

    return (
        <div style={pageStyle}>
            <Sidebar />

            <div style={contentStyle}>
                <Navbar />

                <main style={mainStyle}>
                    <div style={headerStyle}>
                        <div>
                            <div style={breadcrumbStyle}>
                                Dashboard
                                <span style={breadcrumbSlash}>/</span>
                                Software
                                <span style={breadcrumbSlash}>/</span>
                                Add Software
                            </div>

                            <h1 style={titleStyle}>
                                Add Software
                            </h1>

                            <p style={subtitleStyle}>
                                Add software license information to your
                                company inventory
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            style={backButtonStyle}
                        >
                            ← Back to Software
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        style={formCardStyle}
                    >
                        <SectionHeader
                            icon="▣"
                            title="Software Information"
                            subtitle="Enter the software and license details below"
                        />

                        <div style={gridStyle}>
                            <FormField
                                label="Software Code"
                                required
                                hint="Unique software identifier"
                            >
                                <input
                                    type="text"
                                    name="software_code"
                                    value={form.software_code}
                                    onChange={handleChange}
                                    placeholder="SW-001"
                                    required
                                    style={inputStyle}
                                />
                            </FormField>

                            <FormField
                                label="Software Name"
                                required
                            >
                                <input
                                    type="text"
                                    name="software_name"
                                    value={form.software_name}
                                    onChange={handleChange}
                                    placeholder="Microsoft Office"
                                    required
                                    style={inputStyle}
                                />
                            </FormField>

                            <FormField label="Publisher">
                                <input
                                    type="text"
                                    name="publisher"
                                    value={form.publisher}
                                    onChange={handleChange}
                                    placeholder="Microsoft"
                                    style={inputStyle}
                                />
                            </FormField>

                            <FormField label="Version">
                                <input
                                    type="text"
                                    name="version"
                                    value={form.version}
                                    onChange={handleChange}
                                    placeholder="2026"
                                    style={inputStyle}
                                />
                            </FormField>

                            <FormField
                                label="License Type"
                                required
                            >
                                <select
                                    name="license_type"
                                    value={form.license_type}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                >
                                    <option value="">
                                        Select License Type
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
                            </FormField>

                            <FormField
                                label="Total Licenses"
                                required
                            >
                                <input
                                    type="number"
                                    name="total_licenses"
                                    value={form.total_licenses}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="10"
                                    required
                                    style={inputStyle}
                                />
                            </FormField>

                            <FormField label="Purchase Date">
                                <input
                                    type="date"
                                    name="purchase_date"
                                    value={form.purchase_date}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </FormField>

                            <FormField label="Expiry Date">
                                <input
                                    type="date"
                                    name="expiry_date"
                                    value={form.expiry_date}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </FormField>

                            <FormField
                                label="Cost"
                                hint="Enter total license cost"
                            >
                                <div style={inputWithPrefix}>
                                    <span style={currencyPrefix}>
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        name="cost"
                                        value={form.cost}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="250000"
                                        style={{
                                            ...inputStyle,
                                            border: "none",
                                            paddingLeft: "5px"
                                        }}
                                    />
                                </div>
                            </FormField>

                            <FormField label="Vendor">
                                <select
                                    name="vendor_id"
                                    value={form.vendor_id}
                                    onChange={handleChange}
                                    disabled={vendorLoading}
                                    style={{
                                        ...inputStyle,
                                        color: vendorLoading
                                            ? "#94a3b8"
                                            : "#0f172a"
                                    }}
                                >
                                    <option value="">
                                        {vendorLoading
                                            ? "Loading vendors..."
                                            : "Select Vendor"}
                                    </option>

                                    {vendors.map((vendor) => (
                                        <option
                                            key={vendor.vendor_id}
                                            value={vendor.vendor_id}
                                        >
                                            {vendor.vendor_name}
                                        </option>
                                    ))}
                                </select>
                            </FormField>

                            <FormField
                                label="Status"
                                required
                            >
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    style={inputStyle}
                                >
                                    <option value="Active">
                                        Active
                                    </option>

                                    <option value="Inactive">
                                        Inactive
                                    </option>
                                </select>
                            </FormField>
                        </div>

                        <div style={descriptionSection}>
                            <FormField
                                label="Description"
                                hint="Optional notes about this software license"
                            >
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Enter software license details..."
                                    rows="5"
                                    style={textareaStyle}
                                />
                            </FormField>
                        </div>

                        <div style={footerStyle}>
                            <div style={requiredNote}>
                                <span style={requiredDot}>*</span>
                                Required fields
                            </div>

                            <div style={buttonContainerStyle}>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    style={cancelButtonStyle}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        loading ||
                                        vendorLoading
                                    }
                                    style={{
                                        ...submitButtonStyle,
                                        opacity:
                                            loading ||
                                            vendorLoading
                                                ? 0.65
                                                : 1
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <span style={spinner} />
                                            Adding Software...
                                        </>
                                    ) : (
                                        <>
                                            <span>✓</span>
                                            Add Software
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

function SectionHeader({
    icon,
    title,
    subtitle
}) {
    return (
        <div style={sectionHeaderStyle}>
            <div style={sectionIconStyle}>
                {icon}
            </div>

            <div>
                <h2 style={sectionTitleStyle}>
                    {title}
                </h2>

                <p style={sectionSubtitleStyle}>
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

function FormField({
    label,
    required,
    hint,
    children
}) {
    return (
        <div style={fieldStyle}>
            <div style={labelRow}>
                <label style={labelStyle}>
                    {label}

                    {required && (
                        <span style={requiredStyle}>
                            *
                        </span>
                    )}
                </label>

                {hint && (
                    <span style={hintStyle}>
                        {hint}
                    </span>
                )}
            </div>

            {children}
        </div>
    );
}

const pageStyle = {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc"
};

const contentStyle = {
    flex: 1,
    minWidth: 0
};

const mainStyle = {
    padding: "28px",
    maxWidth: "1250px",
    margin: "0 auto"
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "24px"
};

const breadcrumbStyle = {
    color: "#94a3b8",
    fontSize: "12px",
    marginBottom: "9px"
};

const breadcrumbSlash = {
    margin: "0 7px",
    color: "#cbd5e1"
};

const titleStyle = {
    margin: 0,
    fontSize: "29px",
    fontWeight: "750",
    color: "#0f172a"
};

const subtitleStyle = {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px"
};

const backButtonStyle = {
    height: "40px",
    padding: "0 15px",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    background: "#fff",
    color: "#334155",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600"
};

const formCardStyle = {
    background: "#fff",
    border: "1px solid #e5eaf0",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(15,23,42,.04)",
    padding: "28px"
};

const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingBottom: "21px",
    marginBottom: "24px",
    borderBottom: "1px solid #eef2f6"
};

const sectionIconStyle = {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "700"
};

const sectionTitleStyle = {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a"
};

const sectionSubtitleStyle = {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "12px"
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "21px"
};

const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0
};

const labelRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    minHeight: "19px",
    marginBottom: "7px"
};

const labelStyle = {
    fontSize: "12px",
    fontWeight: "650",
    color: "#334155"
};

const requiredStyle = {
    color: "#ef4444",
    marginLeft: "3px"
};

const hintStyle = {
    color: "#94a3b8",
    fontSize: "10px",
    textAlign: "right"
};

const inputStyle = {
    width: "100%",
    height: "42px",
    boxSizing: "border-box",
    padding: "0 12px",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    background: "#fff",
    color: "#0f172a",
    fontSize: "13px",
    outline: "none",
    transition: "border-color .15s"
};

const inputWithPrefix = {
    width: "100%",
    height: "42px",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    background: "#fff",
    overflow: "hidden"
};

const currencyPrefix = {
    paddingLeft: "12px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600"
};

const descriptionSection = {
    marginTop: "22px"
};

const textareaStyle = {
    width: "100%",
    minHeight: "120px",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    background: "#fff",
    color: "#0f172a",
    fontSize: "13px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: "1.5"
};

const footerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginTop: "27px",
    paddingTop: "20px",
    borderTop: "1px solid #eef2f6"
};

const requiredNote = {
    color: "#94a3b8",
    fontSize: "11px"
};

const requiredDot = {
    color: "#ef4444",
    marginRight: "3px"
};

const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "9px"
};

const cancelButtonStyle = {
    height: "40px",
    padding: "0 17px",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    background: "#fff",
    color: "#475569",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600"
};

const submitButtonStyle = {
    height: "40px",
    padding: "0 18px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "650",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    boxShadow: "0 3px 8px rgba(37,99,235,.18)"
};

const spinner = {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,.4)",
    borderTopColor: "#fff",
    display: "inline-block"
};

export default AddSoftware;