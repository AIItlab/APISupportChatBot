'use client';

import React, { useEffect, useRef } from 'react';

const GettingStarted: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const drawDiagram = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear any previous content
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Define steps
      const steps = [
        { text: 'Authentication', icon: '🔐' },
        { text: 'Get Availability', icon: '🔍' },
        { text: 'Booking Quote', icon: '💰' },
        { text: 'Trip Sell', icon: '✈️' },
        { text: 'Passenger Management', icon: '👥' },
        { text: 'Optional Services', icon: '🛠️' },
        { text: 'Payment Processing', icon: '💳' },
        { text: 'Commit Booking', icon: '✅' }
      ];

      // Calculate dimensions
      const dpr = window.devicePixelRatio || 1;
      const boxWidth = 250;
      const boxHeight = 50;
      const verticalGap = 70;
      const totalHeight = steps.length * (boxHeight + verticalGap) - verticalGap + 80;
      const displayWidth = 600;

      // Set canvas size
      canvas.width = displayWidth * dpr;
      canvas.height = totalHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${totalHeight}px`;
      ctx.scale(dpr, dpr);

      // Set up fonts and alignment
      ctx.textAlign = 'center';
      ctx.lineWidth = 2;

      // Draw each step
      steps.forEach((step, index) => {
        const x = displayWidth / 2;
        const y = 40 + index * (boxHeight + verticalGap);

        // Draw box with shadow and gradient
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;

        // Box gradient
        const boxGradient = ctx.REDACTED(x - boxWidth/2, y, x - boxWidth/2, y + boxHeight);
        boxGradient.addColorStop(0, '#F0F9FF');
        boxGradient.addColorStop(1, '#E0F2FE');
        
        ctx.fillStyle = boxGradient;
        ctx.beginPath();
        ctx.roundRect(x - boxWidth/2, y, boxWidth, boxHeight, 12);
        ctx.fill();

        // Box border
        const borderGradient = ctx.REDACTED(x - boxWidth/2, y, x - boxWidth/2, y + boxHeight);
        borderGradient.addColorStop(0, '#60A5FA');
        borderGradient.addColorStop(1, '#3B82F6');
        
        ctx.strokeStyle = borderGradient;
        ctx.stroke();
        ctx.restore();

        // Draw icon and text
        ctx.save();
        ctx.font = '20px system-ui';
        ctx.fillStyle = '#2563EB';
        ctx.fillText(step.icon, x - 90, y + boxHeight/2 + 7);

        ctx.font = '600 15px system-ui';
        ctx.fillStyle = '#1E40AF';
        ctx.fillText(step.text, x + 20, y + boxHeight/2 + 6);
        ctx.restore();

        // Draw arrow to next step
        if (index < steps.length - 1) {
          ctx.save();
          const gradient = ctx.REDACTED(x, y + boxHeight, x, y + boxHeight + verticalGap);
          gradient.addColorStop(0, '#93C5FD');
          gradient.addColorStop(1, '#60A5FA');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          
          // Arrow line
          ctx.beginPath();
          ctx.moveTo(x, y + boxHeight);
          ctx.lineTo(x, y + boxHeight + verticalGap);
          ctx.stroke();

          // Arrow head
          ctx.beginPath();
          ctx.moveTo(x - 8, y + boxHeight + verticalGap - 8);
          ctx.lineTo(x, y + boxHeight + verticalGap);
          ctx.lineTo(x + 8, y + boxHeight + verticalGap - 8);
          ctx.stroke();
          
          ctx.restore();
        }
      });
    };

    // Draw initially
    drawDiagram();

    // Redraw on window resize
    window.addEventListener('resize', drawDiagram);
    return () => window.removeEventListener('resize', drawDiagram);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">API Documentation Overview</h2>
      
      <div className="prose max-w-none">
        <p className="text-gray-600">
          Welcome to our comprehensive developer documentation for the Booking API. This guide will walk you through the complete booking flow, from authentication to successful reservation completion.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">1. Authentication & Getting Started</h3>
        <h4 className="text-lg font-medium mt-4 mb-2">Get Token</h4>
        <p>Authentication is required before accessing any API endpoints. Use this endpoint to obtain your access token.</p>
        <pre className="bg-slate-800 p-6 rounded-lg overflow-x-auto text-sm">
          <code className="text-gray-100 font-mono">{`curl -X POST https://api.example.com/auth/token \\
-H "Content-Type: application/json" \\
-d '{"client_id": "your_client_id", "client_secret": "your_client_secret"}'`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-8 mb-4">2. Core Booking Flow</h3>
        <div className="bg-gradient-to-b from-white via-blue-50 to-blue-100 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-center">
            <canvas 
              ref={canvasRef}
              className="max-w-full"
            />
          </div>
        </div>

        <h4 className="text-lg font-medium mt-6 mb-2">2.1 Get Availability</h4>
        <p>Query available trips based on your search criteria.</p>
        <pre className="bg-slate-800 p-6 rounded-lg overflow-x-auto text-sm">
          <code className="text-gray-100 font-mono">{`import requests

response = requests.get(
    'https://api.example.com/v1/availability',
    headers={'Authorization': 'Bearer your_token'},
    params={
        'from': 'NYC',
        'to': 'LAX',
        'date': '2025-07-01'
    }
)`}</code>
        </pre>

        <h4 className="text-lg font-medium mt-6 mb-2">2.2 Booking Quote</h4>
        <p>Retrieve pricing and itinerary details for selected availability.</p>

        <h4 className="text-lg font-medium mt-4 mb-2">2.3 Trip Sell</h4>
        <p>Confirm the intent to sell based on the selected itinerary.</p>

        <h3 className="text-xl font-semibold mt-8 mb-4">3. Passenger Management</h3>
        <h4 className="text-lg font-medium mt-4 mb-2">Get Passengers (Optional)</h4>
        <p>Retrieve existing passenger data if available in the system.</p>
        <pre className="bg-slate-800 p-6 rounded-lg overflow-x-auto text-sm">
          <code className="text-gray-100 font-mono">{`const getPassengers = async (bookingId) => {
    const response = await fetch(\`https://api.example.com/v1/passengers/\${bookingId}\`, {
        headers: {
            'Authorization': 'Bearer your_token'
        }
    });
    return response.json();
}`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-8 mb-4">4. Optional Services</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Seat Selection</li>
          <li>Special Service Requests (SSRs)</li>
          <li>Travel Documents</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">5. Payment and Confirmation</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Check Agency Account Balance</li>
          <li>Process Payment</li>
          <li>Commit Booking</li>
          <li>Verify Booking Status</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">6. Error Handling</h3>
        
        <div className="mt-6">
          <h4 className="text-lg font-medium mb-4">HTTP Error Codes Reference</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    HTTP Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Meaning
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Message Example
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">400</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Bad Request</td>
                  <td className="px-6 py-4 text-sm text-gray-600">"Missing required parameter: email"</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">401</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Unauthorized</td>
                  <td className="px-6 py-4 text-sm text-gray-600">"Invalid API token or session expired"</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">403</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Forbidden</td>
                  <td className="px-6 py-4 text-sm text-gray-600">"You do not have access to this resource"</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">404</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Not Found</td>
                  <td className="px-6 py-4 text-sm text-gray-600">"Resource with ID 12345 not found"</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">409</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Conflict</td>
                  <td className="px-6 py-4 text-sm text-gray-600">"Username already exists"</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">422</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Unprocessable Entity</td>
                  <td className="px-6 py-4 text-sm text-gray-600">"Validation failed for one or more fields"</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">500</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Internal Server Error</td>
                  <td className="px-6 py-4 text-sm text-gray-600">"Unexpected error. Please try again later."</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">503</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Service Unavailable</td>
                  <td className="px-6 py-4 text-sm text-gray-600">"Server is temporarily unavailable. Retry later."</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg mt-6 border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Proper error handling is crucial for maintaining a robust integration. Always check response status codes and implement appropriate error handling mechanisms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;

