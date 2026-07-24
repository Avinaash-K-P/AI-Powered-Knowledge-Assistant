import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "../styles/header.css";
import { 
    FaRobot,     
    FaUser,
    FaSignOutAlt
} 
from "react-icons/fa";
function Header() {
 
    const navigate = useNavigate();

    const token = localStorage.getItem("access_token");

    let username = "User";

    if (token) {
        try {
            const decoded = jwtDecode(token);
            username = decoded.username || "User";
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        navigate("/");
    };

    return (
        <header className="app-header">

            <div className="header-left">

                <FaRobot className="header-logo" />

                <h2 className="app-title">
                    AI-Powered Knowledge Assistant
                </h2>

            </div>

            <div className="header-right">

                <span className="welcome-text">
                    Welcome, {username}
                </span>

                <div className="dropdown">

                    <button
                        className="btn dropdown-toggle user-dropdown"
                        type="button"
                        data-bs-toggle="dropdown"
                    >
                        <FaUserCircle size={28} />
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end">

                        <li>

                            <button
                                className="dropdown-item"
                                onClick={() => navigate("/profile")}
                            >
                                <FaUser className="me-2" />
                                Profile
                            </button>

                        </li>

                        <li><hr className="dropdown-divider" /></li>

                        <li>

                            <button
                                className="dropdown-item text-danger"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className="me-2" />
                                Logout
                            </button>

                        </li>

                    </ul>

                </div>

            </div>

        </header>
    );
}

export default Header;