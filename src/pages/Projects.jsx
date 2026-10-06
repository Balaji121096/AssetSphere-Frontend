// =====================================================
// Projects.jsx  — Project listing + creation
// =====================================================
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

const PRIORITY_COLORS = {
    Low: { bg: "rgba(34,197,94,0.12)", color: "#16a34a", border: "rgba(34,197,94,0.25)" },
    Medium: { bg: "rgba(234,179,8,0.12)", color: "#ca8a04", border: "rgba(234,179,8,0.25)" },
    High: { bg: "rgba(249,115,22,0.12)", color: "#ea580c", border: "rgba(249,115,22,0.25)" },
    Critical: { bg: "rgba(239,68,68,0.12)", color: "#dc2626", border: "rgba(239,68,68,0.25)" }
};
const STATUS_COLORS = {
    Planning: { bg: "rgba(148,163,184,0.15)", color: "var(--muted-text)", border: "rgba(148,163,184,0.3)" },
    "Not Started": { bg: "rgba(99,102,241,0.12)", color: "#6366f1", border: "rgba(99,102,241,0.25)" },
    "In Progress": { bg: "rgba(59,130,246,0.12)", color: "var(--primary-color)", border: "rgba(59,130,246,0.25)" },
    "On Hold": { bg: "rgba(234,179,8,0.12)", color: "#ca8a04", border: "rgba(234,179,8,0.25)" },
    Completed: { bg: "rgba(34,197,94,0.12)", color: "#16a34a", border: "rgba(34,197,94,0.25)" },
    Cancelled: { bg: "rgba(239,68,68,0.12)", color: "#dc2626", border: "rgba(239,68,68,0.25)" }
};

const Badge = ({ text, map }) => {
    const c = (map || {})[text] || { bg: "rgba(148,163,184,0.15)", color: "var(--muted-text)", border: "rgba(148,163,184,0.3)" };
    return (
        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
            {text}
        </span>
    );
};

const initialForm = {
    project_code: "", project_name: "", description: "", client_department: "",
    manager_employee_id: "", start_date: "", expected_end_date: "",
    priority: "Medium", status: "Planning", objectives: "", notes: ""
};

export default function Projects() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role || "";
    const canCreate = ["Super Admin", "Admin", "Manager"].includes(role);

    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [error, setError] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pRes, sRes] = await Promise.all([
                API.get("/projects"),
                API.get("/projects/stats")
            ]);
            if (pRes.data.success) setProjects(pRes.data.data);
            if (sRes.data.success) setStats(sRes.data.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const fetchEmployees = async () => {
        try {
            const res = await API.get("/employees");
            if (res.data.success) setEmployees(res.data.data || res.data.employees || []);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchData(); fetchEmployees(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.project_name.trim()) { setError("Project name is required"); return; }
        try {
            setSubmitting(true); setError("");
            const res = await API.post("/projects", form);
            if (res.data.success) {
                setShowModal(false); setForm(initialForm); fetchData();
            } else { setError(res.data.message || "Failed to create project"); }
        } catch (e) { setError(e.response?.data?.message || "Server error"); }
        setSubmitting(false);
    };

    const filtered = projects.filter(p => {
        const s = search.toLowerCase();
        const matchSearch = !s || p.project_name?.toLowerCase().includes(s) || p.project_code?.toLowerCase().includes(s) || p.manager_name?.toLowerCase().includes(s);
        const matchStatus = statusFilter === "All" || p.status === statusFilter;
        const matchPriority = priorityFilter === "All" || p.priority === priorityFilter;
        return matchSearch && matchStatus && matchPriority;
    });

    const progress = (p) => {
        if (!p.task_count) return 0;
        return Math.round((p.completed_tasks / p.task_count) * 100);
    };

    // ─── Styles ───
    const page = { display: "flex", minHeight: "100vh", background: "var(--app-background,#f4f6f8)", color: "var(--text-color)" };
    const main = { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 };
    const content = { padding: "20px", maxWidth: 1500, margin: "0 auto", width: "100%" };
    const hero = { background: "linear-gradient(135deg, var(--sidebar-color, #1e293b) 0%, var(--primary-color, #334155) 100%)", borderRadius: 12, padding: "24px 28px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 };
    const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 20 };
    const statCard = { background: "var(--card-background)", border: "1px solid var(--border-color)", borderRadius: 10, padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" };
    const filterCard = { background: "var(--card-background)", border: "1px solid var(--border-color)", borderRadius: 10, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" };
    const inp = { padding: "8px 12px", borderRadius: 8, border: "1.5px solid var(--border-color)", background: "var(--card-background)", color: "var(--text-color)", fontSize: 13, outline: "none" };
    const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 };
    const card = { background: "var(--card-background)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", cursor: "pointer", transition: "box-shadow .15s", display: "flex", flexDirection: "column", gap: 12 };
    const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 };
    const modal = { background: "var(--card-background)", borderRadius: 14, padding: "28px 32px", width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto" };
    const formGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };
    const label = { fontSize: 12, fontWeight: 600, color: "var(--muted-text)", marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: .5 };
    const inputStyle = { ...inp, width: "100%", boxSizing: "border-box" };
    const btnPrimary = { padding: "10px 22px", borderRadius: 8, border: "none", background: "var(--primary-color)", color: "#ffffff", fontWeight: 600, fontSize: 14, cursor: "pointer" };
    const btnSecondary = { padding: "10px 22px", borderRadius: 8, border: "1.5px solid var(--border-color)", background: "transparent", color: "var(--text-color)", fontWeight: 600, fontSize: 14, cursor: "pointer" };

    return (
        <div style={page}>
            <Sidebar />
            <div style={main}>
                <Navbar />
                <div style={content}>

                    {/* HERO */}
                    <div style={hero}>
                        <div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginBottom: 6, letterSpacing: 1 }}>DASHBOARD / PROJECT MANAGEMENT</div>
                            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#ffffff" }}>Project Management</h1>
                            <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.8)", fontSize: 13 }}>Manage and track all projects, tasks, timesheets, and team updates.</p>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => { fetchProjects(); fetchStats(); }} style={{ ...btnSecondary, whiteSpace: "nowrap", background: "rgba(255,255,255,0.1)", color: "#ffffff", borderColor: "rgba(255,255,255,0.2)" }}>
                                ↻ Refresh
                            </button>
                            {canCreate && (
                                <button onClick={() => setShowModal(true)} style={{ ...btnPrimary, whiteSpace: "nowrap", background: "var(--primary-color)" }}>
                                    + New Project
                                </button>
                            )}
                        </div>
                    </div>

                    {/* STATS */}
                    {stats && (
                        <div style={statsGrid}>
                            {[
                                { label: "Total Projects", value: stats.total_projects, color: "var(--primary-color)" },
                                { label: "Active", value: stats.active_projects, color: "#f59e0b" },
                                { label: "Completed", value: stats.completed_projects, color: "#16a34a" },
                                { label: "On Hold", value: stats.on_hold_projects, color: "#9ca3af" },
                                { label: "Overdue", value: stats.overdue_projects, color: "#dc2626" },
                                { label: "Overdue Tasks", value: stats.overdue_tasks, color: "#ef4444" },
                                { label: "Hours Logged", value: parseFloat(stats.total_hours_logged || 0).toFixed(1) + "h", color: "#8b5cf6" }
                            ].map(s => (
                                <div key={s.label} style={statCard}>
                                    <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value || 0}</div>
                                    <div style={{ fontSize: 11, color: "var(--muted-text)", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* FILTERS */}
                    <div style={filterCard}>
                        <input style={{ ...inp, minWidth: 240 }} placeholder="Search projects, code, manager..." value={search} onChange={e => setSearch(e.target.value)} />
                        <select style={inp} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="All">All Statuses</option>
                            {["Planning","Not Started","In Progress","On Hold","Completed","Cancelled"].map(s => <option key={s}>{s}</option>)}
                        </select>
                        <select style={inp} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                            <option value="All">All Priorities</option>
                            {["Low","Medium","High","Critical"].map(p => <option key={p}>{p}</option>)}
                        </select>
                        {(search || statusFilter !== "All" || priorityFilter !== "All") && (
                            <button onClick={() => { setSearch(""); setStatusFilter("All"); setPriorityFilter("All"); }} style={{ ...btnSecondary, padding: "8px 14px", fontSize: 12, color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}>
                                Clear
                            </button>
                        )}
                        <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted-text)" }}>
                            {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
                        </div>
                    </div>

                    {/* PROJECT CARDS */}
                    {loading ? (
                        <div style={{ textAlign: "center", padding: 60, color: "var(--muted-text)" }}>Loading projects...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: 60, color: "var(--muted-text)" }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
                            <div style={{ fontWeight: 600 }}>No projects found</div>
                            {canCreate && <div style={{ marginTop: 8, fontSize: 13 }}>Create your first project using the button above.</div>}
                        </div>
                    ) : (
                        <div style={grid}>
                            {filtered.map(p => (
                                <div key={p.project_id} style={card} onClick={() => navigate(`/projects/${p.project_id}`)}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                                        <div>
                                            <div style={{ fontSize: 11, color: "var(--muted-text)", fontWeight: 600, marginBottom: 3 }}>{p.project_code}</div>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-color)", lineHeight: 1.3 }}>{p.project_name}</div>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                                            <Badge text={p.status} map={STATUS_COLORS} />
                                            <Badge text={p.priority} map={PRIORITY_COLORS} />
                                        </div>
                                    </div>

                                    {p.description && <div style={{ fontSize: 12, color: "var(--muted-text)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</div>}

                                    {/* Progress Bar */}
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted-text)", marginBottom: 5 }}>
                                            <span>Progress</span><span>{progress(p)}%</span>
                                        </div>
                                        <div style={{ height: 6, background: "var(--border-color)", borderRadius: 3, overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${progress(p)}%`, background: progress(p) === 100 ? "#16a34a" : "var(--primary-color)", borderRadius: 3, transition: "width .3s" }} />
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                        {[
                                            { label: "Tasks", value: p.task_count || 0 },
                                            { label: "Done", value: p.completed_tasks || 0 },
                                            { label: "Members", value: p.member_count || 0 }
                                        ].map(s => (
                                            <div key={s.label} style={{ textAlign: "center", background: "var(--app-background)", borderRadius: 8, padding: "8px 4px" }}>
                                                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-color)" }}>{s.value}</div>
                                                <div style={{ fontSize: 10, color: "var(--muted-text)", fontWeight: 600 }}>{s.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted-text)", borderTop: "1px solid var(--border-color)", paddingTop: 10 }}>
                                        <span>👤 {p.manager_name || "No Manager"}</span>
                                        {p.expected_end_date && <span>📅 {new Date(p.expected_end_date).toLocaleDateString()}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CREATE PROJECT MODAL */}
            {showModal && (
                <div style={overlay} onClick={e => { if (e.target === e.currentTarget) { setShowModal(false); setError(""); } }}>
                    <div style={modal}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Create New Project</h2>
                            <button onClick={() => { setShowModal(false); setError(""); }} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--muted-text)" }}>✕</button>
                        </div>

                        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#dc2626", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div style={formGrid}>
                                <div>
                                    <label style={label}>Project Name *</label>
                                    <input style={inputStyle} value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))} required />
                                </div>
                                <div>
                                    <label style={label}>Project Code</label>
                                    <input style={inputStyle} placeholder="Auto-generated if empty" value={form.project_code} onChange={e => setForm(f => ({ ...f, project_code: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={label}>Client / Department</label>
                                    <input style={inputStyle} value={form.client_department} onChange={e => setForm(f => ({ ...f, client_department: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={label}>Project Manager</label>
                                    <select style={inputStyle} value={form.manager_employee_id} onChange={e => setForm(f => ({ ...f, manager_employee_id: e.target.value }))}>
                                        <option value="">Select Manager</option>
                                        {employees.map(emp => <option key={emp.employee_id} value={emp.employee_id}>{emp.display_name} ({emp.employee_code})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={label}>Start Date</label>
                                    <input type="date" style={inputStyle} value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={label}>Expected End Date</label>
                                    <input type="date" style={inputStyle} value={form.expected_end_date} onChange={e => setForm(f => ({ ...f, expected_end_date: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={label}>Priority</label>
                                    <select style={inputStyle} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                                        {["Low","Medium","High","Critical"].map(p => <option key={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={label}>Status</label>
                                    <select style={inputStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                        {["Planning","Not Started","In Progress","On Hold","Completed","Cancelled"].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={label}>Description</label>
                                    <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={label}>Project Objectives</label>
                                    <textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={form.objectives} onChange={e => setForm(f => ({ ...f, objectives: e.target.value }))} />
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={label}>Notes</label>
                                    <textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
                                <button type="button" onClick={() => { setShowModal(false); setError(""); }} style={btnSecondary}>Cancel</button>
                                <button type="submit" disabled={submitting} style={{ ...btnPrimary, opacity: submitting ? 0.7 : 1 }}>
                                    {submitting ? "Creating..." : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}





