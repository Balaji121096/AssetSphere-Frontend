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

    const [refreshing, setRefreshing] =
        useState(false);

    const [viewAsset, setViewAsset] =
        useState(null);

    const [editAsset, setEditAsset] =
        useState(null);

    const [saving, setSaving] =
        useState(false);


    // =====================================================
    // LOAD ASSETS
    // =====================================================

    const loadAssets = async (showRefresh = false) => {

        try {

            if (showRefresh) {
                setRefreshing(true);
                setLoading(true);
            } else {
                setLoading(true);
            }

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
            setRefreshing(false);

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

            await loadAssets();

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

            await loadAssets();

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

            await loadAssets();

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

            await loadAssets();

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

            await loadAssets();

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
                background:
                    "var(--asset-status-assigned-bg)",
                color:
                    "var(--asset-status-assigned-color)"
            };

        }

        if (assetStatus === "In Stock") {

            return {
                background:
                    "var(--asset-status-stock-bg)",
                color:
                    "var(--asset-status-stock-color)"
            };

        }

        if (assetStatus === "Repair") {

            return {
                background:
                    "var(--asset-status-repair-bg)",
                color:
                    "var(--asset-status-repair-color)"
            };

        }

        if (assetStatus === "Scrap") {

            return {
                background:
                    "var(--asset-status-scrap-bg)",
                color:
                    "var(--asset-status-scrap-color)"
            };

        }

        if (assetStatus === "Lost") {

            return {
                background:
                    "var(--asset-status-lost-bg)",
                color:
                    "var(--asset-status-lost-color)"
            };

        }

        return {
            background:
                "var(--asset-status-default-bg)",
            color:
                "var(--asset-status-default-color)"
        };

    };


    // =====================================================
    // RETURN UI
    // =====================================================

    return (

        <div style={pageStyle}>

            <Sidebar />

            <div style={mainStyle}>

                <Navbar />

                <main style={contentStyle}>

                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div style={headerStyle}>

                        <div style={headerContentStyle}>

                            <div style={eyebrowStyle}>
                                ASSET MANAGEMENT
                            </div>

                            <h1 style={titleStyle}>
                                Hardware Assets
                            </h1>

                            <p style={subtitleStyle}>
                                Manage company hardware assets
                            </p>

                        </div>


                        <div style={headerButtonsStyle}>

                            {/* REFRESH */}

                            <button
                                type="button"
                                onClick={() =>
                                    loadAssets(true)
                                }
                                disabled={refreshing}
                                style={{
                                    ...refreshButtonStyle,

                                    opacity:
                                        refreshing
                                            ? 0.65
                                            : 1,

                                    cursor:
                                        refreshing
                                            ? "not-allowed"
                                            : "pointer"
                                }}
                            >

                                <span
                                    style={{
                                        ...refreshIconStyle,

                                        display:
                                            "inline-block",

                                        animation:
                                            refreshing
                                                ? "spin 0.8s linear infinite"
                                                : "none"
                                    }}
                                >
                                    ↻
                                </span>

                                {refreshing
                                    ? "Refreshing..."
                                    : "Refresh"}

                            </button>


                            {/* ADD */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/assets/add"
                                    )
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

                                Add Asset

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <div
                        style={{
                            ...summaryGridStyle,

                            opacity:
                                loading
                                    ? 0.55
                                    : 1,

                            transition:
                                "opacity 0.25s ease"
                        }}
                    >

                        <SummaryCard
                            title="Total Assets"
                            value={assets.length}
                            icon="▣"
                            color="var(--primary-color)"
                            background="var(--primary-light)"
                        />

                        <SummaryCard
                            title="Assigned"
                            value={
                                assets.filter(
                                    (asset) =>
                                        asset.asset_status ===
                                        "Assigned"
                                ).length
                            }
                            icon="✓"
                            color="var(--success-color)"
                            background="var(--success-light)"
                        />

                        <SummaryCard
                            title="In Stock"
                            value={
                                assets.filter(
                                    (asset) =>
                                        asset.asset_status ===
                                        "In Stock"
                                ).length
                            }
                            icon="◉"
                            color="var(--secondary-color)"
                            background="var(--secondary-light)"
                        />

                        <SummaryCard
                            title="Repair"
                            value={
                                assets.filter(
                                    (asset) =>
                                        asset.asset_status ===
                                        "Repair"
                                ).length
                            }
                            icon="!"
                            color="var(--warning-color)"
                            background="var(--warning-light)"
                        />

                    </div>


                    {/* =================================================
                        DASHBOARD FILTER
                    ================================================= */}

                    {status !== "All" && (

                        <div style={filterBannerStyle}>

                            <div>

                                <strong
                                    style={{
                                        color:
                                            "var(--primary-color)"
                                    }}
                                >
                                    Dashboard Filter:
                                </strong>

                                <span
                                    style={{
                                        marginLeft:
                                            "8px",
                                        color:
                                            "var(--text-color)"
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
                                style={
                                    clearFilterButtonStyle
                                }
                            >
                                Clear Filter
                            </button>

                        </div>

                    )}


                    {/* =================================================
                        TABLE CARD
                    ================================================= */}

                    <div
                        style={{
                            ...tableCardStyle,

                            opacity:
                                loading
                                    ? 0.72
                                    : 1,

                            transition:
                                "opacity 0.2s ease"
                        }}
                    >

                        <div style={tableTopStyle}>

                            <div>

                                <h2
                                    style={
                                        tableTitleStyle
                                    }
                                >
                                    Hardware Asset Directory
                                </h2>

                                <p
                                    style={
                                        tableSubtitleStyle
                                    }
                                >
                                    {filteredAssets.length} asset
                                    {filteredAssets.length !== 1
                                        ? "s"
                                        : ""} found
                                </p>

                            </div>


                            {/* SEARCH */}

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
                                    placeholder="Search assets..."
                                    value={search}
                                    onChange={(e) =>
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
                                            setSearch("")
                                        }
                                        style={
                                            clearButtonStyle
                                        }
                                    >
                                        ×
                                    </button>

                                )}

                            </div>


                            {/* STATUS */}

                            <select
                                value={status}
                                onChange={(e) =>
                                    handleStatusChange(
                                        e.target.value
                                    )
                                }
                                style={
                                    filterSelectStyle
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
                                            Asset
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
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {loading ? (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                style={
                                                    loadingCellStyle
                                                }
                                            >

                                                <div
                                                    style={
                                                        fullLoaderStyle
                                                    }
                                                >

                                                    <div
                                                        style={
                                                            largeSpinnerStyle
                                                        }
                                                    />

                                                    <div
                                                        style={
                                                            loadingTitleStyle
                                                        }
                                                    >
                                                        {refreshing
                                                            ? "Refreshing assets..."
                                                            : "Loading assets..."}
                                                    </div>

                                                    <div
                                                        style={
                                                            loadingSubtitleStyle
                                                        }
                                                    >
                                                        Please wait while we
                                                        fetch the latest data
                                                    </div>

                                                </div>

                                            </td>

                                        </tr>

                                    ) : filteredAssets.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                style={
                                                    emptyStyle
                                                }
                                            >

                                                <div
                                                    style={
                                                        emptyIconStyle
                                                    }
                                                >
                                                    ▣
                                                </div>

                                                <strong
                                                    style={{
                                                        color:
                                                            "var(--text-color)"
                                                    }}
                                                >
                                                    No assets found
                                                </strong>

                                                <p
                                                    style={{
                                                        margin:
                                                            "6px 0 0",
                                                        color:
                                                            "var(--muted-text-color)"
                                                    }}
                                                >
                                                    Try changing your
                                                    search or filter
                                                </p>

                                            </td>

                                        </tr>

                                    ) : (

                                        filteredAssets.map(
                                            (asset) => (

                                                <tr
                                                    key={
                                                        asset.asset_id
                                                    }
                                                    style={
                                                        rowStyle
                                                    }
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background =
                                                            "var(--table-row-hover)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background =
                                                            "var(--card-background)";
                                                    }}
                                                >

                                                    {/* ASSET */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                assetCellStyle
                                                            }
                                                        >

                                                            <div
                                                                style={
                                                                    assetIconStyle
                                                                }
                                                            >
                                                                ▣
                                                            </div>

                                                            <div>

                                                                <div
                                                                    style={
                                                                        assetNameStyle
                                                                    }
                                                                >
                                                                    {
                                                                        asset.asset_name ||
                                                                        "-"
                                                                    }
                                                                </div>

                                                                <div
                                                                    style={
                                                                        assetCodeStyle
                                                                    }
                                                                >
                                                                    {
                                                                        asset.asset_code ||
                                                                        "-"
                                                                    }
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* CATEGORY */}

                                                    <td style={tdStyle}>
                                                        {
                                                            asset.category_name ||
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* EMPLOYEE */}

                                                    <td style={tdStyle}>

                                                        <div
                                                            style={
                                                                employeeTextStyle
                                                            }
                                                        >
                                                            {
                                                                asset.display_name ||
                                                                "Unassigned"
                                                            }
                                                        </div>

                                                    </td>


                                                    {/* VENDOR */}

                                                    <td style={tdStyle}>
                                                        {
                                                            asset.vendor_name ||
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* LOCATION */}

                                                    <td style={tdStyle}>

                                                        <span
                                                            style={
                                                                locationStyle
                                                            }
                                                        >
                                                            📍{" "}
                                                            {
                                                                asset.location_name ||
                                                                "-"
                                                            }
                                                        </span>

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


                                                    {/* ACTIONS */}

                                                    <td
                                                        style={{
                                                            ...tdStyle,
                                                            textAlign:
                                                                "center"
                                                        }}
                                                    >

                                                        <div
                                                            style={
                                                                actionStyle
                                                            }
                                                        >

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


                                                            <button
                                                                type="button"
                                                                title="Edit Asset"
                                                                aria-label="Edit Asset"
                                                                onClick={() =>
                                                                    setEditAsset({
                                                                        ...asset
                                                                    })
                                                                }
                                                                style={
                                                                    iconEditButtonStyle
                                                                }
                                                            >
                                                                ✏
                                                            </button>


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

                </main>

            </div>


            {/* =====================================================
                VIEW MODAL
            ===================================================== */}

            {viewAsset && (

                <div style={overlayStyle}>

                    <div style={modalStyle}>

                        <div style={modalHeaderStyle}>

                            <div>

                                <div
                                    style={
                                        modalEyebrowStyle
                                    }
                                >
                                    ASSET INFORMATION
                                </div>

                                <h2
                                    style={
                                        modalTitleStyle
                                    }
                                >
                                    Asset Details
                                </h2>

                            </div>

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


                        <div
                            style={
                                detailGridStyle
                            }
                        >

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
                            style={
                                modalHeaderStyle
                            }
                        >

                            <div>

                                <div
                                    style={
                                        modalEyebrowStyle
                                    }
                                >
                                    ASSET MANAGEMENT
                                </div>

                                <h2
                                    style={
                                        modalTitleStyle
                                    }
                                >
                                    Edit Asset
                                </h2>

                            </div>

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
                                style={
                                    formActionsStyle
                                }
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
                                    style={{
                                        ...saveButtonStyle,
                                        opacity:
                                            saving
                                                ? 0.7
                                                : 1
                                    }}
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

            <div>

                <div style={summaryTitleStyle}>
                    {title}
                </div>

                <div style={summaryValueStyle}>
                    {value}
                </div>

            </div>

        </div>

    );

}


// =====================================================
// DETAIL
// =====================================================

function Detail({
    label,
    value
}) {

    return (

        <div style={detailStyle}>

            <span style={detailLabelStyle}>
                {label}
            </span>

            <strong style={detailValueStyle}>
                {value || "-"}
            </strong>

        </div>

    );

}


// =====================================================
// PAGE
// =====================================================

const pageStyle = {

    display: "flex",

    minHeight: "100vh",

    background:
        "var(--app-background)",

    color:
        "var(--text-color)"

};


const mainStyle = {

    flex: 1,

    minWidth: 0

};


const contentStyle = {

    width: "100%",

    maxWidth: "1500px",

    margin: "0 auto",

    padding: "30px",

    boxSizing: "border-box"

};


// =====================================================
// HEADER
// =====================================================

const headerStyle = {

    width: "100%",

    minHeight: "116px",

    padding: "22px 24px",

    boxSizing: "border-box",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "20px",

    flexWrap: "wrap",

    marginBottom: "25px",

    borderRadius: "15px",

    background:
        "linear-gradient(135deg, var(--sidebar-color) 0%, var(--sidebar-color) 45%, var(--primary-color) 100%)",

    boxShadow:
        "0 10px 30px rgba(15,23,42,0.16)",

    position: "relative",

    overflow: "hidden"

};


const headerContentStyle = {

    position: "relative",

    zIndex: 1

};


const eyebrowStyle = {

    color: "#93c5fd",

    fontSize: "10px",

    fontWeight: "700",

    letterSpacing: "1.7px",

    marginBottom: "7px",

    textTransform: "uppercase"

};


const titleStyle = {

    margin: 0,

    fontSize: "28px",

    lineHeight: "1.2",

    fontWeight: "800",

    letterSpacing: "-0.7px",

    color: "#ffffff"

};


const subtitleStyle = {

    margin: "6px 0 0",

    color: "#cbd5e1",

    fontSize: "12px",

    lineHeight: "1.5"

};


const headerButtonsStyle = {

    display: "flex",

    alignItems: "center",

    gap: "9px",

    flexWrap: "wrap",

    position: "relative",

    zIndex: 1

};


// =====================================================
// HEADER BUTTONS
// =====================================================

const refreshButtonStyle = {

    height: "42px",

    padding: "0 15px",

    border:
        "1px solid rgba(255,255,255,0.25)",

    borderRadius: "9px",

    background:
        "rgba(255,255,255,0.12)",

    color: "#ffffff",

    fontSize: "12px",

    fontWeight: "600",

    cursor: "pointer",

    backdropFilter: "blur(8px)",

    WebkitBackdropFilter: "blur(8px)",

    transition: "all 0.2s ease"

};


const refreshIconStyle = {

    fontSize: "17px",

    marginRight: "6px",

    verticalAlign: "middle"

};


const addButtonStyle = {

    height: "42px",

    padding: "0 17px",

    border:
        "1px solid rgba(255,255,255,0.18)",

    borderRadius: "9px",

    background: "#ffffff",

    color:
        "var(--primary-color)",

    fontSize: "12px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
        "0 4px 10px rgba(0,0,0,0.12)"

};


const plusStyle = {

    fontSize: "17px",

    marginRight: "5px"

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

    background:
        "var(--card-background)",

    border:
        "1px solid var(--border-color)",

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

    fontSize: "18px",

    fontWeight: "700"

};


const summaryTitleStyle = {

    color:
        "var(--muted-text-color)",

    fontSize: "12px",

    marginBottom: "4px"

};


const summaryValueStyle = {

    fontSize: "24px",

    fontWeight: "750",

    color:
        "var(--text-color)"

};


// =====================================================
// FILTER
// =====================================================

const filterBannerStyle = {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "15px",

    background:
        "var(--primary-light)",

    border:
        "1px solid var(--primary-border)",

    padding: "12px 15px",

    borderRadius: "9px",

    marginBottom: "18px",

    color:
        "var(--text-color)"

};


const clearFilterButtonStyle = {

    border: "none",

    background:
        "var(--primary-color)",

    color: "#ffffff",

    padding: "7px 12px",

    borderRadius: "7px",

    cursor: "pointer",

    fontSize: "12px",

    fontWeight: "600"

};


// =====================================================
// TABLE CARD
// =====================================================

const tableCardStyle = {

    background:
        "var(--card-background)",

    border:
        "1px solid var(--border-color)",

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

    gap: "15px",

    flexWrap: "wrap",

    borderBottom:
        "1px solid var(--border-color)"

};


const tableTitleStyle = {

    margin: 0,

    fontSize: "17px",

    fontWeight: "700",

    color:
        "var(--text-color)"

};


const tableSubtitleStyle = {

    margin: "5px 0 0",

    color:
        "var(--muted-text-color)",

    fontSize: "12px"

};


// =====================================================
// SEARCH
// =====================================================

const searchWrapperStyle = {

    width: "300px",

    maxWidth: "100%",

    height: "42px",

    display: "flex",

    alignItems: "center",

    background:
        "var(--input-background)",

    border:
        "1px solid var(--border-color)",

    borderRadius: "9px",

    padding: "0 11px",

    boxSizing: "border-box"

};


const searchIconStyle = {

    color:
        "var(--muted-text-color)",

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

    color:
        "var(--text-color)"

};


const clearButtonStyle = {

    border: "none",

    background: "transparent",

    color:
        "var(--muted-text-color)",

    fontSize: "19px",

    cursor: "pointer"

};


const filterSelectStyle = {

    height: "42px",

    padding: "0 12px",

    border:
        "1px solid var(--border-color)",

    borderRadius: "9px",

    background:
        "var(--card-background)",

    color:
        "var(--text-color)",

    fontSize: "13px",

    outline: "none",

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

    minWidth: "1100px",

    borderCollapse: "collapse"

};


const thStyle = {

    padding: "13px 16px",

    textAlign: "left",

    background:
        "var(--table-header-background)",

    color:
        "var(--muted-text-color)",

    fontSize: "11px",

    fontWeight: "700",

    textTransform: "uppercase",

    letterSpacing: "0.5px",

    borderBottom:
        "1px solid var(--border-color)",

    whiteSpace: "nowrap"

};


const tdStyle = {

    padding: "14px 16px",

    color:
        "var(--secondary-text-color)",

    fontSize: "13px",

    borderBottom:
        "1px solid var(--border-color)",

    verticalAlign: "middle"

};


const rowStyle = {

    background:
        "var(--card-background)",

    transition: "background 0.15s"

};


// =====================================================
// ASSET CELL
// =====================================================

const assetCellStyle = {

    display: "flex",

    alignItems: "center",

    gap: "10px"

};


const assetIconStyle = {

    width: "36px",

    height: "36px",

    borderRadius: "10px",

    background:
        "var(--primary-light)",

    color:
        "var(--primary-color)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "15px",

    fontWeight: "700",

    flexShrink: 0

};


const assetNameStyle = {

    color:
        "var(--text-color)",

    fontSize: "13px",

    fontWeight: "650"

};


const assetCodeStyle = {

    color:
        "var(--muted-text-color)",

    fontSize: "11px",

    marginTop: "3px"

};


const employeeTextStyle = {

    color:
        "var(--secondary-text-color)",

    fontWeight: "500"

};


const locationStyle = {

    color:
        "var(--secondary-text-color)",

    fontSize: "12px"

};


// =====================================================
// STATUS
// =====================================================

const statusSelectStyle = {

    padding: "5px 9px",

    border: "none",

    borderRadius: "20px",

    fontSize: "11px",

    fontWeight: "650",

    cursor: "pointer",

    outline: "none"

};


// =====================================================
// ACTIONS
// =====================================================

const actionStyle = {

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    gap: "5px",

    flexWrap: "nowrap"

};


const iconBaseStyle = {

    width: "32px",

    height: "32px",

    padding: 0,

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "7px",

    cursor: "pointer",

    fontSize: "14px",

    lineHeight: 1,

    flexShrink: 0

};


const iconViewButtonStyle = {

    ...iconBaseStyle,

    border:
        "1px solid var(--border-color)",

    background:
        "var(--card-background)",

    color:
        "var(--secondary-text-color)"

};


const iconEditButtonStyle = {

    ...iconBaseStyle,

    border:
        "1px solid var(--primary-border)",

    background:
        "var(--primary-light)",

    color:
        "var(--primary-color)"

};


const iconDeleteButtonStyle = {

    ...iconBaseStyle,

    border:
        "1px solid var(--danger-border)",

    background:
        "var(--danger-light)",

    color:
        "var(--danger-color)"

};


const iconAssignButtonStyle = {

    ...iconBaseStyle,

    border:
        "1px solid var(--primary-border)",

    background:
        "var(--primary-light)",

    color:
        "var(--primary-color)"

};


const iconReturnButtonStyle = {

    ...iconBaseStyle,

    border:
        "1px solid var(--success-border)",

    background:
        "var(--success-light)",

    color:
        "var(--success-color)"

};


const iconScrapButtonStyle = {

    ...iconBaseStyle,

    border:
        "1px solid var(--danger-border)",

    background:
        "var(--danger-light)",

    color:
        "var(--danger-color)"

};


// =====================================================
// LOADING
// =====================================================

const loadingCellStyle = {

    padding: 0,

    height: "300px",

    textAlign: "center",

    color:
        "var(--secondary-text-color)"

};


const fullLoaderStyle = {

    minHeight: "300px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    animation:
        "fadeIn 0.2s ease"

};


const largeSpinnerStyle = {

    width: "36px",

    height: "36px",

    border:
        "4px solid var(--primary-light)",

    borderTop:
        "4px solid var(--primary-color)",

    borderRight:
        "4px solid var(--primary-color)",

    borderRadius: "50%",

    animation:
        "spin 0.8s linear infinite",

    marginBottom: "16px"

};


const loadingTitleStyle = {

    color:
        "var(--text-color)",

    fontSize: "14px",

    fontWeight: "600",

    marginBottom: "5px"

};


const loadingSubtitleStyle = {

    color:
        "var(--muted-text-color)",

    fontSize: "12px"

};


const emptyStyle = {

    padding: "55px 20px",

    textAlign: "center",

    color:
        "var(--secondary-text-color)",

    fontSize: "13px"

};


const emptyIconStyle = {

    fontSize: "32px",

    marginBottom: "10px",

    opacity: 0.6,

    color:
        "var(--primary-color)"

};


// =====================================================
// MODAL
// =====================================================

const overlayStyle = {

    position: "fixed",

    inset: 0,

    background:
        "rgba(15,23,42,0.55)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    zIndex: 1000,

    padding: "20px"

};


const modalStyle = {

    background:
        "var(--card-background)",

    width: "100%",

    maxWidth: "550px",

    maxHeight: "90vh",

    overflowY: "auto",

    borderRadius: "14px",

    padding: "25px",

    boxShadow:
        "0 20px 50px rgba(0,0,0,0.25)",

    color:
        "var(--text-color)"

};


const modalHeaderStyle = {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "20px"

};


const modalEyebrowStyle = {

    color:
        "var(--primary-color)",

    fontSize: "10px",

    fontWeight: "700",

    letterSpacing: "1.2px",

    marginBottom: "4px"

};


const modalTitleStyle = {

    margin: 0,

    fontSize: "20px",

    color:
        "var(--text-color)"

};


const closeButtonStyle = {

    border: "none",

    background:
        "var(--input-background)",

    color:
        "var(--secondary-text-color)",

    borderRadius: "7px",

    width: "34px",

    height: "34px",

    cursor: "pointer",

    fontSize: "14px"

};


// =====================================================
// DETAIL
// =====================================================

const detailGridStyle = {

    display: "grid",

    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",

    gap: "10px 15px"

};


const detailStyle = {

    display: "flex",

    flexDirection: "column",

    gap: "5px",

    padding: "12px",

    background:
        "var(--input-background)",

    borderRadius: "8px"

};


const detailLabelStyle = {

    color:
        "var(--muted-text-color)",

    fontSize: "11px",

    fontWeight: "600"

};


const detailValueStyle = {

    color:
        "var(--secondary-text-color)",

    fontSize: "13px"

};


// =====================================================
// FORM
// =====================================================

const labelStyle = {

    display: "block",

    marginTop: "14px",

    marginBottom: "6px",

    fontWeight: "600",

    color:
        "var(--secondary-text-color)",

    fontSize: "13px"

};


const inputStyle = {

    width: "100%",

    padding: "10px",

    border:
        "1px solid var(--border-color)",

    borderRadius: "8px",

    boxSizing: "border-box",

    outline: "none",

    fontSize: "13px",

    background:
        "var(--input-background)",

    color:
        "var(--text-color)"

};


const formActionsStyle = {

    display: "flex",

    justifyContent: "flex-end",

    gap: "10px",

    marginTop: "20px"

};


const cancelButtonStyle = {

    padding: "10px 16px",

    border:
        "1px solid var(--border-color)",

    background:
        "var(--card-background)",

    color:
        "var(--secondary-text-color)",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "600"

};


const saveButtonStyle = {

    padding: "10px 16px",

    border: "none",

    background:
        "var(--primary-color)",

    color: "#ffffff",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "600"

};


// =====================================================
// ANIMATION + THEME FALLBACKS
// =====================================================

if (
    typeof document !== "undefined" &&
    !document.getElementById("assets-page-animation")
) {

    const style =
        document.createElement("style");

    style.id =
        "assets-page-animation";

    style.innerHTML = `

        :root {

            --app-background: #f8fafc;
            --card-background: #ffffff;
            --input-background: #f8fafc;

            --text-color: #0f172a;
            --secondary-text-color: #475569;
            --muted-text-color: #94a3b8;

            --border-color: #e5eaf0;

            --table-header-background: #f8fafc;
            --table-row-hover: #f8fafc;

            --primary-color: #2563eb;
            --primary-light: #eff6ff;
            --primary-border: #bfdbfe;

            --secondary-color: #7c3aed;
            --secondary-light: #f5f3ff;

            --success-color: #16a34a;
            --success-light: #f0fdf4;
            --success-border: #bbf7d0;

            --warning-color: #d97706;
            --warning-light: #fffbeb;
            --warning-border: #fde68a;

            --danger-color: #b91c1c;
            --danger-light: #fef2f2;
            --danger-border: #fecaca;

            --asset-status-assigned-bg: #dbeafe;
            --asset-status-assigned-color: #1d4ed8;

            --asset-status-stock-bg: #dcfce7;
            --asset-status-stock-color: #166534;

            --asset-status-repair-bg: #fef3c7;
            --asset-status-repair-color: #92400e;

            --asset-status-scrap-bg: #fee2e2;
            --asset-status-scrap-color: #991b1b;

            --asset-status-lost-bg: #f3e8ff;
            --asset-status-lost-color: #7e22ce;

            --asset-status-default-bg: #f1f5f9;
            --asset-status-default-color: #475569;

        }


        @keyframes spin {

            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }

        }


        @keyframes fadeIn {

            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }

        }


        .assets-header-button:hover {
            background: rgba(255,255,255,0.18);
        }


        .assets-add-button:hover {
            background: var(--primary-light);
        }


        @media (max-width: 900px) {

            .assets-summary-grid {
                grid-template-columns:
                    repeat(2, minmax(0, 1fr)) !important;
            }

        }


        @media (max-width: 600px) {

            .assets-summary-grid {
                grid-template-columns:
                    1fr !important;
            }

            .assets-content {
                padding: 18px !important;
            }

            .assets-detail-grid {
                grid-template-columns:
                    1fr !important;
            }

        }

    `;

    document.head.appendChild(style);

}


// =====================================================
// EXPORT
// =====================================================

export default Assets;