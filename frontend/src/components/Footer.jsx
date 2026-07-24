import "../styles/footer.css";

function Footer() {
    return (
        <footer className="app-footer">
            <p>
                © {new Date().getFullYear()} AI-Powered Knowledge Assistant. All rights reserved.
            </p>
        </footer>
    );
}

export default Footer;