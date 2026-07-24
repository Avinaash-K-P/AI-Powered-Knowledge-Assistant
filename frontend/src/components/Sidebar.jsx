import { NavLink } from "react-router-dom";

import {
    MdDashboard,
} from "react-icons/md";

import {
    FaFolderOpen,
    FaHistory,
    FaUserCircle,
} from "react-icons/fa";

import {
    BsChatDotsFill,
} from "react-icons/bs";

import "../styles/navigation.css";

function Sidebar() {
    return (
        <aside className="navigation">

            <NavLink
                to="/dashboard"
                className="nav-item"
            >
                <MdDashboard />
                <span>Dashboard</span>
            </NavLink>

            <NavLink
                to="/documents"
                className="nav-item"
            >
                <FaFolderOpen />
                <span>Documents</span>
            </NavLink>

            <NavLink
                to="/chat/ask"
                className="nav-item"
            >
                <BsChatDotsFill />
                <span>AI Chat</span>
            </NavLink>

            <NavLink
                to="/chat/history"
                className="nav-item"
            >
                <FaHistory />
                <span>History</span>
            </NavLink>

            <NavLink
                to="/profile"
                className="nav-item"
            >
                <FaUserCircle />
                <span>Profile</span>
            </NavLink>

        </aside>
    );
}

export default Sidebar;