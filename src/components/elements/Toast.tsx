import React from 'react';

interface ToastProps {
    children?: React.ReactNode;
}

const Toast: React.FC<ToastProps> = ({ children }) => {
    return (
        <div className="toast z-50">
            {children}
        </div>
    );
};

export default Toast;