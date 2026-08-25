import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function AddPurchase() {

    const navigate = useNavigate();

    const [vendors, setVendors] = useState([]);

    const [formData, setFormData] = useState({
        po_number: "",
        invoice_number: "",
        vendor_id: "",
        purchase_date: "",
        amount: "",
        payment_status: "Pending",
        warranty_expiry: "",
        remarks: ""
    });

    const [poFile, setPoFile] = useState(null);
    const [invoiceFile, setInvoiceFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [vendorLoading, setVendorLoading] = useState(true);


    // =====================================================
    // LOAD VENDORS
    // =====================================================

    useEffect(() => {

        const loadVendors = async () => {

            try {

                setVendorLoading(true);

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

                alert(
                    error.response?.data?.message ||
                    "Failed to load vendors"
                );

            } finally {

                setVendorLoading(false);

            }

        };

        loadVendors();

    }, []);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // =====================================================
    // FILE VALIDATION
    // =====================================================

    const validateFile = (file) => {

        if (!file) {
            return true;
        }

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ];

        const maxSize =
            10 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {

            alert(
                "Only PDF, JPG, JPEG and PNG files are allowed."
            );

            return false;
        }

        if (file.size > maxSize) {

            alert(
                "File size must be 10 MB or less."
            );

            return false;
        }

        return true;
    };


    // =====================================================
    // PO FILE
    // =====================================================

    const handlePoFileChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) {

            setPoFile(null);

            return;
        }

        if (!validateFile(file)) {

            e.target.value = "";
            setPoFile(null);

            return;
        }

        setPoFile(file);

    };


    // =====================================================
    // INVOICE FILE
    // =====================================================

    const handleInvoiceFileChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) {

            setInvoiceFile(null);

            return;
        }

        if (!validateFile(file)) {

            e.target.value = "";
            setInvoiceFile(null);

            return;
        }

        setInvoiceFile(file);

    };


    // =====================================================
    // FORMAT FILE SIZE
    // =====================================================

    const formatFileSize = (bytes) => {

        if (!bytes) {
            return "";
        }

        if (bytes < 1024) {

            return `${bytes} B`;

        }

        if (bytes < 1024 * 1024) {

            return `${(
                bytes / 1024
            ).toFixed(1)} KB`;

        }

        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(1)} MB`;

    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        if (!formData.po_number.trim()) {

            alert(
                "PO Number is required"
            );

            return false;
        }


        if (!formData.vendor_id) {

            alert(
                "Please select a vendor"
            );

            return false;
        }


        if (!formData.purchase_date) {

            alert(
                "Purchase Date is required"
            );

            return false;
        }


        if (
            formData.amount === "" ||
            Number(formData.amount) < 0
        ) {

            alert(
                "Please enter a valid purchase amount"
            );

            return false;
        }


        return true;
    };


    // =====================================================
    // UPLOAD DOCUMENT
    // =====================================================

    const uploadDocument = async (
        file,
        documentType
    ) => {

        if (!file) {
            return;
        }

        const uploadData =
            new FormData();

        uploadData.append(
            "file",
            file
        );

        uploadData.append(
            "vendor_id",
            Number(formData.vendor_id)
        );

        uploadData.append(
            "document_type",
            documentType
        );


        await API.post(
            "/vendor-documents/upload",
            uploadData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }


        try {

            setLoading(true);


            const payload = {

                po_number:
                    formData.po_number.trim(),

                invoice_number:
                    formData.invoice_number.trim() ||
                    null,

                vendor_id:
                    Number(formData.vendor_id),

                purchase_date:
                    formData.purchase_date,

                amount:
                    Number(formData.amount),

                payment_status:
                    formData.payment_status,

                warranty_expiry:
                    formData.warranty_expiry ||
                    null,

                remarks:
                    formData.remarks.trim() ||
                    null
            };


            // =============================================
            // SAVE PURCHASE
            // =============================================

            const response =
                await API.post(
                    "/purchases",
                    payload
                );


            if (
                !response.data ||
                !response.data.success
            ) {

                alert(
                    response.data?.message ||
                    "Failed to add purchase"
                );

                return;
            }


            // =============================================
            // UPLOAD PO
            // =============================================

            if (poFile) {

                await uploadDocument(
                    poFile,
                    "Purchase Order"
                );

            }


            // =============================================
            // UPLOAD INVOICE
            // =============================================

            if (invoiceFile) {

                await uploadDocument(
                    invoiceFile,
                    "Invoice"
                );

            }


            alert(
                "Purchase added successfully"
            );


            navigate(
                "/purchases"
            );


        } catch (error) {

            console.error(
                "Add Purchase Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to add purchase"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        navigate(
            "/purchases"
        );

    };


    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f3f4f6"
            }}
        >

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar />


            {/* =================================================
                MAIN AREA
            ================================================= */}

            <div
                style={{
                    flex: 1,
                    minWidth: 0
                }}
            >

                <Navbar />


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <main
                    style={{
                        padding: "35px",
                        width: "100%",
                        boxSizing: "border-box"
                    }}
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        style={{
                            marginBottom: "28px"
                        }}
                    >

                        <h1
                            style={{
                                margin: 0,
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "#111827"
                            }}
                        >
                            Add Purchase
                        </h1>


                        <p
                            style={{
                                margin:
                                    "8px 0 0 0",
                                color: "#6b7280",
                                fontSize: "15px"
                            }}
                        >
                            Add a new company purchase
                        </p>

                    </div>


                    {/* =================================================
                        FORM CARD
                    ================================================= */}

                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "12px",
                            padding: "30px",
                            boxShadow:
                                "0 2px 10px rgba(0,0,0,0.08)",
                            width: "100%",
                            maxWidth: "1000px",
                            boxSizing: "border-box"
                        }}
                    >

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            {/* =================================================
                                PURCHASE DETAILS
                            ================================================= */}

                            <h2
                                style={{
                                    margin:
                                        "0 0 20px 0",
                                    fontSize: "20px",
                                    color: "#111827"
                                }}
                            >
                                Purchase Details
                            </h2>


                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(2, minmax(0, 1fr))",
                                    gap: "20px"
                                }}
                            >

                                {/* PO NUMBER */}

                                <div>

                                    <label style={labelStyle}>
                                        PO Number *
                                    </label>

                                    <input
                                        type="text"
                                        name="po_number"
                                        value={
                                            formData.po_number
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="PO-2026-001"
                                        required
                                        style={inputStyle}
                                    />

                                </div>


                                {/* INVOICE NUMBER */}

                                <div>

                                    <label style={labelStyle}>
                                        Invoice Number
                                    </label>

                                    <input
                                        type="text"
                                        name="invoice_number"
                                        value={
                                            formData.invoice_number
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="INV-2026-001"
                                        style={inputStyle}
                                    />

                                </div>


                                {/* VENDOR */}

                                <div>

                                    <label style={labelStyle}>
                                        Vendor *
                                    </label>

                                    <select
                                        name="vendor_id"
                                        value={
                                            formData.vendor_id
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            vendorLoading
                                        }
                                        required
                                        style={inputStyle}
                                    >

                                        <option value="">
                                            {vendorLoading
                                                ? "Loading vendors..."
                                                : "Select Vendor"}
                                        </option>


                                        {vendors.map(
                                            (vendor) => (

                                                <option
                                                    key={
                                                        vendor.vendor_id
                                                    }
                                                    value={
                                                        vendor.vendor_id
                                                    }
                                                >
                                                    {
                                                        vendor.vendor_name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* PURCHASE DATE */}

                                <div>

                                    <label style={labelStyle}>
                                        Purchase Date *
                                    </label>

                                    <input
                                        type="date"
                                        name="purchase_date"
                                        value={
                                            formData.purchase_date
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        style={inputStyle}
                                    />

                                </div>


                                {/* AMOUNT */}

                                <div>

                                    <label style={labelStyle}>
                                        Amount *
                                    </label>

                                    <input
                                        type="number"
                                        name="amount"
                                        min="0"
                                        step="0.01"
                                        value={
                                            formData.amount
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="250000"
                                        required
                                        style={inputStyle}
                                    />

                                </div>


                                {/* PAYMENT STATUS */}

                                <div>

                                    <label style={labelStyle}>
                                        Payment Status
                                    </label>

                                    <select
                                        name="payment_status"
                                        value={
                                            formData.payment_status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={inputStyle}
                                    >

                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Paid">
                                            Paid
                                        </option>

                                        <option value="Partially Paid">
                                            Partially Paid
                                        </option>

                                        <option value="Cancelled">
                                            Cancelled
                                        </option>

                                    </select>

                                </div>


                                {/* WARRANTY */}

                                <div>

                                    <label style={labelStyle}>
                                        Warranty Expiry
                                    </label>

                                    <input
                                        type="date"
                                        name="warranty_expiry"
                                        value={
                                            formData.warranty_expiry
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={inputStyle}
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                REMARKS
                            ================================================= */}

                            <div
                                style={{
                                    marginTop: "20px"
                                }}
                            >

                                <label style={labelStyle}>
                                    Remarks
                                </label>

                                <textarea
                                    name="remarks"
                                    value={
                                        formData.remarks
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter purchase remarks..."
                                    rows="4"
                                    style={{
                                        ...inputStyle,
                                        resize: "vertical"
                                    }}
                                />

                            </div>


                            {/* =================================================
                                DOCUMENT SECTION
                            ================================================= */}

                            <div
                                style={{
                                    marginTop: "35px",
                                    paddingTop: "25px",
                                    borderTop:
                                        "1px solid #e5e7eb"
                                }}
                            >

                                <h2
                                    style={{
                                        margin:
                                            "0 0 6px 0",
                                        fontSize: "20px",
                                        color: "#111827"
                                    }}
                                >
                                    Purchase Documents
                                </h2>


                                <p
                                    style={{
                                        margin:
                                            "0 0 22px 0",
                                        color: "#6b7280",
                                        fontSize: "14px"
                                    }}
                                >
                                    Upload PO and Invoice documents.
                                    PDF, JPG, JPEG and PNG only.
                                    Maximum 10 MB per file.
                                </p>


                                {/* =================================================
                                    PO DOCUMENT
                                ================================================= */}

                                <div
                                    style={
                                        documentBoxStyle
                                    }
                                >

                                    <div>

                                        <div
                                            style={{
                                                fontWeight:
                                                    "600",
                                                color:
                                                    "#111827",
                                                marginBottom:
                                                    "5px"
                                            }}
                                        >
                                            PO Document
                                        </div>

                                        <div
                                            style={{
                                                color:
                                                    "#6b7280",
                                                fontSize:
                                                    "13px",
                                                marginBottom:
                                                    "12px"
                                            }}
                                        >
                                            Upload Purchase
                                            Order document
                                        </div>

                                    </div>


                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={
                                            handlePoFileChange
                                        }
                                    />


                                    {poFile && (

                                        <div
                                            style={
                                                selectedFileStyle
                                            }
                                        >
                                            ✓{" "}
                                            {poFile.name}
                                            {" "}
                                            (
                                            {
                                                formatFileSize(
                                                    poFile.size
                                                )
                                            }
                                            )
                                        </div>

                                    )}

                                </div>


                                {/* =================================================
                                    INVOICE DOCUMENT
                                ================================================= */}

                                <div
                                    style={
                                        documentBoxStyle
                                    }
                                >

                                    <div>

                                        <div
                                            style={{
                                                fontWeight:
                                                    "600",
                                                color:
                                                    "#111827",
                                                marginBottom:
                                                    "5px"
                                            }}
                                        >
                                            Invoice Document
                                        </div>

                                        <div
                                            style={{
                                                color:
                                                    "#6b7280",
                                                fontSize:
                                                    "13px",
                                                marginBottom:
                                                    "12px"
                                            }}
                                        >
                                            Upload vendor
                                            invoice document
                                        </div>

                                    </div>


                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={
                                            handleInvoiceFileChange
                                        }
                                    />


                                    {invoiceFile && (

                                        <div
                                            style={
                                                selectedFileStyle
                                            }
                                        >
                                            ✓{" "}
                                            {
                                                invoiceFile.name
                                            }
                                            {" "}
                                            (
                                            {
                                                formatFileSize(
                                                    invoiceFile.size
                                                )
                                            }
                                            )
                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* =================================================
                                BUTTONS
                            ================================================= */}

                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    marginTop: "30px",
                                    paddingTop: "20px",
                                    borderTop:
                                        "1px solid #e5e7eb"
                                }}
                            >

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        padding:
                                            "11px 24px",
                                        border: "none",
                                        borderRadius:
                                            "7px",
                                        background:
                                            "#2563eb",
                                        color:
                                            "#ffffff",
                                        fontSize:
                                            "14px",
                                        fontWeight:
                                            "600",
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
                                        ? "Saving..."
                                        : "Save Purchase"}
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleCancel
                                    }
                                    disabled={loading}
                                    style={{
                                        padding:
                                            "11px 24px",
                                        border:
                                            "1px solid #d1d5db",
                                        borderRadius:
                                            "7px",
                                        background:
                                            "#ffffff",
                                        color:
                                            "#374151",
                                        fontSize:
                                            "14px",
                                        fontWeight:
                                            "600",
                                        cursor:
                                            loading
                                                ? "not-allowed"
                                                : "pointer"
                                    }}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </main>

            </div>

        </div>

    );
}


// =====================================================
// STYLES
// =====================================================

const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontWeight: "600",
    color: "#374151",
    fontSize: "14px"
};


const inputStyle = {
    width: "100%",
    minHeight: "42px",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "14px",
    color: "#111827",
    background: "#ffffff",
    outline: "none"
};


const documentBoxStyle = {
    padding: "20px",
    marginBottom: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    background: "#f9fafb"
};


const selectedFileStyle = {
    marginTop: "12px",
    padding: "9px 12px",
    borderRadius: "6px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: "500"
};


export default AddPurchase;