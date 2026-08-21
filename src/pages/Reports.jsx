import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";


function Reports() {

    // =====================================================
    // STATE
    // =====================================================

    const [reportType, setReportType] =
        useState("all");


    const [summary, setSummary] =
        useState(null);


    const [data, setData] =
        useState([]);


    const [search, setSearch] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const [filters, setFilters] =
        useState({

            from_date: "",

            to_date: "",

            status: "",

            category_id: "",

            employee_id: "",

            department_id: "",

            location_id: "",

            vendor_id: ""

        });


    // =====================================================
    // REPORT ENDPOINTS
    // =====================================================

    const reportEndpoints = {

        all:
            "/reports/assets",

        assigned:
            "/reports/assigned",

        repair:
            "/reports/repair",

        scrap:
            "/reports/scrap",

        lost:
            "/reports/lost",

        employee:
            "/reports/employee-assets"

    };


    // =====================================================
    // REPORT TITLE
    // =====================================================

    const getReportTitle = () => {

        switch (reportType) {

            case "assigned":
                return "Assigned Assets Report";

            case "repair":
                return "Repair Assets Report";

            case "scrap":
                return "Scrap Assets Report";

            case "lost":
                return "Lost Assets Report";

            case "employee":
                return "Employee Assets Report";

            default:
                return "All Assets Report";
        }
    };


    // =====================================================
    // LOAD SUMMARY
    // =====================================================

    const loadSummary = async () => {

        try {

            const response =
                await API.get(
                    "/reports/assets/summary",
                    {
                        params: {
                            ...filters,
                            search
                        }
                    }
                );


            setSummary(
                response.data.data || null
            );

        } catch (err) {

            console.error(
                "Summary Error:",
                err
            );

        }
    };


    // =====================================================
    // LOAD REPORT
    // =====================================================

    const loadReport = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await API.get(
                    reportEndpoints[
                        reportType
                    ],
                    {
                        params: {
                            ...filters,
                            search
                        }
                    }
                );


            setData(
                response.data.data || []
            );


            await loadSummary();


        } catch (err) {

            console.error(
                "Report Error:",
                err
            );


            setData([]);


            setError(
                err.response?.data?.message ||
                "Failed to load report"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadReport();

    }, [reportType]);


    // =====================================================
    // RESET
    // =====================================================

    const resetFilters = () => {

        setFilters({

            from_date: "",

            to_date: "",

            status: "",

            category_id: "",

            employee_id: "",

            department_id: "",

            location_id: "",

            vendor_id: ""

        });


        setSearch("");


        setTimeout(() => {

            loadReport();

        }, 0);
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        const parsed =
            new Date(date);


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return "-";
        }


        return parsed.toLocaleDateString(
            "en-IN"
        );
    };


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatCost = (cost) => {

        if (
            cost === null ||
            cost === undefined ||
            cost === ""
        ) {
            return "₹0";
        }


        return Number(cost).toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        );
    };


    // =====================================================
    // ANALYSIS
    // =====================================================

    const analysis = useMemo(() => {

        const total =
            data.length;


        const assigned =
            data.filter(
                item =>
                    item.asset_status ===
                    "Assigned"
            ).length;


        const stock =
            data.filter(
                item =>
                    item.asset_status ===
                    "In Stock"
            ).length;


        const repair =
            data.filter(
                item =>
                    item.asset_status ===
                    "Repair"
            ).length;


        const scrap =
            data.filter(
                item =>
                    item.asset_status ===
                    "Scrap"
            ).length;


        const lost =
            data.filter(
                item =>
                    item.asset_status ===
                    "Lost"
            ).length;


        const totalCost =
            data.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.purchase_cost || 0
                    ),
                0
            );


        const averageCost =
            total > 0
                ? totalCost / total
                : 0;


        return {

            total,

            assigned,

            stock,

            repair,

            scrap,

            lost,

            totalCost,

            averageCost

        };

    }, [data]);


    // =====================================================
    // STATUS ANALYSIS
    // =====================================================

    const statusAnalysis =
        useMemo(() => {

            const result = {};

            data.forEach(item => {

                const status =
                    item.asset_status ||
                    "Unknown";


                result[status] =
                    (result[status] || 0) +
                    1;

            });


            return Object.entries(
                result
            );

        }, [data]);


    // =====================================================
    // CATEGORY ANALYSIS
    // =====================================================

    const categoryAnalysis =
        useMemo(() => {

            const result = {};

            data.forEach(item => {

                const category =
                    item.category_name ||
                    "Unknown";


                result[category] =
                    (result[category] || 0) +
                    1;

            });


            return Object.entries(
                result
            )
                .sort(
                    (a, b) =>
                        b[1] - a[1]
                )
                .slice(0, 8);

        }, [data]);


    // =====================================================
    // DEPARTMENT ANALYSIS
    // =====================================================

    const departmentAnalysis =
        useMemo(() => {

            const result = {};

            data.forEach(item => {

                const department =
                    item.department_name ||
                    "Not Assigned";


                result[department] =
                    (result[department] || 0) +
                    1;

            });


            return Object.entries(
                result
            )
                .sort(
                    (a, b) =>
                        b[1] - a[1]
                )
                .slice(0, 8);

        }, [data]);


    // =====================================================
    // MANAGEMENT INSIGHT
    // =====================================================

    const getInsight = () => {

        if (!data.length) {

            return "No sufficient data available for analysis.";

        }


        if (
            analysis.assigned >
            analysis.stock
        ) {

            return "Most assets are currently assigned to employees.";

        }


        if (
            analysis.repair >
            0
        ) {

            return `${analysis.repair} asset(s) are currently under repair.`;

        }


        if (
            analysis.lost >
            0
        ) {

            return `${analysis.lost} asset(s) are marked as lost.`;

        }


        if (
            categoryAnalysis.length
        ) {

            return `${categoryAnalysis[0][0]} is the highest asset category in the selected report.`;

        }


        return "The selected report data is available for analysis.";

    };


    // =====================================================
    // CSV / EXCEL EXPORT
    // =====================================================

    const exportExcel = () => {

        if (!data.length) {

            alert(
                "No data available to export"
            );

            return;
        }


        const headers = [

            "Asset ID",

            "Asset Code",

            "Asset Name",

            "Category",

            "Employee",

            "Department",

            "Designation",

            "Vendor",

            "Location",

            "Purchase Date",

            "Purchase Cost",

            "Assigned Date",

            "Returned Date",

            "Status",

            "Remarks"

        ];


        const rows =
            data.map(item => [

                item.asset_id ?? "",

                item.asset_code ?? "",

                item.asset_name ?? "",

                item.category_name ?? "",

                item.employee_name ?? "",

                item.department_name ?? "",

                item.designation_name ?? "",

                item.vendor_name ?? "",

                item.location_name ?? "",

                formatDate(
                    item.purchase_date
                ),

                Number(
                    item.purchase_cost || 0
                ),

                formatDate(
                    item.assigned_date
                ),

                formatDate(
                    item.returned_date
                ),

                item.asset_status ?? "",

                item.remarks ?? ""

            ]);


        const csv = [

            headers,

            ...rows

        ]
            .map(row =>
                row
                    .map(value =>
                        `"${String(value)
                            .replaceAll(
                                '"',
                                '""'
                            )}"`
                    )
                    .join(",")
            )
            .join("\n");


        const blob =
            new Blob(
                [
                    "\ufeff" + csv
                ],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement("a");


        link.href = url;


        link.download =
            `${getReportTitle()
                .replaceAll(" ", "_")}.csv`;


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );
    };


    // =====================================================
    // PRINT
    // =====================================================

    const printReport = () => {

        if (!data.length) {

            alert(
                "No data available to print"
            );

            return;
        }


        window.print();
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f5f6f8"
            }}
        >

            <div className="no-print">
                <Sidebar />
            </div>


            <div
                style={{
                    flex: 1,
                    minWidth: 0
                }}
            >

                <div className="no-print">
                    <Navbar />
                </div>


                <main
                    style={{
                        padding: "28px",
                        maxWidth: "1600px",
                        margin: "0 auto"
                    }}
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
                            gap: "20px",
                            marginBottom: "24px"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "36px",
                                    fontWeight: 700,
                                    color: "#111827"
                                }}
                            >
                                Reports
                            </h1>


                            <p
                                style={{
                                    margin:
                                        "5px 0 0",
                                    color: "#6b7280"
                                }}
                            >
                                AssetSphere reports
                                and asset analysis
                            </p>

                        </div>


                        <button
                            onClick={loadReport}
                            className="no-print"
                            style={{
                                border: "none",
                                background:
                                    "#2563eb",
                                color: "#fff",
                                padding:
                                    "10px 18px",
                                borderRadius:
                                    "6px",
                                cursor:
                                    "pointer",
                                fontWeight:
                                    600
                            }}
                        >
                            Refresh
                        </button>

                    </div>


                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3, minmax(0, 1fr))",
                            gap: "15px",
                            marginBottom: "22px"
                        }}
                    >

                        <SummaryCard
                            title="Total Assets"
                            value={
                                summary?.total_assets ??
                                analysis.total
                            }
                            color="#2563eb"
                        />


                        <SummaryCard
                            title="Assigned"
                            value={
                                summary?.assigned_assets ??
                                analysis.assigned
                            }
                            color="#16a34a"
                        />


                        <SummaryCard
                            title="In Stock"
                            value={
                                summary?.in_stock_assets ??
                                analysis.stock
                            }
                            color="#0891b2"
                        />


                        <SummaryCard
                            title="Repair"
                            value={
                                summary?.repair_assets ??
                                analysis.repair
                            }
                            color="#f59e0b"
                        />


                        <SummaryCard
                            title="Scrap"
                            value={
                                summary?.scrap_assets ??
                                analysis.scrap
                            }
                            color="#6b7280"
                        />


                        <SummaryCard
                            title="Lost"
                            value={
                                summary?.lost_assets ??
                                analysis.lost
                            }
                            color="#dc2626"
                        />

                    </div>


                    {/* =================================================
                        FILTERS
                    ================================================= */}

                    <section
                        className="no-print"
                        style={{
                            background: "#fff",
                            borderRadius: "10px",
                            padding: "20px",
                            marginBottom: "20px",
                            border:
                                "1px solid #e5e7eb"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                marginBottom:
                                    "16px",
                                flexWrap:
                                    "wrap",
                                gap: "10px"
                            }}
                        >

                            <div>

                                <h3
                                    style={{
                                        margin: 0,
                                        color:
                                            "#111827"
                                    }}
                                >
                                    Report Filters
                                </h3>

                                <p
                                    style={{
                                        margin:
                                            "4px 0 0",
                                        color:
                                            "#6b7280",
                                        fontSize:
                                            "13px"
                                    }}
                                >
                                    Select filters
                                    and generate
                                    the report
                                </p>

                            </div>


                            <div
                                style={{
                                    display:
                                        "flex",
                                    gap:
                                        "8px"
                                }}
                            >

                                <button
                                    onClick={
                                        loadReport
                                    }
                                    style={{
                                        background:
                                            "#2563eb",
                                        color:
                                            "#fff",
                                        border:
                                            "none",
                                        padding:
                                            "9px 16px",
                                        borderRadius:
                                            "6px",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    Generate Report
                                </button>


                                <button
                                    onClick={
                                        resetFilters
                                    }
                                    style={{
                                        background:
                                            "#fff",
                                        color:
                                            "#374151",
                                        border:
                                            "1px solid #d1d5db",
                                        padding:
                                            "9px 16px",
                                        borderRadius:
                                            "6px",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    Reset
                                </button>

                            </div>

                        </div>


                        <div
                            style={{
                                display:
                                    "grid",
                                gridTemplateColumns:
                                    "repeat(3, minmax(0, 1fr))",
                                gap:
                                    "12px"
                            }}
                        >

                            <div>

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Report Type
                                </label>

                                <select
                                    value={
                                        reportType
                                    }
                                    onChange={
                                        e =>
                                            setReportType(
                                                e.target.value
                                            )
                                    }
                                    style={
                                        inputStyle
                                    }
                                >

                                    <option value="all">
                                        All Assets
                                    </option>

                                    <option value="assigned">
                                        Assigned Assets
                                    </option>

                                    <option value="repair">
                                        Repair Assets
                                    </option>

                                    <option value="scrap">
                                        Scrap Assets
                                    </option>

                                    <option value="lost">
                                        Lost Assets
                                    </option>

                                    <option value="employee">
                                        Employee Assets
                                    </option>

                                </select>

                            </div>


                            <div>

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    From Date
                                </label>

                                <input
                                    type="date"
                                    value={
                                        filters.from_date
                                    }
                                    onChange={
                                        e =>
                                            setFilters({
                                                ...filters,
                                                from_date:
                                                    e.target.value
                                            })
                                    }
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            <div>

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    To Date
                                </label>

                                <input
                                    type="date"
                                    value={
                                        filters.to_date
                                    }
                                    onChange={
                                        e =>
                                            setFilters({
                                                ...filters,
                                                to_date:
                                                    e.target.value
                                            })
                                    }
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            <div>

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Status
                                </label>

                                <select
                                    value={
                                        filters.status
                                    }
                                    onChange={
                                        e =>
                                            setFilters({
                                                ...filters,
                                                status:
                                                    e.target.value
                                            })
                                    }
                                    style={
                                        inputStyle
                                    }
                                >

                                    <option value="">
                                        All Status
                                    </option>

                                    <option value="Assigned">
                                        Assigned
                                    </option>

                                    <option value="In Stock">
                                        In Stock
                                    </option>

                                    <option value="Repair">
                                        Repair
                                    </option>

                                    <option value="Scrap">
                                        Scrap
                                    </option>

                                    <option value="Lost">
                                        Lost
                                    </option>

                                </select>

                            </div>


                            <div>

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Category ID
                                </label>

                                <input
                                    type="number"
                                    placeholder="Category ID"
                                    value={
                                        filters.category_id
                                    }
                                    onChange={
                                        e =>
                                            setFilters({
                                                ...filters,
                                                category_id:
                                                    e.target.value
                                            })
                                    }
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            <div>

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Employee ID
                                </label>

                                <input
                                    type="number"
                                    placeholder="Employee ID"
                                    value={
                                        filters.employee_id
                                    }
                                    onChange={
                                        e =>
                                            setFilters({
                                                ...filters,
                                                employee_id:
                                                    e.target.value
                                            })
                                    }
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            <div>

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Department ID
                                </label>

                                <input
                                    type="number"
                                    placeholder="Department ID"
                                    value={
                                        filters.department_id
                                    }
                                    onChange={
                                        e =>
                                            setFilters({
                                                ...filters,
                                                department_id:
                                                    e.target.value
                                            })
                                    }
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            <div>

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Location ID
                                </label>

                                <input
                                    type="number"
                                    placeholder="Location ID"
                                    value={
                                        filters.location_id
                                    }
                                    onChange={
                                        e =>
                                            setFilters({
                                                ...filters,
                                                location_id:
                                                    e.target.value
                                            })
                                    }
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            <div>

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Vendor ID
                                </label>

                                <input
                                    type="number"
                                    placeholder="Vendor ID"
                                    value={
                                        filters.vendor_id
                                    }
                                    onChange={
                                        e =>
                                            setFilters({
                                                ...filters,
                                                vendor_id:
                                                    e.target.value
                                            })
                                    }
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            <div
                                style={{
                                    gridColumn:
                                        "1 / -1"
                                }}
                            >

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Search
                                </label>

                                <input
                                    type="text"
                                    placeholder="Search asset, employee, vendor, category..."
                                    value={
                                        search
                                    }
                                    onChange={
                                        e =>
                                            setSearch(
                                                e.target.value
                                            )
                                    }
                                    style={{
                                        ...inputStyle,
                                        width:
                                            "100%"
                                    }}
                                />

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        ANALYSIS
                    ================================================= */}

                    <section
                        style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "10px",
                            marginBottom: "20px",
                            border:
                                "1px solid #e5e7eb"
                        }}
                    >

                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                marginBottom:
                                    "15px"
                            }}
                        >

                            <div>

                                <h2
                                    style={{
                                        margin: 0
                                    }}
                                >
                                    Report Analysis
                                </h2>

                                <p
                                    style={{
                                        color:
                                            "#6b7280",
                                        margin:
                                            "4px 0 0"
                                    }}
                                >
                                    Analysis based
                                    on currently
                                    loaded report
                                </p>

                            </div>

                        </div>


                        <div
                            style={{
                                display:
                                    "grid",
                                gridTemplateColumns:
                                    "repeat(4, minmax(0, 1fr))",
                                gap:
                                    "12px"
                            }}
                        >

                            <AnalysisCard
                                title="Total Records"
                                value={
                                    analysis.total
                                }
                            />

                            <AnalysisCard
                                title="Total Asset Value"
                                value={
                                    formatCost(
                                        analysis.totalCost
                                    )
                                }
                            />

                            <AnalysisCard
                                title="Average Cost"
                                value={
                                    formatCost(
                                        analysis.averageCost
                                    )
                                }
                            />

                            <AnalysisCard
                                title="Highest Cost"
                                value={
                                    formatCost(
                                        summary?.highest_asset_cost ||
                                        0
                                    )
                                }
                            />

                        </div>


                        <div
                            style={{
                                marginTop:
                                    "18px",
                                padding:
                                    "15px",
                                background:
                                    "#eff6ff",
                                borderRadius:
                                    "8px",
                                color:
                                    "#1e40af"
                            }}
                        >
                            <strong>
                                Management Insight:
                            </strong>{" "}
                            {getInsight()}
                        </div>

                    </section>


                    {/* =================================================
                        BREAKDOWN
                    ================================================= */}

                    <div
                        style={{
                            display:
                                "grid",
                            gridTemplateColumns:
                                "repeat(3, minmax(0, 1fr))",
                            gap:
                                "20px",
                            marginBottom:
                                "20px"
                        }}
                    >

                        <BreakdownCard
                            title="Status Distribution"
                            data={
                                statusAnalysis
                            }
                        />


                        <BreakdownCard
                            title="Category Distribution"
                            data={
                                categoryAnalysis
                            }
                        />


                        <BreakdownCard
                            title="Department Distribution"
                            data={
                                departmentAnalysis
                            }
                        />

                    </div>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div
                        className="no-print"
                        style={{
                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
                            background:
                                "#fff",
                            padding:
                                "15px 20px",
                            borderRadius:
                                "10px 10px 0 0",
                            border:
                                "1px solid #e5e7eb",
                            borderBottom:
                                "none"
                        }}
                    >

                        <div>

                            <h2
                                style={{
                                    margin: 0,
                                    fontSize:
                                        "20px"
                                }}
                            >
                                {
                                    getReportTitle()
                                }
                            </h2>

                            <span
                                style={{
                                    color:
                                        "#6b7280",
                                    fontSize:
                                        "13px"
                                }}
                            >
                                {
                                    data.length
                                }{" "}
                                record(s)
                            </span>

                        </div>


                        <div
                            style={{
                                display:
                                    "flex",
                                gap:
                                    "8px"
                            }}
                        >

                            <button
                                disabled={
                                    !data.length
                                }
                                onClick={
                                    exportExcel
                                }
                                style={
                                    actionButton(
                                        "#16a34a",
                                        !data.length
                                    )
                                }
                            >
                                Excel
                            </button>


                            <button
                                disabled={
                                    !data.length
                                }
                                onClick={
                                    printReport
                                }
                                style={
                                    actionButton(
                                        "#dc2626",
                                        !data.length
                                    )
                                }
                            >
                                PDF / Print
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        REPORT TABLE
                    ================================================= */}

                    <section
                        id="report-print-area"
                        style={{
                            background:
                                "#fff",
                            borderRadius:
                                "0 0 10px 10px",
                            overflow:
                                "hidden",
                            border:
                                "1px solid #e5e7eb"
                        }}
                    >

                        <div
                            className="print-only"
                            style={{
                                padding:
                                    "20px"
                            }}
                        >

                            <h1>
                                AssetSphere
                            </h1>

                            <h2>
                                {
                                    getReportTitle()
                                }
                            </h2>

                            <p>
                                Generated:{" "}
                                {new Date()
                                    .toLocaleString(
                                        "en-IN"
                                    )}
                            </p>

                        </div>


                        {loading ? (

                            <div
                                style={{
                                    padding:
                                        "60px",
                                    textAlign:
                                        "center"
                                }}
                            >
                                <div
                                    style={{
                                        fontSize:
                                            "18px",
                                        fontWeight:
                                            600,
                                        color:
                                            "#374151"
                                    }}
                                >
                                    Loading report...
                                </div>

                                <p
                                    style={{
                                        color:
                                            "#6b7280"
                                    }}
                                >
                                    Please wait
                                </p>
                            </div>

                        ) : error ? (

                            <div
                                style={{
                                    padding:
                                        "60px",
                                    textAlign:
                                        "center",
                                    color:
                                        "#dc2626"
                                }}
                            >

                                <h3>
                                    Unable to load
                                    report
                                </h3>

                                <p>
                                    {error}
                                </p>

                                <button
                                    className="no-print"
                                    onClick={
                                        loadReport
                                    }
                                    style={{
                                        background:
                                            "#2563eb",
                                        color:
                                            "#fff",
                                        border:
                                            "none",
                                        padding:
                                            "10px 18px",
                                        borderRadius:
                                            "6px"
                                    }}
                                >
                                    Try Again
                                </button>

                            </div>

                        ) : !data.length ? (

                            <div
                                style={{
                                    padding:
                                        "60px",
                                    textAlign:
                                        "center"
                                }}
                            >

                                <h3
                                    style={{
                                        marginBottom:
                                            "5px"
                                    }}
                                >
                                    No records found
                                </h3>

                                <p
                                    style={{
                                        color:
                                            "#6b7280"
                                    }}
                                >
                                    Try changing
                                    the filters
                                    and generate
                                    the report again.
                                </p>

                            </div>

                        ) : (

                            <div
                                style={{
                                    overflowX:
                                        "auto"
                                }}
                            >

                                <table
                                    style={{
                                        width:
                                            "100%",
                                        borderCollapse:
                                            "collapse",
                                        minWidth:
                                            "1200px"
                                    }}
                                >

                                    <thead>

                                        <tr>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                ID
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Asset Code
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Asset Name
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Category
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Employee
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Department
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Vendor
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Location
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Purchase Date
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Cost
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {data.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <tr
                                                    key={
                                                        item.asset_id ||
                                                        `${item.employee_id}-${index}`
                                                    }
                                                >

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            item.asset_id ??
                                                            "-"
                                                        }
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            item.asset_code ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            item.asset_name ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            item.category_name ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            item.employee_name ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            item.department_name ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            item.vendor_name ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            item.location_name ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            formatDate(
                                                                item.purchase_date
                                                            )
                                                        }
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            formatCost(
                                                                item.purchase_cost
                                                            )
                                                        }
                                                    </td>


                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <span
                                                            style={
                                                                statusStyle(
                                                                    item.asset_status
                                                                )
                                                            }
                                                        >
                                                            {
                                                                item.asset_status ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>

                </main>

            </div>


            {/* =========================================================
                PRINT CSS
            ========================================================= */}

            <style>
                {`
                    .print-only {
                        display: none;
                    }

                    @media print {

                        @page {
                            size: landscape;
                            margin: 12mm;
                        }

                        body {
                            background: #fff !important;
                        }

                        .no-print {
                            display: none !important;
                        }

                        .print-only {
                            display: block !important;
                        }

                        #report-print-area {
                            border: none !important;
                            border-radius: 0 !important;
                        }

                        table {
                            font-size: 10px !important;
                        }

                        th {
                            background: #f3f4f6 !important;
                            color: #111827 !important;
                        }
                    }

                    @media (max-width: 1100px) {

                        main {
                            padding: 18px !important;
                        }

                    }

                    @media (max-width: 900px) {

                        .report-grid {
                            grid-template-columns:
                                1fr !important;
                        }

                    }
                `}
            </style>

        </div>
    );
}


// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
    title,
    value,
    color
}) {

    return (

        <div
            style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                border:
                    "1px solid #e5e7eb",
                boxShadow:
                    "0 2px 5px rgba(0,0,0,0.04)"
            }}
        >

            <div
                style={{
                    color: "#6b7280",
                    fontSize: "14px",
                    marginBottom: "8px"
                }}
            >
                {title}
            </div>


            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                }}
            >

                <div
                    style={{
                        width: "5px",
                        height: "38px",
                        background: color,
                        borderRadius: "4px"
                    }}
                />


                <h2
                    style={{
                        margin: 0,
                        fontSize: "28px",
                        color: "#111827"
                    }}
                >
                    {value}
                </h2>

            </div>

        </div>
    );
}


// =====================================================
// ANALYSIS CARD
// =====================================================

function AnalysisCard({
    title,
    value
}) {

    return (

        <div
            style={{
                background: "#f9fafb",
                padding: "15px",
                borderRadius: "8px",
                border:
                    "1px solid #e5e7eb"
            }}
        >

            <div
                style={{
                    color: "#6b7280",
                    fontSize: "13px"
                }}
            >
                {title}
            </div>

            <div
                style={{
                    fontWeight: 700,
                    fontSize: "20px",
                    marginTop: "5px",
                    color: "#111827"
                }}
            >
                {value}
            </div>

        </div>
    );
}


// =====================================================
// BREAKDOWN CARD
// =====================================================

function BreakdownCard({
    title,
    data
}) {

    const total =
        data.reduce(
            (sum, item) =>
                sum + Number(item[1]),
            0
        );


    return (

        <div
            style={{
                background: "#fff",
                padding: "18px",
                borderRadius: "10px",
                border:
                    "1px solid #e5e7eb"
            }}
        >

            <h3
                style={{
                    marginTop: 0,
                    marginBottom: "15px"
                }}
            >
                {title}
            </h3>


            {!data.length ? (

                <p
                    style={{
                        color:
                            "#9ca3af"
                    }}
                >
                    No data
                </p>

            ) : (

                data.map(
                    ([name, count]) => {

                        const percentage =
                            total > 0
                                ? (
                                    count /
                                    total
                                ) * 100
                                : 0;


                        return (

                            <div
                                key={name}
                                style={{
                                    marginBottom:
                                        "12px"
                                }}
                            >

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "space-between",
                                        fontSize:
                                            "13px",
                                        marginBottom:
                                            "5px"
                                    }}
                                >

                                    <span>
                                        {name}
                                    </span>

                                    <strong>
                                        {count}
                                    </strong>

                                </div>


                                <div
                                    style={{
                                        height:
                                            "7px",
                                        background:
                                            "#e5e7eb",
                                        borderRadius:
                                            "10px",
                                        overflow:
                                            "hidden"
                                    }}
                                >

                                    <div
                                        style={{
                                            width:
                                                `${percentage}%`,
                                            height:
                                                "100%",
                                            background:
                                                "#2563eb",
                                            borderRadius:
                                                "10px"
                                        }}
                                    />

                                </div>

                            </div>

                        );
                    }
                )

            )}

        </div>
    );
}


// =====================================================
// STYLES
// =====================================================

const labelStyle = {

    display: "block",

    fontSize: "13px",

    fontWeight: 600,

    color: "#374151",

    marginBottom: "6px"

};


const inputStyle = {

    width: "100%",

    boxSizing: "border-box",

    padding: "10px 12px",

    border:
        "1px solid #d1d5db",

    borderRadius: "6px",

    background: "#fff",

    color: "#111827",

    outline: "none"

};


const thStyle = {

    padding: "13px 12px",

    textAlign: "left",

    background: "#f9fafb",

    color: "#4b5563",

    fontSize: "13px",

    fontWeight: 700,

    borderBottom:
        "1px solid #e5e7eb",

    whiteSpace: "nowrap"

};


const tdStyle = {

    padding: "13px 12px",

    color: "#4b5563",

    fontSize: "13px",

    borderBottom:
        "1px solid #f0f0f0",

    whiteSpace: "nowrap"

};


const statusStyle = (status) => {

    let background = "#f3f4f6";

    let color = "#374151";


    if (status === "Assigned") {

        background = "#dcfce7";

        color = "#166534";

    }


    if (status === "In Stock") {

        background = "#dbeafe";

        color = "#1d4ed8";

    }


    if (status === "Repair") {

        background = "#fef3c7";

        color = "#92400e";

    }


    if (status === "Scrap") {

        background = "#e5e7eb";

        color = "#374151";

    }


    if (status === "Lost") {

        background = "#fee2e2";

        color = "#991b1b";

    }


    return {

        display: "inline-block",

        padding: "4px 9px",

        borderRadius: "20px",

        background,

        color,

        fontSize: "12px",

        fontWeight: 600

    };
};


const actionButton = (
    color,
    disabled
) => ({

    background: disabled
        ? "#d1d5db"
        : color,

    color: "#fff",

    border: "none",

    padding: "8px 14px",

    borderRadius: "6px",

    cursor: disabled
        ? "not-allowed"
        : "pointer",

    fontWeight: 600

});


export default Reports;