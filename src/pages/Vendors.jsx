import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Vendors() {
    const [vendors, setVendors] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const loadVendors = async () => {
        try {
            setLoading(true);

            const response = await API.get("/vendors");

            console.log("Vendors API Response:", response.data);

            setVendors(response.data.data || []);

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to load vendors"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVendors();
    }, []);

    const filteredVendors = vendors.filter((vendor) => {
        const text = `
            ${vendor.vendor_id || ""}
            ${vendor.vendor_code || ""}
            ${vendor.vendor_name || ""}
            ${vendor.contact_person || ""}
            ${vendor.email || ""}
            ${vendor.phone || ""}
            ${vendor.mobile_number || ""}
            ${vendor.address || ""}
            ${vendor.status || ""}
        `.toLowerCase();

        return text.includes(search.toLowerCase());
    });

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

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <div>
                            <h1 style={{ margin: 0 }}>
                                Vendors
                            </h1>

                            <p>
                                Manage asset vendors
                            </p>
                        </div>

                        <button onClick={loadVendors}>
                            Refresh
                        </button>
                    </div>

                    <div style={{ margin: "20px 0" }}>
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            style={{
                                padding: "10px",
                                width: "320px",
                                border: "1px solid #ccc",
                                borderRadius: "6px"
                            }}
                        />
                    </div>

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "10px",
                            overflow: "auto"
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
                                    <th>ID</th>
                                    <th>Vendor Code</th>
                                    <th>Vendor Name</th>
                                    <th>Contact Person</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            style={{
                                                padding: "20px",
                                                textAlign: "center"
                                            }}
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                ) : filteredVendors.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            style={{
                                                padding: "20px",
                                                textAlign: "center"
                                            }}
                                        >
                                            No vendors found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVendors.map(
                                        (vendor) => (
                                            <tr
                                                key={
                                                    vendor.vendor_id
                                                }
                                            >
                                                <td>
                                                    {
                                                        vendor.vendor_id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        vendor.vendor_code ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        vendor.vendor_name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        vendor.contact_person ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        vendor.email ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        vendor.phone ||
                                                        vendor.mobile_number ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        vendor.status ||
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

export default Vendors;