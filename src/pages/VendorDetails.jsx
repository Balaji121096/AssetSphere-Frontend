import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";


function VendorDetails() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [vendor, setVendor] = useState(null);

    const [loading, setLoading] = useState(true);


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


            setVendor(
                response.data.data
            );

        } catch (error) {

            console.error(
                "Vendor Details Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to load vendor details"
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
                        Loading vendor details...
                    </div>

                </div>

            </div>

        );

    }


    if (!vendor) {

        return null;

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
                        padding: "25px"
                    }}
                >

                    {/* HEADER */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    margin: 0
                                }}
                            >
                                {vendor.vendor_name}
                            </h1>

                            <p
                                style={{
                                    color: "#64748b"
                                }}
                            >
                                Vendor Details
                            </p>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                gap: "10px"
                            }}
                        >

                            <button
                                onClick={() =>
                                    navigate("/vendors")
                                }
                                style={secondaryButton}
                            >
                                Back
                            </button>


                            <button
                                onClick={() =>
                                    navigate(
                                        `/vendors/edit/${id}`
                                    )
                                }
                                style={primaryButton}
                            >
                                Edit Vendor
                            </button>


                            <button
                                onClick={() =>
                                    navigate(
                                        `/vendors/${id}/documents`
                                    )
                                }
                                style={documentButton}
                            >
                                Documents
                            </button>

                        </div>

                    </div>


                    {/* DETAILS CARD */}

                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            padding: "25px",
                            boxShadow:
                                "0 1px 3px rgba(0,0,0,0.08)"
                        }}
                    >

                        <h2
                            style={{
                                marginTop: 0,
                                fontSize: "18px",
                                color: "#1e293b"
                            }}
                        >
                            Basic Information
                        </h2>


                        <div
                            style={gridStyle}
                        >

                            <DetailItem
                                label="Vendor ID"
                                value={
                                    vendor.vendor_id
                                }
                            />

                            <DetailItem
                                label="Vendor Code"
                                value={
                                    vendor.vendor_code
                                }
                            />

                            <DetailItem
                                label="Vendor Name"
                                value={
                                    vendor.vendor_name
                                }
                            />

                            <DetailItem
                                label="Contact Person"
                                value={
                                    vendor.contact_person
                                }
                            />

                            <DetailItem
                                label="Email"
                                value={
                                    vendor.email
                                }
                            />

                            <DetailItem
                                label="Mobile"
                                value={
                                    vendor.mobile
                                }
                            />

                            <DetailItem
                                label="GST Number"
                                value={
                                    vendor.gst_number
                                }
                            />

                            <DetailItem
                                label="Status"
                                value={
                                    vendor.status
                                }
                            />

                            <DetailItem
                                label="City"
                                value={
                                    vendor.city
                                }
                            />

                            <DetailItem
                                label="State"
                                value={
                                    vendor.state
                                }
                            />

                            <DetailItem
                                label="Country"
                                value={
                                    vendor.country
                                }
                            />


                            <div
                                style={{
                                    gridColumn:
                                        "1 / -1"
                                }}
                            >

                                <DetailItem
                                    label="Address"
                                    value={
                                        vendor.address
                                    }
                                />

                            </div>

                        </div>

                    </div>


                    {/* TIMESTAMPS */}

                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            padding: "20px 25px",
                            marginTop: "20px",
                            boxShadow:
                                "0 1px 3px rgba(0,0,0,0.08)"
                        }}
                    >

                        <h2
                            style={{
                                marginTop: 0,
                                fontSize: "18px",
                                color: "#1e293b"
                            }}
                        >
                            Record Information
                        </h2>


                        <div
                            style={gridStyle}
                        >

                            <DetailItem
                                label="Created At"
                                value={
                                    formatDate(
                                        vendor.created_at
                                    )
                                }
                            />

                            <DetailItem
                                label="Updated At"
                                value={
                                    formatDate(
                                        vendor.updated_at
                                    )
                                }
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


// =====================================================
// DETAIL ITEM
// =====================================================

function DetailItem({

    label,
    value

}) {

    return (

        <div
            style={{
                padding: "12px 0",
                borderBottom:
                    "1px solid #f1f5f9"
            }}
        >

            <div
                style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "5px"
                }}
            >
                {label}
            </div>


            <div
                style={{
                    fontSize: "14px",
                    color: "#1e293b",
                    fontWeight: "500"
                }}
            >
                {value || "-"}
            </div>

        </div>

    );

}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(value) {

    if (!value) {

        return "-";

    }


    const date =
        new Date(value);


    if (Number.isNaN(
        date.getTime()
    )) {

        return value;

    }


    return date.toLocaleString();

}


// =====================================================
// STYLES
// =====================================================

const gridStyle = {

    display: "grid",

    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",

    gap: "15px 30px"

};


const primaryButton = {

    padding: "9px 14px",

    border: "none",

    background: "#2563eb",

    color: "#ffffff",

    borderRadius: "6px",

    cursor: "pointer"

};


const documentButton = {

    padding: "9px 14px",

    border: "none",

    background: "#7c3aed",

    color: "#ffffff",

    borderRadius: "6px",

    cursor: "pointer"

};


const secondaryButton = {

    padding: "9px 14px",

    border:
        "1px solid #cbd5e1",

    background: "#ffffff",

    color: "#334155",

    borderRadius: "6px",

    cursor: "pointer"

};


export default VendorDetails;