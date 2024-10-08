import React, { useEffect, useState } from 'react';
import ButtonIcon from './ButtonIcon';

type InfoButtonProps = {
    visible?: boolean;
    infoIcon?: string;
    toggleInfo: () => void;
    additionalInfoClasses?: string;
    additionalStyle?: React.CSSProperties;
    parentRef: React.RefObject<HTMLDivElement>;
}

const FloatingInfoButton: React.FC<InfoButtonProps> = ({
    visible = true,
    infoIcon = 'info_outline',
    toggleInfo,
    additionalInfoClasses = '',
    additionalStyle,
    parentRef,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const parentElement = parentRef.current;

        if (parentElement) {
            const handleMouseEnter = () => setIsVisible(true);
            const handleMouseLeave = () => setIsVisible(false);
            const handleFocus = () => setIsVisible(true);
            const handleBlur = () => setIsVisible(false);
            parentElement.addEventListener('mouseenter', handleMouseEnter);
            parentElement.addEventListener('mouseleave', handleMouseLeave);
            parentElement.addEventListener('focusin', handleFocus);
            parentElement.addEventListener('focusout', handleBlur);

            return () => {
                parentElement.removeEventListener('mouseenter', handleMouseEnter);
                parentElement.removeEventListener('mouseleave', handleMouseLeave);
                parentElement.removeEventListener('focusin', handleFocus);
                parentElement.removeEventListener('focusout', handleBlur);
            };
        }
    }, [parentRef]);

    return (
        <>
            {visible ? (
                <div
                    className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}  ${additionalInfoClasses}`}
                    style={additionalStyle}
                >
                    <ButtonIcon
                        color="btn-ghost"
                        buttonIcon={infoIcon}
                        buttonSize="h-6 w-6 min-h-6"
                        iconText="!text-[18px]"
                        onClick={toggleInfo}
                    />
                </div>
            ) : null}
        </>
    );
};

export default FloatingInfoButton;
