import api from "./api";

/* Get All Documents */

export const getDocuments = () => {
    return api.get("/documents");
};

/* Upload Document */

export const uploadDocument = (formData) => {
    return api.post("/documents/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

/* Get Single Document */

export const getDocumentById = (documentId) => {
    return api.get(`/documents/${documentId}`);
};

/* Delete Document */

export const deleteDocument = (documentId) => {
    return api.delete(`/documents/${documentId}`);
};