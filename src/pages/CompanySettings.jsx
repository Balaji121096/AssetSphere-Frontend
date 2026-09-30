import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";


// =====================================================
// GET TOKEN
// =====================================================

const getToken = () => {

    return (
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        ""
    );

};


// =====================================================
// INITIAL FORM
// =====================================================

const initialForm = {

    company_name: "",
    company_code: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phone: "",
    email: "",
    website: "",
    logo: "",
    gst_number: "",
    cin: "",
    pan: ""

};


// =====================================================
// COMPANY SETTINGS
// =====================================================

function CompanySettings() {

    const navigate = useNavigate();


    const [form, setForm] =
        useState(initialForm);


    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);


    const [message, setMessage] =
        useState("");


    const [error, setError] =
        useState("");


    // =================================================
    // LOAD SETTINGS
    // =================================================

    useEffect(() => {

        loadCompanySettings();

    }, []);


    const loadCompanySettings = async () => {

        try {

            setLoading(true);

            setError("");


            const token = getToken();


            const response = await fetch(
                `${API_URL}/api/company-settings`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to load company settings"
                );

            }


            if (result.data) {

                setForm({

                    company_name:
                        result.data.company_name || "",

                    company_code:
                        result.data.company_code || "",

                    address:
                        result.data.address || "",

                    city:
                        result.data.city || "",

                    state:
                        result.data.state || "",

                    country:
                        result.data.country || "",

                    pincode:
                        result.data.pincode || "",

                    phone:
                        result.data.phone || "",

                    email:
                        result.data.email || "",

                    website:
                        result.data.website || "",

                    logo:
                        result.data.logo || "",

                    gst_number:
                        result.data.gst_number || "",

                    cin:
                        result.data.cin || "",

                    pan:
                        result.data.pan || ""

                });

            }


        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to load company settings"
            );

        } finally {

            setLoading(false);

        }

    };


    // =================================================
    // HANDLE CHANGE
    // =================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm((prev) => ({

            ...prev,

            [name]: value

        }));


        setMessage("");
        setError("");

    };


    // =================================================
    // SAVE
    // =================================================

    const handleSave = async (e) => {

        e.preventDefault();


        if (
            !form.company_name.trim()
        ) {

            setError(
                "Company name is required"
            );

            return;

        }


        try {

            setSaving(true);

            setMessage("");
            setError("");


            const token = getToken();


            const response = await fetch(
                `${API_URL}/api/company-settings`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(form)

                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to update company settings"
                );

            }


            if (result.data) {

                setForm({

                    company_name:
                        result.data.company_name || "",

                    company_code:
                        result.data.company_code || "",

                    address:
                        result.data.address || "",

                    city:
                        result.data.city || "",

                    state:
                        result.data.state || "",

                    country:
                        result.data.country || "",

                    pincode:
                        result.data.pincode || "",

                    phone:
                        result.data.phone || "",

                    email:
                        result.data.email || "",

                    website:
                        result.data.website || "",

                    logo:
                        result.data.logo || "",

                    gst_number:
                        result.data.gst_number || "",

                    cin:
                        result.data.cin || "",

                    pan:
                        result.data.pan || ""

                });

            }


            setMessage(
                "Company settings updated successfully."
            );


        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to update company settings"
            );

        } finally {

            setSaving(false);

        }

    };


    // =================================================
    // CANCEL
    // =================================================

    const handleCancel = () => {

        navigate("/settings");

    };


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (

            <div style={pageStyle}>

                <Sidebar />

                <div style={mainStyle}>

                    <Navbar />

                    <main style={contentStyle}>

                        <div style={loadingStyle}>

                            Loading company settings...

                        </div>

                    </main>

                </div>

            </div>

        );

    }


    // =================================================
    // UI
    // =================================================

    return (

        <div style={pageStyle}>

            <Sidebar />


            <div style={mainStyle}>

                <Navbar />


                <main style={contentStyle}>


                    {/* =================================
                        HEADER
                    ================================= */}

                    <section className="company-hero">

                        <div>

                            <div className="hero-eyebrow">

                                ASSETSPHERE • SETTINGS

                            </div>


                            <h1>

                                Company Settings

                            </h1>


                            <p>

                                Manage your company information
                                and organization details.

                            </p>

                        </div>


                        <div className="hero-icon">

                            🏢

                        </div>

                    </section>


                    {/* =================================
                        MESSAGES
                    ================================= */}

                    {message && (

                        <div
                            style={
                                successMessageStyle
                            }
                        >

                            ✓ {message}

                        </div>

                    )}


                    {error && (

                        <div
                            style={
                                errorMessageStyle
                            }
                        >

                            ⚠ {error}

                        </div>

                    )}


                    <form
                        onSubmit={handleSave}
                    >


                        {/* =================================
                            BASIC INFORMATION
                        ================================= */}

                        <section
                            style={cardStyle}
                        >

                            <div
                                style={cardHeaderStyle}
                            >

                                <div>

                                    <h2
                                        style={
                                            cardTitleStyle
                                        }
                                    >

                                        Basic Information

                                    </h2>


                                    <p
                                        style={
                                            cardDescriptionStyle
                                        }
                                    >

                                        Basic identification
                                        information of your company.

                                    </p>

                                </div>


                                <div
                                    style={cardIconStyle}
                                >

                                    🏢

                                </div>

                            </div>


                            <div
                                style={formGridStyle}
                            >

                                <FormField
                                    label="Company Name"
                                    name="company_name"
                                    value={form.company_name}
                                    onChange={handleChange}
                                    required
                                    full
                                />


                                <FormField
                                    label="Company Code"
                                    name="company_code"
                                    value={form.company_code}
                                    onChange={handleChange}
                                    placeholder="Example: URCTS"
                                />

                            </div>

                        </section>


                        {/* =================================
                            ADDRESS
                        ================================= */}

                        <section
                            style={cardStyle}
                        >

                            <div
                                style={cardHeaderStyle}
                            >

                                <div>

                                    <h2
                                        style={
                                            cardTitleStyle
                                        }
                                    >

                                        Address & Location

                                    </h2>


                                    <p
                                        style={
                                            cardDescriptionStyle
                                        }
                                    >

                                        Registered or primary
                                        company location details.

                                    </p>

                                </div>


                                <div
                                    style={cardIconStyle}
                                >

                                    📍

                                </div>

                            </div>


                            <div
                                style={formGridStyle}
                            >

                                <FormField
                                    label="Address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    textarea
                                    full
                                />


                                <FormField
                                    label="City"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                />


                                <FormField
                                    label="State"
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                />


                                <FormField
                                    label="Country"
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                />


                                <FormField
                                    label="Pincode"
                                    name="pincode"
                                    value={form.pincode}
                                    onChange={handleChange}
                                />

                            </div>

                        </section>


                        {/* =================================
                            CONTACT
                        ================================= */}

                        <section
                            style={cardStyle}
                        >

                            <div
                                style={cardHeaderStyle}
                            >

                                <div>

                                    <h2
                                        style={
                                            cardTitleStyle
                                        }
                                    >

                                        Contact Information

                                    </h2>


                                    <p
                                        style={
                                            cardDescriptionStyle
                                        }
                                    >

                                        Official company contact
                                        information.

                                    </p>

                                </div>


                                <div
                                    style={cardIconStyle}
                                >

                                    📞

                                </div>

                            </div>


                            <div
                                style={formGridStyle}
                            >

                                <FormField
                                    label="Phone"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />


                                <FormField
                                    label="Email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    type="email"
                                />


                                <FormField
                                    label="Website"
                                    name="website"
                                    value={form.website}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                    full
                                />

                            </div>

                        </section>


                        {/* =================================
                            LEGAL
                        ================================= */}

                        <section
                            style={cardStyle}
                        >

                            <div
                                style={cardHeaderStyle}
                            >

                                <div>

                                    <h2
                                        style={
                                            cardTitleStyle
                                        }
                                    >

                                        Legal & Tax Information

                                    </h2>


                                    <p
                                        style={
                                            cardDescriptionStyle
                                        }
                                    >

                                        Optional statutory and
                                        registration information.

                                    </p>

                                </div>


                                <div
                                    style={cardIconStyle}
                                >

                                    📄

                                </div>

                            </div>


                            <div
                                style={formGridStyle}
                            >

                                <FormField
                                    label="GST Number"
                                    name="gst_number"
                                    value={form.gst_number}
                                    onChange={handleChange}
                                />


                                <FormField
                                    label="PAN"
                                    name="pan"
                                    value={form.pan}
                                    onChange={handleChange}
                                />


                                <FormField
                                    label="CIN"
                                    name="cin"
                                    value={form.cin}
                                    onChange={handleChange}
                                    full
                                />

                            </div>

                        </section>


                        {/* =================================
                            LOGO
                        ================================= */}

                        <section
                            style={cardStyle}
                        >

                            <div
                                style={cardHeaderStyle}
                            >

                                <div>

                                    <h2
                                        style={
                                            cardTitleStyle
                                        }
                                    >

                                        Company Logo

                                    </h2>


                                    <p
                                        style={
                                            cardDescriptionStyle
                                        }
                                    >

                                        Store the company logo URL
                                        for use in future reports
                                        and documents.

                                    </p>

                                </div>


                                <div
                                    style={cardIconStyle}
                                >

                                    🖼️

                                </div>

                            </div>


                            <FormField
                                label="Logo URL"
                                name="logo"
                                value={form.logo}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                                full
                            />


                            {form.logo && (

                                <div
                                    style={
                                        logoPreviewWrapperStyle
                                    }
                                >

                                    <div
                                        style={
                                            logoPreviewLabelStyle
                                        }
                                    >

                                        LOGO PREVIEW

                                    </div>


                                    <img
                                        src={form.logo}
                                        alt="Company Logo"
                                        style={
                                            logoPreviewStyle
                                        }

                                        onError={(e) => {

                                            e.currentTarget.style.display =
                                                "none";

                                        }}

                                    />

                                </div>

                            )}

                        </section>


                        {/* =================================
                            ACTIONS
                        ================================= */}

                        <div
                            style={actionsStyle}
                        >

                            <button
                                type="button"
                                onClick={handleCancel}
                                style={cancelButtonStyle}
                            >

                                Cancel

                            </button>


                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    ...saveButtonStyle,

                                    opacity:
                                        saving
                                            ? 0.7
                                            : 1,

                                    cursor:
                                        saving
                                            ? "not-allowed"
                                            : "pointer"

                                }}
                            >

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}

                            </button>

                        </div>


                    </form>


                </main>

            </div>


            <style>
                {`

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                }

                .company-hero {

                    display: flex;

                    justify-content: space-between;

                    align-items: center;

                    gap: 20px;

                    padding: 28px 24px;

                    margin-bottom: 24px;

                    border-radius: 16px;

                    background:
                        linear-gradient(
                            135deg,
                            var(--sidebar-color) 0%,
                            var(--primary-color) 100%
                        );

                    color: #ffffff;

                    box-shadow:
                        0 12px 30px
                        rgba(15,23,42,0.12);

                }

                .hero-eyebrow {

                    color: #dbeafe;

                    font-size: 10px;

                    font-weight: 800;

                    letter-spacing: 1.3px;

                    margin-bottom: 8px;

                }

                .company-hero h1 {

                    margin: 0;

                    color: #ffffff;

                    font-size: 28px;

                    font-weight: 800;

                }

                .company-hero p {

                    margin: 7px 0 0;

                    color: #dbeafe;

                    font-size: 12px;

                    line-height: 1.5;

                }

                .hero-icon {

                    width: 48px;

                    height: 48px;

                    border-radius: 11px;

                    background:
                        rgba(255,255,255,0.12);

                    border:
                        1px solid
                        rgba(255,255,255,0.20);

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    font-size: 22px;

                    flex-shrink: 0;

                }

                @media (max-width: 700px) {

                    .company-hero {

                        padding: 22px 20px;

                    }

                    .company-hero h1 {

                        font-size: 24px;

                    }

                    .hero-icon {

                        display: none;

                    }

                }

                @media (max-width: 600px) {

                    .company-form-grid {

                        grid-template-columns: 1fr !important;

                    }

                }

                `}
            </style>

        </div>

    );

}


// =====================================================
// FORM FIELD
// =====================================================

function FormField({

    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    textarea = false,
    required = false,
    full = false

}) {

    return (

        <div
            className={
                full
                    ? "company-form-field-full"
                    : ""
            }

            style={{
                ...fieldWrapperStyle,

                gridColumn:
                    full
                        ? "1 / -1"
                        : "auto"

            }}
        >

            <label
                style={labelStyle}
            >

                {label}

                {required && (

                    <span
                        style={requiredStyle}
                    >
                        *
                    </span>

                )}

            </label>


            {textarea ? (

                <textarea

                    name={name}

                    value={value}

                    onChange={onChange}

                    placeholder={placeholder}

                    required={required}

                    rows={4}

                    style={{
                        ...inputStyle,

                        resize: "vertical"

                    }}

                />

            ) : (

                <input

                    type={type}

                    name={name}

                    value={value}

                    onChange={onChange}

                    placeholder={placeholder}

                    required={required}

                    style={inputStyle}

                />

            )}

        </div>

    );

}


// =====================================================
// STYLES
// =====================================================

const pageStyle = {

    display: "flex",

    minHeight: "100vh",

    background:
        "var(--app-background)",

    color:
        "var(--text-color)"

};


const mainStyle = {

    flex: 1,

    minWidth: 0

};


const contentStyle = {

    width: "100%",

    maxWidth: "1250px",

    margin: "0 auto",

    padding: "32px",

    boxSizing: "border-box"

};


const loadingStyle = {

    minHeight: "300px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color:
        "var(--muted-text-color)",

    fontSize: "13px"

};


const cardStyle = {

    background:
        "var(--card-color)",

    border:
        "1px solid var(--border-color)",

    borderRadius: "14px",

    marginBottom: "18px",

    overflow: "hidden",

    boxShadow:
        "0 3px 10px rgba(15,23,42,0.03)"

};


const cardHeaderStyle = {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "15px",

    padding: "18px 20px",

    borderBottom:
        "1px solid var(--border-color)"

};


const cardTitleStyle = {

    margin: 0,

    fontSize: "16px",

    fontWeight: "700",

    color:
        "var(--text-color)"

};


const cardDescriptionStyle = {

    margin: "5px 0 0",

    fontSize: "12px",

    color:
        "var(--muted-text-color)",

    lineHeight: "1.5"

};


const cardIconStyle = {

    width: "38px",

    height: "38px",

    borderRadius: "10px",

    background:
        "var(--app-background)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "18px",

    flexShrink: 0

};


const formGridStyle = {

    display: "grid",

    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",

    gap: "18px",

    padding: "20px"

};


const fieldWrapperStyle = {

    minWidth: 0

};


const labelStyle = {

    display: "block",

    marginBottom: "7px",

    fontSize: "11px",

    fontWeight: "700",

    color:
        "var(--muted-text-color)",

    textTransform: "uppercase",

    letterSpacing: "0.5px"

};


const requiredStyle = {

    color: "#dc2626",

    marginLeft: "3px"

};


const inputStyle = {

    width: "100%",

    padding: "10px 12px",

    border:
        "1px solid var(--border-color)",

    borderRadius: "9px",

    background:
        "var(--app-background)",

    color:
        "var(--text-color)",

    fontSize: "13px",

    outline: "none",

    fontFamily: "inherit",

    boxSizing: "border-box"

};


const logoPreviewWrapperStyle = {

    margin:
        "0 20px 20px",

    padding: "15px",

    border:
        "1px dashed var(--border-color)",

    borderRadius: "10px",

    background:
        "var(--app-background)"

};


const logoPreviewLabelStyle = {

    fontSize: "9px",

    fontWeight: "800",

    letterSpacing: "1px",

    color:
        "var(--muted-text-color)",

    marginBottom: "10px"

};


const logoPreviewStyle = {

    maxWidth: "180px",

    maxHeight: "80px",

    objectFit: "contain",

    display: "block"

};


const actionsStyle = {

    display: "flex",

    justifyContent: "flex-end",

    gap: "10px",

    padding:
        "4px 0 20px"

};


const cancelButtonStyle = {

    padding: "10px 18px",

    borderRadius: "9px",

    border:
        "1px solid var(--border-color)",

    background:
        "var(--card-color)",

    color:
        "var(--text-color)",

    fontSize: "12px",

    fontWeight: "700",

    cursor: "pointer"

};


const saveButtonStyle = {

    padding: "10px 20px",

    border: "none",

    borderRadius: "9px",

    background:
        "var(--primary-color)",

    color: "#ffffff",

    fontSize: "12px",

    fontWeight: "700"

};


const successMessageStyle = {

    marginBottom: "16px",

    padding: "11px 14px",

    borderRadius: "9px",

    background: "#ecfdf5",

    border: "1px solid #a7f3d0",

    color: "#047857",

    fontSize: "12px",

    fontWeight: "600"

};


const errorMessageStyle = {

    marginBottom: "16px",

    padding: "11px 14px",

    borderRadius: "9px",

    background: "#fef2f2",

    border: "1px solid #fecaca",

    color: "#b91c1c",

    fontSize: "12px",

    fontWeight: "600"

};


export default CompanySettings;