// src/pages/AddEmployee.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function AddEmployee() {
    const navigate = useNavigate();

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [loading, setLoading] = useState(false);
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
        } finally {
            setLoadingOptions(false);
        }
    };

    useEffect(() => {
        loadOptions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

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

            await API.post("/employees", {
                ...form,
                department_id:
                    form.department_id || null,
                designation_id:
                    form.designation_id || null
            });

            alert("Employee added successfully");

            navigate("/employees");
        } catch (error) {
            console.error(
                "Add Employee Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to add employee"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            <Sidebar />

            <div style={mainStyle}>
                <Navbar />

                <main style={contentStyle}>

                    <div style={headerStyle}>
                        <div>
                            <div style={breadcrumbStyle}>
                                PEOPLE / EMPLOYEES / ADD
                            </div>

                            <h1 style={titleStyle}>
                                Add Employee
                            </h1>

                            <p style={subtitleStyle}>
                                Create a new employee profile
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/employees")
                            }
                            disabled={loading}
                            style={backButtonStyle}
                        >
                            ← Back to Employees
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        style={formCardStyle}
                    >

                        <SectionHeader
                            icon="👤"
                            title="Employee Information"
                            subtitle="Basic information and contact details"
                        />

                        <div style={gridStyle}>

                            <FormField
                                label="Employee Code"
                                required
                                name="employee_code"
                                value={form.employee_code}
                                onChange={handleChange}
                                placeholder="EMP001"
                            />

                            <FormField
                                label="Employee Name"
                                required
                                name="display_name"
                                value={form.display_name}
                                onChange={handleChange}
                                placeholder="Enter employee name"
                            />

                            <FormField
                                label="Official Email"
                                required
                                type="email"
                                name="official_email"
                                value={form.official_email}
                                onChange={handleChange}
                                placeholder="employee@company.com"
                            />

                            <FormField
                                label="Mobile Number"
                                name="mobile_number"
                                value={form.mobile_number}
                                onChange={handleChange}
                                placeholder="9876543210"
                            />

                        </div>

                        <div style={sectionSpacing}>
                            <SectionHeader
                                icon="🏢"
                                title="Work Information"
                                subtitle="Department, designation and employment details"
                            />
                        </div>

                        <div style={gridStyle}>

                            <SelectField
                                label="Department"
                                name="department_id"
                                value={form.department_id}
                                onChange={handleChange}
                                disabled={loadingOptions}
                            >
                                <option value="">
                                    {loadingOptions
                                        ? "Loading departments..."
                                        : "Select Department"}
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
                            </SelectField>

                            <SelectField
                                label="Designation"
                                name="designation_id"
                                value={form.designation_id}
                                onChange={handleChange}
                                disabled={loadingOptions}
                            >
                                <option value="">
                                    {loadingOptions
                                        ? "Loading designations..."
                                        : "Select Designation"}
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
                            </SelectField>

                            <FormField
                                label="Work Location"
                                name="work_location"
                                value={form.work_location}
                                onChange={handleChange}
                                placeholder="Chennai"
                            />

                            <SelectField
                                label="Employment Type"
                                name="employment_type"
                                value={form.employment_type}
                                onChange={handleChange}
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
                            </SelectField>

                            <FormField
                                label="Joining Date"
                                type="date"
                                name="joining_date"
                                value={form.joining_date}
                                onChange={handleChange}
                            />

                            <SelectField
                                label="Status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>
                            </SelectField>

                        </div>

                        <div style={buttonContainerStyle}>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/employees")
                                }
                                disabled={loading}
                                style={cancelButtonStyle}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    ...submitButtonStyle,
                                    opacity:
                                        loading ? 0.7 : 1
                                }}
                            >
                                {loading
                                    ? "Saving..."
                                    : "✓ Add Employee"}
                            </button>

                        </div>

                    </form>

                </main>
            </div>
        </div>
    );
}

function SectionHeader({
    icon,
    title,
    subtitle
}) {
    return (
        <div style={sectionHeaderStyle}>
            <div style={sectionIconStyle}>
                {icon}
            </div>

            <div>
                <h2 style={sectionTitleStyle}>
                    {title}
                </h2>

                <p style={sectionSubtitleStyle}>
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

function FormField({
    label,
    required,
    type = "text",
    name,
    value,
    onChange,
    placeholder
}) {
    return (
        <div style={fieldStyle}>
            <label style={labelStyle}>
                {label}

                {required && (
                    <span style={requiredStyle}>
                        *
                    </span>
                )}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={inputStyle}
            />
        </div>
    );
}

function SelectField({
    label,
    name,
    value,
    onChange,
    disabled,
    children
}) {
    return (
        <div style={fieldStyle}>
            <label style={labelStyle}>
                {label}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                style={inputStyle}
            >
                {children}
            </select>
        </div>
    );
}

const pageStyle = {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc"
};

const mainStyle = {
    flex: 1,
    minWidth: 0
};

const contentStyle = {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "30px",
    boxSizing: "border-box"
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
    flexWrap: "wrap"
};

const breadcrumbStyle = {
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "8px"
};

const titleStyle = {
    margin: 0,
    fontSize: "30px",
    fontWeight: "750",
    color: "#0f172a"
};

const subtitleStyle = {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px"
};

const backButtonStyle = {
    padding: "10px 15px",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#475569",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600"
};

const formCardStyle = {
    background: "#ffffff",
    border: "1px solid #e5eaf0",
    borderRadius: "14px",
    padding: "28px",
    boxShadow: "0 4px 14px rgba(15,23,42,0.04)"
};

const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingBottom: "18px",
    borderBottom: "1px solid #edf1f5"
};

const sectionIconStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px"
};

const sectionTitleStyle = {
    margin: 0,
    color: "#0f172a",
    fontSize: "17px",
    fontWeight: "700"
};

const sectionSubtitleStyle = {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "12px"
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",
    gap: "21px",
    marginTop: "24px"
};

const sectionSpacing = {
    marginTop: "30px"
};

const fieldStyle = {
    display: "flex",
    flexDirection: "column"
};

const labelStyle = {
    marginBottom: "7px",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "650"
};

const requiredStyle = {
    color: "#dc2626",
    marginLeft: "3px"
};

const inputStyle = {
    width: "100%",
    height: "43px",
    padding: "0 12px",
    boxSizing: "border-box",
    border: "1px solid #d7dee7",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "13px",
    outline: "none"
};

const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "32px",
    paddingTop: "22px",
    borderTop: "1px solid #edf1f5"
};

const cancelButtonStyle = {
    padding: "10px 19px",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#475569",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600"
};

const submitButtonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "650",
    boxShadow: "0 4px 10px rgba(37,99,235,0.16)"
};

export default AddEmployee;