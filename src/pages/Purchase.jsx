import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Purchase() {

    const navigate = useNavigate();

    const [purchases, setPurchases] = useState([]);
    const [summary, setSummary] = useState(null);

    const [vendors, setVendors] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD PURCHASES
    // =====================================================

    const loadPurchases = async () => {

        try {

            setLoading(true);

            const response =
                await API.get("/purchases");

            setPurchases(
                response.data.data || []
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

            setSummary(
                response.data.data || null
            );

        } catch (error) {

            console.error(
                "Purchase Summary Error:",
                error
            );

        }

    };


    // =====================================================
    // LOAD VENDORS
    // =====================================================

    const loadVendors = async () => {

        try {

            const response =
                await API.get("/vendors");

            setVendors(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Vendor Load Error:",
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
        loadVendors();

    }, []);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredPurchases =
        purchases.filter((purchase) => {

            const text = `
                ${purchase.purchase_id || ""}
                ${purchase.po_number || ""}
                ${purchase.invoice_number || ""}
                ${purchase.vendor_code || ""}
                ${purchase.vendor_name || ""}
                ${purchase.payment_status || ""}
                ${purchase.remarks || ""}
            `.toLowerCase();

            return text.includes(
                search.toLowerCase()
            );

        });


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(
            date
        ).toLocaleDateString("en-IN");

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
                currency: "INR"
            }
        );

    };


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = () => {

        loadPurchases();
        loadSummary();
        loadVendors();

    };


    // =====================================================
    // ADD PURCHASE
    // =====================================================

    const handleAddPurchase = () => {

        navigate(
            "/purchases/add"
        );

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

            if (response.data?.success) {

                alert(
                    "Purchase deleted successfully"
                );

                loadPurchases();
                loadSummary();

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

                    loadPurchases();

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

                loadPurchases();

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


    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f5f5f5"
            }}
        >

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar />


            <div
                style={{
                    flex: 1,
                    minWidth: 0
                }}
            >

                {/* =================================================
                    NAVBAR
                ================================================= */}

                <Navbar />


                <div
                    style={{
                        padding: "25px"
                    }}
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "32px"
                                }}
                            >
                                Purchase Management
                            </h1>

                            <p
                                style={{
                                    marginTop: "5px",
                                    color: "#64748b"
                                }}
                            >
                                Manage company purchases
                            </p>

                        </div>


                        {/* =================================================
                            HEADER BUTTONS
                        ================================================= */}

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center"
                            }}
                        >

                            {/* REFRESH */}

                            <button
                                type="button"
                                onClick={
                                    handleRefresh
                                }
                                style={{
                                    padding:
                                        "9px 15px",
                                    border:
                                        "1px solid #cbd5e1",
                                    background:
                                        "#ffffff",
                                    color:
                                        "#334155",
                                    borderRadius:
                                        "6px",
                                    cursor:
                                        "pointer",
                                    fontSize:
                                        "14px"
                                }}
                            >
                                Refresh
                            </button>


                            {/* ADD PURCHASE */}

                            <button
                                type="button"
                                onClick={
                                    handleAddPurchase
                                }
                                style={{
                                    padding:
                                        "9px 15px",
                                    border:
                                        "none",
                                    background:
                                        "#2563eb",
                                    color:
                                        "#ffffff",
                                    borderRadius:
                                        "6px",
                                    cursor:
                                        "pointer",
                                    fontSize:
                                        "14px",
                                    fontWeight:
                                        "600"
                                }}
                            >
                                + Add Purchase
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    {summary && (

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(4, minmax(0, 1fr))",
                                gap: "15px",
                                marginTop: "20px"
                            }}
                        >

                            {/* TOTAL PURCHASES */}

                            <div
                                style={cardStyle}
                            >

                                <p
                                    style={
                                        summaryLabelStyle
                                    }
                                >
                                    Total Purchases
                                </p>

                                <h2
                                    style={
                                        summaryValueStyle
                                    }
                                >
                                    {
                                        summary.total_purchases
                                    }
                                </h2>

                            </div>


                            {/* TOTAL AMOUNT */}

                            <div
                                style={cardStyle}
                            >

                                <p
                                    style={
                                        summaryLabelStyle
                                    }
                                >
                                    Total Amount
                                </p>

                                <h2
                                    style={
                                        summaryValueStyle
                                    }
                                >
                                    {
                                        formatAmount(
                                            summary.total_purchase_amount
                                        )
                                    }
                                </h2>

                            </div>


                            {/* PENDING */}

                            <div
                                style={cardStyle}
                            >

                                <p
                                    style={
                                        summaryLabelStyle
                                    }
                                >
                                    Pending Payments
                                </p>

                                <h2
                                    style={
                                        summaryValueStyle
                                    }
                                >
                                    {
                                        summary.pending_payments
                                    }
                                </h2>

                            </div>


                            {/* PAID */}

                            <div
                                style={cardStyle}
                            >

                                <p
                                    style={
                                        summaryLabelStyle
                                    }
                                >
                                    Paid Purchases
                                </p>

                                <h2
                                    style={
                                        summaryValueStyle
                                    }
                                >
                                    {
                                        summary.paid_purchases
                                    }
                                </h2>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div
                        style={{
                            margin:
                                "20px 0"
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Search PO, invoice, vendor..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            style={{
                                padding:
                                    "10px 12px",
                                width:
                                    "320px",
                                maxWidth:
                                    "100%",
                                border:
                                    "1px solid #cbd5e1",
                                borderRadius:
                                    "6px",
                                outline:
                                    "none",
                                boxSizing:
                                    "border-box"
                            }}
                        />

                    </div>


                    {/* =================================================
                        PURCHASE TABLE
                    ================================================= */}

                    <div
                        style={{
                            background:
                                "#ffffff",
                            borderRadius:
                                "10px",
                            overflowX:
                                "auto",
                            boxShadow:
                                "0 1px 3px rgba(0,0,0,0.08)"
                        }}
                    >

                        <table
                            style={{
                                width:
                                    "100%",
                                borderCollapse:
                                    "collapse",
                                minWidth:
                                    "1500px"
                            }}
                        >

                            {/* =================================================
                                TABLE HEADER
                            ================================================= */}

                            <thead>

                                <tr
                                    style={{
                                        background:
                                            "#f8fafc"
                                    }}
                                >

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
                                        Warranty Expiry
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


                            {/* =================================================
                                TABLE BODY
                            ================================================= */}

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="11"
                                            style={{
                                                padding:
                                                    "30px",
                                                textAlign:
                                                    "center",
                                                color:
                                                    "#64748b"
                                            }}
                                        >
                                            Loading...
                                        </td>

                                    </tr>

                                ) : filteredPurchases.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="11"
                                            style={{
                                                padding:
                                                    "30px",
                                                textAlign:
                                                    "center",
                                                color:
                                                    "#64748b"
                                            }}
                                        >
                                            No purchases found
                                        </td>

                                    </tr>

                                ) : (

                                    filteredPurchases.map(
                                        (purchase) => (

                                            <tr
                                                key={
                                                    purchase.purchase_id
                                                }
                                            >

                                                {/* ID */}

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
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
                                                            color:
                                                                "#2563eb",
                                                            fontWeight:
                                                                "600"
                                                        }}
                                                    >
                                                        {
                                                            purchase.po_number
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
                                                            style={{
                                                                fontWeight:
                                                                    "600",
                                                                color:
                                                                    "#334155"
                                                            }}
                                                        >
                                                            {
                                                                purchase.vendor_name ||
                                                                "-"
                                                            }
                                                        </div>

                                                        {purchase.vendor_code && (

                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        "11px",
                                                                    color:
                                                                        "#64748b",
                                                                    marginTop:
                                                                        "2px"
                                                                }}
                                                            >
                                                                {
                                                                    purchase.vendor_code
                                                                }
                                                            </div>

                                                        )}

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
                                                        tdStyle
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
                                                            padding:
                                                                "4px 9px",
                                                            borderRadius:
                                                                "12px",
                                                            fontSize:
                                                                "12px",
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
                                                        {
                                                            purchase.payment_status
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
                                                    {
                                                        purchase.remarks ||
                                                        "-"
                                                    }
                                                </td>


                                                {/* =================================================
                                                    DOCUMENTS
                                                ================================================= */}

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            flexDirection:
                                                                "column",
                                                            gap:
                                                                "8px"
                                                        }}
                                                    >

                                                        {/* PO */}

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

                                                            <span
                                                                style={{
                                                                    fontWeight:
                                                                        "600",
                                                                    fontSize:
                                                                        "12px",
                                                                    color:
                                                                        "#334155"
                                                                }}
                                                            >
                                                                PO:
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
                                                                        style={{
                                                                            padding:
                                                                                "5px 8px",
                                                                            border:
                                                                                "1px solid #16a34a",
                                                                            background:
                                                                                "#ffffff",
                                                                            color:
                                                                                "#16a34a",
                                                                            borderRadius:
                                                                                "5px",
                                                                            cursor:
                                                                                "pointer",
                                                                            fontSize:
                                                                                "11px"
                                                                        }}
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
                                                                        style={{
                                                                            padding:
                                                                                "5px 8px",
                                                                            border:
                                                                                "1px solid #2563eb",
                                                                            background:
                                                                                "#ffffff",
                                                                            color:
                                                                                "#2563eb",
                                                                            borderRadius:
                                                                                "5px",
                                                                            cursor:
                                                                                "pointer",
                                                                            fontSize:
                                                                                "11px"
                                                                        }}
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
                                                                        style={{
                                                                            padding:
                                                                                "5px 8px",
                                                                            border:
                                                                                "1px solid #dc2626",
                                                                            background:
                                                                                "#ffffff",
                                                                            color:
                                                                                "#dc2626",
                                                                            borderRadius:
                                                                                "5px",
                                                                            cursor:
                                                                                "pointer",
                                                                            fontSize:
                                                                                "11px"
                                                                        }}
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
                                                                    style={{
                                                                        padding:
                                                                            "5px 8px",
                                                                        border:
                                                                            "1px solid #2563eb",
                                                                        background:
                                                                            "#2563eb",
                                                                        color:
                                                                            "#ffffff",
                                                                        borderRadius:
                                                                            "5px",
                                                                        cursor:
                                                                            "pointer",
                                                                        fontSize:
                                                                            "11px"
                                                                    }}
                                                                >
                                                                    Upload PO
                                                                </button>

                                                            )}

                                                        </div>


                                                        {/* INVOICE */}

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

                                                            <span
                                                                style={{
                                                                    fontWeight:
                                                                        "600",
                                                                    fontSize:
                                                                        "12px",
                                                                    color:
                                                                        "#334155"
                                                                }}
                                                            >
                                                                Invoice:
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
                                                                        style={{
                                                                            padding:
                                                                                "5px 8px",
                                                                            border:
                                                                                "1px solid #16a34a",
                                                                            background:
                                                                                "#ffffff",
                                                                            color:
                                                                                "#16a34a",
                                                                            borderRadius:
                                                                                "5px",
                                                                            cursor:
                                                                                "pointer",
                                                                            fontSize:
                                                                                "11px"
                                                                        }}
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
                                                                        style={{
                                                                            padding:
                                                                                "5px 8px",
                                                                            border:
                                                                                "1px solid #2563eb",
                                                                            background:
                                                                                "#ffffff",
                                                                            color:
                                                                                "#2563eb",
                                                                            borderRadius:
                                                                                "5px",
                                                                            cursor:
                                                                                "pointer",
                                                                            fontSize:
                                                                                "11px"
                                                                        }}
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
                                                                        style={{
                                                                            padding:
                                                                                "5px 8px",
                                                                            border:
                                                                                "1px solid #dc2626",
                                                                            background:
                                                                                "#ffffff",
                                                                            color:
                                                                                "#dc2626",
                                                                            borderRadius:
                                                                                "5px",
                                                                            cursor:
                                                                                "pointer",
                                                                            fontSize:
                                                                                "11px"
                                                                        }}
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
                                                                    style={{
                                                                        padding:
                                                                            "5px 8px",
                                                                        border:
                                                                            "1px solid #2563eb",
                                                                        background:
                                                                            "#2563eb",
                                                                        color:
                                                                            "#ffffff",
                                                                        borderRadius:
                                                                            "5px",
                                                                        cursor:
                                                                            "pointer",
                                                                        fontSize:
                                                                            "11px"
                                                                    }}
                                                                >
                                                                    Upload Invoice
                                                                </button>

                                                            )}

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    ACTIONS
                                                ================================================= */}

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            gap:
                                                                "8px",
                                                            alignItems:
                                                                "center"
                                                        }}
                                                    >

                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEditPurchase(
                                                                    purchase.purchase_id
                                                                )
                                                            }
                                                            style={{
                                                                padding:
                                                                    "6px 12px",
                                                                border:
                                                                    "1px solid #2563eb",
                                                                background:
                                                                    "#ffffff",
                                                                color:
                                                                    "#2563eb",
                                                                borderRadius:
                                                                    "6px",
                                                                cursor:
                                                                    "pointer",
                                                                fontSize:
                                                                    "12px",
                                                                fontWeight:
                                                                    "600"
                                                            }}
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
                                                            style={{
                                                                padding:
                                                                    "6px 12px",
                                                                border:
                                                                    "1px solid #dc2626",
                                                                background:
                                                                    "#ffffff",
                                                                color:
                                                                    "#dc2626",
                                                                borderRadius:
                                                                    "6px",
                                                                cursor:
                                                                    "pointer",
                                                                fontSize:
                                                                    "12px",
                                                                fontWeight:
                                                                    "600"
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

                </div>

            </div>

        </div>

    );

}


// =====================================================
// SUMMARY CARD STYLE
// =====================================================

const cardStyle = {

    background:
        "#ffffff",

    padding:
        "20px",

    borderRadius:
        "10px",

    boxShadow:
        "0 2px 5px rgba(0,0,0,0.08)",

    textAlign:
        "center"

};


// =====================================================
// SUMMARY LABEL
// =====================================================

const summaryLabelStyle = {

    margin:
        "0 0 8px 0",

    color:
        "#64748b",

    fontSize:
        "14px"

};


// =====================================================
// SUMMARY VALUE
// =====================================================

const summaryValueStyle = {

    margin:
        "0",

    color:
        "#111827",

    fontSize:
        "22px"

};


// =====================================================
// TABLE HEADER STYLE
// =====================================================

const thStyle = {

    padding:
        "12px",

    textAlign:
        "left",

    borderBottom:
        "1px solid #e2e8f0",

    whiteSpace:
        "nowrap",

    fontSize:
        "13px",

    color:
        "#475569"

};


// =====================================================
// TABLE DATA STYLE
// =====================================================

const tdStyle = {

    padding:
        "12px",

    borderBottom:
        "1px solid #f1f5f9",

    whiteSpace:
        "nowrap",

    fontSize:
        "13px",

    color:
        "#475569"

};


export default Purchase;