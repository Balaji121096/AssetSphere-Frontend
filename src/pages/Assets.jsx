import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";


function Assets() {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] =
        useSearchParams();

    const [assets, setAssets] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState(
            searchParams.get("status") || "All"
        );

    const [loading, setLoading] =
        useState(true);

    const [viewAsset, setViewAsset] =
        useState(null);

    const [editAsset, setEditAsset] =
        useState(null);

    const [saving, setSaving] =
        useState(false);


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
    // STATUS FILTER
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
    // RETURN
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

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to return asset"
            );

        }

    };


    // =====================================================
    // SCRAP
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

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to scrap asset"
            );

        }

    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this asset?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await API.delete(
                `/assets/${id}`
            );

            alert(
                "Asset deleted successfully"
            );

            loadAssets();

        } catch (error) {

            console.error(
                "Delete Asset Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete asset"
            );

        }

    };


    // =====================================================
    // STATUS UPDATE
    // =====================================================

    const handleStatusUpdate = async (
        id,
        newStatus
    ) => {

        try {

            await API.put(
                `/assets/status/${id}`,
                {
                    status: newStatus
                }
            );

            alert(
                "Asset status updated successfully"
            );

            loadAssets();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update status"
            );

        }

    };


    // =====================================================
    // EDIT SAVE
    // =====================================================

    const handleEditSave = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            await API.put(
                `/assets/${editAsset.asset_id}`,
                {
                    asset_code:
                        editAsset.asset_code,

                    asset_name:
                        editAsset.asset_name,

                    brand:
                        editAsset.brand,

                    model:
                        editAsset.model,

                    serial_number:
                        editAsset.serial_number,

                    category_id:
                        editAsset.category_id,

                    vendor_id:
                        editAsset.vendor_id,

                    location_id:
                        editAsset.location_id,

                    asset_status:
                        editAsset.asset_status
                }
            );

            alert(
                "Asset updated successfully"
            );

            setEditAsset(null);

            loadAssets();

        } catch (error) {

            console.error(
                "Update Asset Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update asset"
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // FILTER
    // =====================================================

    const filteredAssets =
        assets.filter((asset) => {

            const text = `
                ${asset.asset_code || ""}
                ${asset.asset_name || ""}
                ${asset.brand || ""}
                ${asset.model || ""}
                ${asset.serial_number || ""}
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

    const getStatusStyle = (
        assetStatus
    ) => {

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


    // =====================================================
    // RETURN UI
    // =====================================================

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

                    {/* HEADER */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                            flexWrap: "wrap",
                            gap: "15px"
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
                                style={
                                    primaryButtonStyle
                                }
                            >
                                + Add Asset
                            </button>


                            <button
                                type="button"
                                onClick={
                                    loadAssets
                                }
                                style={
                                    refreshButtonStyle
                                }
                            >
                                Refresh
                            </button>

                        </div>

                    </div>


                    {/* FILTER */}

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
                                            "8px"
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
                                        "#fff",
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


                    {/* SEARCH */}

                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            marginBottom: "20px",
                            flexWrap: "wrap"
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            style={
                                searchStyle
                            }
                        />


                        <select
                            value={status}
                            onChange={(e) =>
                                handleStatusChange(
                                    e.target.value
                                )
                            }
                            style={
                                selectStyle
                            }
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
                                display: "flex",
                                alignItems: "center",
                                color: "#64748b"
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


                    {/* TABLE */}

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "10px",
                            overflowX: "auto",
                            boxShadow:
                                "0 2px 8px rgba(15,23,42,0.08)"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse:
                                    "collapse",
                                minWidth:
                                    "1150px"
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

                                    <th
                                        style={{
                                            ...thStyle,
                                            textAlign:
                                                "center"
                                        }}
                                    >
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            style={
                                                emptyStyle
                                            }
                                        >
                                            Loading...
                                        </td>

                                    </tr>

                                ) : filteredAssets.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            style={
                                                emptyStyle
                                            }
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

                                                <td style={tdStyle}>
                                                    {
                                                        asset.asset_code
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.asset_name
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.category_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.display_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.vendor_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        asset.location_name ||
                                                        "-"
                                                    }
                                                </td>


                                                {/* STATUS */}

                                                <td style={tdStyle}>

                                                    <select
                                                        value={
                                                            asset.asset_status
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleStatusUpdate(
                                                                asset.asset_id,
                                                                e.target.value
                                                            )
                                                        }
                                                        style={{
                                                            ...statusSelectStyle,
                                                            ...getStatusStyle(
                                                                asset.asset_status
                                                            )
                                                        }}
                                                    >

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

                                                </td>


                                                {/* =================================================
                                                    ACTIONS - ICON VERSION
                                                ================================================= */}

                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        textAlign:
                                                            "center"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            gap:
                                                                "5px",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            flexWrap:
                                                                "nowrap"
                                                        }}
                                                    >

                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            title="View Asset"
                                                            aria-label="View Asset"
                                                            onClick={() =>
                                                                setViewAsset(
                                                                    asset
                                                                )
                                                            }
                                                            style={
                                                                iconViewButtonStyle
                                                            }
                                                        >
                                                            👁
                                                        </button>


                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            title="Edit Asset"
                                                            aria-label="Edit Asset"
                                                            onClick={() =>
                                                                setEditAsset(
                                                                    {
                                                                        ...asset
                                                                    }
                                                                )
                                                            }
                                                            style={
                                                                iconEditButtonStyle
                                                            }
                                                        >
                                                            ✏
                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            title="Delete Asset"
                                                            aria-label="Delete Asset"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    asset.asset_id
                                                                )
                                                            }
                                                            style={
                                                                iconDeleteButtonStyle
                                                            }
                                                        >
                                                            🗑
                                                        </button>


                                                        {/* ASSIGN */}

                                                        {
                                                            asset.asset_status !==
                                                                "Scrap" &&
                                                            asset.asset_status !==
                                                                "Assigned" &&
                                                            asset.asset_status !==
                                                                "Lost" && (

                                                                <button
                                                                    type="button"
                                                                    title="Assign Asset"
                                                                    aria-label="Assign Asset"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/assets/assign/${asset.asset_id}`
                                                                        )
                                                                    }
                                                                    style={
                                                                        iconAssignButtonStyle
                                                                    }
                                                                >
                                                                    ➜
                                                                </button>

                                                            )
                                                        }


                                                        {/* RETURN */}

                                                        {
                                                            asset.asset_status ===
                                                                "Assigned" && (

                                                                <button
                                                                    type="button"
                                                                    title="Return Asset"
                                                                    aria-label="Return Asset"
                                                                    onClick={() =>
                                                                        handleReturn(
                                                                            asset.asset_id
                                                                        )
                                                                    }
                                                                    style={
                                                                        iconReturnButtonStyle
                                                                    }
                                                                >
                                                                    ↩
                                                                </button>

                                                            )
                                                        }


                                                        {/* SCRAP */}

                                                        {
                                                            asset.asset_status !==
                                                                "Scrap" && (

                                                                <button
                                                                    type="button"
                                                                    title="Scrap Asset"
                                                                    aria-label="Scrap Asset"
                                                                    onClick={() =>
                                                                        handleScrap(
                                                                            asset.asset_id
                                                                        )
                                                                    }
                                                                    style={
                                                                        iconScrapButtonStyle
                                                                    }
                                                                >
                                                                    ♻
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


            {/* =====================================================
                VIEW MODAL
            ===================================================== */}

            {viewAsset && (

                <div style={overlayStyle}>

                    <div style={modalStyle}>

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center"
                            }}
                        >

                            <h2>
                                Asset Details
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setViewAsset(null)
                                }
                                style={
                                    closeButtonStyle
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <Detail
                            label="Asset Code"
                            value={
                                viewAsset.asset_code
                            }
                        />

                        <Detail
                            label="Asset Name"
                            value={
                                viewAsset.asset_name
                            }
                        />

                        <Detail
                            label="Brand"
                            value={
                                viewAsset.brand
                            }
                        />

                        <Detail
                            label="Model"
                            value={
                                viewAsset.model
                            }
                        />

                        <Detail
                            label="Serial Number"
                            value={
                                viewAsset.serial_number
                            }
                        />

                        <Detail
                            label="Category"
                            value={
                                viewAsset.category_name
                            }
                        />

                        <Detail
                            label="Employee"
                            value={
                                viewAsset.display_name ||
                                "-"
                            }
                        />

                        <Detail
                            label="Vendor"
                            value={
                                viewAsset.vendor_name ||
                                "-"
                            }
                        />

                        <Detail
                            label="Location"
                            value={
                                viewAsset.location_name ||
                                "-"
                            }
                        />

                        <Detail
                            label="Status"
                            value={
                                viewAsset.asset_status
                            }
                        />

                    </div>

                </div>

            )}


            {/* =====================================================
                EDIT MODAL
            ===================================================== */}

            {editAsset && (

                <div style={overlayStyle}>

                    <div
                        style={{
                            ...modalStyle,
                            maxWidth: "600px"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center"
                            }}
                        >

                            <h2>
                                Edit Asset
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setEditAsset(null)
                                }
                                style={
                                    closeButtonStyle
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleEditSave
                            }
                        >

                            <label style={labelStyle}>
                                Asset Code
                            </label>

                            <input
                                value={
                                    editAsset.asset_code ||
                                    ""
                                }
                                onChange={(e) =>
                                    setEditAsset({
                                        ...editAsset,
                                        asset_code:
                                            e.target.value
                                    })
                                }
                                style={
                                    inputStyle
                                }
                                required
                            />


                            <label style={labelStyle}>
                                Asset Name
                            </label>

                            <input
                                value={
                                    editAsset.asset_name ||
                                    ""
                                }
                                onChange={(e) =>
                                    setEditAsset({
                                        ...editAsset,
                                        asset_name:
                                            e.target.value
                                    })
                                }
                                style={
                                    inputStyle
                                }
                                required
                            />


                            <label style={labelStyle}>
                                Brand
                            </label>

                            <input
                                value={
                                    editAsset.brand ||
                                    ""
                                }
                                onChange={(e) =>
                                    setEditAsset({
                                        ...editAsset,
                                        brand:
                                            e.target.value
                                    })
                                }
                                style={
                                    inputStyle
                                }
                            />


                            <label style={labelStyle}>
                                Model
                            </label>

                            <input
                                value={
                                    editAsset.model ||
                                    ""
                                }
                                onChange={(e) =>
                                    setEditAsset({
                                        ...editAsset,
                                        model:
                                            e.target.value
                                    })
                                }
                                style={
                                    inputStyle
                                }
                            />


                            <label style={labelStyle}>
                                Serial Number
                            </label>

                            <input
                                value={
                                    editAsset.serial_number ||
                                    ""
                                }
                                onChange={(e) =>
                                    setEditAsset({
                                        ...editAsset,
                                        serial_number:
                                            e.target.value
                                    })
                                }
                                style={
                                    inputStyle
                                }
                            />


                            <label style={labelStyle}>
                                Status
                            </label>

                            <select
                                value={
                                    editAsset.asset_status ||
                                    "In Stock"
                                }
                                onChange={(e) =>
                                    setEditAsset({
                                        ...editAsset,
                                        asset_status:
                                            e.target.value
                                    })
                                }
                                style={
                                    inputStyle
                                }
                            >

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
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: "10px",
                                    marginTop:
                                        "20px"
                                }}
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditAsset(null)
                                    }
                                    style={
                                        cancelButtonStyle
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={
                                        saveButtonStyle
                                    }
                                >
                                    {
                                        saving
                                            ? "Saving..."
                                            : "Save Changes"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}


// =====================================================
// DETAIL COMPONENT
// =====================================================

function Detail({
    label,
    value
}) {

    return (

        <div
            style={{
                display: "flex",
                justifyContent:
                    "space-between",
                gap: "20px",
                padding: "10px 0",
                borderBottom:
                    "1px solid #e2e8f0"
            }}
        >

            <strong>
                {label}
            </strong>

            <span>
                {value || "-"}
            </span>

        </div>

    );

}


// =====================================================
// TABLE STYLES
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


// =====================================================
// HEADER BUTTONS
// =====================================================

const primaryButtonStyle = {

    padding: "10px 16px",

    border: "none",

    background: "#2563eb",

    color: "#fff",

    borderRadius: "7px",

    cursor: "pointer",

    fontWeight: "600"

};


const refreshButtonStyle = {

    padding: "10px 16px",

    border: "1px solid #cbd5e1",

    background: "#fff",

    color: "#334155",

    borderRadius: "7px",

    cursor: "pointer"

};


// =====================================================
// SEARCH / FILTER
// =====================================================

const searchStyle = {

    padding: "10px 12px",

    width: "300px",

    maxWidth: "100%",

    border: "1px solid #cbd5e1",

    borderRadius: "7px",

    boxSizing: "border-box"

};


const selectStyle = {

    padding: "10px 12px",

    border: "1px solid #cbd5e1",

    borderRadius: "7px",

    background: "#fff"

};


// =====================================================
// STATUS
// =====================================================

const statusSelectStyle = {

    padding: "5px 8px",

    border: "none",

    borderRadius: "15px",

    fontSize: "12px",

    fontWeight: "600",

    cursor: "pointer",

    outline: "none"

};


// =====================================================
// ICON ACTION BUTTONS
// =====================================================

const iconBaseStyle = {

    width: "32px",

    height: "32px",

    padding: 0,

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "6px",

    cursor: "pointer",

    fontSize: "15px",

    lineHeight: 1,

    flexShrink: 0

};


const iconViewButtonStyle = {

    ...iconBaseStyle,

    border: "1px solid #64748b",

    background: "#fff",

    color: "#475569"

};


const iconEditButtonStyle = {

    ...iconBaseStyle,

    border: "1px solid #2563eb",

    background: "#eff6ff",

    color: "#1d4ed8"

};


const iconDeleteButtonStyle = {

    ...iconBaseStyle,

    border: "1px solid #dc2626",

    background: "#fef2f2",

    color: "#b91c1c"

};


const iconAssignButtonStyle = {

    ...iconBaseStyle,

    border: "1px solid #2563eb",

    background: "#eff6ff",

    color: "#1d4ed8"

};


const iconReturnButtonStyle = {

    ...iconBaseStyle,

    border: "1px solid #16a34a",

    background: "#f0fdf4",

    color: "#15803d"

};


const iconScrapButtonStyle = {

    ...iconBaseStyle,

    border: "1px solid #dc2626",

    background: "#fef2f2",

    color: "#b91c1c"

};


// =====================================================
// MODAL
// =====================================================

const overlayStyle = {

    position: "fixed",

    inset: 0,

    background:
        "rgba(15,23,42,0.45)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    zIndex: 1000,

    padding: "20px"

};


const modalStyle = {

    background: "#fff",

    width: "100%",

    maxWidth: "550px",

    maxHeight: "90vh",

    overflowY: "auto",

    borderRadius: "12px",

    padding: "25px",

    boxShadow:
        "0 20px 50px rgba(0,0,0,0.2)"

};


const closeButtonStyle = {

    border: "none",

    background: "#f1f5f9",

    borderRadius: "6px",

    padding: "7px 10px",

    cursor: "pointer"

};


// =====================================================
// FORM
// =====================================================

const labelStyle = {

    display: "block",

    marginTop: "14px",

    marginBottom: "6px",

    fontWeight: "600",

    color: "#334155"

};


const inputStyle = {

    width: "100%",

    padding: "10px",

    border: "1px solid #cbd5e1",

    borderRadius: "7px",

    boxSizing: "border-box",

    outline: "none"

};


const cancelButtonStyle = {

    padding: "10px 16px",

    border: "1px solid #cbd5e1",

    background: "#fff",

    borderRadius: "7px",

    cursor: "pointer"

};


const saveButtonStyle = {

    padding: "10px 16px",

    border: "none",

    background: "#2563eb",

    color: "#fff",

    borderRadius: "7px",

    cursor: "pointer",

    fontWeight: "600"

};


export default Assets;