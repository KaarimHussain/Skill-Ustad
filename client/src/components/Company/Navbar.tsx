import { Link, useNavigate } from "react-router-dom";
import { memo, useCallback, useState } from "react";
import Logo from "../Logo";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";
import AuthService from "@/services/auth.service";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LogOut, TriangleAlert } from "lucide-react";

const CompanyNavbar = memo(() => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { refreshAuth } = useAuth()
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const Logout = useCallback(() => {
        AuthService.logout();
        refreshAuth();
        navigate("/login")
    }, [navigate, refreshAuth])
    return (
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Logo />
                        <div className="h-6 bg-zinc-400 w-0.5 mx-3"></div>
                        <span className="text-2xl lg:text-3xl font-light">COMPANY</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/company/dashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Dashboard
                        </Link>
                        <Link to="/company/jobs" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Jobs
                        </Link>
                        <Link to="/company/applications" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Applications
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <LogOut className="w-5 h-5" /> Logout
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex gap-3 items-center">
                                        <div className="aspect-square bg-red-100 rounded-full p-3">
                                            <TriangleAlert className="text-red-500" size={25} />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold">Are you sure?</h1>
                                        </div>
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to sign out of your account? You'll need to sign in again to access your
                                        dashboard.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                                        onClick={Logout}
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                            <Link
                                to="/company/dashboard"
                                className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/company/jobs"
                                className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Jobs
                            </Link>
                            <Link
                                to="/company/applications"
                                className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Applications
                            </Link>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                        <LogOut className="w-5 h-5" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="flex gap-3 items-center">
                                            <div className="aspect-square bg-red-100 rounded-full p-3">
                                                <TriangleAlert className="text-red-500" size={25} />
                                            </div>
                                            <div>
                                                <h1 className="text-3xl font-bold">Are you sure?</h1>
                                            </div>
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to sign out of your account? You'll need to sign in again to access your
                                            dashboard.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                                            onClick={Logout}
                                        >
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
});

CompanyNavbar.displayName = 'CompanyNavbar';

export default CompanyNavbar;
