import { Link } from "react-router-dom";
import "../App.css";
import { getAccessToken } from "../utils/authStorage";

function NotFoundPage() {

    const accessToken = getAccessToken();

    const redirectPath = accessToken ? "/dashboard" : "/";
    const redirectText = accessToken ? "Go back to dashboard" : "Go back to login";

    return(
        <div className="app-container">
            <div className="login-card">
                <h1>404</h1>
                <p>Page not found.</p>
                
                <Link to={redirectPath}>{redirectText}</Link>
            </div>
        </div>
    );
}

export default NotFoundPage;