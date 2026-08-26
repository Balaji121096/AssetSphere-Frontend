// src/pages/Purchase.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Purchase() {
    const navigate = useNavigate();

    // =====================================================
    // STATES
    // =====================================================

    const [purchases, setPurchases] = useState([]);
    const [summary, setSummary] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("all");

    const [loading, setLoading] = useState(true);

    // =====================================================
    // LOAD PURCHASES
    // =====================================================

    const loadPurchases = async () => {
        try {
            setLoading(true);

            const response = await API.get("/purchases");

            console.log(
                "Purchases API Response:",
                response.data
            );

            setPurchases(
                response.data?.data || []
            );
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
                await API.get(
                    "/purchases/summary"
                );

            console.log(
                "Purchase Summary Response:",
                response.data
            );

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

    // =====================================================
    // INITIAL LOAD
    // =====================================================

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

            if (Number.isNaN(date.getTime())) {
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

    const filteredPurchases = useMemo(() => {
        return purchases.filter(
            (purchase) => {

                // -----------------------------
                // MONTH FILTER
                // -----------------------------

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

                    const year =
                        date.getFullYear();

                    const month =
                        String(
                            date.getMonth() + 1
                        ).padStart(2, "0");

                    const purchaseMonth =
                        `${year}-${month}`;

                    if (
                        purchaseMonth !==
                        selectedMonth
                    ) {
                        return false;
                    }
                }

                // -----------------------------
                // SEARCH FILTER
                // -----------------------------

                const text = `
                    ${purchase.purchase_id || ""}
                    ${purchase.po_number || ""}
                    ${purchase.invoice_number || ""}
                    ${purchase.vendor_code || ""}
                    ${purchase.vendor_name || ""}
                    ${purchase.product_category || ""}
                    ${purchase.product_name || ""}
                    ${purchase.product_description || ""}
                    ${purchase.payment_status || ""}
                    ${purchase.remarks || ""}
                `.toLowerCase();

                return text.includes(
                    search.toLowerCase().trim()
                );
            }
        );
    }, [
        purchases,
        search,
        selectedMonth
    ]);

    // =====================================================
    // SELECTED MONTH SUMMARY
    // =====================================================

    const filteredSummary = useMemo(() => {

        // ALL MONTHS
        if (
            selectedMonth === "all"
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

        // SELECTED MONTH
        let totalPurchases = 0;
        let totalAmount = 0;
        let pendingPayments = 0;
        let paidPurchases = 0;

        filteredPurchases.forEach(
            (purchase) => {

                totalPurchases += 1;

                totalAmount += Number(
                    purchase.amount || 0
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
    // FORMAT DATE
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

    // =====================================================
    // FORMAT AMOUNT
    // =====================================================

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

    // =====================================================
    // ADD PURCHASE
    // =====================================================

    const handleAddPurchase = () => {
        navigate("/purchases/add");
    };

    // =====================================================
    // EDIT PURCHASE
    // =====================================================

    const handleEditPurchase = (
        purchaseId
    ) => {
        navigate(
            `/purchases/edit/${purchaseId}`
        );
    };

    // =====================================================
    // DELETE PURCHASE
    // =====================================================

    const handleDeletePurchase = async (
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
    // UPLOAD / REPLACE DOCUMENT
    // =====================================================

    const handleUploadDocument = (
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

        input.onchange = async (
            event
        ) => {

            const file =
                event.target.files?.[0];

            if (!file) {
                return;
            }

            // ---------------------------------
            // FILE SIZE VALIDATION
            // ---------------------------------

            const maxSize =
                10 * 1024 * 1024;

            if (
                file.size >
                maxSize
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
                        documentType === "po"
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

            } catch (error) {

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
    // VIEW / DOWNLOAD DOCUMENT
    // =====================================================

    const handleViewDocument = async (
        purchaseId,
        documentType
    ) => {

        try {

            const response =
                await API.get(
                    `/purchases/${purchaseId}/document/${documentType}`,
                    {
                        responseType: "blob"
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

    const handleDeleteDocument = async (
        purchaseId,
        documentType
    ) => {

        const documentName =
            documentType === "po"
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

    const handleClearFilters = () => {
        setSearch("");
        setSelectedMonth("all");
    };

    // =====================================================
    // SELECTED MONTH LABEL
    // =====================================================

    const selectedMonthLabel =
        selectedMonth === "all"
            ? "All Months"
            : monthOptions.find(
                  (month) =>
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

                <main style={contentStyle}>

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div style={headerStyle}>

                        <div>

                            <div style={eyebrowStyle}>
                                PURCHASE MANAGEMENT
                            </div>

                            <h1 style={titleStyle}>
                                Purchases
                            </h1>

                            <p style={subtitleStyle}>
                                Manage company purchases
                                and track purchase
                                documents.
                            </p>

                        </div>

                        <div
                            style={
                                headerButtonsStyle
                            }
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


                    {/* =================================================
                        MONTH FILTER BANNER
                    ================================================= */}

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
                                    View purchases
                                    month-wise
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
                                onChange={(
                                    e
                                ) =>
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


                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div
                        style={
                            summaryGridStyle
                        }
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


                    {/* =================================================
                        TABLE CARD
                    ================================================= */}

                    <div style={tableCardStyle}>

                        {/* TABLE TOP */}

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
                                    {filteredPurchases.length}{" "}
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


                        {/* TABLE */}

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

                                        <th style={thStyle}>
                                            ID
                                        </th>

                                        <th style={thStyle}>
                                            PO Number
                                        </th>

                                        <th style={thStyle}>
                                            Invoice
                                        </th>

                                        <th style={thStyle}>
                                            Vendor
                                        </th>

                                        <th style={thStyle}>
                                            Product
                                        </th>

                                        <th style={thStyle}>
                                            Purchase Date
                                        </th>

                                        <th style={thStyle}>
                                            Amount
                                        </th>

                                        <th style={thStyle}>
                                            Payment
                                        </th>

                                        <th style={thStyle}>
                                            Warranty
                                        </th>

                                        <th style={thStyle}>
                                            Remarks
                                        </th>

                                        <th style={thStyle}>
                                            Documents
                                        </th>

                                        <th style={thStyle}>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {/* LOADING */}

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

                                    ) : filteredPurchases.length === 0 ? (

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


                                                    {/* PO NUMBER */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <span
                                                            style={
                                                                poNumberStyle
                                                            }
                                                        >
                                                            {
                                                                purchase.po_number ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* INVOICE */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
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

                                                        <div>

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
                                                            style={
                                                                productCellStyle
                                                            }
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
                                                        {
                                                            formatDate(
                                                                purchase.purchase_date
                                                            )
                                                        }
                                                    </td>


                                                    {/* AMOUNT */}

                                                    <td
                                                        style={
                                                            amountStyle
                                                        }
                                                    >
                                                        {
                                                            formatAmount(
                                                                purchase.amount
                                                            )
                                                        }
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
                                                        {
                                                            formatDate(
                                                                purchase.warranty_expiry
                                                            )
                                                        }
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

                                                            {/* PO */}

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
                                                                    PO
                                                                </span>

                                                                {purchase.po_document ? (

                                                                    <>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleViewDocument(
                                                                                    purchase.purchase_id,
                                                                                    "po"
                                                                                )
                                                                            }
                                                                            style={
                                                                                viewButtonStyle
                                                                            }
                                                                        >
                                                                            View
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleUploadDocument(
                                                                                    purchase.purchase_id,
                                                                                    "po"
                                                                                )
                                                                            }
                                                                            style={
                                                                                replaceButtonStyle
                                                                            }
                                                                        >
                                                                            Replace
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleDeleteDocument(
                                                                                    purchase.purchase_id,
                                                                                    "po"
                                                                                )
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
                                                                        onClick={() =>
                                                                            handleUploadDocument(
                                                                                purchase.purchase_id,
                                                                                "po"
                                                                            )
                                                                        }
                                                                        style={
                                                                            uploadButtonStyle
                                                                        }
                                                                    >
                                                                        Upload PO
                                                                    </button>

                                                                )}

                                                            </div>


                                                            {/* INVOICE */}

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
                                                                    Invoice
                                                                </span>

                                                                {purchase.invoice_document ? (

                                                                    <>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleViewDocument(
                                                                                    purchase.purchase_id,
                                                                                    "invoice"
                                                                                )
                                                                            }
                                                                            style={
                                                                                viewButtonStyle
                                                                            }
                                                                        >
                                                                            View
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleUploadDocument(
                                                                                    purchase.purchase_id,
                                                                                    "invoice"
                                                                                )
                                                                            }
                                                                            style={
                                                                                replaceButtonStyle
                                                                            }
                                                                        >
                                                                            Replace
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleDeleteDocument(
                                                                                    purchase.purchase_id,
                                                                                    "invoice"
                                                                                )
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
                                                                        onClick={() =>
                                                                            handleUploadDocument(
                                                                                purchase.purchase_id,
                                                                                "invoice"
                                                                            )
                                                                        }
                                                                        style={
                                                                            uploadButtonStyle
                                                                        }
                                                                    >
                                                                        Upload Invoice
                                                                    </button>

                                                                )}

                                                            </div>

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

                    @media (max-width: 900px) {
                        .purchase-summary-grid {
                            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                        }
                    }

                    @media (max-width: 600px) {
                        .purchase-summary-grid {
                            grid-template-columns: 1fr !important;
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
        <div style={summaryCardStyle}>

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
// PAGE
// =====================================================

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
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "30px",
    boxSizing: "border-box"
};


// =====================================================
// HEADER
// =====================================================

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "22px"
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


// =====================================================
// FILTER BAR
// =====================================================

const filterBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    padding: "15px 18px",
    marginBottom: "18px",
    background: "#ffffff",
    border: "1px solid #e5eaf0",
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
    background: "#eff6ff",
    color: "#2563eb",
    fontSize: "18px",
    fontWeight: "700"
};

const filterTitleStyle = {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1e293b"
};

const filterSubtitleStyle = {
    marginTop: "3px",
    fontSize: "11px",
    color: "#94a3b8"
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
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    outline: "none",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer"
};

const clearFilterStyle = {
    height: "40px",
    padding: "0 13px",
    border: "1px solid #fecaca",
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
    fontWeight: "700",
    flexShrink: 0
};

const summaryTitleStyle = {
    color: "#64748b",
    fontSize: "12px",
    marginBottom: "4px"
};

const summaryValueStyle = {
    fontSize: "23px",
    fontWeight: "750",
    color: "#0f172a",
    whiteSpace: "nowrap"
};


// =====================================================
// TABLE CARD
// =====================================================

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
    fontWeight: "700",
    color: "#1e293b"
};

const tableSubtitleStyle = {
    margin: "5px 0 0",
    color: "#94a3b8",
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
    verticalAlign: "middle",
    whiteSpace: "nowrap"
};

const rowStyle = {
    background: "#ffffff",
    transition:
        "background 0.15s"
};


// =====================================================
// PURCHASE DATA
// =====================================================

const poNumberStyle = {
    color: "#2563eb",
    fontWeight: "650"
};

const vendorNameStyle = {
    color: "#1e293b",
    fontSize: "13px",
    fontWeight: "650"
};

const vendorCodeStyle = {
    color: "#94a3b8",
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
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "10px",
    fontWeight: "700"
};

const productNameStyle = {
    color: "#334155",
    fontSize: "12px",
    fontWeight: "600"
};

const amountStyle = {
    padding: "14px 16px",
    color: "#1e293b",
    fontSize: "13px",
    fontWeight: "650",
    borderBottom:
        "1px solid #f0f2f5",
    verticalAlign: "middle",
    whiteSpace: "nowrap"
};

const remarksStyle = {
    display: "block",
    maxWidth: "180px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#64748b"
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
    color: "#334155"
};

const viewButtonStyle = {
    padding: "5px 8px",
    border: "1px solid #16a34a",
    background: "#ffffff",
    color: "#16a34a",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "600"
};

const replaceButtonStyle = {
    padding: "5px 8px",
    border: "1px solid #2563eb",
    background: "#ffffff",
    color: "#2563eb",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "600"
};

const documentDeleteButtonStyle = {
    padding: "5px 8px",
    border: "1px solid #dc2626",
    background: "#ffffff",
    color: "#dc2626",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "600"
};

const uploadButtonStyle = {
    padding: "5px 9px",
    border: "none",
    background: "#2563eb",
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


// =====================================================
// EMPTY / LOADING
// =====================================================

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
    borderRadius: "50%",
    animation:
        "spin 0.8s linear infinite"
};

export default Purchase;