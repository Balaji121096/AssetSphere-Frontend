// src/pages/Software.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Software() {
    const navigate = useNavigate();

    const [software, setSoftware] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    // =====================================================
    // LOAD SOFTWARE
    // =====================================================

    const loadSoftware = async () => {
        try {
            setLoading(true);

            const response = await API.get("/software");

            setSoftware(response.data?.data || []);
        } catch (error) {
            console.error("Load Software Error:", error);

            alert(
                error.response?.data?.message ||
                    "Failed to load software"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSoftware();
    }, []);

    // =====================================================
    // DELETE SOFTWARE
    // =====================================================

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this software?"
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(id);

            await API.delete(`/software/${id}`);

            alert("Software deleted successfully");

            await loadSoftware();
        } catch (error) {
            console.error("Delete Software Error:", error);

            alert(
                error.response?.data?.message ||
                    "Failed to delete software"
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =====================================================
    // EXPIRY STATUS
    // =====================================================

    const getExpiryStatus = (days) => {
        if (
            days === null ||
            days === undefined ||
            days === ""
        ) {
            return {
                text: "No Expiry",
                color: "#64748b",
                background: "#f1f5f9",
                dot: "#94a3b8"
            };
        }

        const remaining = Number(days);

        if (remaining < 0) {
            return {
                text: "Expired",
                color: "#dc2626",
                background: "#fef2f2",
                dot: "#ef4444"
            };
        }

        if (remaining <= 10) {
            return {
                text: "Critical",
                color: "#dc2626",
                background: "#fef2f2",
                dot: "#ef4444"
            };
        }

        if (remaining <= 20) {
            return {
                text: "10–20 Days",
                color: "#ea580c",
                background: "#fff7ed",
                dot: "#f97316"
            };
        }

        if (remaining <= 30) {
            return {
                text: "20–30 Days",
                color: "#ca8a04",
                background: "#fefce8",
                dot: "#eab308"
            };
        }

        return {
            text: "Active",
            color: "#16a34a",
            background: "#f0fdf4",
            dot: "#22c55e"
        };
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) return "-";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // =====================================================
    // FILTER SOFTWARE
    // =====================================================

    const filteredSoftware = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return software.filter((item) => {
            const expiry = getExpiryStatus(
                item.days_remaining
            );

            const searchableText = `
                ${item.software_code || ""}
                ${item.software_name || ""}
                ${item.publisher || ""}
                ${item.version || ""}
                ${item.license_type || ""}
                ${item.vendor_name || ""}
                ${item.status || ""}
                ${expiry.text}
            `.toLowerCase();

            const matchesSearch =
                !keyword ||
                searchableText.includes(keyword);

            let matchesFilter = true;

            if (filter === "Active") {
                matchesFilter =
                    Number(item.days_remaining) > 30 ||
                    item.days_remaining === null ||
                    item.days_remaining === undefined;
            }

            if (filter === "Critical") {
                matchesFilter =
                    item.days_remaining !== null &&
                    item.days_remaining !== undefined &&
                    Number(item.days_remaining) >= 0 &&
                    Number(item.days_remaining) <= 10;
            }

            if (filter === "Expiring") {
                matchesFilter =
                    item.days_remaining !== null &&
                    item.days_remaining !== undefined &&
                    Number(item.days_remaining) >= 0 &&
                    Number(item.days_remaining) <= 30;
            }

            if (filter === "Expired") {
                matchesFilter =
                    item.days_remaining !== null &&
                    item.days_remaining !== undefined &&
                    Number(item.days_remaining) < 0;
            }

            return matchesSearch && matchesFilter;
        });
    }, [software, search, filter]);

    // =====================================================
    // STATS
    // =====================================================

    const stats = useMemo(() => {
        let active = 0;
        let critical = 0;
        let expiring = 0;
        let expired = 0;

        software.forEach((item) => {
            const days = item.days_remaining;

            if (
                days === null ||
                days === undefined
            ) {
                active++;
                return;
            }

            const value = Number(days);

            if (value < 0) {
                expired++;
            } else if (value <= 10) {
                critical++;
            } else if (value <= 30) {
                expiring++;
            } else {
                active++;
            }
        });

        return {
            total: software.length,
            active,
            critical,
            expiring,
            expired
        };
    }, [software]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div style={pageStyle}>

            <Sidebar />

            <div style={contentStyle}>

                <Navbar />

                <main style={mainStyle}>

                    {/* =================================================
                        GRADIENT PAGE HEADER
                    ================================================= */}

                    <section style={heroHeader}>

                        {/* Decorative shapes */}

                        <div style={heroGlowOne} />
                        <div style={heroGlowTwo} />

                        <div style={heroContent}>

                            <div style={heroText}>

                                <div style={heroEyebrow}>
                                    SOFTWARE MANAGEMENT
                                </div>

                                <h1 style={heroTitle}>
                                    Software Licenses
                                </h1>

                                <p style={heroSubtitle}>
                                    Manage and monitor all company
                                    software licenses
                                </p>

                            </div>

                            <div style={headerActions}>

                                <button
                                    type="button"
                                    onClick={loadSoftware}
                                    disabled={loading}
                                    style={{
                                        ...secondaryButton,
                                        opacity: loading ? 0.75 : 1
                                    }}
                                >
                                    <span style={refreshIcon}>
                                        ↻
                                    </span>

                                    Refresh
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/software/add")
                                    }
                                    style={primaryButton}
                                >
                                    <span style={plusIcon}>
                                        +
                                    </span>

                                    Add Software
                                </button>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        STATS
                    ================================================= */}

                    <div style={statsGrid}>

                        <StatCard
                            title="Total Software"
                            value={stats.total}
                            icon="▣"
                            iconColor="#2563eb"
                            iconBackground="#eff6ff"
                        />

                        <StatCard
                            title="Active"
                            value={stats.active}
                            icon="✓"
                            iconColor="#16a34a"
                            iconBackground="#f0fdf4"
                        />

                        <StatCard
                            title="Expiring Soon"
                            value={stats.expiring}
                            icon="◷"
                            iconColor="#d97706"
                            iconBackground="#fffbeb"
                        />

                        <StatCard
                            title="Critical"
                            value={stats.critical}
                            icon="!"
                            iconColor="#dc2626"
                            iconBackground="#fef2f2"
                        />

                        <StatCard
                            title="Expired"
                            value={stats.expired}
                            icon="×"
                            iconColor="#7f1d1d"
                            iconBackground="#fef2f2"
                        />

                    </div>


                    {/* =================================================
                        TOOLBAR
                    ================================================= */}

                    <div style={toolbar}>

                        <div style={searchWrapper}>

                            <span style={searchIcon}>
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search software, publisher, license..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
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


                        <div style={filterGroup}>

                            {[
                                "All",
                                "Active",
                                "Expiring",
                                "Critical",
                                "Expired"
                            ].map((item) => (
                                <button
                                    type="button"
                                    key={item}
                                    onClick={() =>
                                        setFilter(item)
                                    }
                                    style={{
                                        ...filterButton,
                                        ...(filter === item
                                            ? activeFilterButton
                                            : {})
                                    }}
                                >
                                    {item}
                                </button>
                            ))}

                        </div>

                    </div>


                    {/* =================================================
                        TABLE CARD
                    ================================================= */}

                    <div style={tableCard}>

                        <div style={tableHeader}>

                            <div>

                                <h2 style={tableTitle}>
                                    Software Inventory
                                </h2>

                                <p style={tableSubtitle}>
                                    {filteredSoftware.length}{" "}
                                    software
                                    {filteredSoftware.length !== 1
                                        ? " licenses"
                                        : " license"}{" "}
                                    found
                                </p>

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
                                            Software
                                        </th>

                                        <th style={thStyle}>
                                            Publisher
                                        </th>

                                        <th style={thStyle}>
                                            Version
                                        </th>

                                        <th style={thStyle}>
                                            License
                                        </th>

                                        <th style={thStyle}>
                                            Qty
                                        </th>

                                        <th style={thStyle}>
                                            Purchase
                                        </th>

                                        <th style={thStyle}>
                                            Expiry
                                        </th>

                                        <th style={thStyle}>
                                            Days Remaining
                                        </th>

                                        <th style={thStyle}>
                                            Cost
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

                                    {/* LOADING */}

                                    {loading ? (

                                        <>
                                            {[1, 2, 3, 4, 5].map(
                                                (row) => (
                                                    <tr key={row}>

                                                        {Array.from({
                                                            length: 12
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
                                                                        style={
                                                                            skeleton
                                                                        }
                                                                    />
                                                                </td>
                                                            )
                                                        )}

                                                    </tr>
                                                )
                                            )}
                                        </>

                                    ) : filteredSoftware.length ===
                                      0 ? (

                                        <tr>

                                            <td
                                                colSpan="12"
                                                style={
                                                    emptyCell
                                                }
                                            >

                                                <div
                                                    style={
                                                        emptyIcon
                                                    }
                                                >
                                                    ▣
                                                </div>

                                                <div
                                                    style={
                                                        emptyTitle
                                                    }
                                                >
                                                    No software found
                                                </div>

                                                <div
                                                    style={
                                                        emptyText
                                                    }
                                                >
                                                    Try changing your
                                                    search or filter.
                                                </div>

                                            </td>

                                        </tr>

                                    ) : (

                                        filteredSoftware.map(
                                            (item) => {

                                                const expiry =
                                                    getExpiryStatus(
                                                        item.days_remaining
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            item.software_id
                                                        }
                                                        style={
                                                            rowStyle
                                                        }
                                                    >

                                                        {/* ID */}

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
                                                                    item.software_id
                                                                }
                                                            </span>
                                                        </td>


                                                        {/* SOFTWARE */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            <div
                                                                style={
                                                                    softwareCell
                                                                }
                                                            >

                                                                <div
                                                                    style={
                                                                        softwareIcon
                                                                    }
                                                                >
                                                                    {(
                                                                        item.software_name ||
                                                                        "S"
                                                                    )
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>

                                                                <div>

                                                                    <div
                                                                        style={
                                                                            softwareName
                                                                        }
                                                                    >
                                                                        {
                                                                            item.software_name ||
                                                                            "-"
                                                                        }
                                                                    </div>

                                                                    <div
                                                                        style={
                                                                            softwareCode
                                                                        }
                                                                    >
                                                                        {
                                                                            item.software_code ||
                                                                            "-"
                                                                        }
                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* PUBLISHER */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            {
                                                                item.publisher ||
                                                                "-"
                                                            }
                                                        </td>


                                                        {/* VERSION */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            <span
                                                                style={
                                                                    versionBadge
                                                                }
                                                            >
                                                                {
                                                                    item.version ||
                                                                    "-"
                                                                }
                                                            </span>

                                                        </td>


                                                        {/* LICENSE */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            <span
                                                                style={
                                                                    licenseBadge
                                                                }
                                                            >
                                                                {
                                                                    item.license_type ||
                                                                    "-"
                                                                }
                                                            </span>

                                                        </td>


                                                        {/* QTY */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            <strong>
                                                                {
                                                                    item.total_licenses
                                                                }
                                                            </strong>
                                                        </td>


                                                        {/* PURCHASE */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            {
                                                                formatDate(
                                                                    item.purchase_date
                                                                )
                                                            }
                                                        </td>


                                                        {/* EXPIRY */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            {
                                                                formatDate(
                                                                    item.expiry_date
                                                                )
                                                            }
                                                        </td>


                                                        {/* DAYS REMAINING */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            <div>

                                                                <strong
                                                                    style={{
                                                                        color:
                                                                            expiry.color
                                                                    }}
                                                                >
                                                                    {
                                                                        item.days_remaining ??
                                                                        "—"
                                                                    }
                                                                </strong>

                                                                <div
                                                                    style={{
                                                                        marginTop:
                                                                            "4px"
                                                                    }}
                                                                >
                                                                    <StatusBadge
                                                                        status={
                                                                            expiry
                                                                        }
                                                                    />
                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* COST */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            <strong>
                                                                ₹{" "}
                                                                {Number(
                                                                    item.cost ||
                                                                        0
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </strong>

                                                        </td>


                                                        {/* STATUS */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            <span
                                                                style={{
                                                                    ...statusBadge,
                                                                    color:
                                                                        item.status ===
                                                                        "Active"
                                                                            ? "#15803d"
                                                                            : "#64748b",
                                                                    background:
                                                                        item.status ===
                                                                        "Active"
                                                                            ? "#f0fdf4"
                                                                            : "#f1f5f9"
                                                                }}
                                                            >

                                                                <span
                                                                    style={{
                                                                        width:
                                                                            "6px",
                                                                        height:
                                                                            "6px",
                                                                        borderRadius:
                                                                            "50%",
                                                                        background:
                                                                            item.status ===
                                                                            "Active"
                                                                                ? "#22c55e"
                                                                                : "#94a3b8"
                                                                    }}
                                                                />

                                                                {
                                                                    item.status ||
                                                                    "-"
                                                                }

                                                            </span>

                                                        </td>


                                                        {/* ACTION */}

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
                                                                }
                                                            >

                                                                <button
                                                                    type="button"
                                                                    title="Edit"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/software/edit/${item.software_id}`
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
                                                                        item.software_id
                                                                    }
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            item.software_id
                                                                        )
                                                                    }
                                                                    style={{
                                                                        ...deleteButton,
                                                                        opacity:
                                                                            deletingId ===
                                                                            item.software_id
                                                                                ? 0.55
                                                                                : 1
                                                                    }}
                                                                >
                                                                    {deletingId ===
                                                                    item.software_id
                                                                        ? "..."
                                                                        : "⌫"}
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </main>

            </div>


            {/* =====================================================
                RESPONSIVE + ANIMATION
            ===================================================== */}

            <style>
                {`

                    * {
                        box-sizing: border-box;
                    }

                    @keyframes skeletonMove {
                        0% {
                            background-position: 200% 0;
                        }

                        100% {
                            background-position: -200% 0;
                        }
                    }

                    @media (max-width: 1200px) {

                        .software-stats-grid {
                            grid-template-columns:
                                repeat(3, minmax(0, 1fr)) !important;
                        }

                    }

                    @media (max-width: 900px) {

                        .software-hero-content {
                            align-items: flex-start !important;
                            flex-direction: column !important;
                        }

                        .software-header-actions {
                            width: 100%;
                        }

                        .software-header-actions button {
                            flex: 1;
                        }

                        .software-stats-grid {
                            grid-template-columns:
                                repeat(2, minmax(0, 1fr)) !important;
                        }

                    }

                    @media (max-width: 600px) {

                        .software-main {
                            padding: 18px !important;
                        }

                        .software-hero {
                            padding: 26px 22px !important;
                            min-height: auto !important;
                        }

                        .software-hero-title {
                            font-size: 25px !important;
                        }

                        .software-hero-subtitle {
                            font-size: 12px !important;
                        }

                        .software-stats-grid {
                            grid-template-columns: 1fr !important;
                        }

                        .software-toolbar {
                            align-items: stretch !important;
                        }

                        .software-search {
                            width: 100% !important;
                        }

                        .software-filter-group {
                            width: 100%;
                        }

                        .software-filter-group button {
                            flex: 1;
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

            <div style={{ minWidth: 0 }}>

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
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {
    return (
        <span
            style={{
                ...statusBadge,
                color: status.color,
                background: status.background
            }}
        >

            <span
                style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: status.dot
                }}
            />

            {status.text}

        </span>
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
// GRADIENT HERO HEADER
// =====================================================

const heroHeader = {
    position: "relative",
    minHeight: "152px",
    marginBottom: "22px",
    padding: "28px 25px",
    borderRadius: "15px",
    overflow: "hidden",
    background:
        "linear-gradient(115deg, #111a34 0%, #162b61 42%, #245fe0 100%)",
    boxShadow:
        "0 10px 25px rgba(15,23,42,0.12)",
    color: "#ffffff"
};

const heroContent = {
    position: "relative",
    zIndex: 2,
    minHeight: "96px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px"
};

const heroText = {
    minWidth: 0
};

const heroEyebrow = {
    marginBottom: "8px",
    color: "#7dd3fc",
    fontSize: "10px",
    lineHeight: 1,
    fontWeight: "800",
    letterSpacing: "1.25px"
};

const heroTitle = {
    margin: 0,
    color: "#ffffff",
    fontSize: "25px",
    lineHeight: 1.15,
    fontWeight: "750",
    letterSpacing: "-0.5px"
};

const heroSubtitle = {
    margin: "8px 0 0",
    color: "rgba(255,255,255,0.88)",
    fontSize: "12px",
    lineHeight: 1.5
};


// =====================================================
// HERO DECORATION
// =====================================================

const heroGlowOne = {
    position: "absolute",
    width: "230px",
    height: "230px",
    right: "-45px",
    top: "-105px",
    borderRadius: "50%",
    background:
        "rgba(59,130,246,0.18)",
    filter: "blur(2px)"
};

const heroGlowTwo = {
    position: "absolute",
    width: "150px",
    height: "150px",
    right: "205px",
    bottom: "-95px",
    borderRadius: "50%",
    background:
        "rgba(59,130,246,0.16)",
    boxShadow:
        "0 0 50px rgba(59,130,246,0.12)"
};


// =====================================================
// HERO BUTTONS
// =====================================================

const headerActions = {
    position: "relative",
    zIndex: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px",
    flexShrink: 0
};

const secondaryButton = {
    height: "35px",
    padding: "0 13px",
    border: "1px solid rgba(255,255,255,0.30)",
    borderRadius: "7px",
    background: "rgba(255,255,255,0.10)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "650",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)"
};

const primaryButton = {
    height: "35px",
    padding: "0 15px",
    border: "none",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#1746a2",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    boxShadow:
        "0 5px 14px rgba(0,0,0,0.14)"
};

const refreshIcon = {
    fontSize: "15px",
    lineHeight: 1,
    fontWeight: "700"
};

const plusIcon = {
    fontSize: "14px",
    lineHeight: 1,
    fontWeight: "700"
};


// =====================================================
// STATS
// =====================================================

const statsGrid = {
    display: "grid",
    gridTemplateColumns:
        "repeat(5, minmax(0, 1fr))",
    gap: "15px",
    marginBottom: "20px"
};

const statCard = {
    background: "#ffffff",
    border: "1px solid #e5eaf0",
    borderRadius: "11px",
    padding: "17px 18px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    minHeight: "78px",
    boxSizing: "border-box",
    boxShadow:
        "0 2px 7px rgba(15,23,42,0.025)"
};

const statIcon = {
    width: "41px",
    height: "41px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: "700",
    flexShrink: 0
};

const statTitle = {
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "4px",
    whiteSpace: "nowrap"
};

const statValue = {
    fontSize: "22px",
    lineHeight: 1,
    fontWeight: "750",
    color: "#0f172a"
};


// =====================================================
// TOOLBAR
// =====================================================

const toolbar = {
    background: "#ffffff",
    border: "1px solid #e5eaf0",
    borderRadius: "11px",
    padding: "13px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    boxShadow:
        "0 2px 7px rgba(15,23,42,0.02)"
};

const searchWrapper = {
    width: "360px",
    maxWidth: "100%",
    height: "40px",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    background: "#ffffff",
    boxSizing: "border-box"
};

const searchIcon = {
    marginLeft: "11px",
    color: "#94a3b8",
    fontSize: "20px",
    lineHeight: 1
};

const searchInput = {
    flex: 1,
    minWidth: 0,
    height: "100%",
    border: "none",
    outline: "none",
    padding: "0 9px",
    color: "#334155",
    fontSize: "12px",
    background: "transparent"
};

const clearSearch = {
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: "18px",
    cursor: "pointer",
    marginRight: "7px",
    lineHeight: 1
};

const filterGroup = {
    display: "flex",
    gap: "4px",
    flexWrap: "wrap"
};

const filterButton = {
    border: "1px solid transparent",
    background: "transparent",
    color: "#64748b",
    borderRadius: "7px",
    padding: "7px 11px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "600"
};

const activeFilterButton = {
    background: "#eff6ff",
    color: "#2563eb",
    borderColor: "#dbeafe"
};


// =====================================================
// TABLE CARD
// =====================================================

const tableCard = {
    background: "#ffffff",
    border: "1px solid #e5eaf0",
    borderRadius: "11px",
    overflow: "hidden",
    boxShadow:
        "0 3px 10px rgba(15,23,42,0.025)"
};

const tableHeader = {
    padding: "17px 20px",
    borderBottom: "1px solid #eef2f6"
};

const tableTitle = {
    margin: 0,
    fontSize: "15px",
    color: "#0f172a",
    fontWeight: "700"
};

const tableSubtitle = {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "11px"
};

const tableScroll = {
    width: "100%",
    overflowX: "auto"
};

const table = {
    width: "100%",
    minWidth: "1450px",
    borderCollapse: "collapse"
};


// =====================================================
// TABLE
// =====================================================

const thStyle = {
    padding: "12px 15px",
    textAlign: "left",
    whiteSpace: "nowrap",
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: ".04em",
    color: "#64748b",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    fontWeight: "700"
};

const tdStyle = {
    padding: "13px 15px",
    textAlign: "left",
    whiteSpace: "nowrap",
    fontSize: "12px",
    color: "#475569",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle"
};

const rowStyle = {
    transition:
        "background .15s ease"
};


// =====================================================
// SOFTWARE
// =====================================================

const idText = {
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "600"
};

const softwareCell = {
    display: "flex",
    alignItems: "center",
    gap: "9px"
};

const softwareIcon = {
    width: "35px",
    height: "35px",
    borderRadius: "8px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "13px",
    flexShrink: 0
};

const softwareName = {
    color: "#0f172a",
    fontWeight: "650",
    fontSize: "12px",
    marginBottom: "3px"
};

const softwareCode = {
    color: "#94a3b8",
    fontSize: "10px"
};

const versionBadge = {
    padding: "4px 7px",
    borderRadius: "5px",
    background: "#f8fafc",
    color: "#475569",
    border: "1px solid #e2e8f0",
    fontSize: "10px"
};

const licenseBadge = {
    color: "#475569",
    background: "#f8fafc",
    borderRadius: "5px",
    padding: "4px 7px",
    fontSize: "10px",
    border: "1px solid #e2e8f0"
};


// =====================================================
// STATUS
// =====================================================

const statusBadge = {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    borderRadius: "20px",
    padding: "4px 7px",
    fontSize: "9px",
    fontWeight: "700"
};


// =====================================================
// ACTIONS
// =====================================================

const actionWrapper = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "5px"
};

const editButton = {
    width: "30px",
    height: "30px",
    border: "1px solid #dbeafe",
    borderRadius: "7px",
    background: "#eff6ff",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "13px"
};

const deleteButton = {
    width: "30px",
    height: "30px",
    border: "1px solid #fee2e2",
    borderRadius: "7px",
    background: "#fef2f2",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "13px"
};


// =====================================================
// EMPTY
// =====================================================

const emptyCell = {
    padding: "65px 20px",
    textAlign: "center"
};

const emptyIcon = {
    width: "47px",
    height: "47px",
    borderRadius: "12px",
    background: "#f1f5f9",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 11px",
    fontSize: "19px"
};

const emptyTitle = {
    color: "#334155",
    fontWeight: "700",
    fontSize: "13px"
};

const emptyText = {
    color: "#94a3b8",
    fontSize: "11px",
    marginTop: "5px"
};


// =====================================================
// SKELETON
// =====================================================

const skeleton = {
    height: "12px",
    width: "75%",
    borderRadius: "5px",
    background:
        "linear-gradient(90deg,#f1f5f9,#e2e8f0,#f1f5f9)",
    backgroundSize: "200% 100%",
    animation:
        "skeletonMove 1.3s ease-in-out infinite"
};


export default Software;