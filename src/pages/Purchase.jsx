import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Purchase() {

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

            console.error(error);

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
                ${purchase.po_number || ""}
                ${purchase.invoice_number || ""}
                ${purchase.vendor_name || ""}
                ${purchase.payment_status || ""}
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
    // FORMAT COST
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
                    flex: 1
                }}
            >

                <Navbar />


                <div
                    style={{
                        padding: "25px"
                    }}
                >

                    {/* HEADER */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    margin: 0
                                }}
                            >
                                Purchase Management
                            </h1>

                            <p>
                                Manage company purchases
                            </p>

                        </div>


                        <button
                            onClick={() => {

                                loadPurchases();
                                loadSummary();

                            }}
                        >
                            Refresh
                        </button>

                    </div>


                    {/* SUMMARY */}

                    {summary && (

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(4, 1fr)",
                                gap: "15px",
                                marginTop: "20px"
                            }}
                        >

                            <div
                                style={cardStyle}
                            >
                                <p>
                                    Total Purchases
                                </p>

                                <h2>
                                    {
                                        summary.total_purchases
                                    }
                                </h2>
                            </div>


                            <div
                                style={cardStyle}
                            >
                                <p>
                                    Total Amount
                                </p>

                                <h2>
                                    {
                                        formatAmount(
                                            summary.total_purchase_amount
                                        )
                                    }
                                </h2>
                            </div>


                            <div
                                style={cardStyle}
                            >
                                <p>
                                    Pending Payments
                                </p>

                                <h2>
                                    {
                                        summary.pending_payments
                                    }
                                </h2>
                            </div>


                            <div
                                style={cardStyle}
                            >
                                <p>
                                    Paid Purchases
                                </p>

                                <h2>
                                    {
                                        summary.paid_purchases
                                    }
                                </h2>
                            </div>

                        </div>

                    )}


                    {/* SEARCH */}

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
                                    "10px",
                                width:
                                    "320px",
                                border:
                                    "1px solid #ccc",
                                borderRadius:
                                    "6px"
                            }}
                        />

                    </div>


                    {/* TABLE */}

                    <div
                        style={{
                            background:
                                "#ffffff",
                            borderRadius:
                                "10px",
                            overflow:
                                "auto"
                        }}
                    >

                        <table
                            style={{
                                width:
                                    "100%",
                                borderCollapse:
                                    "collapse",
                                minWidth:
                                    "1100px"
                            }}
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
                                        Purchase Date
                                    </th>

                                    <th style={thStyle}>
                                        Amount
                                    </th>

                                    <th style={thStyle}>
                                        Payment
                                    </th>

                                    <th style={thStyle}>
                                        Warranty Expiry
                                    </th>

                                    <th style={thStyle}>
                                        Remarks
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="9"
                                            style={{
                                                padding:
                                                    "25px",
                                                textAlign:
                                                    "center"
                                            }}
                                        >
                                            Loading...
                                        </td>

                                    </tr>

                                ) : filteredPurchases.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="9"
                                            style={{
                                                padding:
                                                    "25px",
                                                textAlign:
                                                    "center"
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

                                                <td style={tdStyle}>
                                                    {
                                                        purchase.purchase_id
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        purchase.po_number
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        purchase.invoice_number ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        purchase.vendor_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        formatDate(
                                                            purchase.purchase_date
                                                        )
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        formatAmount(
                                                            purchase.amount
                                                        )
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        purchase.payment_status
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        formatDate(
                                                            purchase.warranty_expiry
                                                        )
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        purchase.remarks ||
                                                        "-"
                                                    }
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


const cardStyle = {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow:
        "0 2px 5px rgba(0,0,0,0.1)"
};


const thStyle = {
    padding: "12px",
    textAlign: "left",
    borderBottom:
        "1px solid #ddd",
    whiteSpace:
        "nowrap"
};


const tdStyle = {
    padding: "12px",
    borderBottom:
        "1px solid #eee",
    whiteSpace:
        "nowrap"
};


export default Purchase;