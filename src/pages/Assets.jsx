import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Assets() {

    const navigate = useNavigate();

    const [assets, setAssets] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [loading, setLoading] = useState(true);

    const loadAssets = async () => {

        try {

            setLoading(true);

            const response = await API.get("/assets");

            setAssets(response.data.data || []);

        } catch (error) {

            console.error(error);

            alert("Failed to load assets");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadAssets();

    }, []);

    // RETURN ASSET
    const handleReturn = async (id) => {

        const confirmReturn = window.confirm(
            "Are you sure you want to return this asset?"
        );

        if (!confirmReturn) return;

        try {

            await API.put(`/assets/return/${id}`);

            alert("Asset returned successfully");

            loadAssets();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to return asset"
            );

        }

    };

    // SCRAP ASSET
    const handleScrap = async (id) => {

        const confirmScrap = window.confirm(
            "Are you sure you want to scrap this asset?"
        );

        if (!confirmScrap) return;

        try {

            await API.put(`/assets/scrap/${id}`);

            alert("Asset moved to Scrap");

            loadAssets();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to scrap asset"
            );

        }

    };

    const filteredAssets = assets.filter((asset) => {

        const text = `
            ${asset.asset_code}
            ${asset.asset_name}
            ${asset.category_name}
            ${asset.display_name}
            ${asset.vendor_name}
            ${asset.location_name}
        `.toLowerCase();

        const matchesSearch =
            text.includes(search.toLowerCase());

        const matchesStatus =
            status === "All" ||
            asset.asset_status === status;

        return matchesSearch && matchesStatus;

    });

    return (

        <div
            style={{
                display: "flex",
                background: "#f5f5f5",
                minHeight: "100vh"
            }}
        >

            <Sidebar />

            <div style={{ flex: 1 }}>

                <Navbar />

                <div style={{ padding: "25px" }}>

                    {/* HEADER */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >

                        <div>

                            <h1 style={{ margin: 0 }}>
                                Hardware Assets
                            </h1>

                            <p>
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
                                onClick={() =>
                                    navigate("/assets/add")
                                }
                            >
                                + Add Asset
                            </button>

                            <button onClick={loadAssets}>
                                Refresh
                            </button>

                        </div>

                    </div>

                    {/* SEARCH + FILTER */}

                    <div
                        style={{
                            display: "flex",
                            gap: "15px",
                            margin: "20px 0"
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            style={{
                                padding: "10px",
                                width: "300px"
                            }}
                        />

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                            style={{
                                padding: "10px"
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

                    </div>

                    {/* TABLE */}

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "10px",
                            overflow: "hidden"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse"
                            }}
                        >

                            <thead>

                                <tr>

                                    <th>Asset Code</th>
                                    <th>Asset Name</th>
                                    <th>Category</th>
                                    <th>Employee</th>
                                    <th>Vendor</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td colSpan="8">
                                            Loading...
                                        </td>

                                    </tr>

                                ) : filteredAssets.length === 0 ? (

                                    <tr>

                                        <td colSpan="8">
                                            No assets found
                                        </td>

                                    </tr>

                                ) : (

                                    filteredAssets.map((asset) => (

                                        <tr key={asset.asset_id}>

                                            <td>
                                                {asset.asset_code}
                                            </td>

                                            <td>
                                                {asset.asset_name}
                                            </td>

                                            <td>
                                                {asset.category_name}
                                            </td>

                                            <td>
                                                {asset.display_name || "-"}
                                            </td>

                                            <td>
                                                {asset.vendor_name || "-"}
                                            </td>

                                            <td>
                                                {asset.location_name || "-"}
                                            </td>

                                            <td>
                                                {asset.asset_status}
                                            </td>

                                            <td>

                                                {/* VIEW */}

                                                <button
                                                    onClick={() =>
                                                        alert(
                                                            `Asset ID: ${asset.asset_id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                {" "}

                                                {/* ASSIGN */}

                                                {asset.asset_status !== "Scrap" &&
                                                    asset.asset_status !== "Assigned" && (

                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/assets/assign/${asset.asset_id}`
                                                                )
                                                            }
                                                        >
                                                            Assign
                                                        </button>

                                                    )}

                                                {" "}

                                                {/* RETURN */}

                                                {asset.asset_status === "Assigned" && (

                                                    <button
                                                        onClick={() =>
                                                            handleReturn(
                                                                asset.asset_id
                                                            )
                                                        }
                                                    >
                                                        Return
                                                    </button>

                                                )}

                                                {" "}

                                                {/* SCRAP */}

                                                {asset.asset_status !== "Scrap" && (

                                                    <button
                                                        onClick={() =>
                                                            handleScrap(
                                                                asset.asset_id
                                                            )
                                                        }
                                                    >
                                                        Scrap
                                                    </button>

                                                )}

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Assets;