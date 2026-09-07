const getValue = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }

    return String(value);
};


const formatDate = (value) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return getValue(value);
    }

    return date.toLocaleDateString("en-GB");
};


const escapeHTML = (value) => {
    return getValue(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
};


// =====================================================
// EXPORT DATA
// =====================================================

const buildEmployeeRows = (employees) => {
    return employees.map((employee) => ({
        "Employee ID":
            getValue(employee.employee_id),

        "Employee Code":
            getValue(employee.employee_code),

        "Employee Name":
            getValue(employee.display_name),

        "Official Email":
            getValue(employee.official_email),

        "Mobile Number":
            getValue(employee.mobile_number),

        "Department":
            getValue(
                employee.department_name
            ),

        "Designation":
            getValue(
                employee.designation_name
            ),

        "Work Location":
            getValue(
                employee.work_location
            ),

        "Employment Type":
            getValue(
                employee.employment_type
            ),

        "Joining Date":
            formatDate(
                employee.joining_date
            ),

        "Status":
            getValue(employee.status)
    }));
};


// =====================================================
// EXCEL EXPORT
// =====================================================

export const exportEmployeesToExcel = (
    employees
) => {

    const rows =
        buildEmployeeRows(employees);

    if (!rows.length) {
        return;
    }

    const headers =
        Object.keys(rows[0]);

    const tableHeaders = headers
        .map(
            (header) =>
                `<th>${escapeHTML(header)}</th>`
        )
        .join("");

    const tableRows = rows
        .map((row) => {

            const cells = headers
                .map(
                    (header) =>
                        `<td>${escapeHTML(
                            row[header]
                        )}</td>`
                )
                .join("");

            return `<tr>${cells}</tr>`;
        })
        .join("");

    const html = `
        <html>
            <head>
                <meta charset="UTF-8" />

                <style>
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        font-family: Arial, sans-serif;
                    }

                    th,
                    td {
                        border: 1px solid #d1d5db;
                        padding: 7px;
                        text-align: left;
                        font-size: 11px;
                    }

                    th {
                        background: #e5e7eb;
                        font-weight: bold;
                    }
                </style>
            </head>

            <body>

                <table>
                    <thead>
                        <tr>
                            ${tableHeaders}
                        </tr>
                    </thead>

                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>

            </body>
        </html>
    `;

    const blob = new Blob(
        [html],
        {
            type:
                "application/vnd.ms-excel"
        }
    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    link.href = url;

    link.download =
        `AssetSphere_Employees_${today}.xls`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};


// =====================================================
// PDF EXPORT
// =====================================================

export const exportEmployeesToPDF = (
    employees
) => {

    const rows =
        buildEmployeeRows(employees);

    if (!rows.length) {
        return;
    }

    const headers =
        Object.keys(rows[0]);

    const tableHeaders = headers
        .map(
            (header) =>
                `<th>${escapeHTML(header)}</th>`
        )
        .join("");

    const tableRows = rows
        .map((row) => {

            const cells = headers
                .map(
                    (header) =>
                        `<td>${escapeHTML(
                            row[header]
                        )}</td>`
                )
                .join("");

            return `<tr>${cells}</tr>`;
        })
        .join("");

    const printWindow =
        window.open(
            "",
            "_blank",
            "width=1400,height=900"
        );

    if (!printWindow) {
        alert(
            "Please allow pop-ups to export PDF."
        );

        return;
    }

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
                        margin: 10mm;
                    }

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        font-family:
                            Arial,
                            sans-serif;

                        color: #111827;

                        margin: 0;
                    }

                    h1 {
                        font-size: 20px;
                        margin: 0 0 5px;
                    }

                    p {
                        margin: 0 0 15px;
                        font-size: 11px;
                        color: #6b7280;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th,
                    td {
                        border: 1px solid #d1d5db;
                        padding: 6px;
                        font-size: 8px;
                        text-align: left;
                        vertical-align: top;
                    }

                    th {
                        background: #e5e7eb;
                        font-weight: bold;
                    }

                    tr {
                        page-break-inside:
                            avoid;
                    }

                </style>

            </head>

            <body>

                <h1>
                    AssetSphere - Employee Report
                </h1>

                <p>
                    Total Employees: ${rows.length}
                </p>

                <table>

                    <thead>
                        <tr>
                            ${tableHeaders}
                        </tr>
                    </thead>

                    <tbody>
                        ${tableRows}
                    </tbody>

                </table>

            </body>

        </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {

        printWindow.print();

        printWindow.close();

    }, 500);
};