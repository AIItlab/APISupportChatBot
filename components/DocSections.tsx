import React from 'react';

type DocSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

const DocItem: React.FC<DocSection> = ({ title, content }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
    <h3 className="text-xl font-semibold mb-4 text-blue-800">{title}</h3>
    <div className="text-gray-700 prose prose-blue max-w-none">{content}</div>
  </div>
);

export function DocumentationSections() {
  const sections: DocSection[] = [
    {
      id: 'header',
      title: 'OTA Navitaire DotRez API Integration Kit',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-lg font-medium">Version 2.1 – June 2023</p>
            <p className="text-sm text-gray-600 mt-2">Last Updated: June 2023</p>
          </div>
        </div>
      )
    },
    {
      id: 'intro',
      title: 'Introduction',
      content: (
        <>
          <h4 className="text-lg font-semibold mb-2">Document Version</h4>
          <p>Version 2.1 – June 2023</p>
          <h4 className="text-lg font-semibold mt-4 mb-2">Document Purpose</h4>
          <p>This document provides technical integration guidance for OTAs (Online Travel Agencies) to connect with Jazeera Airways' Navitaire DotRez API. It outlines the steps required for successful integration with our booking system.</p>
        </>
      )
    },
    {
      id: 'api-endpoints',
      title: 'API Endpoints',
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Environment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Production</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">https://ws.jazeeraairways.com/v1/api/</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Test</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">https://wsuat.jazeeraairways.com/v1/api/</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 'authentication',
      title: 'Authentication',
      content: (
        <>
          <p>Authentication is required for all API requests. Use the following authentication methods:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>API Key in request header: <code>X-Api-Key: [your-api-key]</code></li>
            <li>Client credentials in request header: <code>Authorization: Basic [base64-encoded-credentials]</code></li>
          </ul>
        </>
      )
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: (
        <div className="space-y-4">
          <section>
            <h4 className="text-lg font-semibold mb-3">Prerequisites</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Valid API credentials from Jazeera Airways</li>
              <li>Understanding of RESTful API concepts</li>
              <li>Familiarity with HTTP/HTTPS protocols</li>
              <li>SSL certificate for secure communication</li>
            </ul>
          </section>
          <section>
            <h4 className="text-lg font-semibold mb-3">Integration Steps</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Obtain API credentials from Jazeera Airways</li>
              <li>Configure your development environment</li>
              <li>Test connectivity with the API endpoints</li>
              <li>Implement the required API flows</li>
              <li>Test and validate the integration</li>
            </ol>
          </section>
        </div>
      )
    },
    {
      id: 'api-overview',
      title: 'API Overview',
      content: (
        <div className="space-y-4">
          <section>
            <h4 className="text-lg font-semibold mb-3">API Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium mb-2">Flight Operations</h5>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Flight Search</li>
                  <li>Fare Display</li>
                  <li>Seat Selection</li>
                  <li>Flight Booking</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium mb-2">Booking Management</h5>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Booking Creation</li>
                  <li>Booking Modification</li>
                  <li>Booking Cancellation</li>
                  <li>Booking Retrieval</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'authentication',
      title: 'Authentication & Security',
      content: (
        <div className="space-y-4">
          <section>
            <h4 className="text-lg font-semibold mb-3">Authentication Methods</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="mb-3">All API requests must include the following headers:</p>
              <div className="font-mono text-sm bg-gray-100 p-3 rounded">
                <p>X-Api-Key: [your-api-key]</p>
                <p className="mt-2">Authorization: Basic [base64-encoded-credentials]</p>
              </div>
            </div>
          </section>
          <section>
            <h4 className="text-lg font-semibold mb-3">Security Requirements</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>All API requests must use HTTPS</li>
              <li>API keys must be kept secure</li>
              <li>Implement proper error handling</li>
              <li>Follow security best practices</li>
            </ul>
          </section>
        </div>
      )
    },
    {
      id: 'api-flows',
      title: 'Common API Flows',
      content: (
        <div className="space-y-6">
          <section>
            <h4 className="text-lg font-semibold mb-3">Search and Book Flow</h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <ol className="list-decimal pl-4 space-y-2">
                <li>Search for available flights</li>
                <li>Select desired flight and fare</li>
                <li>Add passenger information</li>
                <li>Select seats (optional)</li>
                <li>Add special services (optional)</li>
                <li>Create booking</li>
                <li>Process payment</li>
                <li>Confirm booking</li>
              </ol>
            </div>
          </section>
          <section>
            <h4 className="text-lg font-semibold mb-3">Post-Booking Operations</h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <ul className="list-disc pl-4 space-y-2">
                <li>Retrieve booking details</li>
                <li>Modify passenger information</li>
                <li>Add or remove services</li>
                <li>Change flight itinerary</li>
                <li>Cancel booking</li>
              </ul>
            </div>
          </section>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <DocItem key={section.id} {...section} />
      ))}
    </div>
  );
}
