'use client';

import React, { useState } from 'react';
import { FAQSection } from '../FAQSections';
import Sidebar from '../Sidebar';
import FullDocumentation from '../FullDocumentation';
import GettingStarted from '../GettingStarted';

export default function MainLayout() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const renderContent = () => {
    // Handle main sections
    switch (activeSection) {
      case 'getting-started':
        return <GettingStarted />;
      case 'full-documentation':
      case 'authentication':
      case 'endpoints':
      case 'errors':
        return <FullDocumentation activeSection={activeSection} />;
      case 'faqs':
      case 'basic-faqs':
        return <FAQSection category="basic" />;
      case 'advanced-faqs':
        return <FAQSection category="advanced" />;
      default:
        return <GettingStarted />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">JAZEERA AIRWAYS API</h1>
          <p className="text-sm opacity-90">Technical Documentation & FAQ</p>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Fixed Sidebar Navigation */}
        <aside className="fixed top-[88px] left-0 w-64 h-[calc(100vh-88px)] border-r border-gray-200 bg-white overflow-y-auto">
          <Sidebar 
            sections={[
              {
                id: "getting-started",
                title: "Getting Started"
              },
              {
                id: "full-documentation",
                title: "API Documentation",
                subsections: [
                  { id: "full-documentation", title: "Complete Documentation" },
                  { id: "authentication", title: "Authentication" },
                  { id: "endpoints", title: "API Endpoints" },
                  { id: "errors", title: "Error Handling" }
                ]
              },
              {
                id: "faqs",
                title: "FAQs",
                subsections: [
                  { id: "basic-faqs", title: "Basic FAQs" },
                  { id: "advanced-faqs", title: "Advanced FAQs" }
                ]
              }
            ]}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-64 pt-[88px] p-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
