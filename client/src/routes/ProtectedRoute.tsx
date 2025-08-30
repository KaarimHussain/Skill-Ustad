import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
    allowedRoles?: string[]; // ["student", "mentor", "companies","admin"]
    redirectTo?: string;
}

const ProtectedRoute = ({
    allowedRoles,
    redirectTo = "/login",
}: ProtectedRouteProps) => {
    const { isAuthenticated, userType } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userType || "")) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
