import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";


function AddSoftware() {

    const navigate = useNavigate();

    const [vendors, setVendors] = useState([]);

    const [form, setForm] = useState({
        software_code: "",
        software_name: "",
        publisher: "",
        version: "",
        license_type: "",
        total_licenses: "",
        purchase_date: "",
        expiry_date: "",
        cost: "",
        vendor_id: "",
        status: "Active",
        description: ""
    });


    // Load Vendors
    useEffect(() => {

        const loadVendors = async () => {

            try {

                const response = await API.get("/vendors");

                setVendors(
                    response.data.data || []
                );

            } catch (error) {

                console.error(error);

                alert(
                    error.response?.data?.message ||
                    "Failed to load vendors"
                );
            }
        };

        loadVendors();

    }, []);


    // Handle Input
    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };


    // Submit
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const payload = {
                software_code: form.software_code,
                software_name: form.software_name,
                publisher: form.publisher,
                version: form.version,
                license_type: form.license_type,
                total_licenses: Number(form.total_licenses),
                purchase_date: form.purchase_date || null,
                expiry_date: form.expiry_date || null,
                cost: Number(form.cost || 0),
                vendor_id: form.vendor_id
                    ? Number(form.vendor_id)
                    : null,
                status: form.status,
                description: form.description
            };


            await API.post(
                "/software",
                payload
            );


            alert(
                "Software added successfully"
            );


            navigate("/software");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to add software"
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

                    <h1>
                        Add Software
                    </h1>

                    <p>
                        Add company software and license details
                    </p>


                    <form
                        onSubmit={handleSubmit}
                        style={{
                            background: "#fff",
                            padding: "25px",
                            borderRadius: "10px",
                            maxWidth: "700px"
                        }}
                    >


                        {/* SOFTWARE CODE */}

                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                Software Code
                            </label>

                            <br />

                            <input
                                type="text"
                                name="software_code"
                                value={form.software_code}
                                onChange={handleChange}
                                placeholder="SW-002"
                                required
                                style={{
                                    padding: "10px",
                                    width: "100%"
                                }}
                            />

                        </div>


                        {/* SOFTWARE NAME */}

                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                Software Name
                            </label>

                            <br />

                            <input
                                type="text"
                                name="software_name"
                                value={form.software_name}
                                onChange={handleChange}
                                placeholder="AutoCAD"
                                required
                                style={{
                                    padding: "10px",
                                    width: "100%"
                                }}
                            />

                        </div>


                        {/* PUBLISHER */}

                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                Publisher
                            </label>

                            <br />

                            <input
                                type="text"
                                name="publisher"
                                value={form.publisher}
                                onChange={handleChange}
                                placeholder="Autodesk"
                                style={{
                                    padding: "10px",
                                    width: "100%"
                                }}
                            />

                        </div>


                        {/* VERSION */}

                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                Version
                            </label>

                            <br />

                            <input
                                type="text"
                                name="version"
                                value={form.version}
                                onChange={handleChange}
                                placeholder="2026"
                                style={{
                                    padding: "10px",
                                    width: "100%"
                                }}
                            />

                        </div>


                        {/* LICENSE TYPE */}

                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                License Type
                            </label>

                            <br />

                            <select
                                name="license_type"
                                value={form.license_type}
                                onChange={handleChange}
                                required
                                style={{
                                    padding: "10px",
                                    width: "100%"
                                }}
                            >

                                <option value="">
                                    Select License Type
                                </option>

                                <option value="Subscription">
                                    Subscription
                                </option>

                                <option value="Perpetual">
                                    Perpetual
                                </option>

                                <option value="Trial">
                                    Trial
                                </option>

                            </select>

                        </div>


                        {/* TOTAL LICENSES */}

                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                Total Licenses
                            </label>

                            <br />

                            <input
                                type="number"
                                name="total_licenses"
                                value={form.total_licenses}
                                onChange={handleChange}
                                min="1"
                                required
                                style={{
                                    padding: "10px",
                                    width: "100%"
                                }}
                            />

                        </div>


                        {/* PURCHASE DATE */}

                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                Purchase Date
                            </label>

                            <br />

                            <input
                                type="date"
                                name="purchase_date"
                                value={form.purchase_date}
                                onChange={handleChange}
                                style={{
                                    padding: "10px",
                                    width: "100%"
                                }}
                            />

                        </div>


                        {/* EXPIRY DATE */}

                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                Expiry Date
                            </label>

                            <br />

                            <input
                                type="date"
                                name="expiry_date"
                                value={form.expiry_date}
                                onChange={handleChange}
                                style={{
                                    padding: "10px",
                                    width: "100%"
                                }}
                            />

                        </div>


                        {/* COST */}

                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                Cost
                            </label>

                            <br />

                            <input
                                type="number"
                                name="cost"
                                value={form.cost}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="250000"
                                style={{
                                    padding: "10px",
                                    width: "100%"
                                }}
                            />

                        </div>


                        {/* VENDOR */}

                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                Vendor
                            </label>

                            <br />

                            <select
                                name="vendor_id"
                                value={form.vendor_id}
                                onChange={handleChange}
                                style={{
                                    padding: "10px",
                                    width: "100%"
                                }}
                            >

                                <option value="">
                                    Select Vendor
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


                        {/* STATUS */}

                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                Status
                            </label>

                            <br />

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                style={{
                                    padding: "10px",
                                    width: "100%"
                                }}
                            >

                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>


                        {/* DESCRIPTION */}

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >

                            <label>
                                Description
                            </label>

                            <br />

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Software license details"
                                rows="4"
                                style={{
                                    padding: "10px",
                                    width: "100%"
                                }}
                            />

                        </div>


                        {/* BUTTONS */}

                        <div
                            style={{
                                display: "flex",
                                gap: "10px"
                            }}
                        >

                            <button
                                type="submit"
                            >
                                Add Software
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/software")
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}


export default AddSoftware;