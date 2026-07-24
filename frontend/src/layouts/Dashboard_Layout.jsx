import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "../styles/dashboardLayout.css";

function DashboardLayout() {
    return (
        <div className="dashboard-wrapper">

            <Header />

            <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">
                    <Outlet/>
                </main>

            </div>

            <Footer />

        </div>
    );
}

export default DashboardLayout;
