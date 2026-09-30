import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DocumentSettings() {
    const [settings, setSettings] = useState({
        assetPrefix: "URCTS",
        purchasePrefix: "PO",
        invoicePrefix: "INV",
        ticketPrefix: "TKT",
        assetNumberFormat: "PREFIX-0001",
        purchaseNumberFormat: "PREFIX-0001",
        invoiceNumberFormat: "PREFIX-0001",
        ticketNumberFormat: "PREFIX-0001",
        enableAssetDocument: true,
        enablePurchaseDocument: true,
        enableInvoiceDocument: true,
        enableTicketDocument: true,
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (field, value) => {
        setSettings((prev) => ({
            ...prev,
            [field]: value,
        }));

        setSaved(false);
    };

    const handleSave = () => {
        /*
         * UI-only for now.
         * Backend/database integration can be added separately.
         */
        localStorage.setItem(
            "assetsphere_document_settings",
            JSON.stringify(settings)
        );

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 3000);
    };

    const inputStyle = {
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        fontSize: "14px",
        color: "#0f172a",
        background: "#ffffff",
        outline: "none",
    };

    const labelStyle = {
        display: "block",
        marginBottom: "7px",
        fontSize: "13px",
        fontWeight: "600",
        color: "#334155",
    };

    const sectionStyle = {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        marginBottom: "22px",
        overflow: "hidden",
    };

    const sectionHeaderStyle = {
        padding: "18px 22px",
        borderBottom: "1px solid #e2e8f0",
        background: "#f8fafc",
    };

    const sectionBodyStyle = {
        padding: "22px",
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
    };

    const toggleContainerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 16px",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        background: "#f8fafc",
    };

    const toggleStyle = (enabled) => ({
        width: "46px",
        height: "24px",
        borderRadius: "20px",
        border: "none",
        background: enabled ? "#0891b2" : "#cbd5e1",
        position: "relative",
        cursor: "pointer",
        transition: "0.2s",
        padding: 0,
    });

    const toggleCircleStyle = (enabled) => ({
        position: "absolute",
        top: "3px",
        left: enabled ? "25px" : "3px",
        width: "18px",
        height: "18px",
        borderRadius: "50%",
        background: "#ffffff",
        transition: "0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    });

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f1f5f9",
            }}
        >
            <Sidebar />

            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                }}
            >
                <Navbar />

                <main
                    style={{
                        padding: "28px",
                    }}
                >
                    {/* PAGE HEADER */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "16px",
                            flexWrap: "wrap",
                            marginBottom: "24px",
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "26px",
                                    fontWeight: "700",
                                    color: "#0f172a",
                                }}
                            >
                                Document Settings
                            </h1>

                            <p
                                style={{
                                    margin: "6px 0 0",
                                    fontSize: "14px",
                                    color: "#64748b",
                                }}
                            >
                                Configure document prefixes,
                                numbering formats and document
                                options.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            style={{
                                border: "none",
                                borderRadius: "8px",
                                padding: "10px 18px",
                                background: "#0891b2",
                                color: "#ffffff",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Save Settings
                        </button>
                    </div>

                    {/* SUCCESS MESSAGE */}
                    {saved && (
                        <div
                            style={{
                                marginBottom: "20px",
                                padding: "13px 16px",
                                borderRadius: "8px",
                                background: "#ecfdf5",
                                border: "1px solid #a7f3d0",
                                color: "#047857",
                                fontSize: "14px",
                                fontWeight: "500",
                            }}
                        >
                            ✓ Document settings saved successfully.
                        </div>
                    )}

                    {/* DOCUMENT PREFIXES */}
                    <section style={sectionStyle}>
                        <div style={sectionHeaderStyle}>
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "18px",
                                    color: "#0f172a",
                                }}
                            >
                                Document Prefixes
                            </h2>

                            <p
                                style={{
                                    margin: "5px 0 0",
                                    fontSize: "13px",
                                    color: "#64748b",
                                }}
                            >
                                Define prefixes used when generating
                                document numbers.
                            </p>
                        </div>

                        <div style={sectionBodyStyle}>
                            <div style={gridStyle}>
                                <div>
                                    <label style={labelStyle}>
                                        Asset Prefix
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            settings.assetPrefix
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "assetPrefix",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                        placeholder="URCTS"
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>
                                        Purchase Order Prefix
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            settings.purchasePrefix
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "purchasePrefix",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                        placeholder="PO"
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>
                                        Invoice Prefix
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            settings.invoicePrefix
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "invoicePrefix",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                        placeholder="INV"
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>
                                        Ticket Prefix
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            settings.ticketPrefix
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "ticketPrefix",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                        placeholder="TKT"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* NUMBERING FORMAT */}
                    <section style={sectionStyle}>
                        <div style={sectionHeaderStyle}>
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "18px",
                                    color: "#0f172a",
                                }}
                            >
                                Numbering Format
                            </h2>

                            <p
                                style={{
                                    margin: "5px 0 0",
                                    fontSize: "13px",
                                    color: "#64748b",
                                }}
                            >
                                Configure the format used for
                                automatically generated numbers.
                            </p>
                        </div>

                        <div style={sectionBodyStyle}>
                            <div style={gridStyle}>
                                <div>
                                    <label style={labelStyle}>
                                        Asset Number Format
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            settings.assetNumberFormat
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "assetNumberFormat",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    />

                                    <small
                                        style={{
                                            display: "block",
                                            marginTop: "6px",
                                            color: "#64748b",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Example: URCTS-0001
                                    </small>
                                </div>

                                <div>
                                    <label style={labelStyle}>
                                        Purchase Number Format
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            settings.purchaseNumberFormat
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "purchaseNumberFormat",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    />

                                    <small
                                        style={{
                                            display: "block",
                                            marginTop: "6px",
                                            color: "#64748b",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Example: PO-0001
                                    </small>
                                </div>

                                <div>
                                    <label style={labelStyle}>
                                        Invoice Number Format
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            settings.invoiceNumberFormat
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "invoiceNumberFormat",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    />

                                    <small
                                        style={{
                                            display: "block",
                                            marginTop: "6px",
                                            color: "#64748b",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Example: INV-0001
                                    </small>
                                </div>

                                <div>
                                    <label style={labelStyle}>
                                        Ticket Number Format
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            settings.ticketNumberFormat
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "ticketNumberFormat",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    />

                                    <small
                                        style={{
                                            display: "block",
                                            marginTop: "6px",
                                            color: "#64748b",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Example: TKT-0001
                                    </small>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* DOCUMENT OPTIONS */}
                    <section style={sectionStyle}>
                        <div style={sectionHeaderStyle}>
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "18px",
                                    color: "#0f172a",
                                }}
                            >
                                Document Options
                            </h2>

                            <p
                                style={{
                                    margin: "5px 0 0",
                                    fontSize: "13px",
                                    color: "#64748b",
                                }}
                            >
                                Enable or disable document number
                                generation.
                            </p>
                        </div>

                        <div style={sectionBodyStyle}>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(260px, 1fr))",
                                    gap: "14px",
                                }}
                            >
                                {/* ASSET */}
                                <div
                                    style={
                                        toggleContainerStyle
                                    }
                                >
                                    <div>
                                        <strong
                                            style={{
                                                display: "block",
                                                fontSize: "14px",
                                                color: "#0f172a",
                                            }}
                                        >
                                            Asset Documents
                                        </strong>

                                        <span
                                            style={{
                                                display: "block",
                                                marginTop: "4px",
                                                fontSize: "12px",
                                                color: "#64748b",
                                            }}
                                        >
                                            Generate asset numbers
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleChange(
                                                "enableAssetDocument",
                                                !settings.enableAssetDocument
                                            )
                                        }
                                        style={toggleStyle(
                                            settings.enableAssetDocument
                                        )}
                                    >
                                        <span
                                            style={toggleCircleStyle(
                                                settings.enableAssetDocument
                                            )}
                                        />
                                    </button>
                                </div>

                                {/* PURCHASE */}
                                <div
                                    style={
                                        toggleContainerStyle
                                    }
                                >
                                    <div>
                                        <strong
                                            style={{
                                                display: "block",
                                                fontSize: "14px",
                                                color: "#0f172a",
                                            }}
                                        >
                                            Purchase Documents
                                        </strong>

                                        <span
                                            style={{
                                                display: "block",
                                                marginTop: "4px",
                                                fontSize: "12px",
                                                color: "#64748b",
                                            }}
                                        >
                                            Generate purchase order
                                            numbers
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleChange(
                                                "enablePurchaseDocument",
                                                !settings.enablePurchaseDocument
                                            )
                                        }
                                        style={toggleStyle(
                                            settings.enablePurchaseDocument
                                        )}
                                    >
                                        <span
                                            style={toggleCircleStyle(
                                                settings.enablePurchaseDocument
                                            )}
                                        />
                                    </button>
                                </div>

                                {/* INVOICE */}
                                <div
                                    style={
                                        toggleContainerStyle
                                    }
                                >
                                    <div>
                                        <strong
                                            style={{
                                                display: "block",
                                                fontSize: "14px",
                                                color: "#0f172a",
                                            }}
                                        >
                                            Invoice Documents
                                        </strong>

                                        <span
                                            style={{
                                                display: "block",
                                                marginTop: "4px",
                                                fontSize: "12px",
                                                color: "#64748b",
                                            }}
                                        >
                                            Generate invoice
                                            numbers
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleChange(
                                                "enableInvoiceDocument",
                                                !settings.enableInvoiceDocument
                                            )
                                        }
                                        style={toggleStyle(
                                            settings.enableInvoiceDocument
                                        )}
                                    >
                                        <span
                                            style={toggleCircleStyle(
                                                settings.enableInvoiceDocument
                                            )}
                                        />
                                    </button>
                                </div>

                                {/* TICKET */}
                                <div
                                    style={
                                        toggleContainerStyle
                                    }
                                >
                                    <div>
                                        <strong
                                            style={{
                                                display: "block",
                                                fontSize: "14px",
                                                color: "#0f172a",
                                            }}
                                        >
                                            IT Ticket Documents
                                        </strong>

                                        <span
                                            style={{
                                                display: "block",
                                                marginTop: "4px",
                                                fontSize: "12px",
                                                color: "#64748b",
                                            }}
                                        >
                                            Generate support ticket
                                            numbers
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleChange(
                                                "enableTicketDocument",
                                                !settings.enableTicketDocument
                                            )
                                        }
                                        style={toggleStyle(
                                            settings.enableTicketDocument
                                        )}
                                    >
                                        <span
                                            style={toggleCircleStyle(
                                                settings.enableTicketDocument
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* INFORMATION */}
                    <div
                        style={{
                            padding: "15px 18px",
                            borderRadius: "9px",
                            background: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            color: "#1e40af",
                            fontSize: "13px",
                            lineHeight: "1.6",
                        }}
                    >
                        <strong>Note:</strong> Document Settings are
                        currently stored in the browser for this
                        configuration screen. Database/API integration
                        can be connected later without changing this
                        page design.
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DocumentSettings;