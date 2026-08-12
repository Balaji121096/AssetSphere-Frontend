import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function AssetHistory() {
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const loadHistory = async () => {
        try {
            setLoading(true);

            const response = await API.get(
                "/dashboard/recent-history"
            );

            setHistory(response.data.data || []);

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to load asset history"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const filteredHistory = history.filter((item) => {
        const text = `
            ${item.asset_code || ""}
            ${item.asset_name || ""}
            ${item.employee_name || ""}
            ${item.action_type || ""}
            ${item.remarks || ""}
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
                                Asset History
                            </h1>

                            <p>
                                Track asset assignments, returns and
                                other asset activities.
                            </p>
                        </div>

                        <button onClick={loadHistory}>
                            Refresh
                        </button>
                    </div>

                    <div style={{ margin: "20px 0" }}>
                        <input
                            type="text"
                            placeholder="Search asset history..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            style={{
                                padding: "10px",
                                width: "320px"
                            }}
                        />
                    </div>

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
                                    <th>Employee</th>
                                    <th>Action</th>
                                    <th>Date</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : filteredHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan="6">
                                            No history found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredHistory.map((item) => (
                                        <tr key={item.history_id}>
                                            <td>
                                                {item.asset_code}
                                            </td>

                                            <td>
                                                {item.asset_name}
                                            </td>

                                            <td>
                                                {item.employee_name || "-"}
                                            </td>

                                            <td>
                                                {item.action_type}
                                            </td>

                                            <td>
                                                {new Date(
                                                    item.action_date
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                {item.remarks || "-"}
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

export default AssetHistory;