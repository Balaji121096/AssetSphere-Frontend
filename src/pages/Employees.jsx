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

    // VIEW DETAILS
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

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
    // VIEW EMPLOYEE DETAILS
    // =====================================================

    const handleView = async (id) => {
        try {
            setViewLoading(true);

            const response =
                await API.get(`/employees/${id}`);

            setSelectedEmployee(
                response.data?.data || null
            );

        } catch (error) {
            console.error(
                "View Employee Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load employee details"
            );

        } finally {
            setViewLoading(false);
        }
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
                ${employee.joining_date || ""}
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
    // EXPORT HELPERS
    // =====================================================

    const getExportValue = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        return String(value);
    };

    const formatExportDate = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
    };

    const escapeHTML = (value) => {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const escapeExcelValue = (value) => {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    };

    const getEmployeeExportRows = () => {
        return filteredEmployees.map(
            (employee) => ({

                "Employee ID":
                    getExportValue(
                        employee.employee_id
                    ),

                "Employee Code":
                    getExportValue(
                        employee.employee_code
                    ),

                "Employee Name":
                    getExportValue(
                        employee.display_name
                    ),

                "Official Email":
                    getExportValue(
                        employee.official_email
                    ),

                "Mobile Number":
                    getExportValue(
                        employee.mobile_number
                    ),

                "Department":
                    getExportValue(
                        employee.department_name
                    ),

                "Designation":
                    getExportValue(
                        employee.designation_name
                    ),

                "Work Location":
                    getExportValue(
                        employee.work_location
                    ),

                "Employment Type":
                    getExportValue(
                        employee.employment_type
                    ),

                "Joining Date":
                    formatExportDate(
                        employee.joining_date
                    ),

                "Status":
                    getExportValue(
                        employee.status
                    ),

                "Created Date":
                    formatExportDate(
                        employee.created_at
                    ),

                "Updated Date":
                    formatExportDate(
                        employee.updated_at
                    )

            })
        );
    };

    // =====================================================
    // EXPORT TO EXCEL
    // =====================================================

    const handleExportExcel = () => {
        if (filteredEmployees.length === 0) {
            alert(
                "No employees available to export."
            );
            return;
        }

        const rows =
            getEmployeeExportRows();

        const headers =
            Object.keys(rows[0]);

        const tableRows = rows
            .map(
                (row) => `
                    <tr>
                        ${headers
                            .map(
                                (header) =>
                                    `<td>${escapeExcelValue(
                                        row[header]
                                    )}</td>`
                            )
                            .join("")}
                    </tr>
                `
            )
            .join("");

        const tableHeader = headers
            .map(
                (header) =>
                    `<th>${escapeExcelValue(
                        header
                    )}</th>`
            )
            .join("");

        const excelHTML = `
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <style>
                        table {
                            border-collapse: collapse;
                            width: 100%;
                            font-family: Arial, sans-serif;
                        }

                        th {
                            background: #1e3a8a;
                            color: #ffffff;
                            border: 1px solid #d1d5db;
                            padding: 8px;
                            font-weight: 700;
                        }

                        td {
                            border: 1px solid #d1d5db;
                            padding: 8px;
                        }
                    </style>
                </head>

                <body>

                    <table>

                        <thead>
                            <tr>
                                ${tableHeader}
                            </tr>
                        </thead>

                        <tbody>
                            ${tableRows}
                        </tbody>

                    </table>

                </body>
            </html>
        `;

        const blob =
            new Blob(
                [excelHTML],
                {
                    type:
                        "application/vnd.ms-excel"
                }
            );

        const url =
            window.URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        link.download =
            `AssetSphere_Employees_${new Date()
                .toISOString()
                .slice(0, 10)}.xls`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
    };

    // =====================================================
    // EXPORT TO PDF
    // =====================================================

    const handleExportPDF = () => {
        if (filteredEmployees.length === 0) {
            alert(
                "No employees available to export."
            );
            return;
        }

        const rows =
            getEmployeeExportRows();

        const headers =
            Object.keys(rows[0]);

        const tableHeader =
            headers
                .map(
                    (header) =>
                        `<th>${escapeHTML(
                            header
                        )}</th>`
                )
                .join("");

        const tableRows =
            rows
                .map(
                    (row) => `
                        <tr>
                            ${headers
                                .map(
                                    (header) =>
                                        `<td>${escapeHTML(
                                            row[header]
                                        )}</td>`
                                )
                                .join("")}
                        </tr>
                    `
                )
                .join("");

        const printWindow =
            window.open(
                "",
                "_blank",
                "width=1400,height=900"
            );

        if (!printWindow) {
            alert(
                "Please allow pop-ups in your browser to export PDF."
            );
            return;
        }

        const generatedDate =
            new Date().toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        printWindow.document.write(`
            <!DOCTYPE html>

            <html>

                <head>

                    <meta charset="UTF-8" />

                    <title>
                        AssetSphere - Employee Report
                    </title>

                    <style>

                        @page {
                            size: A4 landscape;
                            margin: 12mm;
                        }

                        * {
                            box-sizing: border-box;
                        }

                        body {
                            margin: 0;
                            padding: 0;
                            font-family:
                                Arial,
                                Helvetica,
                                sans-serif;
                            color: #111827;
                            background: #ffffff;
                        }

                        .report-header {
                            margin-bottom: 16px;
                        }

                        .report-title {
                            margin: 0;
                            font-size: 22px;
                            font-weight: 700;
                            color: #111827;
                        }

                        .report-subtitle {
                            margin: 5px 0 0;
                            color: #6b7280;
                            font-size: 11px;
                        }

                        .report-summary {
                            margin-top: 10px;
                            display: flex;
                            gap: 20px;
                            font-size: 11px;
                            color: #374151;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                            table-layout: auto;
                        }

                        th {
                            background: #1e3a8a;
                            color: #ffffff;
                            border: 1px solid #cbd5e1;
                            padding: 6px 5px;
                            font-size: 8px;
                            text-align: left;
                            white-space: nowrap;
                        }

                        td {
                            border: 1px solid #dbe2ea;
                            padding: 5px;
                            font-size: 7px;
                            color: #1f2937;
                            vertical-align: top;
                        }

                        tr {
                            page-break-inside: avoid;
                        }

                        .footer {
                            margin-top: 12px;
                            font-size: 8px;
                            color: #6b7280;
                            text-align: right;
                        }

                    </style>

                </head>

                <body>

                    <div class="report-header">

                        <h1 class="report-title">
                            AssetSphere - Employee Report
                        </h1>

                        <p class="report-subtitle">
                            Employee directory export
                        </p>

                        <div class="report-summary">

                            <span>
                                Total Records:
                                <strong>
                                    ${filteredEmployees.length}
                                </strong>
                            </span>

                            <span>
                                Active:
                                <strong>
                                    ${activeCount}
                                </strong>
                            </span>

                            <span>
                                Inactive:
                                <strong>
                                    ${inactiveCount}
                                </strong>
                            </span>

                        </div>

                    </div>

                    <table>

                        <thead>
                            <tr>
                                ${tableHeader}
                            </tr>
                        </thead>

                        <tbody>
                            ${tableRows}
                        </tbody>

                    </table>

                    <div class="footer">
                        Generated on:
                        ${escapeHTML(
                            generatedDate
                        )}
                    </div>

                    <script>
                        window.onload = function () {
                            window.focus();
                            window.print();
                        };
                    </script>

                </body>

            </html>
        `);

        printWindow.document.close();

        printWindow.onafterprint = () => {
            printWindow.close();
        };
    };

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

                        <div style={headerGlowOne}></div>
                        <div style={headerGlowTwo}></div>

                        <div style={headerContentStyle}>

                            <div style={eyebrowStyle}>
                                PEOPLE MANAGEMENT
                            </div>

                            <h1 style={titleStyle}>
                                Employees
                            </h1>

                            <p style={subtitleStyle}>
                                Manage company employees and
                                their information
                            </p>

                        </div>


                        {/* =================================================
                            HEADER ACTIONS
                        ================================================= */}

                        <div style={headerButtonsStyle}>

                            {/* REFRESH */}

                            <button
                                type="button"
                                onClick={handleRefresh}
                                style={refreshButtonStyle}
                            >

                                <span
                                    style={
                                        buttonIconStyle
                                    }
                                >
                                    ↻
                                </span>

                                Refresh

                            </button>


                            {/* EXPORT EXCEL */}

                            <button
                                type="button"
                                onClick={
                                    handleExportExcel
                                }
                                disabled={
                                    filteredEmployees.length === 0
                                }
                                style={{
                                    ...excelButtonStyle,
                                    opacity:
                                        filteredEmployees.length ===
                                        0
                                            ? 0.5
                                            : 1,
                                    cursor:
                                        filteredEmployees.length ===
                                        0
                                            ? "not-allowed"
                                            : "pointer"
                                }}
                            >

                                <span
                                    style={
                                        exportIconStyle
                                    }
                                >
                                    XLS
                                </span>

                                Excel

                            </button>


                            {/* EXPORT PDF */}

                            <button
                                type="button"
                                onClick={
                                    handleExportPDF
                                }
                                disabled={
                                    filteredEmployees.length === 0
                                }
                                style={{
                                    ...pdfButtonStyle,
                                    opacity:
                                        filteredEmployees.length ===
                                        0
                                            ? 0.5
                                            : 1,
                                    cursor:
                                        filteredEmployees.length ===
                                        0
                                            ? "not-allowed"
                                            : "pointer"
                                }}
                            >

                                <span
                                    style={
                                        exportIconStyle
                                    }
                                >
                                    PDF
                                </span>

                                PDF

                            </button>


                            {/* ADD EMPLOYEE */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/employees/add"
                                    )
                                }
                                style={
                                    addButtonStyle
                                }
                            >

                                <span
                                    style={
                                        plusStyle
                                    }
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
                            color="var(--primary-color)"
                            background="var(--primary-light)"
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
                                                            "var(--muted-text-color)"
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
                                                            "var(--hover-background)";

                                                    }}
                                                    onMouseLeave={(
                                                        e
                                                    ) => {

                                                        e.currentTarget.style.background =
                                                            "var(--card-background)";

                                                    }}
                                                >

                                                    {/* =================================================
                                                        ID
                                                    ================================================= */}

                                                    <td
                                                        style={{
                                                            ...tdStyle,
                                                            color:
                                                                "var(--muted-text-color)"
                                                        }}
                                                    >

                                                        #
                                                        {
                                                            employee.employee_id
                                                        }

                                                    </td>


                                                    {/* =================================================
                                                        EMPLOYEE - CLICK TO VIEW
                                                    ================================================= */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={{
                                                                ...employeeCellStyle,
                                                                cursor: "pointer"
                                                            }}
                                                            onClick={() =>
                                                                handleView(
                                                                    employee.employee_id
                                                                )
                                                            }
                                                            title="Click to view employee details"
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
                                        }>

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


            {/* =====================================================
                EMPLOYEE VIEW DETAILS MODAL
            ===================================================== */}

            {(viewLoading || selectedEmployee) && (

                <div
                    style={viewModalOverlay}
                    onClick={() => {
                        if (!viewLoading) {
                            setSelectedEmployee(null);
                        }
                    }}
                >

                    <div
                        style={viewModal}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {viewLoading ? (

                            <div
                                style={
                                    viewLoadingBox
                                }
                            >

                                <div
                                    style={
                                        viewLoadingSpinner
                                    }
                                >
                                    ↻
                                </div>

                                <div
                                    style={
                                        viewLoadingText
                                    }
                                >
                                    Loading employee details...
                                </div>

                            </div>

                        ) : (

                            <>

                                {/* =================================================
                                    MODAL HEADER
                                ================================================= */}

                                <div
                                    style={
                                        viewModalHeader
                                    }
                                >

                                    <div>

                                        <div
                                            style={
                                                viewModalEyebrow
                                            }
                                        >
                                            EMPLOYEE DETAILS
                                        </div>

                                        <h2
                                            style={
                                                viewModalTitle
                                            }
                                        >
                                            {
                                                selectedEmployee.display_name ||
                                                "-"
                                            }
                                        </h2>

                                        <div
                                            style={
                                                viewModalCode
                                            }
                                        >
                                            {
                                                selectedEmployee.employee_code ||
                                                `Employee #${selectedEmployee.employee_id || "-"}`
                                            }
                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedEmployee(
                                                null
                                            )
                                        }
                                        style={
                                            viewCloseButton
                                        }
                                        title="Close"
                                    >
                                        ×
                                    </button>

                                </div>


                                {/* =================================================
                                    DETAILS
                                ================================================= */}

                                <div
                                    className="employee-view-detail-grid"
                                    style={
                                        viewDetailGrid
                                    }
                                >

                                    <DetailItem
                                        label="Employee ID"
                                        value={
                                            selectedEmployee.employee_id
                                        }
                                    />

                                    <DetailItem
                                        label="Employee Code"
                                        value={
                                            selectedEmployee.employee_code
                                        }
                                    />

                                    <DetailItem
                                        label="Employee Name"
                                        value={
                                            selectedEmployee.display_name
                                        }
                                    />

                                    <DetailItem
                                        label="Official Email"
                                        value={
                                            selectedEmployee.official_email
                                        }
                                    />

                                    <DetailItem
                                        label="Mobile Number"
                                        value={
                                            selectedEmployee.mobile_number
                                        }
                                    />

                                    <DetailItem
                                        label="Department"
                                        value={
                                            selectedEmployee.department_name
                                        }
                                    />

                                    <DetailItem
                                        label="Designation"
                                        value={
                                            selectedEmployee.designation_name
                                        }
                                    />

                                    <DetailItem
                                        label="Work Location"
                                        value={
                                            selectedEmployee.work_location
                                        }
                                    />

                                    <DetailItem
                                        label="Employment Type"
                                        value={
                                            selectedEmployee.employment_type
                                        }
                                    />

                                    <DetailItem
                                        label="Joining Date"
                                        value={
                                            formatExportDate(
                                                selectedEmployee.joining_date
                                            )
                                        }
                                    />

                                    <DetailItem
                                        label="Status"
                                        value={
                                            selectedEmployee.status
                                        }
                                    />

                                    <DetailItem
                                        label="Created Date"
                                        value={
                                            formatExportDate(
                                                selectedEmployee.created_at
                                            )
                                        }
                                    />

                                    <DetailItem
                                        label="Updated Date"
                                        value={
                                            formatExportDate(
                                                selectedEmployee.updated_at
                                            )
                                        }
                                    />

                                    <DetailItem
                                        label="Employee ID / Reference"
                                        value={
                                            selectedEmployee.employee_id
                                        }
                                    />

                                </div>


                                {/* =================================================
                                    EXTRA INFORMATION
                                ================================================= */}

                                {(selectedEmployee.address ||
                                    selectedEmployee.city ||
                                    selectedEmployee.state ||
                                    selectedEmployee.pincode ||
                                    selectedEmployee.date_of_birth ||
                                    selectedEmployee.gender ||
                                    selectedEmployee.personal_email ||
                                    selectedEmployee.reporting_manager ||
                                    selectedEmployee.manager_name) && (

                                    <div
                                        style={
                                            viewExtraSection
                                        }
                                    >

                                        <div
                                            style={
                                                viewSectionTitle
                                            }
                                        >
                                            Additional Information
                                        </div>

                                        <div
                                            className="employee-view-extra-grid"
                                            style={
                                                viewExtraGrid
                                            }
                                        >

                                            {selectedEmployee.personal_email && (
                                                <DetailItem
                                                    label="Personal Email"
                                                    value={
                                                        selectedEmployee.personal_email
                                                    }
                                                />
                                            )}

                                            {selectedEmployee.date_of_birth && (
                                                <DetailItem
                                                    label="Date of Birth"
                                                    value={
                                                        formatExportDate(
                                                            selectedEmployee.date_of_birth
                                                        )
                                                    }
                                                />
                                            )}

                                            {selectedEmployee.gender && (
                                                <DetailItem
                                                    label="Gender"
                                                    value={
                                                        selectedEmployee.gender
                                                    }
                                                />
                                            )}

                                            {selectedEmployee.address && (
                                                <DetailItem
                                                    label="Address"
                                                    value={
                                                        selectedEmployee.address
                                                    }
                                                />
                                            )}

                                            {selectedEmployee.city && (
                                                <DetailItem
                                                    label="City"
                                                    value={
                                                        selectedEmployee.city
                                                    }
                                                />
                                            )}

                                            {selectedEmployee.state && (
                                                <DetailItem
                                                    label="State"
                                                    value={
                                                        selectedEmployee.state
                                                    }
                                                />
                                            )}

                                            {selectedEmployee.pincode && (
                                                <DetailItem
                                                    label="Pincode"
                                                    value={
                                                        selectedEmployee.pincode
                                                    }
                                                />
                                            )}

                                            {selectedEmployee.reporting_manager && (
                                                <DetailItem
                                                    label="Reporting Manager"
                                                    value={
                                                        selectedEmployee.reporting_manager
                                                    }
                                                />
                                            )}

                                            {selectedEmployee.manager_name && (
                                                <DetailItem
                                                    label="Manager"
                                                    value={
                                                        selectedEmployee.manager_name
                                                    }
                                                />
                                            )}

                                        </div>

                                    </div>

                                )}


                                {/* =================================================
                                    MODAL FOOTER
                                ================================================= */}

                                <div
                                    style={
                                        viewModalFooter
                                    }
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedEmployee(
                                                null
                                            )
                                        }
                                        style={
                                            viewCloseFooterButton
                                        }
                                    >
                                        Close
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => {

                                            const id =
                                                selectedEmployee.employee_id;

                                            setSelectedEmployee(
                                                null
                                            );

                                            navigate(
                                                `/employees/edit/${id}`
                                            );

                                        }}
                                        style={
                                            viewEditButton
                                        }
                                    >
                                        ✎ Edit Employee
                                    </button>

                                </div>

                            </>

                        )}

                    </div>

                </div>

            )}


            {/* =====================================================
                SPINNER ANIMATION
            ===================================================== */}

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

                    @media (max-width: 1200px) {
                        .employee-header-buttons {
                            width: 100%;
                        }
                    }

                    @media (max-width: 900px) {
                        .employees-summary-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }

                    @media (max-width: 650px) {
                        .employees-content {
                            padding: 18px !important;
                        }

                        .employee-view-detail-grid,
                        .employee-view-extra-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}
            </style>

        </div>
    );
}


// =====================================================
// DETAIL ITEM
// =====================================================

function DetailItem({ label, value }) {
    return (
        <div style={detailItem}>
            <div style={detailLabel}>
                {label}
            </div>

            <div style={detailValue}>
                {value !== null &&
                value !== undefined &&
                value !== ""
                    ? String(value)
                    : "-"}
            </div>
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
   PAGE STYLES
===================================================== */

const pageStyle = {
    display: "flex",

    minHeight: "100vh",

    background: "var(--app-background)",

    color: "var(--text-color)"
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


/* =====================================================
   HEADER
===================================================== */

const headerStyle = {
    width: "100%",

    minHeight: "190px",

    padding: "30px 32px",

    boxSizing: "border-box",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "25px",

    flexWrap: "wrap",

    marginBottom: "26px",

    borderRadius: "18px",

    background:
        "linear-gradient(135deg, var(--sidebar-color) 0%, var(--sidebar-color) 45%, var(--primary-color) 100%)",

    boxShadow:
        "0 12px 30px rgba(15, 23, 42, 0.16)",

    position: "relative",

    overflow: "hidden"
};


const headerContentStyle = {
    position: "relative",

    zIndex: 2
};


const headerGlowOne = {
    position: "absolute",

    width: "300px",

    height: "300px",

    borderRadius: "50%",

    background:
        "color-mix(in srgb, var(--primary-color) 16%, transparent)",

    right: "-90px",

    top: "-150px",

    filter: "blur(5px)"
};


const headerGlowTwo = {
    position: "absolute",

    width: "220px",

    height: "220px",

    borderRadius: "50%",

    background:
        "color-mix(in srgb, var(--primary-color) 12%, transparent)",

    right: "230px",

    bottom: "-150px",

    filter: "blur(4px)"
};


const eyebrowStyle = {
    color: "var(--primary-light)",

    fontSize: "11px",

    fontWeight: "700",

    letterSpacing: "1.6px",

    marginBottom: "8px"
};


const titleStyle = {
    margin: 0,

    fontSize: "32px",

    lineHeight: "1.15",

    fontWeight: "750",

    letterSpacing: "-0.8px",

    color: "#ffffff"
};


const subtitleStyle = {
    margin: "9px 0 0",

    color: "rgba(255,255,255,0.80)",

    fontSize: "14px",

    lineHeight: "1.5"
};


/* =====================================================
   HEADER BUTTONS
===================================================== */

const headerButtonsStyle = {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    flexWrap: "wrap",

    position: "relative",

    zIndex: 2
};


const refreshButtonStyle = {
    height: "42px",

    padding: "0 16px",

    border:
        "1px solid rgba(255,255,255,0.25)",

    borderRadius: "9px",

    background:
        "rgba(255,255,255,0.10)",

    backdropFilter: "blur(8px)",

    color: "#ffffff",

    fontSize: "13px",

    fontWeight: "600",

    cursor: "pointer",

    transition:
        "all 0.2s ease"
};


const excelButtonStyle = {
    height: "42px",

    padding: "0 14px",

    border:
        "1px solid rgba(255,255,255,0.22)",

    borderRadius: "9px",

    background: "#15803d",

    color: "#ffffff",

    fontSize: "13px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
        "0 5px 12px rgba(0,0,0,0.12)",

    transition:
        "all 0.2s ease"
};


const pdfButtonStyle = {
    height: "42px",

    padding: "0 14px",

    border:
        "1px solid rgba(255,255,255,0.22)",

    borderRadius: "9px",

    background: "#dc2626",

    color: "#ffffff",

    fontSize: "13px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
        "0 5px 12px rgba(0,0,0,0.12)",

    transition:
        "all 0.2s ease"
};


const exportIconStyle = {
    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    minWidth: "25px",

    height: "20px",

    marginRight: "6px",

    padding: "0 4px",

    borderRadius: "4px",

    background:
        "rgba(255,255,255,0.18)",

    fontSize: "9px",

    fontWeight: "800",

    letterSpacing: "0.3px",

    verticalAlign: "middle"
};


const buttonIconStyle = {
    fontSize: "18px",

    marginRight: "6px",

    verticalAlign: "middle"
};


const addButtonStyle = {
    height: "42px",

    padding: "0 18px",

    border: "none",

    borderRadius: "9px",

    background: "#ffffff",

    color: "var(--primary-color)",

    fontSize: "13px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
        "0 5px 14px rgba(0,0,0,0.18)",

    transition:
        "all 0.2s ease"
};


const plusStyle = {
    fontSize: "18px",

    marginRight: "6px",

    verticalAlign: "middle"
};


/* =====================================================
   SUMMARY
===================================================== */

const summaryGridStyle = {
    display: "grid",

    gridTemplateColumns:
        "repeat(3, minmax(0, 1fr))",

    gap: "16px",

    marginBottom: "22px"
};


const summaryCardStyle = {
    background: "var(--card-background)",

    border:
        "1px solid var(--border-color)",

    borderRadius: "12px",

    padding: "18px 20px",

    display: "flex",

    alignItems: "center",

    gap: "14px",

    boxShadow:
        "0 2px 8px rgba(15,23,42,0.035)",

    transition:
        "transform 0.2s ease, box-shadow 0.2s ease"
};


const summaryIconStyle = {
    width: "44px",

    height: "44px",

    borderRadius: "11px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "19px",

    fontWeight: "700",

    flexShrink: 0
};


const summaryTitleStyle = {
    color: "var(--muted-text-color)",

    fontSize: "12px",

    marginBottom: "4px"
};


const summaryValueStyle = {
    fontSize: "24px",

    fontWeight: "750",

    color: "var(--text-color)"
};


/* =====================================================
   TABLE CARD
===================================================== */

const tableCardStyle = {
    background: "var(--card-background)",

    border:
        "1px solid var(--border-color)",

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
        "1px solid var(--border-color)"
};


const tableTitleStyle = {
    margin: 0,

    fontSize: "17px",

    fontWeight: "700",

    color: "var(--text-color)"
};


const tableSubtitleStyle = {
    margin: "5px 0 0",

    color: "var(--muted-text-color)",

    fontSize: "12px"
};


/* =====================================================
   SEARCH
===================================================== */

const searchWrapperStyle = {
    width: "320px",

    maxWidth: "100%",

    height: "42px",

    display: "flex",

    alignItems: "center",

    background: "var(--input-background)",

    border:
        "1px solid var(--border-color)",

    borderRadius: "9px",

    padding: "0 11px",

    boxSizing: "border-box"
};


const searchIconStyle = {
    color: "var(--muted-text-color)",

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

    color: "var(--text-color)"
};


const clearButtonStyle = {
    border: "none",

    background: "transparent",

    color: "var(--muted-text-color)",

    fontSize: "19px",

    cursor: "pointer"
};


/* =====================================================
   TABLE
===================================================== */

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

    background: "var(--table-header-background)",

    color: "var(--muted-text-color)",

    fontSize: "11px",

    fontWeight: "700",

    textTransform: "uppercase",

    letterSpacing: "0.5px",

    borderBottom:
        "1px solid var(--border-color)",

    whiteSpace: "nowrap"
};


const tdStyle = {
    padding: "14px 16px",

    color: "var(--secondary-text-color)",

    fontSize: "13px",

    borderBottom:
        "1px solid var(--border-color)",

    verticalAlign: "middle"
};


const rowStyle = {
    background: "var(--card-background)",

    transition:
        "background 0.15s"
};


/* =====================================================
   EMPLOYEE
===================================================== */

const employeeCellStyle = {
    display: "flex",

    alignItems: "center",

    gap: "10px"
};


const avatarStyle = {
    width: "36px",

    height: "36px",

    borderRadius: "10px",

    background:
        "var(--primary-light)",

    color:
        "var(--primary-color)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "13px",

    fontWeight: "700",

    flexShrink: 0
};


const employeeNameStyle = {
    color: "var(--text-color)",

    fontSize: "13px",

    fontWeight: "650"
};


const employeeCodeStyle = {
    color: "var(--muted-text-color)",

    fontSize: "11px",

    marginTop: "3px"
};


/* =====================================================
   CONTACT
===================================================== */

const contactStyle = {
    display: "flex",

    flexDirection: "column",

    gap: "3px"
};


const mobileStyle = {
    color: "var(--muted-text-color)",

    fontSize: "11px"
};


const normalTextStyle = {
    color: "var(--secondary-text-color)",

    fontWeight: "500"
};


/* =====================================================
   LOCATION
===================================================== */

const locationBadgeStyle = {
    color: "var(--secondary-text-color)",

    fontSize: "12px"
};


/* =====================================================
   STATUS
===================================================== */

const statusBadgeStyle = {
    display: "inline-flex",

    alignItems: "center",

    gap: "6px",

    padding: "5px 9px",

    borderRadius: "20px",

    fontSize: "11px",

    fontWeight: "650"
};


/* =====================================================
   ACTIONS
===================================================== */

const actionStyle = {
    display: "flex",

    justifyContent: "center",

    gap: "7px"
};


const editButtonStyle = {
    padding: "7px 11px",

    border:
        "1px solid var(--border-color)",

    borderRadius: "7px",

    background:
        "var(--card-background)",

    color:
        "var(--primary-color)",

    fontSize: "11px",

    fontWeight: "600",

    cursor: "pointer"
};


const deleteButtonStyle = {
    padding: "7px 11px",

    border:
        "1px solid #fecaca",

    borderRadius: "7px",

    background: "#fff5f5",

    color: "#dc2626",

    fontSize: "11px",

    fontWeight: "600",

    cursor: "pointer"
};


/* =====================================================
   EMPTY / LOADING
===================================================== */

const emptyStyle = {
    padding: "55px 20px",

    textAlign: "center",

    color: "var(--muted-text-color)",

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

    border:
        "3px solid var(--primary-light)",

    borderTop:
        "3px solid var(--primary-color)",

    borderRadius: "50%",

    animation:
        "spin 0.8s linear infinite"
};


/* =====================================================
   PAGINATION
===================================================== */

const paginationStyle = {
    padding: "16px 22px",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "15px",

    flexWrap: "wrap"
};


const showingStyle = {
    color: "var(--muted-text-color)",

    fontSize: "12px"
};


const paginationButtonsStyle = {
    display: "flex",

    alignItems: "center",

    gap: "7px"
};


const pageButtonStyle = {
    padding: "7px 11px",

    border:
        "1px solid var(--border-color)",

    borderRadius: "7px",

    background:
        "var(--card-background)",

    color:
        "var(--secondary-text-color)",

    fontSize: "12px",

    cursor: "pointer"
};


const currentPageStyle = {
    padding: "7px 11px",

    borderRadius: "7px",

    background:
        "var(--primary-color)",

    color: "#ffffff",

    fontSize: "12px",

    fontWeight: "600"
};


/* =====================================================
   VIEW DETAILS MODAL
===================================================== */

const viewModalOverlay = {
    position: "fixed",

    inset: 0,

    background:
        "rgba(15,23,42,0.55)",

    backdropFilter: "blur(3px)",

    WebkitBackdropFilter:
        "blur(3px)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    padding: "20px",

    zIndex: 9999
};


const viewModal = {
    width: "100%",

    maxWidth: "820px",

    maxHeight: "90vh",

    overflowY: "auto",

    background:
        "var(--card-background)",

    border:
        "1px solid var(--border-color)",

    borderRadius: "15px",

    boxShadow:
        "0 25px 70px rgba(15,23,42,0.25)"
};


const viewModalHeader = {
    padding: "20px 22px",

    borderBottom:
        "1px solid var(--border-color)",

    display: "flex",

    alignItems: "flex-start",

    justifyContent: "space-between",

    gap: "15px"
};


const viewModalEyebrow = {
    color:
        "var(--primary-color)",

    fontSize: "9px",

    fontWeight: "800",

    letterSpacing: "1.2px",

    marginBottom: "5px"
};


const viewModalTitle = {
    margin: 0,

    color:
        "var(--text-color)",

    fontSize: "20px",

    fontWeight: "750"
};


const viewModalCode = {
    marginTop: "4px",

    color:
        "var(--muted-text-color)",

    fontSize: "10px"
};


const viewCloseButton = {
    width: "32px",

    height: "32px",

    border:
        "1px solid var(--border-color)",

    borderRadius: "7px",

    background:
        "var(--muted-background)",

    color:
        "var(--muted-text-color)",

    cursor: "pointer",

    fontSize: "20px",

    lineHeight: 1,

    flexShrink: 0
};


const viewDetailGrid = {
    padding: "20px 22px",

    display: "grid",

    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",

    gap: "12px"
};


const detailItem = {
    padding: "12px",

    border:
        "1px solid var(--border-color)",

    borderRadius: "9px",

    background:
        "var(--table-header-background)"
};


const detailLabel = {
    color:
        "var(--muted-text-color)",

    fontSize: "9px",

    textTransform: "uppercase",

    letterSpacing: ".04em",

    fontWeight: "700",

    marginBottom: "5px"
};


const detailValue = {
    color:
        "var(--text-color)",

    fontSize: "12px",

    fontWeight: "650",

    wordBreak: "break-word"
};


const viewExtraSection = {
    padding: "0 22px 20px"
};


const viewSectionTitle = {
    color:
        "var(--text-color)",

    fontSize: "12px",

    fontWeight: "700",

    marginBottom: "10px"
};


const viewExtraGrid = {
    display: "grid",

    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",

    gap: "12px"
};


const viewModalFooter = {
    padding: "15px 22px",

    borderTop:
        "1px solid var(--border-color)",

    display: "flex",

    justifyContent: "flex-end",

    gap: "8px"
};


const viewCloseFooterButton = {
    height: "34px",

    padding: "0 14px",

    border:
        "1px solid var(--border-color)",

    borderRadius: "7px",

    background:
        "var(--muted-background)",

    color:
        "var(--text-color)",

    cursor: "pointer",

    fontSize: "10px",

    fontWeight: "650"
};


const viewEditButton = {
    height: "34px",

    padding: "0 14px",

    border: "none",

    borderRadius: "7px",

    background:
        "var(--primary-color)",

    color: "#ffffff",

    cursor: "pointer",

    fontSize: "10px",

    fontWeight: "700"
};


const viewLoadingBox = {
    minHeight: "260px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px"
};


const viewLoadingSpinner = {
    fontSize: "28px",

    color:
        "var(--primary-color)",

    animation:
        "spin 0.8s linear infinite"
};


const viewLoadingText = {
    color:
        "var(--muted-text-color)",

    fontSize: "12px"
};


export default Employees;