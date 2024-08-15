import React from 'react';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertComponentProps {
    alertText: string;
    alertType: AlertType;
    className?: string
}

const alertIcons: Record<AlertType, string> = {
    info: 'info',
    success: 'check_circle',
    warning: 'warning',
    error: 'error',
};

const AlertComponent: React.FC<AlertComponentProps> = ({ alertText, alertType, className }) => {
    const alertClasses: Record<AlertType, string> = {
        info: 'alert-info',
        success: 'alert-success',
        warning: 'alert-warning',
        error: 'alert-error',
    };
    const alertClass = alertClasses[alertType];
    const alertIcon = alertIcons[alertType];

    return (
        <div className={`alert ${alertClass} ${className} flex w-[unset] mx-4`}>
            <span className="material-icons">{alertIcon}</span>
            <span className="text-wrap">{alertText}</span>
        </div>
    );
};

export default AlertComponent;
