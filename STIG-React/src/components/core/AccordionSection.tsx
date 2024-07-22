import React, { useEffect, useRef, useState } from 'react';

interface AccordionSectionProps {
    title: string;
    isOpen: boolean;
    toggleAccordion: () => void;
    children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, isOpen, toggleAccordion, children }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(isOpen ? contentRef.current.scrollHeight : 0);
        }
    }, [isOpen]);

    return (
        <div className="collapse p-0">
            <input type="checkbox" checked={isOpen} readOnly className="peer" hidden />
            <div
                className="collapse-title flex items-center cursor-pointer p-0 ml-4"
                onClick={toggleAccordion}>
                <span className="text-sm font-semibold">
                    {title}
                </span>
                <span className={`material-icons transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`}>
                    arrow_drop_up
                </span>
            </div>
            <div ref={contentRef} className="collapse-content pl-4 pr-2 text-sm overflow-hidden transition-all duration-300 ease-in-out"
                style={{ height: height ? `${height}px` : '0' }}>
                {children}
            </div>
        </div>
    );
};

export default AccordionSection;
