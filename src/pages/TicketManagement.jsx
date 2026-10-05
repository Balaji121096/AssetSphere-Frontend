import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function TicketManagement() {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // =====================================================
    // FILTERS
    // =====================================================

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [reportMonth, setReportMonth] = useState("");
    const [reportTickets, setReportTickets] = useState([]);
    const [loadingReport, setLoadingReport] = useState(false);

    // =====================================================
    // PAGINATION
    // =====================================================

    const ITEMS_PER_PAGE = 10;

    const [currentPage, setCurrentPage] = useState(1);

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        }

        setLoading(true);

        try {
            const [ticketsRes, statsRes] = await Promise.all([
                API.get("/tickets"),
                API.get("/tickets/stats")
            ]);

            if (ticketsRes.data.success) {
                setTickets(ticketsRes.data.data || []);
            }

            if (statsRes.data.success) {
                setStats(statsRes.data.data);
            }
        } catch (err) {
            console.error(
                "Error fetching ticket management data:",
                err
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (status) => {
        switch (status) {
            case "Open":
                return {
                    background:
                        "color-mix(in srgb, #3b82f6 12%, var(--card-background))",
                    color: "#3b82f6"
                };

            case "Assigned":
                return {
                    background:
                        "color-mix(in srgb, #f59e0b 12%, var(--card-background))",
                    color: "#f59e0b"
                };

            case "In Progress":
                return {
                    background:
                        "color-mix(in srgb, #eab308 14%, var(--card-background))",
                    color: "#ca8a04"
                };

            case "Pending":
                return {
                    background:
                        "color-mix(in srgb, #6b7280 12%, var(--card-background))",
                    color: "#6b7280"
                };

            case "Resolved":
                return {
                    background:
                        "color-mix(in srgb, #22c55e 12%, var(--card-background))",
                    color: "#16a34a"
                };

            case "Closed":
                return {
                    background:
                        "color-mix(in srgb, #9ca3af 14%, var(--card-background))",
                    color: "#6b7280"
                };

            default:
                return {
                    background: "var(--muted-background)",
                    color: "var(--muted-text)"
                };
        }
    };

    // =====================================================
    // PRIORITY STYLE
    // =====================================================

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case "Low":
                return {
                    background:
                        "color-mix(in srgb, #22c55e 12%, var(--card-background))",
                    color: "#16a34a"
                };

            case "Medium":
                return {
                    background:
                        "color-mix(in srgb, #eab308 14%, var(--card-background))",
                    color: "#ca8a04"
                };

            case "High":
                return {
                    background:
                        "color-mix(in srgb, #f97316 12%, var(--card-background))",
                    color: "#ea580c"
                };

            case "Critical":
                return {
                    background:
                        "color-mix(in srgb, #ef4444 12%, var(--card-background))",
                    color: "#dc2626"
                };

            default:
                return {
                    background: "var(--muted-background)",
                    color: "var(--muted-text)"
                };
        }
    };

    const fetchReportTickets = async (month) => {
        if (!month) {
            setReportTickets([]);
            return;
        }
        try {
            setLoadingReport(true);
            const res = await API.get(`/tickets/report?month=${month}`);
            if (res.data.success) {
                setReportTickets(res.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching report tickets:", err);
            setReportTickets([]);
        } finally {
            setLoadingReport(false);
        }
    };

    // =====================================================
    // EXPORT EXCEL
    // =====================================================

    const exportExcel = () => {
        if (tickets.length === 0) {
            alert("No data to export");
            return;
        }

        const exportData = tickets.map((ticket) => ({
            "Ticket No": ticket.ticket_number || "-",
            Employee: ticket.employee_name || "-",
            Code: ticket.employee_code || "-",
            Subject: ticket.subject || "-",
            Category: ticket.category || "-",
            Priority: ticket.priority || "-",
            Status: ticket.status || "-",
            "Assigned To": ticket.assigned_name || "Unassigned",
            "Created Date": ticket.created_at
                ? new Date(ticket.created_at).toLocaleString()
                : "-"
        }));

        const worksheet =
            XLSX.utils.json_to_sheet(exportData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Tickets"
        );

        XLSX.writeFile(
            workbook,
            "Tickets_Export.xlsx"
        );
    };

    // =====================================================
    // EXPORT PDF
    // =====================================================

    const exportPDF = () => {
        if (tickets.length === 0) {
            alert("No data to export");
            return;
        }

        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Tickets Report", 14, 15);

        const tableColumn = [
            "Ticket No",
            "Employee",
            "Subject",
            "Priority",
            "Status",
            "Date"
        ];

        const tableRows = [];

        tickets.forEach((ticket) => {
            tableRows.push([
                ticket.ticket_number || "-",
                ticket.employee_name || "-",
                String(
                    ticket.subject || "-"
                ).substring(0, 30),
                ticket.priority || "-",
                ticket.status || "-",
                ticket.created_at
                    ? new Date(
                          ticket.created_at
                      ).toLocaleDateString()
                    : "-"
            ]);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 22,
            styles: {
                fontSize: 8
            },
            headStyles: {
                fillColor: [41, 128, 185]
            }
        });

        doc.save("Tickets_Export.pdf");
    };

    // =====================================================
    // FILTER
    // =====================================================

    const baseTickets = reportMonth ? reportTickets : tickets;
    const filteredTickets = baseTickets.filter((ticket) => {
        const searchText = search
            .trim()
            .toLowerCase();

        const matchesSearch =
            !searchText ||
            String(
                ticket.ticket_number || ""
            )
                .toLowerCase()
                .includes(searchText) ||
            String(
                ticket.subject || ""
            )
                .toLowerCase()
                .includes(searchText) ||
            String(
                ticket.employee_name || ""
            )
                .toLowerCase()
                .includes(searchText) ||
            String(
                ticket.employee_code || ""
            )
                .toLowerCase()
                .includes(searchText) ||
            String(
                ticket.assigned_name || ""
            )
                .toLowerCase()
                .includes(searchText);

        const matchesStatus =
            statusFilter === "All" ||
            ticket.status === statusFilter;

        const matchesPriority =
            priorityFilter === "All" ||
            ticket.priority === priorityFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
        );
    });

    // =====================================================
    // PAGINATION CALCULATION
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredTickets.length /
                ITEMS_PER_PAGE
        )
    );

    // Make sure current page never exceeds total pages
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        statusFilter,
        priorityFilter
    ]);

    const startIndex =
        (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex =
        startIndex + ITEMS_PER_PAGE;

    const paginatedTickets =
        filteredTickets.slice(
            startIndex,
            endIndex
        );

    // =====================================================
    // PAGINATION FUNCTIONS
    // =====================================================

    const goToPreviousPage = () => {
        setCurrentPage((prev) =>
            Math.max(prev - 1, 1)
        );
    };

    const goToNextPage = () => {
        setCurrentPage((prev) =>
            Math.min(
                prev + 1,
                totalPages
            )
        );
    };

    const goToPage = (page) => {
        setCurrentPage(
            Math.min(
                Math.max(page, 1),
                totalPages
            )
        );
    };

    // =====================================================
    // PAGE NUMBERS
    // =====================================================

    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (
                let i = 1;
                i <= totalPages;
                i++
            ) {
                pages.push(i);
            }

            return pages;
        }

        pages.push(1);

        if (currentPage > 4) {
            pages.push("...");
        }

        const start = Math.max(
            2,
            currentPage - 1
        );

        const end = Math.min(
            totalPages - 1,
            currentPage + 1
        );

        for (
            let i = start;
            i <= end;
            i++
        ) {
            pages.push(i);
        }

        if (
            currentPage <
            totalPages - 3
        ) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };

    // =====================================================
    // SUMMARY CARD
    // =====================================================

    const SummaryCard = ({
        title,
        value,
        icon,
        iconBackground,
        iconColor,
        onClick
    }) => {
        return (
            <div
                onClick={onClick}
                style={{
                    ...summaryCard,
                    cursor: onClick
                        ? "pointer"
                        : "default"
                }}
            >
                <div
                    style={{
                        ...summaryIcon,
                        background:
                            iconBackground,
                        color: iconColor
                    }}
                >
                    {icon}
                </div>

                <div
                    style={{
                        minWidth: 0
                    }}
                >
                    <div
                        style={
                            summaryLabel
                        }
                    >
                        {title}
                    </div>

                    <div
                        style={
                            summaryValue
                        }
                    >
                        {value ?? 0}
                    </div>
                </div>
            </div>
        );
    };

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div style={pageStyle}>
            <Sidebar />

            <div style={contentStyle}>
                <Navbar />

                <main style={mainStyle}>
                    {/* =================================================
                        HERO HEADER
                    ================================================= */}

                    <div
                        className="ticket-management-hero"
                        style={
                            heroHeader
                        }
                    >
                        <div
                            style={
                                heroContent
                            }
                        >
                            <div
                                style={
                                    heroBreadcrumb
                                }
                            >
                                Dashboard

                                <span
                                    style={
                                        breadcrumbSlash
                                    }
                                >
                                    /
                                </span>

                                Ticket Management
                            </div>

                            <div
                                style={
                                    heroTitleRow
                                }
                            >
                                <div
                                    style={
                                        heroIcon
                                    }
                                >
                                    ✓
                                </div>

                                <div>
                                    <h1
                                        style={
                                            pageTitle
                                        }
                                    >
                                        Ticket Management
                                    </h1>

                                    <p
                                        style={
                                            pageSubtitle
                                        }
                                    >
                                        View, track and
                                        manage all
                                        employee support
                                        tickets.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            style={
                                headerActions
                            }
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    fetchData(
                                        true
                                    )
                                }
                                disabled={
                                    refreshing
                                }
                                style={{
                                    ...refreshButton,
                                    opacity:
                                        refreshing
                                            ? 0.65
                                            : 1,
                                    cursor:
                                        refreshing
                                            ? "not-allowed"
                                            : "pointer"
                                }}
                            >
                                <span
                                    style={{
                                        ...refreshIcon,
                                        display:
                                            "inline-block",
                                        animation:
                                            refreshing
                                                ? "ticketManagementSpin 0.8s linear infinite"
                                                : "none"
                                    }}
                                >
                                    ↻
                                </span>

                                {refreshing
                                    ? "Refreshing..."
                                    : "Refresh"}
                            </button>
                        </div>
                    </div>

                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    {stats && (
                        <div
                            className="ticket-management-stats"
                            style={
                                statsGrid
                            }
                        >
                            <SummaryCard
                                title="Total Tickets"
                                value={
                                    stats.total
                                }
                                icon="#"
                                iconBackground="color-mix(in srgb, var(--primary-color) 10%, var(--card-background))"
                                iconColor="var(--primary-color)"
                                onClick={() =>
                                    setStatusFilter(
                                        "All"
                                    )
                                }
                            />

                            <SummaryCard
                                title="Open"
                                value={
                                    stats.open
                                }
                                icon="●"
                                iconBackground="color-mix(in srgb, #3b82f6 10%, var(--card-background))"
                                iconColor="#3b82f6"
                                onClick={() =>
                                    setStatusFilter(
                                        "Open"
                                    )
                                }
                            />

                            <SummaryCard
                                title="In Progress"
                                value={
                                    stats.in_progress
                                }
                                icon="↻"
                                iconBackground="color-mix(in srgb, #eab308 12%, var(--card-background))"
                                iconColor="#ca8a04"
                                onClick={() =>
                                    setStatusFilter(
                                        "In Progress"
                                    )
                                }
                            />

                            <SummaryCard
                                title="Pending"
                                value={
                                    stats.pending
                                }
                                icon="◷"
                                iconBackground="color-mix(in srgb, #6b7280 10%, var(--card-background))"
                                iconColor="#6b7280"
                                onClick={() =>
                                    setStatusFilter(
                                        "Pending"
                                    )
                                }
                            />

                            <SummaryCard
                                title="Resolved"
                                value={
                                    stats.resolved
                                }
                                icon="✓"
                                iconBackground="color-mix(in srgb, #22c55e 10%, var(--card-background))"
                                iconColor="#16a34a"
                                onClick={() =>
                                    setStatusFilter(
                                        "Resolved"
                                    )
                                }
                            />

                            <SummaryCard
                                title="Closed"
                                value={
                                    stats.closed
                                }
                                icon="✓"
                                iconBackground="color-mix(in srgb, #9ca3af 12%, var(--card-background))"
                                iconColor="#6b7280"
                                onClick={() =>
                                    setStatusFilter(
                                        "Closed"
                                    )
                                }
                            />
                        </div>
                    )}

                    {/* =================================================
                        FILTER CARD
                    ================================================= */}

                    <div
                        style={
                            filterCard
                        }
                    >
                        <div
                            style={
                                filterHeader
                            }
                        >
                            <div>
                                <h2
                                    style={
                                        filterTitle
                                    }
                                >
                                    Ticket Filters
                                </h2>

                                <p
                                    style={
                                        filterSubtitle
                                    }
                                >
                                    Search and filter
                                    support tickets.
                                </p>
                            </div>

                            <div
                                style={
                                    resultCount
                                }
                            >
                                {
                                    filteredTickets.length
                                }{" "}
                                record
                                {filteredTickets.length !==
                                1
                                    ? "s"
                                    : ""}{" "}
                                found
                            </div>
                        </div>

                        <div
                            style={
                                filterControls
                            }
                        >
                            {/* SEARCH */}

                            <div
                                style={
                                    searchWrapper
                                }
                            >
                                <span
                                    style={
                                        searchIcon
                                    }
                                >
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    value={
                                        search
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setSearch(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Search ticket, subject, employee..."
                                    style={
                                        searchInput
                                    }
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch(
                                                ""
                                            )
                                        }
                                        style={
                                            clearSearch
                                        }
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            {/* STATUS */}

                            <div
                                style={
                                    selectWrapper
                                }
                            >
                                <span
                                    style={
                                        filterIcon
                                    }
                                >
                                    ◉
                                </span>

                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setStatusFilter(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    style={
                                        selectInput
                                    }
                                >
                                    <option value="All">
                                        All Statuses
                                    </option>

                                    <option value="Open">
                                        Open
                                    </option>

                                    <option value="Assigned">
                                        Assigned
                                    </option>

                                    <option value="In Progress">
                                        In Progress
                                    </option>

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Resolved">
                                        Resolved
                                    </option>

                                    <option value="Closed">
                                        Closed
                                    </option>
                                </select>
                            </div>

                            {/* PRIORITY */}

                            <div
                                style={
                                    selectWrapper
                                }
                            >
                                <span
                                    style={
                                        filterIcon
                                    }
                                >
                                    !
                                </span>

                                <select
                                    value={
                                        priorityFilter
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setPriorityFilter(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    style={
                                        selectInput
                                    }
                                >
                                    <option value="All">
                                        All Priorities
                                    </option>

                                    <option value="Low">
                                        Low
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="High">
                                        High
                                    </option>

                                    <option value="Critical">
                                        Critical
                                    </option>
                                </select>
                            </div>

                            {/* MONTH FILTER & EXPORT */}

                            <div
                                style={{
                                    ...exportActions,
                                    alignItems: "center"
                                }}
                            >
                                <input
                                    type="month"
                                    value={reportMonth}
                                    onChange={(e) => {
                                        setReportMonth(e.target.value);
                                        fetchReportTickets(e.target.value);
                                    }}
                                    style={{
                                        padding: "7px 12px",
                                        borderRadius: "8px",
                                        border: "1.5px solid var(--border-color, #e2e8f0)",
                                        background: "var(--card-background, #fff)",
                                        color: "var(--text-color, #1e293b)",
                                        fontSize: "13px",
                                        outline: "none",
                                        minWidth: "150px"
                                    }}
                                />
                                {reportMonth && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setReportMonth("");
                                            setReportTickets([]);
                                        }}
                                        style={{
                                            padding: "7px 10px",
                                            borderRadius: "8px",
                                            border: "1.5px solid var(--border-color, #e2e8f0)",
                                            background: "var(--card-background, #fff)",
                                            color: "#ef4444",
                                            fontSize: "13px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        ? Clear
                                    </button>
                                )}
                                {loadingReport && (
                                    <span style={{ fontSize: "12px", color: "var(--muted-text, #64748b)" }}>Loading...</span>
                                )}
                                <button
                                    type="button"
                                    onClick={
                                        exportExcel
                                    }
                                    style={
                                        excelButton
                                    }
                                >
                                    <span>
                                        ?
                                    </span>
                                    Excel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        exportPDF
                                    }
                                    style={
                                        pdfButton
                                    }
                                >
                                    <span>
                                        ?
                                    </span>
                                    PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        TABLE CARD
                    ================================================= */}

                    <div
                        style={
                            tableCard
                        }
                    >
                        <div
                            style={
                                tableHeader
                            }
                        >
                            <div>
                                <h2
                                    style={
                                        tableTitle
                                    }
                                >
                                    All Support Tickets
                                </h2>

                                <p
                                    style={
                                        tableSubtitle
                                    }
                                >
                                    {
                                        filteredTickets.length
                                    }{" "}
                                    ticket
                                    {filteredTickets.length !==
                                    1
                                        ? "s"
                                        : ""}{" "}
                                    available
                                </p>
                            </div>

                            <div
                                style={
                                    tableHeaderBadge
                                }
                            >
                                {statusFilter !==
                                "All"
                                    ? statusFilter
                                    : "All Tickets"}
                            </div>
                        </div>

                        <div
                            style={
                                tableScroll
                            }
                        >
                            <table
                                style={
                                    table
                                }
                            >
                                <thead>
                                    <tr>
                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Ticket No
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Employee
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Subject
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Priority
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Status
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Assigned To
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Date & Time
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <>
                                            {[
                                                1,
                                                2,
                                                3,
                                                4,
                                                5,
                                                6,
                                                7,
                                                8,
                                                9,
                                                10
                                            ].map(
                                                (
                                                    row
                                                ) => (
                                                    <tr
                                                        key={
                                                            row
                                                        }
                                                    >
                                                        {Array.from(
                                                            {
                                                                length: 7
                                                            }
                                                        ).map(
                                                            (
                                                                _,
                                                                index
                                                            ) => (
                                                                <td
                                                                    key={
                                                                        index
                                                                    }
                                                                    style={
                                                                        tdStyle
                                                                    }
                                                                >
                                                                    <div
                                                                        style={{
                                                                            ...skeleton,
                                                                            width:
                                                                                index ===
                                                                                2
                                                                                    ? "180px"
                                                                                    : index ===
                                                                                      1
                                                                                    ? "130px"
                                                                                    : "90px"
                                                                        }}
                                                                    />
                                                                </td>
                                                            )
                                                        )}
                                                    </tr>
                                                )
                                            )}
                                        </>
                                    ) : paginatedTickets.length >
                                      0 ? (
                                        paginatedTickets.map(
                                            (
                                                ticket,
                                                index
                                            ) => {
                                                const statusStyle =
                                                    getStatusStyle(
                                                        ticket.status
                                                    );

                                                const priorityStyle =
                                                    getPriorityStyle(
                                                        ticket.priority
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            ticket.ticket_id ||
                                                            index
                                                        }
                                                        onClick={() =>
                                                            navigate(
                                                                `/tickets/${ticket.ticket_id}`
                                                            )
                                                        }
                                                        style={
                                                            rowStyle
                                                        }
                                                        className="ticket-table-row"
                                                    >
                                                        {/* TICKET */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            <span
                                                                style={
                                                                    ticketNumber
                                                                }
                                                            >
                                                                {ticket.ticket_number ||
                                                                    "-"}
                                                            </span>
                                                        </td>

                                                        {/* EMPLOYEE */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            <div
                                                                style={
                                                                    employeeCell
                                                                }
                                                            >
                                                                <div
                                                                    style={
                                                                        employeeAvatar
                                                                    }
                                                                >
                                                                    {String(
                                                                        ticket.employee_name ||
                                                                            "U"
                                                                    )
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>

                                                                <div>
                                                                    <div
                                                                        style={
                                                                            employeeName
                                                                        }
                                                                    >
                                                                        {ticket.employee_name ||
                                                                            "-"}
                                                                    </div>

                                                                    <div
                                                                        style={
                                                                            employeeCode
                                                                        }
                                                                    >
                                                                        {ticket.employee_code ||
                                                                            "-"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* SUBJECT */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            <div
                                                                style={
                                                                    subjectText
                                                                }
                                                            >
                                                                {ticket.subject ||
                                                                    "-"}
                                                            </div>

                                                            {ticket.category && (
                                                                <div
                                                                    style={
                                                                        categoryText
                                                                    }
                                                                >
                                                                    {
                                                                        ticket.category
                                                                    }
                                                                </div>
                                                            )}
                                                        </td>

                                                        {/* PRIORITY */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            <span
                                                                style={{
                                                                    ...badge,
                                                                    background:
                                                                        priorityStyle.background,
                                                                    color:
                                                                        priorityStyle.color
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        width: "6px",
                                                                        height: "6px",
                                                                        borderRadius:
                                                                            "50%",
                                                                        background:
                                                                            priorityStyle.color
                                                                    }}
                                                                />

                                                                {ticket.priority ||
                                                                    "-"}
                                                            </span>
                                                        </td>

                                                        {/* STATUS */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            <span
                                                                style={{
                                                                    ...badge,
                                                                    background:
                                                                        statusStyle.background,
                                                                    color:
                                                                        statusStyle.color
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        width: "6px",
                                                                        height: "6px",
                                                                        borderRadius:
                                                                            "50%",
                                                                        background:
                                                                            statusStyle.color
                                                                    }}
                                                                />

                                                                {ticket.status ||
                                                                    "-"}
                                                            </span>
                                                        </td>

                                                        {/* ASSIGNED */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            {ticket.assigned_name ? (
                                                                <div
                                                                    style={
                                                                        assignedCell
                                                                    }
                                                                >
                                                                    <div
                                                                        style={
                                                                            assignedAvatar
                                                                        }
                                                                    >
                                                                        {String(
                                                                            ticket.assigned_name
                                                                        )
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </div>

                                                                    <span
                                                                        style={
                                                                            assignedName
                                                                        }
                                                                    >
                                                                        {
                                                                            ticket.assigned_name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span
                                                                    style={
                                                                        unassignedText
                                                                    }
                                                                >
                                                                    Unassigned
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* DATE */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            <div
                                                                style={
                                                                    dateText
                                                                }
                                                            >
                                                                {formatDate(
                                                                    ticket.created_at
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                style={
                                                    emptyCell
                                                }
                                            >
                                                <div
                                                    style={
                                                        emptyIcon
                                                    }
                                                >
                                                    🎫
                                                </div>

                                                <div
                                                    style={
                                                        emptyTitle
                                                    }
                                                >
                                                    No tickets
                                                    found
                                                </div>

                                                <div
                                                    style={
                                                        emptyText
                                                    }
                                                >
                                                    Try changing
                                                    your search
                                                    or filter
                                                    criteria.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        <div
                            className="ticket-pagination"
                            style={
                                pagination
                            }
                        >
                            <div
                                style={
                                    paginationInfo
                                }
                            >
                                {filteredTickets.length >
                                0
                                    ? `Showing ${
                                          startIndex +
                                          1
                                      } to ${Math.min(
                                          endIndex,
                                          filteredTickets.length
                                      )} of ${
                                          filteredTickets.length
                                      } entries`
                                    : "Showing 0 to 0 of 0 entries"}
                            </div>

                            <div
                                style={
                                    paginationActions
                                }
                            >
                                {/* PREVIOUS */}

                                <button
                                    type="button"
                                    onClick={
                                        goToPreviousPage
                                    }
                                    disabled={
                                        currentPage ===
                                            1 ||
                                        loading
                                    }
                                    style={{
                                        ...paginationButton,
                                        opacity:
                                            currentPage ===
                                                1 ||
                                            loading
                                                ? 0.45
                                                : 1,
                                        cursor:
                                            currentPage ===
                                                1 ||
                                            loading
                                                ? "not-allowed"
                                                : "pointer"
                                    }}
                                >
                                    ← Previous
                                </button>

                                {/* PAGE NUMBERS */}

                                <div
                                    style={
                                        pageNumbers
                                    }
                                >
                                    {getPageNumbers().map(
                                        (
                                            page,
                                            index
                                        ) =>
                                            page ===
                                            "..." ? (
                                                <span
                                                    key={`dots-${index}`}
                                                    style={
                                                        dotsStyle
                                                    }
                                                >
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    key={
                                                        page
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        goToPage(
                                                            page
                                                        )
                                                    }
                                                    disabled={
                                                        loading
                                                    }
                                                    style={{
                                                        ...pageNumberButton,
                                                        ...(currentPage ===
                                                        page
                                                            ? activePageNumber
                                                            : {})
                                                    }}
                                                >
                                                    {
                                                        page
                                                    }
                                                </button>
                                            )
                                    )}
                                </div>

                                {/* NEXT */}

                                <button
                                    type="button"
                                    onClick={
                                        goToNextPage
                                    }
                                    disabled={
                                        currentPage ===
                                            totalPages ||
                                        loading
                                    }
                                    style={{
                                        ...paginationButton,
                                        opacity:
                                            currentPage ===
                                                totalPages ||
                                            loading
                                                ? 0.45
                                                : 1,
                                        cursor:
                                            currentPage ===
                                                totalPages ||
                                            loading
                                                ? "not-allowed"
                                                : "pointer"
                                    }}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* =====================================================
                GLOBAL CSS
            ===================================================== */}

            <style>
                {`
                    @keyframes ticketManagementSpin {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }
                    }

                    @keyframes ticketManagementSkeleton {
                        0% {
                            background-position: 200% 0;
                        }

                        100% {
                            background-position: -200% 0;
                        }
                    }

                    .ticket-table-row:hover {
                        background: var(--table-row-hover) !important;
                    }

                    .ticket-table-row {
                        transition:
                            background .15s ease;
                    }

                    @media (max-width: 1250px) {
                        .ticket-management-stats {
                            grid-template-columns:
                                repeat(3, minmax(0, 1fr)) !important;
                        }
                    }

                    @media (max-width: 900px) {
                        .ticket-management-hero {
                            flex-direction: column !important;
                            align-items: flex-start !important;
                        }

                        .ticket-management-stats {
                            grid-template-columns:
                                repeat(2, minmax(0, 1fr)) !important;
                        }

                        .ticket-pagination {
                            flex-direction: column !important;
                            align-items: flex-start !important;
                        }
                    }

                    @media (max-width: 700px) {
                        .ticket-management-stats {
                            grid-template-columns:
                                1fr !important;
                        }

                        .ticket-management-main {
                            padding: 18px !important;
                        }

                        .ticket-pagination {
                            padding: 14px !important;
                        }
                    }
                `}
            </style>
        </div>
    );
}

// =====================================================
// PAGE
// =====================================================

const pageStyle = {
    display: "flex",
    minHeight: "100vh",
    background: "var(--app-background)",
    color: "var(--text-color)"
};

const contentStyle = {
    flex: 1,
    minWidth: 0
};

const mainStyle = {
    padding: "28px",
    maxWidth: "1800px",
    margin: "0 auto",
    boxSizing: "border-box"
};

// =====================================================
// HERO
// =====================================================

const heroHeader = {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    padding: "25px 28px",
    marginBottom: "22px",
    borderRadius: "16px",
    overflow: "hidden",
    background:
        "linear-gradient(135deg, var(--sidebar-color) 0%, var(--sidebar-color) 42%, var(--primary-color) 100%)",
    boxShadow:
        "0 10px 30px rgba(15,23,42,0.14)",
    boxSizing: "border-box"
};

const heroContent = {
    minWidth: 0
};

const heroBreadcrumb = {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    marginBottom: "13px",
    color: "rgba(255,255,255,0.68)",
    fontSize: "12px",
    fontWeight: "500"
};

const breadcrumbSlash = {
    color: "rgba(255,255,255,0.35)"
};

const heroTitleRow = {
    display: "flex",
    alignItems: "center",
    gap: "14px"
};

const heroIcon = {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background:
        "rgba(255,255,255,0.13)",
    border:
        "1px solid rgba(255,255,255,0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "700",
    flexShrink: 0,
    boxSizing: "border-box"
};

const pageTitle = {
    margin: 0,
    color: "#ffffff",
    fontSize: "29px",
    lineHeight: "1.2",
    fontWeight: "750",
    letterSpacing: "-0.02em"
};

const pageSubtitle = {
    margin: "6px 0 0",
    color: "rgba(255,255,255,0.72)",
    fontSize: "13px",
    lineHeight: "1.5"
};

const headerActions = {
    display: "flex",
    alignItems: "center",
    flexShrink: 0
};

// =====================================================
// REFRESH
// =====================================================

const refreshButton = {
    height: "42px",
    padding: "0 16px",
    border:
        "1px solid rgba(255,255,255,0.20)",
    borderRadius: "9px",
    background:
        "rgba(255,255,255,0.12)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "650",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backdropFilter: "blur(8px)",
    boxShadow:
        "0 4px 12px rgba(0,0,0,0.12)"
};

const refreshIcon = {
    fontSize: "17px",
    lineHeight: 1
};

// =====================================================
// SUMMARY
// =====================================================

const statsGrid = {
    display: "grid",
    gridTemplateColumns:
        "repeat(6, minmax(0, 1fr))",
    gap: "15px",
    marginBottom: "22px"
};

const summaryCard = {
    background:
        "var(--card-background)",
    border:
        "1px solid var(--border-color)",
    borderRadius: "11px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    minHeight: "82px",
    boxSizing: "border-box",
    boxShadow:
        "0 1px 3px rgba(15,23,42,0.04)",
    transition:
        "transform .15s ease, box-shadow .15s ease"
};

const summaryIcon = {
    width: "42px",
    height: "42px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "700",
    flexShrink: 0
};

const summaryLabel = {
    color: "var(--muted-text)",
    fontSize: "11px",
    fontWeight: "600",
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: ".02em"
};

const summaryValue = {
    color: "var(--heading-color)",
    fontWeight: "750",
    fontSize: "24px",
    lineHeight: "1.25",
    wordBreak: "break-word"
};

// =====================================================
// FILTER CARD
// =====================================================

const filterCard = {
    background:
        "var(--card-background)",
    border:
        "1px solid var(--border-color)",
    borderRadius: "11px",
    marginBottom: "22px",
    boxShadow:
        "0 1px 3px rgba(15,23,42,0.04)",
    overflow: "hidden"
};

const filterHeader = {
    padding: "18px 20px",
    borderBottom:
        "1px solid var(--border-color)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap"
};

const filterTitle = {
    margin: 0,
    fontSize: "16px",
    color: "var(--heading-color)",
    fontWeight: "700"
};

const filterSubtitle = {
    margin: "4px 0 0",
    color: "var(--muted-text)",
    fontSize: "12px"
};

const resultCount = {
    padding: "6px 10px",
    borderRadius: "7px",
    background:
        "color-mix(in srgb, var(--primary-color) 8%, var(--card-background))",
    color: "var(--primary-color)",
    fontSize: "11px",
    fontWeight: "700"
};

const filterControls = {
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap"
};

// =====================================================
// SEARCH
// =====================================================

const searchWrapper = {
    flex: 1,
    minWidth: "250px",
    height: "40px",
    border:
        "1px solid var(--border-color)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    background:
        "var(--input-background)",
    boxSizing: "border-box"
};

const searchIcon = {
    marginLeft: "12px",
    color: "var(--muted-text)",
    fontSize: "19px",
    lineHeight: 1
};

const searchInput = {
    flex: 1,
    minWidth: 0,
    height: "100%",
    border: "none",
    outline: "none",
    padding: "0 10px",
    color: "var(--text-color)",
    fontSize: "13px",
    background: "transparent"
};

const clearSearch = {
    width: "28px",
    height: "28px",
    border: "none",
    background: "transparent",
    color: "var(--muted-text)",
    fontSize: "18px",
    cursor: "pointer",
    marginRight: "5px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

// =====================================================
// SELECT
// =====================================================

const selectWrapper = {
    height: "40px",
    minWidth: "165px",
    border:
        "1px solid var(--border-color)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    background:
        "var(--input-background)",
    boxSizing: "border-box"
};

const filterIcon = {
    marginLeft: "11px",
    color: "var(--muted-text)",
    fontSize: "13px",
    fontWeight: "700"
};

const selectInput = {
    height: "100%",
    flex: 1,
    minWidth: 0,
    border: "none",
    outline: "none",
    padding: "0 10px",
    color: "var(--text-color)",
    fontSize: "12px",
    background: "transparent",
    cursor: "pointer"
};

// =====================================================
// EXPORT
// =====================================================

const exportActions = {
    display: "flex",
    gap: "8px",
    flexShrink: 0
};

const excelButton = {
    height: "40px",
    padding: "0 13px",
    border:
        "1px solid rgba(16,185,129,0.25)",
    borderRadius: "8px",
    background:
        "color-mix(in srgb, #10b981 10%, var(--card-background))",
    color: "#059669",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "6px"
};

const pdfButton = {
    height: "40px",
    padding: "0 13px",
    border:
        "1px solid rgba(239,68,68,0.25)",
    borderRadius: "8px",
    background:
        "color-mix(in srgb, #ef4444 10%, var(--card-background))",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "6px"
};

// =====================================================
// TABLE CARD
// =====================================================

const tableCard = {
    background:
        "var(--card-background)",
    border:
        "1px solid var(--border-color)",
    borderRadius: "11px",
    overflow: "hidden",
    boxShadow:
        "0 1px 3px rgba(15,23,42,0.04)"
};

const tableHeader = {
    padding: "18px 20px",
    borderBottom:
        "1px solid var(--border-color)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap"
};

const tableTitle = {
    margin: 0,
    fontSize: "16px",
    color: "var(--heading-color)",
    fontWeight: "700"
};

const tableSubtitle = {
    margin: "4px 0 0",
    color: "var(--muted-text)",
    fontSize: "12px"
};

const tableHeaderBadge = {
    padding: "6px 10px",
    borderRadius: "7px",
    background:
        "var(--muted-background)",
    color: "var(--muted-text)",
    fontSize: "11px",
    fontWeight: "650"
};

// =====================================================
// TABLE
// =====================================================

const tableScroll = {
    width: "100%",
    overflowX: "auto"
};

const table = {
    width: "100%",
    minWidth: "1100px",
    borderCollapse: "collapse"
};

const thStyle = {
    padding: "13px 15px",
    textAlign: "left",
    whiteSpace: "nowrap",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: ".04em",
    color: "var(--muted-text)",
    background:
        "var(--table-header-background)",
    borderBottom:
        "1px solid var(--border-color)",
    fontWeight: "700"
};

const tdStyle = {
    padding: "14px 15px",
    textAlign: "left",
    fontSize: "13px",
    color: "var(--text-color)",
    borderBottom:
        "1px solid var(--border-color)",
    verticalAlign: "middle"
};

const rowStyle = {
    background:
        "var(--card-background)",
    transition:
        "background .15s",
    cursor: "pointer"
};

// =====================================================
// TICKET
// =====================================================

const ticketNumber = {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 8px",
    borderRadius: "6px",
    background:
        "color-mix(in srgb, var(--primary-color) 10%, var(--card-background))",
    color: "var(--primary-color)",
    border:
        "1px solid color-mix(in srgb, var(--primary-color) 20%, var(--card-background))",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap"
};

// =====================================================
// EMPLOYEE
// =====================================================

const employeeCell = {
    display: "flex",
    alignItems: "center",
    gap: "9px"
};

const employeeAvatar = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background:
        "color-mix(in srgb, var(--primary-color) 12%, var(--card-background))",
    color: "var(--primary-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "12px",
    flexShrink: 0
};

const employeeName = {
    color: "var(--text-color)",
    fontWeight: "600",
    fontSize: "13px"
};

const employeeCode = {
    marginTop: "2px",
    color: "var(--muted-text)",
    fontSize: "10px"
};

// =====================================================
// SUBJECT
// =====================================================

const subjectText = {
    color: "var(--heading-color)",
    fontWeight: "600",
    fontSize: "13px",
    maxWidth: "260px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
};

const categoryText = {
    marginTop: "4px",
    color: "var(--muted-text)",
    fontSize: "10px"
};

// =====================================================
// BADGES
// =====================================================

const badge = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
    whiteSpace: "nowrap"
};

// =====================================================
// ASSIGNED
// =====================================================

const assignedCell = {
    display: "flex",
    alignItems: "center",
    gap: "8px"
};

const assignedAvatar = {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background:
        "color-mix(in srgb, var(--success-color) 10%, var(--card-background))",
    color: "var(--success-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "11px",
    flexShrink: 0
};

const assignedName = {
    color: "var(--text-color)",
    fontSize: "12px",
    fontWeight: "500"
};

const unassignedText = {
    display: "inline-flex",
    padding: "5px 8px",
    borderRadius: "6px",
    background:
        "var(--muted-background)",
    color: "var(--muted-text)",
    fontSize: "10px",
    fontWeight: "650"
};

// =====================================================
// DATE
// =====================================================

const dateText = {
    color: "var(--text-color)",
    fontWeight: "500",
    fontSize: "12px",
    whiteSpace: "nowrap"
};

// =====================================================
// EMPTY
// =====================================================

const emptyCell = {
    padding: "70px 20px",
    textAlign: "center"
};

const emptyIcon = {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background:
        "var(--muted-background)",
    color: "var(--muted-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
    fontSize: "21px"
};

const emptyTitle = {
    color: "var(--heading-color)",
    fontWeight: "700",
    fontSize: "14px"
};

const emptyText = {
    color: "var(--muted-text)",
    fontSize: "12px",
    marginTop: "5px"
};

// =====================================================
// SKELETON
// =====================================================

const skeleton = {
    height: "13px",
    width: "75%",
    borderRadius: "5px",
    background:
        "linear-gradient(90deg, var(--muted-background), var(--border-color), var(--muted-background))",
    backgroundSize: "200% 100%",
    animation:
        "ticketManagementSkeleton 1.4s ease infinite"
};

// =====================================================
// PAGINATION
// =====================================================

const pagination = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    padding: "16px 20px",
    borderTop:
        "1px solid var(--border-color)",
    background:
        "var(--card-background)",
    flexWrap: "wrap"
};

const paginationInfo = {
    color: "var(--muted-text)",
    fontSize: "12px",
    fontWeight: "500"
};

const paginationActions = {
    display: "flex",
    alignItems: "center",
    gap: "6px"
};

const paginationButton = {
    minWidth: "90px",
    height: "36px",
    padding: "0 12px",
    borderRadius: "7px",
    border:
        "1px solid var(--border-color)",
    background:
        "var(--card-background)",
    color: "var(--text-color)",
    fontSize: "12px",
    fontWeight: "600",
    transition:
        "all .15s ease"
};

const pageNumbers = {
    display: "flex",
    alignItems: "center",
    gap: "4px"
};

const pageNumberButton = {
    width: "34px",
    height: "34px",
    borderRadius: "7px",
    border:
        "1px solid var(--border-color)",
    background:
        "var(--card-background)",
    color: "var(--text-color)",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer"
};

const activePageNumber = {
    background:
        "var(--primary-color)",
    color: "#ffffff",
    border:
        "1px solid var(--primary-color)"
};

const dotsStyle = {
    width: "24px",
    textAlign: "center",
    color: "var(--muted-text)",
    fontSize: "12px"
};

export default TicketManagement;





