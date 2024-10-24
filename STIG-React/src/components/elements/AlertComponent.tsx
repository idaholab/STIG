import React from 'react';
import ButtonIcon from './ButtonIcon';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

type AlertComponentProps = {
    alertText: string;
    alertType: AlertType;
    className?: string;
    userClosable?: boolean;
    onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const alertIcons: Record<AlertType, string> = {
    info: 'info',
    success: 'check_circle',
    warning: 'warning',
    error: 'error',
};

const AlertComponent: React.FC<AlertComponentProps> = ({
    alertText, alertType, className, userClosable, onClose
}) => {
    const alertClasses: Record<AlertType, string> = {
        info: 'alert-info',
        success: 'alert-success',
        warning: 'alert-warning',
        error: 'alert-error',
    };
    const alertClass = alertClasses[alertType];
    const alertIcon = alertIcons[alertType];

    return (
        <div className={`alert ${alertClass} ${className} grid w-[unset] mx-4`}>
            <span className="material-icons">{alertIcon}</span>
            <span className="text-wrap">{alertText}</span>
            {userClosable ?
                <ButtonIcon
                    buttonIcon='close'
                    type={'btn-neutralc'}
                    buttonSize='btn-xs'
                    onClick={onClose}
                />
                : null
            }
        </div>
    );
};

export default AlertComponent;
