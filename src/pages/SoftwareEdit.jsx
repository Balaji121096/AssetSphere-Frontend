import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function SoftwareEdit() {

    const { id } = useParams();
    const navigate = useNavigate();

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

    const [loading, setLoading] = useState(true);


    // Load software
    const loadSoftware = async () => {

        try {

            setLoading(true);

            const response = await API.get(
                `/software/${id}`
            );

            // Backend returns data as OBJECT
            const data = response.data.data;

            if (!data) {

                alert("Software not found");

                navigate("/software");

                return;
            }


            setForm({
                software_code:
                    data.software_code || "",

                software_name:
                    data.software_name || "",

                publisher:
                    data.publisher || "",

                version:
                    data.version || "",

                license_type:
                    data.license_type || "",

                total_licenses:
                    data.total_licenses ?? "",

                purchase_date:
                    data.purchase_date
                        ? data.purchase_date.substring(0, 10)
                        : "",

                expiry_date:
                    data.expiry_date
                        ? data.expiry_date.substring(0, 10)
                        : "",

                cost:
                    data.cost ?? "",

                vendor_id:
                    data.vendor_id ?? "",

                status:
                    data.status || "Active",

                description:
                    data.description || ""
            });

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to load software"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadSoftware();

    }, [id]);


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await API.put(
                `/software/${id}`,
                {
                    software_code:
                        form.software_code,

                    software_name:
                        form.software_name,

                    publisher:
                        form.publisher || null,

                    version:
                        form.version || null,

                    license_type:
                        form.license_type || null,

                    total_licenses:
                        Number(form.total_licenses),

                    purchase_date:
                        form.purchase_date || null,

                    expiry_date:
                        form.expiry_date || null,

                    cost:
                        form.cost
                            ? Number(form.cost)
                            : 0,

                    vendor_id:
                        form.vendor_id
                            ? Number(form.vendor_id)
                            : null,

                    status:
                        form.status || "Active",

                    description:
                        form.description || null
                }
            );

            alert(
                "Software updated successfully"
            );

            navigate("/software");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update software"
            );

        }

    };


    if (loading) {

        return (
            <div
                style={{
                    padding: "30px"
                }}
            >
                Loading software...
            </div>
        );

    }


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
                        Edit Software
                    </h1>

                    <p>
                        Update software license details
                    </p>


                    <form
                        onSubmit={handleSubmit}
                    >


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
                                name="software_code"
                                value={
                                    form.software_code
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />

                        </div>


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
                                name="software_name"
                                value={
                                    form.software_name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />

                        </div>


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
                                name="publisher"
                                value={
                                    form.publisher
                                }
                                onChange={
                                    handleChange
                                }
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />

                        </div>


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
                                name="version"
                                value={
                                    form.version
                                }
                                onChange={
                                    handleChange
                                }
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />

                        </div>


                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                License Type
                            </label>

                            <br />

                            <input
                                name="license_type"
                                value={
                                    form.license_type
                                }
                                onChange={
                                    handleChange
                                }
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />

                        </div>


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
                                value={
                                    form.total_licenses
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />

                        </div>


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
                                value={
                                    form.purchase_date
                                }
                                onChange={
                                    handleChange
                                }
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />

                        </div>


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
                                value={
                                    form.expiry_date
                                }
                                onChange={
                                    handleChange
                                }
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />

                        </div>


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
                                value={
                                    form.cost
                                }
                                onChange={
                                    handleChange
                                }
                                step="0.01"
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />

                        </div>


                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                Vendor ID
                            </label>

                            <br />

                            <input
                                type="number"
                                name="vendor_id"
                                value={
                                    form.vendor_id
                                }
                                onChange={
                                    handleChange
                                }
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />

                        </div>


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
                                value={
                                    form.status
                                }
                                onChange={
                                    handleChange
                                }
                                style={{
                                    padding: "10px",
                                    width: "350px"
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


                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <label>
                                Description
                            </label>

                            <br />

                            <textarea
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleChange
                                }
                                rows="4"
                                style={{
                                    padding: "10px",
                                    width: "350px"
                                }}
                            />

                        </div>


                        <button
                            type="submit"
                        >
                            Update Software
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/software"
                                )
                            }
                            style={{
                                marginLeft: "10px"
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


export default SoftwareEdit;