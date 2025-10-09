import React from 'react';

interface DocumentationSectionProps {
  title: string;
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  id?: string;
}

export const DocumentationSection: React.FC<DocumentationSectionProps> = ({
  title,
  children,
  level = 1,
  id
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const headingClasses = {
    1: 'text-4xl font-bold mb-8',
    2: 'text-3xl font-bold mb-6 mt-12',
    3: 'text-2xl font-bold mb-4 mt-8',
    4: 'text-xl font-bold mb-3 mt-6'
  }[level];

  return (
    <section id={id} className="documentation-section">
      <HeadingTag className={`${headingClasses} text-gray-900`}>
        {title}
      </HeadingTag>
      <div className="documentation-content">{children}</div>
    </section>
  );
};
