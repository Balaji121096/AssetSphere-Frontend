// src/pages/Purchase.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Purchase() {
    const navigate = useNavigate();

    const [purchases, setPurchases] = useState([]);
    const [summary, setSummary] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [loading, setLoading] = useState(true);

    // =====================================================
    // VIEW PURCHASE STATE
    // =====================================================

    const [viewPurchase, setViewPurchase] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    // =====================================================
    // LOAD PURCHASES
    // =====================================================

    const loadPurchases = async () => {
        try {
            setLoading(true);

            const response = await API.get("/purchases");

            setPurchases(response.data?.data || []);
        } catch (error) {
            console.error(
                "Load Purchases Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load purchases"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD SUMMARY
    // =====================================================

    const loadSummary = async () => {
        try {
            const response =
                await API.get("/purchases/summary");

            setSummary(
                response.data?.data || null
            );
        } catch (error) {
            console.error(
                "Purchase Summary Error:",
                error
            );
        }
    };

    useEffect(() => {
        loadPurchases();
        loadSummary();
    }, []);

    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = async () => {
        await Promise.all([
            loadPurchases(),
            loadSummary()
        ]);
    };

    // =====================================================
    // MONTH OPTIONS
    // =====================================================

    const monthOptions = useMemo(() => {
        const months = [];

        purchases.forEach((purchase) => {
            if (!purchase.purchase_date) {
                return;
            }

            const date =
                new Date(
                    purchase.purchase_date
                );

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return;
            }

            const year =
                date.getFullYear();

            const month =
                date.getMonth();

            const value =
                `${year}-${String(
                    month + 1
                ).padStart(2, "0")}`;

            const label =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        month: "long",
                        year: "numeric"
                    }
                );

            if (
                !months.some(
                    (item) =>
                        item.value === value
                )
            ) {
                months.push({
                    value,
                    label,
                    year,
                    month
                });
            }
        });

        months.sort(
            (a, b) =>
                new Date(
                    b.year,
                    b.month
                ) -
                new Date(
                    a.year,
                    a.month
                )
        );

        return months;
    }, [purchases]);

    // =====================================================
    // FILTER PURCHASES
    // =====================================================

    const filteredPurchases =
        useMemo(() => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();

            return purchases.filter(
                (purchase) => {

                    if (
                        selectedMonth !==
                        "all"
                    ) {
                        if (
                            !purchase.purchase_date
                        ) {
                            return false;
                        }

                        const date =
                            new Date(
                                purchase.purchase_date
                            );

                        if (
                            Number.isNaN(
                                date.getTime()
                            )
                        ) {
                            return false;
                        }

                        const purchaseMonth =
                            `${date.getFullYear()}-${String(
                                date.getMonth() + 1
                            ).padStart(
                                2,
                                "0"
                            )}`;

                        if (
                            purchaseMonth !==
                            selectedMonth
                        ) {
                            return false;
                        }
                    }

                    if (!searchText) {
                        return true;
                    }

                    const text = `
                        ${purchase.purchase_id || ""}
                        ${purchase.po_number || ""}
                        ${purchase.invoice_number || ""}
                        ${purchase.vendor_id || ""}
                        ${purchase.vendor_code || ""}
                        ${purchase.vendor_name || ""}
                        ${purchase.product_category || ""}
                        ${purchase.product_name || ""}
                        ${purchase.product_description || ""}
                        ${purchase.purchase_date || ""}
                        ${purchase.amount || ""}
                        ${purchase.payment_status || ""}
                        ${purchase.warranty_expiry || ""}
                        ${purchase.remarks || ""}
                        ${purchase.po_document || ""}
                        ${purchase.invoice_document || ""}
                    `.toLowerCase();

                    return text.includes(
                        searchText
                    );
                }
            );
        }, [
            purchases,
            search,
            selectedMonth
        ]);

    // =====================================================
    // SUMMARY
    // =====================================================

    const filteredSummary =
        useMemo(() => {

            if (
                selectedMonth ===
                "all"
            ) {
                return {
                    total_purchases:
                        Number(
                            summary?.total_purchases ||
                            0
                        ),

                    total_purchase_amount:
                        Number(
                            summary?.total_purchase_amount ||
                            0
                        ),

                    pending_payments:
                        Number(
                            summary?.pending_payments ||
                            0
                        ),

                    paid_purchases:
                        Number(
                            summary?.paid_purchases ||
                            0
                        )
                };
            }

            let totalPurchases = 0;
            let totalAmount = 0;
            let pendingPayments = 0;
            let paidPurchases = 0;

            filteredPurchases.forEach(
                (purchase) => {

                    totalPurchases += 1;

                    totalAmount +=
                        Number(
                            purchase.amount ||
                            0
                        );

                    if (
                        purchase.payment_status ===
                        "Pending"
                    ) {
                        pendingPayments += 1;
                    }

                    if (
                        purchase.payment_status ===
                        "Paid"
                    ) {
                        paidPurchases += 1;
                    }
                }
            );

            return {
                total_purchases:
                    totalPurchases,

                total_purchase_amount:
                    totalAmount,

                pending_payments:
                    pendingPayments,

                paid_purchases:
                    paidPurchases
            };

        }, [
            filteredPurchases,
            selectedMonth,
            summary
        ]);

    // =====================================================
    // HELPERS
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "en-IN"
        );
    };

    const formatExportDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return String(date);
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
    };

    const formatAmount = (amount) => {
        return Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        );
    };

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

    const escapeHTML = (value) => {
        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    };

    const escapeExcelValue = (value) => {
        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            );
    };

    // =====================================================
    // VIEW PURCHASE DETAILS
    // =====================================================

    const handleViewPurchase = async (
        purchase
    ) => {

        if (!purchase) {
            return;
        }

        // Immediately open modal with row data
        setViewPurchase(
            purchase
        );

        const purchaseId =
            purchase.purchase_id;

        if (!purchaseId) {
            return;
        }

        try {

            setViewLoading(true);

            const response =
                await API.get(
                    `/purchases/${purchaseId}`
                );

            const fullPurchase =
                response.data?.data;

            if (
                fullPurchase &&
                typeof fullPurchase ===
                    "object"
            ) {
                setViewPurchase({
                    ...purchase,
                    ...fullPurchase
                });
            }

        } catch (error) {

            console.error(
                "View Purchase Details Error:",
                error
            );

            // Existing row data will remain visible
        } finally {

            setViewLoading(false);

        }
    };

    // =====================================================
    // CLOSE PURCHASE DETAILS
    // =====================================================

    const closePurchaseDetails = () => {
        setViewPurchase(null);
        setViewLoading(false);
    };

    // =====================================================
    // EXPORT DATA
    // =====================================================

    const getPurchaseExportRows =
        () => {

            return filteredPurchases.map(
                (purchase) => ({

                    "Purchase ID":
                        getExportValue(
                            purchase.purchase_id
                        ),

                    "PO Number":
                        getExportValue(
                            purchase.po_number
                        ),

                    "Invoice Number":
                        getExportValue(
                            purchase.invoice_number
                        ),

                    "Vendor ID":
                        getExportValue(
                            purchase.vendor_id
                        ),

                    "Vendor Code":
                        getExportValue(
                            purchase.vendor_code
                        ),

                    "Vendor Name":
                        getExportValue(
                            purchase.vendor_name
                        ),

                    "Product Category":
                        getExportValue(
                            purchase.product_category
                        ),

                    "Product Name":
                        getExportValue(
                            purchase.product_name
                        ),

                    "Product Description":
                        getExportValue(
                            purchase.product_description
                        ),

                    "Purchase Date":
                        formatExportDate(
                            purchase.purchase_date
                        ),

                    "Amount":
                        Number(
                            purchase.amount ||
                            0
                        ),

                    "Payment Status":
                        getExportValue(
                            purchase.payment_status
                        ),

                    "Warranty Expiry":
                        formatExportDate(
                            purchase.warranty_expiry
                        ),

                    "Remarks":
                        getExportValue(
                            purchase.remarks
                        ),

                    "PO Document":
                        purchase.po_document
                            ? "Available"
                            : "Not Uploaded",

                    "Invoice Document":
                        purchase.invoice_document
                            ? "Available"
                            : "Not Uploaded",

                    "Selected Month":
                        selectedMonth ===
                        "all"
                            ? "All Months"
                            : monthOptions.find(
                                  (
                                      month
                                  ) =>
                                      month.value ===
                                      selectedMonth
                              )?.label ||
                              "-"

                })
            );
        };

    // =====================================================
    // EXPORT TO EXCEL
    // =====================================================

    const handleExportExcel =
        () => {

            if (
                filteredPurchases.length ===
                0
            ) {
                alert(
                    "No purchases available to export."
                );

                return;
            }

            const rows =
                getPurchaseExportRows();

            const headers =
                Object.keys(
                    rows[0]
                );

            const tableHeader =
                headers
                    .map(
                        (header) =>
                            `<th>${escapeExcelValue(
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
                                        (
                                            header
                                        ) =>
                                            `<td>${escapeExcelValue(
                                                row[
                                                    header
                                                ]
                                            )}</td>`
                                    )
                                    .join("")}
                            </tr>
                        `
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
                                border: 1px solid #cbd5e1;
                                padding: 8px;
                                font-weight: 700;
                                white-space: nowrap;
                            }

                            td {
                                border: 1px solid #dbe2ea;
                                padding: 8px;
                                vertical-align: top;
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
                `AssetSphere_Purchases_${new Date()
                    .toISOString()
                    .slice(
                        0,
                        10
                    )}.xls`;

            document.body.appendChild(
                link
            );

            link.click();

            document.body.removeChild(
                link
            );

            window.URL.revokeObjectURL(
                url
            );
        };

    // =====================================================
    // EXPORT TO PDF
    // =====================================================

    const handleExportPDF =
        () => {

            if (
                filteredPurchases.length ===
                0
            ) {
                alert(
                    "No purchases available to export."
                );

                return;
            }

            const rows =
                getPurchaseExportRows();

            const headers =
                Object.keys(
                    rows[0]
                );

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
                                        (
                                            header
                                        ) =>
                                            `<td>${escapeHTML(
                                                row[
                                                    header
                                                ]
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
                    "width=1500,height=900"
                );

            if (!printWindow) {
                alert(
                    "Please allow pop-ups in your browser to export PDF."
                );

                return;
            }

            const selectedMonthLabel =
                selectedMonth ===
                "all"
                    ? "All Months"
                    : monthOptions.find(
                          (
                              month
                          ) =>
                              month.value ===
                              selectedMonth
                      )?.label ||
                      "Selected Month";

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
                            AssetSphere - Purchase Report
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
                                margin-bottom: 15px;
                            }

                            .report-title {
                                margin: 0;
                                font-size: 22px;
                                font-weight: 700;
                                color: #111827;
                            }

                            .report-subtitle {
                                margin: 5px 0 0;
                                font-size: 11px;
                                color: #6b7280;
                            }

                            .report-summary {
                                display: flex;
                                flex-wrap: wrap;
                                gap: 18px;
                                margin-top: 10px;
                                font-size: 10px;
                                color: #374151;
                            }

                            .report-summary span {
                                white-space: nowrap;
                            }

                            table {
                                width: 100%;
                                border-collapse: collapse;
                                table-layout: auto;
                            }

                            thead {
                                display: table-header-group;
                            }

                            th {
                                background: #1e3a8a;
                                color: #ffffff;
                                border: 1px solid #cbd5e1;
                                padding: 6px 5px;
                                font-size: 7px;
                                text-align: left;
                                white-space: nowrap;
                            }

                            td {
                                border: 1px solid #dbe2ea;
                                padding: 5px;
                                font-size: 6.5px;
                                color: #1f2937;
                                vertical-align: top;
                            }

                            tr {
                                page-break-inside: avoid;
                            }

                            .footer {
                                margin-top: 10px;
                                font-size: 8px;
                                color: #6b7280;
                                text-align: right;
                            }

                        </style>

                    </head>

                    <body>

                        <div class="report-header">

                            <h1 class="report-title">
                                AssetSphere - Purchase Report
                            </h1>

                            <p class="report-subtitle">
                                Purchase directory export
                            </p>

                            <div class="report-summary">

                                <span>
                                    Period:
                                    <strong>
                                        ${escapeHTML(
                                            selectedMonthLabel
                                        )}
                                    </strong>
                                </span>

                                <span>
                                    Records:
                                    <strong>
                                        ${filteredPurchases.length}
                                    </strong>
                                </span>

                                <span>
                                    Total Amount:
                                    <strong>
                                        ${escapeHTML(
                                            formatAmount(
                                                filteredSummary.total_purchase_amount
                                            )
                                        )}
                                    </strong>
                                </span>

                                <span>
                                    Pending:
                                    <strong>
                                        ${filteredSummary.pending_payments}
                                    </strong>
                                </span>

                                <span>
                                    Paid:
                                    <strong>
                                        ${filteredSummary.paid_purchases}
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

                            window.onload =
                                function () {

                                    window.focus();

                                    window.print();
                                };

                        </script>

                    </body>

                </html>
            `);

            printWindow.document.close();

            printWindow.onafterprint =
                () => {
                    printWindow.close();
                };
        };

    // =====================================================
    // ACTIONS
    // =====================================================

    const handleAddPurchase =
        () => {
            navigate(
                "/purchases/add"
            );
        };

    const handleEditPurchase =
        (purchaseId) => {
            navigate(
                `/purchases/edit/${purchaseId}`
            );
        };

    const handleDeletePurchase =
        async (
            purchaseId
        ) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this purchase?"
                );

            if (!confirmed) {
                return;
            }

            try {

                const response =
                    await API.delete(
                        `/purchases/${purchaseId}`
                    );

                if (
                    response.data?.success
                ) {

                    alert(
                        "Purchase deleted successfully"
                    );

                    await Promise.all([
                        loadPurchases(),
                        loadSummary()
                    ]);

                } else {

                    alert(
                        response.data?.message ||
                        "Failed to delete purchase"
                    );
                }

            } catch (error) {

                console.error(
                    "Delete Purchase Error:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to delete purchase"
                );
            }
        };

    // =====================================================
    // DOCUMENT UPLOAD
    // =====================================================

    const handleUploadDocument =
        (
            purchaseId,
            documentType
        ) => {

            const input =
                document.createElement(
                    "input"
                );

            input.type = "file";

            input.accept =
                ".pdf,.jpg,.jpeg,.png,.doc,.docx";

            input.onchange =
                async (
                    event
                ) => {

                    const file =
                        event.target
                            .files?.[0];

                    if (!file) {
                        return;
                    }

                    if (
                        file.size >
                        10 *
                            1024 *
                            1024
                    ) {

                        alert(
                            "File size must be 10 MB or less."
                        );

                        return;
                    }

                    const formData =
                        new FormData();

                    formData.append(
                        "file",
                        file
                    );

                    try {

                        const response =
                            await API.post(
                                `/purchases/${purchaseId}/document/${documentType}`,
                                formData,
                                {
                                    headers: {
                                        "Content-Type":
                                            "multipart/form-data"
                                    }
                                }
                            );

                        if (
                            response.data?.success
                        ) {

                            alert(
                                documentType ===
                                    "po"
                                    ? "PO document uploaded successfully"
                                    : "Invoice document uploaded successfully"
                            );

                            await loadPurchases();

                        } else {

                            alert(
                                response.data?.message ||
                                "Failed to upload document"
                            );
                        }

                    } catch (
                        error
                    ) {

                        console.error(
                            "Upload Document Error:",
                            error
                        );

                        alert(
                            error.response?.data?.message ||
                            "Failed to upload document"
                        );
                    }
                };

            input.click();
        };

    // =====================================================
    // VIEW DOCUMENT
    // =====================================================

    const handleViewDocument =
        async (
            purchaseId,
            documentType
        ) => {

            try {

                const response =
                    await API.get(
                        `/purchases/${purchaseId}/document/${documentType}`,
                        {
                            responseType:
                                "blob"
                        }
                    );

                const fileUrl =
                    window.URL.createObjectURL(
                        response.data
                    );

                window.open(
                    fileUrl,
                    "_blank"
                );

                setTimeout(
                    () => {
                        window.URL.revokeObjectURL(
                            fileUrl
                        );
                    },
                    60000
                );

            } catch (error) {

                console.error(
                    "View Document Error:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to open document"
                );
            }
        };

    // =====================================================
    // DELETE DOCUMENT
    // =====================================================

    const handleDeleteDocument =
        async (
            purchaseId,
            documentType
        ) => {

            const documentName =
                documentType ===
                "po"
                    ? "PO"
                    : "Invoice";

            const confirmed =
                window.confirm(
                    `Are you sure you want to delete ${documentName} document?`
                );

            if (!confirmed) {
                return;
            }

            try {

                const response =
                    await API.delete(
                        `/purchases/${purchaseId}/document/${documentType}`
                    );

                if (
                    response.data?.success
                ) {

                    alert(
                        `${documentName} document deleted successfully`
                    );

                    await loadPurchases();

                } else {

                    alert(
                        response.data?.message ||
                        "Failed to delete document"
                    );
                }

            } catch (error) {

                console.error(
                    "Delete Document Error:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to delete document"
                );
            }
        };

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const handleClearFilters =
        () => {

            setSearch("");

            setSelectedMonth(
                "all"
            );
        };

    const selectedMonthLabel =
        selectedMonth ===
        "all"
            ? "All Months"
            : monthOptions.find(
                  (
                      month
                  ) =>
                      month.value ===
                      selectedMonth
              )?.label ||
              "Selected Month";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div style={pageStyle}>

            <Sidebar />

            <div style={mainStyle}>

                <Navbar />

                <main
                    style={
                        contentStyle
                    }
                >

                    {/* HEADER */}

                    <div
                        style={
                            headerStyle
                        }
                        className="purchase-header"
                    >

                        <div
                            style={
                                headerContentStyle
                            }
                        >

                            <div
                                style={
                                    eyebrowStyle
                                }
                            >
                                PURCHASE MANAGEMENT
                            </div>

                            <h1
                                style={
                                    titleStyle
                                }
                            >
                                Purchases
                            </h1>

                            <p
                                style={
                                    subtitleStyle
                                }
                            >
                                Manage company purchases
                                and track purchase documents.
                            </p>

                        </div>

                        <div
                            style={
                                headerButtonsStyle
                            }
                            className="purchase-header-buttons"
                        >

                            {/* REFRESH */}

                            <button
                                type="button"
                                onClick={
                                    handleRefresh
                                }
                                style={
                                    refreshButtonStyle
                                }
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


                            {/* EXCEL */}

                            <button
                                type="button"
                                onClick={
                                    handleExportExcel
                                }
                                disabled={
                                    filteredPurchases.length ===
                                    0
                                }
                                style={{
                                    ...excelButtonStyle,

                                    opacity:
                                        filteredPurchases.length ===
                                        0
                                            ? 0.5
                                            : 1,

                                    cursor:
                                        filteredPurchases.length ===
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


                            {/* PDF */}

                            <button
                                type="button"
                                onClick={
                                    handleExportPDF
                                }
                                disabled={
                                    filteredPurchases.length ===
                                    0
                                }
                                style={{
                                    ...pdfButtonStyle,

                                    opacity:
                                        filteredPurchases.length ===
                                        0
                                            ? 0.5
                                            : 1,

                                    cursor:
                                        filteredPurchases.length ===
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


                            {/* ADD */}

                            <button
                                type="button"
                                onClick={
                                    handleAddPurchase
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

                                Add Purchase

                            </button>

                        </div>

                    </div>


                    {/* FILTER */}

                    <div
                        style={
                            filterBarStyle
                        }
                    >

                        <div
                            style={
                                filterLeftStyle
                            }
                        >

                            <div
                                style={
                                    filterIconStyle
                                }
                            >
                                ◷
                            </div>

                            <div>

                                <div
                                    style={
                                        filterTitleStyle
                                    }
                                >
                                    Purchase Period
                                </div>

                                <div
                                    style={
                                        filterSubtitleStyle
                                    }
                                >
                                    View purchases month-wise
                                </div>

                            </div>

                        </div>


                        <div
                            style={
                                filterRightStyle
                            }
                        >

                            <select
                                value={
                                    selectedMonth
                                }
                                onChange={(e) =>
                                    setSelectedMonth(
                                        e.target.value
                                    )
                                }
                                style={
                                    monthSelectStyle
                                }
                            >

                                <option value="all">
                                    All Months
                                </option>

                                {monthOptions.map(
                                    (
                                        month
                                    ) => (

                                        <option
                                            key={
                                                month.value
                                            }
                                            value={
                                                month.value
                                            }
                                        >
                                            {
                                                month.label
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                            {(search ||
                                selectedMonth !==
                                    "all") && (

                                <button
                                    type="button"
                                    onClick={
                                        handleClearFilters
                                    }
                                    style={
                                        clearFilterStyle
                                    }
                                >
                                    Clear Filters
                                </button>

                            )}

                        </div>

                    </div>


                    {/* SUMMARY */}

                    <div
                        style={
                            summaryGridStyle
                        }
                        className="purchase-summary-grid"
                    >

                        <SummaryCard
                            title={
                                selectedMonth ===
                                "all"
                                    ? "Total Purchases"
                                    : `${selectedMonthLabel} Purchases`
                            }
                            value={
                                filteredSummary.total_purchases
                            }
                            icon="🛒"
                            color="#2563eb"
                            background="#eff6ff"
                        />

                        <SummaryCard
                            title="Total Amount"
                            value={
                                formatAmount(
                                    filteredSummary.total_purchase_amount
                                )
                            }
                            icon="₹"
                            color="#7c3aed"
                            background="#f5f3ff"
                        />

                        <SummaryCard
                            title="Pending Payments"
                            value={
                                filteredSummary.pending_payments
                            }
                            icon="◷"
                            color="#f97316"
                            background="#fff7ed"
                        />

                        <SummaryCard
                            title="Paid Purchases"
                            value={
                                filteredSummary.paid_purchases
                            }
                            icon="✓"
                            color="#16a34a"
                            background="#f0fdf4"
                        />

                    </div>


                    {/* TABLE */}

                    <div
                        style={
                            tableCardStyle
                        }
                    >

                        <div
                            style={
                                tableTopStyle
                            }
                        >

                            <div>

                                <h2
                                    style={
                                        tableTitleStyle
                                    }
                                >
                                    Purchase Directory
                                </h2>

                                <p
                                    style={
                                        tableSubtitleStyle
                                    }
                                >
                                    {
                                        filteredPurchases.length
                                    }{" "}

                                    purchase
                                    {
                                        filteredPurchases.length !==
                                        1
                                            ? "s"
                                            : ""
                                    }{" "}

                                    found

                                    {selectedMonth !==
                                        "all" &&
                                        ` for ${selectedMonthLabel}`}

                                </p>

                            </div>


                            {/* SEARCH */}

                            <div
                                style={
                                    searchAreaStyle
                                }
                            >

                                <div
                                    style={
                                        searchWrapperStyle
                                    }
                                    className="search-wrapper"
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
                                        placeholder="Search PO, invoice, vendor..."
                                        value={
                                            search
                                        }
                                        onChange={(
                                            e
                                        ) =>
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
                                                setSearch(
                                                    ""
                                                )
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

                        </div>


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
                                            PO Number
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Invoice
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Vendor
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Product
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Purchase Date
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Amount
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Payment
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Warranty
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Remarks
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Documents
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {loading ? (

                                        <tr>

                                            <td
                                                colSpan="12"
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

                                                Loading purchases...

                                            </td>

                                        </tr>

                                    ) : filteredPurchases.length ===
                                      0 ? (

                                        <tr>

                                            <td
                                                colSpan="12"
                                                style={
                                                    emptyStyle
                                                }
                                            >

                                                <div
                                                    style={
                                                        emptyIconStyle
                                                    }
                                                >
                                                    🛒
                                                </div>

                                                <strong>
                                                    No purchases found
                                                </strong>

                                                <p
                                                    style={{
                                                        margin:
                                                            "6px 0 0",
                                                        color:
                                                            "#94a3b8"
                                                    }}
                                                >

                                                    {selectedMonth !==
                                                    "all"
                                                        ? `No purchases found for ${selectedMonthLabel}`
                                                        : search
                                                        ? "Try changing your search"
                                                        : "Add your first purchase to get started"}

                                                </p>

                                            </td>

                                        </tr>

                                    ) : (

                                        filteredPurchases.map(
                                            (
                                                purchase
                                            ) => (

                                                <tr
                                                    key={
                                                        purchase.purchase_id
                                                    }
                                                    style={
                                                        rowStyle
                                                    }
                                                >

                                                    {/* ID */}

                                                    <td
                                                        style={{
                                                            ...tdStyle,
                                                            color:
                                                                "#64748b"
                                                        }}
                                                    >

                                                        #
                                                        {
                                                            purchase.purchase_id
                                                        }

                                                    </td>


                                                    {/* PO */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <span
                                                            style={{
                                                                ...poNumberStyle,
                                                                cursor: "pointer"
                                                            }}
                                                            onClick={() =>
                                                                handleViewPurchase(
                                                                    purchase
                                                                )
                                                            }
                                                            title="View purchase details"
                                                        >
                                                            {
                                                                purchase.po_number ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* INVOICE */}

                                                    <td
                                                        style={{
                                                            ...tdStyle,
                                                            cursor: "pointer"
                                                        }}
                                                        onClick={() =>
                                                            handleViewPurchase(
                                                                purchase
                                                            )
                                                        }
                                                        title="View purchase details"
                                                    >
                                                        {
                                                            purchase.invoice_number ||
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* VENDOR */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={{
                                                                cursor: "pointer"
                                                            }}
                                                            onClick={() =>
                                                                handleViewPurchase(
                                                                    purchase
                                                                )
                                                            }
                                                            title="View purchase details"
                                                        >

                                                            <div
                                                                style={
                                                                    vendorNameStyle
                                                                }
                                                            >
                                                                {
                                                                    purchase.vendor_name ||
                                                                    "-"
                                                                }
                                                            </div>

                                                            {purchase.vendor_code && (

                                                                <div
                                                                    style={
                                                                        vendorCodeStyle
                                                                    }
                                                                >
                                                                    {
                                                                        purchase.vendor_code
                                                                    }
                                                                </div>

                                                            )}

                                                        </div>

                                                    </td>


                                                    {/* PRODUCT */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={{
                                                                ...productCellStyle,
                                                                cursor: "pointer"
                                                            }}
                                                            onClick={() =>
                                                                handleViewPurchase(
                                                                    purchase
                                                                )
                                                            }
                                                            title="View purchase details"
                                                        >

                                                            {purchase.product_category && (

                                                                <span
                                                                    style={
                                                                        productCategoryStyle
                                                                    }
                                                                >
                                                                    {
                                                                        purchase.product_category
                                                                    }
                                                                </span>

                                                            )}

                                                            <span
                                                                style={
                                                                    productNameStyle
                                                                }
                                                            >
                                                                {
                                                                    purchase.product_name ||
                                                                    "-"
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* PURCHASE DATE */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {formatDate(
                                                            purchase.purchase_date
                                                        )}
                                                    </td>


                                                    {/* AMOUNT */}

                                                    <td
                                                        style={
                                                            amountStyle
                                                        }
                                                    >
                                                        {formatAmount(
                                                            purchase.amount
                                                        )}
                                                    </td>


                                                    {/* PAYMENT */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <span
                                                            style={{
                                                                ...paymentBadgeStyle,

                                                                background:
                                                                    purchase.payment_status ===
                                                                    "Paid"
                                                                        ? "#dcfce7"
                                                                        : purchase.payment_status ===
                                                                          "Cancelled"
                                                                        ? "#fee2e2"
                                                                        : purchase.payment_status ===
                                                                          "Partially Paid"
                                                                        ? "#fef3c7"
                                                                        : "#fff7ed",

                                                                color:
                                                                    purchase.payment_status ===
                                                                    "Paid"
                                                                        ? "#166534"
                                                                        : purchase.payment_status ===
                                                                          "Cancelled"
                                                                        ? "#991b1b"
                                                                        : purchase.payment_status ===
                                                                          "Partially Paid"
                                                                        ? "#92400e"
                                                                        : "#9a3412"
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
                                                                purchase.payment_status ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* WARRANTY */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {formatDate(
                                                            purchase.warranty_expiry
                                                        )}
                                                    </td>


                                                    {/* REMARKS */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <span
                                                            style={
                                                                remarksStyle
                                                            }
                                                            title={
                                                                purchase.remarks ||
                                                                ""
                                                            }
                                                        >
                                                            {
                                                                purchase.remarks ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* DOCUMENTS */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                documentContainerStyle
                                                            }
                                                        >

                                                            <DocumentRow
                                                                label="PO"
                                                                exists={
                                                                    !!purchase.po_document
                                                                }
                                                                onView={() =>
                                                                    handleViewDocument(
                                                                        purchase.purchase_id,
                                                                        "po"
                                                                    )
                                                                }
                                                                onUpload={() =>
                                                                    handleUploadDocument(
                                                                        purchase.purchase_id,
                                                                        "po"
                                                                    )
                                                                }
                                                                onDelete={() =>
                                                                    handleDeleteDocument(
                                                                        purchase.purchase_id,
                                                                        "po"
                                                                    )
                                                                }
                                                                uploadText="Upload PO"
                                                            />

                                                            <DocumentRow
                                                                label="Invoice"
                                                                exists={
                                                                    !!purchase.invoice_document
                                                                }
                                                                onView={() =>
                                                                    handleViewDocument(
                                                                        purchase.purchase_id,
                                                                        "invoice"
                                                                    )
                                                                }
                                                                onUpload={() =>
                                                                    handleUploadDocument(
                                                                        purchase.purchase_id,
                                                                        "invoice"
                                                                    )
                                                                }
                                                                onDelete={() =>
                                                                    handleDeleteDocument(
                                                                        purchase.purchase_id,
                                                                        "invoice"
                                                                    )
                                                                }
                                                                uploadText="Upload Invoice"
                                                            />

                                                        </div>

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                actionStyle
                                                            }
                                                        >

                                                            {/* VIEW */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleViewPurchase(
                                                                        purchase
                                                                    )
                                                                }
                                                                style={
                                                                    viewPurchaseButtonStyle
                                                                }
                                                                title="View Purchase"
                                                            >
                                                                View
                                                            </button>


                                                            {/* EDIT */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEditPurchase(
                                                                        purchase.purchase_id
                                                                    )
                                                                }
                                                                style={
                                                                    editButtonStyle
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                            {/* DELETE */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeletePurchase(
                                                                        purchase.purchase_id
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

                    </div>

                </main>

            </div>


            {/* =====================================================
                VIEW PURCHASE DETAILS MODAL
            ===================================================== */}

            {viewPurchase && (
                <div
                    style={
                        viewModalOverlayStyle
                    }
                    onClick={
                        closePurchaseDetails
                    }
                >

                    <div
                        style={
                            viewModalStyle
                        }
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div
                            style={
                                viewModalHeaderStyle
                            }
                        >

                            <div>

                                <div
                                    style={
                                        viewModalEyebrowStyle
                                    }
                                >
                                    PURCHASE INFORMATION
                                </div>

                                <h2
                                    style={
                                        viewModalTitleStyle
                                    }
                                >
                                    Purchase Details
                                </h2>

                                <p
                                    style={
                                        viewModalSubtitleStyle
                                    }
                                >
                                    Purchase #
                                    {
                                        viewPurchase.purchase_id ||
                                        "-"
                                    }
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    closePurchaseDetails
                                }
                                style={
                                    viewModalCloseStyle
                                }
                                title="Close"
                            >
                                ×
                            </button>

                        </div>


                        {/* LOADING */}

                        {viewLoading && (
                            <div
                                style={
                                    viewLoadingStyle
                                }
                            >

                                <div
                                    style={
                                        viewSpinnerStyle
                                    }
                                />

                                <span>
                                    Loading full purchase details...
                                </span>

                            </div>
                        )}


                        {/* DETAILS */}

                        <div
                            style={
                                viewDetailGridStyle
                            }
                            className="purchase-view-detail-grid"
                        >

                            <DetailItem
                                label="Purchase ID"
                                value={
                                    viewPurchase.purchase_id
                                        ? `#${viewPurchase.purchase_id}`
                                        : "-"
                                }
                            />

                            <DetailItem
                                label="PO Number"
                                value={
                                    viewPurchase.po_number
                                }
                            />

                            <DetailItem
                                label="Invoice Number"
                                value={
                                    viewPurchase.invoice_number
                                }
                            />

                            <DetailItem
                                label="Vendor ID"
                                value={
                                    viewPurchase.vendor_id
                                }
                            />

                            <DetailItem
                                label="Vendor Code"
                                value={
                                    viewPurchase.vendor_code
                                }
                            />

                            <DetailItem
                                label="Vendor Name"
                                value={
                                    viewPurchase.vendor_name
                                }
                            />

                            <DetailItem
                                label="Product Category"
                                value={
                                    viewPurchase.product_category
                                }
                            />

                            <DetailItem
                                label="Product Name"
                                value={
                                    viewPurchase.product_name
                                }
                            />

                            <DetailItem
                                label="Product Description"
                                value={
                                    viewPurchase.product_description
                                }
                            />

                            <DetailItem
                                label="Purchase Date"
                                value={
                                    formatDate(
                                        viewPurchase.purchase_date
                                    )
                                }
                            />

                            <DetailItem
                                label="Amount"
                                value={
                                    formatAmount(
                                        viewPurchase.amount
                                    )
                                }
                            />

                            <DetailItem
                                label="Payment Status"
                                value={
                                    viewPurchase.payment_status
                                }
                            />

                            <DetailItem
                                label="Warranty Expiry"
                                value={
                                    formatDate(
                                        viewPurchase.warranty_expiry
                                    )
                                }
                            />

                            <DetailItem
                                label="Remarks"
                                value={
                                    viewPurchase.remarks
                                }
                            />

                            <DetailItem
                                label="PO Document"
                                value={
                                    viewPurchase.po_document
                                        ? "Uploaded"
                                        : "Not Uploaded"
                                }
                            />

                            <DetailItem
                                label="Invoice Document"
                                value={
                                    viewPurchase.invoice_document
                                        ? "Uploaded"
                                        : "Not Uploaded"
                                }
                            />

                        </div>


                        {/* DOCUMENT SECTION */}

                        <div
                            style={
                                viewDocumentSectionStyle
                            }
                        >

                            <h3
                                style={
                                    viewSectionTitleStyle
                                }
                            >
                                Purchase Documents
                            </h3>

                            <div
                                style={
                                    viewDocumentCardsStyle
                                }
                            >

                                <ViewDocumentCard
                                    title="Purchase Order"
                                    exists={
                                        !!viewPurchase.po_document
                                    }
                                    onView={() =>
                                        handleViewDocument(
                                            viewPurchase.purchase_id,
                                            "po"
                                        )
                                    }
                                />

                                <ViewDocumentCard
                                    title="Invoice"
                                    exists={
                                        !!viewPurchase.invoice_document
                                    }
                                    onView={() =>
                                        handleViewDocument(
                                            viewPurchase.purchase_id,
                                            "invoice"
                                        )
                                    }
                                />

                            </div>

                        </div>


                        {/* FOOTER */}

                        <div
                            style={
                                viewModalFooterStyle
                            }
                        >

                            <button
                                type="button"
                                onClick={
                                    closePurchaseDetails
                                }
                                style={
                                    modalCloseButtonStyle
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}


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

                    @media (max-width: 1150px) {
                        .purchase-header {
                            align-items: flex-start !important;
                        }

                        .purchase-header-buttons {
                            width: 100%;
                            justify-content: flex-start !important;
                        }
                    }

                    @media (max-width: 900px) {
                        .purchase-summary-grid {
                            grid-template-columns: repeat(
                                2,
                                minmax(0, 1fr)
                            ) !important;
                        }
                    }

                    @media (max-width: 650px) {
                        .purchase-summary-grid {
                            grid-template-columns: 1fr !important;
                        }

                        .purchase-header {
                            padding: 24px 20px !important;
                        }

                        .purchase-header-buttons {
                            gap: 8px !important;
                        }

                        .purchase-header-buttons button {
                            flex: 1;
                        }

                        .search-wrapper {
                            width: 100% !important;
                        }

                        .purchase-view-detail-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}
            </style>

        </div>
    );
}


// =====================================================
// DOCUMENT ROW
// =====================================================

function DocumentRow({
    label,
    exists,
    onView,
    onUpload,
    onDelete,
    uploadText
}) {
    return (
        <div
            style={
                documentRowStyle
            }
        >

            <span
                style={
                    documentLabelStyle
                }
            >
                {label}
            </span>

            {exists ? (

                <>

                    <button
                        type="button"
                        onClick={
                            onView
                        }
                        style={
                            viewButtonStyle
                        }
                    >
                        View
                    </button>

                    <button
                        type="button"
                        onClick={
                            onUpload
                        }
                        style={
                            replaceButtonStyle
                        }
                    >
                        Replace
                    </button>

                    <button
                        type="button"
                        onClick={
                            onDelete
                        }
                        style={
                            documentDeleteButtonStyle
                        }
                    >
                        Delete
                    </button>

                </>

            ) : (

                <button
                    type="button"
                    onClick={
                        onUpload
                    }
                    style={
                        uploadButtonStyle
                    }
                >
                    {uploadText}
                </button>

            )}

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

            <div
                style={{
                    minWidth: 0
                }}
            >

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


// =====================================================
// DETAIL ITEM
// =====================================================

function DetailItem({
    label,
    value
}) {
    return (
        <div
            style={
                detailItemStyle
            }
        >

            <div
                style={
                    detailLabelStyle
                }
            >
                {label}
            </div>

            <div
                style={
                    detailValueStyle
                }
            >
                {value !== null &&
                value !== undefined &&
                value !== ""
                    ? value
                    : "-"}
            </div>

        </div>
    );
}


// =====================================================
// VIEW DOCUMENT CARD
// =====================================================

function ViewDocumentCard({
    title,
    exists,
    onView
}) {
    return (
        <div
            style={
                viewDocumentCardStyle
            }
        >

            <div>

                <div
                    style={
                        viewDocumentTitleStyle
                    }
                >
                    {title}
                </div>

                <div
                    style={
                        viewDocumentStatusStyle
                    }
                >
                    {exists
                        ? "Document available"
                        : "Document not uploaded"}
                </div>

            </div>

            {exists && (

                <button
                    type="button"
                    onClick={
                        onView
                    }
                    style={
                        viewDocumentButtonStyle
                    }
                >
                    View
                </button>

            )}

        </div>
    );
}


// =====================================================
// PAGE
// =====================================================

const pageStyle = {
    display: "flex",
    minHeight: "100vh",
    background:
        "var(--app-background, #f5f7fb)",
    color:
        "var(--text-color, #0f172a)"
};

const mainStyle = {
    flex: 1,
    minWidth: 0
};

const contentStyle = {
    width: "100%",
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "26px 30px 30px",
    boxSizing: "border-box"
};


// =====================================================
// HEADER
// =====================================================

const headerStyle = {
    position: "relative",
    minHeight: "152px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    padding: "28px 25px",
    marginBottom: "22px",
    overflow: "hidden",

    background: `
        radial-gradient(
            circle at 76% 115%,
            color-mix(
                in srgb,
                var(--primary-color, #437aff) 35%,
                transparent
            ) 0,
            color-mix(
                in srgb,
                var(--primary-color, #437aff) 16%,
                transparent
            ) 95px,
            transparent 96px
        ),
        linear-gradient(
            110deg,
            var(--sidebar-color, #101a35) 0%,
            var(--sidebar-color, #14234a) 38%,
            var(--primary-color, #1e4fb5) 72%,
            var(--primary-color, #2864e8) 100%
        )
    `,

    borderRadius: "15px",

    boxShadow:
        "0 10px 28px rgba(15, 23, 42, 0.16)"
};

const headerContentStyle = {
    position: "relative",
    zIndex: 2
};

const eyebrowStyle = {
    color: "#73baff",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    marginBottom: "8px"
};

const titleStyle = {
    margin: 0,
    color: "#ffffff",
    fontSize: "25px",
    lineHeight: "1.1",
    fontWeight: "800",
    letterSpacing: "-0.6px"
};

const subtitleStyle = {
    margin: "8px 0 0",
    color:
        "rgba(255,255,255,0.92)",
    fontSize: "12px",
    lineHeight: "1.5"
};

const headerButtonsStyle = {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px",
    flexWrap: "wrap"
};

const refreshButtonStyle = {
    height: "35px",
    padding: "0 13px",
    border:
        "1px solid rgba(255,255,255,0.28)",
    borderRadius: "7px",
    background:
        "rgba(255,255,255,0.10)",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: "700",
    cursor: "pointer",
    transition:
        "background 0.18s ease, transform 0.18s ease",
    backdropFilter: "blur(5px)"
};

const excelButtonStyle = {
    height: "35px",
    padding: "0 13px",
    border:
        "1px solid rgba(255,255,255,0.20)",
    borderRadius: "7px",
    background: "#15803d",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow:
        "0 4px 12px rgba(0,0,0,0.12)",
    transition:
        "transform 0.18s ease, box-shadow 0.18s ease"
};

const pdfButtonStyle = {
    height: "35px",
    padding: "0 13px",
    border:
        "1px solid rgba(255,255,255,0.20)",
    borderRadius: "7px",
    background: "#dc2626",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow:
        "0 4px 12px rgba(0,0,0,0.12)",
    transition:
        "transform 0.18s ease, box-shadow 0.18s ease"
};

const exportIconStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "22px",
    height: "18px",
    marginRight: "5px",
    padding: "0 3px",
    borderRadius: "4px",
    background:
        "rgba(255,255,255,0.18)",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "0.3px",
    verticalAlign: "middle"
};

const buttonIconStyle = {
    fontSize: "14px",
    fontWeight: "800",
    marginRight: "5px"
};

const addButtonStyle = {
    height: "35px",
    padding: "0 15px",
    border: "none",
    borderRadius: "7px",
    background: "#ffffff",
    color:
        "var(--primary-color, #1851b5)",
    fontSize: "10px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow:
        "0 4px 12px rgba(0,0,0,0.12)",
    transition:
        "transform 0.18s ease, box-shadow 0.18s ease"
};

const plusStyle = {
    fontSize: "14px",
    fontWeight: "800",
    marginRight: "5px"
};


// =====================================================
// FILTER
// =====================================================

const filterBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    padding: "15px 18px",
    marginBottom: "18px",
    background:
        "var(--card-background, #ffffff)",
    border:
        "1px solid var(--border-color, #e5eaf0)",
    borderRadius: "12px",
    boxShadow:
        "0 2px 8px rgba(15,23,42,0.025)"
};

const filterLeftStyle = {
    display: "flex",
    alignItems: "center",
    gap: "11px"
};

const filterIconStyle = {
    width: "38px",
    height: "38px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
        "var(--primary-light, #eff6ff)",
    color:
        "var(--primary-color, #2563eb)",
    fontSize: "18px",
    fontWeight: "700"
};

const filterTitleStyle = {
    fontSize: "13px",
    fontWeight: "700",
    color:
        "var(--text-color, #1e293b)"
};

const filterSubtitleStyle = {
    marginTop: "3px",
    fontSize: "11px",
    color:
        "var(--muted-text-color, #94a3b8)"
};

const filterRightStyle = {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    flexWrap: "wrap"
};

const monthSelectStyle = {
    height: "40px",
    minWidth: "170px",
    padding: "0 12px",
    border:
        "1px solid var(--border-color, #dbe2ea)",
    borderRadius: "8px",
    outline: "none",
    background:
        "var(--card-background, #ffffff)",
    color:
        "var(--text-color, #334155)",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer"
};

const clearFilterStyle = {
    height: "40px",
    padding: "0 13px",
    border:
        "1px solid #fecaca",
    borderRadius: "8px",
    background: "#fff5f5",
    color: "#dc2626",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer"
};


// =====================================================
// SUMMARY
// =====================================================

const summaryGridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "22px"
};

const summaryCardStyle = {
    background:
        "var(--card-background, #ffffff)",
    border:
        "1px solid var(--border-color, #e8edf3)",
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
    fontWeight: "700",
    flexShrink: 0
};

const summaryTitleStyle = {
    color:
        "var(--muted-text-color, #64748b)",
    fontSize: "12px",
    marginBottom: "4px"
};

const summaryValueStyle = {
    fontSize: "23px",
    fontWeight: "750",
    color:
        "var(--text-color, #0f172a)",
    whiteSpace: "nowrap"
};


// =====================================================
// TABLE CARD
// =====================================================

const tableCardStyle = {
    background:
        "var(--card-background, #ffffff)",
    border:
        "1px solid var(--border-color, #e5eaf0)",
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
        "1px solid var(--border-color, #edf1f5)"
};

const tableTitleStyle = {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700",
    color:
        "var(--text-color, #1e293b)"
};

const tableSubtitleStyle = {
    margin: "5px 0 0",
    color:
        "var(--muted-text-color, #94a3b8)",
    fontSize: "12px"
};


// =====================================================
// SEARCH
// =====================================================

const searchAreaStyle = {
    display: "flex",
    alignItems: "center"
};

const searchWrapperStyle = {
    width: "330px",
    maxWidth: "100%",
    height: "42px",
    display: "flex",
    alignItems: "center",
    background:
        "var(--input-background, #f8fafc)",
    border:
        "1px solid var(--border-color, #dbe2ea)",
    borderRadius: "9px",
    padding: "0 11px",
    boxSizing: "border-box"
};

const searchIconStyle = {
    color:
        "var(--muted-text-color, #94a3b8)",
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
    color:
        "var(--text-color, #0f172a)"
};

const clearButtonStyle = {
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: "19px",
    cursor: "pointer"
};


// =====================================================
// TABLE
// =====================================================

const tableWrapperStyle = {
    width: "100%",
    overflowX: "auto"
};

const tableStyle = {
    width: "100%",
    minWidth: "1700px",
    borderCollapse: "collapse"
};

const thStyle = {
    padding: "13px 16px",
    textAlign: "left",
    background:
        "var(--table-header-background, #f8fafc)",
    color:
        "var(--muted-text-color, #64748b)",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom:
        "1px solid var(--border-color, #e8edf3)",
    whiteSpace: "nowrap"
};

const tdStyle = {
    padding: "14px 16px",
    color:
        "var(--secondary-text-color, #475569)",
    fontSize: "13px",
    borderBottom:
        "1px solid var(--border-color, #f0f2f5)",
    verticalAlign: "middle",
    whiteSpace: "nowrap"
};

const rowStyle = {
    background:
        "var(--card-background, #ffffff)",
    transition:
        "background 0.15s"
};


// =====================================================
// PURCHASE DATA
// =====================================================

const poNumberStyle = {
    color:
        "var(--primary-color, #2563eb)",
    fontWeight: "650"
};

const vendorNameStyle = {
    color:
        "var(--text-color, #1e293b)",
    fontSize: "13px",
    fontWeight: "650"
};

const vendorCodeStyle = {
    color:
        "var(--muted-text-color, #94a3b8)",
    fontSize: "11px",
    marginTop: "3px"
};

const productCellStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
};

const productCategoryStyle = {
    display: "inline-flex",
    width: "fit-content",
    padding: "3px 7px",
    borderRadius: "5px",
    background:
        "var(--table-header-background, #f1f5f9)",
    color:
        "var(--secondary-text-color, #475569)",
    fontSize: "10px",
    fontWeight: "700"
};

const productNameStyle = {
    color:
        "var(--secondary-text-color, #334155)",
    fontSize: "12px",
    fontWeight: "600"
};

const amountStyle = {
    padding: "14px 16px",
    color:
        "var(--text-color, #1e293b)",
    fontSize: "13px",
    fontWeight: "650",
    borderBottom:
        "1px solid var(--border-color, #f0f2f5)",
    verticalAlign: "middle",
    whiteSpace: "nowrap"
};

const remarksStyle = {
    display: "block",
    maxWidth: "180px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color:
        "var(--muted-text-color, #64748b)"
};


// =====================================================
// PAYMENT
// =====================================================

const paymentBadgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "650"
};


// =====================================================
// DOCUMENTS
// =====================================================

const documentContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
};

const documentRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px"
};

const documentLabelStyle = {
    minWidth: "48px",
    fontWeight: "650",
    fontSize: "11px",
    color:
        "var(--text-color, #334155)"
};

const viewButtonStyle = {
    padding: "5px 8px",
    border:
        "1px solid #16a34a",
    background:
        "var(--card-background, #ffffff)",
    color: "#16a34a",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "600"
};

const replaceButtonStyle = {
    padding: "5px 8px",
    border:
        "1px solid var(--primary-color, #2563eb)",
    background:
        "var(--card-background, #ffffff)",
    color:
        "var(--primary-color, #2563eb)",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "600"
};

const documentDeleteButtonStyle = {
    padding: "5px 8px",
    border:
        "1px solid #dc2626",
    background:
        "var(--card-background, #ffffff)",
    color: "#dc2626",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "600"
};

const uploadButtonStyle = {
    padding: "5px 9px",
    border: "none",
    background:
        "var(--primary-color, #2563eb)",
    color: "#ffffff",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "600"
};


// =====================================================
// ACTIONS
// =====================================================

const actionStyle = {
    display: "flex",
    gap: "7px",
    alignItems: "center"
};

const viewPurchaseButtonStyle = {
    padding: "7px 11px",
    border:
        "1px solid #16a34a",
    borderRadius: "7px",
    background: "#f0fdf4",
    color: "#15803d",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer"
};

const editButtonStyle = {
    padding: "7px 11px",
    border:
        "1px solid var(--border-color, #dbe2ea)",
    borderRadius: "7px",
    background:
        "var(--card-background, #ffffff)",
    color:
        "var(--primary-color, #2563eb)",
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


// =====================================================
// EMPTY / LOADING
// =====================================================

const emptyStyle = {
    padding: "55px 20px",
    textAlign: "center",
    color:
        "var(--muted-text-color, #64748b)",
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
        "3px solid var(--primary-light, #dbeafe)",
    borderTop:
        "3px solid var(--primary-color, #2563eb)",
    borderRadius: "50%",
    animation:
        "spin 0.8s linear infinite"
};


// =====================================================
// VIEW MODAL
// =====================================================

const viewModalOverlayStyle = {
    position: "fixed",
    inset: 0,
    background:
        "rgba(15, 23, 42, 0.58)",
    backdropFilter:
        "blur(4px)",
    WebkitBackdropFilter:
        "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 9999
};

const viewModalStyle = {
    width: "100%",
    maxWidth: "950px",
    maxHeight: "90vh",
    overflowY: "auto",
    background:
        "var(--card-background, #ffffff)",
    border:
        "1px solid var(--border-color, #e5eaf0)",
    borderRadius: "15px",
    boxShadow:
        "0 25px 70px rgba(15,23,42,0.28)"
};

const viewModalHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
    padding: "20px 22px",
    borderBottom:
        "1px solid var(--border-color, #edf1f5)"
};

const viewModalEyebrowStyle = {
    color:
        "var(--primary-color, #2563eb)",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
    marginBottom: "5px"
};

const viewModalTitleStyle = {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    color:
        "var(--text-color, #1e293b)"
};

const viewModalSubtitleStyle = {
    margin: "5px 0 0",
    fontSize: "11px",
    color:
        "var(--muted-text-color, #94a3b8)"
};

const viewModalCloseStyle = {
    width: "34px",
    height: "34px",
    border:
        "1px solid var(--border-color, #dbe2ea)",
    borderRadius: "8px",
    background:
        "var(--card-background, #ffffff)",
    color:
        "var(--secondary-text-color, #64748b)",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
};

const viewLoadingStyle = {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    margin: "18px 22px 0",
    padding: "10px 12px",
    borderRadius: "8px",
    background:
        "var(--primary-light, #eff6ff)",
    color:
        "var(--primary-color, #2563eb)",
    fontSize: "11px",
    fontWeight: "650"
};

const viewSpinnerStyle = {
    width: "14px",
    height: "14px",
    border:
        "2px solid #bfdbfe",
    borderTop:
        "2px solid #2563eb",
    borderRadius: "50%",
    animation:
        "spin 0.8s linear infinite",
    flexShrink: 0
};

const viewDetailGridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",
    gap: "13px",
    padding: "20px 22px"
};

const detailItemStyle = {
    padding: "13px 14px",
    border:
        "1px solid var(--border-color, #e7ecf1)",
    borderRadius: "10px",
    background:
        "var(--input-background, #f8fafc)"
};

const detailLabelStyle = {
    marginBottom: "6px",
    color:
        "var(--muted-text-color, #94a3b8)",
    fontSize: "9px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
};

const detailValueStyle = {
    color:
        "var(--text-color, #1e293b)",
    fontSize: "13px",
    fontWeight: "650",
    lineHeight: "1.5",
    whiteSpace: "normal",
    wordBreak: "break-word"
};

const viewDocumentSectionStyle = {
    padding: "0 22px 20px"
};

const viewSectionTitleStyle = {
    margin: "0 0 12px",
    fontSize: "14px",
    fontWeight: "750",
    color:
        "var(--text-color, #1e293b)"
};

const viewDocumentCardsStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",
    gap: "12px"
};

const viewDocumentCardStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    padding: "13px 14px",
    border:
        "1px solid var(--border-color, #e7ecf1)",
    borderRadius: "10px",
    background:
        "var(--input-background, #f8fafc)"
};

const viewDocumentTitleStyle = {
    color:
        "var(--text-color, #1e293b)",
    fontSize: "12px",
    fontWeight: "700"
};

const viewDocumentStatusStyle = {
    marginTop: "4px",
    color:
        "var(--muted-text-color, #94a3b8)",
    fontSize: "10px"
};

const viewDocumentButtonStyle = {
    padding: "7px 12px",
    border: "none",
    borderRadius: "7px",
    background:
        "var(--primary-color, #2563eb)",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: "700",
    cursor: "pointer",
    flexShrink: 0
};

const viewModalFooterStyle = {
    display: "flex",
    justifyContent: "flex-end",
    padding: "15px 22px",
    borderTop:
        "1px solid var(--border-color, #edf1f5)"
};

const modalCloseButtonStyle = {
    padding: "8px 15px",
    border:
        "1px solid var(--border-color, #dbe2ea)",
    borderRadius: "7px",
    background:
        "var(--card-background, #ffffff)",
    color:
        "var(--text-color, #334155)",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer"
};

export default Purchase;