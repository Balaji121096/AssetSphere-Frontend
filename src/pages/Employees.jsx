// src/pages/Employees.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Employees() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);

    const employeesPerPage = 10;

    // =====================================================
    // LOAD EMPLOYEES
    // =====================================================

    const loadEmployees = async () => {
        try {
            setLoading(true);

            const response = await API.get("/employees");

            console.log(
                "Employees API Response:",
                response.data
            );

            const employeeData =
                response.data?.data || [];

            setEmployees(employeeData);

            const newTotalPages = Math.max(
                1,
                Math.ceil(
                    employeeData.length /
                    employeesPerPage
                )
            );

            setCurrentPage((page) => {
                if (page > newTotalPages) {
                    return newTotalPages;
                }

                return page;
            });

        } catch (error) {
            console.error(
                "Employees API Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load employees"
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadEmployees();
    }, []);

    // =====================================================
    // FULL PAGE REFRESH
    // =====================================================

    const handleRefresh = () => {
        window.location.reload();
    };

    // =====================================================
    // DELETE EMPLOYEE
    // =====================================================

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await API.delete(
                `/employees/${id}`
            );

            alert(
                "Employee deleted successfully"
            );

            await loadEmployees();

        } catch (error) {
            console.error(
                "Delete Employee Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete employee"
            );
        }
    };

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredEmployees = employees.filter(
        (employee) => {

            const text = `
                ${employee.employee_id || ""}
                ${employee.employee_code || ""}
                ${employee.display_name || ""}
                ${employee.official_email || ""}
                ${employee.mobile_number || ""}
                ${employee.department_name || ""}
                ${employee.designation_name || ""}
                ${employee.work_location || ""}
                ${employee.employment_type || ""}
                ${employee.status || ""}
            `.toLowerCase();

            return text.includes(
                search.toLowerCase()
            );
        }
    );

    // =====================================================
    // RESET PAGE ON SEARCH
    // =====================================================

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredEmployees.length /
            employeesPerPage
        )
    );

    const startIndex =
        (currentPage - 1) *
        employeesPerPage;

    const currentEmployees =
        filteredEmployees.slice(
            startIndex,
            startIndex + employeesPerPage
        );

    const goToPage = (page) => {
        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =====================================================
    // COUNTS
    // =====================================================

    const activeCount = employees.filter(
        (employee) =>
            employee.status === "Active"
    ).length;

    const inactiveCount =
        employees.length - activeCount;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div style={pageStyle}>

            <Sidebar />

            <div style={mainStyle}>

                <Navbar />

                <main style={contentStyle}>

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div style={headerStyle}>

                        <div>

                            <div style={eyebrowStyle}>
                                PEOPLE MANAGEMENT
                            </div>

                            <h1 style={titleStyle}>
                                Employees
                            </h1>

                            <p style={subtitleStyle}>
                                Manage company employees
                                and their information
                            </p>

                        </div>

                        <div style={headerButtonsStyle}>

                            {/* =================================================
                                REFRESH
                            ================================================= */}

                            <button
                                type="button"
                                onClick={handleRefresh}
                                style={refreshButtonStyle}
                            >

                                <span
                                    style={buttonIconStyle}
                                >
                                    ↻
                                </span>

                                Refresh

                            </button>


                            {/* =================================================
                                ADD EMPLOYEE
                            ================================================= */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/employees/add"
                                    )
                                }
                                style={addButtonStyle}
                            >

                                <span
                                    style={plusStyle}
                                >
                                    +
                                </span>

                                Add Employee

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <div style={summaryGridStyle}>

                        <SummaryCard
                            title="Total Employees"
                            value={
                                employees.length
                            }
                            icon="👥"
                            color="#2563eb"
                            background="#eff6ff"
                        />

                        <SummaryCard
                            title="Active Employees"
                            value={
                                activeCount
                            }
                            icon="✓"
                            color="#16a34a"
                            background="#f0fdf4"
                        />

                        <SummaryCard
                            title="Inactive Employees"
                            value={
                                inactiveCount
                            }
                            icon="○"
                            color="#f97316"
                            background="#fff7ed"
                        />

                    </div>


                    {/* =================================================
                        TABLE CARD
                    ================================================= */}

                    <div style={tableCardStyle}>

                        {/* =================================================
                            TABLE TOP
                        ================================================= */}

                        <div style={tableTopStyle}>

                            <div>

                                <h2
                                    style={
                                        tableTitleStyle
                                    }
                                >
                                    Employee Directory
                                </h2>

                                <p
                                    style={
                                        tableSubtitleStyle
                                    }
                                >
                                    {
                                        filteredEmployees.length
                                    }{" "}
                                    employee
                                    {
                                        filteredEmployees.length !==
                                        1
                                            ? "s"
                                            : ""
                                    }{" "}
                                    found
                                </p>

                            </div>


                            {/* =================================================
                                SEARCH
                            ================================================= */}

                            <div
                                style={
                                    searchWrapperStyle
                                }
                            >

                                <span
                                    style={
                                        searchIconStyle
                                    }
                                >
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    style={
                                        searchInputStyle
                                    }
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        style={
                                            clearButtonStyle
                                        }
                                    >
                                        ×
                                    </button>
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div
                            style={
                                tableWrapperStyle
                            }
                        >

                            <table
                                style={
                                    tableStyle
                                }
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
                                            Employee
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Contact
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
                                            Designation
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
                                            Status
                                        </th>

                                        <th
                                            style={{
                                                ...thStyle,
                                                textAlign:
                                                    "center"
                                            }}
                                        >
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {/* =================================================
                                        LOADING
                                    ================================================= */}

                                    {loading ? (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                style={
                                                    emptyStyle
                                                }
                                            >

                                                <div
                                                    style={
                                                        loaderStyle
                                                    }
                                                >
                                                    <div
                                                        style={
                                                            spinnerStyle
                                                        }
                                                    />
                                                </div>

                                                Loading employees...

                                            </td>

                                        </tr>

                                    ) : currentEmployees.length === 0 ? (

                                        /* =================================================
                                            EMPTY
                                        ================================================= */

                                        <tr>

                                            <td
                                                colSpan="8"
                                                style={
                                                    emptyStyle
                                                }
                                            >

                                                <div
                                                    style={
                                                        emptyIconStyle
                                                    }
                                                >
                                                    👤
                                                </div>

                                                <strong>
                                                    No employees found
                                                </strong>

                                                <p
                                                    style={{
                                                        margin:
                                                            "6px 0 0",
                                                        color:
                                                            "#94a3b8"
                                                    }}
                                                >
                                                    Try changing
                                                    your search
                                                </p>

                                            </td>

                                        </tr>

                                    ) : (

                                        currentEmployees.map(
                                            (employee) => (

                                                <tr
                                                    key={
                                                        employee.employee_id
                                                    }
                                                    style={
                                                        rowStyle
                                                    }
                                                    onMouseEnter={(
                                                        e
                                                    ) => {
                                                        e.currentTarget.style.background =
                                                            "#f8fafc";
                                                    }}
                                                    onMouseLeave={(
                                                        e
                                                    ) => {
                                                        e.currentTarget.style.background =
                                                            "#ffffff";
                                                    }}
                                                >

                                                    {/* =================================================
                                                        ID
                                                    ================================================= */}

                                                    <td
                                                        style={{
                                                            ...tdStyle,
                                                            color:
                                                                "#64748b"
                                                        }}
                                                    >
                                                        #
                                                        {
                                                            employee.employee_id
                                                        }
                                                    </td>


                                                    {/* =================================================
                                                        EMPLOYEE
                                                    ================================================= */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                employeeCellStyle
                                                            }
                                                        >

                                                            <div
                                                                style={
                                                                    avatarStyle
                                                                }
                                                            >
                                                                {(
                                                                    employee.display_name ||
                                                                    "E"
                                                                )
                                                                    .charAt(
                                                                        0
                                                                    )
                                                                    .toUpperCase()}
                                                            </div>

                                                            <div>

                                                                <div
                                                                    style={
                                                                        employeeNameStyle
                                                                    }
                                                                >
                                                                    {
                                                                        employee.display_name ||
                                                                        "-"
                                                                    }
                                                                </div>

                                                                <div
                                                                    style={
                                                                        employeeCodeStyle
                                                                    }
                                                                >
                                                                    {
                                                                        employee.employee_code ||
                                                                        "No code"
                                                                    }
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* =================================================
                                                        CONTACT
                                                    ================================================= */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                contactStyle
                                                            }
                                                        >

                                                            <span>
                                                                {
                                                                    employee.official_email ||
                                                                    "-"
                                                                }
                                                            </span>

                                                            <span
                                                                style={
                                                                    mobileStyle
                                                                }
                                                            >
                                                                {
                                                                    employee.mobile_number ||
                                                                    "-"
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* =================================================
                                                        DEPARTMENT
                                                    ================================================= */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <span
                                                            style={
                                                                normalTextStyle
                                                            }
                                                        >
                                                            {
                                                                employee.department_name ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* =================================================
                                                        DESIGNATION
                                                    ================================================= */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            employee.designation_name ||
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* =================================================
                                                        LOCATION
                                                    ================================================= */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <span
                                                            style={
                                                                locationBadgeStyle
                                                            }
                                                        >
                                                            📍{" "}
                                                            {
                                                                employee.work_location ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* =================================================
                                                        STATUS
                                                    ================================================= */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <span
                                                            style={{
                                                                ...statusBadgeStyle,
                                                                background:
                                                                    employee.status ===
                                                                    "Active"
                                                                        ? "#dcfce7"
                                                                        : "#fee2e2",
                                                                color:
                                                                    employee.status ===
                                                                    "Active"
                                                                        ? "#15803d"
                                                                        : "#b91c1c"
                                                            }}
                                                        >

                                                            <span
                                                                style={{
                                                                    width:
                                                                        "6px",
                                                                    height:
                                                                        "6px",
                                                                    borderRadius:
                                                                        "50%",
                                                                    background:
                                                                        "currentColor"
                                                                }}
                                                            />

                                                            {
                                                                employee.status ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* =================================================
                                                        ACTIONS
                                                    ================================================= */}

                                                    <td
                                                        style={{
                                                            ...tdStyle,
                                                            textAlign:
                                                                "center"
                                                        }}
                                                    >

                                                        <div
                                                            style={
                                                                actionStyle
                                                            }
                                                        >

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/employees/edit/${employee.employee_id}`
                                                                    )
                                                                }
                                                                style={
                                                                    editButtonStyle
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        employee.employee_id
                                                                    )
                                                                }
                                                                style={
                                                                    deleteButtonStyle
                                                                }
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        {!loading &&
                            filteredEmployees.length >
                                0 && (

                                <div
                                    style={
                                        paginationStyle
                                    }
                                >

                                    <span
                                        style={
                                            showingStyle
                                        }
                                    >

                                        Showing{" "}

                                        <strong>
                                            {
                                                startIndex +
                                                1
                                            }
                                        </strong>

                                        {" "}to{" "}

                                        <strong>
                                            {Math.min(
                                                startIndex +
                                                    employeesPerPage,
                                                filteredEmployees.length
                                            )}
                                        </strong>

                                        {" "}of{" "}

                                        <strong>
                                            {
                                                filteredEmployees.length
                                            }
                                        </strong>

                                    </span>


                                    <div
                                        style={
                                            paginationButtonsStyle
                                        }
                                    >

                                        <button
                                            type="button"
                                            onClick={() =>
                                                goToPage(
                                                    currentPage -
                                                        1
                                                )
                                            }
                                            disabled={
                                                currentPage ===
                                                1
                                            }
                                            style={{
                                                ...pageButtonStyle,
                                                opacity:
                                                    currentPage ===
                                                    1
                                                        ? 0.45
                                                        : 1
                                            }}
                                        >
                                            ← Previous
                                        </button>


                                        <span
                                            style={
                                                currentPageStyle
                                            }
                                        >
                                            {
                                                currentPage
                                            }{" "}
                                            /{" "}
                                            {
                                                totalPages
                                            }
                                        </span>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                goToPage(
                                                    currentPage +
                                                        1
                                                )
                                            }
                                            disabled={
                                                currentPage ===
                                                totalPages
                                            }
                                            style={{
                                                ...pageButtonStyle,
                                                opacity:
                                                    currentPage ===
                                                    totalPages
                                                        ? 0.45
                                                        : 1
                                            }}
                                        >
                                            Next →
                                        </button>

                                    </div>

                                </div>

                            )}

                    </div>

                </main>

            </div>


            {/* =================================================
                SPINNER ANIMATION
            ================================================= */}

            <style>
                {`
                    @keyframes spin {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
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
    icon,
    color,
    background
}) {
    return (
        <div
            style={
                summaryCardStyle
            }
        >

            <div
                style={{
                    ...summaryIconStyle,
                    color,
                    background
                }}
            >
                {icon}
            </div>

            <div>

                <div
                    style={
                        summaryTitleStyle
                    }
                >
                    {title}
                </div>

                <div
                    style={
                        summaryValueStyle
                    }
                >
                    {value}
                </div>

            </div>

        </div>
    );
}


/* =====================================================
   STYLES
===================================================== */

const pageStyle = {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a"
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

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "28px"
};

const eyebrowStyle = {
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    marginBottom: "7px"
};

const titleStyle = {
    margin: 0,
    fontSize: "32px",
    fontWeight: "750",
    letterSpacing: "-0.8px"
};

const subtitleStyle = {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px"
};

const headerButtonsStyle = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
};

const refreshButtonStyle = {
    height: "42px",
    padding: "0 16px",
    border: "1px solid #dbe2ea",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer"
};

const buttonIconStyle = {
    fontSize: "18px",
    marginRight: "6px"
};

const addButtonStyle = {
    height: "42px",
    padding: "0 18px",
    border: "none",
    borderRadius: "9px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow:
        "0 4px 10px rgba(37,99,235,0.18)"
};

const plusStyle = {
    fontSize: "18px",
    marginRight: "6px"
};

const summaryGridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(3, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "22px"
};

const summaryCardStyle = {
    background: "#ffffff",
    border: "1px solid #e8edf3",
    borderRadius: "12px",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow:
        "0 2px 8px rgba(15,23,42,0.035)"
};

const summaryIconStyle = {
    width: "44px",
    height: "44px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: "700"
};

const summaryTitleStyle = {
    color: "#64748b",
    fontSize: "12px",
    marginBottom: "4px"
};

const summaryValueStyle = {
    fontSize: "24px",
    fontWeight: "750",
    color: "#0f172a"
};

const tableCardStyle = {
    background: "#ffffff",
    border: "1px solid #e5eaf0",
    borderRadius: "14px",
    boxShadow:
        "0 4px 14px rgba(15,23,42,0.04)",
    overflow: "hidden"
};

const tableTopStyle = {
    padding: "20px 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    borderBottom:
        "1px solid #edf1f5"
};

const tableTitleStyle = {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700"
};

const tableSubtitleStyle = {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "12px"
};

const searchWrapperStyle = {
    width: "320px",
    maxWidth: "100%",
    height: "42px",
    display: "flex",
    alignItems: "center",
    background: "#f8fafc",
    border: "1px solid #dbe2ea",
    borderRadius: "9px",
    padding: "0 11px",
    boxSizing: "border-box"
};

const searchIconStyle = {
    color: "#94a3b8",
    fontSize: "20px",
    marginRight: "7px"
};

const searchInputStyle = {
    flex: 1,
    minWidth: 0,
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "13px",
    color: "#0f172a"
};

const clearButtonStyle = {
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: "19px",
    cursor: "pointer"
};

const tableWrapperStyle = {
    width: "100%",
    overflowX: "auto"
};

const tableStyle = {
    width: "100%",
    minWidth: "1100px",
    borderCollapse: "collapse"
};

const thStyle = {
    padding: "13px 16px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom:
        "1px solid #e8edf3",
    whiteSpace: "nowrap"
};

const tdStyle = {
    padding: "14px 16px",
    color: "#475569",
    fontSize: "13px",
    borderBottom:
        "1px solid #f0f2f5",
    verticalAlign: "middle"
};

const rowStyle = {
    background: "#ffffff",
    transition:
        "background 0.15s"
};

const employeeCellStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px"
};

const avatarStyle = {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    flexShrink: 0
};

const employeeNameStyle = {
    color: "#1e293b",
    fontSize: "13px",
    fontWeight: "650"
};

const employeeCodeStyle = {
    color: "#94a3b8",
    fontSize: "11px",
    marginTop: "3px"
};

const contactStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "3px"
};

const mobileStyle = {
    color: "#94a3b8",
    fontSize: "11px"
};

const normalTextStyle = {
    color: "#334155",
    fontWeight: "500"
};

const locationBadgeStyle = {
    color: "#475569",
    fontSize: "12px"
};

const statusBadgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "650"
};

const actionStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "7px"
};

const editButtonStyle = {
    padding: "7px 11px",
    border: "1px solid #dbe2ea",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer"
};

const deleteButtonStyle = {
    padding: "7px 11px",
    border: "1px solid #fecaca",
    borderRadius: "7px",
    background: "#fff5f5",
    color: "#dc2626",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer"
};

const emptyStyle = {
    padding: "55px 20px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "13px"
};

const emptyIconStyle = {
    fontSize: "32px",
    marginBottom: "10px",
    opacity: 0.6
};

const loaderStyle = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "12px"
};

const spinnerStyle = {
    width: "22px",
    height: "22px",
    border: "3px solid #dbeafe",
    borderTop:
        "3px solid #2563eb",
    borderRadius: "50%"
};

const paginationStyle = {
    padding: "16px 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap"
};

const showingStyle = {
    color: "#64748b",
    fontSize: "12px"
};

const paginationButtonsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "7px"
};

const pageButtonStyle = {
    padding: "7px 11px",
    border: "1px solid #dbe2ea",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#475569",
    fontSize: "12px",
    cursor: "pointer"
};

const currentPageStyle = {
    padding: "7px 11px",
    borderRadius: "7px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "600"
};

export default Employees;