import React, { useState } from 'react';
import ButtonBasic from '../elements/ButtonBasic.tsx';
import ButtonIcon from '../elements/ButtonIcon.tsx';
import { mdiClose, mdiOpenInNew } from '@mdi/js';

type Props = {
  children?: React.ReactNode;
  dialogId: string;
  title?: string;
  buttonColor?: 'btn-primary' | 'btn-neutralc' | 'btn-ghost';
  buttonType?: 'text' | 'icon'; // Optional button type
  buttonLabel?: string | React.JSX.Element; // Optional button label for text button
  buttonIcon?: string; // Optional icon from https://fonts.google.com/icons
  buttonSize?: 'btn-sm' | 'btn-xs';
  saveLabel?: string;
  onSave?: () => void; // Save handler
  onClose?: () => void; // Close handler
  showFormButtons?: boolean; // Show form buttons inside the form
  disabled?: boolean;
  saveEnabled?: boolean;
  additionalButtonClasses?: string;
};

export const DialogBasic: React.FC<Props> = ({
  children,
  dialogId,
  title,
  buttonColor = 'btn-primary', // Default button color is 'btn-primary'
  buttonType = 'text', // Default button type to 'text'
  buttonLabel = 'Open Dialog', // Default button label
  buttonIcon = mdiOpenInNew,
  buttonSize = 'btn-sm',
  saveLabel = 'Save',
  onSave,
  onClose,
  showFormButtons = true,
  saveEnabled = true,
  disabled,
  additionalButtonClasses,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDialog = () => {
    const dialogElement = document.getElementById(dialogId) as HTMLDialogElement;
    dialogElement.showModal();
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    const dialogElement = document.getElementById(dialogId) as HTMLDialogElement;
    dialogElement.close();
    onClose && onClose();
    setIsOpen(false);
  };

  const observer = new MutationObserver((ms) => {
    const dialogElement = document.getElementById(dialogId) as HTMLDialogElement;
    if (ms.some((mr) => mr.target == dialogElement && dialogElement.open)) {
      handleOpenDialog();
    }
  });

  observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });

  return (
    <>
      {buttonType === 'text' ? (
        <ButtonBasic
          label={buttonLabel}
          type={buttonColor}
          onClick={handleOpenDialog}
          disabled={disabled}
          additionalClasses={`${additionalButtonClasses}`}
          isLabelUppercase={false}
        />
      ) : (
        <ButtonIcon
          type={buttonColor}
          onClick={handleOpenDialog}
          buttonIcon={buttonIcon}
          buttonSize={buttonSize}
          disabled={disabled}
        />
      )}

      <dialog id={dialogId} className="modal">
        <div
          className={`modal-box max-w-[1000px] max-h-[615px] min-w-none p-12 shadow-md-neutralc-900 dark:bg-neutralc-700 dark:text-neutralc-100 bg-neutralc-200 text-neutralc-900 `}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl mb-8 align-middle">{title}</h2>
            <div className="-mr-4 mb-8">
              <ButtonIcon
                buttonSize={buttonSize}
                iconText={'Close'}
                buttonIcon={mdiClose}
                type={'btn-ghost'}
                onClick={handleCloseDialog}
              />
            </div>
          </div>

          {isOpen && children}

          {showFormButtons && (
            <div className="flex justify-end pt-4 space-x-2">
              <ButtonBasic label="Cancel" type="btn-neutralc" onClick={handleCloseDialog} />
              <ButtonBasic
                label={saveLabel}
                type="btn-primary"
                onClick={() => {
                  handleCloseDialog();
                  onSave && onSave();
                }}
                disabled={!saveEnabled}
              />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};
