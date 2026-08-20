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


    // =================================
    // LOAD SOFTWARE
    // =================================

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


    // =================================
    // DELETE SOFTWARE
    // =================================

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


    // =================================
    // EXPIRY STATUS
    // =================================

    const getExpiryStatus = (days) => {

        if (
            days === null ||
            days === undefined
        ) {

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


    // =================================
    // SEARCH FILTER
    // =================================

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


    // =================================
    // DATE FORMAT
    // =================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN"
        );

    };


    // =================================
    // TABLE STYLES
    // =================================

    const thStyle = {
        padding: "14px 12px",
        textAlign: "left",
        whiteSpace: "nowrap",
        fontSize: "14px",
        color: "#555",
        background: "#f8f9fa",
        borderBottom: "1px solid #ddd"
    };


    const tdStyle = {
        padding: "14px 12px",
        textAlign: "left",
        whiteSpace: "nowrap",
        fontSize: "14px",
        color: "#333",
        borderBottom: "1px solid #eee"
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
                            marginBottom: "20px"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "32px"
                                }}
                            >
                                Software Licenses
                            </h1>

                            <p
                                style={{
                                    marginTop: "8px",
                                    color: "#777"
                                }}
                            >
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


                    {/* ================================= */}
                    {/* SEARCH */}
                    {/* ================================= */}

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
                                borderRadius: "6px",
                                fontSize: "14px"
                            }}
                        />

                    </div>


                    {/* ================================= */}
                    {/* TABLE CONTAINER */}
                    {/* ================================= */}

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "10px",
                            overflowX: "auto",
                            overflowY: "hidden",
                            boxShadow:
                                "0 2px 5px rgba(0,0,0,0.08)"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                minWidth: "1300px",
                                borderCollapse: "collapse",
                                tableLayout: "auto"
                            }}
                        >

                            {/* ================================= */}
                            {/* TABLE HEADER */}
                            {/* ================================= */}

                            <thead>

                                <tr>

                                    <th style={thStyle}>
                                        ID
                                    </th>

                                    <th style={thStyle}>
                                        Code
                                    </th>

                                    <th style={thStyle}>
                                        Software
                                    </th>

                                    <th style={thStyle}>
                                        Publisher
                                    </th>

                                    <th style={thStyle}>
                                        Version
                                    </th>

                                    <th style={thStyle}>
                                        License Type
                                    </th>

                                    <th style={thStyle}>
                                        Licenses
                                    </th>

                                    <th style={thStyle}>
                                        Purchase Date
                                    </th>

                                    <th style={thStyle}>
                                        Expiry Date
                                    </th>

                                    <th style={thStyle}>
                                        Days Remaining
                                    </th>

                                    <th style={thStyle}>
                                        Cost
                                    </th>

                                    <th style={thStyle}>
                                        Status
                                    </th>

                                    <th style={thStyle}>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            {/* ================================= */}
                            {/* TABLE BODY */}
                            {/* ================================= */}

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="13"
                                            style={{
                                                padding: "30px",
                                                textAlign: "center"
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
                                                padding: "30px",
                                                textAlign: "center"
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

                                                    {/* ID */}

                                                    <td style={tdStyle}>
                                                        {
                                                            item.software_id
                                                        }
                                                    </td>


                                                    {/* CODE */}

                                                    <td style={tdStyle}>
                                                        {
                                                            item.software_code
                                                        }
                                                    </td>


                                                    {/* SOFTWARE */}

                                                    <td style={tdStyle}>
                                                        {
                                                            item.software_name
                                                        }
                                                    </td>


                                                    {/* PUBLISHER */}

                                                    <td style={tdStyle}>
                                                        {
                                                            item.publisher ||
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* VERSION */}

                                                    <td style={tdStyle}>
                                                        {
                                                            item.version ||
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* LICENSE TYPE */}

                                                    <td style={tdStyle}>
                                                        {
                                                            item.license_type ||
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* LICENSES */}

                                                    <td style={tdStyle}>
                                                        {
                                                            item.total_licenses
                                                        }
                                                    </td>


                                                    {/* PURCHASE DATE */}

                                                    <td style={tdStyle}>
                                                        {
                                                            formatDate(
                                                                item.purchase_date
                                                            )
                                                        }
                                                    </td>


                                                    {/* EXPIRY DATE */}

                                                    <td style={tdStyle}>
                                                        {
                                                            formatDate(
                                                                item.expiry_date
                                                            )
                                                        }
                                                    </td>


                                                    {/* DAYS REMAINING */}

                                                    <td style={tdStyle}>

                                                        <div
                                                            style={{
                                                                lineHeight:
                                                                    "1.5"
                                                            }}
                                                        >

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


                                                    {/* COST */}

                                                    <td style={tdStyle}>
                                                        ₹{" "}
                                                        {
                                                            Number(
                                                                item.cost || 0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )
                                                        }
                                                    </td>


                                                    {/* STATUS */}

                                                    <td style={tdStyle}>
                                                        {
                                                            item.status
                                                        }
                                                    </td>


                                                    {/* ACTION */}

                                                    <td style={tdStyle}>

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