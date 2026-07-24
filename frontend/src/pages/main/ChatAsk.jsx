import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { askQuestion, getChatHistory } from "../../services/aiService";
import "/src/styles/chatask.css";

function ChatAsk(){

const [question, setQuestion] = useState("");

const [chatHistory, setChatHistory] = useState([]);

const [loading, setLoading] = useState(false);

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

const handleAskQuestion = async () => {

    if (!question.trim()) {

        toast.warning("Please enter a question.");

        return;

    }

    try {

        setLoading(true);

        const response = await askQuestion({
            question,
        });

        setChatHistory((previous) => [

            ...previous,

            {
                question: question,
                answer: response.data.answer,
                sources: response.data.sources,
            }

        ]);

        setQuestion("");

    } catch (error) {

        toast.error(
            error.response?.data?.detail ||
            "Failed to get AI response."
        );

    } finally {

        setLoading(false);

    }

};


return (

    <div className="chat-page container-fluid py-4">

        <div className="row">

            {/* Chat Section */}
            <div className="col-lg-12">

                <div className="card shadow-sm">

                    {/* Header */}
                    <div className="card-header">

                        <h4 className="mb-1">
                            AI Knowledge Assistant
                        </h4>

                        <small className="text-muted">
                            Ask questions about your uploaded documents.
                        </small>

                    </div>

                    {/* Messages */}
                    <div
                        className="card-body chat-body"
                        style={{ height: "500px", overflowY: "auto" }}
                    >

<div
    className="card-body chat-body"
    style={{ height: "500px", overflowY: "auto" }}
>

    {chatHistory.length === 0 ? (

        <div className="text-center text-muted mt-5">

            <h5>No conversations yet</h5>

            <p>
                Ask your first question about the uploaded documents.
            </p>

        </div>

    ) : (

        chatHistory.map((chat, index) => (

            <div key={chat.id || index}>

                {/* User */}

                <div className="message user">

                    <div className="message-content">

                        <strong>You</strong>

                        <p className="mb-0 mt-2">

                            {chat.question}

                        </p>

                    </div>

                </div>

                        {/* AI */}
                
                        <div className="message-content">
                
                            <div className="message-content">
                
                                <strong>AI</strong>
                
                                <p className="mb-0 mt-2">
                
                                    {chat.answer}
                
                                </p>
                
                            </div>
                
                        </div>
                
                    </div>
        
                ))
            
            )}
        
        </div>
        
                    </div>

                    {/* Input */}
                    <div className="card-footer chat-footer">

                        <div className="input-group chat-input">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type your question..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => {
                                
                                    if (e.key === "Enter") {
                                    
                                        handleAskQuestion();
                                    
                                    }
                                
                                }}
                            />

                                <button
                                    className="btn btn-primary send-btn"
                                    onClick={handleAskQuestion}
                                    disabled={loading}
                                >

                                    {loading ? "Thinking..." : "Send"}

                                </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>
);

}

export default ChatAsk;