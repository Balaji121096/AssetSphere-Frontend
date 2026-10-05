import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function TicketDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [timeline, setTimeline] = useState({
        comments: [],
        history: []
    });

    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");

    const [employees, setEmployees] = useState([]);

    const [statusToUpdate, setStatusToUpdate] = useState("");
    const [assignedToUpdate, setAssignedToUpdate] = useState("");
    const [priorityToUpdate, setPriorityToUpdate] = useState("");

    const [updating, setUpdating] = useState(false);

    // ---------------------------------------------------------
    // Current User
    // ---------------------------------------------------------

    const currentUserStr = localStorage.getItem("user");

    const currentUser = currentUserStr
        ? JSON.parse(currentUserStr)
        : null;

    const currentRole =
        currentUser?.role ||
        currentUser?.user_role ||
        "";

    const isAdmin = [
        "Super Admin",
        "Admin",
        "Manager",
        "IT"
    ].includes(currentRole);

    // ---------------------------------------------------------
    // Fetch Data
    // ---------------------------------------------------------

    useEffect(() => {
        fetchTicketDetails();

        if (isAdmin) {
            fetchEmployees();
        }
    }, [id]);

    const fetchTicketDetails = async () => {
        try {
            setLoading(true);

            const { data } = await API.get(`/tickets/${id}`);

            if (data.success) {
                const ticketData = data.data.ticket;

                setTicket(ticketData);

                setTimeline(
                    data.data.timeline || {
                        comments: [],
                        history: []
                    }
                );

                setStatusToUpdate(ticketData.status || "");
                setPriorityToUpdate(ticketData.priority || "");
                setAssignedToUpdate(ticketData.assigned_to || "");
            }
        } catch (err) {
            console.error("Ticket details error:", err);

            alert(
                err?.response?.data?.message ||
                "Failed to load ticket details or access denied."
            );

            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const { data } = await API.get("/employees");

            if (data.success) {
                setEmployees(data.data || []);
            }
        } catch (err) {
            console.error("Employee fetch error:", err);
        }
    };

    // ---------------------------------------------------------
    // Comments
    // ---------------------------------------------------------

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!commentText.trim()) {
            return;
        }

        try {
            setUpdating(true);

            const { data } = await API.post(
                `/tickets/${id}/comments`,
                {
                    comment: commentText.trim()
                }
            );

            if (data.success) {
                setCommentText("");
                await fetchTicketDetails();
            }
        } catch (err) {
            console.error("Comment error:", err);

            alert(
                err?.response?.data?.message ||
                "Failed to add comment"
            );
        } finally {
            setUpdating(false);
        }
    };

    // ---------------------------------------------------------
    // Status
    // ---------------------------------------------------------

    const handleStatusUpdate = async () => {
        if (!statusToUpdate) return;

        try {
            setUpdating(true);

            const { data } = await API.put(
                `/tickets/${id}/status`,
                {
                    status: statusToUpdate
                }
            );

            if (data.success !== false) {
                await fetchTicketDetails();
                alert("Status updated successfully");
            }
        } catch (err) {
            console.error("Status update error:", err);

            alert(
                err?.response?.data?.message ||
                "Failed to update status"
            );
        } finally {
            setUpdating(false);
        }
    };

    // ---------------------------------------------------------
    // Priority
    // ---------------------------------------------------------

    const handlePriorityUpdate = async () => {
        if (!priorityToUpdate) return;

        try {
            setUpdating(true);

            const { data } = await API.put(
                `/tickets/${id}/priority`,
                {
                    priority: priorityToUpdate
                }
            );

            if (data.success !== false) {
                await fetchTicketDetails();
                alert("Priority updated successfully");
            }
        } catch (err) {
            console.error("Priority update error:", err);

            alert(
                err?.response?.data?.message ||
                "Failed to update priority"
            );
        } finally {
            setUpdating(false);
        }
    };

    // ---------------------------------------------------------
    // Assignment
    // ---------------------------------------------------------

    const handleAssignUpdate = async () => {
        try {
            setUpdating(true);

            const { data } = await API.put(
                `/tickets/${id}/assign`,
                {
                    assigned_to: assignedToUpdate || null
                }
            );

            if (data.success !== false) {
                await fetchTicketDetails();
                alert("Ticket assigned successfully");
            }
        } catch (err) {
            console.error("Assignment error:", err);

            alert(
                err?.response?.data?.message ||
                "Failed to assign ticket"
            );
        } finally {
            setUpdating(false);
        }
    };

    // ---------------------------------------------------------
    // Status Colors
    // ---------------------------------------------------------

    const getStatusStyle = (status) => {
        switch (status) {
            case "Open":
                return {
                    bg: "rgba(59, 130, 246, 0.12)",
                    color: "#2563eb",
                    border: "rgba(59, 130, 246, 0.25)"
                };

            case "Assigned":
                return {
                    bg: "rgba(245, 158, 11, 0.12)",
                    color: "#d97706",
                    border: "rgba(245, 158, 11, 0.25)"
                };

            case "In Progress":
                return {
                    bg: "rgba(234, 179, 8, 0.12)",
                    color: "#ca8a04",
                    border: "rgba(234, 179, 8, 0.25)"
                };

            case "Pending":
                return {
                    bg: "rgba(107, 114, 128, 0.12)",
                    color: "#6b7280",
                    border: "rgba(107, 114, 128, 0.25)"
                };

            case "Resolved":
                return {
                    bg: "rgba(34, 197, 94, 0.12)",
                    color: "#16a34a",
                    border: "rgba(34, 197, 94, 0.25)"
                };

            case "Closed":
                return {
                    bg: "rgba(156, 163, 175, 0.15)",
                    color: "#6b7280",
                    border: "rgba(156, 163, 175, 0.25)"
                };

            default:
                return {
                    bg: "rgba(107, 114, 128, 0.12)",
                    color: "#6b7280",
                    border: "rgba(107, 114, 128, 0.25)"
                };
        }
    };

    // ---------------------------------------------------------
    // Priority Colors
    // ---------------------------------------------------------

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case "Low":
                return {
                    bg: "rgba(34, 197, 94, 0.12)",
                    color: "#16a34a",
                    border: "rgba(34, 197, 94, 0.25)"
                };

            case "Medium":
                return {
                    bg: "rgba(234, 179, 8, 0.12)",
                    color: "#ca8a04",
                    border: "rgba(234, 179, 8, 0.25)"
                };

            case "High":
                return {
                    bg: "rgba(249, 115, 22, 0.12)",
                    color: "#ea580c",
                    border: "rgba(249, 115, 22, 0.25)"
                };

            case "Critical":
                return {
                    bg: "rgba(239, 68, 68, 0.12)",
                    color: "#dc2626",
                    border: "rgba(239, 68, 68, 0.25)"
                };

            default:
                return {
                    bg: "rgba(107, 114, 128, 0.12)",
                    color: "#6b7280",
                    border: "rgba(107, 114, 128, 0.25)"
                };
        }
    };

    // ---------------------------------------------------------
    // Timeline
    // ---------------------------------------------------------

    const comments = Array.isArray(timeline?.comments)
        ? timeline.comments
        : [];

    const history = Array.isArray(timeline?.history)
        ? timeline.history
        : [];

    const mergedTimeline = [
        ...comments.map((item) => ({
            ...item,
            type: "comment",
            date: new Date(item.created_at)
        })),

        ...history.map((item) => ({
            ...item,
            type: "history",
            date: new Date(item.created_at)
        }))
    ].sort((a, b) => a.date - b.date);

    // ---------------------------------------------------------
    // Timeline User Name
    // ---------------------------------------------------------

    const getUserName = (item) => {
        return (
            item.display_name ||
            item.username ||
            item.name ||
            "User"
        );
    };

    const getInitial = (item) => {
        const name = getUserName(item);

        return name
            .trim()
            .charAt(0)
            .toUpperCase() || "U";
    };

    // ---------------------------------------------------------
    // Loading
    // ---------------------------------------------------------

    if (loading) {
        return (
            <div className="ticket-page">
                <Sidebar />

                <div className="ticket-main">
                    <Navbar />

                    <div className="ticket-loading">
                        <div className="loading-spinner"></div>
                        <span>Loading ticket details...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="ticket-page">
                <Sidebar />

                <div className="ticket-main">
                    <Navbar />

                    <div className="ticket-empty">
                        <h2>Ticket not found</h2>

                        <button
                            onClick={() => navigate(-1)}
                            className="primary-button"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const statusStyle = getStatusStyle(ticket.status);
    const priorityStyle = getPriorityStyle(ticket.priority);

    return (
        <>
            <div className="ticket-page">

                {/* =====================================================
                    SIDEBAR
                ===================================================== */}

                <Sidebar />

                {/* =====================================================
                    MAIN
                ===================================================== */}

                <div className="ticket-main">

                    <Navbar />

                    <div className="ticket-content">

                        {/* =================================================
                            TOP HEADER
                        ================================================= */}

                        <div className="ticket-header-card">

                            <button
                                onClick={() => navigate(-1)}
                                className="back-button"
                            >
                                ← Back to Tickets
                            </button>

                            <div className="ticket-header-row">

                                <div>
                                    <div className="ticket-title-row">

                                        <h1>
                                            {ticket.ticket_number}
                                        </h1>

                                        <span
                                            className="status-badge"
                                            style={{
                                                backgroundColor:
                                                    statusStyle.bg,
                                                color:
                                                    statusStyle.color,
                                                borderColor:
                                                    statusStyle.border
                                            }}
                                        >
                                            {ticket.status}
                                        </span>

                                        <span
                                            className="status-badge"
                                            style={{
                                                backgroundColor:
                                                    priorityStyle.bg,
                                                color:
                                                    priorityStyle.color,
                                                borderColor:
                                                    priorityStyle.border
                                            }}
                                        >
                                            {ticket.priority}
                                        </span>

                                    </div>

                                    <p className="created-date">
                                        Created on{" "}
                                        {new Date(
                                            ticket.created_at
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <div className="header-indicator">
                                    <span></span>
                                    Ticket Details
                                </div>

                            </div>
                        </div>

                        {/* =================================================
                            BODY
                        ================================================= */}

                        <div className="ticket-layout">

                            {/* =================================================
                                LEFT COLUMN
                            ================================================= */}

                            <div className="ticket-left">

                                {/* -----------------------------------------
                                    TICKET INFORMATION
                                ----------------------------------------- */}

                                <div className="dark-header-card">

                                    <div className="section-header">
                                        TICKET INFORMATION
                                    </div>

                                    <div className="ticket-info-body">

                                        <h2>
                                            {ticket.subject}
                                        </h2>

                                        <div className="ticket-description">
                                            {ticket.description ||
                                                "No description provided."}
                                        </div>

                                        {ticket.attachment_path && (
                                            <div className="attachment-section">

                                                <div className="small-label">
                                                    ATTACHMENT
                                                </div>

                                                {ticket.attachment_path.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                                    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                                                        <img
                                                            src={`http://192.168.1.158:5000/api/tickets/attachments${ticket.attachment_path.replace('/uploads/ticket-attachments', '')}?token=${localStorage.getItem('token') || sessionStorage.getItem('token')}`}
                                                            alt="Attachment Preview"
                                                            style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px", border: "1px solid var(--border-color, #e5e7eb)" }}
                                                        />
                                                    </div>
                                                ) : null}
                                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                                                    <a
                                                        href={`http://192.168.1.158:5000/api/tickets/attachments${ticket.attachment_path.replace('/uploads/ticket-attachments', '')}?token=${localStorage.getItem('token') || sessionStorage.getItem('token')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="attachment-button"
                                                    >
                                                        ?? View File ?
                                                    </a>
                                                    <a
                                                        href={`http://192.168.1.158:5000/api/tickets/attachments${ticket.attachment_path.replace('/uploads/ticket-attachments', '')}/download?token=${localStorage.getItem('token') || sessionStorage.getItem('token')}`}
                                                        className="attachment-button"
                                                        style={{ background: "rgba(34, 197, 94, 0.12)", borderColor: "rgba(34, 197, 94, 0.25)", color: "#16a34a" }}
                                                    >
                                                        ? Download File
                                                    </a>
                                                </div>

                                            </div>
                                        )}

                                    </div>
                                </div>

                                {/* -----------------------------------------
                                    ACTIVITY TIMELINE
                                ----------------------------------------- */}

                                <div className="timeline-card">

                                    <div className="timeline-header">

                                        <div>
                                            <div className="timeline-title">
                                                Ticket updates and comments
                                            </div>
                                        </div>

                                        <div className="timeline-count">
                                            {mergedTimeline.length}
                                        </div>

                                    </div>

                                    <div className="timeline-body">

                                        {mergedTimeline.length > 0 ? (

                                            mergedTimeline.map(
                                                (item, index) => {

                                                    const userName =
                                                        getUserName(item);

                                                    return (
                                                        <div
                                                            key={
                                                                item.id ||
                                                                item.history_id ||
                                                                item.comment_id ||
                                                                index
                                                            }
                                                            className="timeline-item"
                                                        >

                                                            {/* Avatar */}

                                                            <div className="timeline-avatar">
                                                                {getInitial(item)}
                                                            </div>

                                                            {/* Content */}

                                                            <div className="timeline-content">

                                                                <div className="timeline-meta">

                                                                    <div className="timeline-user">

                                                                        <span className="timeline-user-name">
                                                                            {userName}
                                                                        </span>

                                                                        {item.role && (
                                                                            <span className="timeline-role">
                                                                                ({item.role})
                                                                            </span>
                                                                        )}

                                                                    </div>

                                                                    <span className="timeline-date">
                                                                        {item.date.toLocaleString()}
                                                                    </span>

                                                                </div>

                                                                {item.type ===
                                                                "history" ? (

                                                                    <div className="history-message">

                                                                        <span>
                                                                            Status changed from
                                                                        </span>

                                                                        <strong>
                                                                            {item.old_status ||
                                                                                "None"}
                                                                        </strong>

                                                                        <span>
                                                                            to
                                                                        </span>

                                                                        <strong>
                                                                            {item.new_status ||
                                                                                item.status ||
                                                                                "Unknown"}
                                                                        </strong>

                                                                    </div>

                                                                ) : (

                                                                    <div className="comment-message">
                                                                        {item.comment ||
                                                                            item.message ||
                                                                            "No comment"}
                                                                    </div>

                                                                )}

                                                            </div>

                                                        </div>
                                                    );
                                                }
                                            )

                                        ) : (

                                            <div className="no-activity">
                                                No activity yet.
                                            </div>

                                        )}

                                        {/* -------------------------------------
                                            ADD COMMENT
                                        ------------------------------------- */}

                                        <div className="comment-divider"></div>

                                        <form
                                            onSubmit={
                                                handleCommentSubmit
                                            }
                                            className="comment-form"
                                        >

                                            <label>
                                                Add Comment
                                            </label>

                                            <textarea
                                                value={commentText}
                                                onChange={(e) =>
                                                    setCommentText(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Type a comment or update here..."
                                                rows={4}
                                            />

                                            <button
                                                type="submit"
                                                disabled={
                                                    !commentText.trim() ||
                                                    updating
                                                }
                                                className="comment-button"
                                            >
                                                {updating
                                                    ? "Posting..."
                                                    : "Post Comment"}
                                            </button>

                                        </form>

                                    </div>
                                </div>

                            </div>

                            {/* =================================================
                                RIGHT COLUMN
                            ================================================= */}

                            <div className="ticket-right">

                                {/* -----------------------------------------
                                    ADMIN CONTROLS
                                ----------------------------------------- */}

                                {isAdmin && (
                                    <div className="admin-card">

                                        <div className="admin-header">
                                            <h3>ADMIN CONTROLS</h3>

                                            <p>
                                                Manage ticket status,
                                                priority and assignment
                                            </p>
                                        </div>

                                        <div className="admin-body">

                                            {/* STATUS */}

                                            <div className="control-group">

                                                <label>
                                                    UPDATE STATUS
                                                </label>

                                                <div className="control-row">

                                                    <select
                                                        value={
                                                            statusToUpdate
                                                        }
                                                        onChange={(e) =>
                                                            setStatusToUpdate(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
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

                                                    <button
                                                        onClick={
                                                            handleStatusUpdate
                                                        }
                                                        disabled={updating}
                                                    >
                                                        Update
                                                    </button>

                                                </div>
                                            </div>

                                            {/* PRIORITY */}

                                            <div className="control-group">

                                                <label>
                                                    UPDATE PRIORITY
                                                </label>

                                                <div className="control-row">

                                                    <select
                                                        value={
                                                            priorityToUpdate
                                                        }
                                                        onChange={(e) =>
                                                            setPriorityToUpdate(
                                                                e.target.value
                                                            )
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

                                                    <button
                                                        onClick={
                                                            handlePriorityUpdate
                                                        }
                                                        disabled={updating}
                                                    >
                                                        Update
                                                    </button>

                                                </div>
                                            </div>

                                            {/* ASSIGN */}

                                            <div className="control-group">

                                                <label>
                                                    ASSIGN TO
                                                </label>

                                                <div className="control-row">

                                                    <select
                                                        value={
                                                            assignedToUpdate
                                                        }
                                                        onChange={(e) =>
                                                            setAssignedToUpdate(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            Unassigned
                                                        </option>

                                                        {employees.map(
                                                            (emp) => (
                                                                <option
                                                                    key={
                                                                        emp.employee_id
                                                                    }
                                                                    value={
                                                                        emp.employee_id
                                                                    }
                                                                >
                                                                    {emp.display_name ||
                                                                        emp.name ||
                                                                        emp.username}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>

                                                    <button
                                                        onClick={
                                                            handleAssignUpdate
                                                        }
                                                        disabled={updating}
                                                    >
                                                        Assign
                                                    </button>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )}

                                {/* -----------------------------------------
                                    REQUESTER
                                ----------------------------------------- */}

                                <div className="side-card">

                                    <div className="side-card-header">
                                        REQUESTER
                                    </div>

                                    <div className="side-card-body">

                                        <div className="person-row">

                                            <div className="person-avatar">
                                                {(
                                                    ticket.employee_name ||
                                                    "U"
                                                )
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>

                                                <div className="person-name">
                                                    {ticket.employee_name ||
                                                        "Unknown"}
                                                </div>

                                                <div className="person-code">
                                                    {ticket.employee_code ||
                                                        "-"}
                                                </div>

                                            </div>

                                        </div>

                                        <div className="info-row">
                                            <span>
                                                Employee Code
                                            </span>

                                            <strong>
                                                {ticket.employee_code ||
                                                    "-"}
                                            </strong>
                                        </div>

                                        <div className="info-row">
                                            <span>
                                                Department
                                            </span>

                                            <strong>
                                                {ticket.department ||
                                                    "-"}
                                            </strong>
                                        </div>

                                    </div>
                                </div>

                                {/* -----------------------------------------
                                    RELATED ASSET
                                ----------------------------------------- */}

                                {ticket.asset_id && (
                                    <div className="side-card">

                                        <div className="side-card-header">
                                            RELATED ASSET
                                        </div>

                                        <div className="side-card-body">

                                            <div className="asset-title-row">

                                                <div className="asset-icon">
                                                    💻
                                                </div>

                                                <div>

                                                    <div className="asset-name">
                                                        {ticket.asset_name ||
                                                            "Asset"}
                                                    </div>

                                                    <div className="asset-code">
                                                        {ticket.asset_code ||
                                                            "-"}
                                                    </div>

                                                </div>

                                            </div>

                                            <div className="info-row">
                                                <span>
                                                    Asset Code
                                                </span>

                                                <strong>
                                                    {ticket.asset_code ||
                                                        "-"}
                                                </strong>
                                            </div>

                                            <div className="info-row">
                                                <span>
                                                    Brand
                                                </span>

                                                <strong>
                                                    {ticket.brand ||
                                                        "-"}
                                                </strong>
                                            </div>

                                            <div className="info-row">
                                                <span>
                                                    Model
                                                </span>

                                                <strong>
                                                    {ticket.model ||
                                                        "-"}
                                                </strong>
                                            </div>

                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* =============================================================
                STYLES
            ============================================================= */}

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .ticket-page {
                    display: flex;
                    min-height: 100vh;
                    background: var(--app-background, #f4f6f8);
                    color: var(--text-color, #111827);
                }

                .ticket-main {
                    flex: 1;
                    min-width: 0;
                    background: var(--app-background, #f4f6f8);
                }

                .ticket-content {
                    padding: 20px;
                    max-width: 1500px;
                    margin: 0 auto;
                }

                /* =========================================================
                   HEADER
                ========================================================= */

                .ticket-header-card {
                    background: var(--card-color, #ffffff);
                    border: 1px solid var(--border-color, #dfe3e8);
                    border-radius: 10px;
                    padding: 18px;
                    margin-bottom: 18px;
                    box-shadow: var(--card-shadow, 0 1px 4px rgba(0,0,0,0.08));
                }

                .back-button {
                    border: none;
                    background: transparent;
                    color: var(--primary-color, #2563eb);
                    cursor: pointer;
                    padding: 0;
                    margin-bottom: 14px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .back-button:hover {
                    text-decoration: underline;
                }

                .ticket-header-row {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 20px;
                }

                .ticket-title-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .ticket-title-row h1 {
                    margin: 0;
                    color: var(--text-color, #111827);
                    font-size: 23px;
                    font-weight: 700;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px 10px;
                    border-radius: 20px;
                    border: 1px solid;
                    font-size: 11px;
                    font-weight: 600;
                    line-height: 1;
                }

                .created-date {
                    margin: 6px 0 0;
                    color: var(--muted-text-color, #64748b);
                    font-size: 11px;
                }

                .header-indicator {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: var(--muted-text-color, #64748b);
                    font-size: 11px;
                    white-space: nowrap;
                    padding-top: 5px;
                }

                .header-indicator span {
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #22c55e;
                }

                /* =========================================================
                   TWO COLUMN
                ========================================================= */

                .ticket-layout {
                    display: grid;
                    grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
                    gap: 18px;
                    align-items: start;
                }

                .ticket-left,
                .ticket-right {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                    min-width: 0;
                }

                /* =========================================================
                   COMMON DARK HEADER
                ========================================================= */

                .dark-header-card,
                .timeline-card,
                .admin-card,
                .side-card {
                    background: var(--card-color, #ffffff);
                    border: 1px solid var(--border-color, #dfe3e8);
                    border-radius: 9px;
                    overflow: hidden;
                    box-shadow: var(--card-shadow, 0 1px 4px rgba(0,0,0,0.08));
                }

                .section-header,
                .timeline-header,
                .admin-header,
                .side-card-header {
                    background: #111827;
                    color: #ffffff;
                }

                /* =========================================================
                   TICKET INFORMATION
                ========================================================= */

                .section-header {
                    padding: 12px 16px;
                    font-size: 10px;
                    letter-spacing: 0.6px;
                    font-weight: 600;
                }

                .ticket-info-body {
                    padding: 20px 16px;
                }

                .ticket-info-body h2 {
                    margin: 0 0 12px;
                    color: var(--text-color, #111827);
                    font-size: 16px;
                    font-weight: 700;
                }

                .ticket-description {
                    color: var(--text-color, #111827);
                    font-size: 13px;
                    line-height: 1.7;
                    white-space: pre-wrap;
                }

                .attachment-section {
                    margin-top: 18px;
                    padding-top: 16px;
                    border-top: 1px solid var(--border-color, #e5e7eb);
                }

                .small-label {
                    color: var(--muted-text-color, #64748b);
                    font-size: 10px;
                    font-weight: 700;
                    margin-bottom: 8px;
                }

                .attachment-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 8px 12px;
                    border-radius: 6px;
                    background: var(--sidebar-color, #f8fafc);
                    border: 1px solid var(--border-color, #e5e7eb);
                    color: var(--primary-color, #2563eb);
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 600;
                }

                /* =========================================================
                   TIMELINE HEADER
                ========================================================= */

                .timeline-header {
                    padding: 13px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .timeline-title {
                    color: #94a3b8;
                    font-size: 10px;
                    font-weight: 500;
                }

                .timeline-count {
                    min-width: 21px;
                    height: 21px;
                    border-radius: 50%;
                    background: #ffffff;
                    color: #334155;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: 700;
                }

                .timeline-body {
                    padding: 16px;
                    background: var(--card-color, #ffffff);
                }

                /* =========================================================
                   TIMELINE ITEM
                ========================================================= */

                .timeline-item {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 13px;
                }

                .timeline-avatar {
                    width: 28px;
                    height: 28px;
                    min-width: 28px;
                    border-radius: 50%;
                    background: #2563eb;
                    color: #ffffff !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 700;
                    margin-top: 2px;
                }

                /*
                 * IMPORTANT FIX:
                 *
                 * Timeline content uses explicit LIGHT TEXT because
                 * timeline card is intentionally dark.
                 *
                 * Do NOT use var(--text-color) here.
                 */

                .timeline-content {
                    flex: 1;
                    min-width: 0;
                    background: #111827 !important;
                    border-radius: 7px;
                    padding: 10px 12px;
                    border: 1px solid #1f2937;
                    color: #e5e7eb !important;
                }

                .timeline-meta {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 7px;
                }

                .timeline-user {
                    min-width: 0;
                }

                .timeline-user-name {
                    color: #ffffff !important;
                    font-size: 11px;
                    font-weight: 700;
                }

                .timeline-role {
                    color: #94a3b8 !important;
                    font-size: 10px;
                    margin-left: 5px;
                }

                .timeline-date {
                    color: #64748b !important;
                    font-size: 9px;
                    white-space: nowrap;
                }

                .history-message {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    flex-wrap: wrap;
                    color: #cbd5e1 !important;
                    font-size: 11px;
                    line-height: 1.6;
                }

                .history-message span {
                    color: #94a3b8 !important;
                }

                .history-message strong {
                    color: #f8fafc !important;
                    font-weight: 600;
                }

                .comment-message {
                    color: #f1f5f9 !important;
                    font-size: 12px;
                    line-height: 1.6;
                    white-space: pre-wrap;
                    word-break: break-word;
                }

                .no-activity {
                    padding: 25px 10px;
                    text-align: center;
                    color: var(--muted-text-color, #64748b);
                    font-size: 12px;
                }

                /* =========================================================
                   COMMENT FORM
                ========================================================= */

                .comment-divider {
                    height: 1px;
                    background: var(--border-color, #e5e7eb);
                    margin: 18px 0 14px;
                }

                .comment-form {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .comment-form label {
                    color: var(--text-color, #111827);
                    font-size: 11px;
                    font-weight: 600;
                }

                .comment-form textarea {
                    width: 100%;
                    min-height: 70px;
                    resize: vertical;
                    padding: 10px;
                    border-radius: 7px;
                    border: 1px solid var(--border-color, #dfe3e8);
                    background: var(--app-background, #f8fafc);
                    color: var(--text-color, #111827);
                    outline: none;
                    font-size: 11px;
                    font-family: inherit;
                }

                .comment-form textarea:focus {
                    border-color: var(--primary-color, #2563eb);
                    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
                }

                .comment-form textarea::placeholder {
                    color: #94a3b8;
                }

                .comment-button {
                    align-self: flex-end;
                    border: none;
                    border-radius: 6px;
                    padding: 8px 14px;
                    background: var(--primary-color, #2563eb);
                    color: #ffffff;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .comment-button:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                /* =========================================================
                   ADMIN
                ========================================================= */

                .admin-header {
                    padding: 15px;
                }

                .admin-header h3 {
                    margin: 0 0 7px;
                    color: #ffffff;
                    font-size: 11px;
                    letter-spacing: 0.5px;
                    font-weight: 700;
                }

                .admin-header p {
                    margin: 0;
                    color: #64748b;
                    font-size: 10px;
                    line-height: 1.5;
                }

                .admin-body {
                    padding: 15px;
                }

                .control-group {
                    margin-bottom: 16px;
                }

                .control-group:last-child {
                    margin-bottom: 0;
                }

                .control-group label {
                    display: block;
                    color: var(--text-color, #334155);
                    font-size: 9px;
                    font-weight: 700;
                    margin-bottom: 6px;
                }

                .control-row {
                    display: flex;
                    gap: 7px;
                }

                .control-row select {
                    flex: 1;
                    min-width: 0;
                    padding: 8px 9px;
                    border-radius: 6px;
                    border: 1px solid var(--border-color, #dfe3e8);
                    background: var(--card-color, #ffffff);
                    color: var(--text-color, #111827);
                    font-size: 11px;
                    outline: none;
                }

                .control-row select:focus {
                    border-color: var(--primary-color, #2563eb);
                }

                .control-row button {
                    padding: 8px 11px;
                    border: none;
                    border-radius: 6px;
                    background: var(--primary-color, #2563eb);
                    color: #ffffff;
                    font-size: 10px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .control-row button:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                /* =========================================================
                   SIDE CARDS
                ========================================================= */

                .side-card-header {
                    padding: 13px 15px;
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }

                .side-card-body {
                    padding: 14px;
                }

                .person-row,
                .asset-title-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 14px;
                }

                .person-avatar {
                    width: 30px;
                    height: 30px;
                    min-width: 30px;
                    border-radius: 50%;
                    background: #2563eb;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 700;
                }

                .person-name {
                    color: var(--text-color, #111827);
                    font-size: 12px;
                    font-weight: 700;
                }

                .person-code {
                    color: var(--muted-text-color, #64748b);
                    font-size: 10px;
                    margin-top: 2px;
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                    padding: 8px 0;
                    border-top: 1px solid var(--border-color, #e5e7eb);
                }

                .info-row span {
                    color: var(--muted-text-color, #64748b);
                    font-size: 9px;
                }

                .info-row strong {
                    color: var(--text-color, #111827);
                    font-size: 9px;
                    text-align: right;
                    font-weight: 600;
                }

                .asset-icon {
                    width: 30px;
                    height: 30px;
                    border-radius: 6px;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 15px;
                }

                .asset-name {
                    color: var(--text-color, #111827);
                    font-size: 11px;
                    font-weight: 700;
                }

                .asset-code {
                    color: var(--muted-text-color, #64748b);
                    font-size: 9px;
                    margin-top: 2px;
                }

                /* =========================================================
                   LOADING
                ========================================================= */

                .ticket-loading {
                    min-height: 70vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    color: var(--muted-text-color, #64748b);
                    font-size: 13px;
                }

                .loading-spinner {
                    width: 26px;
                    height: 26px;
                    border: 3px solid #e5e7eb;
                    border-top-color: var(--primary-color, #2563eb);
                    border-radius: 50%;
                    animation: ticket-spin 0.8s linear infinite;
                }

                @keyframes ticket-spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .ticket-empty {
                    padding: 60px;
                    text-align: center;
                }

                .ticket-empty h2 {
                    color: var(--text-color, #111827);
                    margin-bottom: 15px;
                }

                .primary-button {
                    padding: 9px 16px;
                    border: none;
                    border-radius: 6px;
                    background: var(--primary-color, #2563eb);
                    color: #ffffff;
                    cursor: pointer;
                }

                /* =========================================================
                   RESPONSIVE
                ========================================================= */

                @media (max-width: 1000px) {

                    .ticket-layout {
                        grid-template-columns: 1fr;
                    }

                    .ticket-right {
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .admin-card {
                        grid-column: 1 / -1;
                    }
                }

                @media (max-width: 700px) {

                    .ticket-content {
                        padding: 12px;
                    }

                    .ticket-header-row {
                        flex-direction: column;
                    }

                    .header-indicator {
                        display: none;
                    }

                    .ticket-title-row h1 {
                        font-size: 20px;
                    }

                    .ticket-right {
                        display: flex;
                    }

                    .timeline-meta {
                        flex-direction: column;
                        gap: 4px;
                    }

                    .timeline-date {
                        white-space: normal;
                    }

                    .control-row {
                        flex-direction: column;
                    }

                    .control-row button {
                        width: 100%;
                    }
                }

            `}</style>
        </>
    );
}

export default TicketDetails;





