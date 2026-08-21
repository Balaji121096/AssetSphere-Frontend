import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";


function AssignAsset() {

    const { id } = useParams();
    const navigate = useNavigate();


    // =====================================================
    // STATES
    // =====================================================

    const [employees, setEmployees] = useState([]);

    const [employeeId, setEmployeeId] = useState("");

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [assigning, setAssigning] = useState(false);


    // =====================================================
    // LOAD EMPLOYEES
    // =====================================================

    useEffect(() => {

        const loadEmployees = async () => {

            try {

                setLoading(true);

                const response =
                    await API.get("/employees");

                console.log(
                    "Employee API:",
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


        loadEmployees();

    }, []);


    // =====================================================
    // SEARCH EMPLOYEES
    // =====================================================

    const filteredEmployees =
        employees.filter((employee) => {

            const text = `
                ${employee.display_name || ""}
                ${employee.employee_code || ""}
                ${employee.official_email || ""}
                ${employee.mobile_number || ""}
                ${employee.department_name || ""}
                ${employee.designation_name || ""}
            `.toLowerCase();


            return text.includes(
                search.toLowerCase()
            );

        });


    // =====================================================
    // ASSIGN ASSET
    // =====================================================

    const handleAssign = async (e) => {

        e.preventDefault();


        if (!employeeId) {

            alert(
                "Please select employee"
            );

            return;

        }


        try {

            setAssigning(true);


            await API.put(
                `/assets/assign/${id}`,
                {
                    employee_id:
                        Number(employeeId)
                }
            );


            alert(
                "Asset assigned successfully"
            );


            navigate("/assets");


        } catch (error) {

            console.error(error);


            alert(
                error.response?.data?.message ||
                "Failed to assign asset"
            );

        } finally {

            setAssigning(false);

        }

    };


    // =====================================================
    // EMPLOYEE DISPLAY
    // =====================================================

    const getEmployeeName = (employee) => {

        return (
            employee.display_name ||
            `Employee ${employee.employee_id}`
        );

    };


    const getEmployeeCode = (employee) => {

        return (
            employee.employee_code ||
            `EMP${employee.employee_id}`
        );

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f5f5f5"
            }}
        >

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <Sidebar />


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

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
                        maxWidth: "900px"
                    }}
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        style={{
                            marginBottom: "25px"
                        }}
                    >

                        <h1
                            style={{
                                margin: 0,
                                fontSize: "28px"
                            }}
                        >
                            Assign Asset
                        </h1>


                        <p
                            style={{
                                color: "#666",
                                marginTop: "8px"
                            }}
                        >
                            Assign this hardware asset
                            to an employee.
                        </p>

                    </div>


                    {/* =================================================
                        FORM CARD
                    ================================================= */}

                    <div
                        style={{
                            background: "#fff",
                            padding: "25px",
                            borderRadius: "10px",
                            boxShadow:
                                "0 2px 8px rgba(0,0,0,0.08)"
                        }}
                    >

                        <form
                            onSubmit={handleAssign}
                        >

                            {/* =========================================
                                EMPLOYEE LABEL
                            ========================================= */}

                            <label
                                style={{
                                    display: "block",
                                    fontWeight: "600",
                                    marginBottom: "8px"
                                }}
                            >
                                Select Employee
                            </label>


                            {/* =========================================
                                SEARCH
                            ========================================= */}

                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    maxWidth: "450px"
                                }}
                            >

                                <input
                                    type="text"
                                    placeholder="Search employee... 🔍"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        width: "100%",
                                        boxSizing: "border-box",
                                        padding:
                                            "11px 14px",
                                        border:
                                            "1px solid #ccc",
                                        borderRadius:
                                            "6px",
                                        fontSize: "14px",
                                        outline: "none"
                                    }}
                                />

                            </div>


                            {/* =========================================
                                EMPLOYEE SELECT
                            ========================================= */}

                            <select
                                value={employeeId}
                                onChange={(e) =>
                                    setEmployeeId(
                                        e.target.value
                                    )
                                }
                                required
                                disabled={loading}
                                style={{
                                    padding: "11px 14px",
                                    width: "100%",
                                    maxWidth: "450px",
                                    marginTop: "12px",
                                    border:
                                        "1px solid #ccc",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    background: "#fff"
                                }}
                            >

                                <option value="">
                                    {loading
                                        ? "Loading employees..."
                                        : "Select Employee"}
                                </option>


                                {filteredEmployees.map(
                                    (employee) => (

                                        <option
                                            key={
                                                employee.employee_id
                                            }
                                            value={
                                                employee.employee_id
                                            }
                                        >

                                            {getEmployeeName(
                                                employee
                                            )}{" "}
                                            -{" "}
                                            {getEmployeeCode(
                                                employee
                                            )}

                                        </option>

                                    )
                                )}

                            </select>


                            {/* =========================================
                                NO SEARCH RESULT
                            ========================================= */}

                            {!loading &&
                                search &&
                                filteredEmployees.length === 0 && (

                                    <p
                                        style={{
                                            color: "#777",
                                            fontSize: "14px",
                                            marginTop: "8px"
                                        }}
                                    >
                                        No employees found
                                    </p>

                                )}


                            {/* =========================================
                                SELECTED EMPLOYEE PREVIEW
                            ========================================= */}

                            {employeeId && (

                                <div
                                    style={{
                                        marginTop: "15px",
                                        padding: "12px 15px",
                                        background: "#f0f7ff",
                                        border:
                                            "1px solid #cfe3ff",
                                        borderRadius: "6px",
                                        maxWidth: "420px"
                                    }}
                                >

                                    {(() => {

                                        const selectedEmployee =
                                            employees.find(
                                                (employee) =>
                                                    String(
                                                        employee.employee_id
                                                    ) ===
                                                    String(
                                                        employeeId
                                                    )
                                            );


                                        if (!selectedEmployee) {
                                            return null;
                                        }


                                        return (

                                            <div>

                                                <strong>
                                                    {
                                                        getEmployeeName(
                                                            selectedEmployee
                                                        )
                                                    }
                                                </strong>


                                                <div
                                                    style={{
                                                        fontSize:
                                                            "13px",
                                                        color:
                                                            "#666",
                                                        marginTop:
                                                            "4px"
                                                    }}
                                                >

                                                    {
                                                        getEmployeeCode(
                                                            selectedEmployee
                                                        )
                                                    }

                                                    {" • "}

                                                    {
                                                        selectedEmployee.official_email ||
                                                        "No email"
                                                    }

                                                </div>

                                            </div>

                                        );

                                    })()}

                                </div>

                            )}


                            {/* =========================================
                                BUTTONS
                            ========================================= */}

                            <div
                                style={{
                                    marginTop: "25px"
                                }}
                            >

                                <button
                                    type="submit"
                                    disabled={
                                        assigning ||
                                        !employeeId
                                    }
                                    style={{
                                        padding:
                                            "10px 18px",
                                        background:
                                            assigning ||
                                            !employeeId
                                                ? "#aaa"
                                                : "#2563eb",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius:
                                            "6px",
                                        cursor:
                                            assigning ||
                                            !employeeId
                                                ? "not-allowed"
                                                : "pointer",
                                        fontWeight:
                                            "600"
                                    }}
                                >

                                    {assigning
                                        ? "Assigning..."
                                        : "Assign Asset"}

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/assets"
                                        )
                                    }
                                    style={{
                                        marginLeft: "10px",
                                        padding:
                                            "10px 18px",
                                        background:
                                            "#fff",
                                        color: "#333",
                                        border:
                                            "1px solid #ccc",
                                        borderRadius:
                                            "6px",
                                        cursor: "pointer"
                                    }}
                                >

                                    Cancel

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default AssignAsset;