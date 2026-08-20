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

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    const employeesPerPage = 10;


    // =========================================
    // LOAD EMPLOYEES
    // =========================================

    const loadEmployees = async () => {

        try {

            setLoading(true);

            const response =
                await API.get("/employees");

            console.log(
                "Employees API Response:",
                response.data
            );

            setEmployees(
                response.data.data || []
            );

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to load employees"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // LOAD ON PAGE OPEN
    // =========================================

    useEffect(() => {

        loadEmployees();

    }, []);


    // =========================================
    // DELETE EMPLOYEE
    // =========================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
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

            // If current page becomes empty
            setCurrentPage((page) => {

                const remaining =
                    employees.length - 1;

                const totalPages =
                    Math.ceil(
                        remaining /
                        employeesPerPage
                    );

                if (
                    totalPages > 0 &&
                    page > totalPages
                ) {
                    return totalPages;
                }

                return page;

            });

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete employee"
            );

        }

    };


    // =========================================
    // SEARCH FILTER
    // =========================================

    const filteredEmployees =
        employees.filter((employee) => {

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

        });


    // =========================================
    // RESET PAGE WHEN SEARCH CHANGES
    // =========================================

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    // =========================================
    // PAGINATION
    // =========================================

    const totalPages =
        Math.ceil(
            filteredEmployees.length /
            employeesPerPage
        );


    const startIndex =
        (currentPage - 1) *
        employeesPerPage;


    const endIndex =
        startIndex +
        employeesPerPage;


    const currentEmployees =
        filteredEmployees.slice(
            startIndex,
            endIndex
        );


    // =========================================
    // PAGE CHANGE
    // =========================================

    const goToPage = (page) => {

        if (page < 1) {
            return;
        }

        if (
            totalPages > 0 &&
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


    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f5f5f5",
                width: "100%"
            }}
        >

            {/* ============================= */}
            {/* SIDEBAR */}
            {/* ============================= */}

            <Sidebar />


            {/* ============================= */}
            {/* MAIN CONTENT */}
            {/* ============================= */}

            <div
                style={{
                    flex: 1,
                    minWidth: 0
                }}
            >

                <Navbar />


                <div
                    style={{
                        padding: "25px",
                        width: "100%",
                        boxSizing: "border-box"
                    }}
                >


                    {/* ============================= */}
                    {/* HEADER */}
                    {/* ============================= */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
                            gap: "20px",
                            flexWrap: "wrap"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    margin: 0
                                }}
                            >
                                Employees
                            </h1>

                            <p
                                style={{
                                    marginTop: "8px",
                                    color: "#666"
                                }}
                            >
                                Manage company employees
                            </p>

                        </div>


                        {/* HEADER BUTTONS */}

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap"
                            }}
                        >

                            <button
                                onClick={
                                    loadEmployees
                                }
                                style={{
                                    padding:
                                        "9px 16px",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                Refresh
                            </button>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/employees/add"
                                    )
                                }
                                style={{
                                    padding:
                                        "9px 16px",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                + Add Employee
                            </button>

                        </div>

                    </div>


                    {/* ============================= */}
                    {/* SEARCH */}
                    {/* ============================= */}

                    <div
                        style={{
                            margin: "20px 0",
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
                            gap: "15px",
                            flexWrap: "wrap"
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            style={{
                                padding: "10px 12px",
                                width: "320px",
                                maxWidth: "100%",
                                border:
                                    "1px solid #ccc",
                                borderRadius:
                                    "6px",
                                boxSizing:
                                    "border-box"
                            }}
                        />


                        <div
                            style={{
                                color: "#666",
                                fontSize: "14px"
                            }}
                        >
                            Total:{" "}
                            <strong>
                                {
                                    filteredEmployees.length
                                }
                            </strong>{" "}
                            employees
                        </div>

                    </div>


                    {/* ============================= */}
                    {/* TABLE CONTAINER */}
                    {/* ============================= */}

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "10px",
                            overflowX: "auto",
                            overflowY: "hidden",
                            boxShadow:
                                "0 2px 6px rgba(0,0,0,0.08)",
                            width: "100%"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                minWidth: "1100px",
                                borderCollapse:
                                    "collapse",
                                tableLayout:
                                    "fixed"
                            }}
                        >

                            {/* ============================= */}
                            {/* TABLE HEADER */}
                            {/* ============================= */}

                            <thead>

                                <tr
                                    style={{
                                        background:
                                            "#f8f9fa"
                                    }}
                                >

                                    <th
                                        style={{
                                            width: "60px",
                                            padding:
                                                "14px 10px",
                                            textAlign:
                                                "left",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        ID
                                    </th>


                                    <th
                                        style={{
                                            width: "120px",
                                            padding:
                                                "14px 10px",
                                            textAlign:
                                                "left",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        Employee Code
                                    </th>


                                    <th
                                        style={{
                                            width: "160px",
                                            padding:
                                                "14px 10px",
                                            textAlign:
                                                "left",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        Employee
                                    </th>


                                    <th
                                        style={{
                                            width: "210px",
                                            padding:
                                                "14px 10px",
                                            textAlign:
                                                "left",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        Email
                                    </th>


                                    <th
                                        style={{
                                            width: "130px",
                                            padding:
                                                "14px 10px",
                                            textAlign:
                                                "left",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        Mobile
                                    </th>


                                    <th
                                        style={{
                                            width: "140px",
                                            padding:
                                                "14px 10px",
                                            textAlign:
                                                "left",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        Department
                                    </th>


                                    <th
                                        style={{
                                            width: "140px",
                                            padding:
                                                "14px 10px",
                                            textAlign:
                                                "left",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        Designation
                                    </th>


                                    <th
                                        style={{
                                            width: "130px",
                                            padding:
                                                "14px 10px",
                                            textAlign:
                                                "left",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        Location
                                    </th>


                                    <th
                                        style={{
                                            width: "100px",
                                            padding:
                                                "14px 10px",
                                            textAlign:
                                                "left",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        Status
                                    </th>


                                    <th
                                        style={{
                                            width: "150px",
                                            padding:
                                                "14px 10px",
                                            textAlign:
                                                "center",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            {/* ============================= */}
                            {/* TABLE BODY */}
                            {/* ============================= */}

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="10"
                                            style={{
                                                padding:
                                                    "30px",
                                                textAlign:
                                                    "center"
                                            }}
                                        >
                                            Loading employees...
                                        </td>

                                    </tr>

                                ) : currentEmployees.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="10"
                                            style={{
                                                padding:
                                                    "30px",
                                                textAlign:
                                                    "center",
                                                color:
                                                    "#777"
                                            }}
                                        >
                                            No employees found
                                        </td>

                                    </tr>

                                ) : (

                                    currentEmployees.map(
                                        (employee) => (

                                            <tr
                                                key={
                                                    employee.employee_id
                                                }
                                                style={{
                                                    borderBottom:
                                                        "1px solid #eee"
                                                }}
                                            >

                                                {/* ID */}

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px 10px",
                                                        whiteSpace:
                                                            "nowrap",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis"
                                                    }}
                                                >
                                                    {
                                                        employee.employee_id
                                                    }
                                                </td>


                                                {/* CODE */}

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px 10px",
                                                        whiteSpace:
                                                            "nowrap",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis"
                                                    }}
                                                >
                                                    {
                                                        employee.employee_code ||
                                                        "-"
                                                    }
                                                </td>


                                                {/* NAME */}

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px 10px",
                                                        whiteSpace:
                                                            "nowrap",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis"
                                                    }}
                                                >
                                                    {
                                                        employee.display_name ||
                                                        "-"
                                                    }
                                                </td>


                                                {/* EMAIL */}

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px 10px",
                                                        whiteSpace:
                                                            "nowrap",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis"
                                                    }}
                                                >
                                                    {
                                                        employee.official_email ||
                                                        "-"
                                                    }
                                                </td>


                                                {/* MOBILE */}

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px 10px",
                                                        whiteSpace:
                                                            "nowrap",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis"
                                                    }}
                                                >
                                                    {
                                                        employee.mobile_number ||
                                                        "-"
                                                    }
                                                </td>


                                                {/* DEPARTMENT */}

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px 10px",
                                                        whiteSpace:
                                                            "nowrap",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis"
                                                    }}
                                                >
                                                    {
                                                        employee.department_name ||
                                                        "-"
                                                    }
                                                </td>


                                                {/* DESIGNATION */}

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px 10px",
                                                        whiteSpace:
                                                            "nowrap",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis"
                                                    }}
                                                >
                                                    {
                                                        employee.designation_name ||
                                                        "-"
                                                    }
                                                </td>


                                                {/* LOCATION */}

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px 10px",
                                                        whiteSpace:
                                                            "nowrap",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis"
                                                    }}
                                                >
                                                    {
                                                        employee.work_location ||
                                                        "-"
                                                    }
                                                </td>


                                                {/* STATUS */}

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px 10px"
                                                    }}
                                                >

                                                    <span
                                                        style={{
                                                            display:
                                                                "inline-block",
                                                            padding:
                                                                "5px 9px",
                                                            borderRadius:
                                                                "12px",
                                                            fontSize:
                                                                "12px",
                                                            background:
                                                                employee.status ===
                                                                "Active"
                                                                    ? "#e8f5e9"
                                                                    : "#ffebee",
                                                            color:
                                                                employee.status ===
                                                                "Active"
                                                                    ? "#2e7d32"
                                                                    : "#c62828"
                                                        }}
                                                    >
                                                        {
                                                            employee.status ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>


                                                {/* ACTION */}

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px 10px",
                                                        textAlign:
                                                            "center"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            justifyContent:
                                                                "center",
                                                            gap:
                                                                "6px"
                                                        }}
                                                    >

                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/employees/edit/${employee.employee_id}`
                                                                )
                                                            }
                                                            style={{
                                                                padding:
                                                                    "6px 10px",
                                                                cursor:
                                                                    "pointer"
                                                            }}
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    employee.employee_id
                                                                )
                                                            }
                                                            style={{
                                                                padding:
                                                                    "6px 10px",
                                                                cursor:
                                                                    "pointer",
                                                                color:
                                                                    "#fff",
                                                                background:
                                                                    "#d32f2f",
                                                                border:
                                                                    "none",
                                                                borderRadius:
                                                                    "4px"
                                                            }}
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


                    {/* ============================= */}
                    {/* PAGINATION */}
                    {/* ============================= */}

                    {!loading &&
                        totalPages > 0 && (

                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                    marginTop:
                                        "20px",
                                    flexWrap:
                                        "wrap",
                                    gap:
                                        "12px"
                                }}
                            >

                                {/* SHOWING */}

                                <div
                                    style={{
                                        color:
                                            "#666",
                                        fontSize:
                                            "14px"
                                    }}
                                >

                                    Showing{" "}

                                    <strong>
                                        {
                                            startIndex + 1
                                        }
                                    </strong>

                                    {" "}to{" "}

                                    <strong>
                                        {
                                            Math.min(
                                                endIndex,
                                                filteredEmployees.length
                                            )
                                        }
                                    </strong>

                                    {" "}of{" "}

                                    <strong>
                                        {
                                            filteredEmployees.length
                                        }
                                    </strong>

                                </div>


                                {/* PAGE BUTTONS */}

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap:
                                            "6px"
                                    }}
                                >

                                    {/* PREVIOUS */}

                                    <button
                                        onClick={() =>
                                            goToPage(
                                                currentPage - 1
                                            )
                                        }
                                        disabled={
                                            currentPage ===
                                            1
                                        }
                                        style={{
                                            padding:
                                                "7px 12px",
                                            cursor:
                                                currentPage ===
                                                1
                                                    ? "not-allowed"
                                                    : "pointer",
                                            opacity:
                                                currentPage ===
                                                1
                                                    ? 0.5
                                                    : 1
                                        }}
                                    >
                                        Previous
                                    </button>


                                    {/* PAGE NUMBER */}

                                    <span
                                        style={{
                                            padding:
                                                "7px 12px",
                                            background:
                                                "#1976d2",
                                            color:
                                                "#fff",
                                            borderRadius:
                                                "4px",
                                            fontSize:
                                                "14px"
                                        }}
                                    >
                                        {currentPage}
                                        {" / "}
                                        {totalPages}
                                    </span>


                                    {/* NEXT */}

                                    <button
                                        onClick={() =>
                                            goToPage(
                                                currentPage + 1
                                            )
                                        }
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                        style={{
                                            padding:
                                                "7px 12px",
                                            cursor:
                                                currentPage ===
                                                totalPages
                                                    ? "not-allowed"
                                                    : "pointer",
                                            opacity:
                                                currentPage ===
                                                totalPages
                                                    ? 0.5
                                                    : 1
                                        }}
                                    >
                                        Next
                                    </button>

                                </div>

                            </div>

                        )}

                </div>

            </div>

        </div>

    );

}


export default Employees;