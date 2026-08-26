import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function AssetHistory() {
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // =====================================================
    // LOAD HISTORY
    // =====================================================

    const loadHistory = async () => {
        try {
            setLoading(true);

            const response = await API.get(
                "/dashboard/recent-history"
            );

            setHistory(response.data?.data || []);
        } catch (error) {
            console.error(
                "Asset History Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load asset history"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredHistory = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        if (!searchText) {
            return history;
        }

        return history.filter((item) => {
            const text = [
                item.history_id,
                item.asset_code,
                item.asset_name,
                item.employee_name,
                item.action_type,
                item.remarks
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return text.includes(searchText);
        });
    }, [history, search]);

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // =====================================================
    // ACTION COLOR
    // =====================================================

    const getActionStyle = (action) => {
        const value = String(action || "").toLowerCase();

        if (
            value.includes("assign") ||
            value.includes("issue")
        ) {
            return {
                background: "#dbeafe",
                color: "#1d4ed8"
            };
        }

        if (
            value.includes("return") ||
            value.includes("receive")
        ) {
            return {
                background: "#dcfce7",
                color: "#15803d"
            };
        }

        if (
            value.includes("repair") ||
            value.includes("maintenance")
        ) {
            return {
                background: "#fef3c7",
                color: "#b45309"
            };
        }

        if (
            value.includes("delete") ||
            value.includes("remove")
        ) {
            return {
                background: "#fee2e2",
                color: "#b91c1c"
            };
        }

        return {
            background: "#f1f5f9",
            color: "#475569"
        };
    };

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
                        GRADIENT PAGE HEADER
                    ================================================= */}

                    <div style={heroHeader}>

                        {/* LEFT SIDE */}

                        <div style={heroContent}>

                            <div style={heroBreadcrumb}>
                                Dashboard
                                <span style={breadcrumbSlash}>
                                    /
                                </span>
                                Asset History
                            </div>

                            <div style={heroTitleRow}>

                                <div style={heroIcon}>
                                    ↻
                                </div>

                                <div>
                                    <h1 style={pageTitle}>
                                        Asset History
                                    </h1>

                                    <p style={pageSubtitle}>
                                        Track asset assignments, returns
                                        and other asset activities.
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* RIGHT SIDE ACTION */}

                        <div style={headerActions}>

                            <button
                                type="button"
                                onClick={loadHistory}
                                disabled={loading}
                                style={{
                                    ...refreshButton,
                                    opacity: loading ? 0.65 : 1,
                                    cursor: loading
                                        ? "not-allowed"
                                        : "pointer"
                                }}
                            >
                                <span
                                    style={{
                                        ...refreshIcon,
                                        display: "inline-block",
                                        animation: loading
                                            ? "spin 0.8s linear infinite"
                                            : "none"
                                    }}
                                >
                                    ↻
                                </span>

                                {loading
                                    ? "Refreshing..."
                                    : "Refresh"}
                            </button>

                        </div>

                    </div>

                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div style={statsGrid}>

                        <SummaryCard
                            title="Total Activities"
                            value={history.length}
                            icon="#"
                            iconBackground="#eff6ff"
                            iconColor="#2563eb"
                        />

                        <SummaryCard
                            title="Showing"
                            value={filteredHistory.length}
                            icon="✓"
                            iconBackground="#f0fdf4"
                            iconColor="#16a34a"
                        />

                        <SummaryCard
                            title="Latest Activity"
                            value={
                                history.length > 0
                                    ? formatDate(
                                        history[0].action_date
                                    )
                                    : "-"
                            }
                            icon="↻"
                            iconBackground="#fffbeb"
                            iconColor="#d97706"
                            valueSmall
                        />

                        <SummaryCard
                            title="Search"
                            value={
                                search
                                    ? "Filtered"
                                    : "All Records"
                            }
                            icon="⌕"
                            iconBackground="#f5f3ff"
                            iconColor="#7c3aed"
                            valueSmall
                        />

                    </div>

                    {/* =================================================
                        TABLE CARD
                    ================================================= */}

                    <div style={tableCard}>

                        {/* =================================================
                            TABLE HEADER
                        ================================================= */}

                        <div style={tableHeader}>

                            <div>
                                <h2 style={tableTitle}>
                                    Activity History
                                </h2>

                                <p style={tableSubtitle}>
                                    {filteredHistory.length} record
                                    {filteredHistory.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    found
                                </p>
                            </div>

                            {/* SEARCH */}

                            <div style={searchWrapper}>

                                <span style={searchIcon}>
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search asset, employee, action or remarks..."
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
                                            Asset Code
                                        </th>

                                        <th style={thStyle}>
                                            Asset Name
                                        </th>

                                        <th style={thStyle}>
                                            Employee
                                        </th>

                                        <th style={thStyle}>
                                            Action
                                        </th>

                                        <th style={thStyle}>
                                            Date & Time
                                        </th>

                                        <th style={thStyle}>
                                            Remarks
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {/* =================================================
                                        LOADING
                                    ================================================= */}

                                    {loading ? (
                                        <>
                                            {[1, 2, 3, 4, 5].map(
                                                (row) => (
                                                    <tr key={row}>

                                                        {Array.from({
                                                            length: 6
                                                        }).map(
                                                            (_, index) => (
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
                                                                                index ===
                                                                                1
                                                                                    ? "160px"
                                                                                    : index ===
                                                                                        5
                                                                                        ? "190px"
                                                                                        : "90px"
                                                                        }}
                                                                    />
                                                                </td>
                                                            )
                                                        )}

                                                    </tr>
                                                )
                                            )}
                                        </>
                                    ) : filteredHistory.length === 0 ? (

                                        /* =================================================
                                            EMPTY
                                        ================================================= */

                                        <tr>

                                            <td
                                                colSpan="6"
                                                style={emptyCell}
                                            >

                                                <div
                                                    style={emptyIcon}
                                                >
                                                    📋
                                                </div>

                                                <div
                                                    style={emptyTitle}
                                                >
                                                    No history found
                                                </div>

                                                <div
                                                    style={emptyText}
                                                >
                                                    {search
                                                        ? "Try changing your search."
                                                        : "No asset activities are available yet."}
                                                </div>

                                            </td>

                                        </tr>

                                    ) : (

                                        /* =================================================
                                            HISTORY ROWS
                                        ================================================= */

                                        filteredHistory.map(
                                            (item, index) => {

                                                const actionStyle =
                                                    getActionStyle(
                                                        item.action_type
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            item.history_id ||
                                                            `${item.asset_code}-${item.action_date}-${index}`
                                                        }
                                                        style={
                                                            rowStyle
                                                        }
                                                        onMouseEnter={(
                                                            e
                                                        ) => {
                                                            e.currentTarget.style.background =
                                                                "#f8fafc";
                                                        }}
                                                        onMouseLeave={(
                                                            e
                                                        ) => {
                                                            e.currentTarget.style.background =
                                                                "#ffffff";
                                                        }}
                                                    >

                                                        {/* ASSET CODE */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            <span
                                                                style={
                                                                    assetCode
                                                                }
                                                            >
                                                                {item.asset_code ||
                                                                    "-"}
                                                            </span>
                                                        </td>

                                                        {/* ASSET NAME */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            <div
                                                                style={
                                                                    assetName
                                                                }
                                                            >
                                                                {item.asset_name ||
                                                                    "-"}
                                                            </div>
                                                        </td>

                                                        {/* EMPLOYEE */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            {item.employee_name ? (
                                                                <div
                                                                    style={
                                                                        employeeCell
                                                                    }
                                                                >

                                                                    <div
                                                                        style={
                                                                            employeeAvatar
                                                                        }
                                                                    >
                                                                        {String(
                                                                            item.employee_name
                                                                        )
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </div>

                                                                    <span
                                                                        style={
                                                                            employeeName
                                                                        }
                                                                    >
                                                                        {
                                                                            item.employee_name
                                                                        }
                                                                    </span>

                                                                </div>
                                                            ) : (
                                                                <span
                                                                    style={
                                                                        mutedText
                                                                    }
                                                                >
                                                                    -
                                                                </span>
                                                            )}

                                                        </td>

                                                        {/* ACTION */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            <span
                                                                style={{
                                                                    ...actionBadge,
                                                                    background:
                                                                        actionStyle.background,
                                                                    color:
                                                                        actionStyle.color
                                                                }}
                                                            >

                                                                <span
                                                                    style={{
                                                                        width: "6px",
                                                                        height: "6px",
                                                                        borderRadius:
                                                                            "50%",
                                                                        background:
                                                                            actionStyle.color
                                                                    }}
                                                                />

                                                                {item.action_type ||
                                                                    "Activity"}

                                                            </span>

                                                        </td>

                                                        {/* DATE */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            <div
                                                                style={
                                                                    dateText
                                                                }
                                                            >
                                                                {formatDate(
                                                                    item.action_date
                                                                )}
                                                            </div>

                                                        </td>

                                                        {/* REMARKS */}

                                                        <td
                                                            style={{
                                                                ...tdStyle,
                                                                maxWidth:
                                                                    "320px",
                                                                whiteSpace:
                                                                    "normal"
                                                            }}
                                                        >

                                                            <span
                                                                style={{
                                                                    color:
                                                                        item.remarks
                                                                            ? "#475569"
                                                                            : "#94a3b8",
                                                                    lineHeight:
                                                                        "1.5"
                                                                }}
                                                            >
                                                                {item.remarks ||
                                                                    "-"}
                                                            </span>

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
                GLOBAL ANIMATION
            ===================================================== */}

            <style>
                {`
                    @keyframes spin {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }
                    }

                    @media (max-width: 900px) {
                        .asset-history-hero {
                            flex-direction: column !important;
                            align-items: flex-start !important;
                        }
                    }

                    @media (max-width: 600px) {
                        .asset-history-main {
                            padding: 18px !important;
                        }
                    }
                `}
            </style>

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
    iconBackground,
    iconColor,
    valueSmall = false
}) {
    return (
        <div style={summaryCard}>

            <div
                style={{
                    ...summaryIcon,
                    background: iconBackground,
                    color: iconColor
                }}
            >
                {icon}
            </div>

            <div style={{ minWidth: 0 }}>

                <div style={summaryLabel}>
                    {title}
                </div>

                <div
                    style={{
                        ...summaryValue,
                        fontSize: valueSmall
                            ? "15px"
                            : "24px"
                    }}
                >
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
    background: "#f8fafc"
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
// =====================================================

const heroHeader = {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    padding: "25px 28px",
    marginBottom: "22px",
    borderRadius: "16px",
    overflow: "hidden",
    background:
        "linear-gradient(135deg, #0f172a 0%, #172554 42%, #2563eb 100%)",
    boxShadow:
        "0 10px 30px rgba(15,23,42,0.14)",
    boxSizing: "border-box"
};

const heroContent = {
    minWidth: 0
};

const heroBreadcrumb = {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    marginBottom: "13px",
    color: "rgba(255,255,255,0.68)",
    fontSize: "12px",
    fontWeight: "500"
};

const breadcrumbSlash = {
    color: "rgba(255,255,255,0.35)"
};

const heroTitleRow = {
    display: "flex",
    alignItems: "center",
    gap: "14px"
};

const heroIcon = {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.13)",
    border: "1px solid rgba(255,255,255,0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "23px",
    fontWeight: "700",
    flexShrink: 0,
    boxSizing: "border-box"
};

const pageTitle = {
    margin: 0,
    color: "#ffffff",
    fontSize: "29px",
    lineHeight: "1.2",
    fontWeight: "750",
    letterSpacing: "-0.02em"
};

const pageSubtitle = {
    margin: "6px 0 0",
    color: "rgba(255,255,255,0.72)",
    fontSize: "13px",
    lineHeight: "1.5"
};

const headerActions = {
    display: "flex",
    alignItems: "center",
    flexShrink: 0
};


// =====================================================
// HEADER BUTTON
// =====================================================

const refreshButton = {
    height: "42px",
    padding: "0 16px",
    border: "1px solid rgba(255,255,255,0.20)",
    borderRadius: "9px",
    background: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "650",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backdropFilter: "blur(8px)",
    boxShadow:
        "0 4px 12px rgba(0,0,0,0.12)"
};

const refreshIcon = {
    fontSize: "17px",
    lineHeight: 1
};


// =====================================================
// SUMMARY
// =====================================================

const statsGrid = {
    display: "grid",
    gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",
    gap: "15px",
    marginBottom: "22px"
};

const summaryCard = {
    background: "#ffffff",
    border: "1px solid #e5eaf0",
    borderRadius: "11px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    minHeight: "82px",
    boxSizing: "border-box",
    boxShadow:
        "0 1px 3px rgba(15,23,42,0.04)"
};

const summaryIcon = {
    width: "42px",
    height: "42px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: "700",
    flexShrink: 0
};

const summaryLabel = {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "4px"
};

const summaryValue = {
    color: "#0f172a",
    fontWeight: "750",
    lineHeight: "1.25",
    wordBreak: "break-word"
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
        "0 1px 3px rgba(15,23,42,0.04)"
};

const tableHeader = {
    padding: "18px 20px",
    borderBottom: "1px solid #eef2f6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap"
};

const tableTitle = {
    margin: 0,
    fontSize: "16px",
    color: "#0f172a",
    fontWeight: "700"
};

const tableSubtitle = {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "12px"
};


// =====================================================
// SEARCH
// =====================================================

const searchWrapper = {
    width: "410px",
    maxWidth: "100%",
    height: "40px",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    background: "#ffffff",
    boxSizing: "border-box",
    transition: "border-color .15s, box-shadow .15s"
};

const searchIcon = {
    marginLeft: "12px",
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
    padding: "0 10px",
    color: "#334155",
    fontSize: "13px",
    background: "transparent"
};

const clearSearch = {
    width: "28px",
    height: "28px",
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: "18px",
    cursor: "pointer",
    marginRight: "5px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
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
    minWidth: "1050px",
    borderCollapse: "collapse"
};

const thStyle = {
    padding: "13px 15px",
    textAlign: "left",
    whiteSpace: "nowrap",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: ".04em",
    color: "#64748b",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    fontWeight: "700"
};

const tdStyle = {
    padding: "14px 15px",
    textAlign: "left",
    fontSize: "13px",
    color: "#475569",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle"
};

const rowStyle = {
    background: "#ffffff",
    transition: "background .15s"
};


// =====================================================
// ASSET
// =====================================================

const assetCode = {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 8px",
    borderRadius: "6px",
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #dbeafe",
    fontSize: "11px",
    fontWeight: "700"
};

const assetName = {
    color: "#0f172a",
    fontWeight: "650",
    fontSize: "13px"
};


// =====================================================
// EMPLOYEE
// =====================================================

const employeeCell = {
    display: "flex",
    alignItems: "center",
    gap: "9px"
};

const employeeAvatar = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background:
        "linear-gradient(135deg, #eef2ff, #e0e7ff)",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "12px",
    flexShrink: 0
};

const employeeName = {
    color: "#334155",
    fontWeight: "500"
};

const mutedText = {
    color: "#94a3b8"
};


// =====================================================
// ACTION
// =====================================================

const actionBadge = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
    whiteSpace: "nowrap"
};


// =====================================================
// DATE
// =====================================================

const dateText = {
    color: "#334155",
    fontWeight: "500",
    whiteSpace: "nowrap"
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
    background: "#f1f5f9",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
    fontSize: "21px"
};

const emptyTitle = {
    color: "#334155",
    fontWeight: "700",
    fontSize: "14px"
};

const emptyText = {
    color: "#94a3b8",
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
        "linear-gradient(90deg,#f1f5f9,#e2e8f0,#f1f5f9)",
    backgroundSize: "200% 100%",
    animation: "skeletonLoading 1.4s ease infinite"
};


export default AssetHistory;