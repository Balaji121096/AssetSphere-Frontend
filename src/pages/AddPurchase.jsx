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

        product_category: "",
        product_name: "",
        product_description: "",

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

                const response = await API.get("/vendors");

                setVendors(response.data?.data || []);
            } catch (error) {
                console.error("Vendor Load Error:", error);

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
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

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

        const maxSize = 10 * 1024 * 1024;

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
        const file = e.target.files?.[0];

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
        const file = e.target.files?.[0];

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
    // FILE SIZE
    // =====================================================

    const formatFileSize = (bytes) => {
        if (!bytes) {
            return "";
        }

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    };

    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {
        if (!formData.po_number.trim()) {
            alert("PO Number is required");
            return false;
        }

        if (!formData.vendor_id) {
            alert("Please select a vendor");
            return false;
        }

        if (!formData.product_category) {
            alert("Please select a product category");
            return false;
        }

        if (!formData.product_name.trim()) {
            alert("Product Name is required");
            return false;
        }

        if (!formData.purchase_date) {
            alert("Purchase Date is required");
            return false;
        }

        if (
            formData.amount === "" ||
            Number(formData.amount) < 0
        ) {
            alert("Please enter a valid purchase amount");
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

        const uploadData = new FormData();

        uploadData.append("file", file);

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

                // PRODUCT DETAILS
                product_category:
                    formData.product_category,

                product_name:
                    formData.product_name.trim(),

                product_description:
                    formData.product_description.trim() ||
                    null,

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

            console.log(
                "Add Purchase Payload:",
                payload
            );

            const response = await API.post(
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

            // Upload PO
            if (poFile) {
                await uploadDocument(
                    poFile,
                    "Purchase Order"
                );
            }

            // Upload Invoice
            if (invoiceFile) {
                await uploadDocument(
                    invoiceFile,
                    "Invoice"
                );
            }

            alert(
                "Purchase added successfully"
            );

            navigate("/purchases");
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
        navigate("/purchases");
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

                    {/* HEADER */}

                    <div style={headerStyle}>

                        <div>
                            <div style={eyebrowStyle}>
                                PURCHASE MANAGEMENT
                            </div>

                            <h1 style={titleStyle}>
                                Add Purchase
                            </h1>

                            <p style={subtitleStyle}>
                                Add a new company purchase
                            </p>
                        </div>

                    </div>


                    {/* FORM CARD */}

                    <div style={formCardStyle}>

                        <form onSubmit={handleSubmit}>

                            {/* =================================================
                                BASIC PURCHASE DETAILS
                            ================================================= */}

                            <div style={sectionHeaderStyle}>

                                <h2 style={sectionTitleStyle}>
                                    Purchase Details
                                </h2>

                                <p style={sectionSubtitleStyle}>
                                    Enter purchase information below.
                                </p>

                            </div>


                            <div style={gridStyle}>

                                <FormField
                                    label="PO Number *"
                                    name="po_number"
                                    value={
                                        formData.po_number
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="PO-2026-001"
                                    required
                                />

                                <FormField
                                    label="Invoice Number"
                                    name="invoice_number"
                                    value={
                                        formData.invoice_number
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="INV-2026-001"
                                />


                                {/* VENDOR */}

                                <div style={fieldStyle}>

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
                                        style={
                                            inputStyle
                                        }
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


                                <FormField
                                    label="Purchase Date *"
                                    type="date"
                                    name="purchase_date"
                                    value={
                                        formData.purchase_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* =================================================
                                PRODUCT INFORMATION
                            ================================================= */}

                            <div
                                style={
                                    productSectionStyle
                                }
                            >

                                <div
                                    style={
                                        sectionHeaderStyle
                                    }
                                >

                                    <h2
                                        style={
                                            sectionTitleStyle
                                        }
                                    >
                                        Product Information
                                    </h2>

                                    <p
                                        style={
                                            sectionSubtitleStyle
                                        }
                                    >
                                        Specify what was purchased.
                                    </p>

                                </div>


                                <div style={gridStyle}>

                                    {/* PRODUCT CATEGORY */}

                                    <div style={fieldStyle}>

                                        <label style={labelStyle}>
                                            Product Category *
                                        </label>

                                        <select
                                            name="product_category"
                                            value={
                                                formData.product_category
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            style={
                                                inputStyle
                                            }
                                        >

                                            <option value="">
                                                Select Category
                                            </option>

                                            <option value="Hardware">
                                                Hardware
                                            </option>

                                            <option value="Software">
                                                Software
                                            </option>

                                            <option value="Other">
                                                Other
                                            </option>

                                        </select>

                                    </div>


                                    {/* PRODUCT NAME */}

                                    <FormField
                                        label="Product Name *"
                                        name="product_name"
                                        value={
                                            formData.product_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Dell Latitude 5550"
                                        required
                                    />

                                </div>


                                {/* DESCRIPTION */}

                                <div
                                    style={{
                                        marginTop: "20px"
                                    }}
                                >

                                    <label
                                        style={
                                            labelStyle
                                        }
                                    >
                                        Product Description
                                    </label>

                                    <textarea
                                        name="product_description"
                                        value={
                                            formData.product_description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter product details, specifications, license information, etc..."
                                        rows="4"
                                        style={
                                            textareaStyle
                                        }
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                PAYMENT DETAILS
                            ================================================= */}

                            <div
                                style={
                                    productSectionStyle
                                }
                            >

                                <div
                                    style={
                                        sectionHeaderStyle
                                    }
                                >

                                    <h2
                                        style={
                                            sectionTitleStyle
                                        }
                                    >
                                        Payment & Warranty
                                    </h2>

                                    <p
                                        style={
                                            sectionSubtitleStyle
                                        }
                                    >
                                        Enter amount, payment and warranty details.
                                    </p>

                                </div>


                                <div style={gridStyle}>

                                    <FormField
                                        label="Amount *"
                                        type="number"
                                        name="amount"
                                        value={
                                            formData.amount
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="250000"
                                        min="0"
                                        step="0.01"
                                        required
                                    />


                                    {/* PAYMENT STATUS */}

                                    <div style={fieldStyle}>

                                        <label
                                            style={
                                                labelStyle
                                            }
                                        >
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
                                            style={
                                                inputStyle
                                            }
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


                                    <FormField
                                        label="Warranty Expiry"
                                        type="date"
                                        name="warranty_expiry"
                                        value={
                                            formData.warranty_expiry
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                {/* REMARKS */}

                                <div
                                    style={{
                                        marginTop: "20px"
                                    }}
                                >

                                    <label
                                        style={
                                            labelStyle
                                        }
                                    >
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
                                        style={
                                            textareaStyle
                                        }
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                DOCUMENTS
                            ================================================= */}

                            <div
                                style={
                                    documentSectionStyle
                                }
                            >

                                <div
                                    style={
                                        sectionHeaderStyle
                                    }
                                >

                                    <h2
                                        style={
                                            sectionTitleStyle
                                        }
                                    >
                                        Purchase Documents
                                    </h2>

                                    <p
                                        style={
                                            sectionSubtitleStyle
                                        }
                                    >
                                        Upload PO and Invoice documents.
                                        PDF, JPG, JPEG and PNG only.
                                        Maximum 10 MB per file.
                                    </p>

                                </div>


                                <DocumentUpload
                                    title="PO Document"
                                    description="Upload Purchase Order document"
                                    file={poFile}
                                    onChange={
                                        handlePoFileChange
                                    }
                                    formatFileSize={
                                        formatFileSize
                                    }
                                />


                                <DocumentUpload
                                    title="Invoice Document"
                                    description="Upload vendor invoice document"
                                    file={invoiceFile}
                                    onChange={
                                        handleInvoiceFileChange
                                    }
                                    formatFileSize={
                                        formatFileSize
                                    }
                                />

                            </div>


                            {/* =================================================
                                BUTTONS
                            ================================================= */}

                            <div
                                style={
                                    buttonContainerStyle
                                }
                            >

                                <button
                                    type="button"
                                    onClick={
                                        handleCancel
                                    }
                                    disabled={loading}
                                    style={
                                        secondaryButtonStyle
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        ...primaryButtonStyle,
                                        opacity:
                                            loading
                                                ? 0.7
                                                : 1,
                                        cursor:
                                            loading
                                                ? "not-allowed"
                                                : "pointer"
                                    }}
                                >

                                    {loading
                                        ? "Saving..."
                                        : "Save Purchase"}

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
// FORM FIELD
// =====================================================

function FormField({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    required,
    min,
    step
}) {
    return (
        <div style={fieldStyle}>

            <label style={labelStyle}>
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min}
                step={step}
                style={inputStyle}
            />

        </div>
    );
}


// =====================================================
// DOCUMENT UPLOAD
// =====================================================

function DocumentUpload({
    title,
    description,
    file,
    onChange,
    formatFileSize
}) {
    return (
        <div style={documentBoxStyle}>

            <div>

                <h3 style={documentTitleStyle}>
                    {title}
                </h3>

                <p style={documentDescriptionStyle}>
                    {description}
                </p>

                <p style={documentHintStyle}>
                    PDF, JPG, JPEG or PNG • Maximum 10 MB
                </p>

            </div>


            <label style={uploadButtonStyle}>

                Choose File

                <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={onChange}
                    style={{
                        display: "none"
                    }}
                />

            </label>


            {file && (

                <div style={selectedFileStyle}>

                    <span>
                        ✓ {file.name}
                    </span>

                    <span>
                        {formatFileSize(file.size)}
                    </span>

                </div>

            )}

        </div>
    );
}


// =====================================================
// STYLES
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
    maxWidth: "1150px",
    margin: "0 auto",
    padding: "30px",
    boxSizing: "border-box"
};

const headerStyle = {
    marginBottom: "24px"
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
    letterSpacing: "-0.8px",
    color: "#0f172a"
};

const subtitleStyle = {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px"
};

const formCardStyle = {
    width: "100%",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    boxShadow:
        "0 4px 14px rgba(15,23,42,0.05)",
    boxSizing: "border-box"
};

const sectionHeaderStyle = {
    marginBottom: "22px",
    paddingBottom: "16px",
    borderBottom: "1px solid #eef0f3"
};

const sectionTitleStyle = {
    margin: 0,
    fontSize: "19px",
    fontWeight: "700",
    color: "#111827"
};

const sectionSubtitleStyle = {
    margin: "5px 0 0",
    fontSize: "13px",
    color: "#6b7280"
};

const productSectionStyle = {
    marginTop: "32px",
    paddingTop: "26px",
    borderTop: "1px solid #eef0f3"
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",
    columnGap: "22px",
    rowGap: "20px"
};

const fieldStyle = {
    minWidth: 0
};

const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151"
};

const inputStyle = {
    width: "100%",
    height: "44px",
    padding: "0 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    outline: "none",
    background: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    boxSizing: "border-box"
};

const textareaStyle = {
    width: "100%",
    minHeight: "105px",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    outline: "none",
    background: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit"
};

const documentSectionStyle = {
    marginTop: "32px",
    paddingTop: "26px",
    borderTop: "1px solid #eef0f3"
};

const documentBoxStyle = {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    marginBottom: "14px",
    border: "1px solid #dbe1e8",
    borderRadius: "9px",
    background: "#f8fafc",
    boxSizing: "border-box"
};

const documentTitleStyle = {
    margin: 0,
    fontSize: "15px",
    fontWeight: "700",
    color: "#111827"
};

const documentDescriptionStyle = {
    margin: "5px 0 4px",
    fontSize: "13px",
    color: "#4b5563"
};

const documentHintStyle = {
    margin: 0,
    fontSize: "12px",
    color: "#9ca3af"
};

const uploadButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    borderRadius: "7px",
    border: "1px solid #2563eb",
    background: "#ffffff",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap"
};

const selectedFileStyle = {
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "9px 12px",
    borderRadius: "6px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: "500",
    boxSizing: "border-box"
};

const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    marginTop: "30px",
    paddingTop: "22px",
    borderTop: "1px solid #eef0f3"
};

const primaryButtonStyle = {
    padding: "11px 22px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
};

const secondaryButtonStyle = {
    padding: "10px 22px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
};

export default AddPurchase;