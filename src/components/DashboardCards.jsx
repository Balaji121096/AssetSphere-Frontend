import { useEffect, useState } from "react";
import API from "../api/axios";

function DashboardCards() {

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

                console.error("Dashboard API Error:", error);

            }

        };

        fetchDashboard();

    }, []);

    if (!dashboard) {
        return <p>Loading Dashboard...</p>;
    }

    const cards = [
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

    return (

        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                marginTop: "20px"
            }}
        >

            {cards.map((card, index) => (

                <div
                    key={index}
                    style={{
                        background: "#ffffff",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
                    }}
                >

                    <h3>{card.title}</h3>

                    <h1>{card.value}</h1>

                </div>

            ))}

        </div>

    );

}

export default DashboardCards;