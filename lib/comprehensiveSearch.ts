/**
 * Comprehensive content extractor that gathers all website content
 * including FAQs, documentation, and HTML content for chatbot analysis
 */

import { FAQ, faqs } from './faq';
import { customerEmails, getCustomerEmailContent } from './emailData';
import { loadAllCustomerEmails } from './emailImport';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { JSDOM } from 'jsdom';

export interface DocumentContent {
  id: string;
  title: string;
  content: string;
  type: 'faq' | 'documentation' | 'html' | 'customer_email';
  url?: string;
  metadata?: any;
}

/**
 * Extract FAQ content from HTML files (both navitaire_faq.html and J9 HTML)
 */
export const extractHTMLFAQs = (): DocumentContent[] => {
  const allHTMLContent: DocumentContent[] = [];
  
  // Extract from navitaire_faq.html
  try {
    let htmlContent = '';
    
    // Try multiple possible locations for the HTML file
    const possiblePaths = [
      path.join(process.cwd(), '../navitaire_faq.html'),
      path.join(process.cwd(), 'navitaire_faq.html'),
      path.join(process.cwd(), '..', '..', 'navitaire_faq.html')
    ];
    
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        htmlContent = fs.readFileSync(filePath, 'utf-8');
        console.log(`Found HTML FAQ file at: ${filePath}`);
        break;
      }
    }
    
    if (htmlContent) {
      const dom = new JSDOM(htmlContent);
      const document = dom.window.document;
      
      const faqSections = document.querySelectorAll('section[id^="q"]');
      
      faqSections.forEach((section, index) => {
        const h2 = section.querySelector('h2');
        const content = section.textContent || '';
        
        if (h2 && content) {
          const question = h2.textContent?.replace(/^Q\d+:\s*/, '') || '';
          const answer = content.replace(h2.textContent || '', '').trim();
          
          allHTMLContent.push({
            id: `html_faq_${index + 1}`,
            title: question,
            content: `Q: ${question}\n\nA: ${answer}`,
            type: 'html',
            url: `#${section.id}`
          });
        }
      });
    }
  } catch (error) {
    console.error('Error extracting navitaire HTML FAQs:', error);
  }
  
  // Extract from J9 HTML file
  try {
    const j9HtmlPaths = [
      path.join(process.cwd(), 'J9_OTA_NVTR_DIGITAL_INTEGRATION_KIT_V2.1-converted.html'),
      path.join(process.cwd(), '../J9_OTA_NVTR_DIGITAL_INTEGRATION_KIT_V2.1-converted.html')
    ];
    
    let j9HtmlContent = '';
    
    for (const filePath of j9HtmlPaths) {
      if (fs.existsSync(filePath)) {
        j9HtmlContent = fs.readFileSync(filePath, 'utf-8');
        console.log(`Found J9 HTML file at: ${filePath}`);
        break;
      }
    }
    
    if (j9HtmlContent) {
      const dom = new JSDOM(j9HtmlContent);
      const document = dom.window.document;
      
      // Extract all headings and their content
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      headings.forEach((heading, index) => {
        const title = heading.textContent?.trim() || '';
        if (title) {
          // Get content after this heading until next heading
          let content = '';
          let nextSibling = heading.nextElementSibling;
          
          while (nextSibling && !nextSibling.tagName.match(/^H[1-6]$/)) {
            content += nextSibling.textContent + '\n';
            nextSibling = nextSibling.nextElementSibling;
          }
          
          if (content.trim()) {
            allHTMLContent.push({
              id: `j9_section_${index + 1}`,
              title: title,
              content: content.trim(),
              type: 'html',
              url: `j9#section_${index + 1}`
            });
          }
        }
      });
      
      // Also extract table content
      const tables = document.querySelectorAll('table');
      tables.forEach((table, index) => {
        const caption = table.querySelector('caption')?.textContent || `Table ${index + 1}`;
        const tableContent = table.textContent || '';
        
        if (tableContent.trim()) {
          allHTMLContent.push({
            id: `j9_table_${index + 1}`,
            title: `${caption} - Table Data`,
            content: tableContent,
            type: 'html',
            url: `j9#table_${index + 1}`
          });
        }
      });
      
      // Extract list content
      const lists = document.querySelectorAll('ul, ol');
      lists.forEach((list, index) => {
        const listContent = list.textContent || '';
        const prevHeading = list.previousElementSibling?.textContent || `List ${index + 1}`;
        
        if (listContent.trim()) {
          allHTMLContent.push({
            id: `j9_list_${index + 1}`,
            title: `${prevHeading} - List Items`,
            content: listContent,
            type: 'html',
            url: `j9#list_${index + 1}`
          });
        }
      });
    }
  } catch (error) {
    console.error('Error extracting J9 HTML content:', error);
  }
  
  console.log(`Extracted ${allHTMLContent.length} items from HTML files`);
  return allHTMLContent;
};

/**
 * Get customer email content for search integration
 */
export const getCustomerEmailsForSearch = (): DocumentContent[] => {
  const allEmails: DocumentContent[] = [];
  
  // Get predefined customer emails
  const predefinedEmails = getCustomerEmailContent();
  allEmails.push(...predefinedEmails);
  
  // Get imported customer emails from files
  try {
    const importedEmails = loadAllCustomerEmails();
    const importedContent = importedEmails.map(email => ({
      id: `imported_${email.id}`,
      title: `Customer Question: ${email.customerQuestion}`,
      content: `Customer Question: ${email.customerQuestion}\n\nSupport Answer: ${email.supportAnswer}\n\nCategory: ${email.category || 'general'}\nDate: ${email.date}`,
      type: 'customer_email' as const,
      metadata: {
        category: email.category,
        tags: email.tags,
        date: email.date
      }
    }));
    allEmails.push(...importedContent);
  } catch (error) {
    console.error('Error loading imported customer emails:', error);
  }
  
  console.log(`Loaded ${allEmails.length} customer email entries`);
  return allEmails;
};
/**
 * Convert structured FAQs to DocumentContent format
 */
export const getStructuredFAQs = (): DocumentContent[] => {
  return faqs.map(faq => ({
    id: `structured_${faq.id}`,
    title: faq.question,
    content: `Q: ${faq.question}\n\nA: ${faq.answer}`,
    type: 'faq'
  }));
};

/**
 * Extract documentation content from the website
 */
export const getDocumentationContent = (): DocumentContent[] => {
  const docs: DocumentContent[] = [
    {
      id: 'api_overview',
      title: 'Jazeera Airways API Overview',
      content: `The Jazeera Airways API provides comprehensive access to flight booking, passenger management, and travel services. 

Key Features:
• Flight search and availability
• Booking creation and management
• Passenger information handling
• Payment processing
• Special service requests (SSRs)
• Seat selection and management
• Travel document handling

The API uses RESTful endpoints with JSON request/response format and requires proper authentication for all operations.`,
      type: 'documentation'
    },
    {
      id: 'authentication_guide',
      title: 'Authentication Guide',
      content: `Authentication Methods:

1. **API Key Authentication (Recommended)**
   - Include API key in X-Api-Key header
   - Obtain API key from developer portal
   - More secure and easier to manage

2. **Basic Authentication**
   - Base64 encode username:password
   - Include in Authorization header
   - Format: "Basic <encoded_credentials>"

3. **Session Management**
   - Sessions expire after 15 minutes of inactivity
   - Refresh sessions before expiration
   - Store session tokens securely
   - Handle session expiration gracefully

Security Best Practices:
• Never expose API keys in client-side code
• Use HTTPS for all API calls
• Implement proper error handling
• Monitor API usage and logs`,
      type: 'documentation'
    },
    {
      id: 'booking_workflow',
      title: 'Booking Workflow',
      content: `Complete Booking Process:

1. **Search Flights**
   - Use Availability API
   - Specify origin, destination, dates
   - Include passenger counts
   - Apply filters as needed

2. **Create Booking**
   - Use CreateBooking endpoint
   - Include passenger details
   - Add flight selections
   - Specify contact information

3. **Add Services**
   - Seat selection
   - Special service requests (SSRs)
   - Extra baggage
   - Meal preferences

4. **Process Payment**
   - Validate payment information
   - Submit payment details
   - Handle payment responses
   - Confirm payment status

5. **Finalize Booking**
   - Commit the booking
   - Receive confirmation
   - Send confirmation to passenger
   - Issue tickets if applicable

Error Handling:
• Check response codes
• Handle booking failures gracefully
• Implement retry logic for temporary failures
• Provide clear error messages to users`,
      type: 'documentation'
    },
    {
      id: 'common_endpoints',
      title: 'Common API Endpoints',
      content: `Essential API Endpoints:

**Authentication:**
• POST /auth/login - Authenticate and get session token
• POST /auth/refresh - Refresh session token
• POST /auth/logout - End session

**Flight Search:**
• GET /flights/availability - Search available flights
• GET /flights/schedule - Get flight schedules
• GET /flights/routes - Get available routes

**Booking Management:**
• POST /bookings - Create new booking
• GET /bookings/{id} - Retrieve booking details
• PUT /bookings/{id} - Update booking
• DELETE /bookings/{id} - Cancel booking

**Passenger Services:**
• POST /passengers - Add passenger to booking
• PUT /passengers/{id} - Update passenger details
• POST /passengers/{id}/documents - Add travel documents

**Payment Processing:**
• POST /payments - Process payment
• GET /payments/{id} - Get payment status
• POST /payments/refund - Process refund

**Special Services:**
• GET /ssr/available - Get available SSRs
• POST /ssr/add - Add SSR to booking
• GET /seats/availability - Check seat availability
• POST /seats/select - Select seats`,
      type: 'documentation'
    }
  ];

  return docs;
};

/**
 * Get all content from the website for chatbot analysis
 */
export const getAllWebsiteContent = (): DocumentContent[] => {
  console.log('Gathering all website content...');
  
  const structuredFAQs = getStructuredFAQs();
  const htmlFAQs = extractHTMLFAQs();
  const documentation = getDocumentationContent();
  const customerEmails = getCustomerEmailsForSearch();
  
  const allContent = [
    ...structuredFAQs,
    ...htmlFAQs,
    ...documentation,
    ...customerEmails
  ];
  
  // Remove duplicates based on similar content
  const uniqueContent = allContent.filter((item, index, self) => {
    return index === self.findIndex(other => 
      other.title.toLowerCase() === item.title.toLowerCase() ||
      other.content.substring(0, 100) === item.content.substring(0, 100)
    );
  });
  
  console.log(`Total content items: ${uniqueContent.length}`);
  console.log(`- Structured FAQs: ${structuredFAQs.length}`);
  console.log(`- HTML FAQs: ${htmlFAQs.length}`);
  console.log(`- Documentation: ${documentation.length}`);
  console.log(`- Customer Emails: ${customerEmails.length}`);
  
  return uniqueContent;
};

/**
 * Enhanced search function that searches across all website content
 */
export const searchAllContent = (query: string): DocumentContent[] => {
  const allContent = getAllWebsiteContent();
  const queryLower = query.toLowerCase();
  const results: { content: DocumentContent; score: number }[] = [];
  
  allContent.forEach((item) => {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const contentLower = item.content.toLowerCase();
    
    // Exact phrase matches get highest score
    if (titleLower.includes(queryLower)) {
      score += 3.0;
    }
    if (contentLower.includes(queryLower)) {
      score += 2.0;
    }
    
    // Keyword matching
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    queryWords.forEach(word => {
      if (titleLower.includes(word)) score += 1.0;
      if (contentLower.includes(word)) score += 0.5;
    });
    
    // API-specific terms get bonus
    const apiTerms = [
      'api', 'booking', 'payment', 'passenger', 'seat', 'availability', 'token', 'error',
      'authentication', 'session', 'endpoint', 'request', 'response', 'ssr', 'infant',
      'currency', 'baggage', 'flight', 'travel', 'document', 'refund', 'cancel'
    ];
    
    apiTerms.forEach(term => {
      if (queryLower.includes(term) && (titleLower.includes(term) || contentLower.includes(term))) {
        score += 0.3;
      }
    });
    
    // Boost score for documentation type based on query
    if (query.includes('how') || query.includes('guide') || query.includes('process')) {
      if (item.type === 'documentation') {
        score += 0.5;
      }
    }
    
    if (score > 0) {
      results.push({ content: item, score });
    }
  });
  
  // Sort by score and return top 10
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(result => result.content);
};

export default getAllWebsiteContent;
