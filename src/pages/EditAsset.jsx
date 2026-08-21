import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function EditAsset() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        asset_code: "",
        asset_name: "",
        category: "",
        brand: "",
        model: "",
        serial_number: "",
        purchase_date: "",
        purchase_cost: "",
        warranty_expiry: "",
        status: "",
        condition_status: "",
        location: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    // =========================================
    // LOAD ASSET
    // =========================================

    const loadAsset = async () => {

        try {

            setLoading(true);

            const response =
                await API.get(`/assets/${id}`);

            console.log(
                "Asset Details:",
                response.data
            );

            const asset =
                response.data.data || response.data;

            setFormData({
                asset_code:
                    asset.asset_code || "",

                asset_name:
                    asset.asset_name || "",

                category:
                    asset.category || asset.category_name || "",

                brand:
                    asset.brand || "",

                model:
                    asset.model || "",

                serial_number:
                    asset.serial_number || "",

                purchase_date:
                    asset.purchase_date
                        ? asset.purchase_date.substring(0, 10)
                        : "",

                purchase_cost:
                    asset.purchase_cost ||
                    asset.cost ||
                    "",

                warranty_expiry:
                    asset.warranty_expiry
                        ? asset.warranty_expiry.substring(0, 10)
                        : "",

                status:
                    asset.status || "In Stock",

                condition_status:
                    asset.condition_status || "",

                location:
                    asset.location || ""
            });

        } catch (error) {

            console.error(
                "Load Asset Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load asset"
            );

            navigate("/assets");

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        if (id) {
            loadAsset();
        }

    }, [id]);


    // =========================================
    // INPUT CHANGE
    // =========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // =========================================
    // UPDATE ASSET
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            await API.put(
                `/assets/${id}`,
                formData
            );

            alert(
                "Asset updated successfully"
            );

            navigate("/assets");

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


    // =========================================
    // LOADING
    // =========================================

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
                        flex: 1
                    }}
                >

                    <Navbar />

                    <div
                        style={{
                            padding: "30px"
                        }}
                    >

                        <h2>
                            Loading Asset...
                        </h2>

                    </div>

                </div>

            </div>

        );

    }


    // =========================================
    // PAGE
    // =========================================

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

                    {/* ================================= */}
                    {/* HEADER */}
                    {/* ================================= */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "25px"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    margin: 0
                                }}
                            >
                                Edit Asset
                            </h1>

                            <p
                                style={{
                                    marginTop: "8px",
                                    color: "#666"
                                }}
                            >
                                Update hardware asset details
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/assets")
                            }
                            style={{
                                padding: "10px 18px",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                background: "#fff",
                                cursor: "pointer"
                            }}
                        >
                            Back
                        </button>

                    </div>


                    {/* ================================= */}
                    {/* FORM */}
                    {/* ================================= */}

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            background: "#fff",
                            padding: "25px",
                            borderRadius: "10px",
                            boxShadow:
                                "0 2px 6px rgba(0,0,0,0.1)",
                            maxWidth: "1000px"
                        }}
                    >

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, minmax(0, 1fr))",
                                gap: "20px"
                            }}
                        >

                            {/* Asset Code */}

                            <div>

                                <label>
                                    Asset Code
                                </label>

                                <input
                                    type="text"
                                    name="asset_code"
                                    value={
                                        formData.asset_code
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                />

                            </div>


                            {/* Asset Name */}

                            <div>

                                <label>
                                    Asset Name
                                </label>

                                <input
                                    type="text"
                                    name="asset_name"
                                    value={
                                        formData.asset_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                    required
                                />

                            </div>


                            {/* Category */}

                            <div>

                                <label>
                                    Category
                                </label>

                                <input
                                    type="text"
                                    name="category"
                                    value={
                                        formData.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                />

                            </div>


                            {/* Brand */}

                            <div>

                                <label>
                                    Brand
                                </label>

                                <input
                                    type="text"
                                    name="brand"
                                    value={
                                        formData.brand
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                />

                            </div>


                            {/* Model */}

                            <div>

                                <label>
                                    Model
                                </label>

                                <input
                                    type="text"
                                    name="model"
                                    value={
                                        formData.model
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                />

                            </div>


                            {/* Serial Number */}

                            <div>

                                <label>
                                    Serial Number
                                </label>

                                <input
                                    type="text"
                                    name="serial_number"
                                    value={
                                        formData.serial_number
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                />

                            </div>


                            {/* Purchase Date */}

                            <div>

                                <label>
                                    Purchase Date
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


                            {/* Purchase Cost */}

                            <div>

                                <label>
                                    Purchase Cost
                                </label>

                                <input
                                    type="number"
                                    name="purchase_cost"
                                    value={
                                        formData.purchase_cost
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                />

                            </div>


                            {/* Warranty */}

                            <div>

                                <label>
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


                            {/* Status */}

                            <div>

                                <label>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                >

                                    <option value="">
                                        Select Status
                                    </option>

                                    <option value="In Stock">
                                        In Stock
                                    </option>

                                    <option value="Assigned">
                                        Assigned
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


                            {/* Condition */}

                            <div>

                                <label>
                                    Condition
                                </label>

                                <select
                                    name="condition_status"
                                    value={
                                        formData.condition_status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                >

                                    <option value="">
                                        Select Condition
                                    </option>

                                    <option value="Good">
                                        Good
                                    </option>

                                    <option value="Fair">
                                        Fair
                                    </option>

                                    <option value="Damaged">
                                        Damaged
                                    </option>

                                </select>

                            </div>


                            {/* Location */}

                            <div>

                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={
                                        formData.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                />

                            </div>

                        </div>


                        {/* ================================= */}
                        {/* BUTTONS */}
                        {/* ================================= */}

                        <div
                            style={{
                                marginTop: "30px",
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px"
                            }}
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/assets")
                                }
                                style={{
                                    padding: "11px 20px",
                                    border: "1px solid #ccc",
                                    borderRadius: "6px",
                                    background: "#fff",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    padding: "11px 20px",
                                    border: "none",
                                    borderRadius: "6px",
                                    background: "#1976d2",
                                    color: "#fff",
                                    cursor: saving
                                        ? "not-allowed"
                                        : "pointer",
                                    opacity: saving
                                        ? 0.7
                                        : 1
                                }}
                            >
                                {saving
                                    ? "Updating..."
                                    : "Update Asset"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}


const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    marginTop: "7px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px"
};


export default EditAsset;