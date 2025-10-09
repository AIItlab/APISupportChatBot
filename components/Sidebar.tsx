'use client';

import React from 'react';
import clsx from 'clsx';

interface Section {
  id: string;
  title: string;
  subsections?: Section[];
}

interface SidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, activeSection, onSectionChange }) => {
  const handleSectionClick = (section: Section) => {
    // If section has subsections and is not already active, show first subsection
    if (section.subsections?.length && activeSection !== section.id) {
      onSectionChange(section.subsections[0].id);
    } else {
      onSectionChange(section.id);
    }
  };

  const renderSectionLink = (section: Section, isSubsection = false) => (
    <div 
      key={section.id}
      className={clsx(
        'cursor-pointer transition-colors duration-200',
        isSubsection ? 'pl-6 border-l-2' : 'font-medium',
        activeSection === section.id
          ? isSubsection 
            ? 'text-blue-600 bg-blue-50 border-blue-500' 
            : 'text-blue-600 bg-blue-50'
          : isSubsection
            ? 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 border-transparent'
            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
      )}
      onClick={() => isSubsection ? onSectionChange(section.id) : handleSectionClick(section)}
    >
      <div className="px-4 py-2">
        {section.title}
      </div>
    </div>
  );

  return (
    <nav className="py-4">
      {sections.map(section => (
        <div key={section.id}>
          {renderSectionLink(section)}
          {(section.subsections && (activeSection === section.id || section.subsections.some(sub => sub.id === activeSection))) && (
            <div className="mt-1">
              {section.subsections.map(subsection => 
                renderSectionLink(subsection, true)
              )}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;
