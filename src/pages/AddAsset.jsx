import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";


function AddAsset() {

    const navigate = useNavigate();


    const [categories, setCategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [locations, setLocations] = useState([]);


    const [loading, setLoading] = useState(false);
    const [dropdownLoading, setDropdownLoading] =
        useState(true);


    const [warrantyDocument, setWarrantyDocument] =
        useState(null);


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
        ram_capacity: "",
        storage: "",
        storage_spec: "",
        operating_system: "",

        configuration_specs: "",

        vendor_id: "",

        purchase_date: "",
        purchase_cost: "",
        invoice_number: "",

        warranty_expiry: "",

        department: "",

        location_id: "",
        floor: "",

        remarks: ""
    });


    // =====================================================
    // LOAD DROPDOWN DATA
    // =====================================================

    useEffect(() => {

        const loadDropdownData = async () => {

            try {

                setDropdownLoading(true);


                const [
                    categoryRes,
                    vendorRes,
                    locationRes
                ] = await Promise.all([

                    API.get(
                        "/categories"
                    ),

                    API.get(
                        "/vendors"
                    ),

                    API.get(
                        "/locations"
                    )
                ]);


                setCategories(
                    categoryRes.data.data || []
                );


                setVendors(
                    vendorRes.data.data || []
                );


                setLocations(
                    locationRes.data.data || []
                );


            } catch (error) {

                console.error(
                    "Dropdown Load Error:",
                    error
                );


                alert(
                    error.response?.data?.message ||
                    "Failed to load dropdown data"
                );


            } finally {

                setDropdownLoading(false);

            }
        };


        loadDropdownData();

    }, []);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    };


    // =====================================================
    // WARRANTY DOCUMENT
    // =====================================================

    const handleWarrantyDocument = (e) => {

        const file =
            e.target.files?.[0];


        if (!file) {

            setWarrantyDocument(null);

            return;
        }


        const allowedTypes = [

            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/jpg"
        ];


        const maxSize =
            10 * 1024 * 1024;


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            alert(
                "Only PDF, JPG, JPEG and PNG files are allowed"
            );


            e.target.value = "";

            return;
        }


        if (
            file.size > maxSize
        ) {

            alert(
                "File size must be 10 MB or less"
            );


            e.target.value = "";

            return;
        }


        setWarrantyDocument(file);
    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        if (
            !form.asset_code.trim()
        ) {

            alert(
                "Asset Code is required"
            );

            return false;
        }


        if (
            !form.asset_type.trim()
        ) {

            alert(
                "Asset Type is required"
            );

            return false;
        }


        if (
            !form.asset_name.trim()
        ) {

            alert(
                "Asset Name is required"
            );

            return false;
        }


        if (
            !form.category_id
        ) {

            alert(
                "Please select a category"
            );

            return false;
        }


        if (
            !form.brand.trim()
        ) {

            alert(
                "Brand is required"
            );

            return false;
        }


        if (
            !form.model.trim()
        ) {

            alert(
                "Model is required"
            );

            return false;
        }


        if (
            !form.serial_number.trim()
        ) {

            alert(
                "Serial Number is required"
            );

            return false;
        }


        if (
            !form.vendor_id
        ) {

            alert(
                "Please select a vendor"
            );

            return false;
        }


        if (
            !form.purchase_date
        ) {

            alert(
                "Purchase Date is required"
            );

            return false;
        }


        if (
            form.purchase_cost !== "" &&
            Number(form.purchase_cost) < 0
        ) {

            alert(
                "Purchase Cost cannot be negative"
            );

            return false;
        }


        if (
            !form.location_id
        ) {

            alert(
                "Please select a location"
            );

            return false;
        }


        return true;
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (
            !validateForm()
        ) {

            return;
        }


        try {

            setLoading(true);


            const selectedVendor =
                vendors.find(
                    vendor =>
                        Number(
                            vendor.vendor_id
                        ) === Number(
                            form.vendor_id
                        )
                );


            const payload = {

                asset_code:
                    form.asset_code.trim(),

                asset_type:
                    form.asset_type.trim(),

                asset_name:
                    form.asset_name.trim(),

                category_id:
                    Number(
                        form.category_id
                    ),

                brand:
                    form.brand.trim(),

                model:
                    form.model.trim(),

                serial_number:
                    form.serial_number.trim(),

                processor:
                    form.processor.trim() ||
                    null,

                ram:
                    form.ram.trim() ||
                    null,

                ram_capacity:
                    form.ram_capacity.trim() ||
                    null,

                storage:
                    form.storage.trim() ||
                    null,

                storage_spec:
                    form.storage_spec.trim() ||
                    null,

                operating_system:
                    form.operating_system.trim() ||
                    null,

                configuration_specs:
                    form.configuration_specs.trim() ||
                    null,

                vendor_id:
                    Number(
                        form.vendor_id
                    ),

                vendor_name:
                    selectedVendor?.vendor_name ||
                    null,

                purchase_date:
                    form.purchase_date,

                purchase_cost:
                    form.purchase_cost === ""
                        ? null
                        : Number(
                            form.purchase_cost
                        ),

                invoice_number:
                    form.invoice_number.trim() ||
                    null,

                warranty_expiry:
                    form.warranty_expiry ||
                    null,

                warranty_status:
                    form.warranty_expiry
                        ? "In Warranty"
                        : "Unknown",

                department:
                    form.department.trim() ||
                    null,

                location_id:
                    Number(
                        form.location_id
                    ),

                floor:
                    form.floor.trim() ||
                    null,

                asset_status:
                    "In Stock",

                remarks:
                    form.remarks.trim() ||
                    null
            };


            const response =
                await API.post(
                    "/assets",
                    payload
                );


            if (
                !response.data?.success
            ) {

                throw new Error(
                    response.data?.message ||
                    "Failed to add asset"
                );
            }


            const assetId =
                response.data.asset_id;


            // =================================================
            // UPLOAD WARRANTY DOCUMENT
            // =================================================

            if (
                warrantyDocument &&
                assetId
            ) {

                const formData =
                    new FormData();


                formData.append(
                    "warranty_document",
                    warrantyDocument
                );


                await API.post(

                    `/assets/${assetId}/warranty-document`,

                    formData,

                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );
            }


            alert(
                warrantyDocument
                    ? "Asset and warranty document added successfully"
                    : "Asset added successfully"
            );


            navigate(
                "/assets"
            );


        } catch (error) {

            console.error(
                "Add Asset Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                error.message ||
                "Failed to add asset"
            );


        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        if (loading) {

            return;
        }


        navigate(
            "/assets"
        );
    };


    return (

        <div
            style={pageStyle}
        >

            <Sidebar />


            <div
                style={contentStyle}
            >

                <Navbar />


                <main
                    style={mainStyle}
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        style={headerStyle}
                    >

                        <div>

                            <div
                                style={
                                    breadcrumbStyle
                                }
                            >
                                Hardware Assets / Add Asset
                            </div>


                            <h1
                                style={
                                    titleStyle
                                }
                            >
                                Add Hardware Asset
                            </h1>


                            <p
                                style={
                                    subtitleStyle
                                }
                            >
                                Add a new company hardware asset
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={
                                handleCancel
                            }
                            disabled={loading}
                            style={
                                backButtonStyle
                            }
                        >
                            ← Back to Assets
                        </button>

                    </div>


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        style={
                            formCardStyle
                        }
                    >

                        {/* =================================================
                            BASIC INFORMATION
                        ================================================= */}

                        <SectionHeader
                            icon="🖥️"
                            title="Asset Information"
                            subtitle="Enter the basic hardware asset details"
                        />


                        <div
                            style={
                                gridStyle
                            }
                        >

                            <FormField
                                label="Asset Code"
                                required
                            >

                                <input
                                    type="text"
                                    name="asset_code"
                                    value={
                                        form.asset_code
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="AST-001"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="Asset Type"
                                required
                            >

                                <select
                                    name="asset_type"
                                    value={
                                        form.asset_type
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={
                                        inputStyle
                                    }
                                >

                                    <option value="">
                                        Select Asset Type
                                    </option>

                                    <option value="Laptop">
                                        Laptop
                                    </option>

                                    <option value="Desktop">
                                        Desktop
                                    </option>

                                    <option value="Monitor">
                                        Monitor
                                    </option>

                                    <option value="Printer">
                                        Printer
                                    </option>

                                    <option value="Server">
                                        Server
                                    </option>

                                    <option value="Network Device">
                                        Network Device
                                    </option>

                                    <option value="UPS">
                                        UPS
                                    </option>

                                    <option value="Storage Device">
                                        Storage Device
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </FormField>


                            <FormField
                                label="Asset Name"
                                required
                            >

                                <input
                                    type="text"
                                    name="asset_name"
                                    value={
                                        form.asset_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Dell Latitude Laptop"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="Category"
                                required
                            >

                                <select
                                    name="category_id"
                                    value={
                                        form.category_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        dropdownLoading
                                    }
                                    style={
                                        inputStyle
                                    }
                                >

                                    <option value="">
                                        {dropdownLoading
                                            ? "Loading categories..."
                                            : "Select Category"}
                                    </option>


                                    {categories.map(
                                        category => (

                                            <option
                                                key={
                                                    category.category_id
                                                }
                                                value={
                                                    category.category_id
                                                }
                                            >
                                                {
                                                    category.category_name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </FormField>


                            <FormField
                                label="Brand"
                                required
                            >

                                <input
                                    type="text"
                                    name="brand"
                                    value={
                                        form.brand
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Dell"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="Model"
                                required
                            >

                                <input
                                    type="text"
                                    name="model"
                                    value={
                                        form.model
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Latitude 5440"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="Serial Number"
                                required
                            >

                                <input
                                    type="text"
                                    name="serial_number"
                                    value={
                                        form.serial_number
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="SN123456789"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="Processor"
                            >

                                <input
                                    type="text"
                                    name="processor"
                                    value={
                                        form.processor
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Intel Core i5"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="RAM"
                            >

                                <input
                                    type="text"
                                    name="ram"
                                    value={
                                        form.ram
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="16 GB"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="RAM Capacity"
                            >

                                <input
                                    type="text"
                                    name="ram_capacity"
                                    value={
                                        form.ram_capacity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="16 GB DDR4"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="Storage"
                            >

                                <input
                                    type="text"
                                    name="storage"
                                    value={
                                        form.storage
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="SSD"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="Storage Specification"
                            >

                                <input
                                    type="text"
                                    name="storage_spec"
                                    value={
                                        form.storage_spec
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="512 GB NVMe SSD"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="Operating System"
                            >

                                <input
                                    type="text"
                                    name="operating_system"
                                    value={
                                        form.operating_system
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Windows 11 Pro"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>

                        </div>


                        {/* =================================================
                            CONFIGURATION
                        ================================================= */}

                        <SectionHeader
                            icon="⚙️"
                            title="Configuration & Specifications"
                            subtitle="Add additional technical information"
                        />


                        <FormField
                            label="Configuration / Specifications"
                        >

                            <textarea
                                name="configuration_specs"
                                value={
                                    form.configuration_specs
                                }
                                onChange={
                                    handleChange
                                }
                                rows="5"
                                placeholder="Enter hardware configuration, specifications, accessories, etc."
                                style={
                                    textareaStyle
                                }
                            />

                        </FormField>


                        {/* =================================================
                            PURCHASE INFORMATION
                        ================================================= */}

                        <SectionHeader
                            icon="💰"
                            title="Purchase Information"
                            subtitle="Enter purchase and vendor details"
                        />


                        <div
                            style={
                                gridStyle
                            }
                        >

                            <FormField
                                label="Vendor"
                                required
                            >

                                <select
                                    name="vendor_id"
                                    value={
                                        form.vendor_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        dropdownLoading
                                    }
                                    style={
                                        inputStyle
                                    }
                                >

                                    <option value="">
                                        {dropdownLoading
                                            ? "Loading vendors..."
                                            : "Select Vendor"}
                                    </option>


                                    {vendors.map(
                                        vendor => (

                                            <option
                                                key={
                                                    vendor.vendor_id
                                                }
                                                value={
                                                    vendor.vendor_id
                                                }
                                            >
                                                {
                                                    vendor.vendor_name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </FormField>


                            <FormField
                                label="Purchase Date"
                                required
                            >

                                <input
                                    type="date"
                                    name="purchase_date"
                                    value={
                                        form.purchase_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="Purchase Cost"
                            >

                                <input
                                    type="number"
                                    name="purchase_cost"
                                    value={
                                        form.purchase_cost
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="250000"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="Invoice Number"
                            >

                                <input
                                    type="text"
                                    name="invoice_number"
                                    value={
                                        form.invoice_number
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="INV-2026-001"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>

                        </div>


                        {/* =================================================
                            WARRANTY
                        ================================================= */}

                        <SectionHeader
                            icon="🛡️"
                            title="Warranty Information"
                            subtitle="Enter warranty details and upload warranty document"
                        />


                        <div
                            style={
                                gridStyle
                            }
                        >

                            <FormField
                                label="Warranty Expiry"
                            >

                                <input
                                    type="date"
                                    name="warranty_expiry"
                                    value={
                                        form.warranty_expiry
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="Warranty Document"
                            >

                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={
                                        handleWarrantyDocument
                                    }
                                    style={
                                        fileInputStyle
                                    }
                                />


                                <p
                                    style={
                                        helpTextStyle
                                    }
                                >
                                    Allowed: PDF, JPG, JPEG, PNG
                                    <br />
                                    Maximum size: 10 MB
                                </p>


                                {warrantyDocument && (

                                    <div
                                        style={
                                            selectedFileStyle
                                        }
                                    >
                                        📄{" "}
                                        {
                                            warrantyDocument.name
                                        }
                                    </div>

                                )}

                            </FormField>

                        </div>


                        {/* =================================================
                            LOCATION / DEPARTMENT
                        ================================================= */}

                        <SectionHeader
                            icon="📍"
                            title="Assignment & Location"
                            subtitle="Enter department and physical location"
                        />


                        <div
                            style={
                                gridStyle
                            }
                        >

                            <FormField
                                label="Department"
                            >

                                <input
                                    type="text"
                                    name="department"
                                    value={
                                        form.department
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="IT Department"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>


                            <FormField
                                label="Location"
                                required
                            >

                                <select
                                    name="location_id"
                                    value={
                                        form.location_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        dropdownLoading
                                    }
                                    style={
                                        inputStyle
                                    }
                                >

                                    <option value="">
                                        {dropdownLoading
                                            ? "Loading locations..."
                                            : "Select Location"}
                                    </option>


                                    {locations.map(
                                        location => (

                                            <option
                                                key={
                                                    location.location_id
                                                }
                                                value={
                                                    location.location_id
                                                }
                                            >
                                                {
                                                    location.location_name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </FormField>


                            <FormField
                                label="Floor"
                            >

                                <input
                                    type="text"
                                    name="floor"
                                    value={
                                        form.floor
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="2nd Floor"
                                    style={
                                        inputStyle
                                    }
                                />

                            </FormField>

                        </div>


                        {/* =================================================
                            REMARKS
                        ================================================= */}

                        <SectionHeader
                            icon="📝"
                            title="Remarks"
                            subtitle="Add any additional notes"
                        />


                        <FormField
                            label="Remarks"
                        >

                            <textarea
                                name="remarks"
                                value={
                                    form.remarks
                                }
                                onChange={
                                    handleChange
                                }
                                rows="4"
                                placeholder="Enter additional remarks..."
                                style={
                                    textareaStyle
                                }
                            />

                        </FormField>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <div
                            style={
                                statusSectionStyle
                            }
                        >

                            <div>

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Asset Status
                                </label>

                                <p
                                    style={
                                        helpTextStyle
                                    }
                                >
                                    New assets are automatically added as
                                    "In Stock".
                                </p>

                            </div>


                            <div
                                style={
                                    statusBadgeStyle
                                }
                            >

                                <span
                                    style={
                                        statusDotStyle
                                    }
                                />

                                In Stock

                            </div>

                        </div>


                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <div
                            style={
                                buttonContainerStyle
                            }
                        >

                            <button
                                type="button"
                                onClick={
                                    handleCancel
                                }
                                disabled={
                                    loading
                                }
                                style={
                                    cancelButtonStyle
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    dropdownLoading
                                }
                                style={{
                                    ...submitButtonStyle,

                                    opacity:
                                        loading ||
                                        dropdownLoading
                                            ? 0.7
                                            : 1
                                }}
                            >

                                {loading
                                    ? "Adding Asset..."
                                    : "Add Hardware Asset"}

                            </button>

                        </div>

                    </form>

                </main>

            </div>

        </div>
    );
}


// =====================================================
// SECTION HEADER
// =====================================================

function SectionHeader({
    icon,
    title,
    subtitle
}) {

    return (

        <div
            style={
                sectionHeaderStyle
            }
        >

            <div
                style={
                    sectionIconStyle
                }
            >
                {icon}
            </div>


            <div>

                <h2
                    style={
                        sectionTitleStyle
                    }
                >
                    {title}
                </h2>


                <p
                    style={
                        sectionSubtitleStyle
                    }
                >
                    {subtitle}
                </p>

            </div>

        </div>
    );
}


// =====================================================
// FORM FIELD
// =====================================================

function FormField({
    label,
    required,
    children
}) {

    return (

        <div
            style={
                fieldStyle
            }
        >

            <label
                style={
                    labelStyle
                }
            >

                {label}

                {required && (

                    <span
                        style={
                            requiredStyle
                        }
                    >
                        *
                    </span>

                )}

            </label>


            {children}

        </div>
    );
}


// =====================================================
// STYLES
// =====================================================

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

    padding: "30px",

    maxWidth: "1200px",

    margin: "0 auto"
};


const headerStyle = {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-end",

    gap: "20px",

    marginBottom: "25px"
};


const breadcrumbStyle = {

    color: "#64748b",

    fontSize: "13px",

    marginBottom: "8px"
};


const titleStyle = {

    margin: 0,

    fontSize: "28px",

    fontWeight: "700",

    color: "#0f172a"
};


const subtitleStyle = {

    margin: "7px 0 0",

    color: "#64748b",

    fontSize: "14px"
};


const backButtonStyle = {

    padding: "9px 14px",

    border:
        "1px solid #cbd5e1",

    borderRadius: "7px",

    background: "#ffffff",

    color: "#334155",

    cursor: "pointer",

    fontSize: "13px"
};


const formCardStyle = {

    background: "#ffffff",

    border:
        "1px solid #e2e8f0",

    borderRadius: "12px",

    padding: "28px",

    boxShadow:
        "0 2px 8px rgba(15, 23, 42, 0.05)"
};


const sectionHeaderStyle = {

    display: "flex",

    alignItems: "center",

    gap: "12px",

    paddingBottom: "20px",

    marginTop: "10px",

    marginBottom: "25px",

    borderBottom:
        "1px solid #e2e8f0"
};


const sectionIconStyle = {

    width: "40px",

    height: "40px",

    borderRadius: "9px",

    background: "#eff6ff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "19px"
};


const sectionTitleStyle = {

    margin: 0,

    fontSize: "17px",

    color: "#0f172a"
};


const sectionSubtitleStyle = {

    margin: "3px 0 0",

    color: "#64748b",

    fontSize: "12px"
};


const gridStyle = {

    display: "grid",

    gridTemplateColumns:
        "repeat(auto-fit, minmax(280px, 1fr))",

    gap: "20px",

    marginBottom: "25px"
};


const fieldStyle = {

    display: "flex",

    flexDirection: "column"
};


const labelStyle = {

    display: "block",

    marginBottom: "7px",

    fontSize: "13px",

    fontWeight: "600",

    color: "#334155"
};


const requiredStyle = {

    color: "#dc2626",

    marginLeft: "3px"
};


const inputStyle = {

    width: "100%",

    height: "42px",

    padding: "0 12px",

    boxSizing: "border-box",

    border:
        "1px solid #cbd5e1",

    borderRadius: "7px",

    background: "#ffffff",

    color: "#0f172a",

    fontSize: "13px",

    outline: "none"
};


const textareaStyle = {

    width: "100%",

    padding: "12px",

    boxSizing: "border-box",

    border:
        "1px solid #cbd5e1",

    borderRadius: "7px",

    background: "#ffffff",

    color: "#0f172a",

    fontSize: "13px",

    resize: "vertical",

    outline: "none"
};


const fileInputStyle = {

    width: "100%",

    padding: "10px",

    boxSizing: "border-box",

    border:
        "1px solid #cbd5e1",

    borderRadius: "7px",

    background: "#ffffff",

    fontSize: "13px"
};


const helpTextStyle = {

    margin: "6px 0 0",

    fontSize: "12px",

    color: "#64748b",

    lineHeight: "1.5"
};


const selectedFileStyle = {

    marginTop: "8px",

    padding: "8px 10px",

    background: "#eff6ff",

    color: "#1d4ed8",

    borderRadius: "6px",

    fontSize: "12px",

    wordBreak: "break-word"
};


const statusSectionStyle = {

    marginTop: "25px",

    padding: "16px",

    borderRadius: "8px",

    background: "#f8fafc",

    border:
        "1px solid #e2e8f0",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "15px"
};


const statusBadgeStyle = {

    display: "inline-flex",

    alignItems: "center",

    gap: "7px",

    padding: "7px 12px",

    borderRadius: "20px",

    background: "#dcfce7",

    color: "#166534",

    fontSize: "12px",

    fontWeight: "600"
};


const statusDotStyle = {

    width: "7px",

    height: "7px",

    borderRadius: "50%",

    background: "#22c55e"
};


const buttonContainerStyle = {

    display: "flex",

    justifyContent: "flex-end",

    gap: "10px",

    marginTop: "28px",

    paddingTop: "20px",

    borderTop:
        "1px solid #e2e8f0"
};


const cancelButtonStyle = {

    padding: "10px 18px",

    border:
        "1px solid #cbd5e1",

    borderRadius: "7px",

    background: "#ffffff",

    color: "#334155",

    cursor: "pointer",

    fontSize: "13px"
};


const submitButtonStyle = {

    padding: "10px 20px",

    border: "none",

    borderRadius: "7px",

    background: "#2563eb",

    color: "#ffffff",

    cursor: "pointer",

    fontSize: "13px",

    fontWeight: "600"
};


export default AddAsset;