import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Vendors() {

    const navigate = useNavigate();

    const [vendors, setVendors] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD VENDORS
    // =====================================================

    const loadVendors = async () => {

        try {

            setLoading(true);

            const response =
                await API.get("/vendors");

            console.log(
                "Vendors API Response:",
                response.data
            );

            setVendors(
                response.data.data || []
            );

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to load vendors"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadVendors();

    }, []);


    // =====================================================
    // DELETE VENDOR
    // =====================================================

    const handleDelete = async (vendor) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${vendor.vendor_name}"?`
            );

        if (!confirmed) {
            return;
        }


        try {

            await API.delete(
                `/vendors/${vendor.vendor_id}`
            );

            alert(
                "Vendor deleted successfully"
            );

            loadVendors();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete vendor"
            );

        }

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredVendors =
        vendors.filter((vendor) => {

            const text = `
                ${vendor.vendor_id || ""}
                ${vendor.vendor_code || ""}
                ${vendor.vendor_name || ""}
                ${vendor.contact_person || ""}
                ${vendor.email || ""}
                ${vendor.phone || ""}
                ${vendor.mobile || ""}
                ${vendor.mobile_number || ""}
                ${vendor.address || ""}
                ${vendor.status || ""}
            `.toLowerCase();

            return text.includes(
                search.toLowerCase()
            );

        });


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


                    {/* =====================================
                        HEADER
                    ===================================== */}

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
                                Vendors
                            </h1>

                            <p
                                style={{
                                    marginTop: "5px",
                                    color: "#64748b"
                                }}
                            >
                                Manage asset vendors
                            </p>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                gap: "10px"
                            }}
                        >

                            <button
                                onClick={loadVendors}
                                style={{
                                    padding: "9px 14px",
                                    border: "1px solid #cbd5e1",
                                    background: "#ffffff",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                Refresh
                            </button>


                            <button
                                onClick={() =>
                                    navigate("/vendors/add")
                                }
                                style={{
                                    padding: "9px 14px",
                                    border: "none",
                                    background: "#2563eb",
                                    color: "#ffffff",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                + Add Vendor
                            </button>

                        </div>

                    </div>


                    {/* =====================================
                        SEARCH
                    ===================================== */}

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Search vendors..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            style={{
                                padding: "10px 12px",
                                width: "320px",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                outline: "none"
                            }}
                        />

                    </div>


                    {/* =====================================
                        TABLE
                    ===================================== */}

                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            overflowX: "auto",
                            boxShadow:
                                "0 1px 3px rgba(0,0,0,0.08)"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse"
                            }}
                        >

                            <thead>

                                <tr
                                    style={{
                                        background: "#f8fafc"
                                    }}
                                >

                                    <th style={thStyle}>
                                        ID
                                    </th>

                                    <th style={thStyle}>
                                        Vendor Code
                                    </th>

                                    <th style={thStyle}>
                                        Vendor Name
                                    </th>

                                    <th style={thStyle}>
                                        Contact Person
                                    </th>

                                    <th style={thStyle}>
                                        Email
                                    </th>

                                    <th style={thStyle}>
                                        Phone
                                    </th>

                                    <th style={thStyle}>
                                        Status
                                    </th>

                                    <th style={thStyle}>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            style={emptyStyle}
                                        >
                                            Loading...
                                        </td>

                                    </tr>

                                ) : filteredVendors.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            style={emptyStyle}
                                        >
                                            No vendors found
                                        </td>

                                    </tr>

                                ) : (

                                    filteredVendors.map(
                                        (vendor) => (

                                            <tr
                                                key={
                                                    vendor.vendor_id
                                                }
                                            >

                                                <td style={tdStyle}>
                                                    {
                                                        vendor.vendor_id
                                                    }
                                                </td>


                                                <td style={tdStyle}>
                                                    {
                                                        vendor.vendor_code ||
                                                        "-"
                                                    }
                                                </td>


                                                {/* =================================
                                                    VENDOR NAME
                                                    ================================= */}

                                                <td style={tdStyle}>

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/vendors/${vendor.vendor_id}`
                                                            )
                                                        }
                                                        style={{
                                                            border: "none",
                                                            background: "transparent",
                                                            color: "#2563eb",
                                                            cursor: "pointer",
                                                            padding: 0,
                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        {
                                                            vendor.vendor_name ||
                                                            "-"
                                                        }
                                                    </button>

                                                </td>


                                                <td style={tdStyle}>
                                                    {
                                                        vendor.contact_person ||
                                                        "-"
                                                    }
                                                </td>


                                                <td style={tdStyle}>
                                                    {
                                                        vendor.email ||
                                                        "-"
                                                    }
                                                </td>


                                                <td style={tdStyle}>
                                                    {
                                                        vendor.phone ||
                                                        vendor.mobile ||
                                                        vendor.mobile_number ||
                                                        "-"
                                                    }
                                                </td>


                                                <td style={tdStyle}>

                                                    <span
                                                        style={{
                                                            padding:
                                                                "4px 8px",
                                                            borderRadius:
                                                                "12px",
                                                            fontSize:
                                                                "12px",
                                                            background:
                                                                vendor.status ===
                                                                "Active"
                                                                    ? "#dcfce7"
                                                                    : "#fee2e2",
                                                            color:
                                                                vendor.status ===
                                                                "Active"
                                                                    ? "#166534"
                                                                    : "#991b1b"
                                                        }}
                                                    >
                                                        {
                                                            vendor.status ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>


                                                {/* =================================
                                                    ACTIONS
                                                    ================================= */}

                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        whiteSpace:
                                                            "nowrap"
                                                    }}
                                                >

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/vendors/edit/${vendor.vendor_id}`
                                                            )
                                                        }
                                                        style={{
                                                            marginRight:
                                                                "6px",
                                                            padding:
                                                                "6px 10px",
                                                            border:
                                                                "1px solid #cbd5e1",
                                                            background:
                                                                "#ffffff",
                                                            borderRadius:
                                                                "5px",
                                                            cursor:
                                                                "pointer"
                                                        }}
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                vendor
                                                            )
                                                        }
                                                        style={{
                                                            padding:
                                                                "6px 10px",
                                                            border:
                                                                "none",
                                                            background:
                                                                "#dc2626",
                                                            color:
                                                                "#ffffff",
                                                            borderRadius:
                                                                "5px",
                                                            cursor:
                                                                "pointer"
                                                        }}
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}


// =====================================================
// TABLE STYLES
// =====================================================

const thStyle = {

    padding: "11px 8px",

    textAlign: "left",

    fontSize: "13px",

    color: "#334155",

    borderBottom:
        "1px solid #e2e8f0"

};


const tdStyle = {

    padding: "10px 8px",

    fontSize: "13px",

    color: "#475569",

    borderBottom:
        "1px solid #f1f5f9"

};


const emptyStyle = {

    padding: "30px",

    textAlign: "center",

    color: "#64748b"

};


export default Vendors;