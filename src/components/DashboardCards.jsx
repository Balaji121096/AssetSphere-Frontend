import { useEffect, useState } from "react";
import API from "../api/axios";

function DashboardCards() {

    const [dashboard, setDashboard] = useState(null);
    const [expiryAlerts, setExpiryAlerts] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchDashboard = async () => {

        try {

            const response = await API.get("/dashboard");

            setDashboard(response.data.data);

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
                await API.get("/software/expiry-alerts");

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
            <p>
                Loading Dashboard...
            </p>
        );

    }


    // --------------------------------
    // Hardware Dashboard Cards
    // --------------------------------

    const hardwareCards = [

        {
            title: "Total Assets",
            value: dashboard.total_assets
        },

        {
            title: "Assigned",
            value: dashboard.assigned_assets
        },

        {
            title: "In Stock",
            value: dashboard.in_stock
        },

        {
            title: "Repair",
            value: dashboard.repair_assets
        },

        {
            title: "Scrap",
            value: dashboard.scrap_assets
        },

        {
            title: "Lost",
            value: dashboard.lost_assets
        }

    ];


    // --------------------------------
    // Software Expiry Summary Cards
    // --------------------------------

    const softwareCards = [

        {
            title: "Expired",
            value: dashboard.expired_software,
            background: "#ffebee",
            border: "#ef5350"
        },

        {
            title: "Critical",
            subtitle: "0-10 Days",
            value: dashboard.critical_software,
            background: "#fff3e0",
            border: "#ff9800"
        },

        {
            title: "10-20 Days",
            value: dashboard.ten_to_twenty_software,
            background: "#fffde7",
            border: "#fbc02d"
        },

        {
            title: "20-30 Days",
            value: dashboard.twenty_to_thirty_software,
            background: "#e8f5e9",
            border: "#66bb6a"
        }

    ];


    // --------------------------------
    // Expiry Alert Style
    // --------------------------------

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
                            style={{
                                background:
                                    "#ffffff",
                                padding:
                                    "20px",
                                borderRadius:
                                    "10px",
                                boxShadow:
                                    "0 2px 5px rgba(0,0,0,0.15)",
                                textAlign:
                                    "center"
                            }}
                        >

                            <h3>
                                {card.title}
                            </h3>

                            <h1>
                                {card.value}
                            </h1>

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
                                style={{
                                    background:
                                        card.background,
                                    border:
                                        `1px solid ${card.border}`,
                                    padding:
                                        "20px",
                                    borderRadius:
                                        "10px",
                                    textAlign:
                                        "center"
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
                                            fontSize:
                                                "13px"
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
                    background:
                        "#ffffff",
                    padding:
                        "20px",
                    borderRadius:
                        "10px",
                    boxShadow:
                        "0 2px 5px rgba(0,0,0,0.15)"
                }}
            >

                <h2
                    style={{
                        textAlign:
                            "center"
                    }}
                >
                    Software Expiry Alerts
                </h2>


                {expiryAlerts.length === 0 ? (

                    <p
                        style={{
                            textAlign:
                                "center"
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
                                            padding:
                                                "15px",
                                            borderRadius:
                                                "8px",
                                            marginBottom:
                                                "10px"
                                        }}
                                    >

                                        <div
                                            style={{
                                                display:
                                                    "flex",
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