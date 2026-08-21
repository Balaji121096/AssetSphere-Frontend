import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";


function EditEmployee() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingEmployee, setLoadingEmployee] = useState(true);
    const [loadingOptions, setLoadingOptions] = useState(true);


    const [form, setForm] = useState({

        employee_code: "",
        display_name: "",
        official_email: "",
        mobile_number: "",
        department_id: "",
        designation_id: "",
        work_location: "",
        employment_type: "",
        joining_date: "",
        status: "Active"

    });


    // =====================================
    // LOAD DEPARTMENTS & DESIGNATIONS
    // =====================================

    const loadOptions = async () => {

        try {

            setLoadingOptions(true);

            const [
                departmentResponse,
                designationResponse
            ] = await Promise.all([

                API.get("/departments"),

                API.get("/designations")

            ]);


            setDepartments(
                departmentResponse.data.data || []
            );

            setDesignations(
                designationResponse.data.data || []
            );

        } catch (error) {

            console.error(
                "Employee options error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load departments and designations"
            );

        } finally {

            setLoadingOptions(false);

        }

    };


    // =====================================
    // LOAD EMPLOYEE
    // =====================================

    const loadEmployee = async () => {

        try {

            setLoadingEmployee(true);

            const response =
                await API.get(
                    `/employees/${id}`
                );

            console.log(
                "Employee Details:",
                response.data
            );


            const employee =
                response.data.data;


            if (!employee) {

                alert(
                    "Employee not found"
                );

                navigate("/employees");

                return;

            }


            setForm({

                employee_code:
                    employee.employee_code || "",

                display_name:
                    employee.display_name || "",

                official_email:
                    employee.official_email || "",

                mobile_number:
                    employee.mobile_number || "",

                department_id:
                    employee.department_id
                        ? String(employee.department_id)
                        : "",

                designation_id:
                    employee.designation_id
                        ? String(employee.designation_id)
                        : "",

                work_location:
                    employee.work_location || "",

                employment_type:
                    employee.employment_type || "",

                joining_date:
                    employee.joining_date
                        ? String(
                            employee.joining_date
                        ).substring(0, 10)
                        : "",

                status:
                    employee.status || "Active"

            });


        } catch (error) {

            console.error(
                "Load Employee Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load employee"
            );

            navigate("/employees");

        } finally {

            setLoadingEmployee(false);

        }

    };


    // =====================================
    // LOAD DATA ON PAGE OPEN
    // =====================================

    useEffect(() => {

        loadEmployee();
        loadOptions();

    }, [id]);


    // =====================================
    // INPUT CHANGE
    // =====================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    // =====================================
    // UPDATE EMPLOYEE
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (
            !form.employee_code.trim() ||
            !form.display_name.trim() ||
            !form.official_email.trim()
        ) {

            alert(
                "Employee Code, Employee Name and Email are required."
            );

            return;

        }


        try {

            setLoading(true);


            await API.put(
                `/employees/${id}`,
                {

                    ...form,

                    department_id:
                        form.department_id || null,

                    designation_id:
                        form.designation_id || null,

                    mobile_number:
                        form.mobile_number || null,

                    work_location:
                        form.work_location || null,

                    employment_type:
                        form.employment_type || null,

                    joining_date:
                        form.joining_date || null

                }
            );


            alert(
                "Employee updated successfully"
            );


            navigate("/employees");


        } catch (error) {

            console.error(
                "Update Employee Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to update employee"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================
    // CANCEL
    // =====================================

    const handleCancel = () => {

        navigate("/employees");

    };


    // =====================================
    // LOADING SCREEN
    // =====================================

    if (loadingEmployee) {

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

                        <h1>
                            Edit Employee
                        </h1>

                        <p
                            style={{
                                color: "#666"
                            }}
                        >
                            Loading employee details...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


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
                        padding: "25px",
                        maxWidth: "1000px"
                    }}
                >

                    {/* ============================= */}
                    {/* HEADER */}
                    {/* ============================= */}

                    <div
                        style={{
                            marginBottom: "25px"
                        }}
                    >

                        <h1
                            style={{
                                margin: 0
                            }}
                        >
                            Edit Employee
                        </h1>

                        <p
                            style={{
                                color: "#666"
                            }}
                        >
                            Update employee information
                        </p>

                    </div>


                    {/* ============================= */}
                    {/* FORM */}
                    {/* ============================= */}

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            background: "#ffffff",
                            padding: "25px",
                            borderRadius: "10px",
                            boxShadow:
                                "0 2px 6px rgba(0,0,0,0.12)"
                        }}
                    >

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, minmax(0, 1fr))",
                                gap: "20px"
                            }}
                        >

                            {/* Employee Code */}

                            <div>

                                <label>
                                    Employee Code *
                                </label>

                                <input
                                    type="text"
                                    name="employee_code"
                                    value={
                                        form.employee_code
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="EMP001"
                                    style={inputStyle}
                                />

                            </div>


                            {/* Employee Name */}

                            <div>

                                <label>
                                    Employee Name *
                                </label>

                                <input
                                    type="text"
                                    name="display_name"
                                    value={
                                        form.display_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Employee name"
                                    style={inputStyle}
                                />

                            </div>


                            {/* Email */}

                            <div>

                                <label>
                                    Official Email *
                                </label>

                                <input
                                    type="email"
                                    name="official_email"
                                    value={
                                        form.official_email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="employee@company.com"
                                    style={inputStyle}
                                />

                            </div>


                            {/* Mobile */}

                            <div>

                                <label>
                                    Mobile Number
                                </label>

                                <input
                                    type="text"
                                    name="mobile_number"
                                    value={
                                        form.mobile_number
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="9876543210"
                                    style={inputStyle}
                                />

                            </div>


                            {/* Department */}

                            <div>

                                <label>
                                    Department
                                </label>

                                <select
                                    name="department_id"
                                    value={
                                        form.department_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                    disabled={
                                        loadingOptions
                                    }
                                >

                                    <option value="">
                                        Select Department
                                    </option>

                                    {departments.map(
                                        (department) => (

                                            <option
                                                key={
                                                    department.department_id
                                                }
                                                value={
                                                    department.department_id
                                                }
                                            >

                                                {
                                                    department.department_name
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Designation */}

                            <div>

                                <label>
                                    Designation
                                </label>

                                <select
                                    name="designation_id"
                                    value={
                                        form.designation_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                    disabled={
                                        loadingOptions
                                    }
                                >

                                    <option value="">
                                        Select Designation
                                    </option>

                                    {designations.map(
                                        (designation) => (

                                            <option
                                                key={
                                                    designation.designation_id
                                                }
                                                value={
                                                    designation.designation_id
                                                }
                                            >

                                                {
                                                    designation.designation_name
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Work Location */}

                            <div>

                                <label>
                                    Work Location
                                </label>

                                <input
                                    type="text"
                                    name="work_location"
                                    value={
                                        form.work_location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Chennai"
                                    style={inputStyle}
                                />

                            </div>


                            {/* Employment Type */}

                            <div>

                                <label>
                                    Employment Type
                                </label>

                                <select
                                    name="employment_type"
                                    value={
                                        form.employment_type
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                >

                                    <option value="">
                                        Select Type
                                    </option>

                                    <option value="Full Time">
                                        Full Time
                                    </option>

                                    <option value="Part Time">
                                        Part Time
                                    </option>

                                    <option value="Contract">
                                        Contract
                                    </option>

                                    <option value="Intern">
                                        Intern
                                    </option>

                                </select>

                            </div>


                            {/* Joining Date */}

                            <div>

                                <label>
                                    Joining Date
                                </label>

                                <input
                                    type="date"
                                    name="joining_date"
                                    value={
                                        form.joining_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                />

                            </div>


                            {/* Status */}

                            <div>

                                <label>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        form.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                >

                                    <option value="Active">
                                        Active
                                    </option>

                                    <option value="Inactive">
                                        Inactive
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* ============================= */}
                        {/* BUTTONS */}
                        {/* ============================= */}

                        <div
                            style={{
                                marginTop: "30px",
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px"
                            }}
                        >

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                style={{
                                    padding:
                                        "10px 20px",
                                    cursor:
                                        loading
                                            ? "not-allowed"
                                            : "pointer"
                                }}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding:
                                        "10px 20px",
                                    background:
                                        "#1976d2",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius:
                                        "6px",
                                    cursor:
                                        loading
                                            ? "not-allowed"
                                            : "pointer",
                                    opacity:
                                        loading
                                            ? 0.7
                                            : 1
                                }}
                            >

                                {loading
                                    ? "Updating..."
                                    : "Update Employee"}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}


// =====================================
// INPUT STYLE
// =====================================

const inputStyle = {

    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    marginTop: "6px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px"

};


export default EditEmployee;