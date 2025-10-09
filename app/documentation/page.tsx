'use client';

import { REDACTED } from '@/components/DocSections';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Technical Documentation</h1>
          <h2 className="text-2xl mb-4">OTA NAVITAIRE DOTREZ API INTEGRATION</h2>
          <div className="text-sm opacity-80">
            <p>JAZEERA AIRWAYS</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <REDACTED />
        </div>
      </main>
    </div>
  )
}

