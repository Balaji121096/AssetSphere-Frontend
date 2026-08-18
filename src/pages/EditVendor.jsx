import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";


function EditVendor() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

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
    // LOAD VENDOR
    // =====================================================

    const loadVendor = async () => {

        try {

            setLoading(true);


            const response =
                await API.get(
                    `/vendors/${id}`
                );


            const vendor =
                response.data.data;


            if (!vendor) {

                alert(
                    "Vendor not found"
                );

                navigate("/vendors");

                return;

            }


            setForm({

                vendor_code:
                    vendor.vendor_code || "",

                vendor_name:
                    vendor.vendor_name || "",

                contact_person:
                    vendor.contact_person || "",

                email:
                    vendor.email || "",

                mobile:
                    vendor.mobile || "",

                address:
                    vendor.address || "",

                city:
                    vendor.city || "",

                state:
                    vendor.state || "",

                country:
                    vendor.country || "India",

                gst_number:
                    vendor.gst_number || "",

                status:
                    vendor.status || "Active"

            });

        } catch (error) {

            console.error(
                "Load Vendor Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load vendor"
            );

            navigate("/vendors");

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadVendor();

    }, [id]);


    // =====================================================
    // HANDLE CHANGE
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
    // UPDATE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!form.vendor_code.trim()) {

            alert(
                "Vendor code is required"
            );

            return;

        }


        if (!form.vendor_name.trim()) {

            alert(
                "Vendor name is required"
            );

            return;

        }


        try {

            setSaving(true);


            const response =
                await API.put(
                    `/vendors/${id}`,
                    form
                );


            if (response.data.success) {

                alert(
                    "Vendor updated successfully"
                );


                navigate(
                    `/vendors/${id}`
                );

            }

        } catch (error) {

            console.error(
                "Update Vendor Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to update vendor"
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
                            padding: "30px"
                        }}
                    >
                        Loading vendor...
                    </div>

                </div>

            </div>

        );

    }


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
                            Edit Vendor
                        </h1>

                        <p
                            style={{
                                color: "#64748b"
                            }}
                        >
                            Update vendor information
                        </p>

                    </div>


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

                            <FormInput
                                label="Vendor Code *"
                                name="vendor_code"
                                value={
                                    form.vendor_code
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <FormInput
                                label="Vendor Name *"
                                name="vendor_name"
                                value={
                                    form.vendor_name
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <FormInput
                                label="Contact Person"
                                name="contact_person"
                                value={
                                    form.contact_person
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <FormInput
                                label="Email"
                                name="email"
                                type="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <FormInput
                                label="Mobile"
                                name="mobile"
                                value={
                                    form.mobile
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <FormInput
                                label="GST Number"
                                name="gst_number"
                                value={
                                    form.gst_number
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <FormInput
                                label="City"
                                name="city"
                                value={
                                    form.city
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <FormInput
                                label="State"
                                name="state"
                                value={
                                    form.state
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <FormInput
                                label="Country"
                                name="country"
                                value={
                                    form.country
                                }
                                onChange={
                                    handleChange
                                }
                            />


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
                                    rows="4"
                                    style={{
                                        ...inputStyle,
                                        resize: "vertical"
                                    }}
                                />

                            </div>

                        </div>


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
                                    navigate(
                                        `/vendors/${id}`
                                    )
                                }
                                style={secondaryButton}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={saving}
                                style={primaryButton}
                            >
                                {saving
                                    ? "Updating..."
                                    : "Update Vendor"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}


// =====================================================
// FORM INPUT
// =====================================================

function FormInput({

    label,
    name,
    value,
    onChange,
    type = "text"

}) {

    return (

        <div>

            <label style={labelStyle}>
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                style={inputStyle}
            />

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


export default EditVendor;