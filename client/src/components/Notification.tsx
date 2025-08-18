import { toast } from "sonner"

export default class NotificationService {
    static success(message: string, description?: string) {
        toast.success(message, {
            description,
            style: {
                background: "#f0fdf4",
                color: "#15803d",
                border: "1px solid #bbf7d0",
                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
            },
        })
    }

    static error(message: string, description?: string) {
        toast.error(message, {
            description,
            style: {
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca",
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
            },
        })
    }

    static warning(message: string, description?: string) {
        toast.warning(message, {
            description,
            style: {
                background: "#fffbeb",
                color: "#d97706",
                border: "1px solid #fed7aa",
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
            },
        })
    }

    static info(message: string, description?: string) {
        toast.info(message, {
            description,
            style: {
                background: "#eff6ff",
                color: "#2563eb",
                border: "1px solid #bfdbfe",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
            },
        })
    }

    static loading(message: string, description?: string) {
        return toast.loading(message, {
            description,
            style: {
                background: "#f9fafb",
                color: "#374151",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 12px rgba(107, 114, 128, 0.1)",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
            },
        })
    }

    static promise<T>(
        promise: Promise<T>,
        messages: {
            loading: string
            success: string | ((data: T) => string)
            error: string | ((error: any) => string)
        },
    ) {
        return toast.promise(promise, messages)
    }

    static custom(message: string, options?: any) {
        toast(message, options)
    }

    static dismiss(toastId?: string | number) {
        toast.dismiss(toastId)
    }
}
