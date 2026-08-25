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


    // =====================================================
    // LOAD VENDORS
    // =====================================================

    useEffect(() => {

        const loadVendors = async () => {

            try {

                setVendorLoading(true);

                const response =
                    await API.get("/vendors");

                setVendors(
                    response.data.data || []
                );

            } catch (error) {

                console.error(
                    "Vendor Load Error:",
                    error
                );

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


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // =====================================================
    // VALIDATION
    // =====================================================

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


        return true;

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!validateForm()) {
            return;
        }


        try {

            setLoading(true);


            const payload = {

                software_code:
                    form.software_code.trim(),

                software_name:
                    form.software_name.trim(),

                publisher:
                    form.publisher.trim(),

                version:
                    form.version.trim(),

                license_type:
                    form.license_type,

                total_licenses:
                    Number(form.total_licenses),

                purchase_date:
                    form.purchase_date || null,

                expiry_date:
                    form.expiry_date || null,

                cost:
                    Number(form.cost || 0),

                vendor_id:
                    form.vendor_id
                        ? Number(form.vendor_id)
                        : null,

                status:
                    form.status,

                description:
                    form.description.trim()

            };


            await API.post(
                "/software",
                payload
            );


            alert(
                "Software added successfully"
            );


            navigate(
                "/software"
            );


        } catch (error) {

            console.error(
                "Add Software Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to add software"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        if (loading) {
            return;
        }

        navigate("/software");

    };


    return (

        <div style={pageStyle}>

            <Sidebar />


            <div style={contentStyle}>

                <Navbar />


                <main style={mainStyle}>

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div style={headerStyle}>

                        <div>

                            <div style={breadcrumbStyle}>
                                Software / Add Software
                            </div>

                            <h1 style={titleStyle}>
                                Add Software
                            </h1>

                            <p style={subtitleStyle}>
                                Add company software and license details
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


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                        style={formCardStyle}
                    >

                        {/* =================================================
                            SOFTWARE INFORMATION
                        ================================================= */}

                        <div style={sectionHeaderStyle}>

                            <div style={sectionIconStyle}>
                                💻
                            </div>

                            <div>

                                <h2 style={sectionTitleStyle}>
                                    Software Information
                                </h2>

                                <p style={sectionSubtitleStyle}>
                                    Enter software and licensing details
                                </p>

                            </div>

                        </div>


                        <div style={gridStyle}>

                            {/* Software Code */}

                            <FormField
                                label="Software Code"
                                required
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


                            {/* Software Name */}

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


                            {/* Publisher */}

                            <FormField
                                label="Publisher"
                            >

                                <input
                                    type="text"
                                    name="publisher"
                                    value={form.publisher}
                                    onChange={handleChange}
                                    placeholder="Microsoft"
                                    style={inputStyle}
                                />

                            </FormField>


                            {/* Version */}

                            <FormField
                                label="Version"
                            >

                                <input
                                    type="text"
                                    name="version"
                                    value={form.version}
                                    onChange={handleChange}
                                    placeholder="2026"
                                    style={inputStyle}
                                />

                            </FormField>


                            {/* License Type */}

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


                            {/* Total Licenses */}

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


                            {/* Purchase Date */}

                            <FormField
                                label="Purchase Date"
                            >

                                <input
                                    type="date"
                                    name="purchase_date"
                                    value={form.purchase_date}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />

                            </FormField>


                            {/* Expiry Date */}

                            <FormField
                                label="Expiry Date"
                            >

                                <input
                                    type="date"
                                    name="expiry_date"
                                    value={form.expiry_date}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />

                            </FormField>


                            {/* Cost */}

                            <FormField
                                label="Cost"
                            >

                                <input
                                    type="number"
                                    name="cost"
                                    value={form.cost}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="250000"
                                    style={inputStyle}
                                />

                            </FormField>


                            {/* Vendor */}

                            <FormField
                                label="Vendor"
                            >

                                <select
                                    name="vendor_id"
                                    value={form.vendor_id}
                                    onChange={handleChange}
                                    disabled={vendorLoading}
                                    style={inputStyle}
                                >

                                    <option value="">
                                        {vendorLoading
                                            ? "Loading vendors..."
                                            : "Select Vendor"}
                                    </option>

                                    {vendors.map(
                                        (vendor) => (

                                            <option
                                                key={
                                                    vendor.vendor_id
                                                }
                                                value={
                                                    vendor.vendor_id
                                                }
                                            >
                                                {
                                                    vendor.vendor_name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </FormField>


                            {/* Status */}

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


                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <div
                            style={{
                                marginTop: "22px"
                            }}
                        >

                            <label style={labelStyle}>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Enter software license details..."
                                rows="5"
                                style={{
                                    ...inputStyle,
                                    height: "auto",
                                    padding: "12px",
                                    resize: "vertical"
                                }}
                            />

                        </div>


                        {/* =================================================
                            BUTTONS
                        ================================================= */}

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
                                            ? 0.7
                                            : 1
                                }}
                            >
                                {loading
                                    ? "Adding Software..."
                                    : "Add Software"}
                            </button>

                        </div>

                    </form>

                </main>

            </div>

        </div>

    );

}


// =====================================================
// REUSABLE FORM FIELD
// =====================================================

function FormField({
    label,
    required,
    children
}) {

    return (

        <div style={fieldStyle}>

            <label style={labelStyle}>

                {label}

                {required && (
                    <span style={requiredStyle}>
                        *
                    </span>
                )}

            </label>

            {children}

        </div>

    );

}


// =====================================================
// STYLES
// =====================================================

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
    padding: "30px",
    maxWidth: "1200px",
    margin: "0 auto"
};


const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "25px"
};


const breadcrumbStyle = {
    color: "#64748b",
    fontSize: "13px",
    marginBottom: "8px"
};


const titleStyle = {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a"
};


const subtitleStyle = {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px"
};


const backButtonStyle = {
    padding: "9px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#334155",
    cursor: "pointer",
    fontSize: "13px"
};


const formCardStyle = {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)"
};


const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingBottom: "20px",
    marginBottom: "25px",
    borderBottom: "1px solid #e2e8f0"
};


const sectionIconStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "9px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px"
};


const sectionTitleStyle = {
    margin: 0,
    fontSize: "17px",
    color: "#0f172a"
};


const sectionSubtitleStyle = {
    margin: "3px 0 0",
    color: "#64748b",
    fontSize: "12px"
};


const gridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px"
};


const fieldStyle = {
    display: "flex",
    flexDirection: "column"
};


const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155"
};


const requiredStyle = {
    color: "#dc2626",
    marginLeft: "3px"
};


const inputStyle = {
    width: "100%",
    height: "42px",
    padding: "0 12px",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "13px",
    outline: "none"
};


const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "28px",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0"
};


const cancelButtonStyle = {
    padding: "10px 18px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#334155",
    cursor: "pointer",
    fontSize: "13px"
};


const submitButtonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600"
};


export default AddSoftware;