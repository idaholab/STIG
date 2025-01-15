import React from 'react';
import ButtonIcon from './ButtonIcon';
import { mdiAlert, mdiAlertCircle, mdiCheckCircleOutline, mdiClose } from '@mdi/js';
import { mdilInformation } from '@mdi/light-js';
import Icon from '@mdi/react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

type AlertComponentProps = {
    alertText: string;
    alertType: AlertType;
    className?: string;
    userClosable?: boolean;
    onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const alertIcons: Record<AlertType, string> = {
    info: mdilInformation,
    success: mdiCheckCircleOutline,
    warning: mdiAlert,
    error: mdiAlertCircle,
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
        <div className={`alert ${alertClass} ${className ?? ''}  w-[unset] shadow-lg`}>
            <Icon path={alertIcon} size={1} />
            <span className="text-wrap">{alertText}</span>
            {userClosable ?
                <ButtonIcon
                    buttonIcon={mdiClose}
                    type={'alert'}
                    buttonSize='btn-xs'
                    onClick={onClose}
                />
                : null
            }
        </div>
    );
};

export default AlertComponent;
