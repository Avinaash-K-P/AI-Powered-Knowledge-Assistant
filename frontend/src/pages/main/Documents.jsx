import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    getDocuments,
    getDocumentById,
    uploadDocument,
    deleteDocument,
} from "../../services/documentService";
import {
    FaUpload,
    FaSearch,
    FaEye,
    FaEdit,
    FaTrash,
    FaFileAlt,
} from "react-icons/fa";
import "/src/styles/documents.css";

function Documents() {  

    const [documents, setDocuments] = useState([]); 

    const [selectedFile, setSelectedFile] = useState(null); 

    const [searchTerm, setSearchTerm] = useState("");   

    const [editingDocument, setEditingDocument] = useState(null);   

    const [editedTitle, setEditedTitle] = useState(""); 

    const [selectedDocument, setSelectedDocument] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);

    const fetchDocuments = async () => {    

        try {   

            const response = await getDocuments();  

            setDocuments(response.data);    

        }   

        catch { 

            toast.error("Failed to load documents.");   

        }   

    };
        
    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (e) => {

    setSelectedFile(e.target.files[0]);

    };

    const handleUpload = async () => {

    if (!selectedFile) {

        toast.warning("Please select a file.");

        return;

    }

    try {

        const formData = new FormData();

        formData.append("file", selectedFile);

        await uploadDocument(formData);

        toast.success("Document uploaded successfully.");

        setSelectedFile(null);

        fetchDocuments();

    }

    catch {

        toast.error("Upload failed.");

    }

};

const handleDelete = async (documentId) => {

    try {

        await deleteDocument(documentId);

        toast.success("Document deleted.");

        fetchDocuments();

    }

    catch {

        toast.error("Delete failed.");

    }

};

    const handleView = async (documentId) => {

    try {

        const response = await getDocumentById(documentId);

        setSelectedDocument(response.data);

        setShowViewModal(true);

    } catch (error) {

        toast.error(
            error.response?.data?.detail ||
            "Failed to load document."
        );

    }
    };

    const filteredDocuments = documents.filter((document) =>
    document.original_filename
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const formatFileSize = (bytes) => {

    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(2)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

};

 return  (

        <div className="document-container">

            {/* Header */}

            <div className="document-header">
                <h2 className="document-title">Document Management</h2>
                <p className="document-subtitle">
                    Upload and manage your knowledge base.
                </p>
            </div>

            {/* Upload Card */}

            <div className="card upload-card shadow-sm">

                <div className="card-body">

                    <h5 className="card-title">
                        <FaUpload className="me-2" />
                        Upload Document
                    </h5>

                    <div className="row align-items-center mt-4">

                        <div className="col-md-8 mb-3 mb-md-0">

                            <input
                                type="file"
                                className="form-control"
                                onChange={handleFileChange}
                            />

                        </div>

                        <div className="col-md-4">

                            <button className="btn btn-primary w-100" onClick={handleUpload}>
                                <FaUpload className="me-2" />
                                Upload
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* Search */}

            <div className="search-section">

                <div className="input-group">

                    <span className="input-group-text">
                        <FaSearch />
                    </span>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search documents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                </div>

            </div>

            {/* Document Table */}

            <div className="card table-card shadow-sm">

                <div className="card-body">

                    <h5 className="card-title mb-4">
                        <FaFileAlt className="me-2" />
                        Uploaded Documents
                    </h5>

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead>

                                <tr>
                                    <th>Document Name</th>
                                    <th>Type</th>
                                    <th>Size</th>
                                    <th>Uploaded</th>
                                    <th className="text-center">
                                        Actions
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                        {filteredDocuments.length > 0 ? (
                        
                            filteredDocuments.map((document) => (
                            
                                <tr key={document.id}>
                                
                                    <td>

                                        {editingDocument === document.id ? (
                                        
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedTitle}
                                                onChange={(e) => setEditedTitle(e.target.value)}
                                            />
                                        
                                        ) : (
                                        
                                            document.original_filename
                                        
                                        )}

                                    </td>
                                    
                                    <td>
                            
                                        <span className="badge bg-primary">
                            
                                            {document.file_type.toUpperCase()}
                            
                                        </span>
                            
                                    </td>
                            
                                    <td>{formatFileSize(document.file_size)}</td>
                            
                                    <td>
                            
                                        {new Date(document.uploaded_at).toLocaleDateString()}
                            
                                    </td>

                                    <td className="text-center">                                    

                                                <button
                                                    className="btn btn-outline-primary btn-sm me-2"
                                                    onClick={() => handleView(document.id)}
                                                >
                                                    <FaEye />
                                                </button>                                                    

                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(document.id)}
                                                >
                                                    <FaTrash />
                                                </button>                                   
                                    </td>

                                </tr>
                        
                            ))
                        
                        ) : (
                        
                            <tr>
                            
                                <td
                                    colSpan="5"
                                    className="text-center text-muted py-4"
                                >
                                    No documents uploaded.
                                </td>
                        
                            </tr>
                        
                        )}
                        
                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

                    {/* File Viewer */}
                    {showViewModal && selectedDocument && (
                    
                    <div
                        className="modal fade show"
                        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                    
                        <div className="modal-dialog modal-lg">
                    
                            <div className="modal-content">
                    
                                <div className="modal-header">
                    
                                    <h5 className="modal-title">
                                        Document Details
                                    </h5>
                    
                                    <button
                                        className="btn-close"
                                        onClick={() => setShowViewModal(false)}
                                    />

                                </div>
                    
                    <div className="modal-body">
        
                        <table className="table table-bordered">
        
                            <tbody>
        
                                <tr>
                                    <th>Filename</th>
                                    <td>{selectedDocument.original_filename}</td>
                                </tr>
        
                                <tr>
                                    <th>Type</th>
                                    <td>{selectedDocument.file_type}</td>
                                </tr>
        
                                <tr>
                                    <th>Size</th>
                                    <td>
                                        {formatFileSize(selectedDocument.file_size)}
                                    </td>
                                </tr>
        
                                <tr>
                                    <th>Uploaded</th>
                                    <td>
                                        {new Date(
                                            selectedDocument.uploaded_at
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                                    
                            </tbody>
                                    
                        </table>
                                    
                    </div>
                                    
                    <div className="modal-footer">
                                    
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowViewModal(false)}
                        >
                            Close
                        </button>
                                    
                    </div>
                                    
                </div>
                                    
            </div>
                                    
        </div>
        
        )}
        
        
        </div>

    );  

}


export default Documents;