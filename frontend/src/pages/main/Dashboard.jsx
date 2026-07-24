import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAnalytics } from "../../services/dashboardService";
import {
    FaFileAlt,
    FaComments,
    FaHistory,
    FaUsers,
    FaUpload,
    FaRobot,
    FaCheckCircle,
} from "react-icons/fa";
import "/src/styles/dashboard.css";

function Dashboard() {

    const [analytics, setAnalytics] = useState({
        total_documents: 0,
        total_questions: 0,
        recent_conversation: 0,
        active_users: 0,
    });

    const fetchDashboardAnalytics = async () => {
        try {
            const response = await getAnalytics();
            setAnalytics(response.data);

        } catch (error) {
            console.error("Error fetching dashboard analytics:", error);
        }
    };

    useEffect(() => {
        fetchDashboardAnalytics();
    }, []);

    return (

    <div className="dashboard-container">

        <div className="container-fluid py-4">

            {/* Dashboard Header */}

            <h2 className="dashboard-title">Dashboard</h2>

            <p className="dashboard-subtitle">
                Welcome to your AI-Powered Knowledge Assistant dashboard.
            </p>

            {/* KPI Cards */}

            <div className="card kpi-card">

                <div className="row g-4">

                    <div className="col-lg-3 col-md-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body text-center">
                                <FaFileAlt className="kpi-icon text-primary" />
                                <h6 className="kpi-title">Total Documents</h6>
                                <h3 className="kpi-value">{analytics.total_documents}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body text-center">
                                <FaComments className="kpi-icon text-success" />
                                <h6 className="kpi-title">Total Questions</h6>
                                <h3 className="kpi-value">{analytics.total_questions}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body text-center">
                                <FaHistory className="kpi-icon text-secondary" />
                                <h6 className="kpi-title">Recent Conversations</h6>
                                <h3 className="kpi-value">{analytics.recent_conversation.length}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body text-center">
                                <FaUsers className="kpi-icon text-warning" />
                                <h6 className="kpi-title">Active Users</h6>
                                <h3 className="kpi-value">{analytics.active_users.length}</h3>
                            </div>
                        </div>
                    </div>

                </div>

            </div>    

            {/* Quick Actions */}

            <div className="mt-5">
                <h4 className="fw-bold mb-3">Quick Actions</h4>

                <div className="row g-4">

                    <div className="col-md-6">
                        <Link
                            to="/documents"
                            className="text-decoration-none"
                        >
                            <div className="card action-card h-100">
                                <div className="card-body text-center">
                                    <FaUpload className="action-icon text-primary"
                                    />
                                    <h5 className = "action-title">Upload Document</h5>
                                   <p className="action-description">
                                   Upload a new document to your knowledge base.
                                   </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-6">
                        <Link
                            to="/chat/ask"
                            className="text-decoration-none"
                        >
                            <div className="card action-card h-100">
                                <div className="card-body text-center">
                                    <FaRobot className="action-icon text-primary"/>
                                    <h5 className ="action-title">Start AI Chat</h5>
                                    <p className="action-description">
                                        Ask questions about your uploaded documents.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                </div>
            </div>

            {/* Feature Overview */}

            <div className="mt-5">
                <h4 className="fw-bold mb-3">Feature Overview</h4>

                <div className="card feature-card">
                    <div className="card-body">

                        <div className="feature-item">
                            <FaCheckCircle className="feature-icon" />
                            Document Upload & Management
                        </div>

                        <div className="feature-item">
                            <FaCheckCircle className="feature-icon" />
                            AI-Powered Question Answering
                        </div>

                        <div className="feature-item">
                            <FaCheckCircle className="feature-icon" />
                            Conversation History Tracking
                        </div>

                        <div className="feature-item">
                            <FaCheckCircle className="feature-icon" />
                            User Profile & Account Management
                        </div>

                    </div>
                </div>
            </div>

        </div>

    </div>      

    );
}

export default Dashboard;