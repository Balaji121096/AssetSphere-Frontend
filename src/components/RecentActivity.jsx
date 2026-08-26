// RecentActivity.jsx

import { useEffect, useState } from "react";
import API from "../api/axios";

function RecentActivity() {

    const [history, setHistory] = useState([]);

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const response =
                    await API.get(
                        "/dashboard/recent-history",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setHistory(
                    response.data.data || []
                );

            } catch (error) {

                console.error(
                    "Recent History API Error:",
                    error
                );

            }

        };

        fetchHistory();

    }, []);


    return (

        <section
            style={{
                marginTop: "30px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "22px"
            }}
        >

            <div
                style={{
                    marginBottom: "18px"
                }}
            >

                <h2
                    style={{
                        margin: 0,
                        fontSize: "19px",
                        color: "#111827"
                    }}
                >
                    Recent Activity
                </h2>

                <p
                    style={{
                        margin: "4px 0 0",
                        color: "#64748b",
                        fontSize: "13px"
                    }}
                >
                    Latest asset management activities
                </p>

            </div>


            {history.length === 0 ? (

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
                    No recent activity found.
                </div>

            ) : (

                <div>

                    {history.map(
                        (item, index) => (

                            <div
                                key={
                                    item.history_id
                                }
                                style={{
                                    display: "flex",
                                    gap: "14px",
                                    padding:
                                        "16px 4px",
                                    borderBottom:
                                        index === history.length - 1
                                            ? "none"
                                            : "1px solid #f1f5f9"
                                }}
                            >

                                {/* ICON */}

                                <div
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        flexShrink: 0,
                                        borderRadius:
                                            "50%",
                                        background:
                                            "#eff6ff",
                                        color:
                                            "#2563eb",
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        fontSize:
                                            "15px",
                                        fontWeight:
                                            "700"
                                    }}
                                >
                                    ✓
                                </div>


                                {/* CONTENT */}

                                <div
                                    style={{
                                        flex: 1,
                                        minWidth: 0
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                            gap: "10px"
                                        }}
                                    >

                                        <strong
                                            style={{
                                                color:
                                                    "#111827",
                                                fontSize:
                                                    "14px"
                                            }}
                                        >
                                            {
                                                item.action_type
                                            }
                                        </strong>

                                    </div>


                                    <p
                                        style={{
                                            margin:
                                                "5px 0",
                                            color:
                                                "#334155",
                                            fontSize:
                                                "13px"
                                        }}
                                    >
                                        {
                                            item.asset_code
                                        }{" "}
                                        -{" "}
                                        {
                                            item.asset_name
                                        }
                                    </p>


                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            flexWrap:
                                                "wrap",
                                            gap: "12px",
                                            color:
                                                "#64748b",
                                            fontSize:
                                                "12px"
                                        }}
                                    >

                                        <span>
                                            {item.employee_name
                                                ? `Employee: ${item.employee_name}`
                                                : "No employee assigned"}
                                        </span>

                                        {item.remarks && (

                                            <span>
                                                {item.remarks}
                                            </span>

                                        )}

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </section>

    );

}

export default RecentActivity;