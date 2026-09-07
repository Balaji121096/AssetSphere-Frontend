// ============================================================
// GENERIC EXPORT UTILITY
// Excel = .xls (opens directly in Microsoft Excel)
// PDF   = Browser Print -> Save as PDF
// ============================================================

const formatHeader = (key) => {
    return String(key || "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const escapeHtml = (value) => {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const formatValue = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }

    return String(value);
};

const getColumns = (records) => {
    const keys = new Set();

    records.forEach((record) => {
        Object.keys(record || {}).forEach((key) => {
            keys.add(key);
        });
    });

    return Array.from(keys);
};

const getDateStamp = () => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


// ============================================================
// EXCEL EXPORT
// ============================================================

export const exportToExcel = (
    records,
    filename = "AssetSphere_Export.xls"
) => {
    if (!Array.isArray(records) || records.length === 0) {
        alert("No records available to export.");
        return;
    }

    const columns = getColumns(records);

    const headerHtml = columns
        .map(
            (column) =>
                `<th>${escapeHtml(
                    formatHeader(column)
                )}</th>`
        )
        .join("");

    const rowsHtml = records
        .map((record) => {
            const cells = columns
                .map((column) => {
                    return `
                        <td>
                            ${escapeHtml(
                                formatValue(
                                    record?.[column]
                                )
                            )}
                        </td>
                    `;
                })
                .join("");

            return `<tr>${cells}</tr>`;
        })
        .join("");

    const excelHtml = `
        <html>
            <head>
                <meta charset="UTF-8" />

                <style>
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        font-family: Arial, sans-serif;
                        font-size: 11px;
                    }

                    th {
                        background: #e5e7eb;
                        border: 1px solid #9ca3af;
                        padding: 7px;
                        text-align: left;
                        font-weight: bold;
                    }

                    td {
                        border: 1px solid #d1d5db;
                        padding: 6px;
                        vertical-align: top;
                    }
                </style>
            </head>

            <body>

                <table>
                    <thead>
                        <tr>
                            ${headerHtml}
                        </tr>
                    </thead>

                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>

            </body>
        </html>
    `;

    const blob = new Blob(
        [excelHtml],
        {
            type: "application/vnd.ms-excel"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
        filename.endsWith(".xls")
            ? filename
            : `${filename}.xls`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};


// ============================================================
// PDF EXPORT
// ============================================================

export const exportToPDF = (
    records,
    title = "AssetSphere Report",
    filename = "AssetSphere_Report"
) => {
    if (!Array.isArray(records) || records.length === 0) {
        alert("No records available to export.");
        return;
    }

    const columns = getColumns(records);

    const headerHtml = columns
        .map(
            (column) =>
                `<th>${escapeHtml(
                    formatHeader(column)
                )}</th>`
        )
        .join("");

    const rowsHtml = records
        .map((record) => {
            const cells = columns
                .map((column) => {
                    return `
                        <td>
                            ${escapeHtml(
                                formatValue(
                                    record?.[column]
                                )
                            )}
                        </td>
                    `;
                })
                .join("");

            return `<tr>${cells}</tr>`;
        })
        .join("");

    const printWindow = window.open(
        "",
        "_blank",
        "width=1400,height=900"
    );

    if (!printWindow) {
        alert(
            "Popup blocked. Please allow popups for this website."
        );

        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>

        <html>

            <head>

                <meta charset="UTF-8" />

                <title>
                    ${escapeHtml(title)}
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
                        font-family: Arial, sans-serif;
                        margin: 0;
                        color: #111827;
                        background: #ffffff;
                    }

                    .report-header {
                        margin-bottom: 18px;
                    }

                    .report-title {
                        margin: 0;
                        font-size: 20px;
                        font-weight: 700;
                    }

                    .report-info {
                        margin-top: 5px;
                        font-size: 11px;
                        color: #6b7280;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        table-layout: auto;
                        font-size: 7px;
                    }

                    th {
                        background: #e5e7eb;
                        border: 1px solid #9ca3af;
                        padding: 5px;
                        text-align: left;
                        font-weight: 700;
                    }

                    td {
                        border: 1px solid #d1d5db;
                        padding: 4px;
                        vertical-align: top;
                        word-break: break-word;
                    }

                    tr {
                        page-break-inside: avoid;
                    }

                    .footer {
                        margin-top: 12px;
                        font-size: 9px;
                        color: #6b7280;
                    }

                </style>

            </head>

            <body>

                <div class="report-header">

                    <h1 class="report-title">
                        ${escapeHtml(title)}
                    </h1>

                    <div class="report-info">
                        Records: ${records.length}
                        &nbsp; | &nbsp;
                        Generated: ${getDateStamp()}
                    </div>

                </div>

                <table>

                    <thead>

                        <tr>
                            ${headerHtml}
                        </tr>

                    </thead>

                    <tbody>
                        ${rowsHtml}
                    </tbody>

                </table>

                <div class="footer">
                    AssetSphere
                </div>

            </body>

        </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
        printWindow.print();

        setTimeout(() => {
            printWindow.close();
        }, 500);
    }, 300);
};