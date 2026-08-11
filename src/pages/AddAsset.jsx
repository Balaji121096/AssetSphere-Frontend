import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function AddAsset() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [locations, setLocations] = useState([]);

    const [form, setForm] = useState({
        asset_code: "",
        asset_name: "",
        brand: "",
        model: "",
        serial_number: "",
        category_id: "",
        vendor_id: "",
        location_id: ""
    });

    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                const [categoryRes, vendorRes, locationRes] =
                    await Promise.all([
                        API.get("/categories"),
                        API.get("/vendors"),
                        API.get("/locations")
                    ]);

                setCategories(categoryRes.data.data || []);
                setVendors(vendorRes.data.data || []);
                setLocations(locationRes.data.data || []);

            } catch (error) {
                console.error(error);
                alert("Failed to load category/vendor/location data");
            }
        };

        loadDropdownData();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/assets", {
                ...form,
                category_id: Number(form.category_id),
                vendor_id: Number(form.vendor_id),
                location_id: Number(form.location_id)
            });

            alert("Asset added successfully");

            navigate("/assets");

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to add asset"
            );
        }
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

            <div style={{ flex: 1 }}>
                <Navbar />

                <div style={{ padding: "25px" }}>
                    <h1>Add Hardware Asset</h1>
                    <p>Add a new company hardware asset</p>

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            background: "#fff",
                            padding: "25px",
                            borderRadius: "10px",
                            maxWidth: "500px"
                        }}
                    >

                        <div style={{ marginBottom: "15px" }}>
                            <label>Asset Code</label>
                            <br />
                            <input
                                name="asset_code"
                                value={form.asset_code}
                                onChange={handleChange}
                                required
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Asset Name</label>
                            <br />
                            <input
                                name="asset_name"
                                value={form.asset_name}
                                onChange={handleChange}
                                required
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Brand</label>
                            <br />
                            <input
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                required
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Model</label>
                            <br />
                            <input
                                name="model"
                                value={form.model}
                                onChange={handleChange}
                                required
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Serial Number</label>
                            <br />
                            <input
                                name="serial_number"
                                value={form.serial_number}
                                onChange={handleChange}
                                required
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Category</label>
                            <br />

                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                required
                                style={{
                                    padding: "10px",
                                    width: "375px"
                                }}
                            >
                                <option value="">
                                    Select Category
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category.category_id}
                                        value={category.category_id}
                                    >
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Vendor</label>
                            <br />

                            <select
                                name="vendor_id"
                                value={form.vendor_id}
                                onChange={handleChange}
                                required
                                style={{
                                    padding: "10px",
                                    width: "375px"
                                }}
                            >
                                <option value="">
                                    Select Vendor
                                </option>

                                {vendors.map((vendor) => (
                                    <option
                                        key={vendor.vendor_id}
                                        value={vendor.vendor_id}
                                    >
                                        {vendor.vendor_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Location</label>
                            <br />

                            <select
                                name="location_id"
                                value={form.location_id}
                                onChange={handleChange}
                                required
                                style={{
                                    padding: "10px",
                                    width: "375px"
                                }}
                            >
                                <option value="">
                                    Select Location
                                </option>

                                {locations.map((location) => (
                                    <option
                                        key={location.location_id}
                                        value={location.location_id}
                                    >
                                        {location.location_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label>Status</label>
                            <br />

                            <input
                                value="In Stock"
                                disabled
                                style={{
                                    padding: "10px",
                                    width: "350px",
                                    background: "#eee"
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: "10px 20px",
                                cursor: "pointer"
                            }}
                        >
                            Add Asset
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/assets")}
                            style={{
                                padding: "10px 20px",
                                marginLeft: "10px",
                                cursor: "pointer"
                            }}
                        >
                            Cancel
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddAsset;