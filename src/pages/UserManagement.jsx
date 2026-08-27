import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

function UserManagement() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [saving, setSaving] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);

    const [form, setForm] = useState({
        employee_id: "",
        username: "",
        password: "",
        role: "Viewer",
        status: "Active"
    });


    // =====================================================
    // GET TOKEN
    // =====================================================

    const getToken = () => {

        return (
            localStorage.getItem("token") ||
            sessionStorage.getItem("token") ||
            ""
        );

    };


    // =====================================================
    // LOAD CURRENT USER
    // =====================================================

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem("user") ||
                sessionStorage.getItem("user");

            if (!storedUser) {
                return;
            }

            const parsedUser =
                JSON.parse(storedUser);

            setCurrentUser(parsedUser);

        } catch (err) {

            console.error(
                "Current user parse error:",
                err
            );

        }

    }, []);


    // =====================================================
    // CURRENT ROLE
    // =====================================================

    const currentRole =
        currentUser?.role ||
        currentUser?.user_role ||
        "";


    // =====================================================
    // LOAD USERS
    // =====================================================

    const loadUsers = async () => {

        setLoading(true);
        setError("");

        try {

            const token = getToken();

            if (!token) {

                setError(
                    "Login token not found. Please login again."
                );

                setUsers([]);

                return;
            }


            const response = await fetch(
                `${API_URL}/api/users`,
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
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
                    `Failed to load users (${response.status})`
                );

            }


            const userList =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : Array.isArray(data.users)
                            ? data.users
                            : [];


            setUsers(userList);

        } catch (err) {

            console.error(
                "Load Users Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load users."
            );

            setUsers([]);

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadUsers();

    }, []);


    // =====================================================
    // ADD USER
    // =====================================================

    const handleAddUser = () => {

        setEditingUser(null);

        setForm({
            employee_id: "",
            username: "",
            password: "",
            role: "Viewer",
            status: "Active"
        });

        setError("");
        setMessage("");

        setShowModal(true);

    };


    // =====================================================
    // EDIT USER
    // =====================================================

    const handleEditUser = (user) => {

        if (
            currentRole === "Admin" &&
            user.role === "Super Admin"
        ) {

            alert(
                "Admin cannot edit a Super Admin account."
            );

            return;
        }


        setEditingUser(user);

        setForm({
            employee_id: user.employee_id || "",
            username: user.username || "",
            password: "",
            role: user.role || "Viewer",
            status: user.status || "Active"
        });

        setError("");
        setMessage("");

        setShowModal(true);

    };


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);
        setError("");
        setMessage("");

        try {

            const token = getToken();

            if (!token) {

                throw new Error(
                    "Login token not found. Please login again."
                );

            }


            // =================================================
            // VALIDATION
            // =================================================

            if (!form.employee_id) {

                throw new Error(
                    "Employee ID is required."
                );

            }


            if (!form.username.trim()) {

                throw new Error(
                    "Username is required."
                );

            }


            if (!editingUser && !form.password) {

                throw new Error(
                    "Password is required."
                );

            }


            if (
                !editingUser &&
                form.password.length < 6
            ) {

                throw new Error(
                    "Password must be at least 6 characters."
                );

            }


            // =================================================
            // ADMIN RESTRICTION
            // =================================================

            if (
                currentRole === "Admin" &&
                form.role === "Super Admin"
            ) {

                throw new Error(
                    "Admin cannot create or modify a Super Admin account."
                );

            }


            // =================================================
            // UPDATE LAST SUPER ADMIN CHECK
            // =================================================

            if (
                editingUser &&
                editingUser.role === "Super Admin" &&
                form.role !== "Super Admin"
            ) {

                const superAdmins =
                    users.filter(
                        user =>
                            user.role === "Super Admin"
                    );


                if (superAdmins.length <= 1) {

                    throw new Error(
                        "At least one Super Admin account must remain."
                    );

                }

            }


            // =================================================
            // CREATE
            // =================================================

            if (!editingUser) {

                const response = await fetch(
                    `${API_URL}/api/users`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            employee_id:
                                form.employee_id,

                            username:
                                form.username.trim(),

                            password:
                                form.password,

                            role:
                                form.role,

                            status:
                                form.status
                        })
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
                        "Failed to create user."
                    );

                }


                setMessage(
                    "User created successfully."
                );

            }


            // =================================================
            // UPDATE
            // =================================================

            else {

                if (
                    currentRole === "Admin" &&
                    editingUser.role === "Super Admin"
                ) {

                    throw new Error(
                        "Admin cannot modify a Super Admin account."
                    );

                }


                const response = await fetch(
                    `${API_URL}/api/users/${editingUser.user_id}`,
                    {
                        method: "PUT",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            employee_id:
                                form.employee_id,

                            username:
                                form.username.trim(),

                            role:
                                form.role,

                            status:
                                form.status
                        })
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
                        "Failed to update user."
                    );

                }


                setMessage(
                    "User updated successfully."
                );

            }


            setShowModal(false);
            setEditingUser(null);

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


    // =====================================================
    // DELETE USER
    // =====================================================

    const handleDeleteUser = async (user) => {

        if (user.role === "Super Admin") {

            alert(
                "Super Admin account cannot be deleted."
            );

            return;

        }


        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${user.username}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            const token = getToken();

            if (!token) {

                throw new Error(
                    "Login token not found."
                );

            }


            const response = await fetch(
                `${API_URL}/api/users/${user.user_id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
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


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        if (saving) {
            return;
        }

        setShowModal(false);
        setEditingUser(null);

    };


    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {

        navigate("/settings");

    };


    // =====================================================
    // ROLE STYLE
    // =====================================================

    const getRoleStyle = (role) => {

        if (role === "Super Admin") {

            return {
                background: "#fef2f2",
                color: "#dc2626",
                borderColor: "#fecaca"
            };

        }


        if (role === "Admin") {

            return {
                background: "#eff6ff",
                color: "#2563eb",
                borderColor: "#bfdbfe"
            };

        }


        if (role === "Manager") {

            return {
                background: "#f5f3ff",
                color: "#7c3aed",
                borderColor: "#ddd6fe"
            };

        }


        return {
            background: "#f8fafc",
            color: "#475569",
            borderColor: "#e2e8f0"
        };

    };


    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (status) => {

        if (status === "Active") {

            return {
                background: "#ecfdf5",
                color: "#059669",
                borderColor: "#a7f3d0"
            };

        }


        return {
            background: "#fef2f2",
            color: "#dc2626",
            borderColor: "#fecaca"
        };

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="users-page">

            <Sidebar />

            <div className="users-main">

                <Navbar />

                <main className="users-content">

                    {/* =========================================
                        HERO
                    ========================================= */}

                    <section className="users-hero">

                        <div>

                            <div className="users-eyebrow">
                                ASSETSPHERE • USER MANAGEMENT
                            </div>

                            <h1>
                                User Management
                            </h1>

                            <p>
                                Manage system users, roles and
                                account access.
                            </p>

                        </div>


                        <div className="hero-actions">

                            <button
                                type="button"
                                className="back-button"
                                onClick={handleBack}
                            >
                                ← Settings
                            </button>


                            <button
                                type="button"
                                className="add-button"
                                onClick={handleAddUser}
                            >
                                + Add User
                            </button>

                        </div>

                    </section>


                    {/* =========================================
                        ERROR
                    ========================================= */}

                    {error && (

                        <div className="error-message">

                            <span>⚠️</span>

                            <span>{error}</span>

                            <button
                                type="button"
                                onClick={() =>
                                    setError("")
                                }
                            >
                                ×
                            </button>

                        </div>

                    )}


                    {/* =========================================
                        SUCCESS
                    ========================================= */}

                    {message && (

                        <div className="success-message">

                            <span>✓</span>

                            <span>{message}</span>

                            <button
                                type="button"
                                onClick={() =>
                                    setMessage("")
                                }
                            >
                                ×
                            </button>

                        </div>

                    )}


                    {/* =========================================
                        SUMMARY
                    ========================================= */}

                    <section className="summary-grid">

                        <SummaryCard
                            title="Total Users"
                            value={users.length}
                            icon="👥"
                            color="#2563eb"
                            background="#eff6ff"
                        />

                        <SummaryCard
                            title="Active Users"
                            value={
                                users.filter(
                                    user =>
                                        user.status === "Active"
                                ).length
                            }
                            icon="✓"
                            color="#059669"
                            background="#ecfdf5"
                        />

                        <SummaryCard
                            title="Administrators"
                            value={
                                users.filter(
                                    user =>
                                        user.role === "Admin" ||
                                        user.role === "Super Admin"
                                ).length
                            }
                            icon="🛡️"
                            color="#7c3aed"
                            background="#f5f3ff"
                        />

                        <SummaryCard
                            title="Inactive"
                            value={
                                users.filter(
                                    user =>
                                        user.status === "Inactive"
                                ).length
                            }
                            icon="⏸"
                            color="#dc2626"
                            background="#fef2f2"
                        />

                    </section>


                    {/* =========================================
                        USERS TABLE
                    ========================================= */}

                    <section className="users-card">

                        <div className="users-card-header">

                            <div>

                                <h2>
                                    System Users
                                </h2>

                                <p>
                                    Users who have access to
                                    AssetSphere.
                                </p>

                            </div>


                            <div className="count-badge">
                                {users.length} Users
                            </div>

                        </div>


                        <div className="table-wrapper">

                            {loading ? (

                                <div className="loading">

                                    <div className="spinner" />

                                    <span>
                                        Loading users...
                                    </span>

                                </div>

                            ) : users.length === 0 ? (

                                <div className="empty-state">

                                    <div className="empty-icon">
                                        👥
                                    </div>

                                    <h3>
                                        No users found
                                    </h3>

                                    <p>
                                        Create the first user
                                        account to get started.
                                    </p>

                                    <button
                                        type="button"
                                        className="empty-button"
                                        onClick={handleAddUser}
                                    >
                                        + Add User
                                    </button>

                                </div>

                            ) : (

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Employee ID
                                            </th>

                                            <th>
                                                Username
                                            </th>

                                            <th>
                                                Role
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Created
                                            </th>

                                            <th>
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {users.map(user => {

                                            const isSuperAdmin =
                                                user.role === "Super Admin";

                                            const isCurrentUser =
                                                Number(
                                                    user.user_id
                                                ) ===
                                                Number(
                                                    currentUser?.user_id
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        user.user_id
                                                    }
                                                >

                                                    <td>

                                                        <span className="employee-id">
                                                            #
                                                            {user.employee_id}
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="user-cell">

                                                            <div className="avatar">

                                                                {(
                                                                    user.username ||
                                                                    "U"
                                                                )
                                                                    .charAt(0)
                                                                    .toUpperCase()}

                                                            </div>


                                                            <div>

                                                                <div className="username">
                                                                    {
                                                                        user.username
                                                                    }
                                                                </div>

                                                                {isCurrentUser && (

                                                                    <span className="you-badge">
                                                                        YOU
                                                                    </span>

                                                                )}

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className="badge"
                                                            style={
                                                                getRoleStyle(
                                                                    user.role
                                                                )
                                                            }
                                                        >
                                                            {user.role}
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className="badge"
                                                            style={
                                                                getStatusStyle(
                                                                    user.status
                                                                )
                                                            }
                                                        >

                                                            <span className="status-dot" />

                                                            {
                                                                user.status
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span className="date-text">

                                                            {
                                                                user.created_at
                                                                    ? new Date(
                                                                        user.created_at
                                                                    ).toLocaleDateString()
                                                                    : "-"
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="action-buttons">

                                                            <button
                                                                type="button"
                                                                className="action-button edit-button"
                                                                disabled={
                                                                    currentRole ===
                                                                        "Admin" &&
                                                                    isSuperAdmin
                                                                }
                                                                onClick={() =>
                                                                    handleEditUser(
                                                                        user
                                                                    )
                                                                }
                                                            >
                                                                ✏️
                                                            </button>


                                                            <button
                                                                type="button"
                                                                className="action-button delete-button"
                                                                disabled={
                                                                    isSuperAdmin
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

                                        })}

                                    </tbody>

                                </table>

                            )}

                        </div>

                    </section>


                    {/* =========================================
                        PERMISSION INFO
                    ========================================= */}

                    <section className="permission-card">

                        <div className="permission-icon">
                            🛡️
                        </div>

                        <div>

                            <h3>
                                User Access Rules
                            </h3>

                            <p>

                                <strong>
                                    Super Admin
                                </strong>
                                {" "}has full access.{" "}

                                <strong>
                                    Admin
                                </strong>
                                {" "}can manage normal users but
                                cannot modify or delete Super
                                Admin accounts.{" "}

                                <strong>
                                    Manager
                                </strong>
                                {" "}and{" "}

                                <strong>
                                    Viewer
                                </strong>
                                {" "}do not have user management
                                access.

                            </p>

                        </div>

                    </section>

                </main>

            </div>


            {/* =============================================
                MODAL
            ============================================= */}

            {showModal && (

                <div
                    className="modal-overlay"
                    onMouseDown={e => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div className="modal">

                        <div className="modal-header">

                            <div>

                                <div className="modal-eyebrow">
                                    USER ACCOUNT
                                </div>

                                <h2>
                                    {
                                        editingUser
                                            ? "Edit User"
                                            : "Add New User"
                                    }
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="close-button"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        Employee ID
                                    </label>

                                    <input
                                        type="number"
                                        name="employee_id"
                                        value={
                                            form.employee_id
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


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
                                        maxLength="100"
                                        required
                                    />

                                </div>


                                {!editingUser && (

                                    <div className="form-group full">

                                        <label>
                                            Password
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
                                            minLength="6"
                                            required
                                        />

                                    </div>

                                )}


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

                                        {currentRole ===
                                            "Super Admin" && (

                                            <option value="Super Admin">
                                                Super Admin
                                            </option>

                                        )}

                                        <option value="Admin">
                                            Admin
                                        </option>

                                        <option value="Manager">
                                            Manager
                                        </option>

                                        <option value="Viewer">
                                            Viewer
                                        </option>

                                    </select>

                                </div>


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


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-button"
                                    disabled={saving}
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


            <style>{`

                * {
                    box-sizing: border-box;
                }

                .users-page {
                    min-height: 100vh;
                    display: flex;
                    background: #f8fafc;
                }

                .users-main {
                    flex: 1;
                    min-width: 0;
                }

                .users-content {
                    padding: 24px;
                }

                .users-hero {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    padding: 28px 24px;
                    margin-bottom: 22px;
                    border-radius: 16px;
                    background:
                        linear-gradient(
                            135deg,
                            #111827 0%,
                            #1e3a8a 100%
                        );
                    color: white;
                    box-shadow:
                        0 12px 30px
                        rgba(15,23,42,0.12);
                }

                .users-eyebrow {
                    color: #bfdbfe;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1.3px;
                    margin-bottom: 8px;
                }

                .users-hero h1 {
                    margin: 0;
                    color: white;
                    font-size: 28px;
                    font-weight: 800;
                }

                .users-hero p {
                    margin: 7px 0 0;
                    color: #dbeafe;
                    font-size: 12px;
                }

                .hero-actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .back-button,
                .add-button {
                    border: none;
                    border-radius: 8px;
                    padding: 9px 13px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .back-button {
                    background: rgba(255,255,255,0.10);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.20);
                }

                .add-button {
                    background: white;
                    color: #1e3a8a;
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(4, minmax(0, 1fr));
                    gap: 14px;
                    margin-bottom: 18px;
                }

                .summary-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 13px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .summary-icon {
                    width: 42px;
                    height: 42px;
                    min-width: 42px;
                    border-radius: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                }

                .summary-label {
                    font-size: 10px;
                    color: #94a3b8;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: .6px;
                }

                .summary-value {
                    margin-top: 3px;
                    font-size: 20px;
                    color: #1e293b;
                    font-weight: 800;
                }

                .users-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 14px;
                    overflow: hidden;
                }

                .users-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 18px 20px;
                    border-bottom: 1px solid #eef2f6;
                }

                .users-card-header h2 {
                    margin: 0;
                    font-size: 16px;
                    color: #1e293b;
                }

                .users-card-header p {
                    margin: 5px 0 0;
                    font-size: 11px;
                    color: #94a3b8;
                }

                .count-badge {
                    padding: 6px 10px;
                    border-radius: 20px;
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    color: #64748b;
                    font-size: 11px;
                    font-weight: 700;
                }

                .table-wrapper {
                    width: 100%;
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 760px;
                }

                th {
                    text-align: left;
                    padding: 12px 18px;
                    background: #f8fafc;
                    border-bottom: 1px solid #e5e7eb;
                    color: #64748b;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                }

                td {
                    padding: 13px 18px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #334155;
                    font-size: 12px;
                }

                .employee-id {
                    font-weight: 700;
                    color: #64748b;
                }

                .user-cell {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .avatar {
                    width: 34px;
                    height: 34px;
                    min-width: 34px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background:
                        linear-gradient(
                            135deg,
                            #2563eb,
                            #4f46e5
                        );
                    color: white;
                    font-size: 12px;
                    font-weight: 800;
                }

                .username {
                    font-weight: 700;
                    color: #1e293b;
                }

                .you-badge {
                    display: inline-block;
                    margin-top: 3px;
                    padding: 2px 5px;
                    border-radius: 4px;
                    background: #eff6ff;
                    color: #2563eb;
                    font-size: 8px;
                    font-weight: 800;
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px 9px;
                    border: 1px solid;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 700;
                }

                .status-dot {
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: currentColor;
                }

                .action-buttons {
                    display: flex;
                    gap: 6px;
                }

                .action-button {
                    width: 31px;
                    height: 31px;
                    border-radius: 7px;
                    border: 1px solid;
                    cursor: pointer;
                    background: white;
                }

                .edit-button {
                    border-color: #bfdbfe;
                    background: #eff6ff;
                }

                .delete-button {
                    border-color: #fecaca;
                    background: #fef2f2;
                }

                .action-button:disabled {
                    opacity: .35;
                    cursor: not-allowed;
                }

                .loading {
                    min-height: 260px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    color: #64748b;
                    font-size: 12px;
                }

                .spinner {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 2px solid #e2e8f0;
                    border-top-color: #2563eb;
                    animation: spin .7s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .empty-state {
                    text-align: center;
                    padding: 55px 20px;
                }

                .empty-icon {
                    font-size: 38px;
                    margin-bottom: 10px;
                }

                .empty-state h3 {
                    margin: 0;
                    color: #334155;
                    font-size: 15px;
                }

                .empty-state p {
                    margin: 5px 0 15px;
                    color: #94a3b8;
                    font-size: 11px;
                }

                .empty-button {
                    border: none;
                    background: #2563eb;
                    color: white;
                    border-radius: 7px;
                    padding: 8px 12px;
                    font-size: 11px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .permission-card {
                    margin-top: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 15px 17px;
                    background: #f8fafc;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                }

                .permission-icon {
                    width: 36px;
                    height: 36px;
                    min-width: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9px;
                    background: #eff6ff;
                    font-size: 16px;
                }

                .permission-card h3 {
                    margin: 0;
                    color: #334155;
                    font-size: 12px;
                }

                .permission-card p {
                    margin: 5px 0 0;
                    color: #64748b;
                    font-size: 11px;
                    line-height: 1.55;
                }

                .error-message,
                .success-message {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 11px 14px;
                    margin-bottom: 16px;
                    border-radius: 9px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .error-message {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #b91c1c;
                }

                .success-message {
                    background: #ecfdf5;
                    border: 1px solid #a7f3d0;
                    color: #047857;
                }

                .error-message button,
                .success-message button {
                    margin-left: auto;
                    border: none;
                    background: transparent;
                    font-size: 18px;
                    cursor: pointer;
                    color: inherit;
                }

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background: rgba(15,23,42,.55);
                    backdrop-filter: blur(3px);
                }

                .modal {
                    width: 100%;
                    max-width: 560px;
                    max-height: 90vh;
                    overflow-y: auto;
                    background: white;
                    border-radius: 15px;
                    box-shadow:
                        0 25px 60px
                        rgba(15,23,42,.25);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 20px;
                    border-bottom: 1px solid #eef2f6;
                }

                .modal-eyebrow {
                    color: #2563eb;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    margin-bottom: 5px;
                }

                .modal-header h2 {
                    margin: 0;
                    color: #1e293b;
                    font-size: 18px;
                }

                .close-button {
                    width: 30px;
                    height: 30px;
                    border: none;
                    border-radius: 7px;
                    background: #f8fafc;
                    color: #64748b;
                    font-size: 20px;
                    cursor: pointer;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(2, minmax(0,1fr));
                    gap: 15px;
                    padding: 20px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-group.full {
                    grid-column: 1 / -1;
                }

                .form-group label {
                    color: #334155;
                    font-size: 11px;
                    font-weight: 700;
                }

                .form-group input,
                .form-group select {
                    width: 100%;
                    height: 39px;
                    padding: 0 11px;
                    border: 1px solid #dbe2ea;
                    border-radius: 7px;
                    outline: none;
                    color: #1e293b;
                    background: white;
                    font-size: 12px;
                }

                .form-group input:focus,
                .form-group select:focus {
                    border-color: #93c5fd;
                    box-shadow:
                        0 0 0 3px
                        rgba(37,99,235,.08);
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    padding: 15px 20px;
                    border-top: 1px solid #eef2f6;
                }

                .cancel-button,
                .save-button {
                    padding: 9px 14px;
                    border-radius: 7px;
                    font-size: 11px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .cancel-button {
                    background: white;
                    color: #64748b;
                    border: 1px solid #dbe2ea;
                }

                .save-button {
                    background: #2563eb;
                    color: white;
                    border: none;
                }

                @media (max-width: 900px) {

                    .summary-grid {
                        grid-template-columns:
                            repeat(2, minmax(0,1fr));
                    }

                }

                @media (max-width: 650px) {

                    .users-content {
                        padding: 15px;
                    }

                    .users-hero {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .hero-actions {
                        width: 100%;
                    }

                    .back-button,
                    .add-button {
                        flex: 1;
                    }

                    .summary-grid {
                        grid-template-columns: 1fr;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .form-group.full {
                        grid-column: auto;
                    }

                }

            `}</style>

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
    color,
    background
}) {

    return (

        <div className="summary-card">

            <div
                className="summary-icon"
                style={{
                    background,
                    color
                }}
            >
                {icon}
            </div>

            <div>

                <div className="summary-label">
                    {title}
                </div>

                <div className="summary-value">
                    {value}
                </div>

            </div>

        </div>

    );

}


export default UserManagement;