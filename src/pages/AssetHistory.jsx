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

            setHistory(
                response.data?.data || []
            );

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

        const searchText =
            search.trim().toLowerCase();

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

        const parsedDate =
            new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // =====================================================
    // ACTION COLOR
    // =====================================================

    const getActionStyle = (action) => {

        const value =
            String(action || "").toLowerCase();

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


    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f8fafc"
            }}
        >

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <Sidebar />


            <div
                style={{
                    flex: 1,
                    minWidth: 0
                }}
            >

                {/* =================================================
                    NAVBAR
                ================================================= */}

                <Navbar />


                <main
                    style={{
                        padding: "28px",
                        maxWidth: "1600px",
                        margin: "0 auto"
                    }}
                >

                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "20px",
                            marginBottom: "25px",
                            flexWrap: "wrap"
                        }}
                    >

                        <div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    marginBottom: "8px"
                                }}
                            >

                                <div
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "10px",
                                        background:
                                            "linear-gradient(135deg, #2563eb, #4f46e5)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#ffffff",
                                        fontSize: "22px",
                                        fontWeight: "700"
                                    }}
                                >
                                    ↻
                                </div>

                                <h1
                                    style={{
                                        margin: 0,
                                        fontSize: "28px",
                                        color: "#0f172a"
                                    }}
                                >
                                    Asset History
                                </h1>

                            </div>


                            <p
                                style={{
                                    margin: 0,
                                    color: "#64748b",
                                    fontSize: "14px"
                                }}
                            >
                                Track asset assignments, returns
                                and other asset activities.
                            </p>

                        </div>


                        {/* REFRESH */}

                        <button
                            type="button"
                            onClick={loadHistory}
                            disabled={loading}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "10px 16px",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                background: "#ffffff",
                                color: "#334155",
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer",
                                fontWeight: "600",
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            <span>↻</span>

                            {loading
                                ? "Refreshing..."
                                : "Refresh"}
                        </button>

                    </div>


                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "16px",
                            marginBottom: "22px"
                        }}
                    >

                        <div style={summaryCardStyle}>

                            <div
                                style={summaryIconStyle(
                                    "#dbeafe",
                                    "#2563eb"
                                )}
                            >
                                #
                            </div>

                            <div>

                                <p style={summaryLabelStyle}>
                                    Total Activities
                                </p>

                                <h2 style={summaryValueStyle}>
                                    {history.length}
                                </h2>

                            </div>

                        </div>


                        <div style={summaryCardStyle}>

                            <div
                                style={summaryIconStyle(
                                    "#dcfce7",
                                    "#16a34a"
                                )}
                            >
                                ✓
                            </div>

                            <div>

                                <p style={summaryLabelStyle}>
                                    Showing
                                </p>

                                <h2 style={summaryValueStyle}>
                                    {filteredHistory.length}
                                </h2>

                            </div>

                        </div>


                        <div style={summaryCardStyle}>

                            <div
                                style={summaryIconStyle(
                                    "#fef3c7",
                                    "#d97706"
                                )}
                            >
                                ↻
                            </div>

                            <div>

                                <p style={summaryLabelStyle}>
                                    Latest Activity
                                </p>

                                <h2
                                    style={{
                                        ...summaryValueStyle,
                                        fontSize: "15px"
                                    }}
                                >
                                    {history.length > 0
                                        ? formatDate(
                                            history[0].action_date
                                        )
                                        : "-"}
                                </h2>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        SEARCH BAR
                    ================================================= */}

                    <div
                        style={{
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            padding: "16px",
                            marginBottom: "18px",
                            boxShadow:
                                "0 1px 3px rgba(15,23,42,0.05)"
                        }}
                    >

                        <div
                            style={{
                                position: "relative",
                                maxWidth: "500px"
                            }}
                        >

                            <span
                                style={{
                                    position: "absolute",
                                    left: "13px",
                                    top: "50%",
                                    transform:
                                        "translateY(-50%)",
                                    color: "#94a3b8",
                                    fontSize: "16px"
                                }}
                            >
                                🔍
                            </span>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder={
                                    "Search asset, employee, action or remarks..."
                                }
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding:
                                        "11px 40px",
                                    border:
                                        "1px solid #cbd5e1",
                                    borderRadius: "8px",
                                    outline: "none",
                                    fontSize: "14px",
                                    color: "#0f172a"
                                }}
                            />

                            {search && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    style={{
                                        position:
                                            "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform:
                                            "translateY(-50%)",
                                        border: "none",
                                        background:
                                            "transparent",
                                        color: "#64748b",
                                        cursor: "pointer",
                                        fontSize: "16px"
                                    }}
                                >
                                    ×
                                </button>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        TABLE CARD
                    ================================================= */}

                    <div
                        style={{
                            background: "#ffffff",
                            border:
                                "1px solid #e2e8f0",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow:
                                "0 2px 5px rgba(15,23,42,0.05)"
                        }}
                    >

                        {/* TABLE HEADER */}

                        <div
                            style={{
                                padding: "16px 20px",
                                borderBottom:
                                    "1px solid #e2e8f0",
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "10px"
                            }}
                        >

                            <div>

                                <h3
                                    style={{
                                        margin: 0,
                                        color: "#0f172a",
                                        fontSize: "16px"
                                    }}
                                >
                                    Activity History
                                </h3>

                                <p
                                    style={{
                                        margin:
                                            "4px 0 0",
                                        color: "#64748b",
                                        fontSize: "13px"
                                    }}
                                >
                                    {filteredHistory.length}{" "}
                                    record
                                    {filteredHistory.length !==
                                    1
                                        ? "s"
                                        : ""}
                                </p>

                            </div>

                        </div>


                        {/* TABLE */}

                        <div
                            style={{
                                overflowX: "auto"
                            }}
                        >

                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse:
                                        "collapse",
                                    minWidth: "950px"
                                }}
                            >

                                <thead>

                                    <tr
                                        style={{
                                            background:
                                                "#f8fafc"
                                        }}
                                    >

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

                                    {loading ? (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                style={
                                                    emptyStyle
                                                }
                                            >

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        flexDirection:
                                                            "column",
                                                        alignItems:
                                                            "center",
                                                        gap:
                                                            "10px"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            width:
                                                                "30px",
                                                            height:
                                                                "30px",
                                                            border:
                                                                "3px solid #e2e8f0",
                                                            borderTopColor:
                                                                "#2563eb",
                                                            borderRadius:
                                                                "50%"
                                                        }}
                                                    />

                                                    <span>
                                                        Loading
                                                        asset
                                                        history...
                                                    </span>

                                                </div>

                                            </td>

                                        </tr>

                                    ) : filteredHistory.length ===
                                      0 ? (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                style={
                                                    emptyStyle
                                                }
                                            >

                                                <div
                                                    style={{
                                                        padding:
                                                            "30px"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            fontSize:
                                                                "35px",
                                                            marginBottom:
                                                                "10px"
                                                        }}
                                                    >
                                                        📋
                                                    </div>

                                                    <div
                                                        style={{
                                                            fontWeight:
                                                                "600",
                                                            color:
                                                                "#334155",
                                                            marginBottom:
                                                                "5px"
                                                        }}
                                                    >
                                                        No history
                                                        found
                                                    </div>

                                                    <div
                                                        style={{
                                                            color:
                                                                "#94a3b8",
                                                            fontSize:
                                                                "13px"
                                                        }}
                                                    >
                                                        {search
                                                            ? "Try a different search term."
                                                            : "No asset activities are available yet."}
                                                    </div>

                                                </div>

                                            </td>

                                        </tr>

                                    ) : (

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
                                                        style={{
                                                            transition:
                                                                "background 0.2s"
                                                        }}
                                                    >

                                                        {/* ASSET CODE */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            <span
                                                                style={{
                                                                    fontWeight:
                                                                        "700",
                                                                    color:
                                                                        "#2563eb"
                                                                }}
                                                            >
                                                                {
                                                                    item.asset_code ||
                                                                    "-"
                                                                }
                                                            </span>

                                                        </td>


                                                        {/* ASSET NAME */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            <div
                                                                style={{
                                                                    fontWeight:
                                                                        "600",
                                                                    color:
                                                                        "#1e293b"
                                                                }}
                                                            >
                                                                {
                                                                    item.asset_name ||
                                                                    "-"
                                                                }
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
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap:
                                                                            "9px"
                                                                    }}
                                                                >

                                                                    <div
                                                                        style={{
                                                                            width:
                                                                                "30px",
                                                                            height:
                                                                                "30px",
                                                                            borderRadius:
                                                                                "50%",
                                                                            background:
                                                                                "#eef2ff",
                                                                            color:
                                                                                "#4f46e5",
                                                                            display:
                                                                                "flex",
                                                                            alignItems:
                                                                                "center",
                                                                            justifyContent:
                                                                                "center",
                                                                            fontWeight:
                                                                                "700",
                                                                            fontSize:
                                                                                "12px"
                                                                        }}
                                                                    >
                                                                        {String(
                                                                            item.employee_name
                                                                        )
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </div>

                                                                    <span>
                                                                        {
                                                                            item.employee_name
                                                                        }
                                                                    </span>

                                                                </div>

                                                            ) : (

                                                                <span
                                                                    style={{
                                                                        color:
                                                                            "#94a3b8"
                                                                    }}
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
                                                                    display:
                                                                        "inline-block",
                                                                    padding:
                                                                        "5px 10px",
                                                                    borderRadius:
                                                                        "20px",
                                                                    background:
                                                                        actionStyle.background,
                                                                    color:
                                                                        actionStyle.color,
                                                                    fontSize:
                                                                        "12px",
                                                                    fontWeight:
                                                                        "700"
                                                                }}
                                                            >
                                                                {
                                                                    item.action_type ||
                                                                    "Activity"
                                                                }
                                                            </span>

                                                        </td>


                                                        {/* DATE */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            <div
                                                                style={{
                                                                    color:
                                                                        "#334155",
                                                                    fontWeight:
                                                                        "500"
                                                                }}
                                                            >
                                                                {formatDate(
                                                                    item.action_date
                                                                )}
                                                            </div>

                                                        </td>


                                                        {/* REMARKS */}

                                                        <td
                                                            style={
                                                                {
                                                                    ...tdStyle,
                                                                    maxWidth:
                                                                        "280px",
                                                                    whiteSpace:
                                                                        "normal"
                                                                }
                                                            }
                                                        >

                                                            <span
                                                                style={{
                                                                    color:
                                                                        item.remarks
                                                                            ? "#475569"
                                                                            : "#94a3b8"
                                                                }}
                                                            >
                                                                {
                                                                    item.remarks ||
                                                                    "-"
                                                                }
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

        </div>

    );

}


// =====================================================
// STYLES
// =====================================================

const summaryCardStyle = {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow:
        "0 1px 3px rgba(15,23,42,0.05)"
};


const summaryIconStyle = (
    background,
    color
) => ({
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background,
    color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "700",
    flexShrink: 0
});


const summaryLabelStyle = {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600"
};


const summaryValueStyle = {
    margin: "4px 0 0",
    color: "#0f172a",
    fontSize: "22px"
};


const thStyle = {
    padding: "13px 16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    borderBottom:
        "1px solid #e2e8f0",
    whiteSpace: "nowrap"
};


const tdStyle = {
    padding: "14px 16px",
    fontSize: "13px",
    color: "#475569",
    borderBottom:
        "1px solid #f1f5f9",
    verticalAlign: "middle"
};


const emptyStyle = {
    padding: "50px 20px",
    textAlign: "center",
    color: "#64748b"
};


export default AssetHistory;