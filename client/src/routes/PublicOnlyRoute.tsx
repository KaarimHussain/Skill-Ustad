import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, userType } = useAuth();

    if (isAuthenticated) {
        return (
            <Navigate
                to={userType?.toLowerCase() === "mentor" ? "/mentor/dashboard" : "/user/dashboard"}
                replace
            />
        );
    }

    return <>{children}</>;
};

export default PublicOnlyRoute;
