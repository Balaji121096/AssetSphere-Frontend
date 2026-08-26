// DashboardCards.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function DashboardCards() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [expiryAlerts, setExpiryAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {

        try {

            const response =
                await API.get("/dashboard");

            setDashboard(
                response.data.data
            );

        } catch (error) {

            console.error(
                "Dashboard API Error:",
                error
            );

        }

    };

    const fetchExpiryAlerts = async () => {

        try {

            const response =
                await API.get(
                    "/software/expiry-alerts"
                );

            setExpiryAlerts(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Software Expiry API Error:",
                error
            );

        }

    };

    const loadDashboard = async () => {

        try {

            setLoading(true);

            await Promise.all([
                fetchDashboard(),
                fetchExpiryAlerts()
            ]);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadDashboard();

    }, []);

    if (loading || !dashboard) {

        return (

            <div
                style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    padding: "40px",
                    textAlign: "center",
                    color: "#64748b"
                }}
            >
                Loading Dashboard...
            </div>

        );

    }


    // ==========================================
    // HARDWARE CARDS
    // ==========================================

    const hardwareCards = [

        {
            title: "Total Assets",
            value: dashboard.total_assets,
            path: "/assets",
            color: "#2563eb",
            icon: "▣"
        },

        {
            title: "Assigned",
            value: dashboard.assigned_assets,
            path: "/assets?status=Assigned",
            color: "#16a34a",
            icon: "✓"
        },

        {
            title: "In Stock",
            value: dashboard.in_stock,
            path: "/assets?status=In%20Stock",
            color: "#0891b2",
            icon: "▤"
        },

        {
            title: "Repair",
            value: dashboard.repair_assets,
            path: "/assets?status=Repair",
            color: "#ea580c",
            icon: "↻"
        },

        {
            title: "Scrap",
            value: dashboard.scrap_assets,
            path: "/assets?status=Scrap",
            color: "#dc2626",
            icon: "×"
        },

        {
            title: "Lost",
            value: dashboard.lost_assets,
            path: "/assets?status=Lost",
            color: "#7c3aed",
            icon: "!"
        }

    ];


    // ==========================================
    // SOFTWARE CARDS
    // ==========================================

    const softwareCards = [

        {
            title: "Expired",
            value: dashboard.expired_software,
            filter: "expired",
            color: "#dc2626"
        },

        {
            title: "Critical",
            subtitle: "0-10 Days",
            value: dashboard.critical_software,
            filter: "critical",
            color: "#ea580c"
        },

        {
            title: "10-20 Days",
            value: dashboard.ten_to_twenty_software,
            filter: "10-20",
            color: "#ca8a04"
        },

        {
            title: "20-30 Days",
            value: dashboard.twenty_to_thirty_software,
            filter: "20-30",
            color: "#16a34a"
        }

    ];


    // ==========================================
    // ALERT STYLE
    // ==========================================

    const getAlertStyle = (status) => {

        if (status === "Expired") {

            return {
                background: "#fef2f2",
                color: "#b91c1c",
                border: "#fecaca"
            };

        }

        if (status === "Critical") {

            return {
                background: "#fff7ed",
                color: "#c2410c",
                border: "#fed7aa"
            };

        }

        if (status === "10-20 Days") {

            return {
                background: "#fefce8",
                color: "#a16207",
                border: "#fde68a"
            };

        }

        return {
            background: "#f0fdf4",
            color: "#15803d",
            border: "#bbf7d0"
        };

    };


    return (

        <div>

            {/* ==========================================
                HARDWARE SECTION
            ========================================== */}

            <section>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "15px"
                    }}
                >

                    <div>

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "19px",
                                color: "#111827"
                            }}
                        >
                            Asset Overview
                        </h2>

                        <p
                            style={{
                                margin: "4px 0 0",
                                fontSize: "13px",
                                color: "#64748b"
                            }}
                        >
                            Current hardware asset status
                        </p>

                    </div>

                </div>


                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(3, minmax(0, 1fr))",
                        gap: "16px"
                    }}
                >

                    {hardwareCards.map(
                        (card, index) => (

                            <div
                                key={index}
                                onClick={() =>
                                    navigate(card.path)
                                }
                                style={{
                                    background: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    cursor: "pointer",
                                    position: "relative",
                                    overflow: "hidden",
                                    transition:
                                        "transform 0.2s ease, box-shadow 0.2s ease"
                                }}
                                onMouseEnter={(e) => {

                                    e.currentTarget.style.transform =
                                        "translateY(-2px)";

                                    e.currentTarget.style.boxShadow =
                                        "0 8px 20px rgba(15,23,42,0.08)";

                                }}
                                onMouseLeave={(e) => {

                                    e.currentTarget.style.transform =
                                        "translateY(0)";

                                    e.currentTarget.style.boxShadow =
                                        "none";

                                }}
                            >

                                <div
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: "4px",
                                        background: card.color
                                    }}
                                />

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >

                                    <div>

                                        <p
                                            style={{
                                                margin: 0,
                                                color: "#64748b",
                                                fontSize: "13px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            {card.title}
                                        </p>

                                        <h2
                                            style={{
                                                margin:
                                                    "8px 0 0",
                                                fontSize: "30px",
                                                color: "#111827",
                                                lineHeight: 1
                                            }}
                                        >
                                            {card.value}
                                        </h2>

                                    </div>


                                    <div
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                            borderRadius: "10px",
                                            background:
                                                `${card.color}15`,
                                            color: card.color,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "20px",
                                            fontWeight: "700"
                                        }}
                                    >
                                        {card.icon}
                                    </div>

                                </div>


                                <p
                                    style={{
                                        margin:
                                            "15px 0 0",
                                        fontSize: "12px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    Click to view assets →
                                </p>

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* ==========================================
                SOFTWARE SECTION
            ========================================== */}

            <section
                style={{
                    marginTop: "30px"
                }}
            >

                <div
                    style={{
                        marginBottom: "15px"
                    }}
                >

                    <h2
                        style={{
                            margin: 0,
                            fontSize: "19px",
                            color: "#111827"
                        }}
                    >
                        Software License Summary
                    </h2>

                    <p
                        style={{
                            margin: "4px 0 0",
                            fontSize: "13px",
                            color: "#64748b"
                        }}
                    >
                        License expiry status
                    </p>

                </div>


                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(4, minmax(0, 1fr))",
                        gap: "16px"
                    }}
                >

                    {softwareCards.map(
                        (card, index) => (

                            <div
                                key={index}
                                onClick={() =>
                                    navigate(
                                        `/software?expiry=${card.filter}`
                                    )
                                }
                                style={{
                                    background: "#ffffff",
                                    border:
                                        "1px solid #e2e8f0",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    cursor: "pointer",
                                    position: "relative",
                                    overflow: "hidden",
                                    transition:
                                        "transform 0.2s ease, box-shadow 0.2s ease"
                                }}
                                onMouseEnter={(e) => {

                                    e.currentTarget.style.transform =
                                        "translateY(-2px)";

                                    e.currentTarget.style.boxShadow =
                                        "0 8px 20px rgba(15,23,42,0.08)";

                                }}
                                onMouseLeave={(e) => {

                                    e.currentTarget.style.transform =
                                        "translateY(0)";

                                    e.currentTarget.style.boxShadow =
                                        "none";

                                }}
                            >

                                <div
                                    style={{
                                        height: "4px",
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        background:
                                            card.color
                                    }}
                                />

                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "13px",
                                        color: "#64748b",
                                        fontWeight: "600"
                                    }}
                                >
                                    {card.title}
                                </p>

                                {card.subtitle && (

                                    <p
                                        style={{
                                            margin:
                                                "5px 0 0",
                                            fontSize: "12px",
                                            color: "#94a3b8"
                                        }}
                                    >
                                        {card.subtitle}
                                    </p>

                                )}

                                <h2
                                    style={{
                                        margin:
                                            "12px 0 0",
                                        fontSize: "28px",
                                        color: card.color
                                    }}
                                >
                                    {card.value}
                                </h2>

                                <p
                                    style={{
                                        margin:
                                            "12px 0 0",
                                        fontSize: "12px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    Click to view →
                                </p>

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* ==========================================
                EXPIRY ALERTS
            ========================================== */}

            <section
                style={{
                    marginTop: "30px",
                    background: "#ffffff",
                    border:
                        "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "22px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        marginBottom: "18px"
                    }}
                >

                    <div>

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "19px",
                                color: "#111827"
                            }}
                        >
                            Software Expiry Alerts
                        </h2>

                        <p
                            style={{
                                margin:
                                    "4px 0 0",
                                color: "#64748b",
                                fontSize: "13px"
                            }}
                        >
                            Licenses that require attention
                        </p>

                    </div>


                    <div
                        style={{
                            minWidth: "30px",
                            height: "30px",
                            padding:
                                "0 8px",
                            borderRadius: "15px",
                            background:
                                expiryAlerts.length > 0
                                    ? "#fee2e2"
                                    : "#f1f5f9",
                            color:
                                expiryAlerts.length > 0
                                    ? "#dc2626"
                                    : "#64748b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                            fontWeight: "700"
                        }}
                    >
                        {expiryAlerts.length}
                    </div>

                </div>


                {expiryAlerts.length === 0 ? (

                    <div
                        style={{
                            padding: "30px",
                            textAlign: "center",
                            background: "#f8fafc",
                            borderRadius: "8px",
                            color: "#64748b",
                            fontSize: "14px"
                        }}
                    >
                        No software expiry alerts.
                    </div>

                ) : (

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        }}
                    >

                        {expiryAlerts.map(
                            (software) => {

                                const alert =
                                    getAlertStyle(
                                        software.expiry_status
                                    );

                                return (

                                    <div
                                        key={
                                            software.software_id
                                        }
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                            gap: "20px",
                                            padding:
                                                "14px 16px",
                                            background:
                                                alert.background,
                                            border:
                                                `1px solid ${alert.border}`,
                                            borderRadius:
                                                "9px"
                                        }}
                                    >

                                        <div>

                                            <strong
                                                style={{
                                                    color:
                                                        "#111827",
                                                    fontSize:
                                                        "14px"
                                                }}
                                            >
                                                {
                                                    software.software_name
                                                }
                                            </strong>

                                            <div
                                                style={{
                                                    marginTop:
                                                        "4px",
                                                    color:
                                                        "#64748b",
                                                    fontSize:
                                                        "12px"
                                                }}
                                            >
                                                Code:{" "}
                                                {
                                                    software.software_code
                                                }
                                            </div>

                                        </div>


                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                gap: "14px"
                                            }}
                                        >

                                            <span
                                                style={{
                                                    padding:
                                                        "5px 10px",
                                                    borderRadius:
                                                        "20px",
                                                    background:
                                                        "#ffffff",
                                                    color:
                                                        alert.color,
                                                    fontSize:
                                                        "12px",
                                                    fontWeight:
                                                        "700"
                                                }}
                                            >
                                                {
                                                    software.expiry_status
                                                }
                                            </span>


                                            <span
                                                style={{
                                                    color:
                                                        alert.color,
                                                    fontSize:
                                                        "13px",
                                                    fontWeight:
                                                        "600",
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                            >
                                                {
                                                    software.days_remaining
                                                }{" "}
                                                days remaining
                                            </span>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </section>

        </div>

    );

}

export default DashboardCards;