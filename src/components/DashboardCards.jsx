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

            const response = await API.get("/dashboard");

            setDashboard(response.data.data);

        } catch (error) {

            console.error("Dashboard API Error:", error);

        }

    };

    const fetchExpiryAlerts = async () => {

        try {

            const response = await API.get(
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
            <p>Loading Dashboard...</p>
        );

    }

    // =================================
    // HARDWARE CARDS
    // =================================

    const hardwareCards = [

        {
            title: "Total Assets",
            value: dashboard.total_assets,
            path: "/assets"
        },

        {
            title: "Assigned",
            value: dashboard.assigned_assets,
            path: "/assets?status=Assigned"
        },

        {
            title: "In Stock",
            value: dashboard.in_stock,
            path: "/assets?status=In%20Stock"
        },

        {
            title: "Repair",
            value: dashboard.repair_assets,
            path: "/assets?status=Repair"
        },

        {
            title: "Scrap",
            value: dashboard.scrap_assets,
            path: "/assets?status=Scrap"
        },

        {
            title: "Lost",
            value: dashboard.lost_assets,
            path: "/assets?status=Lost"
        }

    ];

    // =================================
    // SOFTWARE CARDS
    // =================================

    const softwareCards = [

        {
            title: "Expired",
            value: dashboard.expired_software,
            filter: "expired",
            background: "#ffebee",
            border: "#ef5350"
        },

        {
            title: "Critical",
            subtitle: "0-10 Days",
            value: dashboard.critical_software,
            filter: "critical",
            background: "#fff3e0",
            border: "#ff9800"
        },

        {
            title: "10-20 Days",
            value: dashboard.ten_to_twenty_software,
            filter: "10-20",
            background: "#fffde7",
            border: "#fbc02d"
        },

        {
            title: "20-30 Days",
            value: dashboard.twenty_to_thirty_software,
            filter: "20-30",
            background: "#e8f5e9",
            border: "#66bb6a"
        }

    ];

    // =================================
    // EXPIRY ALERT STYLE
    // =================================

    const getAlertStyle = (status) => {

        if (status === "Expired") {

            return {
                background: "#ffebee",
                border: "1px solid #ef5350"
            };

        }

        if (status === "Critical") {

            return {
                background: "#fff3e0",
                border: "1px solid #ff9800"
            };

        }

        if (status === "10-20 Days") {

            return {
                background: "#fffde7",
                border: "1px solid #fbc02d"
            };

        }

        return {
            background: "#e8f5e9",
            border: "1px solid #66bb6a"
        };

    };

    return (

        <div>

            {/* ================================= */}
            {/* HARDWARE ASSET CARDS */}
            {/* ================================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(3, 1fr)",
                    gap: "20px",
                    marginTop: "20px"
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
                                padding: "20px",
                                borderRadius: "10px",
                                boxShadow:
                                    "0 2px 5px rgba(0,0,0,0.15)",
                                textAlign: "center",
                                cursor: "pointer",
                                transition:
                                    "transform 0.2s, box-shadow 0.2s"
                            }}
                            onMouseEnter={(e) => {

                                e.currentTarget.style.transform =
                                    "translateY(-3px)";

                                e.currentTarget.style.boxShadow =
                                    "0 4px 10px rgba(0,0,0,0.2)";

                            }}
                            onMouseLeave={(e) => {

                                e.currentTarget.style.transform =
                                    "translateY(0)";

                                e.currentTarget.style.boxShadow =
                                    "0 2px 5px rgba(0,0,0,0.15)";

                            }}
                        >

                            <h3>
                                {card.title}
                            </h3>

                            <h1>
                                {card.value}
                            </h1>

                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "12px",
                                    color: "#555"
                                }}
                            >
                                Click to view
                            </p>

                        </div>

                    )
                )}

            </div>


            {/* ================================= */}
            {/* SOFTWARE SUMMARY */}
            {/* ================================= */}

            <div
                style={{
                    marginTop: "30px"
                }}
            >

                <h2
                    style={{
                        marginBottom: "15px"
                    }}
                >
                    Software License Summary
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(4, 1fr)",
                        gap: "15px"
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
                                    background:
                                        card.background,
                                    border:
                                        `1px solid ${card.border}`,
                                    padding: "20px",
                                    borderRadius: "10px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    transition:
                                        "transform 0.2s, box-shadow 0.2s"
                                }}
                                onMouseEnter={(e) => {

                                    e.currentTarget.style.transform =
                                        "translateY(-3px)";

                                    e.currentTarget.style.boxShadow =
                                        "0 4px 10px rgba(0,0,0,0.15)";

                                }}
                                onMouseLeave={(e) => {

                                    e.currentTarget.style.transform =
                                        "translateY(0)";

                                    e.currentTarget.style.boxShadow =
                                        "none";

                                }}
                            >

                                <h3
                                    style={{
                                        margin:
                                            "0 0 5px 0"
                                    }}
                                >
                                    {card.title}
                                </h3>

                                {card.subtitle && (

                                    <p
                                        style={{
                                            margin:
                                                "0 0 10px 0",
                                            fontSize: "13px"
                                        }}
                                    >
                                        {card.subtitle}
                                    </p>

                                )}

                                <h1
                                    style={{
                                        margin: 0
                                    }}
                                >
                                    {card.value}
                                </h1>

                                <p
                                    style={{
                                        marginTop: "10px",
                                        fontSize: "12px",
                                        color: "#555"
                                    }}
                                >
                                    Click to view
                                </p>

                            </div>

                        )
                    )}

                </div>

            </div>


            {/* ================================= */}
            {/* SOFTWARE EXPIRY ALERTS */}
            {/* ================================= */}

            <div
                style={{
                    marginTop: "30px",
                    background: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow:
                        "0 2px 5px rgba(0,0,0,0.15)"
                }}
            >

                <h2
                    style={{
                        textAlign: "center"
                    }}
                >
                    Software Expiry Alerts
                </h2>

                {expiryAlerts.length === 0 ? (

                    <p
                        style={{
                            textAlign: "center"
                        }}
                    >
                        No software expiry alerts.
                    </p>

                ) : (

                    <div>

                        {expiryAlerts.map(
                            (software) => {

                                const alertStyle =
                                    getAlertStyle(
                                        software.expiry_status
                                    );

                                return (

                                    <div
                                        key={
                                            software.software_id
                                        }
                                        style={{
                                            ...alertStyle,
                                            padding: "15px",
                                            borderRadius: "8px",
                                            marginBottom: "10px"
                                        }}
                                    >

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center"
                                            }}
                                        >

                                            <div>

                                                <strong>
                                                    {
                                                        software.software_name
                                                    }
                                                </strong>

                                                <div
                                                    style={{
                                                        marginTop:
                                                            "5px"
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
                                                    textAlign:
                                                        "right"
                                                }}
                                            >

                                                <strong>
                                                    {
                                                        software.expiry_status
                                                    }
                                                </strong>

                                                <div
                                                    style={{
                                                        marginTop:
                                                            "5px"
                                                    }}
                                                >
                                                    {
                                                        software.days_remaining
                                                    }{" "}
                                                    days remaining
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}

export default DashboardCards;