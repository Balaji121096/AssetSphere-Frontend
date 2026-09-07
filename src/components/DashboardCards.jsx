// DashboardCards.jsx

import {
    Package,
    Monitor,
    Users,
    AlertTriangle,
    ArrowUpRight
} from "lucide-react";

import { useNavigate } from "react-router-dom";


function DashboardCards({
    stats = {}
}) {

    const navigate = useNavigate();


    const {

        totalAssets = 0,
        assignedAssets = 0,
        inStock = 0,
        repairAssets = 0,

        totalSoftware = 0,
        activeSoftware = 0,
        expiringSoon = 0,

        totalEmployees = 0,
        activeEmployees = 0,
        onboardedEmployees = 0,

        expiryWarningCount = 0,
        criticalSoftware = 0,
        expiredSoftware = 0

    } = stats;


    return (

        <section style={cardsGridStyle}>


            {/* =====================================================
                TOTAL ASSETS INVENTORY
            ===================================================== */}

            <DashboardCard
                icon={
                    <Package size={20} />
                }
                iconBackground="#dbeafe"
                iconColor="#2563eb"
                title="Total Assets Inventory"
                total={totalAssets}
                lines={[
                    `${inStock} In Stock`,
                    `${assignedAssets} Assigned`,
                    `${repairAssets} Repair`
                ]}
                footer="View Hardware List"
                onClick={() =>
                    navigate("/assets")
                }
                cardBackground="#eff6ff"
                borderColor="#bfdbfe"
            />


            {/* =====================================================
                SOFTWARE LICENSES
            ===================================================== */}

            <DashboardCard
                icon={
                    <Monitor size={20} />
                }
                iconBackground="#ccfbf1"
                iconColor="#0f766e"
                title="Software Licenses"
                total={totalSoftware}
                lines={[
                    `${activeSoftware} Active`,
                    `${expiringSoon} Expiring Soon`
                ]}
                footer="View Software List"
                onClick={() =>
                    navigate("/software")
                }
                cardBackground="#f0fdfa"
                borderColor="#99f6e4"
            />


            {/* =====================================================
                EMPLOYEE DIRECTORY
            ===================================================== */}

            <DashboardCard
                icon={
                    <Users size={20} />
                }
                iconBackground="#f3e8ff"
                iconColor="#9333ea"
                title="Employee Directory"
                total={totalEmployees}
                lines={[
                    `${activeEmployees} Active Employees`,
                    `${onboardedEmployees} Employee Onboarded`
                ]}
                footer="View Employees"
                onClick={() =>
                    navigate("/employees")
                }
                cardBackground="#faf5ff"
                borderColor="#e9d5ff"
            />


            {/* =====================================================
                EXPIRY WARNINGS
            ===================================================== */}

            <DashboardCard
                icon={
                    <AlertTriangle size={20} />
                }
                iconBackground="#fee2e2"
                iconColor="#dc2626"
                title="Expiry Warnings (<45 Days)"
                total={expiryWarningCount}
                lines={[
                    `${criticalSoftware} Critical`,
                    `${expiredSoftware} Expired`
                ]}
                footer="View Expiring Licenses"
                onClick={() =>
                    navigate("/software")
                }
                cardBackground="#fff1f2"
                borderColor="#fecdd3"
            />

        </section>

    );

}


/* ============================================================
   DASHBOARD CARD
============================================================ */

function DashboardCard({
    icon,
    iconBackground,
    iconColor,
    title,
    total,
    lines,
    footer,
    onClick,
    cardBackground,
    borderColor
}) {

    return (

        <button
            type="button"
            onClick={onClick}
            className="dashboard-summary-card"
            style={{
                ...dashboardCardStyle,
                background: cardBackground,
                borderColor
            }}
        >

            <div style={cardTopStyle}>

                <div
                    style={{
                        ...cardIconStyle,
                        background: iconBackground,
                        color: iconColor
                    }}
                >
                    {icon}
                </div>

                <ArrowUpRight
                    size={16}
                    style={{
                        color: "#64748b"
                    }}
                />

            </div>


            <div style={cardTitleStyle}>
                {title}
            </div>


            <div style={cardTotalStyle}>
                {total}
            </div>


            <div style={cardLinesStyle}>

                {lines.map(
                    (line, index) => (

                        <span
                            key={index}
                            style={cardLineStyle}
                        >
                            {line}
                        </span>

                    )
                )}

            </div>


            <div style={cardFooterStyle}>

                {footer}

                <ArrowUpRight size={13} />

            </div>

        </button>

    );

}


/* ============================================================
   STYLES
============================================================ */

const cardsGridStyle = {

    width: "100%",

    display: "grid",

    gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",

    gap: "12px",

    marginBottom: "18px"

};


const dashboardCardStyle = {

    minWidth: 0,

    minHeight: "165px",

    padding: "15px",

    border: "1px solid",

    borderRadius: "12px",

    textAlign: "left",

    cursor: "pointer",

    boxSizing: "border-box",

    transition:
        "transform 0.15s ease, box-shadow 0.15s ease",

    boxShadow:
        "0 2px 7px rgba(15,23,42,0.04)"

};


const cardTopStyle = {

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: "12px"

};


const cardIconStyle = {

    width: "33px",

    height: "33px",

    borderRadius: "8px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center"

};


const cardTitleStyle = {

    color:
        "var(--app-muted, #475569)",

    fontSize: "9px",

    fontWeight: 800,

    textTransform: "uppercase",

    letterSpacing: "0.35px"

};


const cardTotalStyle = {

    marginTop: "5px",

    color:
        "var(--app-text, #0f172a)",

    fontSize: "26px",

    lineHeight: 1,

    fontWeight: 800

};


const cardLinesStyle = {

    display: "flex",

    flexDirection: "column",

    gap: "4px",

    marginTop: "9px"

};


const cardLineStyle = {

    color:
        "var(--app-muted, #64748b)",

    fontSize: "9px",

    lineHeight: 1.35

};


const cardFooterStyle = {

    display: "flex",

    alignItems: "center",

    gap: "4px",

    marginTop: "11px",

    color: "#2563eb",

    fontSize: "9px",

    fontWeight: 800

};


/* ============================================================
   EXPORT
============================================================ */

export default DashboardCards;