// Software.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Software() {
    const navigate = useNavigate();

    const [software, setSoftware] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const loadSoftware = async () => {
        try {
            setLoading(true);

            const response = await API.get("/software");

            setSoftware(response.data.data || []);
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

        if (!confirmDelete) return;

        try {
            setDeletingId(id);

            await API.delete(`/software/${id}`);

            alert("Software deleted successfully");

            await loadSoftware();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete software"
            );
        } finally {
            setDeletingId(null);
        }
    };

    const getExpiryStatus = (days) => {
        if (days === null || days === undefined || days === "") {
            return {
                text: "No Expiry",
                color: "#64748b",
                background: "#f1f5f9",
                dot: "#94a3b8"
            };
        }

        const remaining = Number(days);

        if (remaining < 0) {
            return {
                text: "Expired",
                color: "#dc2626",
                background: "#fef2f2",
                dot: "#ef4444"
            };
        }

        if (remaining <= 10) {
            return {
                text: "Critical",
                color: "#dc2626",
                background: "#fef2f2",
                dot: "#ef4444"
            };
        }

        if (remaining <= 20) {
            return {
                text: "10–20 Days",
                color: "#ea580c",
                background: "#fff7ed",
                dot: "#f97316"
            };
        }

        if (remaining <= 30) {
            return {
                text: "20–30 Days",
                color: "#ca8a04",
                background: "#fefce8",
                dot: "#eab308"
            };
        }

        return {
            text: "Active",
            color: "#16a34a",
            background: "#f0fdf4",
            dot: "#22c55e"
        };
    };

    const formatDate = (date) => {
        if (!date) return "-";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const filteredSoftware = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return software.filter((item) => {
            const expiry = getExpiryStatus(item.days_remaining);

            const searchableText = `
                ${item.software_code || ""}
                ${item.software_name || ""}
                ${item.publisher || ""}
                ${item.version || ""}
                ${item.license_type || ""}
                ${item.vendor_name || ""}
                ${item.status || ""}
                ${expiry.text}
            `.toLowerCase();

            const matchesSearch =
                !keyword || searchableText.includes(keyword);

            let matchesFilter = true;

            if (filter === "Active") {
                matchesFilter =
                    Number(item.days_remaining) > 30 ||
                    item.days_remaining === null ||
                    item.days_remaining === undefined;
            }

            if (filter === "Critical") {
                matchesFilter =
                    item.days_remaining !== null &&
                    item.days_remaining !== undefined &&
                    Number(item.days_remaining) >= 0 &&
                    Number(item.days_remaining) <= 10;
            }

            if (filter === "Expiring") {
                matchesFilter =
                    item.days_remaining !== null &&
                    item.days_remaining !== undefined &&
                    Number(item.days_remaining) >= 0 &&
                    Number(item.days_remaining) <= 30;
            }

            if (filter === "Expired") {
                matchesFilter =
                    item.days_remaining !== null &&
                    item.days_remaining !== undefined &&
                    Number(item.days_remaining) < 0;
            }

            return matchesSearch && matchesFilter;
        });
    }, [software, search, filter]);

    const stats = useMemo(() => {
        let active = 0;
        let critical = 0;
        let expiring = 0;
        let expired = 0;

        software.forEach((item) => {
            const days = item.days_remaining;

            if (days === null || days === undefined) {
                active++;
                return;
            }

            const value = Number(days);

            if (value < 0) {
                expired++;
            } else if (value <= 10) {
                critical++;
            } else if (value <= 30) {
                expiring++;
            } else {
                active++;
            }
        });

        return {
            total: software.length,
            active,
            critical,
            expiring,
            expired
        };
    }, [software]);

    return (
        <div style={pageStyle}>
            <Sidebar />

            <div style={contentStyle}>
                <Navbar />

                <main style={mainStyle}>
                    <div style={topHeader}>
                        <div>
                            <div style={breadcrumb}>
                                Dashboard <span>/</span> Software
                            </div>

                            <h1 style={pageTitle}>
                                Software Licenses
                            </h1>

                            <p style={pageSubtitle}>
                                Manage and monitor all company software licenses
                            </p>
                        </div>

                        <div style={headerActions}>
                            <button
                                onClick={loadSoftware}
                                disabled={loading}
                                style={secondaryButton}
                            >
                                <span style={refreshIcon}>↻</span>
                                Refresh
                            </button>

                            <button
                                onClick={() => navigate("/software/add")}
                                style={primaryButton}
                            >
                                <span style={{ fontSize: "18px" }}>+</span>
                                Add Software
                            </button>
                        </div>
                    </div>

                    <div style={statsGrid}>
                        <StatCard
                            title="Total Software"
                            value={stats.total}
                            icon="▣"
                            iconColor="#2563eb"
                            iconBackground="#eff6ff"
                        />

                        <StatCard
                            title="Active"
                            value={stats.active}
                            icon="✓"
                            iconColor="#16a34a"
                            iconBackground="#f0fdf4"
                        />

                        <StatCard
                            title="Expiring Soon"
                            value={stats.expiring}
                            icon="◷"
                            iconColor="#d97706"
                            iconBackground="#fffbeb"
                        />

                        <StatCard
                            title="Critical"
                            value={stats.critical}
                            icon="!"
                            iconColor="#dc2626"
                            iconBackground="#fef2f2"
                        />

                        <StatCard
                            title="Expired"
                            value={stats.expired}
                            icon="×"
                            iconColor="#7f1d1d"
                            iconBackground="#fef2f2"
                        />
                    </div>

                    <div style={toolbar}>
                        <div style={searchWrapper}>
                            <span style={searchIcon}>⌕</span>

                            <input
                                type="text"
                                placeholder="Search software, publisher, license..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                style={searchInput}
                            />

                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    style={clearSearch}
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <div style={filterGroup}>
                            {[
                                "All",
                                "Active",
                                "Expiring",
                                "Critical",
                                "Expired"
                            ].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setFilter(item)}
                                    style={{
                                        ...filterButton,
                                        ...(filter === item
                                            ? activeFilterButton
                                            : {})
                                    }}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={tableCard}>
                        <div style={tableHeader}>
                            <div>
                                <h2 style={tableTitle}>
                                    Software Inventory
                                </h2>

                                <p style={tableSubtitle}>
                                    {filteredSoftware.length} software
                                    {filteredSoftware.length !== 1
                                        ? " licenses"
                                        : " license"}{" "}
                                    found
                                </p>
                            </div>
                        </div>

                        <div style={tableScroll}>
                            <table style={table}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>ID</th>
                                        <th style={thStyle}>Software</th>
                                        <th style={thStyle}>Publisher</th>
                                        <th style={thStyle}>Version</th>
                                        <th style={thStyle}>License</th>
                                        <th style={thStyle}>Qty</th>
                                        <th style={thStyle}>Purchase</th>
                                        <th style={thStyle}>Expiry</th>
                                        <th style={thStyle}>
                                            Days Remaining
                                        </th>
                                        <th style={thStyle}>Cost</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <>
                                            {[1, 2, 3, 4, 5].map((row) => (
                                                <tr key={row}>
                                                    {Array.from({
                                                        length: 12
                                                    }).map((_, index) => (
                                                        <td
                                                            key={index}
                                                            style={tdStyle}
                                                        >
                                                            <div
                                                                style={
                                                                    skeleton
                                                                }
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </>
                                    ) : filteredSoftware.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="12"
                                                style={emptyCell}
                                            >
                                                <div style={emptyIcon}>
                                                    ▣
                                                </div>

                                                <div style={emptyTitle}>
                                                    No software found
                                                </div>

                                                <div style={emptyText}>
                                                    Try changing your search
                                                    or filter.
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSoftware.map((item) => {
                                            const expiry =
                                                getExpiryStatus(
                                                    item.days_remaining
                                                );

                                            return (
                                                <tr
                                                    key={item.software_id}
                                                    style={rowStyle}
                                                >
                                                    <td style={tdStyle}>
                                                        <span style={idText}>
                                                            #
                                                            {
                                                                item.software_id
                                                            }
                                                        </span>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <div style={softwareCell}>
                                                            <div
                                                                style={
                                                                    softwareIcon
                                                                }
                                                            >
                                                                {(
                                                                    item.software_name ||
                                                                    "S"
                                                                )
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>

                                                            <div>
                                                                <div
                                                                    style={
                                                                        softwareName
                                                                    }
                                                                >
                                                                    {
                                                                        item.software_name
                                                                    }
                                                                </div>

                                                                <div
                                                                    style={
                                                                        softwareCode
                                                                    }
                                                                >
                                                                    {
                                                                        item.software_code
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        {item.publisher || "-"}
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <span style={versionBadge}>
                                                            {item.version || "-"}
                                                        </span>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <span
                                                            style={
                                                                licenseBadge
                                                            }
                                                        >
                                                            {item.license_type ||
                                                                "-"}
                                                        </span>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <strong>
                                                            {
                                                                item.total_licenses
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        {formatDate(
                                                            item.purchase_date
                                                        )}
                                                    </td>

                                                    <td style={tdStyle}>
                                                        {formatDate(
                                                            item.expiry_date
                                                        )}
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <div>
                                                            <strong
                                                                style={{
                                                                    color:
                                                                        expiry.color
                                                                }}
                                                            >
                                                                {item.days_remaining ??
                                                                    "—"}
                                                            </strong>

                                                            <div
                                                                style={{
                                                                    marginTop:
                                                                        "4px"
                                                                }}
                                                            >
                                                                <StatusBadge
                                                                    status={
                                                                        expiry
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <strong>
                                                            ₹{" "}
                                                            {Number(
                                                                item.cost || 0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </strong>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <span
                                                            style={{
                                                                ...statusBadge,
                                                                color:
                                                                    item.status ===
                                                                    "Active"
                                                                        ? "#15803d"
                                                                        : "#64748b",
                                                                background:
                                                                    item.status ===
                                                                    "Active"
                                                                        ? "#f0fdf4"
                                                                        : "#f1f5f9"
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    width: "6px",
                                                                    height: "6px",
                                                                    borderRadius:
                                                                        "50%",
                                                                    background:
                                                                        item.status ===
                                                                        "Active"
                                                                            ? "#22c55e"
                                                                            : "#94a3b8"
                                                                }}
                                                            />
                                                            {item.status || "-"}
                                                        </span>
                                                    </td>

                                                    <td
                                                        style={{
                                                            ...tdStyle,
                                                            textAlign: "right"
                                                        }}
                                                    >
                                                        <div
                                                            style={
                                                                actionWrapper
                                                            }
                                                        >
                                                            <button
                                                                title="Edit"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/software/edit/${item.software_id}`
                                                                    )
                                                                }
                                                                style={
                                                                    editButton
                                                                }
                                                            >
                                                                ✎
                                                            </button>

                                                            <button
                                                                title="Delete"
                                                                disabled={
                                                                    deletingId ===
                                                                    item.software_id
                                                                }
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        item.software_id
                                                                    )
                                                                }
                                                                style={
                                                                    deleteButton
                                                                }
                                                            >
                                                                {deletingId ===
                                                                item.software_id
                                                                    ? "..."
                                                                    : "⌫"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
    iconColor,
    iconBackground
}) {
    return (
        <div style={statCard}>
            <div
                style={{
                    ...statIcon,
                    color: iconColor,
                    background: iconBackground
                }}
            >
                {icon}
            </div>

            <div>
                <div style={statTitle}>{title}</div>
                <div style={statValue}>{value}</div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    return (
        <span
            style={{
                ...statusBadge,
                color: status.color,
                background: status.background
            }}
        >
            <span
                style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: status.dot
                }}
            />
            {status.text}
        </span>
    );
}

const pageStyle = {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc"
};

const contentStyle = {
    flex: 1,
    minWidth: 0
};

const mainStyle = {
    padding: "28px",
    maxWidth: "1800px",
    margin: "0 auto"
};

const topHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "26px"
};

const breadcrumb = {
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "8px"
};

const pageTitle = {
    margin: 0,
    fontSize: "30px",
    lineHeight: 1.2,
    fontWeight: "750",
    color: "#0f172a"
};

const pageSubtitle = {
    margin: "7px 0 0",
    fontSize: "14px",
    color: "#64748b"
};

const headerActions = {
    display: "flex",
    gap: "10px"
};

const secondaryButton = {
    height: "42px",
    padding: "0 16px",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    background: "#fff",
    color: "#334155",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "7px"
};

const primaryButton = {
    height: "42px",
    padding: "0 17px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    boxShadow: "0 3px 8px rgba(37,99,235,.18)"
};

const refreshIcon = {
    fontSize: "18px",
    lineHeight: 1
};

const statsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: "15px",
    marginBottom: "22px"
};

const statCard = {
    background: "#fff",
    border: "1px solid #e5eaf0",
    borderRadius: "11px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    minHeight: "82px",
    boxSizing: "border-box"
};

const statIcon = {
    width: "42px",
    height: "42px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
    flexShrink: 0
};

const statTitle = {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "4px"
};

const statValue = {
    fontSize: "24px",
    fontWeight: "750",
    color: "#0f172a"
};

const toolbar = {
    background: "#fff",
    border: "1px solid #e5eaf0",
    borderRadius: "11px",
    padding: "14px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap"
};

const searchWrapper = {
    width: "360px",
    maxWidth: "100%",
    height: "40px",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    background: "#fff",
    boxSizing: "border-box"
};

const searchIcon = {
    marginLeft: "12px",
    color: "#94a3b8",
    fontSize: "21px"
};

const searchInput = {
    flex: 1,
    minWidth: 0,
    height: "100%",
    border: "none",
    outline: "none",
    padding: "0 10px",
    color: "#334155",
    fontSize: "13px",
    background: "transparent"
};

const clearSearch = {
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: "18px",
    cursor: "pointer",
    marginRight: "8px"
};

const filterGroup = {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap"
};

const filterButton = {
    border: "1px solid transparent",
    background: "transparent",
    color: "#64748b",
    borderRadius: "7px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600"
};

const activeFilterButton = {
    background: "#eff6ff",
    color: "#2563eb",
    borderColor: "#dbeafe"
};

const tableCard = {
    background: "#fff",
    border: "1px solid #e5eaf0",
    borderRadius: "11px",
    overflow: "hidden"
};

const tableHeader = {
    padding: "18px 20px",
    borderBottom: "1px solid #eef2f6"
};

const tableTitle = {
    margin: 0,
    fontSize: "16px",
    color: "#0f172a",
    fontWeight: "700"
};

const tableSubtitle = {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "12px"
};

const tableScroll = {
    width: "100%",
    overflowX: "auto"
};

const table = {
    width: "100%",
    minWidth: "1450px",
    borderCollapse: "collapse"
};

const thStyle = {
    padding: "13px 15px",
    textAlign: "left",
    whiteSpace: "nowrap",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: ".04em",
    color: "#64748b",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    fontWeight: "700"
};

const tdStyle = {
    padding: "14px 15px",
    textAlign: "left",
    whiteSpace: "nowrap",
    fontSize: "13px",
    color: "#475569",
    borderBottom: "1px solid #f1f5f9"
};

const rowStyle = {
    transition: "background .15s"
};

const idText = {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600"
};

const softwareCell = {
    display: "flex",
    alignItems: "center",
    gap: "10px"
};

const softwareIcon = {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
    flexShrink: 0
};

const softwareName = {
    color: "#0f172a",
    fontWeight: "650",
    fontSize: "13px",
    marginBottom: "3px"
};

const softwareCode = {
    color: "#94a3b8",
    fontSize: "11px"
};

const versionBadge = {
    padding: "4px 7px",
    borderRadius: "5px",
    background: "#f8fafc",
    color: "#475569",
    border: "1px solid #e2e8f0",
    fontSize: "11px"
};

const licenseBadge = {
    color: "#475569",
    background: "#f8fafc",
    borderRadius: "5px",
    padding: "5px 8px",
    fontSize: "11px",
    border: "1px solid #e2e8f0"
};

const statusBadge = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    borderRadius: "20px",
    padding: "5px 8px",
    fontSize: "10px",
    fontWeight: "700"
};

const actionWrapper = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "6px"
};

const editButton = {
    width: "31px",
    height: "31px",
    border: "1px solid #dbeafe",
    borderRadius: "7px",
    background: "#eff6ff",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "14px"
};

const deleteButton = {
    width: "31px",
    height: "31px",
    border: "1px solid #fee2e2",
    borderRadius: "7px",
    background: "#fef2f2",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "14px"
};

const emptyCell = {
    padding: "70px 20px",
    textAlign: "center"
};

const emptyIcon = {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#f1f5f9",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
    fontSize: "20px"
};

const emptyTitle = {
    color: "#334155",
    fontWeight: "700",
    fontSize: "14px"
};

const emptyText = {
    color: "#94a3b8",
    fontSize: "12px",
    marginTop: "5px"
};

const skeleton = {
    height: "13px",
    width: "75%",
    borderRadius: "5px",
    background:
        "linear-gradient(90deg,#f1f5f9,#e2e8f0,#f1f5f9)",
    backgroundSize: "200% 100%"
};

export default Software;