// Dashboard.jsx - SIMPLIFIED VERSION
// No need to pass userFullName and currentPage props to Navbar anymore
// Navbar reads everything from localStorage and useLocation

import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecentActivity from "../components/RecentActivity";
import API from "../api/axios";

import {
    Package,
    Monitor,
    Users,
    AlertTriangle,
    ArrowUpRight,
    RefreshCw
} from "lucide-react";


/* ============================================================
   DASHBOARD
============================================================ */

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({});
    const [softwareList, setSoftwareList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [assetList, setAssetList] = useState([]);
    const [purchaseList, setPurchaseList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    /*
     * Used to force the dashboard to re-render when the
     * theme changes.
     */
    const [, setThemeVersion] = useState(0);


    /* ============================================================
       LISTEN FOR THEME CHANGES
    ============================================================ */

    useEffect(() => {

        const handleThemeChange = () => {

            setThemeVersion(
                (value) => value + 1
            );

        };


        window.addEventListener(
            "assetsphere-theme-change",
            handleThemeChange
        );


        window.addEventListener(
            "storage",
            handleThemeChange
        );


        return () => {

            window.removeEventListener(
                "assetsphere-theme-change",
                handleThemeChange
            );

            window.removeEventListener(
                "storage",
                handleThemeChange
            );

        };

    }, []);


    /* ============================================================
       GENERIC API DATA EXTRACTOR
    ============================================================ */

    const extractArray = useCallback((response) => {

        const data = response?.data;


        if (Array.isArray(data)) {
            return data;
        }


        if (Array.isArray(data?.data)) {
            return data.data;
        }


        if (Array.isArray(data?.rows)) {
            return data.rows;
        }


        if (Array.isArray(data?.results)) {
            return data.results;
        }


        return [];

    }, []);


    /* ============================================================
       FETCH DASHBOARD
    ============================================================ */

    const fetchDashboard = useCallback(async () => {

        const response =
            await API.get("/dashboard");


        const data =
            response?.data?.data ||
            response?.data ||
            {};


        if (
            data &&
            typeof data === "object" &&
            !Array.isArray(data)
        ) {

            setDashboard({
                ...data
            });

        } else {

            setDashboard({});

        }

    }, []);


    /* ============================================================
       FETCH SOFTWARE
    ============================================================ */

    const fetchSoftware = useCallback(async () => {

        const response =
            await API.get("/software");


        const list =
            extractArray(response);


        setSoftwareList([
            ...list
        ]);

    }, [extractArray]);


    /* ============================================================
       FETCH EMPLOYEES
    ============================================================ */

    const fetchEmployees = useCallback(async () => {

        const response =
            await API.get("/employees");


        const list =
            extractArray(response);


        setEmployeeList([
            ...list
        ]);

    }, [extractArray]);


    /* ============================================================
       FETCH ASSETS
    ============================================================ */

    const fetchAssets = useCallback(async () => {

        const response =
            await API.get("/assets");


        const list =
            extractArray(response);


        setAssetList([
            ...list
        ]);

    }, [extractArray]);


    /* ============================================================
       FETCH PURCHASES
    ============================================================ */

    const fetchPurchases = useCallback(async () => {

        const response =
            await API.get("/purchases");


        const list =
            extractArray(response);


        setPurchaseList([
            ...list
        ]);

    }, [extractArray]);


    /* ============================================================
       FETCH ALL DASHBOARD DATA
    ============================================================ */

    const loadDashboard = useCallback(
        async (isRefresh = false) => {

            /*
             * Prevent multiple refresh clicks from creating
             * multiple simultaneous API requests.
             */
            if (isRefresh && refreshing) {
                return;
            }


            try {

                if (isRefresh) {

                    setRefreshing(true);

                } else {

                    setLoading(true);

                }


                setError("");


                /*
                 * Force every API to execute again.
                 *
                 * This refreshes:
                 * - Dashboard
                 * - Software
                 * - Employees
                 * - Assets
                 * - Purchases
                 */
                await Promise.all([
                    fetchDashboard(),
                    fetchSoftware(),
                    fetchEmployees(),
                    fetchAssets(),
                    fetchPurchases()
                ]);


            } catch (error) {

                console.error(
                    "Dashboard Load Error:",
                    error
                );


                setError(
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.message ||
                    "Unable to load dashboard data."
                );


            } finally {

                /*
                 * Always stop both loading states.
                 */
                setLoading(false);
                setRefreshing(false);

            }

        },
        [
            refreshing,
            fetchDashboard,
            fetchSoftware,
            fetchEmployees,
            fetchAssets,
            fetchPurchases
        ]
    );


    /* ============================================================
       INITIAL LOAD
    ============================================================ */

    useEffect(() => {

        loadDashboard();

    }, [loadDashboard]);


    /* ============================================================
       DASHBOARD COUNTS
    ============================================================ */

    const stats = useMemo(() => {

        const data = dashboard || {};


        /* --------------------------------------------------------
           ASSETS
        -------------------------------------------------------- */

        const backendTotalAssets =
            Number(
                data.total_assets ??
                data.total_asset_inventory ??
                data.asset_count ??
                0
            );


        const backendAssignedAssets =
            Number(
                data.assigned_assets ??
                data.assigned ??
                0
            );


        const backendInStock =
            Number(
                data.in_stock ??
                data.in_stock_assets ??
                0
            );


        const backendRepair =
            Number(
                data.repair_assets ??
                data.repair ??
                0
            );


        const assetStatuses =
            assetList.map((asset) =>
                String(
                    asset?.asset_status ??
                    asset?.status ??
                    ""
                )
                    .toLowerCase()
                    .trim()
            );


        const calculatedTotalAssets =
            assetList.length;


        const calculatedAssigned =
            assetStatuses.filter(
                (status) =>
                    status === "assigned"
            ).length;


        const calculatedInStock =
            assetStatuses.filter(
                (status) =>
                    status === "in stock" ||
                    status === "instock" ||
                    status === "available"
            ).length;


        const calculatedRepair =
            assetStatuses.filter(
                (status) =>
                    status === "repair" ||
                    status === "under repair"
            ).length;


        const totalAssets =
            calculatedTotalAssets > 0
                ? calculatedTotalAssets
                : backendTotalAssets;


        const assignedAssets =
            calculatedTotalAssets > 0
                ? calculatedAssigned
                : backendAssignedAssets;


        const inStock =
            calculatedTotalAssets > 0
                ? calculatedInStock
                : backendInStock;


        const repairAssets =
            calculatedTotalAssets > 0
                ? calculatedRepair
                : backendRepair;


        /* --------------------------------------------------------
           SOFTWARE
        -------------------------------------------------------- */

        const backendTotalSoftware =
            Number(
                data.total_software ??
                data.software_count ??
                data.software ??
                0
            );


        const calculatedTotalSoftware =
            softwareList.length;


        const calculatedActiveSoftware =
            softwareList.filter(
                (software) => {

                    const status =
                        String(
                            software?.status ??
                            software?.license_status ??
                            software?.software_status ??
                            ""
                        )
                            .toLowerCase()
                            .trim();


                    return (
                        status === "active" ||
                        status === "available" ||
                        status === "valid"
                    );

                }
            ).length;


        const totalSoftware =
            calculatedTotalSoftware > 0
                ? calculatedTotalSoftware
                : backendTotalSoftware;


        const activeSoftware =
            calculatedTotalSoftware > 0
                ? calculatedActiveSoftware
                : Number(
                    data.active_software ??
                    data.active_licenses ??
                    0
                );


        /* --------------------------------------------------------
           SOFTWARE EXPIRY
        -------------------------------------------------------- */

        const today =
            new Date();


        const expiryInfo =
            softwareList.reduce(
                (result, software) => {

                    const expiryValue =
                        software?.license_expiry_date ??
                        software?.expiry_date ??
                        software?.expiryDate ??
                        software?.end_date ??
                        software?.expiry;


                    if (!expiryValue) {
                        return result;
                    }


                    const expiryDate =
                        new Date(expiryValue);


                    if (
                        Number.isNaN(
                            expiryDate.getTime()
                        )
                    ) {

                        return result;

                    }


                    const difference =
                        expiryDate.getTime() -
                        today.getTime();


                    const days =
                        Math.ceil(
                            difference /
                            (1000 * 60 * 60 * 24)
                        );


                    if (days < 0) {

                        result.expired += 1;

                    } else if (days < 15) {

                        result.critical += 1;

                    } else if (days <= 45) {

                        result.expiringSoon += 1;

                    }


                    return result;

                },
                {
                    critical: 0,
                    expired: 0,
                    expiringSoon: 0
                }
            );


        const backendCritical =
            Number(
                data.critical_software ??
                data.critical ??
                0
            );


        const backendExpired =
            Number(
                data.expired_software ??
                data.expired ??
                0
            );


        const backendExpiringSoon =
            Number(
                data.expiring_soon ??
                data.expiring_software ??
                data.expiring_licenses ??
                0
            );


        const criticalSoftware =
            calculatedTotalSoftware > 0
                ? expiryInfo.critical
                : backendCritical;


        const expiredSoftware =
            calculatedTotalSoftware > 0
                ? expiryInfo.expired
                : backendExpired;


        const expiringSoon =
            calculatedTotalSoftware > 0
                ? expiryInfo.expiringSoon
                : backendExpiringSoon;


        const expiryWarningCount =
            calculatedTotalSoftware > 0
                ? (
                    criticalSoftware +
                    expiringSoon
                )
                : Number(
                    data.expiry_warnings ??
                    data.expiry_warning_count ??
                    backendExpiringSoon
                );


        /* --------------------------------------------------------
           EMPLOYEES
        -------------------------------------------------------- */

        const backendEmployees =
            Number(
                data.total_employees ??
                data.employee_count ??
                data.employees ??
                0
            );


        const calculatedEmployees =
            employeeList.length;


        const activeEmployeesCalculated =
            employeeList.filter(
                (employee) => {

                    const status =
                        String(
                            employee?.status ??
                            employee?.employee_status ??
                            ""
                        )
                            .toLowerCase()
                            .trim();


                    return (
                        status === "active" ||
                        status === "onboarded"
                    );

                }
            ).length;


        const totalEmployees =
            calculatedEmployees > 0
                ? calculatedEmployees
                : backendEmployees;


        const activeEmployees =
            calculatedEmployees > 0
                ? activeEmployeesCalculated
                : Number(
                    data.active_employees ??
                    data.active_employee_count ??
                    0
                );


        const onboardedEmployees =
            calculatedEmployees > 0
                ? activeEmployeesCalculated
                : Number(
                    data.onboarded_employees ??
                    data.new_employees ??
                    data.recently_onboarded ??
                    0
                );


        /* --------------------------------------------------------
           PURCHASES
        -------------------------------------------------------- */

        const totalPurchases =
            purchaseList.length > 0
                ? purchaseList.length
                : Number(
                    data.total_purchases ??
                    data.purchase_count ??
                    data.purchases ??
                    0
                );


        const calculatedPurchaseValue =
            purchaseList.reduce(
                (total, purchase) => {

                    const amount =
                        Number(
                            purchase?.total_amount ??
                            purchase?.purchase_amount ??
                            purchase?.amount ??
                            purchase?.total ??
                            0
                        );


                    return total + amount;

                },
                0
            );


        const purchaseValue =
            purchaseList.length > 0
                ? calculatedPurchaseValue
                : Number(
                    data.total_purchase_value ??
                    data.purchase_value ??
                    data.purchase_amount ??
                    0
                );


        return {

            totalAssets,
            assignedAssets,
            inStock,
            repairAssets,

            totalSoftware,
            activeSoftware,

            expiringSoon,
            criticalSoftware,
            expiredSoftware,
            expiryWarningCount,

            totalEmployees,
            activeEmployees,
            onboardedEmployees,

            totalPurchases,
            purchaseValue

        };

    }, [
        dashboard,
        softwareList,
        employeeList,
        assetList,
        purchaseList
    ]);


    /* ============================================================
       CURRENCY
    ============================================================ */

    const formatCurrency = (value) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2
            }
        ).format(
            Number(value || 0)
        );

    };


    /* ============================================================
       REFRESH
    ============================================================ */

    const handleRefresh = async () => {

        if (refreshing) {
            return;
        }


        await loadDashboard(true);

    };


    /* ============================================================
       LOADING
    ============================================================ */

    if (loading) {

        return (

            <div style={pageStyle}>

                <div style={sidebarWrapperStyle}>
                    <Sidebar />
                </div>


                <div style={mainStyle}>

                    <Navbar />


                    <main style={contentStyle}>

                        <div style={loadingStyle}>
                            Loading Dashboard...
                        </div>

                    </main>

                </div>

            </div>

        );

    }


    /* ============================================================
       UI
    ============================================================ */

    return (

        <div style={pageStyle}>

            <div style={sidebarWrapperStyle}>
                <Sidebar />
            </div>


            <div style={mainStyle}>

                <Navbar />


                <main style={contentStyle}>

                    {/* =================================================
                        HERO
                    ================================================= */}

                    <section style={heroStyle}>

                        <div style={heroContentStyle}>

                            <div style={heroEyebrowStyle}>
                                URCTS PVT LTD · LIVE SYSTEM COMMAND CENTER
                            </div>


                            <h1 style={heroTitleStyle}>
                                IT Asset & Software Lifecycle Overview
                            </h1>


                            <p style={heroSubtitleStyle}>
                                Real-time tracking of hardware inventory,
                                software license expiration timelines,
                                employee allocation, vendor purchases,
                                and audit trail insights.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            aria-label="Refresh Dashboard"
                            style={{
                                ...refreshButtonStyle,

                                opacity:
                                    refreshing
                                        ? 0.7
                                        : 1,

                                cursor:
                                    refreshing
                                        ? "not-allowed"
                                        : "pointer"
                            }}
                        >

                            <RefreshCw
                                size={15}
                                style={{
                                    animation:
                                        refreshing
                                            ? "dashboard-spin 1s linear infinite"
                                            : "none"
                                }}
                            />


                            {refreshing
                                ? "Refreshing..."
                                : "Refresh Dashboard"}

                        </button>

                    </section>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div style={errorStyle}>

                            <span>
                                {error}
                            </span>


                            <button
                                type="button"
                                onClick={() =>
                                    loadDashboard()
                                }
                                style={retryButtonStyle}
                            >
                                Retry
                            </button>

                        </div>

                    )}


                    {/* =================================================
                        MAIN SUMMARY CARDS
                    ================================================= */}

                    <section style={cardsGridStyle}>

                        <DashboardCard
                            icon={
                                <Package size={20} />
                            }
                            iconBackground="var(--primary-soft)"
                            iconColor="var(--primary-color)"
                            title="Total Assets Inventory"
                            total={stats.totalAssets}
                            lines={[
                                stats.inStock + " In Stock",
                                stats.assignedAssets + " Assigned",
                                stats.repairAssets + " Repair"
                            ]}
                            footer="View Hardware List"
                            onClick={() =>
                                navigate("/assets")
                            }
                        />


                        <DashboardCard
                            icon={
                                <Monitor size={20} />
                            }
                            iconBackground="var(--primary-soft)"
                            iconColor="var(--primary-color)"
                            title="Software Licenses"
                            total={stats.totalSoftware}
                            lines={[
                                stats.activeSoftware + " Active",
                                stats.expiringSoon + " Expiring Soon"
                            ]}
                            footer="View Software List"
                            onClick={() =>
                                navigate("/software")
                            }
                        />


                        <DashboardCard
                            icon={
                                <Users size={20} />
                            }
                            iconBackground="var(--primary-soft)"
                            iconColor="var(--primary-color)"
                            title="Employee Directory"
                            total={stats.totalEmployees}
                            lines={[
                                stats.activeEmployees + " Active Employees",
                                stats.onboardedEmployees + " Employee Onboarded"
                            ]}
                            footer="View Employees"
                            onClick={() =>
                                navigate("/employees")
                            }
                        />


                        <DashboardCard
                            icon={
                                <AlertTriangle size={20} />
                            }
                            iconBackground="var(--danger-soft)"
                            iconColor="var(--danger-color)"
                            title="Expiry Warnings (<45 Days)"
                            total={stats.expiryWarningCount}
                            lines={[
                                stats.criticalSoftware + " Critical",
                                stats.expiredSoftware + " Expired"
                            ]}
                            footer="View Expiring Licenses"
                            onClick={() =>
                                navigate("/software")
                            }
                            danger
                        />

                    </section>


                    {/* =================================================
                        QUICK NAVIGATION
                    ================================================= */}

                    <section style={quickSectionStyle}>

                        <div style={sectionHeaderStyle}>

                            <div>

                                <h2 style={sectionTitleStyle}>
                                    Quick Filter Navigation
                                </h2>


                                <p style={sectionSubtitleStyle}>
                                    Click any metric to inspect the
                                    corresponding records.
                                </p>

                            </div>

                        </div>


                        <div
                            className="dashboard-quick-grid"
                            style={quickGridStyle}
                        >

                            <QuickMetric
                                title="In Stock Assets"
                                value={stats.inStock}
                                description="Assets currently available"
                                onClick={() =>
                                    navigate(
                                        "/assets?status=In%20Stock"
                                    )
                                }
                            />


                            <QuickMetric
                                title="Assets in Repair"
                                value={stats.repairAssets}
                                description="Assets under repair"
                                onClick={() =>
                                    navigate(
                                        "/assets?status=Repair"
                                    )
                                }
                            />


                            <QuickMetric
                                title="Critical Expiry"
                                value={stats.criticalSoftware}
                                description="Less than 15 days"
                                onClick={() =>
                                    navigate("/software")
                                }
                            />


                            <QuickMetric
                                title="Expired Licenses"
                                value={stats.expiredSoftware}
                                description="Requires immediate action"
                                onClick={() =>
                                    navigate("/software")
                                }
                            />


                            <QuickMetric
                                title="Total Purchases"
                                value={stats.totalPurchases}
                                description="Purchase records"
                                onClick={() =>
                                    navigate("/purchases")
                                }
                            />


                            <QuickMetric
                                title="Total Purchase Value"
                                value={
                                    formatCurrency(
                                        stats.purchaseValue
                                    )
                                }
                                description="Purchase value"
                                onClick={() =>
                                    navigate("/purchases")
                                }
                            />

                        </div>

                    </section>


                    {/* =================================================
                        RECENT ACTIVITY
                    ================================================= */}

                    <section style={activitySectionStyle}>

                        <RecentActivity />

                    </section>

                </main>

            </div>

        </div>

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
    danger = false
}) {

    return (

        <button
            type="button"
            onClick={onClick}
            className="dashboard-summary-card"
            style={{
                ...dashboardCardStyle,

                background:
                    danger
                        ? "var(--danger-soft)"
                        : "var(--app-card)",

                borderColor:
                    danger
                        ? "var(--danger-border)"
                        : "var(--app-border)"
            }}
        >

            <div style={cardTopStyle}>

                <div
                    style={{
                        ...cardIconStyle,
                        background:
                            iconBackground,
                        color:
                            iconColor
                    }}
                >
                    {icon}
                </div>


                <ArrowUpRight
                    size={16}
                    style={{
                        color:
                            "var(--app-muted)"
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


            <div
                style={{
                    ...cardFooterStyle,

                    color:
                        danger
                            ? "var(--danger-color)"
                            : "var(--primary-color)"
                }}
            >

                {footer}

                <ArrowUpRight size={13} />

            </div>

        </button>

    );

}


/* ============================================================
   QUICK METRIC
============================================================ */

function QuickMetric({
    title,
    value,
    description,
    onClick
}) {

    return (

        <button
            type="button"
            onClick={onClick}
            className="dashboard-quick-metric"
            style={quickMetricStyle}
        >

            <div style={quickMetricTitleStyle}>
                {title}
            </div>


            <div style={quickMetricValueStyle}>
                {value}
            </div>


            <div style={quickMetricDescriptionStyle}>
                {description}
            </div>

        </button>

    );

}


/* ============================================================
   THEME-AWARE CSS VARIABLES
============================================================ */

if (
    typeof document !== "undefined" &&
    !document.getElementById(
        "assetsphere-dashboard-theme-vars"
    )
) {

    const themeStyle =
        document.createElement("style");


    themeStyle.id =
        "assetsphere-dashboard-theme-vars";


    themeStyle.innerHTML = `

        :root {

            --app-background:
                #f8fafc;

            --app-surface:
                #f8fafc;

            --app-card:
                #ffffff;

            --app-text:
                #0f172a;

            --app-muted:
                #64748b;

            --app-border:
                #e5e7eb;

            --primary-color:
                #2563eb;

            --primary-soft:
                #eff6ff;

            --danger-color:
                #dc2626;

            --danger-soft:
                #fff1f2;

            --danger-border:
                #fecdd3;

        }

    `;


    document.head.appendChild(
        themeStyle
    );

}


/* ============================================================
   STYLES
============================================================ */

const pageStyle = {

    display: "flex",

    width: "100%",

    minHeight: "100vh",

    background:
        "var(--app-background)",

    color:
        "var(--app-text)",

    transition:
        "background 0.25s ease, color 0.25s ease"

};


const sidebarWrapperStyle = {

    flexShrink: 0

};


const mainStyle = {

    flex: 1,

    minWidth: 0,

    width: "100%"

};


const contentStyle = {

    width: "100%",

    maxWidth: "none",

    margin: 0,

    padding:
        "20px 22px 35px",

    boxSizing:
        "border-box"

};


const loadingStyle = {

    minHeight: "300px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color:
        "var(--app-muted)",

    fontSize: "14px"

};


/* ============================================================
   ERROR
============================================================ */

const errorStyle = {

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    gap: "15px",

    marginBottom: "18px",

    padding: "12px 15px",

    borderRadius: "9px",

    background:
        "var(--danger-soft)",

    border:
        "1px solid var(--danger-border)",

    color:
        "var(--danger-color)",

    fontSize: "12px",

    fontWeight: 600

};


const retryButtonStyle = {

    border:
        "1px solid var(--danger-border)",

    borderRadius: "6px",

    background:
        "var(--app-card)",

    color:
        "var(--danger-color)",

    padding:
        "6px 10px",

    cursor:
        "pointer",

    fontSize: "11px",

    fontWeight: 700

};


/* ============================================================
   HERO
============================================================ */

const heroStyle = {

    width: "100%",

    minHeight: "105px",

    padding:
        "22px 26px",

    boxSizing:
        "border-box",

    display: "flex",

    justifyContent:
        "space-between",

    alignItems:
        "center",

    gap: "25px",

    flexWrap:
        "wrap",

    marginBottom:
        "18px",

    borderRadius:
        "15px",

    background:
        "linear-gradient(135deg, var(--sidebar-color, #111827) 0%, var(--primary-color, #2563eb) 55%, var(--primary-color, #2563eb) 100%)",

    boxShadow:
        "0 8px 24px rgba(15,23,42,0.15)",

    transition:
        "background 0.25s ease"

};


const heroContentStyle = {

    minWidth: 0,

    flex: 1

};


const heroEyebrowStyle = {

    color:
        "rgba(255,255,255,0.75)",

    fontSize: "8px",

    fontWeight: 800,

    letterSpacing:
        "0.9px",

    marginBottom:
        "6px",

    textTransform:
        "uppercase"

};


const heroTitleStyle = {

    margin: 0,

    color:
        "#ffffff",

    fontSize: "21px",

    fontWeight: 800,

    lineHeight: 1.2,

    letterSpacing:
        "-0.4px"

};


const heroSubtitleStyle = {

    margin:
        "6px 0 0",

    color:
        "rgba(255,255,255,0.78)",

    fontSize: "9px",

    lineHeight: 1.5,

    maxWidth:
        "850px"

};


const refreshButtonStyle = {

    display:
        "inline-flex",

    alignItems:
        "center",

    justifyContent:
        "center",

    gap: "7px",

    height: "37px",

    padding:
        "0 13px",

    border:
        "1px solid rgba(255,255,255,0.25)",

    borderRadius:
        "8px",

    background:
        "rgba(255,255,255,0.12)",

    color:
        "#ffffff",

    fontSize: "10px",

    fontWeight: 700,

    cursor:
        "pointer",

    flexShrink: 0

};


/* ============================================================
   SUMMARY CARDS
============================================================ */

const cardsGridStyle = {

    width: "100%",

    display: "grid",

    gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",

    gap: "12px",

    marginBottom:
        "18px"

};


const dashboardCardStyle = {

    minWidth: 0,

    minHeight:
        "165px",

    padding:
        "15px",

    border:
        "1px solid",

    borderRadius:
        "12px",

    textAlign:
        "left",

    cursor:
        "pointer",

    boxSizing:
        "border-box",

    transition:
        "transform 0.15s ease, box-shadow 0.15s ease, background 0.25s ease, border-color 0.25s ease",

    boxShadow:
        "0 2px 7px rgba(15,23,42,0.04)"

};


const cardTopStyle = {

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "space-between",

    marginBottom:
        "12px"

};


const cardIconStyle = {

    width:
        "33px",

    height:
        "33px",

    borderRadius:
        "8px",

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "center"

};


const cardTitleStyle = {

    color:
        "var(--app-muted)",

    fontSize:
        "9px",

    fontWeight:
        800,

    textTransform:
        "uppercase",

    letterSpacing:
        "0.35px"

};


const cardTotalStyle = {

    marginTop:
        "5px",

    color:
        "var(--app-text)",

    fontSize:
        "26px",

    lineHeight:
        1,

    fontWeight:
        800

};


const cardLinesStyle = {

    display:
        "flex",

    flexDirection:
        "column",

    gap:
        "4px",

    marginTop:
        "9px"

};


const cardLineStyle = {

    color:
        "var(--app-muted)",

    fontSize:
        "9px",

    lineHeight:
        1.35

};


const cardFooterStyle = {

    display:
        "flex",

    alignItems:
        "center",

    gap:
        "4px",

    marginTop:
        "11px",

    fontSize:
        "9px",

    fontWeight:
        "800"

};


/* ============================================================
   QUICK SECTION
============================================================ */

const quickSectionStyle = {

    width:
        "100%",

    padding:
        "14px",

    boxSizing:
        "border-box",

    background:
        "var(--app-card)",

    border:
        "1px solid var(--app-border)",

    borderRadius:
        "12px",

    marginBottom:
        "18px",

    transition:
        "background 0.25s ease, border-color 0.25s ease"

};


const sectionHeaderStyle = {

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "space-between",

    marginBottom:
        "11px"

};


const sectionTitleStyle = {

    margin: 0,

    color:
        "var(--app-text)",

    fontSize:
        "10px",

    fontWeight:
        800,

    textTransform:
        "uppercase",

    letterSpacing:
        "0.45px"

};


const sectionSubtitleStyle = {

    margin:
        "3px 0 0",

    color:
        "var(--app-muted)",

    fontSize:
        "8px"

};


const quickGridStyle = {

    width:
        "100%",

    display:
        "grid",

    gridTemplateColumns:
        "repeat(6, minmax(0, 1fr))",

    gap:
        "8px"

};


const quickMetricStyle = {

    minWidth:
        0,

    padding:
        "10px",

    border:
        "1px solid var(--app-border)",

    borderRadius:
        "8px",

    background:
        "var(--app-surface)",

    color:
        "var(--app-text)",

    textAlign:
        "left",

    cursor:
        "pointer",

    transition:
        "transform 0.15s ease, box-shadow 0.15s ease, background 0.25s ease, border-color 0.25s ease"

};


const quickMetricTitleStyle = {

    color:
        "var(--app-muted)",

    fontSize:
        "8px",

    fontWeight:
        700

};


const quickMetricValueStyle = {

    marginTop:
        "3px",

    color:
        "var(--app-text)",

    fontSize:
        "18px",

    fontWeight:
        800

};


const quickMetricDescriptionStyle = {

    marginTop:
        "3px",

    color:
        "var(--app-muted)",

    fontSize:
        "8px",

    lineHeight:
        1.3

};


const activitySectionStyle = {

    width:
        "100%",

    marginBottom:
        "10px"

};


/* ============================================================
   RESPONSIVE CSS
============================================================ */

if (
    typeof document !== "undefined" &&
    !document.getElementById(
        "assetsphere-dashboard-responsive"
    )
) {

    const responsiveStyle =
        document.createElement("style");


    responsiveStyle.id =
        "assetsphere-dashboard-responsive";


    responsiveStyle.innerHTML = `

        .dashboard-summary-card:hover {

            transform:
                translateY(-2px);

            box-shadow:
                0 8px 20px
                rgba(15,23,42,0.10);

        }


        .dashboard-quick-metric:hover {

            transform:
                translateY(-1px);

            box-shadow:
                0 5px 14px
                rgba(15,23,42,0.07);

            border-color:
                var(--primary-color);

        }


        @keyframes dashboard-spin {

            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }

        }


        @media (max-width: 1200px) {

            .dashboard-summary-card {
                min-height: 160px;
            }

            .dashboard-quick-grid {
                grid-template-columns:
                    repeat(3, minmax(0, 1fr)) !important;
            }

        }


        @media (max-width: 900px) {

            .dashboard-summary-card {
                min-height: 155px;
            }

            .dashboard-quick-grid {
                grid-template-columns:
                    repeat(3, minmax(0, 1fr)) !important;
            }

        }


        @media (max-width: 700px) {

            .dashboard-summary-card {
                min-width: 0;
            }

            .dashboard-quick-grid {
                grid-template-columns:
                    repeat(2, minmax(0, 1fr)) !important;
            }

        }


        @media (max-width: 600px) {

            .dashboard-summary-card {
                min-height: 145px;
            }

            .dashboard-quick-grid {
                grid-template-columns:
                    1fr !important;
            }

        }

    `;


    document.head.appendChild(
        responsiveStyle
    );

}


export default Dashboard;