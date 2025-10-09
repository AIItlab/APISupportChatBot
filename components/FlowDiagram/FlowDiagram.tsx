'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  theme: 'default',
  startOnLoad: false,
  securityLevel: 'loose',
  flowchart: {
    curve: 'basis',
    padding: 20,
  }
});

const FlowDiagram: React.FC = () => {
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (diagramRef.current) {
      mermaid.init(undefined, diagramRef.current);
    }
  }, []);

  return (
    <div className="my-6 p-6 bg-white rounded-lg shadow-sm">
      <div ref={diagramRef} className="mermaid">
        {`
        flowchart TD
          A(["🔑 Authentication"]) --> B(["🔍 Get Availability"])
          B --> C(["💰 Booking Quote"])
          C --> D(["✈️ Trip Sell"])
          D --> E(["👥 Passenger Management"])
          E --> F(["🛠️ Optional Services"])
          F --> G(["💳 Payment Processing"])
          G --> H(["✅ Commit Booking"])
          
          style A fill:#e3f2fd,stroke:#1e88e5
          style B fill:#e8f5e9,stroke:#43a047
          style C fill:#fff3e0,stroke:#fb8c00
          style D fill:#f3e5f5,stroke:#8e24aa
          style E fill:#e8eaf6,stroke:#3949ab
          style F fill:#fbe9e7,stroke:#ff5722
          style G fill:#e0f2f1,stroke:#00897b
          style H fill:#e8f5e9,stroke:#2e7d32
          
          linkStyle default stroke:#666,stroke-width:2px
        `}
      </div>
    </div>
  );
};

export default FlowDiagram;
