import React from 'react';

interface QuizStatusBadgeProps {
    status: "Active" | "Draft" | "Archived" | "Private";
    className?: string;
}

const QuizStatusBadge: React.FC<QuizStatusBadgeProps> = ({ status, className = "" }) => {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Active":
                return {
                    dotColor: "bg-green-500",
                    textColor: "text-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200"
                };
            case "Draft":
                return {
                    dotColor: "bg-yellow-500",
                    textColor: "text-yellow-600",
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200"
                };
            case "Archived":
                return {
                    dotColor: "bg-gray-500",
                    textColor: "text-gray-600",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200"
                };
            case "Private":
                return {
                    dotColor: "bg-blue-500",
                    textColor: "text-blue-600",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200"
                };
            default:
                return {
                    dotColor: "bg-gray-400",
                    textColor: "text-gray-500",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200"
                };
        }
    };

    const styles = getStatusStyles(status);

    return (
        <div className={`flex items-center space-x-2 px-2 py-1 rounded-full border ${styles.bgColor} ${styles.borderColor} ${className}`}>
            <div className={`w-2 h-2 ${styles.dotColor} rounded-full`}></div>
            <span className={`text-xs font-medium ${styles.textColor}`}>
                {status}
            </span>
        </div>
    );
};

export default QuizStatusBadge;