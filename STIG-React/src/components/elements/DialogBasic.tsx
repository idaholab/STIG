import React from "react";
import { useTheme } from "../../contexts/useTheme";
import ButtonBasic from "../elements/ButtonBasic.tsx";
import ButtonIcon from "../elements/ButtonIcon.tsx";

type Props = {
  children?: React.ReactNode;
  dialogId: string;
  title?: string;
  buttonColor?: 'btn-primary' | 'btn-secondary' | 'btn-ghost';
  buttonType?: 'text' | 'icon'; // Optional button type
  buttonLabel?: string | React.JSX.Element; // Optional button label for text button
  buttonIcon?: string; // Optional icon from https://fonts.google.com/icons
  buttonSize?: 'btn-sm' | 'btn-xs';
  onSave?: () => void; // Save handler
  onClose?: () => void; // Close handler
  showFormButtons?: boolean; // Show form buttons inside the form
  additionalButtonClasses?: string;
};

export const DialogBasic: React.FC<Props> = ({
  children,
  dialogId,
  title,
  buttonColor = 'btn-primary', // Default button color is 'btn-primary'
  buttonType = 'text', // Default button type to 'text'
  buttonLabel = 'Open Dialog', // Default button label
  buttonIcon = 'open_in_new',
  buttonSize = 'btn-sm',
  onSave,
  onClose,
  showFormButtons = true,
  additionalButtonClasses
}) => {
  const { theme } = useTheme();

  const handleOpenDialog = () => {
    const dialogElement = document.getElementById(dialogId) as HTMLDialogElement;
    dialogElement.showModal();
  };

  const handleCloseDialog = () => {
    const dialogElement = document.getElementById(dialogId) as HTMLDialogElement;
    dialogElement.close();
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {buttonType === 'text' ? (
        <ButtonBasic 
          label={buttonLabel} 
          color={buttonColor} 
          onClick={handleOpenDialog}
          additionalClasses={`${additionalButtonClasses}`}
        />
      ) : (
        <ButtonIcon 
          color={buttonColor} 
          onClick={handleOpenDialog} 
          buttonIcon={buttonIcon} 
          buttonSize={buttonSize} 
        />
      )}

      <dialog
        id={dialogId}
        className="modal"
      >
        <div 
          className={
            `modal-box max-w-[1000px] min-w-none p-12 shadow-md-gray-light
            ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-900'}`
          }
        >
          <div className='flex justify-between items-center'>
            <h2 className="text-2xl mb-8 align-middle">{title}</h2>
            <div className="-mr-4 mb-8">
              <ButtonIcon 
                buttonSize={buttonSize} 
                label={'Close'} 
                buttonIcon={'close'} 
                color={'btn-ghost'} 
                onClick={handleCloseDialog} 
              />
            </div>
          </div>

          {children}

          {showFormButtons && (
            <div className="flex justify-end pt-4 space-x-2">
              <ButtonBasic 
                label="Cancel" 
                color="btn-secondary" 
                onClick={handleCloseDialog} 
              />
              <ButtonBasic 
                label="Save" 
                color="btn-primary" 
                onClick={onSave} 
              />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};
