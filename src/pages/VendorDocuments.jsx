import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function VendorDocuments() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [documents, setDocuments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);

    const [documentType, setDocumentType] = useState("");
    const [documentName, setDocumentName] = useState("");


    // =====================================================
    // LOAD VENDOR DOCUMENTS
    // =====================================================

    const loadDocuments = async () => {

        try {

            setLoading(true);

            const response =
                await API.get(
                    `/vendor-documents/vendor/${id}`
                );

            console.log(
                "Vendor Documents Response:",
                response.data
            );

            setDocuments(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Load Vendor Documents Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load vendor documents"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD ON PAGE OPEN
    // =====================================================

    useEffect(() => {

        if (id) {

            loadDocuments();

        }

    }, [id]);


    // =====================================================
    // FILE SELECT
    // =====================================================

    const handleFileChange = (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {

            setSelectedFile(null);

            return;

        }


        // -------------------------------------------------
        // Allowed MIME types
        // -------------------------------------------------

        const allowedTypes = [

            "application/pdf",

            "image/jpeg",

            "image/png"

        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            alert(
                "Only PDF, JPG, JPEG and PNG files are allowed"
            );

            event.target.value = "";

            setSelectedFile(null);

            return;

        }


        // -------------------------------------------------
        // Maximum 10 MB
        // -------------------------------------------------

        const maxSize =
            10 * 1024 * 1024;


        if (file.size > maxSize) {

            alert(
                "File size must be 10 MB or less"
            );

            event.target.value = "";

            setSelectedFile(null);

            return;

        }


        setSelectedFile(file);


        // If document name empty,
        // use original filename

        if (!documentName) {

            setDocumentName(
                file.name
            );

        }

    };


    // =====================================================
    // UPLOAD DOCUMENT
    // =====================================================

    const handleUpload = async (event) => {

        event.preventDefault();


        if (!selectedFile) {

            alert(
                "Please select a PDF or image file"
            );

            return;

        }


        try {

            setUploading(true);


            const formData =
                new FormData();


            formData.append(
                "document",
                selectedFile
            );


            // Optional fields

            if (documentType.trim()) {

                formData.append(
                    "document_type",
                    documentType.trim()
                );

            }


            if (documentName.trim()) {

                formData.append(
                    "document_name",
                    documentName.trim()
                );

            }


            const response =
                await API.post(
                    `/vendor-documents/vendor/${id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );


            console.log(
                "Upload Response:",
                response.data
            );


            alert(
                "Vendor document uploaded successfully"
            );


            // Reset form

            setSelectedFile(null);

            setDocumentType("");

            setDocumentName("");


            const fileInput =
                document.getElementById(
                    "vendor-document-file"
                );

            if (fileInput) {

                fileInput.value = "";

            }


            // Reload documents

            loadDocuments();


        } catch (error) {

            console.error(
                "Upload Vendor Document Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to upload vendor document"
            );

        } finally {

            setUploading(false);

        }

    };


    // =====================================================
    // DELETE DOCUMENT
    // =====================================================

    const handleDelete = async (document) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${document.document_name}"?`
            );


        if (!confirmed) {

            return;

        }


        try {

            await API.delete(
                `/vendor-documents/${document.document_id}`
            );


            alert(
                "Vendor document deleted successfully"
            );


            loadDocuments();


        } catch (error) {

            console.error(
                "Delete Vendor Document Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to delete vendor document"
            );

        }

    };


    // =====================================================
    // VIEW / DOWNLOAD DOCUMENT
    // =====================================================

    const handleViewDocument = async (document) => {

        try {

            const response =
                await API.get(
                    `/vendor-documents/${document.document_id}/download`,
                    {
                        responseType: "blob"
                    }
                );


            const blob =
                new Blob(
                    [response.data],
                    {
                        type:
                            document.mime_type ||
                            response.headers[
                                "content-type"
                            ]
                    }
                );


            const url =
                window.URL.createObjectURL(
                    blob
                );


            window.open(
                url,
                "_blank"
            );


            // Release URL later

            setTimeout(() => {

                window.URL.revokeObjectURL(
                    url
                );

            }, 10000);


        } catch (error) {

            console.error(
                "View Document Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to open document"
            );

        }

    };


    // =====================================================
    // FORMAT FILE SIZE
    // =====================================================

    const formatFileSize = (bytes) => {

        if (!bytes) {

            return "0 KB";

        }


        if (bytes < 1024) {

            return `${bytes} Bytes`;

        }


        if (bytes < 1024 * 1024) {

            return `${(
                bytes / 1024
            ).toFixed(1)} KB`;

        }


        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(2)} MB`;

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        return new Date(
            date
        ).toLocaleString();

    };


    // =====================================================
    // GET FILE ICON
    // =====================================================

    const getFileIcon = (mimeType) => {

        if (
            mimeType ===
            "application/pdf"
        ) {

            return "📄";

        }


        if (
            mimeType?.startsWith(
                "image/"
            )
        ) {

            return "🖼️";

        }


        return "📎";

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f5f5f5"
            }}
        >

            <Sidebar />


            <div
                style={{
                    flex: 1
                }}
            >

                <Navbar />


                <div
                    style={{
                        padding: "25px"
                    }}
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            marginBottom: "20px"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    margin: 0,
                                    color: "#0f172a"
                                }}
                            >
                                Vendor Documents
                            </h1>

                            <p
                                style={{
                                    marginTop: "6px",
                                    color: "#64748b"
                                }}
                            >
                                Upload and manage documents
                                for this vendor
                            </p>

                        </div>


                        <button
                            onClick={() =>
                                navigate(
                                    `/vendors/${id}`
                                )
                            }
                            style={{
                                padding:
                                    "9px 15px",
                                border:
                                    "1px solid #cbd5e1",
                                background:
                                    "#ffffff",
                                borderRadius:
                                    "6px",
                                cursor:
                                    "pointer"
                            }}
                        >
                            ← Back to Vendor
                        </button>

                    </div>


                    {/* =================================================
                        UPLOAD SECTION
                    ================================================= */}

                    <div
                        style={{
                            background:
                                "#ffffff",
                            borderRadius:
                                "10px",
                            padding:
                                "20px",
                            marginBottom:
                                "20px",
                            boxShadow:
                                "0 1px 3px rgba(0,0,0,0.08)"
                        }}
                    >

                        <h2
                            style={{
                                marginTop: 0,
                                marginBottom:
                                    "5px",
                                fontSize:
                                    "18px",
                                color:
                                    "#0f172a"
                            }}
                        >
                            Upload Vendor Document
                        </h2>

                        <p
                            style={{
                                color:
                                    "#64748b",
                                fontSize:
                                    "13px",
                                marginTop:
                                    "5px"
                            }}
                        >
                            Supported formats:
                            PDF, JPG, JPEG, PNG.
                            Maximum file size: 10 MB.
                        </p>


                        <form
                            onSubmit={
                                handleUpload
                            }
                        >

                            {/* =====================================
                                DOCUMENT TYPE
                            ===================================== */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px"
                                }}
                            >

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Document Type
                                    <span
                                        style={{
                                            color:
                                                "#94a3b8",
                                            fontWeight:
                                                "normal"
                                        }}
                                    >
                                        {" "}
                                        (Optional)
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={
                                        documentType
                                    }
                                    onChange={
                                        (e) =>
                                            setDocumentType(
                                                e.target.value
                                            )
                                    }
                                    placeholder="Example: GST, PAN, MSME, Agreement, Certificate"
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            {/* =====================================
                                DOCUMENT NAME
                            ===================================== */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px"
                                }}
                            >

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Document Name
                                    <span
                                        style={{
                                            color:
                                                "#94a3b8",
                                            fontWeight:
                                                "normal"
                                        }}
                                    >
                                        {" "}
                                        (Optional)
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={
                                        documentName
                                    }
                                    onChange={
                                        (e) =>
                                            setDocumentName(
                                                e.target.value
                                            )
                                    }
                                    placeholder="Enter document name"
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>


                            {/* =====================================
                                FILE
                            ===================================== */}

                            <div
                                style={{
                                    marginBottom:
                                        "18px"
                                }}
                            >

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Select File
                                </label>

                                <input
                                    id="vendor-document-file"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                                    onChange={
                                        handleFileChange
                                    }
                                    style={{
                                        display:
                                            "block",
                                        width:
                                            "100%",
                                        padding:
                                            "10px",
                                        border:
                                            "1px solid #cbd5e1",
                                        borderRadius:
                                            "6px",
                                        background:
                                            "#ffffff",
                                        boxSizing:
                                            "border-box"
                                    }}
                                />

                                {selectedFile && (

                                    <div
                                        style={{
                                            marginTop:
                                                "8px",
                                            fontSize:
                                                "13px",
                                            color:
                                                "#475569"
                                        }}
                                    >

                                        Selected:
                                        {" "}
                                        <strong>
                                            {
                                                selectedFile.name
                                            }
                                        </strong>

                                        {" "}
                                        (
                                        {
                                            formatFileSize(
                                                selectedFile.size
                                            )
                                        }
                                        )

                                    </div>

                                )}

                            </div>


                            {/* =====================================
                                UPLOAD BUTTON
                            ===================================== */}

                            <button
                                type="submit"
                                disabled={
                                    uploading
                                }
                                style={{
                                    padding:
                                        "10px 18px",
                                    border:
                                        "none",
                                    background:
                                        uploading
                                            ? "#94a3b8"
                                            : "#2563eb",
                                    color:
                                        "#ffffff",
                                    borderRadius:
                                        "6px",
                                    cursor:
                                        uploading
                                            ? "not-allowed"
                                            : "pointer",
                                    fontWeight:
                                        "500"
                                }}
                            >
                                {uploading
                                    ? "Uploading..."
                                    : "Upload Document"}
                            </button>

                        </form>

                    </div>


                    {/* =================================================
                        DOCUMENT LIST
                    ================================================= */}

                    <div
                        style={{
                            background:
                                "#ffffff",
                            borderRadius:
                                "10px",
                            overflow:
                                "hidden",
                            boxShadow:
                                "0 1px 3px rgba(0,0,0,0.08)"
                        }}
                    >

                        <div
                            style={{
                                padding:
                                    "18px 20px",
                                borderBottom:
                                    "1px solid #e2e8f0",
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center"
                            }}
                        >

                            <div>

                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize:
                                            "18px",
                                        color:
                                            "#0f172a"
                                    }}
                                >
                                    Uploaded Documents
                                </h2>

                                <p
                                    style={{
                                        margin:
                                            "5px 0 0",
                                        color:
                                            "#64748b",
                                        fontSize:
                                            "13px"
                                    }}
                                >
                                    {documents.length}
                                    {" "}
                                    document(s)
                                </p>

                            </div>


                            <button
                                onClick={
                                    loadDocuments
                                }
                                style={{
                                    padding:
                                        "7px 12px",
                                    border:
                                        "1px solid #cbd5e1",
                                    background:
                                        "#ffffff",
                                    borderRadius:
                                        "5px",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                Refresh
                            </button>

                        </div>


                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {loading ? (

                            <div
                                style={
                                    emptyStyle
                                }
                            >
                                Loading documents...
                            </div>

                        ) : documents.length === 0 ? (

                            <div
                                style={
                                    emptyStyle
                                }
                            >

                                <div
                                    style={{
                                        fontSize:
                                            "40px",
                                        marginBottom:
                                            "10px"
                                    }}
                                >
                                    📁
                                </div>

                                <div
                                    style={{
                                        fontWeight:
                                            "600",
                                        color:
                                            "#334155",
                                        marginBottom:
                                            "5px"
                                    }}
                                >
                                    No documents uploaded
                                </div>

                                <div
                                    style={{
                                        color:
                                            "#64748b",
                                        fontSize:
                                            "13px"
                                    }}
                                >
                                    Upload GST, PAN,
                                    MSME, agreement,
                                    certificates or
                                    any other vendor
                                    document.
                                </div>

                            </div>

                        ) : (

                            <div
                                style={{
                                    overflowX:
                                        "auto"
                                }}
                            >

                                <table
                                    style={{
                                        width:
                                            "100%",
                                        borderCollapse:
                                            "collapse"
                                    }}
                                >

                                    <thead>

                                        <tr
                                            style={{
                                                background:
                                                    "#f8fafc"
                                            }}
                                        >

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                #
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Document
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Type
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                File Name
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Size
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Uploaded At
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {documents.map(
                                            (
                                                document,
                                                index
                                            ) => (

                                                <tr
                                                    key={
                                                        document.document_id
                                                    }
                                                >

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            index +
                                                            1
                                                        }
                                                    </td>


                                                    {/* Document name */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap:
                                                                    "8px"
                                                            }}
                                                        >

                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "20px"
                                                                }}
                                                            >
                                                                {
                                                                    getFileIcon(
                                                                        document.mime_type
                                                                    )
                                                                }
                                                            </span>

                                                            <span
                                                                style={{
                                                                    fontWeight:
                                                                        "500",
                                                                    color:
                                                                        "#0f172a"
                                                                }}
                                                            >
                                                                {
                                                                    document.document_name ||
                                                                    "-"
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* Type */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <span
                                                            style={{
                                                                display:
                                                                    "inline-block",
                                                                padding:
                                                                    "4px 9px",
                                                                background:
                                                                    "#eff6ff",
                                                                color:
                                                                    "#1d4ed8",
                                                                borderRadius:
                                                                    "12px",
                                                                fontSize:
                                                                    "12px"
                                                            }}
                                                        >
                                                            {
                                                                document.document_type ||
                                                                "General"
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* Original filename */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            document.original_file_name ||
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* Size */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            formatFileSize(
                                                                document.file_size
                                                            )
                                                        }
                                                    </td>


                                                    {/* Uploaded date */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {
                                                            formatDate(
                                                                document.uploaded_at
                                                            )
                                                        }
                                                    </td>


                                                    {/* Actions */}

                                                    <td
                                                        style={{
                                                            ...tdStyle,
                                                            whiteSpace:
                                                                "nowrap"
                                                        }}
                                                    >

                                                        <button
                                                            onClick={() =>
                                                                handleViewDocument(
                                                                    document
                                                                )
                                                            }
                                                            style={{
                                                                marginRight:
                                                                    "6px",
                                                                padding:
                                                                    "6px 10px",
                                                                border:
                                                                    "1px solid #cbd5e1",
                                                                background:
                                                                    "#ffffff",
                                                                color:
                                                                    "#2563eb",
                                                                borderRadius:
                                                                    "5px",
                                                                cursor:
                                                                    "pointer"
                                                            }}
                                                        >
                                                            View
                                                        </button>


                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    document
                                                                )
                                                            }
                                                            style={{
                                                                padding:
                                                                    "6px 10px",
                                                                border:
                                                                    "none",
                                                                background:
                                                                    "#dc2626",
                                                                color:
                                                                    "#ffffff",
                                                                borderRadius:
                                                                    "5px",
                                                                cursor:
                                                                    "pointer"
                                                            }}
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}


// =====================================================
// STYLES
// =====================================================

const labelStyle = {

    display: "block",

    marginBottom: "6px",

    fontSize: "13px",

    fontWeight: "600",

    color: "#334155"

};


const inputStyle = {

    width: "100%",

    padding: "10px 12px",

    border: "1px solid #cbd5e1",

    borderRadius: "6px",

    outline: "none",

    boxSizing: "border-box",

    fontSize: "14px"

};


const thStyle = {

    padding: "11px 10px",

    textAlign: "left",

    fontSize: "12px",

    color: "#334155",

    borderBottom:
        "1px solid #e2e8f0"

};


const tdStyle = {

    padding: "11px 10px",

    fontSize: "13px",

    color: "#475569",

    borderBottom:
        "1px solid #f1f5f9"

};


const emptyStyle = {

    padding: "45px 20px",

    textAlign: "center",

    color: "#64748b"

};


export default VendorDocuments;