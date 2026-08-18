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

    const [loading, setLoading] = useState(false);
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


    useEffect(() => {

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
    // VALIDATION
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
    // ADD PURCHASE
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


            const response =
                await API.post(
                    "/purchases",
                    payload
                );


            if (
                response.data &&
                response.data.success
            ) {

                alert(
                    "Purchase added successfully"
                );

                navigate(
                    "/purchases"
                );

            } else {

                alert(
                    response.data?.message ||
                    "Failed to add purchase"
                );

            }


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

                    {/* =====================================================
                        HEADER
                    ===================================================== */}

                    <div
                        style={{
                            marginBottom: "25px"
                        }}
                    >

                        <h1
                            style={{
                                margin: 0
                            }}
                        >
                            Add Purchase
                        </h1>

                        <p
                            style={{
                                color: "#666"
                            }}
                        >
                            Create a new purchase record
                        </p>

                    </div>


                    {/* =====================================================
                        FORM
                    ===================================================== */}

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

                            <div style={fieldStyle}>

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
                                    style={inputStyle}
                                />

                            </div>


                            {/* =================================================
                                INVOICE NUMBER
                            ================================================= */}

                            <div style={fieldStyle}>

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


                            {/* =================================================
                                VENDOR
                            ================================================= */}

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
                                    style={inputStyle}
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
                                                {vendor.vendor_name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* =================================================
                                PURCHASE DATE
                            ================================================= */}

                            <div style={fieldStyle}>

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
                                    style={inputStyle}
                                />

                            </div>


                            {/* =================================================
                                AMOUNT
                            ================================================= */}

                            <div style={fieldStyle}>

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
                                    style={inputStyle}
                                />

                            </div>


                            {/* =================================================
                                PAYMENT STATUS
                            ================================================= */}

                            <div style={fieldStyle}>

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


                            {/* =================================================
                                WARRANTY EXPIRY
                            ================================================= */}

                            <div style={fieldStyle}>

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


                            {/* =================================================
                                REMARKS
                            ================================================= */}

                            <div style={fieldStyle}>

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
                                    disabled={loading}
                                    style={{
                                        padding:
                                            "10px 20px",
                                        border: "none",
                                        borderRadius:
                                            "6px",
                                        background:
                                            "#2563eb",
                                        color:
                                            "#ffffff",
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


                                <button
                                    type="button"
                                    onClick={
                                        handleCancel
                                    }
                                    disabled={loading}
                                    style={{
                                        padding:
                                            "10px 20px",
                                        border:
                                            "1px solid #ccc",
                                        borderRadius:
                                            "6px",
                                        background:
                                            "#ffffff",
                                        cursor:
                                            "pointer"
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
// STYLES
// =====================================================

const fieldStyle = {
    marginBottom: "18px"
};


const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontWeight: "600"
};


const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box"
};


export default AddPurchase;