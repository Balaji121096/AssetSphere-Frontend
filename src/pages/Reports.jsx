import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Reports() {

    const [reportType, setReportType] = useState("all");

    const [summary, setSummary] = useState(null);

    const [data, setData] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const reportEndpoints = {
        all: "/reports/assets",
        assigned: "/reports/assigned",
        scrap: "/reports/scrap",
        repair: "/reports/repair",
        employee: "/reports/employee-assets"
    };


    // =====================================================
    // LOAD SUMMARY
    // =====================================================

    const loadSummary = async () => {

        try {

            const response =
                await API.get(
                    "/reports/assets/summary"
                );

            setSummary(
                response.data.data || null
            );

        } catch (error) {

            console.error(
                "Report Summary Error:",
                error
            );

        }
    };


    // =====================================================
    // LOAD REPORT
    // =====================================================

    const loadReport = async () => {

        try {

            setLoading(true);

            const response =
                await API.get(
                    reportEndpoints[reportType]
                );

            setData(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Report Load Error:",
                error
            );

            alert(
                error.response?.data?.message ||
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

        loadSummary();

    }, []);


    // =====================================================
    // REPORT TYPE CHANGE
    // =====================================================

    useEffect(() => {

        loadReport();

    }, [reportType]);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredData = data.filter((item) => {

        const text = Object.values(item)
            .join(" ")
            .toLowerCase();

        return text.includes(
            search.toLowerCase()
        );

    });


    // =====================================================
    // FORMAT DATE
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
    // FORMAT COST
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
                currency: "INR"
            }
        );

    };


    // =====================================================
    // REPORT TITLE
    // =====================================================

    const getReportTitle = () => {

        switch (reportType) {

            case "assigned":
                return "Assigned Assets Report";

            case "scrap":
                return "Scrap Assets Report";

            case "repair":
                return "Repair Assets Report";

            case "employee":
                return "Employee Assets Report";

            default:
                return "All Assets Report";
        }

    };


    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f5f5f5"
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
                            marginBottom: "20px"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    margin: 0
                                }}
                            >
                                Reports
                            </h1>

                            <p
                                style={{
                                    color: "#666"
                                }}
                            >
                                AssetSphere reports and asset analysis
                            </p>

                        </div>


                        <button
                            onClick={() => {
                                loadSummary();
                                loadReport();
                            }}
                            style={{
                                padding: "10px 18px",
                                border: "none",
                                borderRadius: "6px",
                                background: "#2563eb",
                                color: "#fff",
                                cursor: "pointer"
                            }}
                        >
                            Refresh
                        </button>

                    </div>


                    {/* =====================================================
                        SUMMARY CARDS
                    ===================================================== */}

                    {summary && (

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(3, 1fr)",
                                gap: "15px",
                                marginBottom: "25px"
                            }}
                        >

                            <div style={cardStyle}>
                                <span>Total Assets</span>
                                <h2>
                                    {summary.total_assets}
                                </h2>
                            </div>


                            <div style={cardStyle}>
                                <span>Assigned</span>
                                <h2>
                                    {summary.assigned_assets}
                                </h2>
                            </div>


                            <div style={cardStyle}>
                                <span>In Stock</span>
                                <h2>
                                    {summary.in_stock_assets}
                                </h2>
                            </div>


                            <div style={cardStyle}>
                                <span>Repair</span>
                                <h2>
                                    {summary.repair_assets}
                                </h2>
                            </div>


                            <div style={cardStyle}>
                                <span>Scrap</span>
                                <h2>
                                    {summary.scrap_assets}
                                </h2>
                            </div>


                            <div style={cardStyle}>
                                <span>Lost</span>
                                <h2>
                                    {summary.lost_assets}
                                </h2>
                            </div>

                        </div>

                    )}


                    {/* =====================================================
                        REPORT CONTROLS
                    ===================================================== */}

                    <div
                        style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "10px",
                            marginBottom: "20px"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                gap: "15px",
                                flexWrap: "wrap"
                            }}
                        >

                            <select
                                value={reportType}
                                onChange={(e) =>
                                    setReportType(
                                        e.target.value
                                    )
                                }
                                style={inputStyle}
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

                                <option value="employee">
                                    Employee Assets
                                </option>

                            </select>


                            <input
                                type="text"
                                placeholder="Search report..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                style={{
                                    ...inputStyle,
                                    width: "300px"
                                }}
                            />

                        </div>

                    </div>


                    {/* =====================================================
                        REPORT TABLE
                    ===================================================== */}

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "10px",
                            overflow: "auto"
                        }}
                    >

                        <div
                            style={{
                                padding: "20px",
                                borderBottom:
                                    "1px solid #eee"
                            }}
                        >

                            <h2
                                style={{
                                    margin: 0
                                }}
                            >
                                {getReportTitle()}
                            </h2>

                            <p
                                style={{
                                    color: "#666"
                                }}
                            >
                                {filteredData.length} record(s)
                            </p>

                        </div>


                        {loading ? (

                            <div
                                style={{
                                    padding: "30px",
                                    textAlign: "center"
                                }}
                            >
                                Loading report...
                            </div>

                        ) : filteredData.length === 0 ? (

                            <div
                                style={{
                                    padding: "30px",
                                    textAlign: "center"
                                }}
                            >
                                No records found
                            </div>

                        ) : (

                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse:
                                        "collapse",
                                    minWidth: "1000px"
                                }}
                            >

                                <thead>

                                    <tr>

                                        <th style={thStyle}>
                                            ID
                                        </th>

                                        <th style={thStyle}>
                                            Asset Code
                                        </th>

                                        <th style={thStyle}>
                                            Asset Name
                                        </th>

                                        <th style={thStyle}>
                                            Category
                                        </th>

                                        <th style={thStyle}>
                                            Employee
                                        </th>

                                        <th style={thStyle}>
                                            Vendor
                                        </th>

                                        <th style={thStyle}>
                                            Location
                                        </th>

                                        <th style={thStyle}>
                                            Purchase Date
                                        </th>

                                        <th style={thStyle}>
                                            Cost
                                        </th>

                                        <th style={thStyle}>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredData.map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item.asset_id ||
                                                    item.employee_id
                                                }
                                            >

                                                <td style={tdStyle}>
                                                    {
                                                        item.asset_id ??
                                                        item.employee_id ??
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        item.asset_code ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        item.asset_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        item.category_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        item.employee_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        item.vendor_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        item.location_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        formatDate(
                                                            item.purchase_date
                                                        )
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        formatCost(
                                                            item.purchase_cost
                                                        )
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        item.asset_status ||
                                                        "-"
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );
}


// =====================================================
// STYLES
// =====================================================

const cardStyle = {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow:
        "0 2px 5px rgba(0,0,0,0.1)"
};


const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    minWidth: "220px"
};


const thStyle = {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    whiteSpace: "nowrap"
};


const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #eee",
    whiteSpace: "nowrap"
};


export default Reports;