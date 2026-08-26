import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function AddVendor() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        vendor_code: "",
        vendor_name: "",
        contact_person: "",
        email: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        gst_number: "",
        status: "Active"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.vendor_code.trim()) {
            alert("Vendor code is required");
            return;
        }

        if (!form.vendor_name.trim()) {
            alert("Vendor name is required");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post(
                "/vendors",
                form
            );

            if (response.data.success) {
                alert("Vendor added successfully");
                navigate("/vendors");
            }
        } catch (error) {
            console.error(
                "Add Vendor Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to add vendor"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            <Sidebar />

            <div style={mainStyle}>
                <Navbar />

                <main style={contentStyle}>
                    <div style={headerStyle}>
                        <h1 style={titleStyle}>
                            Add Vendor
                        </h1>

                        <p style={subtitleStyle}>
                            Add a new vendor
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        style={formCardStyle}
                    >
                        <div style={sectionHeaderStyle}>
                            <h2 style={sectionTitleStyle}>
                                Vendor Details
                            </h2>

                            <p style={sectionSubtitleStyle}>
                                Enter the vendor information below.
                            </p>
                        </div>

                        <div style={gridStyle}>
                            <FormField
                                label="Vendor Code *"
                                name="vendor_code"
                                value={form.vendor_code}
                                onChange={handleChange}
                                placeholder="VEN001"
                            />

                            <FormField
                                label="Vendor Name *"
                                name="vendor_name"
                                value={form.vendor_name}
                                onChange={handleChange}
                                placeholder="Enter vendor name"
                            />

                            <FormField
                                label="Contact Person"
                                name="contact_person"
                                value={form.contact_person}
                                onChange={handleChange}
                                placeholder="Enter contact person"
                            />

                            <FormField
                                label="Email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="vendor@company.com"
                            />

                            <FormField
                                label="Mobile"
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                placeholder="9876543210"
                            />

                            <FormField
                                label="GST Number"
                                name="gst_number"
                                value={form.gst_number}
                                onChange={handleChange}
                                placeholder="Enter GST number"
                            />

                            <FormField
                                label="City"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                placeholder="Enter city"
                            />

                            <FormField
                                label="State"
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                placeholder="Enter state"
                            />

                            <FormField
                                label="Country"
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                placeholder="Enter country"
                            />

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    Status
                                </label>

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
                            </div>

                            <div
                                style={{
                                    ...fieldStyle,
                                    gridColumn: "1 / -1"
                                }}
                            >
                                <label style={labelStyle}>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Enter vendor address"
                                    rows="4"
                                    style={{
                                        ...textareaStyle
                                    }}
                                />
                            </div>
                        </div>

                        <div style={buttonContainerStyle}>
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/vendors")
                                }
                                disabled={loading}
                                style={secondaryButtonStyle}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    ...primaryButtonStyle,
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading
                                        ? "not-allowed"
                                        : "pointer"
                                }}
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Vendor"}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

function FormField({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder
}) {
    return (
        <div style={fieldStyle}>
            <label style={labelStyle}>
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={inputStyle}
            />
        </div>
    );
}

const pageStyle = {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f7fb"
};

const mainStyle = {
    flex: 1,
    minWidth: 0
};

const contentStyle = {
    width: "100%",
    maxWidth: "1150px",
    margin: "0 auto",
    padding: "32px",
    boxSizing: "border-box"
};

const headerStyle = {
    marginBottom: "24px"
};

const titleStyle = {
    margin: 0,
    fontSize: "32px",
    lineHeight: "1.2",
    fontWeight: "700",
    color: "#111827"
};

const subtitleStyle = {
    margin: "8px 0 0",
    color: "#6b7280",
    fontSize: "15px",
    lineHeight: "1.5"
};

const formCardStyle = {
    width: "100%",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
    boxSizing: "border-box"
};

const sectionHeaderStyle = {
    marginBottom: "24px",
    paddingBottom: "18px",
    borderBottom: "1px solid #eef0f3"
};

const sectionTitleStyle = {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827"
};

const sectionSubtitleStyle = {
    margin: "5px 0 0",
    fontSize: "14px",
    color: "#6b7280"
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",
    columnGap: "22px",
    rowGap: "20px"
};

const fieldStyle = {
    minWidth: 0
};

const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151"
};

const inputStyle = {
    width: "100%",
    height: "44px",
    padding: "0 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    outline: "none",
    background: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    boxSizing: "border-box"
};

const textareaStyle = {
    width: "100%",
    minHeight: "105px",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    outline: "none",
    background: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit"
};

const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    marginTop: "30px",
    paddingTop: "22px",
    borderTop: "1px solid #eef0f3"
};

const primaryButtonStyle = {
    padding: "11px 22px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
};

const secondaryButtonStyle = {
    padding: "10px 22px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
};

export default AddVendor;