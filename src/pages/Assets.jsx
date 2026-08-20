import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Assets() {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] =
        useSearchParams();

    const [assets, setAssets] = useState([]);

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState(
            searchParams.get("status") || "All"
        );

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // LOAD ASSETS
    // =====================================================

    const loadAssets = async () => {

        try {

            setLoading(true);

            const response =
                await API.get("/assets");

            setAssets(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Load Assets Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load assets"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadAssets();

    }, []);


    // =====================================================
    // SYNC URL FILTER
    // =====================================================

    useEffect(() => {

        const urlStatus =
            searchParams.get("status");

        if (
            urlStatus &&
            [
                "Assigned",
                "In Stock",
                "Repair",
                "Scrap",
                "Lost"
            ].includes(urlStatus)
        ) {

            setStatus(urlStatus);

        } else {

            setStatus("All");

        }

    }, [searchParams]);


    // =====================================================
    // STATUS FILTER CHANGE
    // =====================================================

    const handleStatusChange = (value) => {

        setStatus(value);

        if (value === "All") {

            setSearchParams({});

        } else {

            setSearchParams({
                status: value
            });

        }

    };


    // =====================================================
    // CLEAR FILTER
    // =====================================================

    const handleClearFilter = () => {

        setStatus("All");

        setSearch("");

        setSearchParams({});

    };


    // =====================================================
    // RETURN ASSET
    // =====================================================

    const handleReturn = async (id) => {

        const confirmReturn =
            window.confirm(
                "Are you sure you want to return this asset?"
            );

        if (!confirmReturn) {
            return;
        }

        try {

            await API.put(
                `/assets/return/${id}`
            );

            alert(
                "Asset returned successfully"
            );

            loadAssets();

        } catch (error) {

            console.error(
                "Return Asset Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to return asset"
            );

        }

    };


    // =====================================================
    // SCRAP ASSET
    // =====================================================

    const handleScrap = async (id) => {

        const confirmScrap =
            window.confirm(
                "Are you sure you want to scrap this asset?"
            );

        if (!confirmScrap) {
            return;
        }

        try {

            await API.put(
                `/assets/scrap/${id}`
            );

            alert(
                "Asset moved to Scrap"
            );

            loadAssets();

        } catch (error) {

            console.error(
                "Scrap Asset Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to scrap asset"
            );

        }

    };


    // =====================================================
    // FILTER ASSETS
    // =====================================================

    const filteredAssets =
        assets.filter((asset) => {

            const text = `
                ${asset.asset_code || ""}
                ${asset.asset_name || ""}
                ${asset.category_name || ""}
                ${asset.display_name || ""}
                ${asset.vendor_name || ""}
                ${asset.location_name || ""}
                ${asset.asset_status || ""}
            `.toLowerCase();


            const matchesSearch =
                text.includes(
                    search.toLowerCase()
                );


            const matchesStatus =
                status === "All" ||
                asset.asset_status === status;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    // =====================================================
    // STATUS COLORS
    // =====================================================

    const getStatusStyle = (assetStatus) => {

        if (assetStatus === "Assigned") {

            return {
                background: "#dbeafe",
                color: "#1d4ed8"
            };

        }

        if (assetStatus === "In Stock") {

            return {
                background: "#dcfce7",
                color: "#166534"
            };

        }

        if (assetStatus === "Repair") {

            return {
                background: "#fef3c7",
                color: "#92400e"
            };

        }

        if (assetStatus === "Scrap") {

            return {
                background: "#fee2e2",
                color: "#991b1b"
            };

        }

        if (assetStatus === "Lost") {

            return {
                background: "#f3e8ff",
                color: "#7e22ce"
            };

        }

        return {
            background: "#f1f5f9",
            color: "#475569"
        };

    };


    return (

        <div
            style={{
                display: "flex",
                background: "#f5f7fb",
                minHeight: "100vh"
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
                                    fontSize: "30px",
                                    color: "#0f172a"
                                }}
                            >
                                Hardware Assets
                            </h1>

                            <p
                                style={{
                                    marginTop: "6px",
                                    color: "#64748b"
                                }}
                            >
                                Manage company hardware assets
                            </p>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                gap: "10px"
                            }}
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/assets/add"
                                    )
                                }
                                style={{
                                    padding:
                                        "10px 16px",
                                    border: "none",
                                    background:
                                        "#2563eb",
                                    color: "#ffffff",
                                    borderRadius:
                                        "7px",
                                    cursor:
                                        "pointer",
                                    fontWeight:
                                        "600"
                                }}
                            >
                                + Add Asset
                            </button>


                            <button
                                type="button"
                                onClick={
                                    loadAssets
                                }
                                style={{
                                    padding:
                                        "10px 16px",
                                    border:
                                        "1px solid #cbd5e1",
                                    background:
                                        "#ffffff",
                                    color:
                                        "#334155",
                                    borderRadius:
                                        "7px",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                Refresh
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        ACTIVE DASHBOARD FILTER
                    ================================================= */}

                    {status !== "All" && (

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                background:
                                    "#eff6ff",
                                border:
                                    "1px solid #bfdbfe",
                                padding:
                                    "12px 15px",
                                borderRadius:
                                    "8px",
                                marginBottom:
                                    "15px"
                            }}
                        >

                            <div>

                                <strong
                                    style={{
                                        color:
                                            "#1d4ed8"
                                    }}
                                >
                                    Dashboard Filter:
                                </strong>

                                <span
                                    style={{
                                        marginLeft:
                                            "8px",
                                        color:
                                            "#334155"
                                    }}
                                >
                                    {status}
                                </span>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleClearFilter
                                }
                                style={{
                                    border: "none",
                                    background:
                                        "#2563eb",
                                    color:
                                        "#ffffff",
                                    padding:
                                        "6px 12px",
                                    borderRadius:
                                        "6px",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                Clear Filter
                            </button>

                        </div>

                    )}


                    {/* =================================================
                        SEARCH + FILTER
                    ================================================= */}

                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            marginBottom:
                                "20px",
                            flexWrap:
                                "wrap"
                        }}
                    >

                        <input
                            type="text"
                            placeholder={
                                "Search assets..."
                            }
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
                                    "300px",
                                maxWidth:
                                    "100%",
                                border:
                                    "1px solid #cbd5e1",
                                borderRadius:
                                    "7px",
                                outline:
                                    "none",
                                boxSizing:
                                    "border-box"
                            }}
                        />


                        <select
                            value={status}
                            onChange={(e) =>
                                handleStatusChange(
                                    e.target.value
                                )
                            }
                            style={{
                                padding:
                                    "10px 12px",
                                border:
                                    "1px solid #cbd5e1",
                                borderRadius:
                                    "7px",
                                background:
                                    "#ffffff",
                                outline:
                                    "none"
                            }}
                        >

                            <option value="All">
                                All Status
                            </option>

                            <option value="Assigned">
                                Assigned
                            </option>

                            <option value="In Stock">
                                In Stock
                            </option>

                            <option value="Repair">
                                Repair
                            </option>

                            <option value="Scrap">
                                Scrap
                            </option>

                            <option value="Lost">
                                Lost
                            </option>

                        </select>


                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                color:
                                    "#64748b",
                                fontSize:
                                    "14px"
                            }}
                        >
                            Showing{" "}
                            <strong
                                style={{
                                    margin:
                                        "0 4px",
                                    color:
                                        "#0f172a"
                                }}
                            >
                                {
                                    filteredAssets.length
                                }
                            </strong>
                            assets
                        </div>

                    </div>


                    {/* =================================================
                        TABLE
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
                                "0 2px 8px rgba(15,23,42,0.08)"
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

                                <tr
                                    style={{
                                        background:
                                            "#f8fafc"
                                    }}
                                >

                                    <th style={thStyle}>
                                        Asset Code
                                    </th>

                                    <th style={thStyle}>
                                        Asset Name
                                    </th>

                                    <th style={thStyle}>
                                        Category
                                    </th>

                                    <th style={thStyle}>
                                        Employee
                                    </th>

                                    <th style={thStyle}>
                                        Vendor
                                    </th>

                                    <th style={thStyle}>
                                        Location
                                    </th>

                                    <th style={thStyle}>
                                        Status
                                    </th>

                                    <th style={thStyle}>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            style={emptyStyle}
                                        >
                                            Loading...
                                        </td>

                                    </tr>

                                ) : filteredAssets.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            style={emptyStyle}
                                        >
                                            No assets found
                                        </td>

                                    </tr>

                                ) : (

                                    filteredAssets.map(
                                        (asset) => (

                                            <tr
                                                key={
                                                    asset.asset_id
                                                }
                                            >

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        asset.asset_code
                                                    }
                                                </td>


                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        asset.asset_name
                                                    }
                                                </td>


                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        asset.category_name ||
                                                        "-"
                                                    }
                                                </td>


                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        asset.display_name ||
                                                        "-"
                                                    }
                                                </td>


                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        asset.vendor_name ||
                                                        "-"
                                                    }
                                                </td>


                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        asset.location_name ||
                                                        "-"
                                                    }
                                                </td>


                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >

                                                    <span
                                                        style={{
                                                            ...getStatusStyle(
                                                                asset.asset_status
                                                            ),
                                                            padding:
                                                                "5px 10px",
                                                            borderRadius:
                                                                "15px",
                                                            fontSize:
                                                                "12px",
                                                            fontWeight:
                                                                "600"
                                                        }}
                                                    >
                                                        {
                                                            asset.asset_status
                                                        }
                                                    </span>

                                                </td>


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
                                                                "6px",
                                                            flexWrap:
                                                                "wrap"
                                                        }}
                                                    >

                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                alert(
                                                                    `Asset ID: ${asset.asset_id}`
                                                                )
                                                            }
                                                            style={
                                                                viewButtonStyle
                                                            }
                                                        >
                                                            View
                                                        </button>


                                                        {/* ASSIGN */}

                                                        {
                                                            asset.asset_status !==
                                                                "Scrap" &&
                                                            asset.asset_status !==
                                                                "Assigned" && (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/assets/assign/${asset.asset_id}`
                                                                        )
                                                                    }
                                                                    style={
                                                                        assignButtonStyle
                                                                    }
                                                                >
                                                                    Assign
                                                                </button>

                                                            )
                                                        }


                                                        {/* RETURN */}

                                                        {
                                                            asset.asset_status ===
                                                                "Assigned" && (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleReturn(
                                                                            asset.asset_id
                                                                        )
                                                                    }
                                                                    style={
                                                                        returnButtonStyle
                                                                    }
                                                                >
                                                                    Return
                                                                </button>

                                                            )
                                                        }


                                                        {/* SCRAP */}

                                                        {
                                                            asset.asset_status !==
                                                                "Scrap" && (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleScrap(
                                                                            asset.asset_id
                                                                        )
                                                                    }
                                                                    style={
                                                                        scrapButtonStyle
                                                                    }
                                                                >
                                                                    Scrap
                                                                </button>

                                                            )
                                                        }

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
// STYLES
// =====================================================

const thStyle = {

    padding: "13px 12px",

    textAlign: "left",

    borderBottom:
        "1px solid #e2e8f0",

    color: "#475569",

    fontSize: "13px",

    whiteSpace: "nowrap"

};


const tdStyle = {

    padding: "13px 12px",

    borderBottom:
        "1px solid #f1f5f9",

    color: "#475569",

    fontSize: "13px",

    whiteSpace: "nowrap"

};


const emptyStyle = {

    padding: "30px",

    textAlign: "center",

    color: "#64748b"

};


const viewButtonStyle = {

    padding: "6px 10px",

    border:
        "1px solid #64748b",

    background:
        "#ffffff",

    color:
        "#475569",

    borderRadius: "6px",

    cursor: "pointer",

    fontSize: "12px"

};


const assignButtonStyle = {

    padding: "6px 10px",

    border:
        "1px solid #2563eb",

    background:
        "#eff6ff",

    color:
        "#1d4ed8",

    borderRadius: "6px",

    cursor: "pointer",

    fontSize: "12px"

};


const returnButtonStyle = {

    padding: "6px 10px",

    border:
        "1px solid #16a34a",

    background:
        "#f0fdf4",

    color:
        "#15803d",

    borderRadius: "6px",

    cursor: "pointer",

    fontSize: "12px"

};


const scrapButtonStyle = {

    padding: "6px 10px",

    border:
        "1px solid #dc2626",

    background:
        "#fef2f2",

    color:
        "#b91c1c",

    borderRadius: "6px",

    cursor: "pointer",

    fontSize: "12px"

};


export default Assets;