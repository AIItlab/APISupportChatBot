import React from 'react';

type CodeSample = {
  title: string;
  description: string;
  code: string;
  language: string;
};

type ApiEndpoint = {
  method: string;
  endpoint: string;
  description: string;
  request?: string;
  response?: string;
};

export function TechnicalContent() {
  const codeSamples: CodeSample[] = [
    {
      title: 'Session Creation',
      description: 'Create a new session for API interactions',
      language: 'json',
      code: `POST /api/session
{
  "domain": "OTA",
  "systemId": "J9WS"
}`
    },
    {
      title: 'Flight Search Request',
      description: 'Search for available flights',
      language: 'json',
      code: `POST /api/flight/search
{
  "origin": "KWI",
  "destination": "CAI",
  "departureDate": "2025-06-20",
  "returnDate": "2025-06-25",
  "adultCount": 1,
  "childCount": 0,
  "infantCount": 0
}`
    }
  ];

  const apiEndpoints: ApiEndpoint[] = [
    {
      method: 'POST',
      endpoint: '/api/flight/search',
      description: 'Search for available flights',
      request: `{
  "origin": "string",
  "destination": "string",
  "departureDate": "YYYY-MM-DD",
  "returnDate": "YYYY-MM-DD",
  "adultCount": number,
  "childCount": number,
  "infantCount": number
}`,
      response: `{
  "flights": [
    {
      "flightNumber": "string",
      "departureTime": "string",
      "arrivalTime": "string",
      "price": {
        "amount": number,
        "currency": "string"
      }
    }
  ]
}`
    },
    {
      method: 'POST',
      endpoint: '/api/booking/create',
      description: 'Create a new booking',
      request: `{
  "flightId": "string",
  "passengers": [
    {
      "type": "ADT|CHD|INF",
      "title": "string",
      "firstName": "string",
      "lastName": "string",
      "dateOfBirth": "YYYY-MM-DD"
    }
  ]
}`
    }
  ];

  return (
    <div className="space-y-8">
      {/* Code Samples Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Code Samples</h2>
        <div className="grid gap-6">
          {codeSamples.map((sample, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">{sample.title}</h3>
              <p className="text-gray-600 mb-4">{sample.description}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="language-json">
                  <code>{sample.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* API Endpoints Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>
        <div className="grid gap-6">
          {apiEndpoints.map((endpoint, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md font-mono text-sm">
                  {endpoint.method}
                </span>
                <span className="font-mono text-gray-800">{endpoint.endpoint}</span>
              </div>
              <p className="text-gray-600 mb-4">{endpoint.description}</p>
              {endpoint.request && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Request Body</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="language-json">
                      <code>{endpoint.request}</code>
                    </pre>
                  </div>
                </div>
              )}
              {endpoint.response && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Response Body</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="language-json">
                      <code>{endpoint.response}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
