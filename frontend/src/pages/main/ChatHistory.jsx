import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getChatHistory } from "../../services/aiService";
import "/src/styles/chathistory.css";

function ChatHistory() {

    const [chatHistory, setChatHistory] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedChat, setSelectedChat] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);

    const fetchChatHistory = async () => {

    try {

        const response = await getChatHistory();

        setChatHistory(response.data.items);

    } catch (error) {

        toast.error(
            error.response?.data?.detail ||
            "Failed to load chat history."
        );

    }

};

useEffect(() => {

    fetchChatHistory();

}, []);

const filteredHistory = chatHistory.filter((chat) =>
    chat.question
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
);



const handleView = (chat) => {

    setSelectedChat(chat);

    setShowViewModal(true);

    console.log(selectedChat);

};

const handleClose = () => {

    setSelectedChat(null);    

    setShowViewModal(false);

    
};

return(

    <div className="mb-4">

        <h2 className="fw-bold">
            Chat History
        </h2>

        <p className="text-muted">
            Review your previous AI conversations.
        </p>

        <div className="card shadow-sm mb-4">

        <div className="card-body">

            <input
            type="text"
            className="form-control"
            placeholder="Search previous questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />

        </div>

    </div>

    <div className="card shadow-sm">

        <div className="card-header">

            <h5 className="mb-0">
                Previous Conversations
            </h5>

        </div>

        <div className="card-body p-0">

            <div className="table-responsive">

                <table className="table table-hover align-middle mb-0">

                    <thead className="table-light">

                        <tr>
                            <th>Question No.</th>

                            <th>Question</th>

                            <th>Asked On</th>

                             <th className="text-center">
                                Answers
                            </th> 

                        </tr>

                    </thead>

                    <tbody>
                    
                        {filteredHistory.length > 0 ? (
                        
                            filteredHistory.map((chat, index) => (
                            
                                <tr key={chat.id}>

                                    <td>{index + 1}</td>                                    
                                
                                    <td className="question-cell">{chat.question}</td>
                            
                                    <td>
                                        {new Date(chat.created_at).toLocaleString()}
                                    </td>
                 
                                    <td className="text-center">
                            
                                        <button
                                            className="btn btn-outline-primary btn-md"
                                            onClick={() => handleView(chat)}
                                        >
                                            <i className="fas fa-eye me-1"></i>
                                            View
                                        </button>
                                                                    
                                    </td> 
                            
                                </tr>
                    
                            ))
                        
                        ) : (
                        
                            <tr>
                            
                                <td
                                    colSpan="4"
                                    className="text-center text-muted py-5"
                                >
                                
                                    No chat history found.
                        
                                </td>
                        
                            </tr>
                    
                        )}
                    
                    </tbody>

                    {selectedChat && showViewModal && (

    <>
    
        <div
            className="modal fade show d-block"
            tabIndex="-1"
        >
        
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
            
                <div className="modal-content">
                
                    <div className="modal-header">
                    
                        <h5 className="modal-title">
                            AI Conversation
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                        ></button>

                    </div>

                    <div className="modal-body">

                        {/* Question */}

                        <div className="mb-3">

                            <label className="form-label fw-bold">
                                Question
                            </label>

                            <div className="form-control bg-light">
                                {selectedChat.question}
                            </div>

                        </div>

                        {/* Answer */}

                        <div className="mb-3">

                            <label className="form-label fw-bold">
                                Answer
                            </label>

                            <div
                                className="form-control bg-light"
                                style={{
                                    minHeight: "220px",
                                    maxHeight: "350px",
                                    overflowY: "auto",
                                    whiteSpace: "pre-wrap"
                                }}
                            >
                                {selectedChat.answer}
                            </div>

                        </div>

                        {/* Asked On */}

                        <div className="mb-3">

                            <label className="form-label fw-bold">
                                Asked On
                            </label>

                            <div className="form-control bg-light">
                                {new Date(selectedChat.created_at).toLocaleString()}
                            </div>

                        </div>

                    </div>

                    <div className="modal-footer">

                        <button
                            className="btn btn-secondary"
                            onClick={handleClose}
                        >
                            Close
                        </button>

                    </div>

                </div>

            </div>

        </div>

        <div className="modal-backdrop fade show"></div>

    </>

)}
                    
                </table>

            </div>

        </div>

    </div>

    </div>


)

}

export default ChatHistory;