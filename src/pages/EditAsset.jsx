import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

// Helper components
const FormField = ({ label, required, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-color)" }}>
            {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
        {children}
    </div>
);

const SectionHeader = ({ icon, title, subtitle }) => (
    <div style={{ margin: "30px 0 20px", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--accent-color)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
            {icon}
        </div>
        <div>
            <h3 style={{ margin: 0, fontSize: "18px", color: "var(--text-color)", fontWeight: "600" }}>{title}</h3>
            {subtitle && <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted-text-color)" }}>{subtitle}</p>}
        </div>
    </div>
);

function EditAsset() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(false);
    const [dropdownLoading, setDropdownLoading] = useState(true);
    const [warrantyDocument, setWarrantyDocument] = useState(null);

    const [form, setForm] = useState({
        asset_code: "",
        asset_type: "",
        asset_name: "",
        category_id: "",
        brand: "",
        model: "",
        serial_number: "",
        processor: "",
        ram: "",
        storage: "",
        storage_spec: "",
        operating_system: "",
        
        warranty_started: "",
        warranty_expiry: "",
        
        current_employee_id: "",
        location_id: "",
        department: "",
        designation: "",
        floor: "",
        remarks: "",
        asset_status: "In Stock"
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setDropdownLoading(true);
                const [categoryRes, locationRes, employeeRes] = await Promise.all([
                    API.get("/categories"),
                    API.get("/locations"),
                    API.get("/employees")
                ]);
                setCategories(categoryRes.data.data || []);
                setLocations(locationRes.data.data || []);
                setEmployees(employeeRes.data.data || []);

                if (isEdit) {
                    const assetRes = await API.get(`/assets/${id}`);
                    const asset = assetRes.data.data;
                    setForm({
                        asset_code: asset.asset_code || "",
                        asset_type: asset.asset_type || "",
                        asset_name: asset.asset_name || "",
                        category_id: asset.category_id || "",
                        brand: asset.brand || "",
                        model: asset.model || "",
                        serial_number: asset.serial_number || "",
                        processor: asset.processor || "",
                        ram: asset.ram || "",
                        storage: asset.storage || "",
                        storage_spec: asset.storage_spec || "",
                        operating_system: asset.operating_system || "",
                        
                        warranty_started: asset.warranty_started ? asset.warranty_started.split('T')[0] : "",
                        warranty_expiry: asset.warranty_expiry ? asset.warranty_expiry.split('T')[0] : "",
                        
                        current_employee_id: asset.current_employee_id || "",
                        location_id: asset.location_id || "",
                        department: asset.department || "",
                        designation: asset.designation || "",
                        floor: asset.floor || "",
                        remarks: asset.remarks || "",
                        asset_status: asset.asset_status || "In Stock"
                    });
                }
            } catch (error) {
                console.error("Load Error:", error);
                alert(error.response?.data?.message || "Failed to load data");
            } finally {
                setDropdownLoading(false);
            }
        };
        loadData();
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        
        // Auto-update assignment status logic
        if (name === "current_employee_id") {
            if (value && form.asset_status !== "Assigned") {
                setForm(prev => ({ ...prev, asset_status: "Assigned" }));
            } else if (!value && form.asset_status === "Assigned") {
                setForm(prev => ({ ...prev, asset_status: "In Stock" }));
            }
        }
    };

    const handleWarrantyDocument = (e) => {
        const file = e.target.files?.[0];
        if (!file) { setWarrantyDocument(null); return; }
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            alert("Only PDF, JPG, JPEG and PNG files are allowed");
            e.target.value = "";
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert("File size must be 10 MB or less");
            e.target.value = "";
            return;
        }
        setWarrantyDocument(file);
    };

    const validateForm = () => {
        if (!form.asset_code.trim()) { alert("Asset Code is required"); return false; }
        if (!form.category_id) { alert("Please select a category"); return false; }
        if (form.asset_status === "Assigned" && !form.current_employee_id) {
            alert("Please select an employee when assigning the asset.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            setLoading(true);
            
            const payload = { ...form };
            payload.category_id = Number(payload.category_id) || null;
            payload.location_id = Number(payload.location_id) || null;
            payload.current_employee_id = Number(payload.current_employee_id) || null;
            
            if (payload.warranty_started || payload.warranty_expiry) {
                payload.warranty_status = "In Warranty";
            } else {
                payload.warranty_status = "Unknown";
            }

            let assetId = id;
            if (isEdit) {
                await API.put(`/assets/${id}`, payload);
            } else {
                const response = await API.post("/assets", payload);
                assetId = response.data.asset_id;
            }

            if (warrantyDocument && assetId) {
                const formData = new FormData();
                formData.append("warranty_document", warrantyDocument);
                await API.post(`/assets/${assetId}/warranty-document`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            alert(isEdit ? "Asset updated successfully" : "Asset added successfully");
            navigate("/assets");
            
        } catch (error) {
            console.error("Save Error:", error);
            alert(error.response?.data?.message || error.message || "Failed to save asset");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--background-color)", color: "var(--text-color)", fontSize: "14px", width: "100%", outline: "none" };
    const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--background-color)" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
                <Navbar />
                <main style={{ flex: 1, overflowY: "auto", padding: "30px", background: "var(--background-color)" }}>
                    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                        <div style={{ marginBottom: "30px", display: "flex", alignItems: "center", gap: "15px" }}>
                            <button onClick={() => navigate("/assets")} style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--card-background)", color: "var(--text-color)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                                ←
                            </button>
                            <div>
                                <h1 style={{ margin: 0, fontSize: "24px", color: "var(--text-color)", fontWeight: "700" }}>
                                    {isEdit ? "Edit Hardware Asset" : "Add Hardware Asset"}
                                </h1>
                                <p style={{ margin: "5px 0 0", color: "var(--muted-text-color)", fontSize: "14px" }}>
                                    {isEdit ? "Update details of the existing hardware asset" : "Register a new hardware asset in the inventory"}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} style={{ background: "var(--card-background)", padding: "30px", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
                            
                            {/* ASSET INFORMATION */}
                            <SectionHeader icon="💻" title="Asset Information" subtitle="Basic hardware details" />
                            <div style={gridStyle}>
                                <FormField label="Asset Code" required>
                                    <input name="asset_code" value={form.asset_code} onChange={handleChange} style={inputStyle} required />
                                </FormField>
                                <FormField label="Asset Type">
                                    <input name="asset_type" value={form.asset_type} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="Category" required>
                                    <select name="category_id" value={form.category_id} onChange={handleChange} style={inputStyle} required>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                                    </select>
                                </FormField>
                                <FormField label="Brand">
                                    <input name="brand" value={form.brand} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="Model">
                                    <input name="model" value={form.model} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="Serial Number">
                                    <input name="serial_number" value={form.serial_number} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="Processor">
                                    <input name="processor" value={form.processor} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="RAM">
                                    <input name="ram" value={form.ram} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="Storage 1">
                                    <input name="storage" value={form.storage} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="Storage 2">
                                    <input name="storage_spec" value={form.storage_spec} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="Operating System">
                                    <input name="operating_system" value={form.operating_system} onChange={handleChange} style={inputStyle} />
                                </FormField>
                            </div>

                            {/* WARRANTY INFORMATION */}
                            <SectionHeader icon="🛡️" title="Warranty Information" subtitle="Enter warranty details and upload document" />
                            <div style={gridStyle}>
                                <FormField label="Warranty Started">
                                    <input type="date" name="warranty_started" value={form.warranty_started} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="Warranty Expiry">
                                    <input type="date" name="warranty_expiry" value={form.warranty_expiry} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="Warranty Document (PDF/Image)">
                                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleWarrantyDocument} style={inputStyle} />
                                </FormField>
                            </div>

                            {/* ASSIGNMENT & LOCATION */}
                            <SectionHeader icon="🏢" title="Assignment & Location" subtitle="Enter physical location and assignment details" />
                            <div style={gridStyle}>
                                <FormField label="Employee Name & Code">
                                    <select name="current_employee_id" value={form.current_employee_id} onChange={handleChange} style={inputStyle}>
                                        <option value="">Unassigned</option>
                                        {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.display_name} ({e.employee_code})</option>)}
                                    </select>
                                </FormField>
                                <FormField label="Location">
                                    <select name="location_id" value={form.location_id} onChange={handleChange} style={inputStyle}>
                                        <option value="">Select Location</option>
                                        {locations.map(l => <option key={l.location_id} value={l.location_id}>{l.location_name}</option>)}
                                    </select>
                                </FormField>
                                <FormField label="Department">
                                    <input name="department" value={form.department} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="Designation">
                                    <input name="designation" value={form.designation} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="Floor">
                                    <input name="floor" value={form.floor} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="Remarks">
                                    <input name="remarks" value={form.remarks} onChange={handleChange} style={inputStyle} />
                                </FormField>
                                <FormField label="Assign Status" required>
                                    <select name="asset_status" value={form.asset_status} onChange={handleChange} style={inputStyle} required>
                                        <option value="In Stock">In Stock (Spare)</option>
                                        <option value="Assigned">Assigned</option>
                                        <option value="Repair">Repair</option>
                                        <option value="Scrap">Scrap</option>
                                        <option value="Lost">Lost</option>
                                    </select>
                                </FormField>
                            </div>

                            {/* ACTIONS */}
                            <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid var(--border-color)", display: "flex", gap: "15px", justifyContent: "flex-end" }}>
                                <button type="button" onClick={() => navigate("/assets")} style={{ padding: "12px 24px", borderRadius: "8px", background: "transparent", border: "1px solid var(--border-color)", color: "var(--text-color)", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} style={{ padding: "12px 24px", borderRadius: "8px", background: "var(--accent-color)", border: "none", color: "white", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontSize: "14px" }}>
                                    {loading ? "Saving..." : isEdit ? "Update Hardware Asset" : "Add Hardware Asset"}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default EditAsset;
