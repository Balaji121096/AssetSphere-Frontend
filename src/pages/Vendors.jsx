// Vendors.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Vendors() {
    const navigate = useNavigate();

    const [vendors, setVendors] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    // =====================================================
    // LOAD VENDORS
    // =====================================================

    const loadVendors = async () => {
        try {
            setLoading(true);

            const response = await API.get("/vendors");

            setVendors(response.data?.data || []);
        } catch (error) {
            console.error("Load Vendors Error:", error);

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
        const confirmed = window.confirm(
            `Are you sure you want to delete "${vendor.vendor_name}"?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(vendor.vendor_id);

            await API.delete(`/vendors/${vendor.vendor_id}`);

            alert("Vendor deleted successfully");

            await loadVendors();
        } catch (error) {
            console.error("Delete Vendor Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete vendor"
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredVendors = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return vendors;
        }

        return vendors.filter((vendor) => {
            const searchableText = `
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

            return searchableText.includes(keyword);
        });
    }, [vendors, search]);

    // =====================================================
    // STATS
    // =====================================================

    const stats = useMemo(() => {
        const active = vendors.filter(
            (vendor) => vendor.status === "Active"
        ).length;

        const inactive = vendors.filter(
            (vendor) =>
                vendor.status &&
                vendor.status !== "Active"
        ).length;

        return {
            total: vendors.length,
            active,
            inactive,
            showing: filteredVendors.length
        };
    }, [vendors, filteredVendors]);

    // =====================================================
    // UI
    // =====================================================

    return (
        <div style={pageStyle}>
            <Sidebar />

            <div style={contentStyle}>
                <Navbar />

                <main style={mainStyle}>

                    {/* =================================================
                        PAGE HEADER
                        THEME COLORS ARE NOW CONNECTED TO
                        THE SAME CSS VARIABLES USED BY DASHBOARD
                    ================================================= */}

                    <div style={heroHeader}>

                        <div style={heroLeft}>

                            <div style={heroIcon}>
                                ▣
                            </div>

                            <div>
                                <div style={heroBreadcrumb}>
                                    Dashboard
                                    <span style={heroSlash}>/</span>
                                    Vendors
                                </div>

                                <h1 style={heroTitle}>
                                    Vendors
                                </h1>

                                <p style={heroDescription}>
                                    Manage company vendors and their information.
                                </p>
                            </div>

                        </div>


                        <div style={heroActions}>

                            <button
                                type="button"
                                onClick={loadVendors}
                                disabled={loading}
                                style={{
                                    ...heroSecondaryButton,
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading
                                        ? "not-allowed"
                                        : "pointer"
                                }}
                            >
                                <span
                                    style={{
                                        ...refreshIcon,
                                        animation: loading
                                            ? "vendorSpin 0.8s linear infinite"
                                            : "none"
                                    }}
                                >
                                    ↻
                                </span>

                                {loading
                                    ? "Refreshing..."
                                    : "Refresh"}
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/vendors/add")
                                }
                                style={heroPrimaryButton}
                            >
                                <span style={plusIcon}>
                                    +
                                </span>

                                Add Vendor
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div style={statsGrid}>

                        <StatCard
                            title="Total Vendors"
                            value={stats.total}
                            icon="▣"
                            iconColor="var(--primary-color)"
                            iconBackground="var(--primary-light)"
                        />

                        <StatCard
                            title="Active"
                            value={stats.active}
                            icon="✓"
                            iconColor="var(--success-color)"
                            iconBackground="var(--success-light)"
                        />

                        <StatCard
                            title="Inactive"
                            value={stats.inactive}
                            icon="!"
                            iconColor="var(--danger-color)"
                            iconBackground="var(--danger-light)"
                        />

                        <StatCard
                            title="Search Results"
                            value={stats.showing}
                            icon="⌕"
                            iconColor="var(--secondary-color)"
                            iconBackground="var(--secondary-light)"
                        />

                    </div>


                    {/* =================================================
                        TABLE CARD
                    ================================================= */}

                    <div style={tableCard}>

                        <div style={tableHeader}>

                            <div>
                                <h2 style={tableTitle}>
                                    Vendor Directory
                                </h2>

                                <p style={tableSubtitle}>
                                    {filteredVendors.length} vendor
                                    {filteredVendors.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    found
                                </p>
                            </div>


                            <div style={searchWrapper}>

                                <span style={searchIcon}>
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search vendors, contact, email..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    style={searchInput}
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        style={clearSearch}
                                    >
                                        ×
                                    </button>
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div style={tableScroll}>

                            <table style={table}>

                                <thead>

                                    <tr>

                                        <th style={thStyle}>
                                            ID
                                        </th>

                                        <th style={thStyle}>
                                            Vendor Code
                                        </th>

                                        <th style={thStyle}>
                                            Vendor
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

                                        <th
                                            style={{
                                                ...thStyle,
                                                textAlign: "right"
                                            }}
                                        >
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {loading ? (
                                        <>
                                            {[1, 2, 3, 4, 5].map(
                                                (row) => (
                                                    <tr key={row}>

                                                        {Array.from({
                                                            length: 8
                                                        }).map(
                                                            (
                                                                _,
                                                                index
                                                            ) => (
                                                                <td
                                                                    key={
                                                                        index
                                                                    }
                                                                    style={
                                                                        tdStyle
                                                                    }
                                                                >
                                                                    <div
                                                                        style={{
                                                                            ...skeleton,
                                                                            width:
                                                                                index === 2
                                                                                    ? "170px"
                                                                                    : "75%"
                                                                        }}
                                                                    />
                                                                </td>
                                                            )
                                                        )}

                                                    </tr>
                                                )
                                            )}
                                        </>
                                    ) : filteredVendors.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                style={emptyCell}
                                            >

                                                <div
                                                    style={emptyIcon}
                                                >
                                                    ▣
                                                </div>

                                                <div
                                                    style={emptyTitle}
                                                >
                                                    No vendors found
                                                </div>

                                                <div
                                                    style={emptyText}
                                                >
                                                    {search
                                                        ? "Try changing your search."
                                                        : "No vendors are available yet."}
                                                </div>

                                            </td>

                                        </tr>

                                    ) : (

                                        filteredVendors.map(
                                            (vendor) => (

                                                <tr
                                                    key={
                                                        vendor.vendor_id
                                                    }
                                                    style={rowStyle}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background =
                                                            "var(--table-row-hover)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background =
                                                            "var(--card-background)";
                                                    }}
                                                >

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        <span
                                                            style={
                                                                idText
                                                            }
                                                        >
                                                            #
                                                            {
                                                                vendor.vendor_id
                                                            }
                                                        </span>
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        <span
                                                            style={
                                                                codeBadge
                                                            }
                                                        >
                                                            {vendor.vendor_code ||
                                                                "-"}
                                                        </span>
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                vendorCell
                                                            }
                                                        >

                                                            <div
                                                                style={
                                                                    vendorIcon
                                                                }
                                                            >
                                                                {(
                                                                    vendor.vendor_name ||
                                                                    "V"
                                                                )
                                                                    .charAt(
                                                                        0
                                                                    )
                                                                    .toUpperCase()}
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
                                                                        vendorName
                                                                    }
                                                                >
                                                                    {vendor.vendor_name ||
                                                                        "-"}
                                                                </button>

                                                                <div
                                                                    style={
                                                                        vendorSmallCode
                                                                    }
                                                                >
                                                                    {vendor.vendor_code ||
                                                                        "Vendor"}
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {vendor.contact_person ||
                                                            "-"}
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {vendor.email ||
                                                            "-"}
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {vendor.phone ||
                                                            vendor.mobile ||
                                                            vendor.mobile_number ||
                                                            "-"}
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <span
                                                            style={{
                                                                ...statusBadge,
                                                                color:
                                                                    vendor.status ===
                                                                    "Active"
                                                                        ? "var(--success-color)"
                                                                        : "var(--muted-text)",
                                                                background:
                                                                    vendor.status ===
                                                                    "Active"
                                                                        ? "var(--success-light)"
                                                                        : "var(--muted-background)"
                                                            }}
                                                        >

                                                            <span
                                                                style={{
                                                                    width: "6px",
                                                                    height: "6px",
                                                                    borderRadius:
                                                                        "50%",
                                                                    background:
                                                                        vendor.status ===
                                                                        "Active"
                                                                            ? "var(--success-color)"
                                                                            : "var(--muted-text)"
                                                                }}
                                                            />

                                                            {vendor.status ||
                                                                "-"}

                                                        </span>

                                                    </td>


                                                    <td
                                                        style={{
                                                            ...tdStyle,
                                                            textAlign:
                                                                "right"
                                                        }}
                                                    >

                                                        <div
                                                            style={
                                                                actionWrapper
                                                            }>

                                                            <button
                                                                type="button"
                                                                title="View"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/vendors/${vendor.vendor_id}`
                                                                    )
                                                                }
                                                                style={
                                                                    viewButton
                                                                }
                                                            >
                                                                👁
                                                            </button>


                                                            <button
                                                                type="button"
                                                                title="Edit"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/vendors/edit/${vendor.vendor_id}`
                                                                    )
                                                                }
                                                                style={
                                                                    editButton
                                                                }
                                                            >
                                                                ✎
                                                            </button>


                                                            <button
                                                                type="button"
                                                                title="Delete"
                                                                disabled={
                                                                    deletingId ===
                                                                    vendor.vendor_id
                                                                }
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        vendor
                                                                    )
                                                                }
                                                                style={{
                                                                    ...deleteButton,
                                                                    opacity:
                                                                        deletingId ===
                                                                        vendor.vendor_id
                                                                            ? 0.6
                                                                            : 1,
                                                                    cursor:
                                                                        deletingId ===
                                                                        vendor.vendor_id
                                                                            ? "not-allowed"
                                                                            : "pointer"
                                                                }}
                                                            >
                                                                {deletingId ===
                                                                vendor.vendor_id
                                                                    ? "..."
                                                                    : "⌫"}
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


            <style>
                {`
                    @keyframes vendorSpin {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }
                    }

                    .vendor-page-card {
                        background: var(--card-background);
                        color: var(--text-color);
                        border-color: var(--border-color);
                    }

                    .vendor-page-card input::placeholder {
                        color: var(--muted-text);
                    }

                    @media (max-width: 900px) {
                        .vendor-hero-header {
                            flex-direction: column !important;
                            align-items: flex-start !important;
                        }

                        .vendor-hero-actions {
                            width: 100% !important;
                        }

                        .vendor-hero-actions button {
                            flex: 1;
                        }
                    }

                    @media (max-width: 600px) {
                        .vendor-main {
                            padding: 18px !important;
                        }

                        .vendor-hero-header {
                            padding: 22px !important;
                            border-radius: 16px !important;
                        }

                        .vendor-hero-title {
                            font-size: 25px !important;
                        }

                        .vendor-hero-actions {
                            flex-direction: column !important;
                        }

                        .vendor-hero-actions button {
                            width: 100%;
                        }

                        .vendor-stats {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}
            </style>

        </div>
    );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
    title,
    value,
    icon,
    iconColor,
    iconBackground
}) {
    return (
        <div style={statCard}>

            <div
                style={{
                    ...statIcon,
                    color: iconColor,
                    background: iconBackground
                }}
            >
                {icon}
            </div>

            <div>

                <div style={statTitle}>
                    {title}
                </div>

                <div style={statValue}>
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

    background: "var(--app-background)",

    color: "var(--text-color)"

};

const contentStyle = {

    flex: 1,

    minWidth: 0

};

const mainStyle = {

    padding: "28px",

    maxWidth: "1800px",

    margin: "0 auto"

};


// =====================================================
// HERO HEADER
// SAME THEME SYSTEM AS DASHBOARD
// =====================================================

const heroHeader = {

    position: "relative",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "24px",

    marginBottom: "24px",

    padding: "25px 28px",

    borderRadius: "16px",

    overflow: "hidden",

    background:
        "linear-gradient(135deg, var(--sidebar-color) 0%, var(--sidebar-color) 45%, var(--primary-color) 100%)",

    boxShadow:
        "0 10px 30px rgba(15,23,42,0.18)"

};

const heroLeft = {

    display: "flex",

    alignItems: "center",

    gap: "15px",

    minWidth: 0

};

const heroIcon = {

    width: "48px",

    height: "48px",

    borderRadius: "12px",

    flexShrink: 0,

    background: "rgba(255,255,255,0.14)",

    border: "1px solid rgba(255,255,255,0.16)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "#ffffff",

    fontSize: "22px",

    fontWeight: "700",

    boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.08)"

};

const heroBreadcrumb = {

    display: "flex",

    alignItems: "center",

    gap: "8px",

    marginBottom: "4px",

    color: "rgba(255,255,255,0.62)",

    fontSize: "11px",

    fontWeight: "500"

};

const heroSlash = {

    color: "rgba(255,255,255,0.38)"

};

const heroTitle = {

    margin: 0,

    color: "#ffffff",

    fontSize: "29px",

    lineHeight: 1.15,

    fontWeight: "750",

    letterSpacing: "-0.02em"

};

const heroDescription = {

    margin: "6px 0 0",

    color: "rgba(255,255,255,0.72)",

    fontSize: "13px",

    lineHeight: 1.5

};

const heroActions = {

    display: "flex",

    alignItems: "center",

    gap: "9px",

    flexShrink: 0

};


// =====================================================
// HERO BUTTONS
// =====================================================

const heroSecondaryButton = {

    height: "40px",

    padding: "0 15px",

    border: "1px solid rgba(255,255,255,0.22)",

    borderRadius: "8px",

    background: "rgba(255,255,255,0.10)",

    color: "#ffffff",

    cursor: "pointer",

    fontSize: "12px",

    fontWeight: "600",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "7px",

    backdropFilter: "blur(8px)"

};

const heroPrimaryButton = {

    height: "40px",

    padding: "0 16px",

    border: "none",

    borderRadius: "8px",

    background: "#ffffff",

    color: "var(--primary-color)",

    cursor: "pointer",

    fontSize: "12px",

    fontWeight: "700",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "7px",

    boxShadow:
        "0 4px 12px rgba(0,0,0,0.14)"

};

const refreshIcon = {

    display: "inline-block",

    fontSize: "17px",

    lineHeight: 1

};

const plusIcon = {

    fontSize: "17px",

    lineHeight: 1

};


// =====================================================
// STATS
// =====================================================

const statsGrid = {

    display: "grid",

    gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",

    gap: "15px",

    marginBottom: "22px"

};

const statCard = {

    background: "var(--card-background)",

    border: "1px solid var(--border-color)",

    borderRadius: "11px",

    padding: "18px",

    display: "flex",

    alignItems: "center",

    gap: "14px",

    minHeight: "82px",

    boxSizing: "border-box",

    boxShadow:
        "0 1px 3px rgba(15,23,42,0.04)",

    color: "var(--text-color)"

};

const statIcon = {

    width: "42px",

    height: "42px",

    borderRadius: "9px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "20px",

    fontWeight: "700",

    flexShrink: 0

};

const statTitle = {

    fontSize: "12px",

    color: "var(--muted-text)",

    marginBottom: "4px"

};

const statValue = {

    fontSize: "24px",

    fontWeight: "750",

    color: "var(--text-color)"

};


// =====================================================
// TABLE CARD
// =====================================================

const tableCard = {

    background: "var(--card-background)",

    border: "1px solid var(--border-color)",

    borderRadius: "12px",

    overflow: "hidden",

    boxShadow:
        "0 2px 5px rgba(15,23,42,0.04)",

    color: "var(--text-color)"

};

const tableHeader = {

    padding: "18px 20px",

    borderBottom:
        "1px solid var(--border-color)",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "15px",

    flexWrap: "wrap"

};

const tableTitle = {

    margin: 0,

    fontSize: "16px",

    color: "var(--text-color)",

    fontWeight: "700"

};

const tableSubtitle = {

    margin: "4px 0 0",

    color: "var(--muted-text)",

    fontSize: "12px"

};


// =====================================================
// SEARCH
// =====================================================

const searchWrapper = {

    width: "360px",

    maxWidth: "100%",

    height: "40px",

    border:
        "1px solid var(--border-color)",

    borderRadius: "8px",

    display: "flex",

    alignItems: "center",

    background: "var(--input-background)",

    boxSizing: "border-box",

    transition:
        "border-color .15s, box-shadow .15s"

};

const searchIcon = {

    marginLeft: "12px",

    color: "var(--muted-text)",

    fontSize: "21px"

};

const searchInput = {

    flex: 1,

    minWidth: 0,

    height: "100%",

    border: "none",

    outline: "none",

    padding: "0 10px",

    color: "var(--text-color)",

    fontSize: "13px",

    background: "transparent"

};

const clearSearch = {

    border: "none",

    background: "transparent",

    color: "var(--muted-text)",

    fontSize: "18px",

    cursor: "pointer",

    marginRight: "8px"

};


// =====================================================
// TABLE
// =====================================================

const tableScroll = {

    width: "100%",

    overflowX: "auto"

};

const table = {

    width: "100%",

    minWidth: "1200px",

    borderCollapse: "collapse"

};

const thStyle = {

    padding: "13px 15px",

    textAlign: "left",

    whiteSpace: "nowrap",

    fontSize: "11px",

    textTransform: "uppercase",

    letterSpacing: ".04em",

    color: "var(--muted-text)",

    background:
        "var(--table-header-background)",

    borderBottom:
        "1px solid var(--border-color)",

    fontWeight: "700"

};

const tdStyle = {

    padding: "14px 15px",

    textAlign: "left",

    whiteSpace: "nowrap",

    fontSize: "13px",

    color: "var(--secondary-text)",

    borderBottom:
        "1px solid var(--border-color)",

    verticalAlign: "middle"

};

const rowStyle = {

    background: "var(--card-background)",

    transition: "background .15s"

};


// =====================================================
// VENDOR CELL
// =====================================================

const idText = {

    color: "var(--muted-text)",

    fontSize: "12px",

    fontWeight: "600"

};

const codeBadge = {

    padding: "4px 7px",

    borderRadius: "5px",

    background:
        "var(--muted-background)",

    color: "var(--secondary-text)",

    border:
        "1px solid var(--border-color)",

    fontSize: "11px"

};

const vendorCell = {

    display: "flex",

    alignItems: "center",

    gap: "10px"

};

const vendorIcon = {

    width: "36px",

    height: "36px",

    borderRadius: "8px",

    background:
        "var(--primary-light)",

    color:
        "var(--primary-color)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontWeight: "700",

    fontSize: "14px",

    flexShrink: 0

};

const vendorName = {

    border: "none",

    background: "transparent",

    color: "var(--text-color)",

    cursor: "pointer",

    padding: 0,

    fontWeight: "650",

    fontSize: "13px",

    textAlign: "left"

};

const vendorSmallCode = {

    color: "var(--muted-text)",

    fontSize: "11px",

    marginTop: "3px"

};


// =====================================================
// STATUS
// =====================================================

const statusBadge = {

    display: "inline-flex",

    alignItems: "center",

    gap: "6px",

    borderRadius: "20px",

    padding: "5px 8px",

    fontSize: "10px",

    fontWeight: "700"

};


// =====================================================
// ACTIONS
// =====================================================

const actionWrapper = {

    display: "flex",

    justifyContent: "flex-end",

    gap: "6px"

};

const actionBase = {

    width: "31px",

    height: "31px",

    borderRadius: "7px",

    cursor: "pointer",

    fontSize: "14px",

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    padding: 0

};

const viewButton = {

    ...actionBase,

    border:
        "1px solid var(--border-color)",

    background:
        "var(--muted-background)",

    color:
        "var(--secondary-text)"

};

const editButton = {

    ...actionBase,

    border:
        "1px solid var(--primary-border)",

    background:
        "var(--primary-light)",

    color:
        "var(--primary-color)"

};

const deleteButton = {

    ...actionBase,

    border:
        "1px solid var(--danger-border)",

    background:
        "var(--danger-light)",

    color:
        "var(--danger-color)"

};


// =====================================================
// EMPTY
// =====================================================

const emptyCell = {

    padding: "70px 20px",

    textAlign: "center"

};

const emptyIcon = {

    width: "48px",

    height: "48px",

    borderRadius: "12px",

    background:
        "var(--muted-background)",

    color:
        "var(--muted-text)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    margin: "0 auto 12px",

    fontSize: "20px"

};

const emptyTitle = {

    color:
        "var(--secondary-text)",

    fontWeight: "700",

    fontSize: "14px"

};

const emptyText = {

    color:
        "var(--muted-text)",

    fontSize: "12px",

    marginTop: "5px"

};


// =====================================================
// SKELETON
// =====================================================

const skeleton = {

    height: "13px",

    width: "75%",

    borderRadius: "5px",

    background:
        "linear-gradient(90deg, var(--muted-background), var(--border-color), var(--muted-background))",

    backgroundSize: "200% 100%",

    animation:
        "vendorSkeleton 1.4s ease-in-out infinite"

};


export default Vendors;