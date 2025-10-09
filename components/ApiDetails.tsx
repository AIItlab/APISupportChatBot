/**
 * ApiDetails Component
 * 
 * This component displays detailed API documentation sections including workflow,
 * authentication methods, and error handling. It uses a modular approach where
 * each section is defined as an ApiDetail object with its own content.
 */

import React from 'react';

/**
 * Type definition for an API documentation section
 */
type ApiDetail = {
  id: string;         // Unique identifier for the section
  title: string;      // Display title
  content: React.ReactNode;  // React component or JSX for the section content
};

/**
 * Renders comprehensive API documentation sections
 * 
 * Features:
 * - Workflow visualization with step-by-step process
 * - Authentication methods with code examples
 * - Error handling documentation with common error codes
 * - Responsive table layouts
 * - Warning alerts for important information
 */
export function ApiDetails() {
  // Define all API documentation sections
  const details: ApiDetail[] = [
    {
      id: 'workflow',
      title: 'API Workflow',
      content: (
        <div className="space-y-4">
          {/* Basic API Flow Section */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Basic Flow</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Create a new session</li>
              <li>Search for flights</li>
              <li>Get pricing and availability</li>
              <li>Select flight and create booking</li>
              <li>Add passenger details</li>
              <li>Process payment</li>
              <li>Issue tickets</li>
            </ol>
          </section>
          
          {/* Session Management Warning */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Session Management</h3>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                Important: Sessions expire after 15 minutes of inactivity. Always maintain active sessions
                and implement proper session management in your application.
              </p>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'authentication',
      title: 'Authentication',
      content: (
        <div className="space-y-4">
          {/* Authentication Methods Section */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Authentication Methods</h3>
            <div className="grid gap-4">
              {/* API Key Authentication */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium mb-2">API Key Authentication</h4>
                <pre className="bg-gray-50 p-3 rounded text-sm">
                  <code>X-Api-Key: your-api-key-here</code>
                </pre>
              </div>
              {/* Basic Authentication */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium mb-2">Basic Authentication</h4>
                <pre className="bg-gray-50 p-3 rounded text-sm">
                  <code>Authorization: Basic base64(username:password)</code>
                </pre>
              </div>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'errors',
      title: 'Error Handling',
      content: (
        <div className="space-y-4">
          {/* Error Response Format Section */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Error Response Format</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <pre className="bg-gray-50 p-3 rounded text-sm">
                <code>{`{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {
      "field": "Additional information"
    }
  }
}`}</code>
              </pre>
            </div>
          </section>
          {/* Error Codes Table */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Common Error Codes</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solution</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">AUTH001</td>
                    <td className="px-6 py-4 text-sm">Invalid API key</td>
                    <td className="px-6 py-4 text-sm">Check your API key is valid and properly formatted</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">AUTH002</td>
                    <td className="px-6 py-4 text-sm">Session expired</td>
                    <td className="px-6 py-4 text-sm">Create a new session and retry the request</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">VAL001</td>
                    <td className="px-6 py-4 text-sm">Invalid request format</td>
                    <td className="px-6 py-4 text-sm">Check request body matches the API specification</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {details.map((detail) => (
        <section key={detail.id} id={detail.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6">{detail.title}</h2>
          {detail.content}
        </section>
      ))}
    </div>
  );
}
