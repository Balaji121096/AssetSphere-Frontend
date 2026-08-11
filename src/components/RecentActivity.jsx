import { useEffect, useState } from "react";
import API from "../api/axios";

function RecentActivity() {

    const [history, setHistory] = useState([]);

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await API.get(
                    "/dashboard/recent-history",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setHistory(response.data.data);

            } catch (error) {

                console.error("Recent History API Error:", error);

            }

        };

        fetchHistory();

    }, []);

    return (

        <div
            style={{
                background: "#ffffff",
                padding: "20px",
                marginTop: "25px",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
            }}
        >

            <h2>Recent Activity</h2>

            {history.length === 0 ? (

                <p>No recent activity found.</p>

            ) : (

                history.map((item) => (

                    <div
                        key={item.history_id}
                        style={{
                            padding: "15px 0",
                            borderBottom: "1px solid #eee"
                        }}
                    >

                        <strong>
                            {item.action_type}
                        </strong>

                        <p style={{ margin: "5px 0" }}>
                            {item.asset_code} - {item.asset_name}
                        </p>

                        <small>
                            {item.employee_name
                                ? `Employee: ${item.employee_name}`
                                : "No employee assigned"}
                        </small>

                        <br />

                        <small>
                            {item.remarks}
                        </small>

                    </div>

                ))

            )}

        </div>

    );

}

export default RecentActivity;