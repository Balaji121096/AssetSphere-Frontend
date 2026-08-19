import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";


function EditPurchase() {

    const navigate = useNavigate();
    const { id } = useParams();

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

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [vendorLoading, setVendorLoading] = useState(true);


    // =====================================================
    // LOAD VENDORS
    // =====================================================

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


    // =====================================================
    // LOAD PURCHASE
    // =====================================================

    const loadPurchase = async () => {

        try {

            setLoading(true);

            console.log(
                "Loading Purchase ID:",
                id
            );

            const response =
                await API.get(
                    `/purchases/${id}`
                );

            console.log(
                "Purchase Response:",
                response.data
            );

            const purchase =
                response.data.data;

            if (!purchase) {

                alert(
                    "Purchase not found"
                );

                navigate(
                    "/purchases"
                );

                return;

            }


            setFormData({

                po_number:
                    purchase.po_number || "",

                invoice_number:
                    purchase.invoice_number || "",

                vendor_id:
                    purchase.vendor_id !== null &&
                    purchase.vendor_id !== undefined
                        ? String(
                            purchase.vendor_id
                        )
                        : "",

                purchase_date:
                    purchase.purchase_date
                        ? String(
                            purchase.purchase_date
                        ).substring(0, 10)
                        : "",

                amount:
                    purchase.amount !== null &&
                    purchase.amount !== undefined
                        ? String(
                            purchase.amount
                        )
                        : "",

                payment_status:
                    purchase.payment_status ||
                    "Pending",

                warranty_expiry:
                    purchase.warranty_expiry
                        ? String(
                            purchase.warranty_expiry
                        ).substring(0, 10)
                        : "",

                remarks:
                    purchase.remarks || ""

            });

        } catch (error) {

            console.error(
                "Load Purchase Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load purchase"
            );

            navigate(
                "/purchases"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        if (!id) {

            alert(
                "Invalid purchase ID"
            );

            navigate(
                "/purchases"
            );

            return;

        }

        loadVendors();
        loadPurchase();

    }, [id]);


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
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        if (
            !formData.po_number.trim()
        ) {

            alert(
                "PO Number is required"
            );

            return false;

        }


        if (
            !formData.vendor_id
        ) {

            alert(
                "Please select a vendor"
            );

            return false;

        }


        if (
            !formData.purchase_date
        ) {

            alert(
                "Purchase Date is required"
            );

            return false;

        }


        if (
            formData.amount === "" ||
            Number(formData.amount) < 0 ||
            Number.isNaN(
                Number(formData.amount)
            )
        ) {

            alert(
                "Please enter a valid purchase amount"
            );

            return false;

        }


        return true;

    };


    // =====================================================
    // UPDATE PURCHASE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {

            return;

        }


        try {

            setSaving(true);


            const payload = {

                po_number:
                    formData.po_number.trim(),

                invoice_number:
                    formData.invoice_number.trim() ||
                    null,

                vendor_id:
                    Number(
                        formData.vendor_id
                    ),

                purchase_date:
                    formData.purchase_date,

                amount:
                    Number(
                        formData.amount
                    ),

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
                "Update Purchase Payload:",
                payload
            );


            const response =
                await API.put(
                    `/purchases/${id}`,
                    payload
                );


            console.log(
                "Update Purchase Response:",
                response.data
            );


            if (
                response.data &&
                response.data.success
            ) {

                alert(
                    "Purchase updated successfully"
                );

                navigate(
                    "/purchases"
                );

            } else {

                alert(
                    response.data?.message ||
                    "Failed to update purchase"
                );

            }

        } catch (error) {

            console.error(
                "Update Purchase Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update purchase"
            );

        } finally {

            setSaving(false);

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


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

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

                        <p
                            style={{
                                color: "#64748b"
                            }}
                        >
                            Loading purchase...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // EDIT PURCHASE PAGE
    // =====================================================

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
                            marginBottom: "25px"
                        }}
                    >

                        <h1
                            style={{
                                margin: 0,
                                fontSize: "32px"
                            }}
                        >
                            Edit Purchase
                        </h1>

                        <p
                            style={{
                                marginTop: "5px",
                                color: "#64748b"
                            }}
                        >
                            Update purchase details
                        </p>

                    </div>


                    {/* =================================================
                        FORM CARD
                    ================================================= */}

                    <div
                        style={{
                            background: "#ffffff",
                            padding: "25px",
                            borderRadius: "10px",
                            boxShadow:
                                "0 2px 6px rgba(0,0,0,0.08)",
                            maxWidth: "900px"
                        }}
                    >

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            {/* =================================================
                                PO NUMBER
                            ================================================= */}

                            <div
                                style={
                                    fieldStyle
                                }
                            >

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
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
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            {/* =================================================
                                INVOICE NUMBER
                            ================================================= */}

                            <div
                                style={
                                    fieldStyle
                                }
                            >

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
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
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            {/* =================================================
                                VENDOR
                            ================================================= */}

                            <div
                                style={
                                    fieldStyle
                                }
                            >

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
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
                                    style={
                                        inputStyle
                                    }
                                    disabled={
                                        vendorLoading
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


                            {/* =================================================
                                PURCHASE DATE
                            ================================================= */}

                            <div
                                style={
                                    fieldStyle
                                }
                            >

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
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
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            {/* =================================================
                                AMOUNT
                            ================================================= */}

                            <div
                                style={
                                    fieldStyle
                                }
                            >

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
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
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            {/* =================================================
                                PAYMENT STATUS
                            ================================================= */}

                            <div
                                style={
                                    fieldStyle
                                }
                            >

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


                            {/* =================================================
                                WARRANTY EXPIRY
                            ================================================= */}

                            <div
                                style={
                                    fieldStyle
                                }
                            >

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
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
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            {/* =================================================
                                REMARKS
                            ================================================= */}

                            <div
                                style={
                                    fieldStyle
                                }
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
                                    style={{
                                        ...inputStyle,
                                        resize: "vertical"
                                    }}
                                />

                            </div>


                            {/* =================================================
                                BUTTONS
                            ================================================= */}

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginTop: "25px"
                                }}
                            >

                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        padding:
                                            "10px 20px",
                                        border:
                                            "none",
                                        borderRadius:
                                            "6px",
                                        background:
                                            "#2563eb",
                                        color:
                                            "#ffffff",
                                        cursor:
                                            saving
                                                ? "not-allowed"
                                                : "pointer",
                                        fontSize:
                                            "14px",
                                        fontWeight:
                                            "600"
                                    }}
                                >

                                    {saving
                                        ? "Updating..."
                                        : "Update Purchase"}

                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleCancel
                                    }
                                    disabled={
                                        saving
                                    }
                                    style={{
                                        padding:
                                            "10px 20px",
                                        border:
                                            "1px solid #cbd5e1",
                                        borderRadius:
                                            "6px",
                                        background:
                                            "#ffffff",
                                        color:
                                            "#334155",
                                        cursor:
                                            saving
                                                ? "not-allowed"
                                                : "pointer",
                                        fontSize:
                                            "14px"
                                    }}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    );

}


// =====================================================
// FIELD STYLE
// =====================================================

const fieldStyle = {

    marginBottom:
        "18px"

};


// =====================================================
// LABEL STYLE
// =====================================================

const labelStyle = {

    display:
        "block",

    marginBottom:
        "7px",

    fontWeight:
        "600",

    color:
        "#334155"

};


// =====================================================
// INPUT STYLE
// =====================================================

const inputStyle = {

    width:
        "100%",

    padding:
        "10px 12px",

    border:
        "1px solid #cbd5e1",

    borderRadius:
        "6px",

    boxSizing:
        "border-box",

    fontSize:
        "14px",

    outline:
        "none"

};


// =====================================================
// EXPORT
// =====================================================

export default EditPurchase;