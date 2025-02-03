import React from 'react';

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, isOpen, children }) => {
  return (
    <details open={isOpen} className="pb-4">
      <summary className="text-sm font-semibold">{title}</summary>
      {children}
    </details>
  );
};

export default AccordionSection;
