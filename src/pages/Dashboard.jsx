import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import RecentActivity from "../components/RecentActivity";

function Dashboard() {

    return (

        <div
            style={{
                display: "flex",
                background: "#f5f5f5"
            }}
        >

            <Sidebar />

            <div
                style={{
                    flex: 1
                }}
            >

                <Navbar />

                <div
                    style={{
                        padding: "20px"
                    }}
                >

                    <DashboardCards />
                    
                    <RecentActivity />

                </div>

            </div>

        </div>

    );

}

export default Dashboard;