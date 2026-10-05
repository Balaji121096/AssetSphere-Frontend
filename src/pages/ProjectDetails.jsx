// =====================================================
// ProjectDetails.jsx  — Full project workspace with 9 tabs
// =====================================================
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

// ─── Shared constants ───────────────────────────────
const PRIORITY_COLORS = {
    Low: { bg: "rgba(34,197,94,0.12)", color: "#16a34a", border: "rgba(34,197,94,0.25)" },
    Medium: { bg: "rgba(234,179,8,0.12)", color: "#ca8a04", border: "rgba(234,179,8,0.25)" },
    High: { bg: "rgba(249,115,22,0.12)", color: "#ea580c", border: "rgba(249,115,22,0.25)" },
    Critical: { bg: "rgba(239,68,68,0.12)", color: "#dc2626", border: "rgba(239,68,68,0.25)" }
};
const STATUS_TASK = {
    "To Do": { bg: "rgba(99,102,241,0.1)", color: "#6366f1", border: "rgba(99,102,241,0.25)" },
    "In Progress": { bg: "rgba(59,130,246,0.12)", color: "#2563eb", border: "rgba(59,130,246,0.25)" },
    Blocked: { bg: "rgba(239,68,68,0.12)", color: "#dc2626", border: "rgba(239,68,68,0.25)" },
    Completed: { bg: "rgba(34,197,94,0.12)", color: "#16a34a", border: "rgba(34,197,94,0.25)" },
    Cancelled: { bg: "rgba(148,163,184,0.15)", color: "#64748b", border: "rgba(148,163,184,0.3)" }
};
const STATUS_PROJ = {
    Planning: { bg: "rgba(148,163,184,0.15)", color: "#64748b", border: "rgba(148,163,184,0.3)" },
    "Not Started": { bg: "rgba(99,102,241,0.12)", color: "#6366f1", border: "rgba(99,102,241,0.25)" },
    "In Progress": { bg: "rgba(59,130,246,0.12)", color: "#2563eb", border: "rgba(59,130,246,0.25)" },
    "On Hold": { bg: "rgba(234,179,8,0.12)", color: "#ca8a04", border: "rgba(234,179,8,0.25)" },
    Completed: { bg: "rgba(34,197,94,0.12)", color: "#16a34a", border: "rgba(34,197,94,0.25)" },
    Cancelled: { bg: "rgba(239,68,68,0.12)", color: "#dc2626", border: "rgba(239,68,68,0.25)" }
};
const TABS = ["Overview", "Members", "Tasks", "Time", "Updates", "Meetings", "Files", "Activity"];
const Badge = ({ text, map }) => {
    const c = (map || {})[text] || { bg: "#e5e7eb", color: "#374151", border: "#d1d5db" };
    return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>{text}</span>;
};
const inp = { padding: "8px 12px", borderRadius: 8, border: "1.5px solid var(--border-color,#e2e8f0)", background: "var(--card-background,#fff)", color: "var(--text-color,#1e293b)", fontSize: 13, outline: "none" };
const inputFull = { ...inp, width: "100%", boxSizing: "border-box" };
const label = { fontSize: 11, fontWeight: 700, color: "var(--muted-text,#64748b)", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: .5 };
const btnPrim = { padding: "8px 18px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" };
const btnSec = { padding: "8px 18px", borderRadius: 8, border: "1.5px solid var(--border-color,#e2e8f0)", background: "transparent", color: "var(--text-color,#1e293b)", fontWeight: 600, fontSize: 13, cursor: "pointer" };
const btnDanger = { ...btnSec, color: "#dc2626", borderColor: "rgba(220,38,38,0.3)" };
const card = { background: "var(--card-background,#fff)", border: "1px solid var(--border-color,#e2e8f0)", borderRadius: 12, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };
const fmtDate = d => d ? new Date(d).toLocaleDateString() : "—";
const fmtDT = d => d ? new Date(d).toLocaleString() : "—";

// ─── Mini modal ──────────────────────────────────────
const Modal = ({ title, onClose, children, wide }) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={{ background: "var(--card-background,#fff)", borderRadius: 14, padding: "24px 28px", width: "100%", maxWidth: wide ? 720 : 560, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{title}</h3>
                <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted-text,#64748b)" }}>✕</button>
            </div>
            {children}
        </div>
    </div>
);

// =====================================================
// OVERVIEW TAB
// =====================================================
function OverviewTab({ project, stats, canManage, employees, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);

    const startEdit = () => {
        setForm({
            project_name: project.project_name, description: project.description || "",
            client_department: project.client_department || "", manager_employee_id: project.manager_employee_id || "",
            start_date: project.start_date ? project.start_date.split("T")[0] : "",
            expected_end_date: project.expected_end_date ? project.expected_end_date.split("T")[0] : "",
            actual_end_date: project.actual_end_date ? project.actual_end_date.split("T")[0] : "",
            priority: project.priority, status: project.status,
            objectives: project.objectives || "", notes: project.notes || ""
        });
        setEditing(true);
    };

    const save = async () => {
        setSaving(true);
        try {
            await API.put(`/projects/${project.project_id}`, form);
            setEditing(false); onUpdate();
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const prog = stats?.total_tasks ? Math.round((stats.completed_tasks / stats.total_tasks) * 100) : 0;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Project Overview</h3>
                {canManage && !editing && <button onClick={startEdit} style={btnPrim}>Edit Project</button>}
                {editing && <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditing(false)} style={btnSec}>Cancel</button>
                    <button onClick={save} disabled={saving} style={{ ...btnPrim, opacity: saving ? 0.7 : 1 }}>{saving ? "Saving..." : "Save"}</button>
                </div>}
            </div>

            {editing ? (
                <div style={{ ...card, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {[
                        { l: "Project Name", k: "project_name", type: "text" },
                        { l: "Client / Department", k: "client_department", type: "text" },
                        { l: "Start Date", k: "start_date", type: "date" },
                        { l: "Expected End Date", k: "expected_end_date", type: "date" },
                        { l: "Actual End Date", k: "actual_end_date", type: "date" }
                    ].map(f => (
                        <div key={f.k}>
                            <label style={label}>{f.l}</label>
                            <input type={f.type} style={inputFull} value={form[f.k] || ""} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} />
                        </div>
                    ))}
                    <div>
                        <label style={label}>Manager</label>
                        <select style={inputFull} value={form.manager_employee_id || ""} onChange={e => setForm(p => ({ ...p, manager_employee_id: e.target.value }))}>
                            <option value="">Select Manager</option>
                            {employees.map(emp => <option key={emp.employee_id} value={emp.employee_id}>{emp.display_name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={label}>Priority</label>
                        <select style={inputFull} value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                            {["Low","Medium","High","Critical"].map(v => <option key={v}>{v}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={label}>Status</label>
                        <select style={inputFull} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                            {["Planning","Not Started","In Progress","On Hold","Completed","Cancelled"].map(v => <option key={v}>{v}</option>)}
                        </select>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={label}>Description</label>
                        <textarea rows={3} style={{ ...inputFull, resize: "vertical" }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={label}>Objectives</label>
                        <textarea rows={2} style={{ ...inputFull, resize: "vertical" }} value={form.objectives} onChange={e => setForm(p => ({ ...p, objectives: e.target.value }))} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={label}>Notes</label>
                        <textarea rows={2} style={{ ...inputFull, resize: "vertical" }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
                    </div>
                </div>
            ) : (
                <>
                    {/* Stats cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12 }}>
                        {[
                            { l: "Total Tasks", v: stats?.total_tasks || 0, c: "#2563eb" },
                            { l: "Completed", v: stats?.completed_tasks || 0, c: "#16a34a" },
                            { l: "Pending", v: stats?.pending_tasks || 0, c: "#f59e0b" },
                            { l: "Overdue", v: stats?.overdue_tasks || 0, c: "#dc2626" },
                            { l: "Members", v: stats?.member_count || 0, c: "#8b5cf6" },
                            { l: "Hours Logged", v: parseFloat(stats?.total_logged_hours || 0).toFixed(1) + "h", c: "#0891b2" }
                        ].map(s => (
                            <div key={s.l} style={{ ...card, textAlign: "center", padding: "14px" }}>
                                <div style={{ fontSize: 22, fontWeight: 700, color: s.c }}>{s.v}</div>
                                <div style={{ fontSize: 11, color: "var(--muted-text,#64748b)", fontWeight: 600, marginTop: 2 }}>{s.l}</div>
                            </div>
                        ))}
                    </div>

                    {/* Progress */}
                    <div style={card}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>Overall Progress</span>
                            <span style={{ fontWeight: 700, fontSize: 15, color: prog === 100 ? "#16a34a" : "#2563eb" }}>{prog}%</span>
                        </div>
                        <div style={{ height: 10, background: "var(--border-color,#e2e8f0)", borderRadius: 5 }}>
                            <div style={{ height: "100%", width: `${prog}%`, background: prog === 100 ? "#16a34a" : "#3b82f6", borderRadius: 5, transition: "width .3s" }} />
                        </div>
                    </div>

                    {/* Info grid */}
                    <div style={card}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            {[
                                { l: "Project Code", v: project.project_code },
                                { l: "Status", v: <Badge text={project.status} map={STATUS_PROJ} /> },
                                { l: "Priority", v: <Badge text={project.priority} map={PRIORITY_COLORS} /> },
                                { l: "Manager", v: project.manager_name || "—" },
                                { l: "Client / Dept", v: project.client_department || "—" },
                                { l: "Start Date", v: fmtDate(project.start_date) },
                                { l: "Expected End", v: fmtDate(project.expected_end_date) },
                                { l: "Actual End", v: fmtDate(project.actual_end_date) }
                            ].map(r => (
                                <div key={r.l}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-text,#64748b)", marginBottom: 3, textTransform: "uppercase" }}>{r.l}</div>
                                    <div style={{ fontSize: 14 }}>{r.v || "—"}</div>
                                </div>
                            ))}
                            {project.description && (
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-text,#64748b)", marginBottom: 3, textTransform: "uppercase" }}>Description</div>
                                    <div style={{ fontSize: 14, lineHeight: 1.6 }}>{project.description}</div>
                                </div>
                            )}
                            {project.objectives && (
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-text,#64748b)", marginBottom: 3, textTransform: "uppercase" }}>Objectives</div>
                                    <div style={{ fontSize: 14, lineHeight: 1.6 }}>{project.objectives}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// =====================================================
// MEMBERS TAB
// =====================================================
function MembersTab({ projectId, canManage, employees }) {
    const [members, setMembers] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ employee_id: "", project_role: "Member" });
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try { const r = await API.get(`/projects/${projectId}/members`); setMembers(r.data.data || []); }
        catch (e) { console.error(e); }
        setLoading(false);
    }, [projectId]);

    useEffect(() => { load(); }, [load]);

    const add = async () => {
        if (!form.employee_id) return;
        await API.post(`/projects/${projectId}/members`, form);
        setShowAdd(false); setForm({ employee_id: "", project_role: "Member" }); load();
    };

    const remove = async (emp_id) => {
        if (!window.confirm("Remove this member?")) return;
        await API.delete(`/projects/${projectId}/members/${emp_id}`); load();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Project Members ({members.filter(m => m.status === "Active").length})</h3>
                {canManage && <button onClick={() => setShowAdd(true)} style={btnPrim}>+ Add Member</button>}
            </div>

            {loading ? <div style={{ textAlign: "center", padding: 40 }}>Loading...</div> : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px" }}>
                        <thead>
                            <tr>
                                {["Name","Code","Department","Project Role","Joined","Status","Action"].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "var(--muted-text,#64748b)", textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(m => (
                                <tr key={m.member_id} style={{ background: "var(--card-background,#fff)" }}>
                                    {[m.display_name, m.employee_code, m.department_name || "—", m.project_role,
                                      fmtDate(m.assigned_date)].map((v, i) => (
                                        <td key={i} style={{ padding: "12px", fontSize: 13, borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>{v}</td>
                                    ))}
                                    <td style={{ padding: "12px", borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>
                                        <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: m.status === "Active" ? "rgba(34,197,94,0.12)" : "rgba(148,163,184,0.15)", color: m.status === "Active" ? "#16a34a" : "#64748b" }}>{m.status}</span>
                                    </td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>
                                        {canManage && m.status === "Active" && (
                                            <button onClick={() => remove(m.employee_id)} style={{ ...btnDanger, padding: "4px 10px", fontSize: 12 }}>Remove</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {members.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "var(--muted-text,#64748b)" }}>No members yet.</div>}
                </div>
            )}

            {showAdd && (
                <Modal title="Add Member" onClose={() => setShowAdd(false)}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div><label style={label}>Employee</label>
                            <select style={inputFull} value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))}>
                                <option value="">Select Employee</option>
                                {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.display_name} ({e.employee_code})</option>)}
                            </select>
                        </div>
                        <div><label style={label}>Project Role</label>
                            <select style={inputFull} value={form.project_role} onChange={e => setForm(f => ({ ...f, project_role: e.target.value }))}>
                                {["Project Manager","Team Lead","Developer","Designer","Analyst","QA Engineer","Member","Observer"].map(r => <option key={r}>{r}</option>)}
                            </select>
                        </div>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button onClick={() => setShowAdd(false)} style={btnSec}>Cancel</button>
                            <button onClick={add} style={btnPrim}>Add Member</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// =====================================================
// TASKS TAB
// =====================================================
function TasksTab({ projectId, canManage, employees, userRole, userEmployeeId }) {
    const [tasks, setTasks] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [form, setForm] = useState({ task_name: "", description: "", assigned_employee_id: "", priority: "Medium", status: "To Do", start_date: "", due_date: "", estimated_hours: "", percent_complete: 0 });
    const [filter, setFilter] = useState({ status: "All", priority: "All", search: "" });

    const load = useCallback(async () => {
        try { const r = await API.get(`/projects/${projectId}/tasks`); setTasks(r.data.data || []); }
        catch (e) { console.error(e); }
    }, [projectId]);

    useEffect(() => { load(); }, [load]);

    const save = async () => {
        if (!form.task_name.trim()) return;
        if (editTask) await API.put(`/projects/${projectId}/tasks/${editTask.task_id}`, form);
        else await API.post(`/projects/${projectId}/tasks`, form);
        setShowAdd(false); setEditTask(null); setForm({ task_name: "", description: "", assigned_employee_id: "", priority: "Medium", status: "To Do", start_date: "", due_date: "", estimated_hours: "", percent_complete: 0 });
        load();
    };

    const del = async (tid) => { if (!window.confirm("Delete task?")) return; await API.delete(`/projects/${projectId}/tasks/${tid}`); load(); };

    const openEdit = (t) => {
        setForm({ task_name: t.task_name, description: t.description || "", assigned_employee_id: t.assigned_employee_id || "", priority: t.priority, status: t.status, start_date: t.start_date ? t.start_date.split("T")[0] : "", due_date: t.due_date ? t.due_date.split("T")[0] : "", estimated_hours: t.estimated_hours || "", actual_hours: t.actual_hours || "", percent_complete: t.percent_complete || 0 });
        setEditTask(t); setShowAdd(true);
    };

    const isOverdue = t => t.due_date && new Date(t.due_date) < new Date() && !["Completed","Cancelled"].includes(t.status);
    const canEdit = t => canManage || (userRole === "Employee" && t.assigned_employee_id === userEmployeeId);

    const filtered = tasks.filter(t => {
        const s = filter.search.toLowerCase();
        return (!s || t.task_name?.toLowerCase().includes(s)) &&
               (filter.status === "All" || t.status === filter.status) &&
               (filter.priority === "All" || t.priority === filter.priority);
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Tasks ({filtered.length})</h3>
                {canManage && <button onClick={() => { setEditTask(null); setForm({ task_name: "", description: "", assigned_employee_id: "", priority: "Medium", status: "To Do", start_date: "", due_date: "", estimated_hours: "", percent_complete: 0 }); setShowAdd(true); }} style={btnPrim}>+ Add Task</button>}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input style={{ ...inp, minWidth: 200 }} placeholder="Search tasks..." value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
                <select style={inp} value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
                    <option value="All">All Status</option>
                    {["To Do","In Progress","Blocked","Completed","Cancelled"].map(s => <option key={s}>{s}</option>)}
                </select>
                <select style={inp} value={filter.priority} onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}>
                    <option value="All">All Priority</option>
                    {["Low","Medium","High","Critical"].map(p => <option key={p}>{p}</option>)}
                </select>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px", minWidth: 800 }}>
                    <thead>
                        <tr>{["Task","Assigned To","Priority","Status","Due Date","% Done","Actions"].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "var(--muted-text,#64748b)", textTransform: "uppercase" }}>{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody>
                        {filtered.map(t => (
                            <tr key={t.task_id} style={{ background: isOverdue(t) ? "rgba(239,68,68,0.04)" : "var(--card-background,#fff)" }}>
                                <td style={{ padding: "12px", borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>
                                    <div style={{ fontWeight: 600, fontSize: 13 }}>{t.task_name} {isOverdue(t) && <span style={{ color: "#dc2626", fontSize: 11 }}>⚠ Overdue</span>}</div>
                                    {t.description && <div style={{ fontSize: 11, color: "var(--muted-text,#64748b)", marginTop: 2 }}>{t.description.substring(0, 60)}{t.description.length > 60 ? "..." : ""}</div>}
                                </td>
                                <td style={{ padding: "12px", fontSize: 13, borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>{t.assigned_name || "Unassigned"}</td>
                                <td style={{ padding: "12px", borderBottom: "1px solid var(--border-color,#e2e8f0)" }}><Badge text={t.priority} map={PRIORITY_COLORS} /></td>
                                <td style={{ padding: "12px", borderBottom: "1px solid var(--border-color,#e2e8f0)" }}><Badge text={t.status} map={STATUS_TASK} /></td>
                                <td style={{ padding: "12px", fontSize: 13, borderBottom: "1px solid var(--border-color,#e2e8f0)", color: isOverdue(t) ? "#dc2626" : "inherit" }}>{fmtDate(t.due_date)}</td>
                                <td style={{ padding: "12px", borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ flex: 1, height: 6, background: "var(--border-color,#e2e8f0)", borderRadius: 3 }}>
                                            <div style={{ height: "100%", width: `${t.percent_complete || 0}%`, background: "#3b82f6", borderRadius: 3 }} />
                                        </div>
                                        <span style={{ fontSize: 11, fontWeight: 600, minWidth: 28 }}>{t.percent_complete || 0}%</span>
                                    </div>
                                </td>
                                <td style={{ padding: "12px", borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        {canEdit(t) && <button onClick={() => openEdit(t)} style={{ ...btnSec, padding: "4px 10px", fontSize: 11 }}>Edit</button>}
                                        {canManage && <button onClick={() => del(t.task_id)} style={{ ...btnDanger, padding: "4px 10px", fontSize: 11 }}>Del</button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "var(--muted-text,#64748b)" }}>No tasks found.</div>}
            </div>

            {showAdd && (
                <Modal title={editTask ? "Edit Task" : "Add Task"} onClose={() => { setShowAdd(false); setEditTask(null); }} wide>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={label}>Task Name *</label>
                            <input style={inputFull} value={form.task_name} onChange={e => setForm(f => ({ ...f, task_name: e.target.value }))} />
                        </div>
                        <div>
                            <label style={label}>Assigned To</label>
                            <select style={inputFull} value={form.assigned_employee_id || ""} onChange={e => setForm(f => ({ ...f, assigned_employee_id: e.target.value }))}>
                                <option value="">Unassigned</option>
                                {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.display_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={label}>Priority</label>
                            <select style={inputFull} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                                {["Low","Medium","High","Critical"].map(v => <option key={v}>{v}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={label}>Status</label>
                            <select style={inputFull} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                {["To Do","In Progress","Blocked","Completed","Cancelled"].map(v => <option key={v}>{v}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={label}>Start Date</label>
                            <input type="date" style={inputFull} value={form.start_date || ""} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
                        </div>
                        <div>
                            <label style={label}>Due Date</label>
                            <input type="date" style={inputFull} value={form.due_date || ""} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
                        </div>
                        <div>
                            <label style={label}>Estimated Hours</label>
                            <input type="number" min="0" style={inputFull} value={form.estimated_hours || ""} onChange={e => setForm(f => ({ ...f, estimated_hours: e.target.value }))} />
                        </div>
                        <div>
                            <label style={label}>% Complete</label>
                            <input type="number" min="0" max="100" style={inputFull} value={form.percent_complete || 0} onChange={e => setForm(f => ({ ...f, percent_complete: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) }))} />
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={label}>Description</label>
                            <textarea rows={3} style={{ ...inputFull, resize: "vertical" }} value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                        </div>
                        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button onClick={() => { setShowAdd(false); setEditTask(null); }} style={btnSec}>Cancel</button>
                            <button onClick={save} style={btnPrim}>{editTask ? "Update" : "Create"} Task</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// =====================================================
// TIME LOGS TAB
// =====================================================
function TimeTab({ projectId, canManage, userRole, tasks }) {
    const [logs, setLogs] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [monthFilter, setMonthFilter] = useState("");
    const [form, setForm] = useState({ log_date: new Date().toISOString().split("T")[0], task_id: "", start_time: "", end_time: "", break_minutes: 0, total_hours: "", work_note: "" });

    const load = useCallback(async () => {
        try {
            const q = monthFilter ? `?month=${monthFilter}` : "";
            const r = await API.get(`/projects/${projectId}/timelogs${q}`);
            setLogs(r.data.data || []);
        } catch (e) { console.error(e); }
    }, [projectId, monthFilter]);

    useEffect(() => { load(); }, [load]);

    const save = async () => {
        if (!form.log_date) return;
        await API.post(`/projects/${projectId}/timelogs`, form);
        setShowAdd(false); setForm({ log_date: new Date().toISOString().split("T")[0], task_id: "", start_time: "", end_time: "", break_minutes: 0, total_hours: "", work_note: "" }); load();
    };

    const del = async (id) => { if (!window.confirm("Delete entry?")) return; await API.delete(`/projects/${projectId}/timelogs/${id}`); load(); };

    const totalHours = logs.reduce((sum, l) => sum + parseFloat(l.total_hours || 0), 0);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Time Logs — Total: {totalHours.toFixed(2)}h</h3>
                <div style={{ display: "flex", gap: 8 }}>
                    <input type="month" style={inp} value={monthFilter} onChange={e => setMonthFilter(e.target.value)} />
                    {monthFilter && <button onClick={() => setMonthFilter("")} style={{ ...btnDanger, padding: "8px 12px" }}>Clear</button>}
                    <button onClick={() => setShowAdd(true)} style={btnPrim}>+ Log Time</button>
                </div>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px" }}>
                    <thead>
                        <tr>{["Date","Employee","Task","Start","End","Break","Hours","Notes","Action"].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "var(--muted-text,#64748b)", textTransform: "uppercase" }}>{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody>
                        {logs.map(l => (
                            <tr key={l.log_id} style={{ background: "var(--card-background,#fff)" }}>
                                <td style={{ padding: "11px 12px", fontSize: 13, borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>{fmtDate(l.log_date)}</td>
                                <td style={{ padding: "11px 12px", fontSize: 13, borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>{l.employee_name}</td>
                                <td style={{ padding: "11px 12px", fontSize: 13, borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>{l.task_name || "—"}</td>
                                <td style={{ padding: "11px 12px", fontSize: 13, borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>{l.start_time || "—"}</td>
                                <td style={{ padding: "11px 12px", fontSize: 13, borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>{l.end_time || "—"}</td>
                                <td style={{ padding: "11px 12px", fontSize: 13, borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>{l.break_minutes || 0}m</td>
                                <td style={{ padding: "11px 12px", fontSize: 13, fontWeight: 700, color: "#2563eb", borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>{parseFloat(l.total_hours || 0).toFixed(2)}h</td>
                                <td style={{ padding: "11px 12px", fontSize: 12, color: "var(--muted-text,#64748b)", borderBottom: "1px solid var(--border-color,#e2e8f0)", maxWidth: 160 }}>{l.work_note || "—"}</td>
                                <td style={{ padding: "11px 12px", borderBottom: "1px solid var(--border-color,#e2e8f0)" }}>
                                    {canManage && <button onClick={() => del(l.log_id)} style={{ ...btnDanger, padding: "4px 10px", fontSize: 11 }}>Del</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "var(--muted-text,#64748b)" }}>No time logs yet.</div>}
            </div>

            {showAdd && (
                <Modal title="Log Time" onClose={() => setShowAdd(false)}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <div><label style={label}>Date *</label><input type="date" style={inputFull} value={form.log_date} onChange={e => setForm(f => ({ ...f, log_date: e.target.value }))} /></div>
                            <div><label style={label}>Task</label>
                                <select style={inputFull} value={form.task_id || ""} onChange={e => setForm(f => ({ ...f, task_id: e.target.value }))}>
                                    <option value="">No specific task</option>
                                    {tasks.map(t => <option key={t.task_id} value={t.task_id}>{t.task_name}</option>)}
                                </select>
                            </div>
                            <div><label style={label}>Start Time</label><input type="time" style={inputFull} value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} /></div>
                            <div><label style={label}>End Time</label><input type="time" style={inputFull} value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} /></div>
                            <div><label style={label}>Break (minutes)</label><input type="number" min="0" style={inputFull} value={form.break_minutes} onChange={e => setForm(f => ({ ...f, break_minutes: parseInt(e.target.value) || 0 }))} /></div>
                            <div><label style={label}>Total Hours (override)</label><input type="number" min="0" step="0.25" style={inputFull} value={form.total_hours || ""} onChange={e => setForm(f => ({ ...f, total_hours: e.target.value }))} /></div>
                        </div>
                        <div><label style={label}>Work Note</label><textarea rows={3} style={{ ...inputFull, resize: "vertical" }} value={form.work_note} onChange={e => setForm(f => ({ ...f, work_note: e.target.value }))} /></div>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button onClick={() => setShowAdd(false)} style={btnSec}>Cancel</button>
                            <button onClick={save} style={btnPrim}>Save</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// =====================================================
// DAILY UPDATES TAB
// =====================================================
function UpdatesTab({ projectId, canManage }) {
    const [updates, setUpdates] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ update_date: new Date().toISOString().split("T")[0], tasks_worked_on: "", work_completed: "", work_in_progress: "", issues_blockers: "", next_planned_work: "", time_spent: "" });

    const load = useCallback(async () => {
        try { const r = await API.get(`/projects/${projectId}/updates`); setUpdates(r.data.data || []); }
        catch (e) { console.error(e); }
    }, [projectId]);

    useEffect(() => { load(); }, [load]);

    const save = async () => {
        if (!form.update_date) return;
        await API.post(`/projects/${projectId}/updates`, form);
        setShowAdd(false); setForm({ update_date: new Date().toISOString().split("T")[0], tasks_worked_on: "", work_completed: "", work_in_progress: "", issues_blockers: "", next_planned_work: "", time_spent: "" }); load();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Daily Updates ({updates.length})</h3>
                <button onClick={() => setShowAdd(true)} style={btnPrim}>+ Submit Update</button>
            </div>

            {updates.map(u => (
                <div key={u.update_id} style={{ ...card }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <div>
                            <span style={{ fontWeight: 700, fontSize: 14 }}>{u.employee_name}</span>
                            <span style={{ fontSize: 11, color: "var(--muted-text,#64748b)", marginLeft: 8 }}>{u.employee_code}</span>
                        </div>
                        <span style={{ fontSize: 12, color: "var(--muted-text,#64748b)" }}>{fmtDate(u.update_date)} · {u.time_spent ? `${u.time_spent}h spent` : ""}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        {[
                            { l: "Tasks Worked On", v: u.tasks_worked_on },
                            { l: "Work Completed", v: u.work_completed },
                            { l: "Work In Progress", v: u.work_in_progress },
                            { l: "Issues / Blockers", v: u.issues_blockers },
                            { l: "Next Planned Work", v: u.next_planned_work }
                        ].filter(f => f.v).map(f => (
                            <div key={f.l}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-text,#64748b)", textTransform: "uppercase", marginBottom: 3 }}>{f.l}</div>
                                <div style={{ fontSize: 13, lineHeight: 1.5 }}>{f.v}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {updates.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "var(--muted-text,#64748b)" }}>No updates submitted yet.</div>}

            {showAdd && (
                <Modal title="Submit Daily Update" onClose={() => setShowAdd(false)} wide>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div><label style={label}>Date *</label><input type="date" style={inputFull} value={form.update_date} onChange={e => setForm(f => ({ ...f, update_date: e.target.value }))} /></div>
                        <div><label style={label}>Time Spent (hours)</label><input type="number" min="0" step="0.5" style={inputFull} value={form.time_spent} onChange={e => setForm(f => ({ ...f, time_spent: e.target.value }))} /></div>
                        {[
                            { l: "Tasks Worked On", k: "tasks_worked_on" },
                            { l: "Work Completed", k: "work_completed" },
                            { l: "Work In Progress", k: "work_in_progress" },
                            { l: "Issues / Blockers", k: "issues_blockers" },
                            { l: "Next Planned Work", k: "next_planned_work" }
                        ].map(f => (
                            <div key={f.k} style={{ gridColumn: "1 / -1" }}>
                                <label style={label}>{f.l}</label>
                                <textarea rows={2} style={{ ...inputFull, resize: "vertical" }} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} />
                            </div>
                        ))}
                        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button onClick={() => setShowAdd(false)} style={btnSec}>Cancel</button>
                            <button onClick={save} style={btnPrim}>Submit</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// =====================================================
// MEETINGS TAB
// =====================================================
function MeetingsTab({ projectId, canManage }) {
    const [meetings, setMeetings] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [editM, setEditM] = useState(null);
    const initForm = { title: "", meeting_date: new Date().toISOString().split("T")[0], start_time: "", end_time: "", meeting_type: "General", participants: "", agenda: "", meeting_notes: "", action_items: "", next_followup_date: "", status: "Upcoming" };
    const [form, setForm] = useState(initForm);

    const load = useCallback(async () => {
        try { const r = await API.get(`/projects/${projectId}/meetings`); setMeetings(r.data.data || []); }
        catch (e) { console.error(e); }
    }, [projectId]);

    useEffect(() => { load(); }, [load]);

    const save = async () => {
        if (!form.title || !form.meeting_date) return;
        if (editM) await API.put(`/projects/${projectId}/meetings/${editM.meeting_id}`, form);
        else await API.post(`/projects/${projectId}/meetings`, form);
        setShowAdd(false); setEditM(null); setForm(initForm); load();
    };

    const del = async (id) => { if (!window.confirm("Delete meeting?")) return; await API.delete(`/projects/${projectId}/meetings/${id}`); load(); };

    const openEdit = (m) => {
        setForm({ title: m.title, meeting_date: m.meeting_date?.split("T")[0] || "", start_time: m.start_time || "", end_time: m.end_time || "", meeting_type: m.meeting_type || "General", participants: m.participants || "", agenda: m.agenda || "", meeting_notes: m.meeting_notes || "", action_items: m.action_items || "", next_followup_date: m.next_followup_date?.split("T")[0] || "", status: m.status || "Upcoming" });
        setEditM(m); setShowAdd(true);
    };

    const upcoming = meetings.filter(m => m.status === "Upcoming");
    const past = meetings.filter(m => m.status !== "Upcoming");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Meetings</h3>
                {canManage && <button onClick={() => { setEditM(null); setForm(initForm); setShowAdd(true); }} style={btnPrim}>+ Schedule Meeting</button>}
            </div>

            {upcoming.length > 0 && <h4 style={{ margin: "8px 0 0", fontSize: 13, color: "#2563eb", fontWeight: 700 }}>Upcoming</h4>}
            {[...upcoming, ...(past.length > 0 ? [null] : []), ...past].map((m, i) => {
                if (!m) return <h4 key="past-h" style={{ margin: "16px 0 0", fontSize: 13, color: "var(--muted-text,#64748b)", fontWeight: 700 }}>Past Meetings</h4>;
                return (
                    <div key={m.meeting_id} style={{ ...card }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 15 }}>{m.title}</div>
                                <div style={{ fontSize: 12, color: "var(--muted-text,#64748b)", marginTop: 3 }}>
                                    📅 {fmtDate(m.meeting_date)} {m.start_time ? `· ${m.start_time}${m.end_time ? " – " + m.end_time : ""}` : ""} · {m.meeting_type}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <Badge text={m.status} map={{ Upcoming: { bg: "rgba(59,130,246,0.12)", color: "#2563eb", border: "rgba(59,130,246,0.25)" }, Completed: { bg: "rgba(34,197,94,0.12)", color: "#16a34a", border: "rgba(34,197,94,0.25)" }, Cancelled: { bg: "rgba(239,68,68,0.12)", color: "#dc2626", border: "rgba(239,68,68,0.25)" } }} />
                                {canManage && <><button onClick={() => openEdit(m)} style={{ ...btnSec, padding: "4px 10px", fontSize: 11 }}>Edit</button><button onClick={() => del(m.meeting_id)} style={{ ...btnDanger, padding: "4px 10px", fontSize: 11 }}>Del</button></>}
                            </div>
                        </div>
                        {m.participants && <div style={{ fontSize: 12 }}><strong>Participants:</strong> {m.participants}</div>}
                        {m.agenda && <div style={{ fontSize: 12 }}><strong>Agenda:</strong> {m.agenda}</div>}
                        {m.action_items && <div style={{ fontSize: 12, background: "rgba(234,179,8,0.08)", padding: "8px 12px", borderRadius: 6 }}><strong>Action Items:</strong> {m.action_items}</div>}
                    </div>
                );
            })}
            {meetings.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "var(--muted-text,#64748b)" }}>No meetings yet.</div>}

            {showAdd && (
                <Modal title={editM ? "Edit Meeting" : "Schedule Meeting"} onClose={() => { setShowAdd(false); setEditM(null); }} wide>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div style={{ gridColumn: "1 / -1" }}><label style={label}>Title *</label><input style={inputFull} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
                        <div><label style={label}>Date *</label><input type="date" style={inputFull} value={form.meeting_date} onChange={e => setForm(f => ({ ...f, meeting_date: e.target.value }))} /></div>
                        <div><label style={label}>Type</label><select style={inputFull} value={form.meeting_type} onChange={e => setForm(f => ({ ...f, meeting_type: e.target.value }))}>{["General","Kickoff","Sprint","Review","Retrospective","Client","One-on-One"].map(t => <option key={t}>{t}</option>)}</select></div>
                        <div><label style={label}>Start Time</label><input type="time" style={inputFull} value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} /></div>
                        <div><label style={label}>End Time</label><input type="time" style={inputFull} value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} /></div>
                        <div><label style={label}>Status</label><select style={inputFull} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>{["Upcoming","Completed","Cancelled"].map(s => <option key={s}>{s}</option>)}</select></div>
                        <div><label style={label}>Follow-up Date</label><input type="date" style={inputFull} value={form.next_followup_date} onChange={e => setForm(f => ({ ...f, next_followup_date: e.target.value }))} /></div>
                        {[{ l: "Participants", k: "participants" }, { l: "Agenda", k: "agenda" }, { l: "Meeting Notes", k: "meeting_notes" }, { l: "Action Items", k: "action_items" }].map(f => (
                            <div key={f.k} style={{ gridColumn: "1 / -1" }}><label style={label}>{f.l}</label><textarea rows={2} style={{ ...inputFull, resize: "vertical" }} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} /></div>
                        ))}
                        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button onClick={() => { setShowAdd(false); setEditM(null); }} style={btnSec}>Cancel</button>
                            <button onClick={save} style={btnPrim}>{editM ? "Update" : "Schedule"}</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// =====================================================
// FILES TAB
// =====================================================
function FilesTab({ projectId, canManage }) {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileRef = useState(null);

    const load = useCallback(async () => {
        try { const r = await API.get(`/projects/${projectId}/files`); setFiles(r.data.data || []); }
        catch (e) { console.error(e); }
    }, [projectId]);

    useEffect(() => { load(); }, [load]);

    const upload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append("file", file);
        try {
            await API.post(`/projects/${projectId}/files`, fd, { headers: { "Content-Type": "multipart/form-data" } });
            load();
        } catch (er) { alert("Upload failed"); }
        setUploading(false);
        e.target.value = "";
    };

    const del = async (id) => { if (!window.confirm("Delete file?")) return; await API.delete(`/projects/${projectId}/files/${id}`); load(); };

    const fmtSize = (bytes) => {
        if (!bytes) return "—";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / 1024 / 1024).toFixed(1) + " MB";
    };

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Files & Documents ({files.length})</h3>
                <label style={{ ...btnPrim, cursor: "pointer" }}>
                    {uploading ? "Uploading..." : "⬆ Upload File"}
                    <input type="file" style={{ display: "none" }} onChange={upload} disabled={uploading} />
                </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
                {files.map(f => (
                    <div key={f.file_id} style={{ ...card, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ fontSize: 28, textAlign: "center" }}>
                            {f.file_type?.includes("pdf") ? "📄" : f.file_type?.includes("image") ? "🖼" : f.file_type?.includes("spreadsheet") || f.file_type?.includes("excel") ? "📊" : "📁"}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 13, wordBreak: "break-word", textAlign: "center" }}>{f.file_name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted-text,#64748b)", textAlign: "center" }}>{fmtSize(f.file_size)} · {fmtDate(f.created_at)}</div>
                        <div style={{ fontSize: 11, color: "var(--muted-text,#64748b)", textAlign: "center" }}>by {f.uploaded_by_name || f.uploaded_by_username}</div>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                            <a href={`http://192.168.1.158:5000/api/projects/${projectId}/files/${f.file_id}/download?token=${token}`} style={{ ...btnSec, textDecoration: "none", padding: "6px 12px", fontSize: 12 }}>⬇ Download</a>
                            {canManage && <button onClick={() => del(f.file_id)} style={{ ...btnDanger, padding: "6px 12px", fontSize: 12 }}>Del</button>}
                        </div>
                    </div>
                ))}
            </div>
            {files.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "var(--muted-text,#64748b)" }}>No files uploaded yet.</div>}
        </div>
    );
}

// =====================================================
// ACTIVITY TAB
// =====================================================
function ActivityTab({ projectId }) {
    const [items, setItems] = useState([]);

    const load = useCallback(async () => {
        try { const r = await API.get(`/projects/${projectId}/activity`); setItems(r.data.data || []); }
        catch (e) { console.error(e); }
    }, [projectId]);

    useEffect(() => { load(); }, [load]);

    const iconMap = { project_created: "🚀", project_updated: "✏️", member_added: "➕", member_removed: "➖", task_created: "📋", task_updated: "✅", time_logged: "⏱", update_submitted: "📝", meeting_created: "📅", meeting_updated: "📅", file_uploaded: "📁" };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Activity Log</h3>
            <div style={{ position: "relative" }}>
                {items.map((a, i) => (
                    <div key={a.activity_id} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--app-background,#f4f6f8)", border: "2px solid var(--border-color,#e2e8f0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                            {iconMap[a.action_type] || "📌"}
                        </div>
                        <div style={{ flex: 1, paddingTop: 4 }}>
                            <div style={{ fontSize: 13 }}><strong>{a.display_name || a.username || "System"}</strong> {a.description}</div>
                            <div style={{ fontSize: 11, color: "var(--muted-text,#64748b)", marginTop: 2 }}>{fmtDT(a.created_at)}</div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "var(--muted-text,#64748b)" }}>No activity yet.</div>}
            </div>
        </div>
    );
}

// =====================================================
// MAIN COMPONENT
// =====================================================
export default function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role || "";
    const canManage = ["Super Admin", "Admin", "Manager"].includes(role);

    const [project, setProject] = useState(null);
    const [stats, setStats] = useState({});
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [activeTab, setActiveTab] = useState("Overview");
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const loadProject = useCallback(async () => {
        try {
            const r = await API.get(`/projects/${id}`);
            if (r.data.success) { setProject(r.data.data); setStats(r.data.data.stats || {}); }
            else setNotFound(true);
        } catch { setNotFound(true); }
        setLoading(false);
    }, [id]);

    const loadEmployees = useCallback(async () => {
        try { const r = await API.get("/employees"); setEmployees(r.data.data || r.data.employees || []); } catch {}
    }, []);

    const loadTasks = useCallback(async () => {
        try { const r = await API.get(`/projects/${id}/tasks`); setTasks(r.data.data || []); } catch {}
    }, [id]);

    useEffect(() => { loadProject(); loadEmployees(); loadTasks(); }, [loadProject, loadEmployees, loadTasks]);

    const page = { display: "flex", minHeight: "100vh", background: "var(--app-background,#f4f6f8)", color: "var(--text-color,#1e293b)" };
    const main = { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 };
    const content = { padding: "20px", maxWidth: 1400, margin: "0 auto", width: "100%" };

    if (loading) return (
        <div style={page}>
            <Sidebar /><div style={main}><Navbar />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>Loading...</div>
            </div>
        </div>
    );

    if (notFound) return (
        <div style={page}>
            <Sidebar /><div style={main}><Navbar />
                <div style={{ ...content, textAlign: "center", paddingTop: 80 }}>
                    <div style={{ fontSize: 40 }}>🚫</div>
                    <h2>Project not found or access denied</h2>
                    <button onClick={() => navigate("/projects")} style={btnPrim}>← Back to Projects</button>
                </div>
            </div>
        </div>
    );

    const prog = stats.total_tasks ? Math.round((stats.completed_tasks / stats.total_tasks) * 100) : 0;

    return (
        <div style={page}>
            <Sidebar />
            <div style={main}>
                <Navbar />
                <div style={content}>
                    {/* HEADER */}
                    <div style={{ background: "linear-gradient(135deg,#1e293b 0%,#334155 100%)", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                            <div>
                                <button onClick={() => navigate("/projects")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13, marginBottom: 8, padding: 0 }}>← Back to Projects</button>
                                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{project.project_code}</div>
                                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>{project.project_name}</h1>
                                <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    <Badge text={project.status} map={{ ...STATUS_PROJ }} />
                                    <Badge text={project.priority} map={PRIORITY_COLORS} />
                                    {project.manager_name && <span style={{ fontSize: 12, color: "#94a3b8" }}>👤 {project.manager_name}</span>}
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 11, color: "#94a3b8" }}>Progress</div>
                                <div style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>{prog}%</div>
                                <div style={{ width: 120, height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3, marginTop: 4 }}>
                                    <div style={{ height: "100%", width: `${prog}%`, background: "#3b82f6", borderRadius: 3 }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABS */}
                    <div style={{ display: "flex", gap: 2, borderBottom: "2px solid var(--border-color,#e2e8f0)", marginBottom: 20, overflowX: "auto" }}>
                        {TABS.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "10px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: activeTab === tab ? "#2563eb" : "var(--muted-text,#64748b)", borderBottom: activeTab === tab ? "2px solid #2563eb" : "2px solid transparent", marginBottom: -2, whiteSpace: "nowrap", transition: "color .15s" }}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* TAB CONTENT */}
                    {activeTab === "Overview" && <OverviewTab project={project} stats={stats} canManage={canManage} employees={employees} onUpdate={loadProject} />}
                    {activeTab === "Members" && <MembersTab projectId={id} canManage={canManage} employees={employees} />}
                    {activeTab === "Tasks" && <TasksTab projectId={id} canManage={canManage} employees={employees} userRole={role} userEmployeeId={user.employee_id} />}
                    {activeTab === "Time" && <TimeTab projectId={id} canManage={canManage} userRole={role} tasks={tasks} />}
                    {activeTab === "Updates" && <UpdatesTab projectId={id} canManage={canManage} />}
                    {activeTab === "Meetings" && <MeetingsTab projectId={id} canManage={canManage} />}
                    {activeTab === "Files" && <FilesTab projectId={id} canManage={canManage} />}
                    {activeTab === "Activity" && <ActivityTab projectId={id} />}
                </div>
            </div>
        </div>
    );
}
