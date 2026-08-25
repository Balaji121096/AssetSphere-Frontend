import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";


function AddAsset() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [locations, setLocations] = useState([]);

    const [loading, setLoading] = useState(false);
    const [dropdownLoading, setDropdownLoading] = useState(true);

    const [form, setForm] = useState({
        asset_code: "",
        asset_name: "",
        brand: "",
        model: "",
        serial_number: "",
        category_id: "",
        vendor_id: "",
        location_id: ""
    });


    // =====================================================
    // LOAD DROPDOWN DATA
    // =====================================================

    useEffect(() => {

        const loadDropdownData = async () => {

            try {

                setDropdownLoading(true);

                const [
                    categoryRes,
                    vendorRes,
                    locationRes
                ] = await Promise.all([
                    API.get("/categories"),
                    API.get("/vendors"),
                    API.get("/locations")
                ]);

                setCategories(
                    categoryRes.data.data || []
                );

                setVendors(
                    vendorRes.data.data || []
                );

                setLocations(
                    locationRes.data.data || []
                );

            } catch (error) {

                console.error(
                    "Dropdown Load Error:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to load category/vendor/location data"
                );

            } finally {

                setDropdownLoading(false);

            }

        };

        loadDropdownData();

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
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.asset_code.trim()) {

            alert("Asset Code is required");
            return;

        }

        if (!form.asset_name.trim()) {

            alert("Asset Name is required");
            return;

        }

        if (!form.brand.trim()) {

            alert("Brand is required");
            return;

        }

        if (!form.model.trim()) {

            alert("Model is required");
            return;

        }

        if (!form.serial_number.trim()) {

            alert("Serial Number is required");
            return;

        }

        if (!form.category_id) {

            alert("Please select a category");
            return;

        }

        if (!form.vendor_id) {

            alert("Please select a vendor");
            return;

        }

        if (!form.location_id) {

            alert("Please select a location");
            return;

        }


        try {

            setLoading(true);

            await API.post(
                "/assets",
                {
                    ...form,

                    asset_code:
                        form.asset_code.trim(),

                    asset_name:
                        form.asset_name.trim(),

                    brand:
                        form.brand.trim(),

                    model:
                        form.model.trim(),

                    serial_number:
                        form.serial_number.trim(),

                    category_id:
                        Number(form.category_id),

                    vendor_id:
                        Number(form.vendor_id),

                    location_id:
                        Number(form.location_id)
                }
            );


            alert(
                "Asset added successfully"
            );

            navigate("/assets");


        } catch (error) {

            console.error(
                "Add Asset Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to add asset"
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

        navigate("/assets");

    };


    return (

        <div style={pageStyle}>

            <Sidebar />


            <div style={contentStyle}>

                <Navbar />


                <main style={mainStyle}>

                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div style={headerStyle}>

                        <div>

                            <div style={breadcrumbStyle}>
                                Hardware Assets / Add Asset
                            </div>

                            <h1 style={titleStyle}>
                                Add Hardware Asset
                            </h1>

                            <p style={subtitleStyle}>
                                Add a new company hardware asset
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={handleCancel}
                            style={backButtonStyle}
                            disabled={loading}
                        >
                            ← Back to Assets
                        </button>

                    </div>


                    {/* =================================================
                        FORM CARD
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                        style={formCardStyle}
                    >

                        {/* =================================================
                            BASIC INFORMATION
                        ================================================= */}

                        <div style={sectionHeaderStyle}>

                            <div style={sectionIconStyle}>
                                🖥️
                            </div>

                            <div>

                                <h2 style={sectionTitleStyle}>
                                    Asset Information
                                </h2>

                                <p style={sectionSubtitleStyle}>
                                    Enter the basic hardware asset details
                                </p>

                            </div>

                        </div>


                        <div style={gridStyle}>

                            {/* Asset Code */}

                            <FormField
                                label="Asset Code"
                                required
                            >

                                <input
                                    type="text"
                                    name="asset_code"
                                    value={form.asset_code}
                                    onChange={handleChange}
                                    placeholder="AST-001"
                                    required
                                    style={inputStyle}
                                />

                            </FormField>


                            {/* Asset Name */}

                            <FormField
                                label="Asset Name"
                                required
                            >

                                <input
                                    type="text"
                                    name="asset_name"
                                    value={form.asset_name}
                                    onChange={handleChange}
                                    placeholder="Dell Latitude Laptop"
                                    required
                                    style={inputStyle}
                                />

                            </FormField>


                            {/* Brand */}

                            <FormField
                                label="Brand"
                                required
                            >

                                <input
                                    type="text"
                                    name="brand"
                                    value={form.brand}
                                    onChange={handleChange}
                                    placeholder="Dell"
                                    required
                                    style={inputStyle}
                                />

                            </FormField>


                            {/* Model */}

                            <FormField
                                label="Model"
                                required
                            >

                                <input
                                    type="text"
                                    name="model"
                                    value={form.model}
                                    onChange={handleChange}
                                    placeholder="Latitude 5440"
                                    required
                                    style={inputStyle}
                                />

                            </FormField>


                            {/* Serial Number */}

                            <FormField
                                label="Serial Number"
                                required
                            >

                                <input
                                    type="text"
                                    name="serial_number"
                                    value={form.serial_number}
                                    onChange={handleChange}
                                    placeholder="SN123456789"
                                    required
                                    style={inputStyle}
                                />

                            </FormField>


                            {/* Category */}

                            <FormField
                                label="Category"
                                required
                            >

                                <select
                                    name="category_id"
                                    value={form.category_id}
                                    onChange={handleChange}
                                    required
                                    disabled={dropdownLoading}
                                    style={inputStyle}
                                >

                                    <option value="">
                                        {dropdownLoading
                                            ? "Loading categories..."
                                            : "Select Category"}
                                    </option>

                                    {categories.map(
                                        (category) => (

                                            <option
                                                key={
                                                    category.category_id
                                                }
                                                value={
                                                    category.category_id
                                                }
                                            >
                                                {
                                                    category.category_name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </FormField>


                            {/* Vendor */}

                            <FormField
                                label="Vendor"
                                required
                            >

                                <select
                                    name="vendor_id"
                                    value={form.vendor_id}
                                    onChange={handleChange}
                                    required
                                    disabled={dropdownLoading}
                                    style={inputStyle}
                                >

                                    <option value="">
                                        {dropdownLoading
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


                            {/* Location */}

                            <FormField
                                label="Location"
                                required
                            >

                                <select
                                    name="location_id"
                                    value={form.location_id}
                                    onChange={handleChange}
                                    required
                                    disabled={dropdownLoading}
                                    style={inputStyle}
                                >

                                    <option value="">
                                        {dropdownLoading
                                            ? "Loading locations..."
                                            : "Select Location"}
                                    </option>

                                    {locations.map(
                                        (location) => (

                                            <option
                                                key={
                                                    location.location_id
                                                }
                                                value={
                                                    location.location_id
                                                }
                                            >
                                                {
                                                    location.location_name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </FormField>

                        </div>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <div style={statusSectionStyle}>

                            <div>

                                <label style={labelStyle}>
                                    Asset Status
                                </label>

                                <p style={helpTextStyle}>
                                    New assets are automatically added
                                    as "In Stock".
                                </p>

                            </div>


                            <div style={statusBadgeStyle}>
                                <span
                                    style={statusDotStyle}
                                />
                                In Stock
                            </div>

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
                                    dropdownLoading
                                }
                                style={{
                                    ...submitButtonStyle,
                                    opacity:
                                        loading ||
                                        dropdownLoading
                                            ? 0.7
                                            : 1
                                }}
                            >
                                {loading
                                    ? "Adding Asset..."
                                    : "Add Asset"}
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


const statusSectionStyle = {
    marginTop: "25px",
    padding: "16px",
    borderRadius: "8px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px"
};


const helpTextStyle = {
    margin: "3px 0 0",
    fontSize: "12px",
    color: "#64748b"
};


const statusBadgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "7px 12px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "600"
};


const statusDotStyle = {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22c55e"
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


export default AddAsset;