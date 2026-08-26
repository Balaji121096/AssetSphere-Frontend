import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";


function Reports() {

    // =====================================================
    // STATE
    // =====================================================

    const [reportType, setReportType] = useState("all");

    const [summary, setSummary] = useState(null);

    const [data, setData] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [filters, setFilters] = useState({
        from_date: "",
        to_date: "",
        status: "",
        category_id: "",
        employee_id: "",
        department_id: "",
        location_id: "",
        vendor_id: "",
        po_number: "",
        invoice_number: "",
        payment_status: ""
    });


    // =====================================================
    // REPORT ENDPOINTS
    // =====================================================

    const reportEndpoints = {
        all: "/reports/assets",
        assigned: "/reports/assigned",
        repair: "/reports/repair",
        scrap: "/reports/scrap",
        lost: "/reports/lost",
        employee: "/reports/employee-assets",
        purchase: "/reports/purchases"
    };


    const isPurchaseReport = reportType === "purchase";


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

            case "purchase":
                return "Purchase Report";

            default:
                return "All Assets Report";
        }
    };


    // =====================================================
    // LOAD SUMMARY
    // =====================================================

    const loadSummary = async () => {

        try {

            if (isPurchaseReport) {

                try {

                    const response = await API.get(
                        "/reports/purchases/summary",
                        {
                            params: {
                                ...filters,
                                search
                            }
                        }
                    );

                    if (response.data?.data) {

                        setSummary(response.data.data);

                        return;
                    }

                } catch (purchaseSummaryError) {

                    console.warn(
                        "Purchase summary endpoint unavailable. Calculating from report data."
                    );
                }


                const totalPurchases = data.length;

                const totalAmount = data.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.amount ??
                            item.purchase_amount ??
                            item.total_amount ??
                            0
                        ),
                    0
                );


                const paidPurchases = data.filter(
                    item =>
                        String(
                            item.payment_status || ""
                        ).toLowerCase() === "paid"
                ).length;


                const pendingPurchases = data.filter(item => {

                    const status = String(
                        item.payment_status || ""
                    ).toLowerCase();

                    return (
                        status === "pending" ||
                        status === "unpaid" ||
                        status === "partially paid"
                    );

                }).length;


                const highestPurchaseAmount = data.reduce(
                    (max, item) =>
                        Math.max(
                            max,
                            Number(
                                item.amount ??
                                item.purchase_amount ??
                                item.total_amount ??
                                0
                            )
                        ),
                    0
                );


                setSummary({
                    total_purchases: totalPurchases,
                    total_purchase_amount: totalAmount,
                    paid_purchases: paidPurchases,
                    pending_payments: pendingPurchases,
                    highest_purchase_amount:
                        highestPurchaseAmount
                });

                return;
            }


            const response = await API.get(
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


            const response = await API.get(
                reportEndpoints[reportType],
                {
                    params: {
                        ...filters,
                        search
                    }
                }
            );


            const reportData =
                response.data.data || [];


            setData(reportData);


            if (isPurchaseReport) {

                const totalPurchases =
                    reportData.length;


                const totalAmount =
                    reportData.reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item.amount ??
                                item.purchase_amount ??
                                item.total_amount ??
                                0
                            ),
                        0
                    );


                const paidPurchases =
                    reportData.filter(
                        item =>
                            String(
                                item.payment_status ||
                                ""
                            ).toLowerCase() ===
                            "paid"
                    ).length;


                const pendingPurchases =
                    reportData.filter(item => {

                        const status =
                            String(
                                item.payment_status ||
                                ""
                            ).toLowerCase();

                        return (
                            status === "pending" ||
                            status === "unpaid" ||
                            status === "partially paid"
                        );

                    }).length;


                const highestPurchaseAmount =
                    reportData.reduce(
                        (max, item) =>
                            Math.max(
                                max,
                                Number(
                                    item.amount ??
                                    item.purchase_amount ??
                                    item.total_amount ??
                                    0
                                )
                            ),
                        0
                    );


                setSummary({

                    total_purchases:
                        totalPurchases,

                    total_purchase_amount:
                        totalAmount,

                    paid_purchases:
                        paidPurchases,

                    pending_payments:
                        pendingPurchases,

                    highest_purchase_amount:
                        highestPurchaseAmount

                });

            } else {

                await loadSummary();
            }

        } catch (err) {

            console.error(
                "Report Error:",
                err
            );


            setData([]);

            setSummary(null);


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
    // REFRESH PAGE
    // =====================================================

    const refreshPage = () => {

        window.location.reload();

    };


    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {

        const resetValues = {

            from_date: "",
            to_date: "",
            status: "",
            category_id: "",
            employee_id: "",
            department_id: "",
            location_id: "",
            vendor_id: "",
            po_number: "",
            invoice_number: "",
            payment_status: ""

        };


        setFilters(resetValues);

        setSearch("");


        setTimeout(() => {

            loadReport();

        }, 0);
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) return "-";


        const parsed = new Date(date);


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

        const total = data.length;


        if (isPurchaseReport) {

            const totalCost =
                data.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.amount ??
                            item.purchase_amount ??
                            item.total_amount ??
                            0
                        ),
                    0
                );


            const averageCost =
                total > 0
                    ? totalCost / total
                    : 0;


            const paid =
                data.filter(
                    item =>
                        String(
                            item.payment_status ||
                            ""
                        ).toLowerCase() ===
                        "paid"
                ).length;


            const pending =
                data.filter(item => {

                    const status =
                        String(
                            item.payment_status ||
                            ""
                        ).toLowerCase();

                    return (
                        status === "pending" ||
                        status === "unpaid" ||
                        status === "partially paid"
                    );

                }).length;


            return {
                total,
                assigned: 0,
                stock: 0,
                repair: 0,
                scrap: 0,
                lost: 0,
                totalCost,
                averageCost,
                paid,
                pending
            };
        }


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
            averageCost,
            paid: 0,
            pending: 0
        };

    }, [data, isPurchaseReport]);


    // =====================================================
    // STATUS ANALYSIS
    // =====================================================

    const statusAnalysis =
        useMemo(() => {

            const result = {};


            data.forEach(item => {

                const status =
                    isPurchaseReport
                        ? (
                            item.payment_status ||
                            "Unknown"
                        )
                        : (
                            item.asset_status ||
                            "Unknown"
                        );


                result[status] =
                    (result[status] || 0) + 1;
            });


            return Object.entries(result);

        }, [data, isPurchaseReport]);


    // =====================================================
    // CATEGORY ANALYSIS
    // =====================================================

    const categoryAnalysis =
        useMemo(() => {

            if (isPurchaseReport) {
                return [];
            }


            const result = {};


            data.forEach(item => {

                const category =
                    item.category_name ||
                    "Unknown";


                result[category] =
                    (result[category] || 0) + 1;
            });


            return Object.entries(result)
                .sort(
                    (a, b) =>
                        b[1] - a[1]
                )
                .slice(0, 8);

        }, [data, isPurchaseReport]);


    // =====================================================
    // DEPARTMENT ANALYSIS
    // =====================================================

    const departmentAnalysis =
        useMemo(() => {

            if (isPurchaseReport) {
                return [];
            }


            const result = {};


            data.forEach(item => {

                const department =
                    item.department_name ||
                    "Not Assigned";


                result[department] =
                    (result[department] || 0) + 1;
            });


            return Object.entries(result)
                .sort(
                    (a, b) =>
                        b[1] - a[1]
                )
                .slice(0, 8);

        }, [data, isPurchaseReport]);


    // =====================================================
    // MANAGEMENT INSIGHT
    // =====================================================

    const getInsight = () => {

        if (!data.length) {

            return "No sufficient data available for analysis.";
        }


        if (isPurchaseReport) {

            if (analysis.pending > 0) {

                return `${analysis.pending} purchase(s) have pending or partially paid payment status.`;
            }


            if (
                analysis.paid ===
                analysis.total
            ) {

                return "All selected purchases are fully paid.";
            }


            if (analysis.totalCost > 0) {

                return `Total purchase value for the selected report is ${formatCost(analysis.totalCost)}.`;
            }


            return "The selected purchase report data is available for analysis.";
        }


        if (
            analysis.assigned >
            analysis.stock
        ) {

            return "Most assets are currently assigned to employees.";
        }


        if (analysis.repair > 0) {

            return `${analysis.repair} asset(s) are currently under repair.`;
        }


        if (analysis.lost > 0) {

            return `${analysis.lost} asset(s) are marked as lost.`;
        }


        if (categoryAnalysis.length) {

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


        if (isPurchaseReport) {

            const headers = [

                "Purchase ID",
                "PO Number",
                "Invoice Number",
                "Vendor ID",
                "Vendor Code",
                "Vendor Name",
                "Purchase Date",
                "Amount",
                "Payment Status",
                "Warranty Expiry",
                "Remarks"

            ];


            const rows =
                data.map(item => [

                    item.purchase_id ?? "",
                    item.po_number ?? "",
                    item.invoice_number ?? "",
                    item.vendor_id ?? "",
                    item.vendor_code ?? "",
                    item.vendor_name ?? "",

                    formatDate(
                        item.purchase_date
                    ),

                    Number(
                        item.amount ??
                        item.purchase_amount ??
                        item.total_amount ??
                        0
                    ),

                    item.payment_status ?? "",

                    formatDate(
                        item.warranty_expiry
                    ),

                    item.remarks ?? ""

                ]);


            downloadCSV(
                headers,
                rows,
                `${getReportTitle().replaceAll(" ", "_")}.csv`
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


        downloadCSV(
            headers,
            rows,
            `${getReportTitle().replaceAll(" ", "_")}.csv`
        );
    };


    // =====================================================
    // DOWNLOAD CSV
    // =====================================================

    const downloadCSV = (
        headers,
        rows,
        filename
    ) => {

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

        link.download = filename;


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
    // FILTER UPDATE
    // =====================================================

    const updateFilter = (
        key,
        value
    ) => {

        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="reports-page">

            <div className="no-print">
                <Sidebar />
            </div>


            <div className="reports-main">

                <div className="no-print">
                    <Navbar />
                </div>


                <main className="reports-content">

                    {/* =================================================
                        HERO HEADER
                    ================================================= */}

                    <section className="reports-hero">

                        <div>

                            <div className="eyebrow">
                                ASSETSPHERE • ANALYTICS
                            </div>

                            <h1>
                                Reports & Analytics
                            </h1>

                            <p>
                                Monitor assets, purchases,
                                payments and operational
                                performance from one place.
                            </p>

                        </div>


                        <div className="hero-actions no-print">

                            <button
                                onClick={refreshPage}
                                className="refresh-button"
                                type="button"
                            >
                                <span>↻</span>
                                Refresh
                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        REPORT TYPE BAR
                    ================================================= */}

                    <section className="report-selector no-print">

                        <div>

                            <span className="selector-label">
                                Current Report
                            </span>

                            <strong>
                                {getReportTitle()}
                            </strong>

                        </div>


                        <select
                            value={reportType}
                            onChange={e =>
                                setReportType(
                                    e.target.value
                                )
                            }
                            className="report-type-select"
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

                            <option value="purchase">
                                Purchase Report
                            </option>

                        </select>

                    </section>


                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <section className="summary-grid">

                        {isPurchaseReport ? (

                            <>

                                <SummaryCard
                                    title="Total Purchases"
                                    value={
                                        summary?.total_purchases ??
                                        analysis.total
                                    }
                                    icon="🛒"
                                    color="#2563eb"
                                    background="#eff6ff"
                                />

                                <SummaryCard
                                    title="Purchase Amount"
                                    value={
                                        formatCost(
                                            summary?.total_purchase_amount ??
                                            analysis.totalCost
                                        )
                                    }
                                    icon="₹"
                                    color="#16a34a"
                                    background="#f0fdf4"
                                />

                                <SummaryCard
                                    title="Pending Payments"
                                    value={
                                        summary?.pending_payments ??
                                        analysis.pending
                                    }
                                    icon="⏳"
                                    color="#d97706"
                                    background="#fffbeb"
                                />

                                <SummaryCard
                                    title="Paid Purchases"
                                    value={
                                        summary?.paid_purchases ??
                                        analysis.paid
                                    }
                                    icon="✓"
                                    color="#0891b2"
                                    background="#ecfeff"
                                />

                            </>

                        ) : (

                            <>

                                <SummaryCard
                                    title="Total Assets"
                                    value={
                                        summary?.total_assets ??
                                        analysis.total
                                    }
                                    icon="▦"
                                    color="#2563eb"
                                    background="#eff6ff"
                                />

                                <SummaryCard
                                    title="Assigned"
                                    value={
                                        summary?.assigned_assets ??
                                        analysis.assigned
                                    }
                                    icon="✓"
                                    color="#16a34a"
                                    background="#f0fdf4"
                                />

                                <SummaryCard
                                    title="In Stock"
                                    value={
                                        summary?.in_stock_assets ??
                                        analysis.stock
                                    }
                                    icon="▣"
                                    color="#0891b2"
                                    background="#ecfeff"
                                />

                                <SummaryCard
                                    title="Repair"
                                    value={
                                        summary?.repair_assets ??
                                        analysis.repair
                                    }
                                    icon="⚒"
                                    color="#d97706"
                                    background="#fffbeb"
                                />

                                <SummaryCard
                                    title="Scrap"
                                    value={
                                        summary?.scrap_assets ??
                                        analysis.scrap
                                    }
                                    icon="◌"
                                    color="#64748b"
                                    background="#f8fafc"
                                />

                                <SummaryCard
                                    title="Lost"
                                    value={
                                        summary?.lost_assets ??
                                        analysis.lost
                                    }
                                    icon="!"
                                    color="#dc2626"
                                    background="#fef2f2"
                                />

                            </>

                        )}

                    </section>


                    {/* =================================================
                        FILTERS
                    ================================================= */}

                    <section className="filter-card no-print">

                        <div className="section-heading">

                            <div>

                                <div className="section-icon">
                                    ⚙
                                </div>

                                <div>

                                    <h2>
                                        Report Filters
                                    </h2>

                                    <p>
                                        {isPurchaseReport
                                            ? "Filter purchases using vendor, PO, invoice, payment and date."
                                            : "Narrow your asset report using the available filters."}
                                    </p>

                                </div>

                            </div>


                            <div className="filter-actions">

                                <button
                                    onClick={loadReport}
                                    className="primary-button"
                                    type="button"
                                >
                                    Generate Report
                                </button>

                                <button
                                    onClick={resetFilters}
                                    className="secondary-button"
                                    type="button"
                                >
                                    Reset
                                </button>

                            </div>

                        </div>


                        {isPurchaseReport ? (

                            <div className="filter-grid">

                                <FilterField
                                    label="From Date"
                                    type="date"
                                    value={filters.from_date}
                                    onChange={e =>
                                        updateFilter(
                                            "from_date",
                                            e.target.value
                                        )
                                    }
                                />


                                <FilterField
                                    label="To Date"
                                    type="date"
                                    value={filters.to_date}
                                    onChange={e =>
                                        updateFilter(
                                            "to_date",
                                            e.target.value
                                        )
                                    }
                                />


                                <FilterField
                                    label="Vendor ID"
                                    type="number"
                                    placeholder="Enter vendor ID"
                                    value={filters.vendor_id}
                                    onChange={e =>
                                        updateFilter(
                                            "vendor_id",
                                            e.target.value
                                        )
                                    }
                                />


                                <FilterField
                                    label="PO Number"
                                    placeholder="Enter PO number"
                                    value={filters.po_number}
                                    onChange={e =>
                                        updateFilter(
                                            "po_number",
                                            e.target.value
                                        )
                                    }
                                />


                                <FilterField
                                    label="Invoice Number"
                                    placeholder="Enter invoice number"
                                    value={filters.invoice_number}
                                    onChange={e =>
                                        updateFilter(
                                            "invoice_number",
                                            e.target.value
                                        )
                                    }
                                />


                                <FilterSelect
                                    label="Payment Status"
                                    value={filters.payment_status}
                                    onChange={e =>
                                        updateFilter(
                                            "payment_status",
                                            e.target.value
                                        )
                                    }
                                    options={[
                                        ["", "All Payment Status"],
                                        ["Pending", "Pending"],
                                        ["Partially Paid", "Partially Paid"],
                                        ["Paid", "Paid"],
                                        ["Cancelled", "Cancelled"]
                                    ]}
                                />


                                <div className="filter-search">

                                    <label>
                                        Search
                                    </label>

                                    <div className="search-wrapper">

                                        <span>
                                            ⌕
                                        </span>

                                        <input
                                            type="text"
                                            placeholder="Search PO, invoice, vendor, remarks..."
                                            value={search}
                                            onChange={e =>
                                                setSearch(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                        ) : (

                            <div className="filter-grid">

                                <FilterField
                                    label="From Date"
                                    type="date"
                                    value={filters.from_date}
                                    onChange={e =>
                                        updateFilter(
                                            "from_date",
                                            e.target.value
                                        )
                                    }
                                />


                                <FilterField
                                    label="To Date"
                                    type="date"
                                    value={filters.to_date}
                                    onChange={e =>
                                        updateFilter(
                                            "to_date",
                                            e.target.value
                                        )
                                    }
                                />


                                <FilterSelect
                                    label="Status"
                                    value={filters.status}
                                    onChange={e =>
                                        updateFilter(
                                            "status",
                                            e.target.value
                                        )
                                    }
                                    options={[
                                        ["", "All Status"],
                                        ["Assigned", "Assigned"],
                                        ["In Stock", "In Stock"],
                                        ["Repair", "Repair"],
                                        ["Scrap", "Scrap"],
                                        ["Lost", "Lost"]
                                    ]}
                                />


                                <FilterField
                                    label="Category ID"
                                    type="number"
                                    placeholder="Category ID"
                                    value={filters.category_id}
                                    onChange={e =>
                                        updateFilter(
                                            "category_id",
                                            e.target.value
                                        )
                                    }
                                />


                                <FilterField
                                    label="Employee ID"
                                    type="number"
                                    placeholder="Employee ID"
                                    value={filters.employee_id}
                                    onChange={e =>
                                        updateFilter(
                                            "employee_id",
                                            e.target.value
                                        )
                                    }
                                />


                                <FilterField
                                    label="Department ID"
                                    type="number"
                                    placeholder="Department ID"
                                    value={filters.department_id}
                                    onChange={e =>
                                        updateFilter(
                                            "department_id",
                                            e.target.value
                                        )
                                    }
                                />


                                <FilterField
                                    label="Location ID"
                                    type="number"
                                    placeholder="Location ID"
                                    value={filters.location_id}
                                    onChange={e =>
                                        updateFilter(
                                            "location_id",
                                            e.target.value
                                        )
                                    }
                                />


                                <FilterField
                                    label="Vendor ID"
                                    type="number"
                                    placeholder="Vendor ID"
                                    value={filters.vendor_id}
                                    onChange={e =>
                                        updateFilter(
                                            "vendor_id",
                                            e.target.value
                                        )
                                    }
                                />


                                <div className="filter-search">

                                    <label>
                                        Search
                                    </label>

                                    <div className="search-wrapper">

                                        <span>
                                            ⌕
                                        </span>

                                        <input
                                            type="text"
                                            placeholder="Search asset, employee, vendor, category..."
                                            value={search}
                                            onChange={e =>
                                                setSearch(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        ANALYSIS
                    ================================================= */}

                    <section className="analysis-card">

                        <div className="section-title-row">

                            <div>

                                <span className="mini-label">
                                    PERFORMANCE
                                </span>

                                <h2>
                                    Report Analysis
                                </h2>

                                <p>
                                    Analysis based on the currently loaded report.
                                </p>

                            </div>

                        </div>


                        <div className="analysis-grid">

                            <AnalysisCard
                                title={
                                    isPurchaseReport
                                        ? "Total Purchases"
                                        : "Total Records"
                                }
                                value={analysis.total}
                                icon="▦"
                            />


                            <AnalysisCard
                                title={
                                    isPurchaseReport
                                        ? "Purchase Value"
                                        : "Asset Value"
                                }
                                value={formatCost(analysis.totalCost)}
                                icon="₹"
                            />


                            <AnalysisCard
                                title="Average Cost"
                                value={formatCost(analysis.averageCost)}
                                icon="↗"
                            />


                            <AnalysisCard
                                title={
                                    isPurchaseReport
                                        ? "Highest Purchase"
                                        : "Highest Cost"
                                }
                                value={
                                    formatCost(
                                        isPurchaseReport
                                            ? (
                                                summary?.highest_purchase_amount ||
                                                0
                                            )
                                            : (
                                                summary?.highest_asset_cost ||
                                                0
                                            )
                                    )
                                }
                                icon="★"
                            />

                        </div>


                        <div className="insight-box">

                            <div className="insight-icon">
                                ✦
                            </div>

                            <div>

                                <strong>
                                    Management Insight
                                </strong>

                                <p>
                                    {getInsight()}
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        BREAKDOWN
                    ================================================= */}

                    <div
                        className={
                            isPurchaseReport
                                ? "breakdown-grid single"
                                : "breakdown-grid"
                        }
                    >

                        <BreakdownCard
                            title={
                                isPurchaseReport
                                    ? "Payment Status Distribution"
                                    : "Status Distribution"
                            }
                            data={statusAnalysis}
                        />


                        {!isPurchaseReport && (

                            <>

                                <BreakdownCard
                                    title="Category Distribution"
                                    data={categoryAnalysis}
                                />


                                <BreakdownCard
                                    title="Department Distribution"
                                    data={departmentAnalysis}
                                />

                            </>

                        )}

                    </div>


                    {/* =================================================
                        REPORT HEADER
                    ================================================= */}

                    <section className="report-section">

                        <div className="report-section-header no-print">

                            <div>

                                <span className="mini-label">
                                    DATA TABLE
                                </span>

                                <h2>
                                    {getReportTitle()}
                                </h2>

                                <p>
                                    {data.length} record(s) found
                                </p>

                            </div>


                            <div className="report-actions">

                                <button
                                    disabled={!data.length}
                                    onClick={exportExcel}
                                    className={
                                        data.length
                                            ? "export-button excel"
                                            : "export-button disabled"
                                    }
                                    type="button"
                                >
                                    ↓ Excel
                                </button>


                                <button
                                    disabled={!data.length}
                                    onClick={printReport}
                                    className={
                                        data.length
                                            ? "export-button print"
                                            : "export-button disabled"
                                    }
                                    type="button"
                                >
                                    ⎙ PDF / Print
                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            PRINT HEADER
                        ================================================= */}

                        <div className="print-only print-header">

                            <h1>
                                AssetSphere
                            </h1>

                            <h2>
                                {getReportTitle()}
                            </h2>

                            <p>
                                Generated:{" "}
                                {new Date().toLocaleString(
                                    "en-IN"
                                )}
                            </p>

                        </div>


                        {/* =================================================
                            STATES
                        ================================================= */}

                        {loading ? (

                            <div className="state-container">

                                <div className="loader"></div>

                                <h3>
                                    Loading report...
                                </h3>

                                <p>
                                    Please wait while the report is being generated.
                                </p>

                            </div>

                        ) : error ? (

                            <div className="state-container error-state">

                                <div className="state-icon">
                                    !
                                </div>

                                <h3>
                                    Unable to load report
                                </h3>

                                <p>
                                    {error}
                                </p>

                                <button
                                    className="primary-button"
                                    onClick={loadReport}
                                    type="button"
                                >
                                    Try Again
                                </button>

                            </div>

                        ) : !data.length ? (

                            <div className="state-container">

                                <div className="state-icon empty">
                                    ▦
                                </div>

                                <h3>
                                    No records found
                                </h3>

                                <p>
                                    Try changing the filters and generate the report again.
                                </p>

                            </div>

                        ) : (

                            <div className="table-wrapper">

                                {/* =================================================
                                    PURCHASE TABLE
                                ================================================= */}

                                {isPurchaseReport ? (

                                    <table>

                                        <thead>

                                            <tr>

                                                <th>Purchase ID</th>
                                                <th>PO Number</th>
                                                <th>Invoice</th>
                                                <th>Vendor</th>
                                                <th>Purchase Date</th>
                                                <th>Amount</th>
                                                <th>Payment</th>
                                                <th>Warranty</th>
                                                <th>Remarks</th>

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
                                                            item.purchase_id ||
                                                            `${item.po_number}-${index}`
                                                        }
                                                    >

                                                        <td>
                                                            <span className="id-badge">
                                                                {item.purchase_id ?? "-"}
                                                            </span>
                                                        </td>


                                                        <td>
                                                            <span className="po-number">
                                                                {item.po_number || "-"}
                                                            </span>
                                                        </td>


                                                        <td>
                                                            {item.invoice_number || "-"}
                                                        </td>


                                                        <td>

                                                            <div className="vendor-cell">

                                                                <strong>
                                                                    {item.vendor_name || "-"}
                                                                </strong>

                                                                <small>

                                                                    {item.vendor_id
                                                                        ? `ID: ${item.vendor_id}`
                                                                        : ""}

                                                                    {item.vendor_code
                                                                        ? ` • ${item.vendor_code}`
                                                                        : ""}

                                                                </small>

                                                            </div>

                                                        </td>


                                                        <td>
                                                            {formatDate(
                                                                item.purchase_date
                                                            )}
                                                        </td>


                                                        <td>

                                                            <strong className="amount-text">
                                                                {formatCost(
                                                                    item.amount ??
                                                                    item.purchase_amount ??
                                                                    item.total_amount
                                                                )}
                                                            </strong>

                                                        </td>


                                                        <td>

                                                            <span
                                                                className="status-badge"
                                                                style={
                                                                    purchasePaymentStyle(
                                                                        item.payment_status
                                                                    )
                                                                }
                                                            >
                                                                {item.payment_status || "-"}
                                                            </span>

                                                        </td>


                                                        <td>
                                                            {formatDate(
                                                                item.warranty_expiry
                                                            )}
                                                        </td>


                                                        <td>
                                                            {item.remarks || "-"}
                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                ) : (

                                    <table>

                                        <thead>

                                            <tr>

                                                <th>ID</th>
                                                <th>Asset Code</th>
                                                <th>Asset Name</th>
                                                <th>Category</th>
                                                <th>Employee</th>
                                                <th>Department</th>
                                                <th>Vendor</th>
                                                <th>Location</th>
                                                <th>Purchase Date</th>
                                                <th>Cost</th>
                                                <th>Status</th>

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

                                                        <td>

                                                            <span className="id-badge">
                                                                {item.asset_id ?? "-"}
                                                            </span>

                                                        </td>


                                                        <td>

                                                            <span className="asset-code">
                                                                {item.asset_code || "-"}
                                                            </span>

                                                        </td>


                                                        <td>

                                                            <strong>
                                                                {item.asset_name || "-"}
                                                            </strong>

                                                        </td>


                                                        <td>
                                                            {item.category_name || "-"}
                                                        </td>


                                                        <td>
                                                            {item.employee_name || "-"}
                                                        </td>


                                                        <td>
                                                            {item.department_name || "-"}
                                                        </td>


                                                        <td>
                                                            {item.vendor_name || "-"}
                                                        </td>


                                                        <td>
                                                            {item.location_name || "-"}
                                                        </td>


                                                        <td>
                                                            {formatDate(
                                                                item.purchase_date
                                                            )}
                                                        </td>


                                                        <td>

                                                            <strong className="amount-text">
                                                                {formatCost(
                                                                    item.purchase_cost
                                                                )}
                                                            </strong>

                                                        </td>


                                                        <td>

                                                            <span
                                                                className="status-badge"
                                                                style={
                                                                    statusStyle(
                                                                        item.asset_status
                                                                    )
                                                                }
                                                            >
                                                                {item.asset_status || "-"}
                                                            </span>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                )}

                            </div>

                        )}

                    </section>

                </main>

            </div>


            {/* =========================================================
                DESIGN + PRINT CSS
            ========================================================= */}

            <style>
                {`

                    * {
                        box-sizing: border-box;
                    }


                    body {
                        margin: 0;
                        font-family:
                            Inter,
                            -apple-system,
                            BlinkMacSystemFont,
                            "Segoe UI",
                            sans-serif;
                        background: #f6f8fc;
                        color: #111827;
                    }


                    .reports-page {
                        display: flex;
                        min-height: 100vh;
                        background:
                            linear-gradient(
                                135deg,
                                #f8fafc 0%,
                                #f1f5f9 100%
                            );
                    }


                    .reports-main {
                        flex: 1;
                        min-width: 0;
                        width: calc(100vw - 180px);
                        max-width: calc(100vw - 180px);
                    }


                    .reports-content {
                        width: 100%;
                        max-width: 1600px;
                        margin: 0 auto;
                        padding: 30px;
                    }


                    /* =================================================
                       HERO
                    ================================================= */

                    .reports-hero {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 20px;
                        padding: 28px 30px;
                        margin-bottom: 18px;
                        border-radius: 18px;
                        background:
                            linear-gradient(
                                135deg,
                                #111827,
                                #1e3a8a
                            );
                        color: #fff;
                        box-shadow:
                            0 12px 30px
                            rgba(15, 23, 42, 0.12);
                    }


                    .eyebrow,
                    .mini-label {
                        font-size: 11px;
                        font-weight: 800;
                        letter-spacing: 1.3px;
                        text-transform: uppercase;
                    }


                    .eyebrow {
                        color: #bfdbfe;
                        margin-bottom: 8px;
                    }


                    /* FIX:
                       Reports & Analytics white color
                    */

                    .reports-hero h1 {
                        margin: 0;
                        font-size: 32px;
                        line-height: 1.2;
                        font-weight: 800;
                        color: #ffffff !important;
                    }


                    .reports-hero p {
                        margin:
                            8px 0 0;
                        color: #dbeafe;
                        font-size: 14px;
                        max-width: 650px;
                    }


                    .refresh-button {
                        border: 1px solid
                            rgba(255,255,255,0.22);
                        background:
                            rgba(255,255,255,0.12);
                        color: #fff;
                        padding: 11px 17px;
                        border-radius: 9px;
                        cursor: pointer;
                        font-weight: 700;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transition: 0.2s ease;
                    }


                    .refresh-button:hover {
                        background:
                            rgba(255,255,255,0.2);
                        transform:
                            translateY(-1px);
                    }


                    .refresh-button span {
                        font-size: 19px;
                    }


                    /* =================================================
                       REPORT SELECTOR
                    ================================================= */

                    .report-selector {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 20px;
                        background: #fff;
                        padding: 15px 18px;
                        margin-bottom: 18px;
                        border:
                            1px solid #e2e8f0;
                        border-radius: 12px;
                        box-shadow:
                            0 3px 10px
                            rgba(15,23,42,0.035);
                    }


                    .selector-label {
                        display: block;
                        color: #94a3b8;
                        font-size: 10px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        font-weight: 800;
                        margin-bottom: 4px;
                    }


                    .report-selector strong {
                        color: #1e293b;
                        font-size: 15px;
                    }


                    .report-type-select {
                        min-width: 220px;
                        border:
                            1px solid #cbd5e1;
                        background: #fff;
                        color: #1e293b;
                        padding: 10px 12px;
                        border-radius: 8px;
                        outline: none;
                        font-weight: 600;
                        cursor: pointer;
                    }


                    .report-type-select:focus {
                        border-color: #2563eb;
                        box-shadow:
                            0 0 0 3px
                            rgba(37,99,235,0.1);
                    }


                    /* =================================================
                       SUMMARY
                    ================================================= */

                    .summary-grid {
                        display: grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(190px, 1fr)
                            );
                        gap: 14px;
                        margin-bottom: 20px;
                    }


                    .summary-card {
                        position: relative;
                        overflow: hidden;
                        background: #fff;
                        border:
                            1px solid #e2e8f0;
                        border-radius: 14px;
                        padding: 18px;
                        box-shadow:
                            0 3px 12px
                            rgba(15,23,42,0.04);
                        transition:
                            transform 0.2s ease,
                            box-shadow 0.2s ease;
                    }


                    .summary-card:hover {
                        transform:
                            translateY(-2px);
                        box-shadow:
                            0 10px 25px
                            rgba(15,23,42,0.08);
                    }


                    .summary-card::after {
                        content: "";
                        position: absolute;
                        right: -25px;
                        top: -25px;
                        width: 85px;
                        height: 85px;
                        border-radius: 50%;
                        background:
                            var(--card-bg);
                    }


                    .summary-top {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        position: relative;
                        z-index: 1;
                    }


                    .summary-icon {
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 10px;
                        font-weight: 800;
                        font-size: 17px;
                    }


                    .summary-title {
                        color: #64748b;
                        font-size: 12px;
                        font-weight: 700;
                        margin-bottom: 8px;
                    }


                    .summary-value {
                        color: #0f172a;
                        font-size: 25px;
                        font-weight: 800;
                        letter-spacing: -0.4px;
                    }


                    /* =================================================
                       FILTER CARD
                    ================================================= */

                    .filter-card,
                    .analysis-card,
                    .report-section,
                    .breakdown-card {
                        background: #fff;
                        border:
                            1px solid #e2e8f0;
                        box-shadow:
                            0 4px 14px
                            rgba(15,23,42,0.035);
                    }


                    .filter-card {
                        border-radius: 14px;
                        padding: 20px;
                        margin-bottom: 20px;
                    }


                    .section-heading {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 20px;
                        margin-bottom: 18px;
                    }


                    .section-heading > div:first-child {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }


                    .section-icon {
                        width: 42px;
                        height: 42px;
                        border-radius: 11px;
                        background: #eff6ff;
                        color: #2563eb;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 18px;
                    }


                    .section-heading h2,
                    .section-title-row h2,
                    .report-section-header h2 {
                        margin: 0;
                        color: #0f172a;
                        font-size: 18px;
                        font-weight: 800;
                    }


                    .section-heading p,
                    .section-title-row p,
                    .report-section-header p {
                        margin:
                            4px 0 0;
                        color: #64748b;
                        font-size: 12px;
                    }


                    .filter-actions {
                        display: flex;
                        gap: 8px;
                    }


                    .primary-button,
                    .secondary-button {
                        padding: 10px 15px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 700;
                        font-size: 13px;
                        transition: 0.2s ease;
                    }


                    .primary-button {
                        background: #2563eb;
                        color: #fff;
                        border: 1px solid #2563eb;
                    }


                    .primary-button:hover {
                        background: #1d4ed8;
                    }


                    .secondary-button {
                        background: #fff;
                        color: #475569;
                        border:
                            1px solid #cbd5e1;
                    }


                    .secondary-button:hover {
                        background: #f8fafc;
                    }


                    .filter-grid {
                        display: grid;
                        grid-template-columns:
                            repeat(
                                3,
                                minmax(0, 1fr)
                            );
                        gap: 14px;
                    }


                    .filter-field label,
                    .filter-search label {
                        display: block;
                        color: #475569;
                        font-size: 12px;
                        font-weight: 700;
                        margin-bottom: 6px;
                    }


                    .filter-field input,
                    .filter-field select {
                        width: 100%;
                        padding: 10px 11px;
                        border:
                            1px solid #cbd5e1;
                        border-radius: 8px;
                        background: #fff;
                        color: #0f172a;
                        outline: none;
                        font-size: 13px;
                        transition: 0.2s ease;
                    }


                    .filter-field input:focus,
                    .filter-field select:focus,
                    .search-wrapper:focus-within {
                        border-color: #2563eb;
                        box-shadow:
                            0 0 0 3px
                            rgba(37,99,235,0.09);
                    }


                    .filter-search {
                        grid-column: 1 / -1;
                    }


                    .search-wrapper {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        width: 100%;
                        padding: 0 11px;
                        border:
                            1px solid #cbd5e1;
                        border-radius: 8px;
                        background: #fff;
                    }


                    .search-wrapper span {
                        color: #64748b;
                        font-size: 19px;
                    }


                    .search-wrapper input {
                        flex: 1;
                        min-width: 0;
                        padding: 10px 0;
                        border: none;
                        outline: none;
                        color: #0f172a;
                    }


                    /* =================================================
                       ANALYSIS
                    ================================================= */

                    .analysis-card {
                        border-radius: 14px;
                        padding: 20px;
                        margin-bottom: 20px;
                    }


                    .section-title-row {
                        margin-bottom: 16px;
                    }


                    .mini-label {
                        color: #2563eb;
                        display: block;
                        margin-bottom: 5px;
                    }


                    .analysis-grid {
                        display: grid;
                        grid-template-columns:
                            repeat(
                                4,
                                minmax(0, 1fr)
                            );
                        gap: 12px;
                    }


                    .analysis-item {
                        padding: 15px;
                        border-radius: 11px;
                        background: #f8fafc;
                        border:
                            1px solid #e2e8f0;
                    }


                    .analysis-item-top {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }


                    .analysis-item-icon {
                        width: 32px;
                        height: 32px;
                        border-radius: 8px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: #eff6ff;
                        color: #2563eb;
                        font-weight: 800;
                    }


                    .analysis-item-title {
                        color: #64748b;
                        font-size: 11px;
                        font-weight: 700;
                        margin-top: 9px;
                    }


                    .analysis-item-value {
                        color: #0f172a;
                        font-size: 19px;
                        font-weight: 800;
                        margin-top: 4px;
                    }


                    .insight-box {
                        display: flex;
                        align-items: flex-start;
                        gap: 12px;
                        margin-top: 16px;
                        padding: 14px 16px;
                        background:
                            linear-gradient(
                                135deg,
                                #eff6ff,
                                #f8faff
                            );
                        border:
                            1px solid #bfdbfe;
                        border-radius: 10px;
                        color: #1e40af;
                    }


                    .insight-icon {
                        width: 34px;
                        height: 34px;
                        min-width: 34px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 9px;
                        background: #dbeafe;
                        color: #2563eb;
                    }


                    .insight-box strong {
                        font-size: 13px;
                    }


                    .insight-box p {
                        margin: 3px 0 0;
                        font-size: 12px;
                        line-height: 1.5;
                    }


                    /* =================================================
                       BREAKDOWN
                    ================================================= */

                    .breakdown-grid {
                        display: grid;
                        grid-template-columns:
                            repeat(
                                3,
                                minmax(0, 1fr)
                            );
                        gap: 18px;
                        margin-bottom: 20px;
                    }


                    .breakdown-grid.single {
                        grid-template-columns:
                            minmax(0, 1fr);
                    }


                    .breakdown-card {
                        border-radius: 14px;
                        padding: 18px;
                    }


                    .breakdown-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 17px;
                    }


                    .breakdown-header h3 {
                        margin: 0;
                        color: #0f172a;
                        font-size: 15px;
                        font-weight: 800;
                    }


                    .breakdown-total {
                        color: #94a3b8;
                        font-size: 11px;
                        font-weight: 700;
                    }


                    .breakdown-row {
                        margin-bottom: 14px;
                    }


                    .breakdown-label {
                        display: flex;
                        justify-content: space-between;
                        gap: 10px;
                        color: #475569;
                        font-size: 12px;
                        margin-bottom: 6px;
                    }


                    .breakdown-label strong {
                        color: #0f172a;
                    }


                    .progress-track {
                        height: 7px;
                        background: #e2e8f0;
                        border-radius: 20px;
                        overflow: hidden;
                    }


                    .progress-fill {
                        height: 100%;
                        min-width: 2px;
                        background:
                            linear-gradient(
                                90deg,
                                #2563eb,
                                #60a5fa
                            );
                        border-radius: 20px;
                        transition: width 0.4s ease;
                    }


                    /* =================================================
                       REPORT SECTION
                    ================================================= */

                    .report-section {
                        border-radius: 14px;
                        overflow: hidden;
                        margin-bottom: 25px;
                    }


                    .report-section-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 20px;
                        padding: 18px 20px;
                        border-bottom:
                            1px solid #e2e8f0;
                        background:
                            linear-gradient(
                                180deg,
                                #ffffff,
                                #fbfdff
                            );
                    }


                    .report-actions {
                        display: flex;
                        gap: 8px;
                    }


                    .export-button {
                        border: none;
                        color: #fff;
                        padding: 9px 14px;
                        border-radius: 8px;
                        font-weight: 700;
                        cursor: pointer;
                        font-size: 12px;
                    }


                    .export-button.excel {
                        background: #16a34a;
                    }


                    .export-button.excel:hover {
                        background: #15803d;
                    }


                    .export-button.print {
                        background: #dc2626;
                    }


                    .export-button.print:hover {
                        background: #b91c1c;
                    }


                    .export-button.disabled {
                        background: #cbd5e1;
                        cursor: not-allowed;
                    }


                    /* =================================================
                       TABLE
                    ================================================= */

                    .table-wrapper {
                        width: 100%;
                        overflow-x: auto;
                    }


                    table {
                        width: 100%;
                        min-width: 1200px;
                        border-collapse: collapse;
                    }


                    th {
                        padding: 13px 14px;
                        text-align: left;
                        background: #f8fafc;
                        color: #475569;
                        border-bottom:
                            1px solid #e2e8f0;
                        font-size: 11px;
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: 0.4px;
                        white-space: nowrap;
                    }


                    td {
                        padding: 13px 14px;
                        color: #475569;
                        border-bottom:
                            1px solid #f1f5f9;
                        font-size: 12px;
                        white-space: nowrap;
                        background: #fff;
                    }


                    tbody tr {
                        transition: background 0.15s ease;
                    }


                    tbody tr:hover td {
                        background: #f8fbff;
                    }


                    tbody tr:last-child td {
                        border-bottom: none;
                    }


                    .id-badge {
                        display: inline-flex;
                        align-items: center;
                        padding: 4px 7px;
                        border-radius: 6px;
                        background: #f1f5f9;
                        color: #475569;
                        font-size: 11px;
                        font-weight: 700;
                    }


                    .po-number,
                    .asset-code {
                        color: #2563eb;
                        font-weight: 700;
                    }


                    .vendor-cell {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                    }


                    .vendor-cell strong {
                        color: #334155;
                        font-size: 12px;
                    }


                    .vendor-cell small {
                        color: #94a3b8;
                        font-size: 10px;
                    }


                    .amount-text {
                        color: #0f172a;
                    }


                    .status-badge {
                        display: inline-flex;
                        align-items: center;
                        padding: 5px 9px;
                        border-radius: 999px;
                        font-size: 10px;
                        font-weight: 800;
                        white-space: nowrap;
                    }


                    /* =================================================
                       STATES
                    ================================================= */

                    .state-container {
                        min-height: 360px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                        padding: 50px 20px;
                    }


                    .state-container h3 {
                        margin:
                            15px 0 5px;
                        color: #1e293b;
                    }


                    .state-container p {
                        margin:
                            0 0 18px;
                        color: #94a3b8;
                        font-size: 13px;
                    }


                    .state-icon {
                        width: 52px;
                        height: 52px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 14px;
                        background: #fee2e2;
                        color: #dc2626;
                        font-size: 24px;
                        font-weight: 800;
                    }


                    .state-icon.empty {
                        background: #eff6ff;
                        color: #2563eb;
                    }


                    .loader {
                        width: 34px;
                        height: 34px;
                        border-radius: 50%;
                        border:
                            3px solid #dbeafe;
                        border-top-color: #2563eb;
                        animation:
                            reportSpin 0.8s linear infinite;
                    }


                    @keyframes reportSpin {
                        to {
                            transform: rotate(360deg);
                        }
                    }


                    /* =================================================
                       PRINT
                    ================================================= */

                    .print-only {
                        display: none;
                    }


                    @media print {

                        @page {
                            size: landscape;
                            margin: 10mm;
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


                        .reports-page,
                        .reports-main,
                        .reports-content {
                            display: block !important;
                            width: 100% !important;
                            max-width: none !important;
                            padding: 0 !important;
                            background: #fff !important;
                        }


                        .reports-hero,
                        .report-selector,
                        .summary-grid,
                        .filter-card,
                        .analysis-card,
                        .breakdown-grid {
                            display: none !important;
                        }


                        .report-section {
                            border: none !important;
                            box-shadow: none !important;
                            margin: 0 !important;
                        }


                        .report-section-header {
                            display: none !important;
                        }


                        .print-header {
                            padding: 10px 0 18px;
                        }


                        .print-header h1 {
                            margin: 0;
                            font-size: 22px;
                        }


                        .print-header h2 {
                            margin:
                                5px 0;
                            font-size: 16px;
                        }


                        .print-header p {
                            margin: 0;
                            color: #475569;
                            font-size: 11px;
                        }


                        .table-wrapper {
                            overflow: visible !important;
                        }


                        table {
                            min-width: 0 !important;
                            width: 100% !important;
                            font-size: 8px !important;
                        }


                        th {
                            background: #f1f5f9 !important;
                            color: #111827 !important;
                            font-size: 8px !important;
                            padding: 6px !important;
                        }


                        td {
                            color: #111827 !important;
                            font-size: 8px !important;
                            padding: 6px !important;
                        }


                        .status-badge {
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }

                    }


                    /* =================================================
                       RESPONSIVE
                    ================================================= */

                    @media (max-width: 1200px) {

                        .reports-content {
                            padding: 22px;
                        }


                        .analysis-grid {
                            grid-template-columns:
                                repeat(2, 1fr);
                        }


                        .breakdown-grid {
                            grid-template-columns:
                                repeat(2, 1fr);
                        }

                    }


                    @media (max-width: 900px) {

                        .reports-main {
                            width: 100%;
                            max-width: 100%;
                        }


                        .reports-content {
                            padding: 16px;
                        }


                        .reports-hero {
                            padding: 22px;
                        }


                        .filter-grid {
                            grid-template-columns:
                                repeat(2, minmax(0, 1fr));
                        }


                        .section-heading {
                            align-items: flex-start;
                            flex-direction: column;
                        }


                        .filter-actions {
                            width: 100%;
                        }


                        .filter-actions button {
                            flex: 1;
                        }

                    }


                    @media (max-width: 700px) {

                        .reports-content {
                            padding: 12px;
                        }


                        .reports-hero {
                            flex-direction: column;
                            align-items: flex-start;
                            padding: 20px;
                        }


                        .reports-hero h1 {
                            font-size: 26px;
                            color: #ffffff !important;
                        }


                        .hero-actions {
                            width: 100%;
                        }


                        .refresh-button {
                            width: 100%;
                            justify-content: center;
                        }


                        .report-selector {
                            flex-direction: column;
                            align-items: stretch;
                        }


                        .report-type-select {
                            width: 100%;
                        }


                        .filter-grid {
                            grid-template-columns: 1fr;
                        }


                        .analysis-grid {
                            grid-template-columns: 1fr;
                        }


                        .breakdown-grid,
                        .breakdown-grid.single {
                            grid-template-columns: 1fr;
                        }


                        .report-section-header {
                            flex-direction: column;
                            align-items: flex-start;
                        }


                        .report-actions {
                            width: 100%;
                        }


                        .export-button {
                            flex: 1;
                        }


                        .summary-grid {
                            grid-template-columns:
                                repeat(2, minmax(0, 1fr));
                        }

                    }


                    @media (max-width: 450px) {

                        .summary-grid {
                            grid-template-columns: 1fr;
                        }


                        .reports-hero h1 {
                            font-size: 23px;
                            color: #ffffff !important;
                        }


                        .filter-card,
                        .analysis-card {
                            padding: 15px;
                        }

                    }

                `}
            </style>

        </div>
    );
}


// =====================================================
// FILTER FIELD
// =====================================================

function FilterField({
    label,
    type = "text",
    placeholder = "",
    value,
    onChange
}) {

    return (

        <div className="filter-field">

            <label>
                {label}
            </label>

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />

        </div>
    );
}


// =====================================================
// FILTER SELECT
// =====================================================

function FilterSelect({
    label,
    value,
    onChange,
    options
}) {

    return (

        <div className="filter-field">

            <label>
                {label}
            </label>

            <select
                value={value}
                onChange={onChange}
            >

                {options.map(
                    ([optionValue, optionLabel]) => (

                        <option
                            key={optionValue}
                            value={optionValue}
                        >
                            {optionLabel}
                        </option>

                    )
                )}

            </select>

        </div>
    );
}


// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
    title,
    value,
    icon,
    color,
    background
}) {

    return (

        <div
            className="summary-card"
            style={{
                "--card-bg": background
            }}
        >

            <div className="summary-top">

                <div>

                    <div className="summary-title">
                        {title}
                    </div>

                    <div className="summary-value">
                        {value}
                    </div>

                </div>


                <div
                    className="summary-icon"
                    style={{
                        color,
                        background
                    }}
                >
                    {icon}
                </div>

            </div>

        </div>
    );
}


// =====================================================
// ANALYSIS CARD
// =====================================================

function AnalysisCard({
    title,
    value,
    icon
}) {

    return (

        <div className="analysis-item">

            <div className="analysis-item-top">

                <div className="analysis-item-icon">
                    {icon}
                </div>

            </div>


            <div className="analysis-item-title">
                {title}
            </div>


            <div className="analysis-item-value">
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

        <div className="breakdown-card">

            <div className="breakdown-header">

                <h3>
                    {title}
                </h3>

                <span className="breakdown-total">
                    {total} total
                </span>

            </div>


            {!data.length ? (

                <p
                    style={{
                        color: "#94a3b8",
                        fontSize: "12px"
                    }}
                >
                    No data available
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
                                className="breakdown-row"
                            >

                                <div className="breakdown-label">

                                    <span>
                                        {name}
                                    </span>

                                    <strong>
                                        {count}
                                    </strong>

                                </div>


                                <div className="progress-track">

                                    <div
                                        className="progress-fill"
                                        style={{
                                            width:
                                                `${percentage}%`
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
// ASSET STATUS STYLE
// =====================================================

const statusStyle = (status) => {

    let background = "#f1f5f9";
    let color = "#475569";


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

        background = "#e2e8f0";
        color = "#475569";

    }


    if (status === "Lost") {

        background = "#fee2e2";
        color = "#991b1b";

    }


    return {

        background,
        color

    };
};


// =====================================================
// PURCHASE PAYMENT STYLE
// =====================================================

const purchasePaymentStyle = (
    status
) => {

    let background = "#f1f5f9";
    let color = "#475569";


    if (status === "Paid") {

        background = "#dcfce7";
        color = "#166534";

    }


    if (
        status === "Pending"
    ) {

        background = "#ffedd5";
        color = "#9a3412";

    }


    if (
        status === "Partially Paid"
    ) {

        background = "#fef3c7";
        color = "#92400e";

    }


    if (
        status === "Cancelled"
    ) {

        background = "#fee2e2";
        color = "#991b1b";

    }


    return {

        background,
        color

    };
};


export default Reports;