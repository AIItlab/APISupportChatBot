/**
 * FlowDiagram Component
 * 
 * A client-side component that renders a Mermaid.js flowchart diagram
 * showing the API workflow process. The diagram is interactive and
 * visually represents the steps from authentication to booking completion.
 */

'use client';

import React, { useEffect } from 'react';
import mermaid from 'mermaid';

// Configure Mermaid.js global settings
mermaid.initialize({
  theme: 'default',
  startOnLoad: false,  // We'll manually trigger rendering
  securityLevel: 'loose',  // Required for some diagram features
  flowchart: {
    htmlLabels: true,    // Enable HTML in labels
    curve: 'basis',      // Smooth curve style
    padding: 20,         // Diagram padding
  },
});

/**
 * Renders an interactive flowchart showing the API workflow process
 * 
 * Features:
 * - Responsive diagram that adjusts to container width
 * - Custom styling with emojis for better visualization
 * - Interactive nodes that can be clicked (though handlers not implemented)
 * - Automatic rendering on component mount
 * - Error handling for initialization failures
 */
export const FlowDiagram: React.FC = () => {
  // Initialize Mermaid.js when component mounts
  useEffect(() => {
    try {
      mermaid.contentLoaded();
    } catch (error) {
      console.error('Mermaid initialization error:', error);
    }
  }, []);

  return (
    <div className="my-6 p-6 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex justify-center">
        {/* Mermaid diagram container with width constraints */}
        <div className="mermaid w-full max-w-3xl">
          {`
          flowchart TD
            /* Define custom styles for nodes */
            classDef default fill:#f9f9f9,stroke:#666,stroke-width:2px;
            classDef highlight fill:#e3f2fd,stroke:#1e88e5,stroke-width:2px;
            
            /* Define workflow steps with emojis */
            A["🔑 Authentication"]:::highlight --> B["🔍 Get Availability"]
            B --> C["💰 Booking Quote"]
            C --> D["✈️ Trip Sell"]
            D --> E["👥 Passenger Management"]
            E --> F["🛠️ Optional Services"]
            F --> G["💳 Payment Processing"]
            G --> H["✅ Commit Booking"]
            
            /* Add click handlers for future interactivity */
            click A "javascript:void(0)" "Authentication"
            click B "javascript:void(0)" "Get Availability"
            click C "javascript:void(0)" "Booking Quote"
            click D "javascript:void(0)" "Trip Sell"
            click E "javascript:void(0)" "Passenger Management"
            click F "javascript:void(0)" "Optional Services"
            click G "javascript:void(0)" "Payment Processing"
            click H "javascript:void(0)" "Commit Booking"
          `}
        </div>
      </div>
    </div>
  );
};
