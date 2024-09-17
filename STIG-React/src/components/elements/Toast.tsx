import React from 'react';

interface ToastProps {
    children?: React.ReactNode;
}

const Toast: React.FC<ToastProps> = ({ children }) => {
    return (
        <div className="toast">
            {children}
        </div>
    );
};

export default Toast;