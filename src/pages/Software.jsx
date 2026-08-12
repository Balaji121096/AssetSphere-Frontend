import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Software() {

    const navigate = useNavigate();

    const [software, setSoftware] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);


    const loadSoftware = async () => {

        try {

            setLoading(true);

            const response = await API.get("/software");

            setSoftware(
                response.data.data || []
            );

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

    }, []);


    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this software?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await API.delete(
                `/software/${id}`
            );

            alert(
                "Software deleted successfully"
            );

            loadSoftware();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete software"
            );

        }
    };


    const getExpiryStatus = (days) => {

        if (days === null || days === undefined) {

            return {
                text: "No Expiry",
                symbol: "⚪"
            };

        }


        const remaining = Number(days);


        if (remaining < 0) {

            return {
                text: "Expired",
                symbol: "⚫"
            };

        }


        if (remaining <= 10) {

            return {
                text: "Critical",
                symbol: "🔴"
            };

        }


        if (remaining <= 20) {

            return {
                text: "10-20 Days",
                symbol: "🟠"
            };

        }


        if (remaining <= 30) {

            return {
                text: "20-30 Days",
                symbol: "🟡"
            };

        }


        return {
            text: "Active",
            symbol: "🟢"
        };

    };


    const filteredSoftware = software.filter(
        (item) => {

            const text = `
                ${item.software_code || ""}
                ${item.software_name || ""}
                ${item.publisher || ""}
                ${item.version || ""}
                ${item.license_type || ""}
                ${item.vendor_name || ""}
                ${item.status || ""}
            `.toLowerCase();


            return text.includes(
                search.toLowerCase()
            );

        }
    );


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN"
        );

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

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    margin: 0
                                }}
                            >
                                Software Licenses
                            </h1>

                            <p>
                                Manage company software licenses
                            </p>

                        </div>


                        <div>

                            <button
                                onClick={loadSoftware}
                            >
                                Refresh
                            </button>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/software/add"
                                    )
                                }
                                style={{
                                    marginLeft: "10px"
                                }}
                            >
                                + Add Software
                            </button>

                        </div>

                    </div>


                    <div
                        style={{
                            margin: "20px 0"
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Search software..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
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
                                borderCollapse:
                                    "collapse"
                            }}
                        >

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Code
                                    </th>

                                    <th>
                                        Software
                                    </th>

                                    <th>
                                        Publisher
                                    </th>

                                    <th>
                                        Version
                                    </th>

                                    <th>
                                        License Type
                                    </th>

                                    <th>
                                        Licenses
                                    </th>

                                    <th>
                                        Purchase Date
                                    </th>

                                    <th>
                                        Expiry Date
                                    </th>

                                    <th>
                                        Days Remaining
                                    </th>

                                    <th>
                                        Cost
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="13"
                                            style={{
                                                padding: "20px",
                                                textAlign:
                                                    "center"
                                            }}
                                        >
                                            Loading...
                                        </td>

                                    </tr>

                                ) : filteredSoftware.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="13"
                                            style={{
                                                padding: "20px",
                                                textAlign:
                                                    "center"
                                            }}
                                        >
                                            No software found
                                        </td>

                                    </tr>

                                ) : (

                                    filteredSoftware.map(
                                        (item) => {

                                            const expiry =
                                                getExpiryStatus(
                                                    item.days_remaining
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        item.software_id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            item.software_id
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            item.software_code
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            item.software_name
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            item.publisher ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            item.version ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            item.license_type ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            item.total_licenses
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            formatDate(
                                                                item.purchase_date
                                                            )
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            formatDate(
                                                                item.expiry_date
                                                            )
                                                        }
                                                    </td>


                                                    <td>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    item.days_remaining
                                                                }
                                                            </strong>

                                                            <br />

                                                            <span>
                                                                {
                                                                    expiry.symbol
                                                                }{" "}
                                                                {
                                                                    expiry.text
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>
                                                        ₹{" "}
                                                        {
                                                            Number(
                                                                item.cost ||
                                                                0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            item.status
                                                        }
                                                    </td>


                                                    <td>

                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/software/edit/${item.software_id}`
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.software_id
                                                                )
                                                            }
                                                            style={{
                                                                marginLeft:
                                                                    "8px"
                                                            }}
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>

                                            );

                                        }
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


export default Software;