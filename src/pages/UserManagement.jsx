import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

/* =========================================================
   HELPERS
========================================================= */

const getToken = () => {
    return (
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        ""
    );
};

const getUserId = (user) => {
    return (
        user?.user_id ??
        user?.id ??
        user?.userId ??
        ""
    );
};

const getUserRole = (user) => {
    return String(
        user?.role ??
        user?.user_role ??
        user?.role_name ??
        ""
    ).trim();
};

const normalizeRole = (role) => {
    return String(role || "")
        .trim()
        .toLowerCase();
};

/* =========================================================
   COMPONENT
========================================================= */

export default function UserManagement() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [currentUser, setCurrentUser] = useState(null);

    /* =====================================================
       ADD / EDIT
    ===================================================== */

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        employee_code: "",
        username: "",
        password: "",
        role: "Viewer",
        status: "Active",
    });

    /* =====================================================
       RESET PASSWORD
    ===================================================== */

    const [showResetModal, setShowResetModal] = useState(false);
    const [resetUser, setResetUser] = useState(null);
    const [resetting, setResetting] = useState(false);

    const [temporaryPassword, setTemporaryPassword] =
        useState("");

    const [passwordCopied, setPasswordCopied] =
        useState(false);

    /* =====================================================
       CURRENT USER
    ===================================================== */

    useEffect(() => {
        try {
            const storedUser =
                localStorage.getItem("user") ||
                sessionStorage.getItem("user");

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setCurrentUser(parsedUser);
            }
        } catch (err) {
            console.error(
                "Unable to read logged-in user:",
                err
            );
        }
    }, []);

    /* =====================================================
       LOAD USERS
    ===================================================== */

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {
                throw new Error(
                    "Login session expired. Please login again."
                );
            }

            const response = await fetch(
                `${API_URL}/api/users`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            let data = {};

            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        data.error ||
                        "Failed to load users."
                );
            }

            const userList = Array.isArray(data)
                ? data
                : Array.isArray(data.data)
                ? data.data
                : Array.isArray(data.users)
                ? data.users
                : [];

            setUsers(userList);
        } catch (err) {
            console.error("Load Users Error:", err);

            setError(
                err.message ||
                    "Unable to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    /* =====================================================
       CURRENT USER / ROLE
    ===================================================== */

    const currentUserId = getUserId(currentUser);

    const matchedCurrentUser = users.find(
        (user) =>
            currentUserId &&
            Number(getUserId(user)) ===
                Number(currentUserId)
    );

    const currentRole =
        getUserRole(currentUser) ||
        getUserRole(matchedCurrentUser);

    const isSuperAdmin =
        normalizeRole(currentRole) ===
        "super admin";

    /* =====================================================
       STATISTICS
    ===================================================== */

    const totalUsers = users.length;

    const activeUsers = users.filter(
        (user) =>
            normalizeRole(user.status) ===
            "active"
    ).length;

    const administratorCount = users.filter(
        (user) => {
            const role = normalizeRole(
                getUserRole(user)
            );

            return (
                role === "admin" ||
                role === "super admin"
            );
        }
    ).length;

    const inactiveUsers = users.filter(
        (user) =>
            normalizeRole(user.status) ===
            "inactive"
    ).length;

    /* =====================================================
       ADD USER
    ===================================================== */

    const openAddModal = () => {
        setEditingUser(null);

        setForm({
            employee_code: "",
            username: "",
            password: "",
            role: "Viewer",
            status: "Active",
        });

        setError("");
        setMessage("");
        setShowModal(true);
    };

    /* =====================================================
       EDIT USER
    ===================================================== */

    const openEditModal = (user) => {
        setEditingUser(user);

        setForm({
            employee_code:
                user.employee_code ?? "",
            username:
                user.username ?? "",
            password: "",
            role:
                getUserRole(user) || "Viewer",
            status:
                user.status || "Active",
        });

        setError("");
        setMessage("");
        setShowModal(true);
    };

    /* =====================================================
       FORM CHANGE
    ===================================================== */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =====================================================
       SAVE USER
    ===================================================== */

    const handleSaveUser = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");
        setMessage("");

        try {
            const token = getToken();

            if (!token) {
                throw new Error(
                    "Login session expired."
                );
            }

            const employeeCode = String(
                form.employee_code || ""
            ).trim();

            if (!employeeCode) {
                throw new Error(
                    "Employee Code is required."
                );
            }

            const username = String(
                form.username || ""
            ).trim();

            if (!username) {
                throw new Error(
                    "Username is required."
                );
            }

            const userId = getUserId(
                editingUser
            );

            const url = editingUser
                ? `${API_URL}/api/users/${userId}`
                : `${API_URL}/api/users`;

            const method = editingUser
                ? "PUT"
                : "POST";

            const payload = {
                employee_code:
                    employeeCode,
                username:
                    username,
                role:
                    form.role,
                status:
                    form.status,
            };

            if (
                !editingUser ||
                form.password.trim()
            ) {
                payload.password =
                    form.password;
            }

            const response = await fetch(
                url,
                {
                    method,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        payload
                    ),
                }
            );

            let data = {};

            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        data.error ||
                        "Failed to save user."
                );
            }

            setShowModal(false);

            setMessage(
                editingUser
                    ? "User updated successfully."
                    : "User created successfully."
            );

            await loadUsers();
        } catch (err) {
            console.error(
                "Save User Error:",
                err
            );

            setError(
                err.message ||
                    "Unable to save user."
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       DELETE USER
    ===================================================== */

    const handleDeleteUser = async (user) => {
        const userId = getUserId(user);

        if (!userId) {
            alert("User ID not found.");
            return;
        }

        if (
            Number(userId) ===
            Number(currentUserId)
        ) {
            alert(
                "You cannot delete your own account."
            );
            return;
        }

        const role = getUserRole(user);

        if (
            normalizeRole(role) ===
            "super admin"
        ) {
            alert(
                "Super Admin account cannot be deleted."
            );
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${user.username}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const token = getToken();

            if (!token) {
                throw new Error(
                    "Login session expired."
                );
            }

            const response = await fetch(
                `${API_URL}/api/users/${userId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            let data = {};

            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        data.error ||
                        "Failed to delete user."
                );
            }

            setMessage(
                "User deleted successfully."
            );

            await loadUsers();
        } catch (err) {
            console.error(
                "Delete User Error:",
                err
            );

            setError(
                err.message ||
                    "Unable to delete user."
            );
        }
    };

    /* =====================================================
       RESET PASSWORD - OPEN MODAL
    ===================================================== */

    const handleResetPassword = (user) => {
        const userId = getUserId(user);

        if (!userId) {
            alert("User ID not found.");
            return;
        }

        if (
            Number(userId) ===
            Number(currentUserId)
        ) {
            alert(
                "You cannot reset your own password from User Management."
            );
            return;
        }

        setResetUser(user);
        setTemporaryPassword("");
        setPasswordCopied(false);

        setError("");
        setMessage("");

        setShowResetModal(true);
    };

    /* =====================================================
       RESET PASSWORD - CONFIRM
    ===================================================== */

    const confirmResetPassword = async () => {
        if (!resetUser) {
            return;
        }

        const userId = getUserId(resetUser);

        if (!userId) {
            setError(
                "User ID not found."
            );
            return;
        }

        try {
            setResetting(true);
            setError("");
            setMessage("");
            setPasswordCopied(false);

            const token = getToken();

            if (!token) {
                throw new Error(
                    "Login session expired. Please login again."
                );
            }

            console.log(
                "RESET PASSWORD REQUEST:",
                `${API_URL}/api/users/${userId}/reset-password`
            );

            const response = await fetch(
                `${API_URL}/api/users/${userId}/reset-password`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            let data = {};

            try {
                data =
                    await response.json();
            } catch {
                data = {};
            }

            console.log(
                "RESET PASSWORD RESPONSE:",
                data
            );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        data.error ||
                        "Failed to reset password."
                );
            }

            const generatedPassword =
                data?.temporary_password ||
                data?.data
                    ?.temporary_password ||
                data?.user
                    ?.temporary_password ||
                "";

            if (!generatedPassword) {
                throw new Error(
                    "Password reset completed, but temporary password was not returned by the server."
                );
            }

            setTemporaryPassword(
                generatedPassword
            );

            setMessage(
                data.message ||
                    "Password reset successfully."
            );
        } catch (err) {
            console.error(
                "Reset Password Error:",
                err
            );

            setError(
                err.message ||
                    "Unable to reset password."
            );
        } finally {
            setResetting(false);
        }
    };

    /* =====================================================
       COPY PASSWORD
    ===================================================== */

    const copyTemporaryPassword =
        async () => {
            if (!temporaryPassword) {
                return;
            }

            try {
                await navigator.clipboard.writeText(
                    temporaryPassword
                );

                setPasswordCopied(true);

                setTimeout(() => {
                    setPasswordCopied(
                        false
                    );
                }, 2000);
            } catch (err) {
                console.error(
                    "Copy Password Error:",
                    err
                );

                alert(
                    "Unable to copy password. Please copy it manually."
                );
            }
        };

    /* =====================================================
       CLOSE RESET MODAL
    ===================================================== */

    const closeResetModal = () => {
        if (resetting) {
            return;
        }

        setShowResetModal(false);
        setResetUser(null);
        setTemporaryPassword("");
        setPasswordCopied(false);
        setError("");
        setMessage("");
    };

    /* =====================================================
       ROLE STYLE
    ===================================================== */

    const getRoleClass = (role) => {
        const normalized =
            normalizeRole(role);

        if (
            normalized ===
            "super admin"
        ) {
            return "role-super-admin";
        }

        if (
            normalized === "admin"
        ) {
            return "role-admin";
        }

        if (
            normalized === "manager"
        ) {
            return "role-manager";
        }

        return "role-viewer";
    };

    /* =====================================================
       STATUS STYLE
    ===================================================== */

    const getStatusClass = (status) => {
        return normalizeRole(
            status
        ) === "active"
            ? "status-active"
            : "status-inactive";
    };

    /* =====================================================
       CURRENT USER CHECK
    ===================================================== */

    const isCurrentUser = (user) => {
        const userId = getUserId(user);

        return (
            currentUserId &&
            userId &&
            Number(userId) ===
                Number(currentUserId)
        );
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="page-wrapper">
            <Sidebar />

            <div className="main-content">
                <Navbar />

                <main className="user-management-page">

                    {/* HEADER */}

                    <section className="page-hero">
                        <div>
                            <div className="breadcrumb">
                                ASSETSPHERE • USER
                                MANAGEMENT
                            </div>

                            <h1>
                                User Management
                            </h1>

                            <p>
                                Manage system
                                users, roles and
                                account access.
                            </p>
                        </div>

                        <div className="hero-actions">

                            <button
                                type="button"
                                className="settings-button"
                                onClick={() =>
                                    navigate(
                                        "/settings"
                                    )
                                }
                            >
                                ← Settings
                            </button>

                            <button
                                type="button"
                                className="add-user-button"
                                onClick={
                                    openAddModal
                                }
                            >
                                + Add User
                            </button>

                        </div>
                    </section>

                    {/* ALERTS */}

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="alert alert-success">
                            {message}
                        </div>
                    )}

                    {/* STAT CARDS */}

                    <section className="stats-grid">

                        <div className="stat-card">
                            <div className="stat-icon purple">
                                👥
                            </div>

                            <div>
                                <div className="stat-label">
                                    TOTAL USERS
                                </div>

                                <div className="stat-value">
                                    {
                                        totalUsers
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon green">
                                ✓
                            </div>

                            <div>
                                <div className="stat-label">
                                    ACTIVE USERS
                                </div>

                                <div className="stat-value">
                                    {
                                        activeUsers
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon blue">
                                🛡️
                            </div>

                            <div>
                                <div className="stat-label">
                                    ADMINISTRATORS
                                </div>

                                <div className="stat-value">
                                    {
                                        administratorCount
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon red">
                                ⏸
                            </div>

                            <div>
                                <div className="stat-label">
                                    INACTIVE
                                </div>

                                <div className="stat-value">
                                    {
                                        inactiveUsers
                                    }
                                </div>
                            </div>
                        </div>

                    </section>

                    {/* USERS TABLE */}

                    <section className="users-section">

                        <div className="section-header">

                            <div>
                                <div className="section-title">
                                    System Users
                                </div>

                                <div className="section-subtitle">
                                    Users who have
                                    access to
                                    AssetSphere.
                                </div>
                            </div>

                            <div className="user-count">
                                {totalUsers} Users
                            </div>

                        </div>

                        {loading ? (
                            <div className="loading-box">
                                Loading users...
                            </div>
                        ) : users.length ===
                          0 ? (
                            <div className="empty-box">

                                <div className="empty-icon">
                                    👥
                                </div>

                                <strong>
                                    No users found
                                </strong>

                                <p>
                                    No system users
                                    are available.
                                </p>

                            </div>
                        ) : (
                            <div className="table-wrapper">

                                <table className="users-table">

                                    <thead>
                                        <tr>

                                            <th>
                                                EMPLOYEE
                                                CODE
                                            </th>

                                            <th>
                                                USERNAME
                                            </th>

                                            <th>
                                                ROLE
                                            </th>

                                            <th>
                                                STATUS
                                            </th>

                                            <th>
                                                CREATED
                                            </th>

                                            <th>
                                                ACTIONS
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {users.map(
                                            (
                                                user,
                                                index
                                            ) => {

                                                const userId =
                                                    getUserId(
                                                        user
                                                    );

                                                const role =
                                                    getUserRole(
                                                        user
                                                    );

                                                const current =
                                                    isCurrentUser(
                                                        user
                                                    );

                                                const superAdminUser =
                                                    normalizeRole(
                                                        role
                                                    ) ===
                                                    "super admin";

                                                return (
                                                    <tr
                                                        key={
                                                            userId ||
                                                            index
                                                        }
                                                    >

                                                        <td>
                                                            <span className="employee-code-badge">
                                                                {user.employee_code ||
                                                                    "-"}
                                                            </span>
                                                        </td>

                                                        <td>

                                                            <div className="username-cell">

                                                                <div className="avatar">
                                                                    {String(
                                                                        user.username ||
                                                                            "U"
                                                                    )
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>

                                                                <strong>
                                                                    {
                                                                        user.username
                                                                    }
                                                                </strong>

                                                            </div>

                                                        </td>

                                                        <td>

                                                            <span
                                                                className={`role-badge ${getRoleClass(
                                                                    role
                                                                )}`}
                                                            >
                                                                {
                                                                    role
                                                                }
                                                            </span>

                                                        </td>

                                                        <td>

                                                            <span
                                                                className={`status-badge ${getStatusClass(
                                                                    user.status
                                                                )}`}
                                                            >
                                                                •{" "}
                                                                {
                                                                    user.status
                                                                }
                                                            </span>

                                                        </td>

                                                        <td>
                                                            {user.created_at
                                                                ? new Date(
                                                                      user.created_at
                                                                  ).toLocaleDateString(
                                                                      "en-US"
                                                                  )
                                                                : "-"}
                                                        </td>

                                                        <td>

                                                            <div className="action-buttons">

                                                                {/* EDIT */}

                                                                <button
                                                                    type="button"
                                                                    className="action-button edit-button"
                                                                    title="Edit User"
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            user
                                                                        )
                                                                    }
                                                                >
                                                                    ✏️
                                                                </button>

                                                                {/* RESET PASSWORD */}

                                                                {!current && (
                                                                    <button
                                                                        type="button"
                                                                        className="action-button reset-button"
                                                                        title="Reset Password"
                                                                        onClick={() =>
                                                                            handleResetPassword(
                                                                                user
                                                                            )
                                                                        }
                                                                    >
                                                                        🔑
                                                                    </button>
                                                                )}

                                                                {/* DELETE */}

                                                                <button
                                                                    type="button"
                                                                    className={`action-button delete-button ${
                                                                        current ||
                                                                        superAdminUser
                                                                            ? "disabled-button"
                                                                            : ""
                                                                    }`}
                                                                    title={
                                                                        current
                                                                            ? "You cannot delete your own account"
                                                                            : superAdminUser
                                                                            ? "Super Admin cannot be deleted"
                                                                            : "Delete User"
                                                                    }
                                                                    disabled={
                                                                        current ||
                                                                        superAdminUser
                                                                    }
                                                                    onClick={() =>
                                                                        handleDeleteUser(
                                                                            user
                                                                        )
                                                                    }
                                                                >
                                                                    🗑️
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        )}

                    </section>

                    {/* ACCESS RULES */}

                    <section className="access-rules">

                        <div className="access-icon">
                            🛡️
                        </div>

                        <div>

                            <div className="access-title">
                                User Access Rules
                            </div>

                            <div className="access-text">

                                <strong>
                                    Super Admin
                                </strong>{" "}
                                has full access.{" "}

                                <strong>
                                    Admin
                                </strong>{" "}
                                can manage normal
                                users but cannot
                                modify or delete
                                Super Admin
                                accounts.{" "}

                                <strong>
                                    Manager
                                </strong>{" "}
                                and{" "}

                                <strong>
                                    Viewer
                                </strong>{" "}
                                do not have user
                                management access.

                            </div>

                        </div>

                    </section>

                </main>
            </div>

            {/* =========================================================
                ADD / EDIT MODAL
            ========================================================= */}

            {showModal && (
                <div className="modal-overlay">

                    <div className="modal-card">

                        <div className="modal-header">

                            <div>

                                <h2>
                                    {editingUser
                                        ? "Edit User"
                                        : "Add User"}
                                </h2>

                                <p>
                                    {editingUser
                                        ? "Update user account details."
                                        : "Create a new AssetSphere user."}
                                </p>

                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() =>
                                    setShowModal(
                                        false
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleSaveUser
                            }
                        >

                            <div className="form-grid">

                                {/* EMPLOYEE CODE */}

                                <div className="form-group">

                                    <label>
                                        Employee Code
                                    </label>

                                    <input
                                        type="text"
                                        name="employee_code"
                                        value={
                                            form.employee_code
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter Employee Code"
                                        autoComplete="off"
                                        required
                                    />

                                </div>

                                {/* USERNAME */}

                                <div className="form-group">

                                    <label>
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        name="username"
                                        value={
                                            form.username
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                                {/* PASSWORD */}

                                <div className="form-group">

                                    <label>
                                        {editingUser
                                            ? "Password (leave blank to keep current)"
                                            : "Password"}
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={
                                            form.password
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required={
                                            !editingUser
                                        }
                                    />

                                </div>

                                {/* ROLE */}

                                <div className="form-group">

                                    <label>
                                        Role
                                    </label>

                                    <select
                                        name="role"
                                        value={
                                            form.role
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="Viewer">
                                            Viewer
                                        </option>

                                        <option value="Manager">
                                            Manager
                                        </option>

                                        <option value="Admin">
                                            Admin
                                        </option>

                                        <option value="Super Admin">
                                            Super Admin
                                        </option>

                                    </select>

                                </div>

                                {/* STATUS */}

                                <div className="form-group">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            form.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="Active">
                                            Active
                                        </option>

                                        <option value="Inactive">
                                            Inactive
                                        </option>

                                    </select>

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        setShowModal(
                                            false
                                        )
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-button"
                                    disabled={
                                        saving
                                    }
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingUser
                                        ? "Update User"
                                        : "Create User"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* =========================================================
                RESET PASSWORD MODAL
            ========================================================= */}

            {showResetModal && (
                <div className="modal-overlay">

                    <div className="reset-password-modal">

                        {!temporaryPassword ? (
                            <>

                                <div className="reset-icon">
                                    🔑
                                </div>

                                <h2>
                                    Reset Password
                                </h2>

                                <p className="reset-description">
                                    Are you sure you
                                    want to reset the
                                    password for
                                </p>

                                <div className="reset-username">
                                    {
                                        resetUser?.username
                                    }
                                </div>

                                <p className="reset-warning">
                                    A new temporary
                                    password will be
                                    generated. The user
                                    must use this
                                    temporary password
                                    to login.
                                </p>

                                {error && (
                                    <div className="reset-error">
                                        {error}
                                    </div>
                                )}

                                <div className="reset-modal-actions">

                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={
                                            closeResetModal
                                        }
                                        disabled={
                                            resetting
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className="reset-confirm-button"
                                        onClick={
                                            confirmResetPassword
                                        }
                                        disabled={
                                            resetting
                                        }
                                    >
                                        {resetting
                                            ? "Resetting..."
                                            : "Reset Password"}
                                    </button>

                                </div>

                            </>
                        ) : (
                            <>

                                <div className="success-reset-icon">
                                    ✓
                                </div>

                                <h2>
                                    Password Reset
                                    Successful
                                </h2>

                                <p className="reset-description">
                                    Temporary password
                                    for
                                </p>

                                <div className="reset-username">
                                    {
                                        resetUser?.username
                                    }
                                </div>

                                <div className="temporary-password-box">

                                    <span>
                                        {
                                            temporaryPassword
                                        }
                                    </span>

                                    <button
                                        type="button"
                                        className="copy-password-button"
                                        onClick={
                                            copyTemporaryPassword
                                        }
                                    >
                                        {passwordCopied
                                            ? "✓ Copied"
                                            : "Copy"}
                                    </button>

                                </div>

                                <div className="password-notice">
                                    ⚠️ Save or share this
                                    temporary password
                                    securely. The user
                                    should change it after
                                    logging in.
                                </div>

                                <div className="reset-modal-actions">

                                    <button
                                        type="button"
                                        className="save-button close-reset-button"
                                        onClick={
                                            closeResetModal
                                        }
                                    >
                                        Done
                                    </button>

                                </div>

                            </>
                        )}

                    </div>

                </div>
            )}

            {/* =========================================================
                CSS
            ========================================================= */}

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .page-wrapper {
                    min-height: 100vh;
                    background: #e0e3e7;
                    display: flex;
                }

                .main-content {
                    flex: 1;
                    min-width: 0;
                }

                .user-management-page {
                    padding: 24px 28px 50px;
                    width: 100%;
                }

                .page-hero {
                    background: linear-gradient(
                        135deg,
                        #121b32,
                        #243f91
                    );
                    border-radius: 16px;
                    min-height: 135px;
                    padding: 28px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: white;
                    box-shadow:
                        0 12px 30px
                        rgba(
                            25,
                            47,
                            100,
                            0.15
                        );
                }

                .breadcrumb {
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 1.2px;
                    color: #9bc7ff;
                    margin-bottom: 10px;
                }

                .page-hero h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 800;
                    color: #dce7ff;
                }

                .page-hero p {
                    margin: 7px 0 0;
                    font-size: 13px;
                    color: #dce7ff;
                }

                .hero-actions {
                    display: flex;
                    gap: 9px;
                    align-items: center;
                }

                .settings-button,
                .add-user-button {
                    border-radius: 9px;
                    padding: 10px 15px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .settings-button {
                    background: rgba(
                        255,
                        255,
                        255,
                        0.12
                    );
                    border: 1px solid
                        rgba(
                            255,
                            255,
                            255,
                            0.25
                        );
                    color: white;
                }

                .add-user-button {
                    background: white;
                    border: 1px solid white;
                    color: #1d3d89;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(
                        4,
                        1fr
                    );
                    gap: 14px;
                    margin: 22px 0 18px;
                }

                .stat-card {
                    background: white;
                    border: 1px solid #e0e5ee;
                    border-radius: 14px;
                    min-height: 80px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 13px;
                }

                .stat-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 19px;
                }

                .stat-icon.purple {
                    background: #f0edff;
                }

                .stat-icon.green {
                    background: #eafff5;
                }

                .stat-icon.blue {
                    background: #eef1ff;
                }

                .stat-icon.red {
                    background: #fff0f0;
                }

                .stat-label {
                    font-size: 10px;
                    color: #8792aa;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                }

                .stat-value {
                    font-size: 20px;
                    font-weight: 800;
                    color: #14213d;
                    margin-top: 4px;
                }

                .users-section {
                    background: white;
                    border: 1px solid #dfe4ec;
                    border-radius: 15px;
                    overflow: hidden;
                }

                .section-header {
                    min-height: 76px;
                    padding: 18px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .section-title {
                    font-size: 14px;
                    color: #14213d;
                    margin-bottom: 5px;
                }

                .section-subtitle {
                    font-size: 11px;
                    color: #8a95ac;
                }

                .user-count {
                    background: #f2f5fa;
                    border: 1px solid #e0e6ef;
                    border-radius: 20px;
                    padding: 7px 12px;
                    font-size: 11px;
                    color: #66738d;
                }

                .table-wrapper {
                    width: 100%;
                    overflow-x: auto;
                }

                .users-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 900px;
                }

                .users-table th {
                    background: #f7f9fc;
                    color: #66738d;
                    font-size: 10px;
                    font-weight: 800;
                    text-align: left;
                    padding: 13px 18px;
                    border-top: 1px solid
                        #e4e8ef;
                    border-bottom: 1px solid
                        #e4e8ef;
                }

                .users-table td {
                    padding: 14px 18px;
                    border-bottom: 1px solid
                        #edf0f5;
                    font-size: 12px;
                    color: #31405b;
                    white-space: nowrap;
                }

                .users-table tbody tr:last-child td {
                    border-bottom: none;
                }

                .employee-code-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 10px;
                    border-radius: 7px;
                    background: #f2f6ff;
                    border: 1px solid #d5e0ff;
                    color: #294b9b;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.3px;
                }

                .username-cell {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .avatar {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    background: #3459e8;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    font-weight: 800;
                }

                .role-badge,
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    border-radius: 20px;
                    padding: 5px 10px;
                    font-size: 10px;
                    font-weight: 700;
                }

                .role-super-admin {
                    background: #fff1f1;
                    color: #ff4141;
                    border: 1px solid #ffcaca;
                }

                .role-admin {
                    background: #edf5ff;
                    color: #3977ee;
                    border: 1px solid #c5dcff;
                }

                .role-manager {
                    background: #f3efff;
                    color: #7048f3;
                    border: 1px solid #ddd0ff;
                }

                .role-viewer {
                    background: #f3f5f8;
                    color: #66738d;
                    border: 1px solid #dde2ea;
                }

                .status-active {
                    background: #edfff7;
                    color: #00a66b;
                    border: 1px solid #9decc9;
                }

                .status-inactive {
                    background: #fff2f2;
                    color: #e34c4c;
                    border: 1px solid #ffcaca;
                }

                .action-buttons {
                    display: flex;
                    gap: 7px;
                }

                .action-button {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    background: white;
                }

                .edit-button {
                    border: 1px solid #b8d5ff;
                    background: #f2f7ff;
                }

                .reset-button {
                    border: 1px solid #bba6ff;
                    background: #f5f0ff;
                    color: #653ee7;
                }

                .reset-button:hover {
                    background: #e9deff;
                    transform: translateY(-1px);
                }

                .delete-button {
                    border: 1px solid #ffc1c1;
                    background: #fff5f5;
                }

                .disabled-button {
                    opacity: 0.35;
                    cursor: not-allowed;
                }

                .access-rules {
                    margin-top: 16px;
                    background: #f8fafc;
                    border: 1px solid #dfe5ed;
                    border-radius: 14px;
                    padding: 14px 18px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .access-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    background: #edf4ff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .access-title {
                    font-size: 12px;
                    color: #263753;
                    margin-bottom: 5px;
                }

                .access-text {
                    font-size: 10px;
                    color: #65728a;
                    line-height: 1.6;
                }

                .loading-box,
                .empty-box {
                    padding: 50px;
                    text-align: center;
                    color: #748097;
                }

                .empty-icon {
                    font-size: 30px;
                    margin-bottom: 8px;
                }

                .empty-box p {
                    font-size: 12px;
                }

                .alert {
                    margin-top: 15px;
                    padding: 11px 15px;
                    border-radius: 9px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .alert-error {
                    background: #fff1f1;
                    color: #c62828;
                    border: 1px solid #ffcaca;
                }

                .alert-success {
                    background: #edfff7;
                    color: #008b5b;
                    border: 1px solid #b3efd5;
                }

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(
                        9,
                        18,
                        38,
                        0.55
                    );
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 20px;
                }

                .modal-card {
                    width: min(
                        560px,
                        100%
                    );
                    background: white;
                    border-radius: 16px;
                    box-shadow:
                        0 25px 70px
                        rgba(
                            0,
                            0,
                            0,
                            0.25
                        );
                    overflow: hidden;
                }

                .modal-header {
                    padding: 20px 22px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    border-bottom: 1px solid
                        #edf0f5;
                }

                .modal-header h2 {
                    margin: 0;
                    color: #17233d;
                    font-size: 20px;
                }

                .modal-header p {
                    margin: 5px 0 0;
                    color: #7c879b;
                    font-size: 11px;
                }

                .modal-close {
                    border: none;
                    background: transparent;
                    font-size: 25px;
                    color: #7b879b;
                    cursor: pointer;
                }

                .form-grid {
                    padding: 20px 22px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-group label {
                    font-size: 11px;
                    color: #45536d;
                    font-weight: 700;
                }

                .form-group input,
                .form-group select {
                    width: 100%;
                    height: 40px;
                    padding: 0 11px;
                    border: 1px solid #d8dfe9;
                    border-radius: 8px;
                    outline: none;
                    font-size: 12px;
                    color: #263753;
                }

                .form-group input:focus,
                .form-group select:focus {
                    border-color: #5579ef;
                    box-shadow:
                        0 0 0 3px
                        rgba(
                            85,
                            121,
                            239,
                            0.1
                        );
                }

                .modal-footer {
                    padding: 15px 22px;
                    border-top: 1px solid
                        #edf0f5;
                    display: flex;
                    justify-content: flex-end;
                    gap: 9px;
                }

                .cancel-button,
                .save-button,
                .reset-confirm-button {
                    border-radius: 8px;
                    padding: 10px 16px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .cancel-button {
                    background: white;
                    color: #55627a;
                    border: 1px solid #d6dde7;
                }

                .save-button {
                    background: #274492;
                    color: white;
                    border: 1px solid #274492;
                }

                .save-button:disabled,
                .cancel-button:disabled,
                .reset-confirm-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .reset-password-modal {
                    width: min(
                        430px,
                        100%
                    );
                    background: white;
                    border-radius: 18px;
                    padding: 30px;
                    text-align: center;
                    box-shadow:
                        0 25px 70px
                        rgba(
                            0,
                            0,
                            0,
                            0.28
                        );
                }

                .reset-icon,
                .success-reset-icon {
                    width: 58px;
                    height: 58px;
                    margin: 0 auto 15px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 25px;
                }

                .reset-icon {
                    background: #f1ebff;
                }

                .success-reset-icon {
                    background: #e7fff3;
                    color: #00a56c;
                    font-weight: 900;
                }

                .reset-password-modal h2 {
                    margin: 0;
                    font-size: 20px;
                    color: #18243d;
                }

                .reset-description {
                    margin: 10px 0 4px;
                    font-size: 12px;
                    color: #758198;
                }

                .reset-username {
                    font-size: 16px;
                    font-weight: 800;
                    color: #263f89;
                    margin-bottom: 15px;
                }

                .reset-warning {
                    background: #fff8e8;
                    border: 1px solid #f5dfaa;
                    color: #8a691b;
                    border-radius: 9px;
                    padding: 11px;
                    font-size: 11px;
                    line-height: 1.5;
                    text-align: left;
                    margin-bottom: 18px;
                }

                .reset-error {
                    background: #fff1f1;
                    color: #c62828;
                    border: 1px solid #ffcaca;
                    border-radius: 8px;
                    padding: 10px;
                    font-size: 11px;
                    margin-bottom: 15px;
                    text-align: left;
                }

                .reset-modal-actions {
                    display: flex;
                    justify-content: center;
                    gap: 9px;
                }

                .reset-confirm-button {
                    background: #6841df;
                    color: white;
                    border: 1px solid #6841df;
                }

                .reset-confirm-button:hover {
                    background: #5833c6;
                }

                .temporary-password-box {
                    margin: 18px 0 13px;
                    border: 1px dashed #9c87ef;
                    background: #f7f4ff;
                    border-radius: 10px;
                    min-height: 54px;
                    padding: 8px 8px 8px 14px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                }

                .temporary-password-box span {
                    font-size: 16px;
                    font-weight: 800;
                    color: #3e2b8f;
                    letter-spacing: 1px;
                    word-break: break-all;
                }

                .copy-password-button {
                    flex-shrink: 0;
                    border: 1px solid #cfc2ff;
                    background: white;
                    color: #5d3fd0;
                    border-radius: 7px;
                    padding: 8px 10px;
                    font-size: 10px;
                    font-weight: 800;
                    cursor: pointer;
                }

                .password-notice {
                    text-align: left;
                    background: #fff8e8;
                    border: 1px solid #f3dfad;
                    border-radius: 9px;
                    padding: 10px;
                    font-size: 10px;
                    line-height: 1.5;
                    color: #80641e;
                    margin-bottom: 18px;
                }

                .close-reset-button {
                    min-width: 100px;
                }

                @media (max-width: 1000px) {

                    .stats-grid {
                        grid-template-columns: repeat(
                            2,
                            1fr
                        );
                    }

                }

                @media (max-width: 700px) {

                    .user-management-page {
                        padding: 15px;
                    }

                    .page-hero {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }

                    .hero-actions {
                        width: 100%;
                    }

                    .hero-actions button {
                        flex: 1;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                }

            `}</style>
        </div>
    );
}