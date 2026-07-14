import { getAccessToken } from "../utils/authStorage";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
    
    children:ReactNode;
};

function ProtectedRoute({children}: ProtectedRouteProps) {

    const accessToken = getAccessToken();

    if(!accessToken){

        return <Navigate to="/" replace />;
    
    }

    return <>{children}</>;
}

export default ProtectedRoute;