import api from "./api";

// Ask AI a question
export const askQuestion = (data) => {
    return api.post("/chat/ask", data);
};

// Get chat history
export const getChatHistory = () => {
    return api.get("/chat/history");
};