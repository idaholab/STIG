

import React from 'react';
import ButtonBasic from './ButtonBasic';

type DeleteCancelAlertProps = {
    displayMessage: React.ReactNode,
    onDeleteClick: () => void,
    onCancelClick: () => void
};

export const DeleteCancelAlert: React.FC<DeleteCancelAlertProps> = ({
    displayMessage,
    onDeleteClick,
    onCancelClick
}) => {
    return (
        <div role="alert" className="alert text-base mb-8 w-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 text-neutralc-900 bg-warning-light border-primary-900 dark:bg-warning-dark dark:text-neutralc-100 dark:border-primary-100">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-neutralc-900 dark:stroke-neutralc-100 h-10 w-10 shrink-0"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
            </svg>
            <span>
                {displayMessage}
            </span>
            <ButtonBasic
                label={'Delete'}
                type={'btn-primary'}
                additionalClasses={`${'btn-sm'}`}
                onClick={onDeleteClick}
            />

            <ButtonBasic
                label={'Cancel'}
                type={'btn-ghost'}
                additionalClasses={`${'btn-sm text-neutralc-900 dark:text-neutralc-100'}`}
                onClick={onCancelClick}
            />
        </div >
    );
}