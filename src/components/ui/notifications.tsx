"use client";

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useNotificationStore } from "@/store/notification-store";

const notificationIcons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
};

const notificationStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
};

export function NotificationProvider() {
    // Optimizar selectores para evitar bucles infinitos
    const notifications = useNotificationStore((state) => state.notifications)
    const removeNotification = useNotificationStore((state) => state.removeNotification)

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                const styles = notificationStyles[notification.type];

                return (
                    <div
                        key={notification.id}
                        className={`p-4 rounded-lg border shadow-lg transition-all duration-300 ${styles}`}
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-sm font-medium">{notification.title}</h3>
                                <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                                {notification.action && (
                                    <button
                                        onClick={notification.action.onClick}
                                        className="text-sm font-medium underline mt-2 hover:no-underline"
                                    >
                                        {notification.action.label}
                                    </button>
                                )}
                            </div>
                            <div className="ml-4 flex-shrink-0">
                                <button
                                    onClick={() => removeNotification(notification.id)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Hook personalizado para usar notificaciones fácilmente
export function useNotifications() {
    // Optimizar selectores para evitar bucles infinitos
    const addNotification = useNotificationStore((state) => state.addNotification)

    const showSuccess = (title: string, message: string, options?: { duration?: number; action?: { label: string; onClick: () => void } }) => {
        addNotification({ type: "success", title, message, ...options });
    };

    const showError = (title: string, message: string, options?: { duration?: number; action?: { label: string; onClick: () => void } }) => {
        addNotification({ type: "error", title, message, ...options });
    };

    const showInfo = (title: string, message: string, options?: { duration?: number; action?: { label: string; onClick: () => void } }) => {
        addNotification({ type: "info", title, message, ...options });
    };

    const showWarning = (title: string, message: string, options?: { duration?: number; action?: { label: string; onClick: () => void } }) => {
        addNotification({ type: "warning", title, message, ...options });
    };

    return {
        showSuccess,
        showError,
        showInfo,
        showWarning,
    };
}
