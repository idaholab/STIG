import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/useTheme";
import ButtonBasic from "../elements/ButtonBasic.tsx";
import ButtonIcon from "../elements/ButtonIcon.tsx";

type Props = {
  children?: React.ReactNode;
  title?: string;
  content?: string;
  buttonColor: 'btn-primary' | 'btn-secondary' | 'btn-ghost';
  buttonType?: 'text' | 'icon'; // Optional button type
  buttonLabel?: string; // Optional button label for text button
  buttonIcon?: string; // Optional icon from https://fonts.google.com/icons
  buttonSize?: 'btn-sm' | 'btn-xs';
  isOpen?: boolean; // Control the open state from outside
  onSave?: (data: { sourceName: string; file?: File; url?: string }) => void; // Save handler
  onClose?: () => void; // Close handler
  showFormButtons?: boolean; // Show form buttons inside the form
};

export const DialogBasic: React.FC<Props> = ({
  children,
  title,
  content,
  buttonColor = 'btn-primary', // Default button color is 'btn-primary'
  buttonType = 'text', // Default button type to 'text'
  buttonLabel = 'Open Dialog', // Default button label
  buttonIcon = 'open_in_new',
  buttonSize,
  isOpen = false,
  onSave,
  onClose,
  showFormButtons = true,
}) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(isOpen);

  const handleOpenDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleSaveDialog = (data: { sourceName: string; file?: File; url?: string }) => {
    if (onSave) {
      onSave(data);
    }
    handleCloseDialog(); // Close the dialog after saving
  };

  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseDialog();
      }
    };

    if (open) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (isOpen) {
      setOpen(true);
    }
  }, [isOpen]);

  return (
    <>
      {buttonType === 'text' ? (
        <ButtonBasic label={buttonLabel} color={buttonColor} onClick={handleOpenDialog} />
      ) : (
        <ButtonIcon label={buttonLabel} color={buttonColor} onClick={handleOpenDialog} buttonIcon={buttonIcon} buttonSize={buttonSize} />
      )}

      {open &&
        <div className={`fixed z-50 inset-0 opacity-70 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}></div>
      }

      <dialog
        id="attack-full-desc-modal"
        className="modal"
        open={open}
      >
        <div className={`modal-box max-w-[1000px] min-w-none p-12 shadow-md-gray-light
          ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-900'}`}
          ref={modalRef}>
          <div className='flex justify-between items-center'>
            <h2 className="text-2xl mb-8 align-middle">{title}</h2>
            <div className="-mr-4 mb-8">
              <ButtonIcon buttonSize={buttonSize} label={'Close'} buttonIcon={'close'} color={'btn-ghost'} onClick={handleCloseDialog} />
            </div>
          </div>

          {content ? (
            <div className="modal-text-container">
              <p>{content}</p>
            </div>
          ) : (
            React.cloneElement(children as React.ReactElement<any>, { onSave: handleSaveDialog })
          )}

          {showFormButtons && (
            <div className="flex justify-end pt-4 space-x-2">
              <ButtonBasic label="Cancel" color="btn-secondary" onClick={handleCloseDialog} />
              <ButtonBasic label="Save" color="btn-primary" onClick={() => handleSaveDialog({ sourceName: '', file: undefined, url: undefined })} />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};
