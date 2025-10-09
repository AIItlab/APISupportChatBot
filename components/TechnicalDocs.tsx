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

export function TechnicalDocs() {
  const sections: DocSection[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="space-y-4">
          <section>
            <h4 className="text-lg font-semibold mb-3">OTA Navitaire DotRez API Integration Kit</h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-lg font-medium">Version 2.1 – June 2023</p>
              <p className="text-sm text-gray-600 mt-2">This document provides comprehensive guidance for integrating with Jazeera Airways' Navitaire DotRez API system.</p>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'system-requirements',
      title: 'System Requirements',
      content: (
        <div className="space-y-4">
          <section>
            <h4 className="text-lg font-semibold mb-3">Technical Requirements</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>HTTPS support for secure communication</li>
              <li>Valid SSL certificate</li>
              <li>Support for TLS 1.2 or higher</li>
              <li>Ability to handle JSON requests and responses</li>
              <li>Session management capabilities</li>
            </ul>
          </section>
          <section>
            <h4 className="text-lg font-semibold mb-3">Network Requirements</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Stable internet connection with sufficient bandwidth</li>
              <li>Low latency connection to API endpoints</li>
              <li>Proper firewall configuration to allow API traffic</li>
            </ul>
          </section>
        </div>
      )
    },
    {
      id: 'api-endpoints',
      title: 'API Endpoints',
      content: (
        <div className="space-y-4">
          <section>
            <h4 className="text-lg font-semibold mb-3">Environment URLs</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Environment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Production</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">https://ws.jazeeraairways.com/v1/api/</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Live environment for production use</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Test</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">https://wsuat.jazeeraairways.com/v1/api/</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Testing and integration</td>
                  </tr>
                </tbody>
              </table>
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
              <p className="mt-4 text-sm text-gray-600">The API key will be provided by Jazeera Airways upon successful registration.</p>
            </div>
          </section>
          <section>
            <h4 className="text-lg font-semibold mb-3">Session Management</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ul className="list-disc pl-6 space-y-2">
                <li>Sessions expire after 15 minutes of inactivity</li>
                <li>Implement session pooling for better performance</li>
                <li>Maximum of 5 concurrent sessions per client</li>
                <li>Always terminate sessions when done using the logout endpoint</li>
              </ul>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'booking-flow',
      title: 'Booking Flow',
      content: (
        <div className="space-y-6">
          <section>
            <h4 className="text-lg font-semibold mb-3">Standard Booking Process</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ol className="list-decimal pl-4 space-y-2">
                <li>Create a new session</li>
                <li>Search for flights</li>
                <li>Get fare quotes</li>
                <li>Select flight and fare</li>
                <li>Add passenger information</li>
                <li>Add special services (optional)</li>
                <li>Process payment</li>
                <li>Confirm booking</li>
                <li>Retrieve PNR</li>
              </ol>
            </div>
          </section>
          <section>
            <h4 className="text-lg font-semibold mb-3">Available Product Classes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium mb-2">Economy Cabin</h5>
                <ul className="list-disc pl-4 space-y-1">
                  <li>EL - Economy Light</li>
                  <li>EV - Economy Value</li>
                  <li>EE - Economy Extra</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium mb-2">Business Cabin</h5>
                <ul className="list-disc pl-4 space-y-1">
                  <li>BU - Business (KWI-CAI routes only)</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'payment-options',
      title: 'Payment Methods',
      content: (
        <div className="space-y-4">
          <section>
            <h4 className="text-lg font-semibold mb-3">Available Payment Options</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ul className="list-disc pl-4 space-y-2">
                <li>
                  <strong>Agency Account Payment (AG)</strong>
                  <p className="ml-4 mt-1 text-sm text-gray-600">Use agency credit balance for payment</p>
                </li>
                <li>
                  <strong>BSP Payment Options</strong>
                  <ul className="list-disc pl-8 mt-1">
                    <li>BSP Cash</li>
                    <li>BSP Easy Pay</li>
                  </ul>
                </li>
                <li>
                  <strong>Credit Card (CC)</strong>
                  <p className="ml-4 mt-1 text-sm text-gray-600">Direct credit card payment processing</p>
                </li>
              </ul>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'error-handling',
      title: 'Error Handling',
      content: (
        <div className="space-y-4">
          <section>
            <h4 className="text-lg font-semibold mb-3">Error Response Format</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="font-mono text-sm bg-gray-100 p-3 rounded">
                <pre>{`{
  "error": {
    "code": "ERROR_CODE",
    "message": "Detailed error message",
    "details": {
      "field": "Additional information"
    }
  }
}`}</pre>
              </div>
            </div>
          </section>
          <section>
            <h4 className="text-lg font-semibold mb-3">Common Error Codes</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AUTH_001</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Invalid API credentials</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">SESSION_001</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Session expired</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">BOOKING_001</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Invalid PNR</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
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
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium mb-2">Flight Operations</h5>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Flight Search</li>
                  <li>Fare Display</li>
                  <li>Seat Selection</li>
                  <li>Flight Booking</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
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
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
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
        </div>
      )
    },
    {
      id: 'api-requests',
      title: 'API Request Guidelines',
      content: (
        <div className="space-y-4">
          <section>
            <h4 className="text-lg font-semibold mb-3">Request Headers</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="font-mono text-sm bg-gray-100 p-3 rounded">
                <pre>{`Content-Type: application/json
Accept: application/json
X-Api-Key: [your-api-key]
Authorization: Basic [credentials]
Session-Id: [session-id]`}</pre>
              </div>
            </div>
          </section>
          <section>
            <h4 className="text-lg font-semibold mb-3">Request Rate Limits</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ul className="list-disc pl-4 space-y-2">
                <li>Maximum 100 requests per minute per API key</li>
                <li>Maximum 5 concurrent sessions per client</li>
                <li>Maximum 1000 search requests per hour</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">Exceeding these limits will result in HTTP 429 (Too Many Requests) responses.</p>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'special-services',
      title: 'Special Services',
      content: (
        <div className="space-y-4">
          <section>
            <h4 className="text-lg font-semibold mb-3">Available Special Services</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">INFT</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Infant without seat</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Must be under 2 years</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EXST</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Extra seat</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Subject to availability</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">WCHR</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Wheelchair</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Request in advance</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'testing',
      title: 'Testing Guidelines',
      content: (
        <div className="space-y-4">
          <section>
            <h4 className="text-lg font-semibold mb-3">Test Environment Access</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ul className="list-disc pl-4 space-y-2">
                <li>Use the UAT environment for all testing</li>
                <li>Test credentials will be provided separately</li>
                <li>Test credit card numbers available for payment testing</li>
                <li>Complete test scenarios provided in test plan document</li>
              </ul>
            </div>
          </section>
          <section>
            <h4 className="text-lg font-semibold mb-3">Test Card Numbers</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Card Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Visa</td>
                    <td className="px-6 py-4 text-sm text-gray-500">4111111111111111</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Success</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mastercard</td>
                    <td className="px-6 py-4 text-sm text-gray-500">5555555555554444</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Success</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      content: (
        <div className="space-y-4">
          <section>
            <h4 className="text-lg font-semibold mb-3">Implementation Guidelines</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ul className="list-disc pl-4 space-y-2">
                <li>Implement proper error handling and retries</li>
                <li>Use session pooling for better performance</li>
                <li>Cache appropriate responses</li>
                <li>Implement rate limiting in your application</li>
                <li>Log all API interactions for troubleshooting</li>
                <li>Follow security best practices for credential storage</li>
              </ul>
            </div>
          </section>
          <section>
            <h4 className="text-lg font-semibold mb-3">Performance Tips</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ul className="list-disc pl-4 space-y-2">
                <li>Keep sessions alive for multiple operations</li>
                <li>Implement connection pooling</li>
                <li>Cache frequently accessed data</li>
                <li>Use compression for large payloads</li>
                <li>Implement proper timeout handling</li>
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
