import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Reports() {

    const [summary, setSummary] = useState(null);
    const [assets, setAssets] = useState([]);

    const [categories, setCategories] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [employeeId, setEmployeeId] = useState("");

    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(true);


    // =====================================================
    // LOAD SUMMARY
    // =====================================================

    const loadSummary = async () => {

        try {

            setSummaryLoading(true);

            const response =
                await API.get("/reports/assets/summary");

            setSummary(response.data.data || null);

        } catch (error) {

            console.error(
                "Report Summary Error:",
                error
            );

        } finally {

            setSummaryLoading(false);
        }
    };


    // =====================================================
    // LOAD ASSET REPORT
    // =====================================================

    const loadAssets = async () => {

        try {

            setLoading(true);

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (status) {
                params.status = status;
            }

            if (categoryId) {
                params.category_id = categoryId;
            }

            if (employeeId) {
                params.employee_id = employeeId;
            }


            const response =
                await API.get("/reports/assets", {
                    params
                });


            setAssets(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Asset Report Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load asset report"
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD CATEGORIES
    // =====================================================

    const loadCategories = async () => {

        try {

            const response =
                await API.get("/asset-categories");

            setCategories(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Category Load Error:",
                error
            );
        }
    };


    // =====================================================
    // LOAD EMPLOYEES
    // =====================================================

    const loadEmployees = async () => {

        try {

            const response =
                await API.get("/employees");

            setEmployees(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Employee Load Error:",
                error
            );
        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadSummary();
        loadCategories();
        loadEmployees();

    }, []);


    // =====================================================
    // LOAD REPORT WHEN FILTER CHANGES
    // =====================================================

    useEffect(() => {

        loadAssets();

    }, [
        search,
        status,
        categoryId,
        employeeId
    ]);


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = async () => {

        await Promise.all([
            loadSummary(),
            loadAssets()
        ]);
    };


    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {

        setSearch("");
        setStatus("");
        setCategoryId("");
        setEmployeeId("");
    };


    // =====================================================
    // SUMMARY CARDS
    // =====================================================

    const cards = summary
        ? [
            {
                title: "Total Assets",
                value: summary.total_assets
            },
            {
                title: "Assigned",
                value: summary.assigned_assets
            },
            {
                title: "In Stock",
                value: summary.in_stock_assets
            },
            {
                title: "Repair",
                value: summary.repair_assets
            },
            {
                title: "Scrap",
                value: summary.scrap_assets
            },
            {
                title: "Lost",
                value: summary.lost_assets
            }
        ]
        : [];


    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN"
        );
    };


    // =====================================================
    // COST FORMAT
    // =====================================================

    const formatCost = (cost) => {

        if (
            cost === null ||
            cost === undefined ||
            cost === ""
        ) {
            return "-";
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


    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f5f6f8"
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


                <div
                    style={{
                        padding: "25px"
                    }}
                >

                    {/* =====================================================
                        HEADER
                    ===================================================== */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "25px"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    margin: 0
                                }}
                            >
                                Asset Reports
                            </h1>

                            <p
                                style={{
                                    marginTop: "8px",
                                    color: "#666"
                                }}
                            >
                                View and filter all hardware asset information
                            </p>

                        </div>


                        <button
                            onClick={handleRefresh}
                            style={{
                                padding: "10px 18px",
                                border: "none",
                                borderRadius: "6px",
                                background: "#2563eb",
                                color: "#fff",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            Refresh
                        </button>

                    </div>


                    {/* =====================================================
                        SUMMARY CARDS
                    ===================================================== */}

                    {summaryLoading ? (

                        <p>
                            Loading summary...
                        </p>

                    ) : (

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(170px, 1fr))",
                                gap: "15px",
                                marginBottom: "25px"
                            }}
                        >

                            {cards.map(
                                (card, index) => (

                                    <div
                                        key={index}
                                        style={{
                                            background: "#fff",
                                            padding: "20px",
                                            borderRadius: "10px",
                                            boxShadow:
                                                "0 2px 6px rgba(0,0,0,0.08)"
                                        }}
                                    >

                                        <p
                                            style={{
                                                margin: 0,
                                                color: "#666",
                                                fontSize: "14px"
                                            }}
                                        >
                                            {card.title}
                                        </p>

                                        <h2
                                            style={{
                                                marginTop: "10px",
                                                marginBottom: 0
                                            }}
                                        >
                                            {card.value}
                                        </h2>

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {/* =====================================================
                        FILTERS
                    ===================================================== */}

                    <div
                        style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "10px",
                            marginBottom: "20px",
                            boxShadow:
                                "0 2px 6px rgba(0,0,0,0.08)"
                        }}
                    >

                        <h3
                            style={{
                                marginTop: 0
                            }}
                        >
                            Filters
                        </h3>


                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                flexWrap: "wrap",
                                alignItems: "center"
                            }}
                        >

                            {/* SEARCH */}

                            <input
                                type="text"
                                placeholder="Search asset..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                style={{
                                    padding: "10px",
                                    width: "220px",
                                    border:
                                        "1px solid #ccc",
                                    borderRadius: "6px"
                                }}
                            />


                            {/* STATUS */}

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value)
                                }
                                style={{
                                    padding: "10px",
                                    minWidth: "160px",
                                    border:
                                        "1px solid #ccc",
                                    borderRadius: "6px"
                                }}
                            >

                                <option value="">
                                    All Status
                                </option>

                                <option value="In Stock">
                                    In Stock
                                </option>

                                <option value="Assigned">
                                    Assigned
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


                            {/* CATEGORY */}

                            <select
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(
                                        e.target.value
                                    )
                                }
                                style={{
                                    padding: "10px",
                                    minWidth: "180px",
                                    border:
                                        "1px solid #ccc",
                                    borderRadius: "6px"
                                }}
                            >

                                <option value="">
                                    All Categories
                                </option>

                                {categories.map(
                                    (category) => (

                                        <option
                                            key={
                                                category.category_id
                                            }
                                            value={
                                                category.category_id
                                            }
                                        >
                                            {
                                                category.category_name
                                            }
                                        </option>

                                    )
                                )}

                            </select>


                            {/* EMPLOYEE */}

                            <select
                                value={employeeId}
                                onChange={(e) =>
                                    setEmployeeId(
                                        e.target.value
                                    )
                                }
                                style={{
                                    padding: "10px",
                                    minWidth: "200px",
                                    border:
                                        "1px solid #ccc",
                                    borderRadius: "6px"
                                }}
                            >

                                <option value="">
                                    All Employees
                                </option>

                                {employees.map(
                                    (employee) => (

                                        <option
                                            key={
                                                employee.employee_id
                                            }
                                            value={
                                                employee.employee_id
                                            }
                                        >
                                            {
                                                employee.display_name
                                            }
                                        </option>

                                    )
                                )}

                            </select>


                            {/* CLEAR */}

                            <button
                                onClick={clearFilters}
                                style={{
                                    padding: "10px 16px",
                                    border:
                                        "1px solid #ccc",
                                    borderRadius: "6px",
                                    background: "#fff",
                                    cursor: "pointer"
                                }}
                            >
                                Clear
                            </button>

                        </div>

                    </div>


                    {/* =====================================================
                        REPORT TABLE
                    ===================================================== */}

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "10px",
                            overflow: "auto",
                            boxShadow:
                                "0 2px 6px rgba(0,0,0,0.08)"
                        }}
                    >

                        <div
                            style={{
                                padding: "20px",
                                borderBottom:
                                    "1px solid #eee"
                            }}
                        >

                            <h3
                                style={{
                                    margin: 0
                                }}
                            >
                                Asset Report
                            </h3>

                            <p
                                style={{
                                    marginBottom: 0,
                                    color: "#666"
                                }}
                            >
                                {assets.length} asset(s) found
                            </p>

                        </div>


                        <table
                            style={{
                                width: "100%",
                                borderCollapse:
                                    "collapse",
                                minWidth: "1800px"
                            }}
                        >

                            <thead>

                                <tr
                                    style={{
                                        background:
                                            "#f8f9fa"
                                    }}
                                >

                                    <th style={thStyle}>
                                        ID
                                    </th>

                                    <th style={thStyle}>
                                        Asset Code
                                    </th>

                                    <th style={thStyle}>
                                        Asset
                                    </th>

                                    <th style={thStyle}>
                                        Category
                                    </th>

                                    <th style={thStyle}>
                                        Brand
                                    </th>

                                    <th style={thStyle}>
                                        Model
                                    </th>

                                    <th style={thStyle}>
                                        Serial Number
                                    </th>

                                    <th style={thStyle}>
                                        Employee
                                    </th>

                                    <th style={thStyle}>
                                        Employee Code
                                    </th>

                                    <th style={thStyle}>
                                        Vendor
                                    </th>

                                    <th style={thStyle}>
                                        Location
                                    </th>

                                    <th style={thStyle}>
                                        Floor
                                    </th>

                                    <th style={thStyle}>
                                        Purchase Date
                                    </th>

                                    <th style={thStyle}>
                                        Purchase Cost
                                    </th>

                                    <th style={thStyle}>
                                        Warranty Expiry
                                    </th>

                                    <th style={thStyle}>
                                        Warranty Status
                                    </th>

                                    <th style={thStyle}>
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="17"
                                            style={{
                                                padding:
                                                    "30px",
                                                textAlign:
                                                    "center"
                                            }}
                                        >
                                            Loading report...
                                        </td>

                                    </tr>

                                ) : assets.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="17"
                                            style={{
                                                padding:
                                                    "30px",
                                                textAlign:
                                                    "center"
                                            }}
                                        >
                                            No assets found
                                        </td>

                                    </tr>

                                ) : (

                                    assets.map(
                                        (asset) => (

                                            <tr
                                                key={
                                                    asset.asset_id
                                                }
                                            >

                                                <td style={tdStyle}>
                                                    {
                                                        asset.asset_id
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.asset_code
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.asset_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.category_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.brand ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.model ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.serial_number ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.employee_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.employee_code ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.vendor_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.location_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.floor ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        formatDate(
                                                            asset.purchase_date
                                                        )
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        formatCost(
                                                            asset.purchase_cost
                                                        )
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        formatDate(
                                                            asset.warranty_expiry
                                                        )
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.warranty_status ||
                                                        "Unknown"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    <span
                                                        style={{
                                                            padding:
                                                                "5px 10px",
                                                            borderRadius:
                                                                "20px",
                                                            fontSize:
                                                                "12px",
                                                            background:
                                                                "#eef2ff"
                                                        }}
                                                    >
                                                        {
                                                            asset.asset_status
                                                        }
                                                    </span>
                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}


// =====================================================
// TABLE STYLES
// =====================================================

const thStyle = {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    whiteSpace: "nowrap",
    fontSize: "13px"
};


const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #eee",
    whiteSpace: "nowrap",
    fontSize: "13px"
};


export default Reports;