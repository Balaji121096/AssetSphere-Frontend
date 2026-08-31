// Dashboard.jsx

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import RecentActivity from "../components/RecentActivity";

function Dashboard() {

    return (

        <div style={pageStyle}>

            <Sidebar />

            <div style={mainStyle}>

                <Navbar />

                <main style={contentStyle}>

                    {/* =====================================
                        DASHBOARD HERO
                    ===================================== */}

                    <div style={heroStyle}>

                        <div style={heroContentStyle}>

                            <div style={heroEyebrowStyle}>
                                IT ASSET MANAGEMENT
                            </div>

                            <h1 style={heroTitleStyle}>
                                Dashboard
                            </h1>

                            <p style={heroSubtitleStyle}>
                                Overview of your IT assets, software licenses and recent activities
                            </p>

                        </div>


                        {/* =================================
                            RIGHT SIDE ACTION
                        ================================= */}

                        <button
                            type="button"
                            style={heroButtonStyle}
                            onClick={() =>
                                window.location.reload()
                            }
                        >

                            <span style={heroButtonIconStyle}>
                                ↻
                            </span>

                            Refresh Dashboard

                        </button>

                    </div>


                    {/* =====================================
                        DASHBOARD CARDS
                    ===================================== */}

                    <div style={sectionStyle}>

                        <DashboardCards />

                    </div>


                    {/* =====================================
                        RECENT ACTIVITY
                    ===================================== */}

                    <div style={sectionStyle}>

                        <RecentActivity />

                    </div>

                </main>

            </div>

        </div>

    );

}


// =====================================================
// PAGE
// =====================================================

const pageStyle = {

    display: "flex",

    minHeight: "100vh",

    background: "var(--app-background)",

    color: "var(--text-color)"

};


const mainStyle = {

    flex: 1,

    minWidth: 0

};


const contentStyle = {

    width: "100%",

    maxWidth: "1500px",

    margin: "0 auto",

    padding: "30px",

    boxSizing: "border-box"

};


// =====================================================
// HERO
// =====================================================

const heroStyle = {

    width: "100%",

    minHeight: "170px",

    padding: "30px 32px",

    boxSizing: "border-box",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "25px",

    flexWrap: "wrap",

    marginBottom: "25px",

    borderRadius: "18px",

    background:
        "linear-gradient(135deg, var(--sidebar-color) 0%, var(--sidebar-color) 45%, var(--primary-color) 100%)",

    boxShadow:
        "0 10px 30px rgba(15,23,42,0.16)",

    position: "relative",

    overflow: "hidden"

};


// =====================================================
// HERO CONTENT
// =====================================================

const heroContentStyle = {

    position: "relative",

    zIndex: 1

};


const heroEyebrowStyle = {

    color: "#93c5fd",

    fontSize: "10px",

    fontWeight: "700",

    letterSpacing: "1.7px",

    marginBottom: "8px",

    textTransform: "uppercase"

};


const heroTitleStyle = {

    margin: 0,

    color: "#ffffff",

    fontSize: "32px",

    fontWeight: "750",

    letterSpacing: "-0.8px",

    lineHeight: "1.2"

};


const heroSubtitleStyle = {

    margin: "9px 0 0",

    color: "#cbd5e1",

    fontSize: "13px",

    lineHeight: "1.6",

    maxWidth: "650px"

};


// =====================================================
// HERO BUTTON
// =====================================================

const heroButtonStyle = {

    position: "relative",

    zIndex: 1,

    height: "42px",

    padding: "0 17px",

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "7px",

    border: "1px solid rgba(255,255,255,0.25)",

    borderRadius: "9px",

    background: "rgba(255,255,255,0.12)",

    color: "#ffffff",

    fontSize: "13px",

    fontWeight: "600",

    cursor: "pointer",

    backdropFilter: "blur(8px)",

    WebkitBackdropFilter: "blur(8px)",

    boxShadow:
        "0 4px 12px rgba(0,0,0,0.12)"

};


const heroButtonIconStyle = {

    fontSize: "17px",

    lineHeight: 1

};


// =====================================================
// SECTIONS
// =====================================================

const sectionStyle = {

    width: "100%",

    marginBottom: "22px"

};


export default Dashboard;