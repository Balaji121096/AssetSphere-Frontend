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


            const response =
                await API.post(
                    "/vendors",
                    form
                );


            if (response.data.success) {

                alert(
                    "Vendor added successfully"
                );


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


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f5f5f5"
            }}
        >

            <Sidebar />


            <div
                style={{
                    flex: 1
                }}
            >

                <Navbar />


                <div
                    style={{
                        padding: "25px",
                        maxWidth: "1000px"
                    }}
                >

                    {/* HEADER */}

                    <div
                        style={{
                            marginBottom: "25px"
                        }}
                    >

                        <h1
                            style={{
                                margin: 0
                            }}
                        >
                            Add Vendor
                        </h1>

                        <p
                            style={{
                                color: "#64748b"
                            }}
                        >
                            Create a new asset vendor
                        </p>

                    </div>


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            background: "#ffffff",
                            padding: "25px",
                            borderRadius: "10px",
                            boxShadow:
                                "0 1px 3px rgba(0,0,0,0.08)"
                        }}
                    >

                        <div
                            style={gridStyle}
                        >

                            {/* Vendor Code */}

                            <div>

                                <label style={labelStyle}>
                                    Vendor Code *
                                </label>

                                <input
                                    type="text"
                                    name="vendor_code"
                                    value={
                                        form.vendor_code
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter vendor code"
                                    style={inputStyle}
                                />

                            </div>


                            {/* Vendor Name */}

                            <div>

                                <label style={labelStyle}>
                                    Vendor Name *
                                </label>

                                <input
                                    type="text"
                                    name="vendor_name"
                                    value={
                                        form.vendor_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter vendor name"
                                    style={inputStyle}
                                />

                            </div>


                            {/* Contact Person */}

                            <div>

                                <label style={labelStyle}>
                                    Contact Person
                                </label>

                                <input
                                    type="text"
                                    name="contact_person"
                                    value={
                                        form.contact_person
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter contact person"
                                    style={inputStyle}
                                />

                            </div>


                            {/* Email */}

                            <div>

                                <label style={labelStyle}>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        form.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter email"
                                    style={inputStyle}
                                />

                            </div>


                            {/* Mobile */}

                            <div>

                                <label style={labelStyle}>
                                    Mobile
                                </label>

                                <input
                                    type="text"
                                    name="mobile"
                                    value={
                                        form.mobile
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter mobile number"
                                    style={inputStyle}
                                />

                            </div>


                            {/* GST */}

                            <div>

                                <label style={labelStyle}>
                                    GST Number
                                </label>

                                <input
                                    type="text"
                                    name="gst_number"
                                    value={
                                        form.gst_number
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter GST number"
                                    style={inputStyle}
                                />

                            </div>


                            {/* City */}

                            <div>

                                <label style={labelStyle}>
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={
                                        form.city
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter city"
                                    style={inputStyle}
                                />

                            </div>


                            {/* State */}

                            <div>

                                <label style={labelStyle}>
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={
                                        form.state
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter state"
                                    style={inputStyle}
                                />

                            </div>


                            {/* Country */}

                            <div>

                                <label style={labelStyle}>
                                    Country
                                </label>

                                <input
                                    type="text"
                                    name="country"
                                    value={
                                        form.country
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter country"
                                    style={inputStyle}
                                />

                            </div>


                            {/* Status */}

                            <div>

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


                            {/* Address */}

                            <div
                                style={{
                                    gridColumn:
                                        "1 / -1"
                                }}
                            >

                                <label style={labelStyle}>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={
                                        form.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter vendor address"
                                    rows="4"
                                    style={{
                                        ...inputStyle,
                                        resize: "vertical"
                                    }}
                                />

                            </div>

                        </div>


                        {/* BUTTONS */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px",
                                marginTop: "25px"
                            }}
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/vendors")
                                }
                                style={secondaryButton}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={loading}
                                style={primaryButton}
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Vendor"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}


// =====================================================
// STYLES
// =====================================================

const gridStyle = {

    display: "grid",

    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",

    gap: "18px"

};


const labelStyle = {

    display: "block",

    marginBottom: "6px",

    fontSize: "13px",

    fontWeight: "600",

    color: "#334155"

};


const inputStyle = {

    width: "100%",

    boxSizing: "border-box",

    padding: "10px 12px",

    border:
        "1px solid #cbd5e1",

    borderRadius: "6px",

    outline: "none",

    fontSize: "14px"

};


const primaryButton = {

    padding: "10px 18px",

    border: "none",

    background: "#2563eb",

    color: "#ffffff",

    borderRadius: "6px",

    cursor: "pointer"

};


const secondaryButton = {

    padding: "10px 18px",

    border:
        "1px solid #cbd5e1",

    background: "#ffffff",

    color: "#334155",

    borderRadius: "6px",

    cursor: "pointer"

};


export default AddVendor;