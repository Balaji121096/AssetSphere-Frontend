import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Tickets() {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // =====================================================
    // FORM
    // =====================================================

    const initialForm = {
        subject: "",
        category: "IT",
        priority: "Medium",
        description: "",
        asset_id: "",
        attachment: null
    };

    const [form, setForm] = useState(initialForm);

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {
        fetchTickets();
        fetchAssets();
    }, []);

    // =====================================================
    // FETCH TICKETS
    // =====================================================

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await API.get("/tickets/my-tickets");

            if (data.success) {
                setTickets(data.data || []);
            } else {
                setTickets([]);
            }
        } catch (err) {
            console.error("Error fetching tickets:", err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch tickets"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FETCH ASSETS
    // =====================================================

    const fetchAssets = async () => {
        try {
            const { data } = await API.get("/tickets/my-assets");

            if (data.success) {
                setAssets(data.data || []);
            } else {
                setAssets([]);
            }
        } catch (err) {
            console.error("Error fetching assets:", err);
        }
    };

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "attachment") {
            setForm((prev) => ({
                ...prev,
                attachment: files?.[0] || null
            }));

            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =====================================================
    // CREATE TICKET
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const formData = new FormData();

            formData.append("subject", form.subject);
            formData.append("category", form.category);
            formData.append("priority", form.priority);
            formData.append("description", form.description);

            if (form.asset_id) {
                formData.append("asset_id", form.asset_id);
            }

            if (form.attachment) {
                formData.append(
                    "attachment",
                    form.attachment
                );
            }

            const { data } = await API.post(
                "/tickets",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (data.success) {
                setShowModal(false);
                setForm(initialForm);
                setCurrentPage(1);

                await fetchTickets();
            } else {
                alert(
                    data.message ||
                    "Failed to create ticket"
                );
            }
        } catch (err) {
            console.error(
                "Error creating ticket:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to create ticket"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredTickets = useMemo(() => {
        const searchText = search
            .trim()
            .toLowerCase();

        if (!searchText) {
            return tickets;
        }

        return tickets.filter((ticket) => {
            const text = [
                ticket.ticket_number,
                ticket.subject,
                ticket.category,
                ticket.asset_code,
                ticket.asset_name,
                ticket.priority,
                ticket.status,
                ticket.created_at
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return text.includes(searchText);
        });
    }, [tickets, search]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredTickets.length /
            itemsPerPage
        )
    );

    const paginatedTickets =
        filteredTickets.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // =====================================================
    // COUNTS
    // =====================================================

    const totalTickets = tickets.length;

    const openTickets = tickets.filter(
        (ticket) =>
            String(ticket.status || "")
                .toLowerCase() === "open"
    ).length;

    const inProgressTickets = tickets.filter(
        (ticket) =>
            String(ticket.status || "")
                .toLowerCase() === "in progress"
    ).length;

    const resolvedTickets = tickets.filter(
        (ticket) => {
            const status = String(
                ticket.status || ""
            ).toLowerCase();

            return (
                status === "resolved" ||
                status === "closed"
            );
        }
    ).length;

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (status) => {
        const value = String(
            status || ""
        ).toLowerCase();

        if (value === "open") {
            return {
                background:
                    "color-mix(in srgb, #3b82f6 12%, var(--card-background))",
                color: "#3b82f6"
            };
        }

        if (value === "assigned") {
            return {
                background:
                    "color-mix(in srgb, #f59e0b 12%, var(--card-background))",
                color: "#f59e0b"
            };
        }

        if (value === "in progress") {
            return {
                background:
                    "color-mix(in srgb, #eab308 14%, var(--card-background))",
                color: "#ca8a04"
            };
        }

        if (value === "pending") {
            return {
                background:
                    "color-mix(in srgb, #6b7280 12%, var(--card-background))",
                color: "#6b7280"
            };
        }

        if (value === "resolved") {
            return {
                background:
                    "color-mix(in srgb, #22c55e 12%, var(--card-background))",
                color: "#16a34a"
            };
        }

        if (value === "closed") {
            return {
                background:
                    "color-mix(in srgb, #9ca3af 14%, var(--card-background))",
                color: "#6b7280"
            };
        }

        return {
            background: "var(--muted-background)",
            color: "var(--muted-text)"
        };
    };

    // =====================================================
    // PRIORITY STYLE
    // =====================================================

    const getPriorityStyle = (priority) => {
        const value = String(
            priority || ""
        ).toLowerCase();

        if (value === "low") {
            return {
                background:
                    "color-mix(in srgb, #22c55e 12%, var(--card-background))",
                color: "#16a34a"
            };
        }

        if (value === "medium") {
            return {
                background:
                    "color-mix(in srgb, #eab308 14%, var(--card-background))",
                color: "#ca8a04"
            };
        }

        if (value === "high") {
            return {
                background:
                    "color-mix(in srgb, #f97316 12%, var(--card-background))",
                color: "#ea580c"
            };
        }

        if (value === "critical") {
            return {
                background:
                    "color-mix(in srgb, #ef4444 12%, var(--card-background))",
                color: "#dc2626"
            };
        }

        return {
            background: "var(--muted-background)",
            color: "var(--muted-text)"
        };
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const closeModal = () => {
        if (submitting) {
            return;
        }

        setShowModal(false);
        setForm(initialForm);
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div style={pageStyle}>

            <Sidebar />

            <div style={contentStyle}>

                <Navbar />

                <main
                    style={mainStyle}
                    className="tickets-main"
                >

                    {/* =================================================
                        HERO HEADER
                    ================================================= */}

                    <div
                        style={heroHeader}
                        className="tickets-hero"
                    >

                        <div style={heroContent}>

                            <div style={heroBreadcrumb}>

                                Dashboard

                                <span
                                    style={
                                        breadcrumbSlash
                                    }
                                >
                                    /
                                </span>

                                Tickets

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
                                    🎫
                                </div>

                                <div>

                                    <h1
                                        style={
                                            pageTitle
                                        }
                                    >
                                        My Tickets
                                    </h1>

                                    <p
                                        style={
                                            pageSubtitle
                                        }
                                    >
                                        Raise support tickets,
                                        track issues and view
                                        your ticket history.
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
                                onClick={() => {
                                    setShowModal(true);
                                }}
                                style={
                                    createTicketButton
                                }
                            >

                                <span
                                    style={
                                        plusIcon
                                    }
                                >
                                    +
                                </span>

                                Raise Ticket

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div
                        style={statsGrid}
                        className="tickets-stats"
                    >

                        <SummaryCard
                            title="Total Tickets"
                            value={totalTickets}
                            icon="#"
                            iconBackground="color-mix(in srgb, var(--primary-color) 10%, var(--card-background))"
                            iconColor="var(--primary-color)"
                        />

                        <SummaryCard
                            title="Open"
                            value={openTickets}
                            icon="○"
                            iconBackground="color-mix(in srgb, #3b82f6 10%, var(--card-background))"
                            iconColor="#3b82f6"
                        />

                        <SummaryCard
                            title="In Progress"
                            value={
                                inProgressTickets
                            }
                            icon="↻"
                            iconBackground="color-mix(in srgb, #eab308 10%, var(--card-background))"
                            iconColor="#ca8a04"
                        />

                        <SummaryCard
                            title="Resolved"
                            value={
                                resolvedTickets
                            }
                            icon="✓"
                            iconBackground="color-mix(in srgb, #22c55e 10%, var(--card-background))"
                            iconColor="#16a34a"
                        />

                    </div>


                    {/* =================================================
                        TABLE CARD
                    ================================================= */}

                    <div style={tableCard}>

                        <div style={tableHeader}>

                            <div>

                                <h2
                                    style={
                                        tableTitle
                                    }
                                >
                                    Ticket History
                                </h2>

                                <p
                                    style={
                                        tableSubtitle
                                    }
                                >
                                    {filteredTickets.length}{" "}
                                    ticket
                                    {filteredTickets.length !==
                                    1
                                        ? "s"
                                        : ""}{" "}
                                    found
                                </p>

                            </div>


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
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search ticket, subject, asset or status..."
                                    style={
                                        searchInput
                                    }
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        style={
                                            clearSearch
                                        }
                                    >
                                        ×
                                    </button>
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div
                            style={
                                tableScroll
                            }
                        >

                            <table
                                style={table}
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
                                            Subject
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Category
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Related Asset
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
                                            Date
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
                                                5
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
                                                                                1
                                                                                    ? "180px"
                                                                                    : index ===
                                                                                      3
                                                                                    ? "150px"
                                                                                    : "85px"
                                                                        }}
                                                                    />

                                                                </td>

                                                            )
                                                        )}

                                                    </tr>

                                                )
                                            )}
                                        </>

                                    ) : error ? (

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
                                                    !
                                                </div>

                                                <div
                                                    style={
                                                        emptyTitle
                                                    }
                                                >
                                                    Unable to
                                                    load tickets
                                                </div>

                                                <div
                                                    style={
                                                        emptyText
                                                    }
                                                >
                                                    {error}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        fetchTickets
                                                    }
                                                    style={
                                                        retryButton
                                                    }
                                                >
                                                    Try Again
                                                </button>

                                            </td>

                                        </tr>

                                    ) : paginatedTickets.length ===
                                      0 ? (

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
                                                    {search
                                                        ? "Try changing your search."
                                                        : "You have not raised any support tickets yet."}
                                                </div>

                                                {!search && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowModal(
                                                                true
                                                            )
                                                        }
                                                        style={
                                                            emptyActionButton
                                                        }
                                                    >
                                                        + Raise
                                                        Your First
                                                        Ticket
                                                    </button>
                                                )}

                                            </td>

                                        </tr>

                                    ) : (

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
                                                        style={
                                                            rowStyle
                                                        }
                                                        onClick={() =>
                                                            navigate(
                                                                `/tickets/${ticket.ticket_id}`
                                                            )
                                                        }
                                                        onMouseEnter={(
                                                            e
                                                        ) => {
                                                            e.currentTarget.style.background =
                                                                "var(--table-row-hover)";
                                                        }}
                                                        onMouseLeave={(
                                                            e
                                                        ) => {
                                                            e.currentTarget.style.background =
                                                                "var(--card-background)";
                                                        }}
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

                                                        </td>


                                                        {/* CATEGORY */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            <span
                                                                style={
                                                                    categoryBadge
                                                                }
                                                            >
                                                                {ticket.category ||
                                                                    "Other"}
                                                            </span>

                                                        </td>


                                                        {/* ASSET */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            {ticket.asset_code ? (

                                                                <div
                                                                    style={
                                                                        assetCell
                                                                    }
                                                                >

                                                                    <span
                                                                        style={
                                                                            assetCode
                                                                        }
                                                                    >
                                                                        {
                                                                            ticket.asset_code
                                                                        }
                                                                    </span>

                                                                    <span
                                                                        style={
                                                                            assetName
                                                                        }
                                                                    >
                                                                        {
                                                                            ticket.asset_name
                                                                        }
                                                                    </span>

                                                                </div>

                                                            ) : (

                                                                <span
                                                                    style={
                                                                        mutedText
                                                                    }
                                                                >
                                                                    No Asset
                                                                </span>

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
                                                                    ...priorityBadge,
                                                                    background:
                                                                        priorityStyle.background,
                                                                    color:
                                                                        priorityStyle.color
                                                                }}
                                                            >

                                                                <span
                                                                    style={{
                                                                        width:
                                                                            "6px",
                                                                        height:
                                                                            "6px",
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
                                                                    ...statusBadge,
                                                                    background:
                                                                        statusStyle.background,
                                                                    color:
                                                                        statusStyle.color
                                                                }}
                                                            >

                                                                <span
                                                                    style={{
                                                                        width:
                                                                            "6px",
                                                                        height:
                                                                            "6px",
                                                                        borderRadius:
                                                                            "50%",
                                                                        background:
                                                                            statusStyle.color
                                                                    }}
                                                                />

                                                                {ticket.status ||
                                                                    "Open"}

                                                            </span>

                                                        </td>


                                                        {/* DATE */}

                                                        <td
                                                            style={
                                                                tdStyle
                                                            }
                                                        >

                                                            <span
                                                                style={
                                                                    dateText
                                                                }
                                                            >
                                                                {formatDate(
                                                                    ticket.created_at
                                                                )}
                                                            </span>

                                                        </td>

                                                    </tr>

                                                );
                                            }
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        {!loading &&
                            !error &&
                            filteredTickets.length >
                                0 && (

                                <div
                                    style={
                                        pagination
                                    }
                                >

                                    <div
                                        style={
                                            paginationInfo
                                        }
                                    >

                                        Showing{" "}

                                        {(
                                            (currentPage -
                                                1) *
                                                itemsPerPage
                                        ) + 1}

                                        {" "}to{" "}

                                        {Math.min(
                                            currentPage *
                                                itemsPerPage,
                                            filteredTickets.length
                                        )}

                                        {" "}of{" "}

                                        {
                                            filteredTickets.length
                                        }{" "}
                                        tickets

                                    </div>


                                    <div
                                        style={
                                            paginationControls
                                        }
                                    >

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurrentPage(
                                                    (
                                                        prev
                                                    ) =>
                                                        Math.max(
                                                            prev -
                                                                1,
                                                            1
                                                        )
                                                )
                                            }
                                            disabled={
                                                currentPage ===
                                                1
                                            }
                                            style={{
                                                ...paginationButton,
                                                opacity:
                                                    currentPage ===
                                                    1
                                                        ? 0.5
                                                        : 1,
                                                cursor:
                                                    currentPage ===
                                                    1
                                                        ? "not-allowed"
                                                        : "pointer"
                                            }}
                                        >
                                            Previous
                                        </button>


                                        <div
                                            style={
                                                pageNumber
                                            }
                                        >
                                            Page{" "}
                                            {
                                                currentPage
                                            }{" "}
                                            of{" "}
                                            {
                                                totalPages
                                            }
                                        </div>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurrentPage(
                                                    (
                                                        prev
                                                    ) =>
                                                        Math.min(
                                                            prev +
                                                                1,
                                                            totalPages
                                                        )
                                                )
                                            }
                                            disabled={
                                                currentPage ===
                                                totalPages
                                            }
                                            style={{
                                                ...paginationButton,
                                                opacity:
                                                    currentPage ===
                                                    totalPages
                                                        ? 0.5
                                                        : 1,
                                                cursor:
                                                    currentPage ===
                                                    totalPages
                                                        ? "not-allowed"
                                                        : "pointer"
                                            }}
                                        >
                                            Next
                                        </button>

                                    </div>

                                </div>

                            )}

                    </div>

                </main>

            </div>


            {/* =====================================================
                CREATE TICKET MODAL
            ===================================================== */}

            {showModal && (

                <div
                    style={
                        modalOverlay
                    }
                    onMouseDown={(e) => {
                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeModal();
                        }
                    }}
                >

                    <div
                        style={
                            modalCard
                        }
                    >

                        {/* MODAL HEADER */}

                        <div
                            style={
                                modalHeader
                            }
                        >

                            <div
                                style={
                                    modalHeaderContent
                                }
                            >

                                <div
                                    style={
                                        modalIcon
                                    }
                                >
                                    🎫
                                </div>

                                <div>

                                    <h2
                                        style={
                                            modalTitle
                                        }
                                    >
                                        Raise a New Ticket
                                    </h2>

                                    <p
                                        style={
                                            modalSubtitle
                                        }
                                    >
                                        Provide the issue details
                                        and submit your request.
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    closeModal
                                }
                                disabled={
                                    submitting
                                }
                                style={
                                    modalClose
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            style={
                                modalForm
                            }
                        >

                            {/* SUBJECT */}

                            <div
                                style={
                                    formGroup
                                }
                            >

                                <label
                                    style={
                                        formLabel
                                    }
                                >
                                    Subject{" "}
                                    <span
                                        style={
                                            required
                                        }
                                    >
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={
                                        form.subject
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    placeholder="Brief description of the issue"
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            {/* CATEGORY + PRIORITY */}

                            <div
                                style={
                                    formRow
                                }
                            >

                                <div
                                    style={
                                        formGroup
                                    }
                                >

                                    <label
                                        style={
                                            formLabel
                                        }
                                    >
                                        Category
                                    </label>

                                    <select
                                        name="category"
                                        value={
                                            form.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={
                                            inputStyle
                                        }
                                    >

                                        <option value="IT">
                                            IT Support
                                        </option>

                                        <option value="HR">
                                            HR
                                        </option>

                                        <option value="Admin">
                                            Admin
                                        </option>

                                        <option value="Finance">
                                            Finance
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>

                                </div>


                                <div
                                    style={
                                        formGroup
                                    }
                                >

                                    <label
                                        style={
                                            formLabel
                                        }
                                    >
                                        Priority
                                    </label>

                                    <select
                                        name="priority"
                                        value={
                                            form.priority
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={
                                            inputStyle
                                        }
                                    >

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

                            </div>


                            {/* ASSET */}

                            <div
                                style={
                                    formGroup
                                }
                            >

                                <label
                                    style={
                                        formLabel
                                    }
                                >
                                    Related Asset
                                </label>

                                <select
                                    name="asset_id"
                                    value={
                                        form.asset_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={
                                        inputStyle
                                    }
                                >

                                    <option value="">
                                        No Asset (General Query)
                                    </option>

                                    {assets.map(
                                        (asset) => (

                                            <option
                                                key={
                                                    asset.asset_id
                                                }
                                                value={
                                                    asset.asset_id
                                                }
                                            >
                                                {
                                                    asset.asset_code
                                                }{" "}
                                                -{" "}
                                                {
                                                    asset.asset_name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                                <span
                                    style={
                                        helperText
                                    }
                                >
                                    Only assets currently
                                    assigned to you are shown.
                                </span>

                            </div>


                            {/* DESCRIPTION */}

                            <div
                                style={
                                    formGroup
                                }
                            >

                                <label
                                    style={
                                        formLabel
                                    }
                                >
                                    Description{" "}
                                    <span
                                        style={
                                            required
                                        }
                                    >
                                        *
                                    </span>
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    rows="5"
                                    placeholder="Please provide detailed information about your issue..."
                                    style={
                                        textareaStyle
                                    }
                                />

                            </div>


                            {/* ATTACHMENT */}

                            <div
                                style={
                                    formGroup
                                }
                            >

                                <label
                                    style={
                                        formLabel
                                    }
                                >
                                    Attachment
                                </label>

                                <div
                                    style={
                                        fileWrapper
                                    }
                                >

                                    <input
                                        type="file"
                                        name="attachment"
                                        onChange={
                                            handleChange
                                        }
                                        style={
                                            fileInput
                                        }
                                    />

                                </div>

                                {form.attachment && (

                                    <span
                                        style={
                                            helperText
                                        }
                                    >
                                        Selected:{" "}
                                        {
                                            form
                                                .attachment
                                                .name
                                        }
                                    </span>

                                )}

                            </div>


                            {/* FOOTER */}

                            <div
                                style={
                                    modalFooter
                                }
                            >

                                <button
                                    type="button"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        submitting
                                    }
                                    style={
                                        cancelButton
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    style={{
                                        ...submitButton,
                                        opacity:
                                            submitting
                                                ? 0.65
                                                : 1,
                                        cursor:
                                            submitting
                                                ? "not-allowed"
                                                : "pointer"
                                    }}
                                >

                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Ticket"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =====================================================
                ANIMATIONS + RESPONSIVE
            ===================================================== */}

            <style>
                {`
                    @keyframes ticketsSkeleton {
                        0% {
                            background-position: 200% 0;
                        }

                        100% {
                            background-position: -200% 0;
                        }
                    }

                    @keyframes ticketsFadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(4px);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .tickets-main {
                        animation: ticketsFadeIn 0.25s ease;
                    }

                    .tickets-table-row:hover {
                        background: var(--table-row-hover) !important;
                    }

                    @media (max-width: 1100px) {
                        .tickets-stats {
                            grid-template-columns:
                                repeat(2, minmax(0, 1fr)) !important;
                        }
                    }

                    @media (max-width: 700px) {
                        .tickets-hero {
                            flex-direction: column !important;
                            align-items: flex-start !important;
                        }

                        .tickets-stats {
                            grid-template-columns: 1fr !important;
                        }

                        .tickets-main {
                            padding: 18px !important;
                        }
                    }

                    @media (max-width: 600px) {
                        .tickets-form-row {
                            grid-template-columns: 1fr !important;
                        }

                        .tickets-modal-card {
                            width: calc(100% - 24px) !important;
                            max-height: 92vh !important;
                        }
                    }
                `}
            </style>

        </div>
    );
}


// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
    title,
    value,
    icon,
    iconBackground,
    iconColor
}) {
    return (
        <div style={summaryCard}>

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
                    {value}
                </div>

            </div>

        </div>
    );
}


// =====================================================
// PAGE
// =====================================================

const pageStyle = {
    display: "flex",
    minHeight: "100vh",
    background:
        "var(--app-background)",
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
    color:
        "rgba(255,255,255,0.68)",
    fontSize: "12px",
    fontWeight: "500"
};

const breadcrumbSlash = {
    color:
        "rgba(255,255,255,0.35)"
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
    color:
        "rgba(255,255,255,0.72)",
    fontSize: "13px",
    lineHeight: "1.5"
};

const headerActions = {
    display: "flex",
    alignItems: "center",
    flexShrink: 0
};


// =====================================================
// CREATE BUTTON
// =====================================================

const createTicketButton = {
    height: "42px",
    padding: "0 17px",
    border:
        "1px solid rgba(255,255,255,0.20)",
    borderRadius: "9px",
    background:
        "rgba(255,255,255,0.14)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "650",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backdropFilter:
        "blur(8px)",
    boxShadow:
        "0 4px 12px rgba(0,0,0,0.12)"
};

const plusIcon = {
    fontSize: "19px",
    lineHeight: 1
};


// =====================================================
// SUMMARY
// =====================================================

const statsGrid = {
    display: "grid",
    gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",
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
        "0 1px 3px rgba(15,23,42,0.04)"
};

const summaryIcon = {
    width: "42px",
    height: "42px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: "700",
    flexShrink: 0
};

const summaryLabel = {
    color:
        "var(--muted-text)",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "4px"
};

const summaryValue = {
    color:
        "var(--heading-color)",
    fontSize: "24px",
    fontWeight: "750",
    lineHeight: "1.25"
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
    color:
        "var(--heading-color)",
    fontWeight: "700"
};

const tableSubtitle = {
    margin: "4px 0 0",
    color:
        "var(--muted-text)",
    fontSize: "12px"
};


// =====================================================
// SEARCH
// =====================================================

const searchWrapper = {
    width: "410px",
    maxWidth: "100%",
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
    color:
        "var(--muted-text)",
    fontSize: "20px",
    lineHeight: 1
};

const searchInput = {
    flex: 1,
    minWidth: 0,
    height: "100%",
    border: "none",
    outline: "none",
    padding: "0 10px",
    color:
        "var(--text-color)",
    fontSize: "13px",
    background:
        "transparent"
};

const clearSearch = {
    width: "28px",
    height: "28px",
    border: "none",
    background: "transparent",
    color:
        "var(--muted-text)",
    fontSize: "18px",
    cursor: "pointer",
    marginRight: "5px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
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
    color:
        "var(--muted-text)",
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
    color:
        "var(--text-color)",
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
    color:
        "var(--primary-color)",
    border:
        "1px solid color-mix(in srgb, var(--primary-color) 20%, var(--card-background))",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap"
};

const subjectText = {
    color:
        "var(--heading-color)",
    fontWeight: "650",
    fontSize: "13px",
    maxWidth: "260px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
};

const categoryBadge = {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 9px",
    borderRadius: "6px",
    background:
        "var(--muted-background)",
    color:
        "var(--text-color)",
    fontSize: "11px",
    fontWeight: "650"
};


// =====================================================
// ASSET
// =====================================================

const assetCell = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "5px"
};

const assetCode = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 7px",
    borderRadius: "5px",
    background:
        "color-mix(in srgb, var(--primary-color) 10%, var(--card-background))",
    color:
        "var(--primary-color)",
    border:
        "1px solid color-mix(in srgb, var(--primary-color) 20%, var(--card-background))",
    fontSize: "10px",
    fontWeight: "700"
};

const assetName = {
    color:
        "var(--text-color)",
    fontSize: "12px",
    fontWeight: "500"
};

const mutedText = {
    color:
        "var(--muted-text)"
};


// =====================================================
// BADGES
// =====================================================

const priorityBadge = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
    whiteSpace: "nowrap"
};

const statusBadge = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
    whiteSpace: "nowrap"
};

const dateText = {
    color:
        "var(--text-color)",
    fontWeight: "500",
    whiteSpace: "nowrap"
};


// =====================================================
// PAGINATION
// =====================================================

const pagination = {
    padding: "14px 20px",
    borderTop:
        "1px solid var(--border-color)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap"
};

const paginationInfo = {
    color:
        "var(--muted-text)",
    fontSize: "12px"
};

const paginationControls = {
    display: "flex",
    alignItems: "center",
    gap: "8px"
};

const paginationButton = {
    height: "34px",
    padding: "0 12px",
    border:
        "1px solid var(--border-color)",
    borderRadius: "7px",
    background:
        "var(--card-background)",
    color:
        "var(--text-color)",
    fontSize: "12px",
    fontWeight: "600"
};

const pageNumber = {
    padding: "0 8px",
    color:
        "var(--primary-color)",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap"
};


// =====================================================
// EMPTY / ERROR
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
    color:
        "var(--muted-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
    fontSize: "21px"
};

const emptyTitle = {
    color:
        "var(--heading-color)",
    fontWeight: "700",
    fontSize: "14px"
};

const emptyText = {
    color:
        "var(--muted-text)",
    fontSize: "12px",
    marginTop: "5px"
};

const retryButton = {
    marginTop: "14px",
    padding: "9px 15px",
    border: "none",
    borderRadius: "7px",
    background:
        "var(--primary-color)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "650"
};

const emptyActionButton = {
    marginTop: "16px",
    padding: "9px 15px",
    border: "none",
    borderRadius: "7px",
    background:
        "var(--primary-color)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "650"
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
    backgroundSize:
        "200% 100%",
    animation:
        "ticketsSkeleton 1.4s ease infinite"
};


// =====================================================
// MODAL
// =====================================================

const modalOverlay = {
    position: "fixed",
    inset: 0,
    background:
        "rgba(15,23,42,0.58)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "16px",
    backdropFilter:
        "blur(5px)",
    boxSizing: "border-box"
};

const modalCard = {
    width: "100%",
    maxWidth: "650px",
    maxHeight: "88vh",
    background:
        "var(--card-background)",
    border:
        "1px solid var(--border-color)",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow:
        "0 24px 60px rgba(0,0,0,0.25)"
};

const modalHeader = {
    padding: "18px 22px",
    borderBottom:
        "1px solid var(--border-color)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    background:
        "var(--table-header-background)"
};

const modalHeaderContent = {
    display: "flex",
    alignItems: "center",
    gap: "12px"
};

const modalIcon = {
    width: "40px",
    height: "40px",
    borderRadius: "9px",
    background:
        "color-mix(in srgb, var(--primary-color) 10%, var(--card-background))",
    color:
        "var(--primary-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px"
};

const modalTitle = {
    margin: 0,
    color:
        "var(--heading-color)",
    fontSize: "17px",
    fontWeight: "700"
};

const modalSubtitle = {
    margin: "4px 0 0",
    color:
        "var(--muted-text)",
    fontSize: "11px"
};

const modalClose = {
    width: "34px",
    height: "34px",
    border: "none",
    borderRadius: "7px",
    background:
        "var(--muted-background)",
    color:
        "var(--muted-text)",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const modalForm = {
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    maxHeight: "calc(88vh - 78px)",
    overflowY: "auto",
    boxSizing: "border-box"
};

const formRow = {
    display: "grid",
    gridTemplateColumns:
        "1fr 1fr",
    gap: "15px"
};

const formGroup = {
    display: "flex",
    flexDirection: "column",
    gap: "7px"
};

const formLabel = {
    color:
        "var(--text-color)",
    fontSize: "12px",
    fontWeight: "650"
};

const required = {
    color:
        "var(--danger-color, #ef4444)"
};

const inputStyle = {
    width: "100%",
    height: "42px",
    boxSizing: "border-box",
    padding: "0 12px",
    border:
        "1px solid var(--border-color)",
    borderRadius: "8px",
    outline: "none",
    background:
        "var(--input-background)",
    color:
        "var(--text-color)",
    fontSize: "13px"
};

const textareaStyle = {
    width: "100%",
    minHeight: "110px",
    boxSizing: "border-box",
    padding: "11px 12px",
    border:
        "1px solid var(--border-color)",
    borderRadius: "8px",
    outline: "none",
    background:
        "var(--input-background)",
    color:
        "var(--text-color)",
    fontSize: "13px",
    resize: "vertical",
    fontFamily: "inherit"
};

const helperText = {
    color:
        "var(--muted-text)",
    fontSize: "10px",
    lineHeight: "1.4"
};

const fileWrapper = {
    padding: "10px",
    border:
        "1px dashed var(--border-color)",
    borderRadius: "8px",
    background:
        "var(--input-background)"
};

const fileInput = {
    width: "100%",
    color:
        "var(--text-color)",
    fontSize: "12px"
};

const modalFooter = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
    paddingTop: "5px"
};

const cancelButton = {
    height: "39px",
    padding: "0 17px",
    border:
        "1px solid var(--border-color)",
    borderRadius: "8px",
    background:
        "transparent",
    color:
        "var(--muted-text)",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "650"
};

const submitButton = {
    height: "39px",
    padding: "0 18px",
    border: "none",
    borderRadius: "8px",
    background:
        "var(--primary-color)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "650",
    boxShadow:
        "0 4px 12px rgba(99,102,241,0.20)"
};


export default Tickets;

