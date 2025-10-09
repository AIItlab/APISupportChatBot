'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

// Define documentation sections
const sections = [
  { id: 'intro', title: 'Introduction', images: [0, 1, 2, 3, 4] },
  { id: 'getting-started', title: 'Getting Started', images: [5, 6, 7, 8, 9, 10] },
  { id: 'authentication', title: 'Authentication', images: [11, 12, 13, 14, 15] },
  { id: 'endpoints', title: 'API Endpoints', images: [16, 17, 18, 19, 20] },
  { id: 'errors', title: 'Error Handling', images: [31, 32, 33, 34, 35] },
  { id: 'integration', title: 'Integration Guide', images: [21, 22, 23, 24, 25] },
  { id: 'usage-examples', title: 'Usage Examples', images: [26, 27, 28, 29, 30] },
  { id: 'advanced-features', title: 'Advanced Features', images: [36, 37, 38, 39, 40] },
  { id: 'security', title: 'Security', images: [41, 42, 43, 44, 45] },
  { id: 'optimization', title: 'Performance & Optimization', images: [46, 47, 48, 49, 50] },
  { id: 'monitoring', title: 'Monitoring & Logging', images: [51, 52, 53, 54, 55] },
  { id: 'deployment', title: 'Deployment Guide', images: [56, 57, 58, 59, 60] },
  { id: 'troubleshooting', title: 'Troubleshooting', images: [61, 62, 63, 64, 65] },
  { id: 'best-practices', title: 'Best Practices', images: [66, 67, 68, 69, 70] },
  { id: 'references', title: 'API References', images: Array.from({ length: 37 }, (_, i) => i + 71) }
];

interface REDACTED {
  className?: string;
  activeSection?: string;
}

const FullDocumentation: React.FC<REDACTED> = ({ 
  className = '',
  activeSection = 'full-documentation'
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSection && activeSection !== 'full-documentation') {
      const sectionElement = document.getElementById(activeSection);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (contentRef.current) {
      // If full documentation is selected, scroll to top
      contentRef.current.scrollTop = 0;
    }
  }, [activeSection]);

  // Always show all sections, but highlight the active one
  return (
    <div className={`REDACTED ${className}`} ref={contentRef}>
      <div className="space-y-12 pb-8">
        {/* Table of Contents */}
        {activeSection === 'full-documentation' && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Table of Contents</h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Documentation Sections */}
        {sections.map((section) => (
          <div 
            key={section.id} 
            id={section.id} 
            className={clsx(
              'scroll-mt-24 transition-all duration-300',
              activeSection === section.id ? 'opacity-100' : 'opacity-90'
            )}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 group">
              {section.title}
              <a 
                href={`#${section.id}`} 
                className="ml-2 opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700"
                aria-label={`Link to ${section.title}`}
              >
                #
              </a>
            </h2>
            <div className="space-y-8">
              {section.images.map((imageIndex) => (
                <div key={imageIndex} className="documentation-image">
                  <div 
                    className="relative bg-white rounded-lg overflow-hidden shadow-lg"
                    style={{ height: '800px' }}
                  >
                    <Image
                      src={`/REDACTED/image${imageIndex}.png`}
                      alt={`${section.title} - Image ${imageIndex + 1}`}
                      fill
                      className="object-contain"
                      priority={imageIndex < 10}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                    />
                  </div>
                  <div className="mt-4 text-sm text-gray-500 text-center">
                    Figure {imageIndex + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullDocumentation;

