// Dashboard.jsx

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import RecentActivity from "../components/RecentActivity";

function Dashboard() {

    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f8fafc"
            }}
        >

            <Sidebar />

            <div
                style={{
                    flex: 1,
                    minWidth: 0
                }}
            >

                <Navbar />

                <main
                    style={{
                        padding: "30px",
                        boxSizing: "border-box",
                        width: "100%"
                    }}
                >

                    <div
                        style={{
                            marginBottom: "28px"
                        }}
                    >

                        <h1
                            style={{
                                margin: 0,
                                fontSize: "30px",
                                fontWeight: "700",
                                color: "#111827"
                            }}
                        >
                            Dashboard
                        </h1>

                        <p
                            style={{
                                margin: "6px 0 0",
                                color: "#64748b",
                                fontSize: "14px"
                            }}
                        >
                            Overview of your IT assets, software licenses and recent activities
                        </p>

                    </div>

                    <DashboardCards />

                    <RecentActivity />

                </main>

            </div>

        </div>

    );
}

export default Dashboard;