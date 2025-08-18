import React from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userType?: string | null;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    userType = "user"
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div
            className="fixed h-screen w-screen inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200/60 p-6 mx-4 max-w-md w-full animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                >
                    <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </button>

                {/* Modal Content */}
                <div className="text-center">
                    {/* Icon */}
                    <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <LogOut className="w-8 h-8 text-red-600" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Confirm Logout
                    </h3>

                    {/* Message */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Are you sure you want to log out of your {userType || 'user'} account? You'll need to sign in again to access your dashboard and saved progress.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-red-200/50"
                        >
                            <div className="flex items-center gap-2">
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                        Your learning progress and account data will be safely stored.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmationModal;