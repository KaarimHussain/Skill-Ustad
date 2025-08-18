import { createContext, useContext, useState, useEffect } from "react";
import AuthService from "@/services/auth.service";

export const AuthContext = createContext({
    isAuthenticated: false,
    userType: null as string | null,
    refreshAuth: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState<string | null>(null);

    const refreshAuth = () => {
        const token = AuthService.getToken();
        const user = AuthService.getUser();
        if (token && user && !AuthService.isTokenExpired(token)) {
            setIsAuthenticated(true);
            setUserType(user.userType);
        } else {
            setIsAuthenticated(false);
            setUserType(null);
        }
    };

    useEffect(() => {
        refreshAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userType, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
