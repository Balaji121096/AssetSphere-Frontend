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
    const [refreshing, setRefreshing] = useState(false);


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

            console.error(
                "Load Vendors Error:",
                error
            );

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
    // FULL PAGE REFRESH
    // =====================================================

    const handleRefresh = () => {

        if (refreshing) {
            return;
        }

        setRefreshing(true);

        /*
         * Small delay so user can see
         * the refresh animation before
         * the entire page reloads.
         */

        setTimeout(() => {

            window.location.reload();

        }, 400);

    };


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

            await loadVendors();

        } catch (error) {

            console.error(
                "Delete Vendor Error:",
                error
            );

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

        <div style={pageStyle}>

            <Sidebar />


            <div style={mainStyle}>

                <Navbar />


                <main style={contentStyle}>


                    {/* =====================================
                        HEADER
                    ===================================== */}

                    <div style={headerStyle}>

                        <div>

                            <div style={eyebrowStyle}>
                                VENDOR MANAGEMENT
                            </div>

                            <h1 style={titleStyle}>
                                Vendors
                            </h1>

                            <p style={subtitleStyle}>
                                Manage company vendors
                            </p>

                        </div>


                        <div style={headerButtonsStyle}>


                            {/* =================================
                                REFRESH
                            ================================= */}

                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                style={{
                                    ...refreshButtonStyle,
                                    opacity:
                                        refreshing
                                            ? 0.65
                                            : 1,
                                    cursor:
                                        refreshing
                                            ? "not-allowed"
                                            : "pointer"
                                }}
                            >

                                <span
                                    style={{
                                        ...refreshIconStyle,
                                        display:
                                            "inline-block",
                                        animation:
                                            refreshing
                                                ? "spin 0.8s linear infinite"
                                                : "none"
                                    }}
                                >
                                    ↻
                                </span>

                                {refreshing
                                    ? "Refreshing..."
                                    : "Refresh"}

                            </button>


                            {/* =================================
                                ADD VENDOR
                            ================================= */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/vendors/add"
                                    )
                                }
                                style={
                                    addButtonStyle
                                }
                            >

                                <span
                                    style={
                                        plusStyle
                                    }
                                >
                                    +
                                </span>

                                Add Vendor

                            </button>

                        </div>

                    </div>


                    {/* =====================================
                        SUMMARY
                    ===================================== */}

                    <div style={summaryGridStyle}>

                        <SummaryCard
                            title="Total Vendors"
                            value={vendors.length}
                            icon="▣"
                            color="#2563eb"
                            background="#eff6ff"
                        />


                        <SummaryCard
                            title="Active"
                            value={
                                vendors.filter(
                                    (vendor) =>
                                        vendor.status ===
                                        "Active"
                                ).length
                            }
                            icon="✓"
                            color="#16a34a"
                            background="#f0fdf4"
                        />


                        <SummaryCard
                            title="Inactive"
                            value={
                                vendors.filter(
                                    (vendor) =>
                                        vendor.status &&
                                        vendor.status !==
                                            "Active"
                                ).length
                            }
                            icon="!"
                            color="#dc2626"
                            background="#fef2f2"
                        />


                        <SummaryCard
                            title="Search Results"
                            value={
                                filteredVendors.length
                            }
                            icon="⌕"
                            color="#7c3aed"
                            background="#f5f3ff"
                        />

                    </div>


                    {/* =====================================
                        TABLE CARD
                    ===================================== */}

                    <div style={tableCardStyle}>


                        {/* =================================
                            TABLE TOP
                        ================================= */}

                        <div style={tableTopStyle}>

                            <div>

                                <h2
                                    style={
                                        tableTitleStyle
                                    }
                                >
                                    Vendor Directory
                                </h2>

                                <p
                                    style={
                                        tableSubtitleStyle
                                    }
                                >
                                    {filteredVendors.length} vendor
                                    {filteredVendors.length !== 1
                                        ? "s"
                                        : ""} found
                                </p>

                            </div>


                            {/* =================================
                                SEARCH
                            ================================= */}

                            <div
                                style={
                                    searchWrapperStyle
                                }
                            >

                                <span
                                    style={
                                        searchIconStyle
                                    }
                                >
                                    ⌕
                                </span>


                                <input
                                    type="text"
                                    placeholder="Search vendors..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    style={
                                        searchInputStyle
                                    }
                                />


                                {search && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        style={
                                            clearButtonStyle
                                        }
                                    >
                                        ×
                                    </button>

                                )}

                            </div>

                        </div>


                        {/* =================================
                            TABLE
                        ================================= */}

                        <div
                            style={
                                tableWrapperStyle
                            }
                        >

                            <table
                                style={
                                    tableStyle
                                }
                            >

                                <thead>

                                    <tr>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            ID
                                        </th>


                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Vendor Code
                                        </th>


                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Vendor Name
                                        </th>


                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Contact Person
                                        </th>


                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Email
                                        </th>


                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Phone
                                        </th>


                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Status
                                        </th>


                                        <th
                                            style={{
                                                ...thStyle,
                                                textAlign:
                                                    "center"
                                            }}
                                        >
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>


                                    {/* =================================
                                        LOADING
                                    ================================= */}

                                    {loading ? (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                style={
                                                    emptyStyle
                                                }
                                            >

                                                <div
                                                    style={
                                                        loaderStyle
                                                    }
                                                >

                                                    <div
                                                        style={
                                                            spinnerStyle
                                                        }
                                                    />

                                                </div>

                                                Loading vendors...

                                            </td>

                                        </tr>


                                    ) : filteredVendors.length === 0 ? (


                                        /* =================================
                                            EMPTY
                                        ================================= */

                                        <tr>

                                            <td
                                                colSpan="8"
                                                style={
                                                    emptyStyle
                                                }
                                            >

                                                <div
                                                    style={
                                                        emptyIconStyle
                                                    }
                                                >
                                                    ▣
                                                </div>

                                                <strong>
                                                    No vendors found
                                                </strong>

                                                <p
                                                    style={{
                                                        margin:
                                                            "6px 0 0",
                                                        color:
                                                            "#94a3b8"
                                                    }}
                                                >
                                                    Try changing your
                                                    search
                                                </p>

                                            </td>

                                        </tr>


                                    ) : (


                                        /* =================================
                                            VENDOR ROWS
                                        ================================= */

                                        filteredVendors.map(
                                            (vendor) => (

                                                <tr
                                                    key={
                                                        vendor.vendor_id
                                                    }
                                                    style={
                                                        rowStyle
                                                    }
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background =
                                                            "#f8fafc";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background =
                                                            "#ffffff";
                                                    }}
                                                >


                                                    {/* ID */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            vendor.vendor_id
                                                        }
                                                    </td>


                                                    {/* VENDOR CODE */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            vendor.vendor_code ||
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* VENDOR NAME */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                vendorCellStyle
                                                            }
                                                        >

                                                            <div
                                                                style={
                                                                    vendorIconStyle
                                                                }
                                                            >
                                                                ▣
                                                            </div>


                                                            <div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/vendors/${vendor.vendor_id}`
                                                                        )
                                                                    }
                                                                    style={
                                                                        vendorNameButtonStyle
                                                                    }
                                                                >
                                                                    {
                                                                        vendor.vendor_name ||
                                                                        "-"
                                                                    }
                                                                </button>


                                                                <div
                                                                    style={
                                                                        vendorCodeSmallStyle
                                                                    }
                                                                >
                                                                    {
                                                                        vendor.vendor_code ||
                                                                        "Vendor"
                                                                    }
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* CONTACT PERSON */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            vendor.contact_person ||
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* EMAIL */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            vendor.email ||
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* PHONE */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            vendor.phone ||
                                                            vendor.mobile ||
                                                            vendor.mobile_number ||
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* STATUS */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <span
                                                            style={{
                                                                ...statusBadgeStyle,
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


                                                    {/* ACTIONS */}

                                                    <td
                                                        style={{
                                                            ...tdStyle,
                                                            textAlign:
                                                                "center"
                                                        }}
                                                    >

                                                        <div
                                                            style={
                                                                actionStyle
                                                            }
                                                        >


                                                            {/* VIEW */}

                                                            <button
                                                                type="button"
                                                                title="View Vendor"
                                                                aria-label="View Vendor"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/vendors/${vendor.vendor_id}`
                                                                    )
                                                                }
                                                                style={
                                                                    iconViewButtonStyle
                                                                }
                                                            >
                                                                👁
                                                            </button>


                                                            {/* EDIT */}

                                                            <button
                                                                type="button"
                                                                title="Edit Vendor"
                                                                aria-label="Edit Vendor"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/vendors/edit/${vendor.vendor_id}`
                                                                    )
                                                                }
                                                                style={
                                                                    iconEditButtonStyle
                                                                }
                                                            >
                                                                ✏
                                                            </button>


                                                            {/* DELETE */}

                                                            <button
                                                                type="button"
                                                                title="Delete Vendor"
                                                                aria-label="Delete Vendor"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        vendor
                                                                    )
                                                                }
                                                                style={
                                                                    iconDeleteButtonStyle
                                                                }
                                                            >
                                                                🗑
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </main>

            </div>

        </div>

    );

}


// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
    title,
    value,
    icon,
    color,
    background
}) {

    return (

        <div style={summaryCardStyle}>

            <div
                style={{
                    ...summaryIconStyle,
                    color,
                    background
                }}
            >
                {icon}
            </div>


            <div>

                <div style={summaryTitleStyle}>
                    {title}
                </div>

                <div style={summaryValueStyle}>
                    {value}
                </div>

            </div>

        </div>

    );

}


// =====================================================
// PAGE
// =====================================================

const pageStyle = {

    display: "flex",

    minHeight: "100vh",

    background: "#f8fafc",

    color: "#0f172a"

};


const mainStyle = {

    flex: 1,

    minWidth: 0

};


const contentStyle = {

    width: "100%",

    maxWidth: "1500px",

    margin: "0 auto",

    padding: "30px",

    boxSizing: "border-box"

};


// =====================================================
// HEADER
// =====================================================

const headerStyle = {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "20px",

    flexWrap: "wrap",

    marginBottom: "25px"

};


const eyebrowStyle = {

    color: "#2563eb",

    fontSize: "11px",

    fontWeight: "700",

    letterSpacing: "1.5px",

    marginBottom: "7px"

};


const titleStyle = {

    margin: 0,

    fontSize: "32px",

    fontWeight: "750",

    letterSpacing: "-0.8px"

};


const subtitleStyle = {

    margin: "7px 0 0",

    color: "#64748b",

    fontSize: "14px"

};


const headerButtonsStyle = {

    display: "flex",

    gap: "10px",

    flexWrap: "wrap"

};


// =====================================================
// BUTTONS
// =====================================================

const refreshButtonStyle = {

    height: "42px",

    padding: "0 16px",

    border: "1px solid #dbe2ea",

    borderRadius: "9px",

    background: "#ffffff",

    color: "#334155",

    fontSize: "13px",

    fontWeight: "600"

};


const refreshIconStyle = {

    fontSize: "18px",

    marginRight: "7px",

    verticalAlign: "middle"

};


const addButtonStyle = {

    height: "42px",

    padding: "0 18px",

    border: "none",

    borderRadius: "9px",

    background: "#2563eb",

    color: "#ffffff",

    fontSize: "13px",

    fontWeight: "600",

    cursor: "pointer",

    boxShadow:
        "0 4px 10px rgba(37,99,235,0.18)"

};


const plusStyle = {

    fontSize: "18px",

    marginRight: "6px"

};


// =====================================================
// SUMMARY
// =====================================================

const summaryGridStyle = {

    display: "grid",

    gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",

    gap: "16px",

    marginBottom: "22px"

};


const summaryCardStyle = {

    background: "#ffffff",

    border: "1px solid #e8edf3",

    borderRadius: "12px",

    padding: "18px 20px",

    display: "flex",

    alignItems: "center",

    gap: "14px",

    boxShadow:
        "0 2px 8px rgba(15,23,42,0.035)"

};


const summaryIconStyle = {

    width: "44px",

    height: "44px",

    borderRadius: "11px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "18px",

    fontWeight: "700"

};


const summaryTitleStyle = {

    color: "#64748b",

    fontSize: "12px",

    marginBottom: "4px"

};


const summaryValueStyle = {

    fontSize: "24px",

    fontWeight: "750",

    color: "#0f172a"

};


// =====================================================
// TABLE CARD
// =====================================================

const tableCardStyle = {

    background: "#ffffff",

    border: "1px solid #e5eaf0",

    borderRadius: "14px",

    boxShadow:
        "0 4px 14px rgba(15,23,42,0.04)",

    overflow: "hidden"

};


const tableTopStyle = {

    padding: "20px 22px",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "15px",

    flexWrap: "wrap",

    borderBottom:
        "1px solid #edf1f5"

};


const tableTitleStyle = {

    margin: 0,

    fontSize: "17px",

    fontWeight: "700"

};


const tableSubtitleStyle = {

    margin: "5px 0 0",

    color: "#94a3b8",

    fontSize: "12px"

};


// =====================================================
// SEARCH
// =====================================================

const searchWrapperStyle = {

    width: "320px",

    maxWidth: "100%",

    height: "42px",

    display: "flex",

    alignItems: "center",

    background: "#f8fafc",

    border: "1px solid #dbe2ea",

    borderRadius: "9px",

    padding: "0 11px",

    boxSizing: "border-box"

};


const searchIconStyle = {

    color: "#94a3b8",

    fontSize: "20px",

    marginRight: "7px"

};


const searchInputStyle = {

    flex: 1,

    minWidth: 0,

    height: "100%",

    border: "none",

    outline: "none",

    background: "transparent",

    fontSize: "13px",

    color: "#0f172a"

};


const clearButtonStyle = {

    border: "none",

    background: "transparent",

    color: "#94a3b8",

    fontSize: "19px",

    cursor: "pointer"

};


// =====================================================
// TABLE
// =====================================================

const tableWrapperStyle = {

    width: "100%",

    overflowX: "auto"

};


const tableStyle = {

    width: "100%",

    minWidth: "1100px",

    borderCollapse: "collapse"

};


const thStyle = {

    padding: "13px 16px",

    textAlign: "left",

    background: "#f8fafc",

    color: "#64748b",

    fontSize: "11px",

    fontWeight: "700",

    textTransform: "uppercase",

    letterSpacing: "0.5px",

    borderBottom:
        "1px solid #e8edf3",

    whiteSpace: "nowrap"

};


const tdStyle = {

    padding: "14px 16px",

    color: "#475569",

    fontSize: "13px",

    borderBottom:
        "1px solid #f0f2f5",

    verticalAlign: "middle"

};


const rowStyle = {

    background: "#ffffff",

    transition: "background 0.15s"

};


// =====================================================
// VENDOR CELL
// =====================================================

const vendorCellStyle = {

    display: "flex",

    alignItems: "center",

    gap: "10px"

};


const vendorIconStyle = {

    width: "36px",

    height: "36px",

    borderRadius: "10px",

    background: "#eff6ff",

    color: "#2563eb",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "15px",

    fontWeight: "700",

    flexShrink: 0

};


const vendorNameButtonStyle = {

    border: "none",

    background: "transparent",

    color: "#1d4ed8",

    cursor: "pointer",

    padding: 0,

    fontWeight: "650",

    fontSize: "13px",

    textAlign: "left"

};


const vendorCodeSmallStyle = {

    color: "#94a3b8",

    fontSize: "11px",

    marginTop: "3px"

};


// =====================================================
// STATUS
// =====================================================

const statusBadgeStyle = {

    display: "inline-block",

    padding: "5px 9px",

    borderRadius: "20px",

    fontSize: "11px",

    fontWeight: "650"

};


// =====================================================
// ACTIONS
// =====================================================

const actionStyle = {

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    gap: "5px",

    flexWrap: "nowrap"

};


const iconBaseStyle = {

    width: "32px",

    height: "32px",

    padding: 0,

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "7px",

    cursor: "pointer",

    fontSize: "14px",

    lineHeight: 1,

    flexShrink: 0

};


const iconViewButtonStyle = {

    ...iconBaseStyle,

    border: "1px solid #cbd5e1",

    background: "#ffffff",

    color: "#475569"

};


const iconEditButtonStyle = {

    ...iconBaseStyle,

    border: "1px solid #bfdbfe",

    background: "#eff6ff",

    color: "#1d4ed8"

};


const iconDeleteButtonStyle = {

    ...iconBaseStyle,

    border: "1px solid #fecaca",

    background: "#fef2f2",

    color: "#b91c1c"

};


// =====================================================
// LOADING
// =====================================================

const emptyStyle = {

    padding: "55px 20px",

    textAlign: "center",

    color: "#64748b",

    fontSize: "13px"

};


const emptyIconStyle = {

    fontSize: "32px",

    marginBottom: "10px",

    opacity: 0.6

};


const loaderStyle = {

    display: "flex",

    justifyContent: "center",

    marginBottom: "12px"

};


const spinnerStyle = {

    width: "22px",

    height: "22px",

    border: "3px solid #dbeafe",

    borderTop:
        "3px solid #2563eb",

    borderRadius: "50%",

    animation:
        "spin 0.8s linear infinite"

};


// =====================================================
// EXPORT
// =====================================================

export default Vendors;