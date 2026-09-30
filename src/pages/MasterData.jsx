import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

const sectionStyle = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    marginBottom: "24px",
    overflow: "hidden",
};

const sectionHeaderStyle = {
    padding: "18px 22px",
    borderBottom: "1px solid #e5e7eb",
    background: "#f8fafc",
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
};

const thStyle = {
    textAlign: "left",
    padding: "12px 16px",
    background: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
};

const tdStyle = {
    padding: "13px 16px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#334155",
};

const statusStyle = (status) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    background:
        String(status).toLowerCase() === "active"
            ? "#dcfce7"
            : "#fee2e2",
    color:
        String(status).toLowerCase() === "active"
            ? "#166534"
            : "#991b1b",
});

function MasterData() {
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [locations, setLocations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getToken = () => {
        return (
            localStorage.getItem("token") ||
            sessionStorage.getItem("token") ||
            ""
        );
    };

    const fetchData = async (endpoint) => {
        const token = getToken();

        const response = await fetch(
            `${API_URL}${endpoint}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to load ${endpoint}`
            );
        }

        const result = await response.json();

        return result.data || [];
    };

    const loadMasterData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                categoryData,
                departmentData,
                designationData,
                locationData,
            ] = await Promise.all([
                fetchData("/api/categories"),
                fetchData("/api/departments"),
                fetchData("/api/designations"),
                fetchData("/api/locations"),
            ]);

            setCategories(categoryData);
            setDepartments(departmentData);
            setDesignations(designationData);
            setLocations(locationData);
        } catch (err) {
            console.error(err);

            setError(
                "Unable to load master data. Please check the server connection."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMasterData();
    }, []);

    const renderEmpty = (message) => (
        <div
            style={{
                padding: "30px",
                textAlign: "center",
                color: "#64748b",
                fontSize: "14px",
            }}
        >
            {message}
        </div>
    );

    const renderStatus = (status) => (
        <span style={statusStyle(status)}>
            {status || "Unknown"}
        </span>
    );

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f1f5f9",
            }}
        >
            <Sidebar />

            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                }}
            >
                <Navbar />

                <main
                    style={{
                        padding: "28px",
                    }}
                >
                    {/* PAGE HEADER */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px",
                            gap: "16px",
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "26px",
                                    fontWeight: "700",
                                    color: "#0f172a",
                                }}
                            >
                                Master Data
                            </h1>

                            <p
                                style={{
                                    margin: "6px 0 0",
                                    color: "#64748b",
                                    fontSize: "14px",
                                }}
                            >
                                View categories, departments,
                                designations and office locations.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadMasterData}
                            disabled={loading}
                            style={{
                                border: "none",
                                borderRadius: "8px",
                                padding: "10px 16px",
                                background: "#0891b2",
                                color: "#ffffff",
                                fontWeight: "600",
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading
                                ? "Refreshing..."
                                : "↻ Refresh"}
                        </button>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div
                            style={{
                                marginBottom: "20px",
                                padding: "14px 16px",
                                borderRadius: "8px",
                                background: "#fef2f2",
                                border: "1px solid #fecaca",
                                color: "#b91c1c",
                                fontSize: "14px",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div
                            style={{
                                background: "#ffffff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                padding: "50px",
                                textAlign: "center",
                                color: "#64748b",
                            }}
                        >
                            Loading master data...
                        </div>
                    ) : (
                        <>
                            {/* CATEGORIES */}
                            <section style={sectionStyle}>
                                <div style={sectionHeaderStyle}>
                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: "18px",
                                            color: "#0f172a",
                                        }}
                                    >
                                        Categories
                                    </h2>

                                    <p
                                        style={{
                                            margin:
                                                "5px 0 0",
                                            fontSize: "13px",
                                            color: "#64748b",
                                        }}
                                    >
                                        Asset categories configured
                                        in the system
                                    </p>
                                </div>

                                {categories.length === 0 ? (
                                    renderEmpty(
                                        "No categories found."
                                    )
                                ) : (
                                    <div
                                        style={{
                                            overflowX: "auto",
                                        }}
                                    >
                                        <table style={tableStyle}>
                                            <thead>
                                                <tr>
                                                    <th style={thStyle}>
                                                        Code
                                                    </th>
                                                    <th style={thStyle}>
                                                        Category Name
                                                    </th>
                                                    <th style={thStyle}>
                                                        Description
                                                    </th>
                                                    <th style={thStyle}>
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {categories.map(
                                                    (item) => (
                                                        <tr
                                                            key={
                                                                item.category_id
                                                            }
                                                        >
                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {item.category_code ||
                                                                    "-"}
                                                            </td>

                                                            <td
                                                                style={{
                                                                    ...tdStyle,
                                                                    fontWeight:
                                                                        "600",
                                                                }}
                                                            >
                                                                {item.category_name ||
                                                                    "-"}
                                                            </td>

                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {item.description ||
                                                                    "-"}
                                                            </td>

                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {renderStatus(
                                                                    item.status
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>

                            {/* DEPARTMENTS */}
                            <section style={sectionStyle}>
                                <div style={sectionHeaderStyle}>
                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: "18px",
                                            color: "#0f172a",
                                        }}
                                    >
                                        Departments
                                    </h2>

                                    <p
                                        style={{
                                            margin:
                                                "5px 0 0",
                                            fontSize: "13px",
                                            color: "#64748b",
                                        }}
                                    >
                                        Departments available in
                                        the organization
                                    </p>
                                </div>

                                {departments.length === 0 ? (
                                    renderEmpty(
                                        "No departments found."
                                    )
                                ) : (
                                    <div
                                        style={{
                                            overflowX: "auto",
                                        }}
                                    >
                                        <table style={tableStyle}>
                                            <thead>
                                                <tr>
                                                    <th style={thStyle}>
                                                        Code
                                                    </th>
                                                    <th style={thStyle}>
                                                        Department Name
                                                    </th>
                                                    <th style={thStyle}>
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {departments.map(
                                                    (item) => (
                                                        <tr
                                                            key={
                                                                item.department_id
                                                            }
                                                        >
                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {item.department_code ||
                                                                    "-"}
                                                            </td>

                                                            <td
                                                                style={{
                                                                    ...tdStyle,
                                                                    fontWeight:
                                                                        "600",
                                                                }}
                                                            >
                                                                {item.department_name ||
                                                                    "-"}
                                                            </td>

                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {renderStatus(
                                                                    item.status
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>

                            {/* DESIGNATIONS */}
                            <section style={sectionStyle}>
                                <div style={sectionHeaderStyle}>
                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: "18px",
                                            color: "#0f172a",
                                        }}
                                    >
                                        Designations
                                    </h2>

                                    <p
                                        style={{
                                            margin:
                                                "5px 0 0",
                                            fontSize: "13px",
                                            color: "#64748b",
                                        }}
                                    >
                                        Employee designations
                                        configured in the system
                                    </p>
                                </div>

                                {designations.length === 0 ? (
                                    renderEmpty(
                                        "No designations found."
                                    )
                                ) : (
                                    <div
                                        style={{
                                            overflowX: "auto",
                                        }}
                                    >
                                        <table style={tableStyle}>
                                            <thead>
                                                <tr>
                                                    <th style={thStyle}>
                                                        Code
                                                    </th>
                                                    <th style={thStyle}>
                                                        Designation Name
                                                    </th>
                                                    <th style={thStyle}>
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {designations.map(
                                                    (item) => (
                                                        <tr
                                                            key={
                                                                item.designation_id
                                                            }
                                                        >
                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {item.designation_code ||
                                                                    "-"}
                                                            </td>

                                                            <td
                                                                style={{
                                                                    ...tdStyle,
                                                                    fontWeight:
                                                                        "600",
                                                                }}
                                                            >
                                                                {item.designation_name ||
                                                                    "-"}
                                                            </td>

                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {renderStatus(
                                                                    item.status
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>

                            {/* LOCATIONS */}
                            <section style={sectionStyle}>
                                <div style={sectionHeaderStyle}>
                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: "18px",
                                            color: "#0f172a",
                                        }}
                                    >
                                        Office Locations
                                    </h2>

                                    <p
                                        style={{
                                            margin:
                                                "5px 0 0",
                                            fontSize: "13px",
                                            color: "#64748b",
                                        }}
                                    >
                                        Office and business
                                        locations
                                    </p>
                                </div>

                                {locations.length === 0 ? (
                                    renderEmpty(
                                        "No office locations found."
                                    )
                                ) : (
                                    <div
                                        style={{
                                            overflowX: "auto",
                                        }}
                                    >
                                        <table style={tableStyle}>
                                            <thead>
                                                <tr>
                                                    <th style={thStyle}>
                                                        Code
                                                    </th>
                                                    <th style={thStyle}>
                                                        Location Name
                                                    </th>
                                                    <th style={thStyle}>
                                                        City
                                                    </th>
                                                    <th style={thStyle}>
                                                        State
                                                    </th>
                                                    <th style={thStyle}>
                                                        Country
                                                    </th>
                                                    <th style={thStyle}>
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {locations.map(
                                                    (item) => (
                                                        <tr
                                                            key={
                                                                item.location_id
                                                            }
                                                        >
                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {item.location_code ||
                                                                    "-"}
                                                            </td>

                                                            <td
                                                                style={{
                                                                    ...tdStyle,
                                                                    fontWeight:
                                                                        "600",
                                                                }}
                                                            >
                                                                {item.location_name ||
                                                                    "-"}
                                                            </td>

                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {item.city ||
                                                                    "-"}
                                                            </td>

                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {item.state ||
                                                                    "-"}
                                                            </td>

                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {item.country ||
                                                                    "-"}
                                                            </td>

                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {renderStatus(
                                                                    item.status
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default MasterData;