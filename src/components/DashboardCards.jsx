import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function DashboardCards() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await API.get("/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setDashboard(response.data.data);

            } catch (error) {

                console.error(
                    "Dashboard API Error:",
                    error
                );

            }

        };

        fetchDashboard();

    }, []);


    if (!dashboard) {
        return <p>Loading Dashboard...</p>;
    }


    const assetCards = [
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


    const expiryCards = [
        {
            title: "Expired",
            value: dashboard.expired_software,
            symbol: "⚫"
        },
        {
            title: "0–10 Days",
            value: dashboard.critical_software,
            symbol: "🔴"
        },
        {
            title: "11–20 Days",
            value: dashboard.ten_to_twenty_software,
            symbol: "🟠"
        },
        {
            title: "21–30 Days",
            value: dashboard.twenty_to_thirty_software,
            symbol: "🟡"
        }
    ];


    return (

        <div>

            {/* =========================
                HARDWARE ASSET CARDS
            ========================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(3, 1fr)",
                    gap: "20px",
                    marginTop: "20px"
                }}
            >

                {assetCards.map(
                    (card, index) => (

                        <div
                            key={index}
                            style={{
                                background: "#ffffff",
                                padding: "20px",
                                borderRadius: "10px",
                                boxShadow:
                                    "0 2px 5px rgba(0,0,0,0.15)"
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


            {/* =========================
                SOFTWARE EXPIRY ALERTS
            ========================= */}

            <div
                style={{
                    marginTop: "35px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center"
                    }}
                >

                    <div>

                        <h2
                            style={{
                                marginBottom: "5px"
                            }}
                        >
                            Software Expiry Alerts
                        </h2>

                        <p
                            style={{
                                marginTop: 0,
                                color: "#666"
                            }}
                        >
                            Software licenses
                            requiring attention
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate("/software")
                        }
                    >
                        View Software
                    </button>

                </div>


                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(4, 1fr)",
                        gap: "20px",
                        marginTop: "15px"
                    }}
                >

                    {expiryCards.map(
                        (card, index) => (

                            <div
                                key={index}
                                onClick={() =>
                                    navigate(
                                        "/software"
                                    )
                                }
                                style={{
                                    background:
                                        "#ffffff",
                                    padding: "20px",
                                    borderRadius:
                                        "10px",
                                    boxShadow:
                                        "0 2px 5px rgba(0,0,0,0.15)",
                                    cursor:
                                        "pointer"
                                }}
                            >

                                <h3>
                                    {card.symbol}{" "}
                                    {card.title}
                                </h3>

                                <h1
                                    style={{
                                        marginBottom:
                                            "5px"
                                    }}
                                >
                                    {card.value}
                                </h1>

                                <span
                                    style={{
                                        color: "#666"
                                    }}
                                >
                                    Software licenses
                                </span>

                            </div>

                        )
                    )}

                </div>

            </div>

        </div>

    );

}

export default DashboardCards;