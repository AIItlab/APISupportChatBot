/**
 * Content extractor module for processing documentation and FAQ content
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { FAQ } from './faq';

export interface DocumentationSection {
  id: string;
  title: string;
  content: string;
  images?: Array<{
    src: string;
    alt?: string;
    caption?: string;
  }>;
}

// Documentation HTML content (moved from file for Edge runtime compatibility)
const documentationHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Al Jazeera Documentation</title>
</head>
<body>
    <h1>API Documentation</h1>
    <p>Welcome to the Al Jazeera API documentation. This guide will help you understand and integrate with our services.</p>

    <h2>Authentication</h2>
    <p>All API requests require authentication using an API key. You can obtain your API key from the developer portal.</p>
    <img src="/images/auth-flow.png" alt="Authentication flow diagram" />
    <figcaption>Authentication flow diagram showing the token request process</figcaption>

    <h2>Endpoints</h2>
    <p>The following endpoints are available in our API:</p>
    <h3>News Articles</h3>
    <p>Access the latest news articles and content.</p>
    <img src="/images/news-api.png" alt="News API endpoints diagram" />
    <figcaption>News API structure and available endpoints</figcaption>

    <h3>Live Streams</h3>
    <p>Access live streaming content and broadcasts.</p>
    <img src="/images/streaming.png" alt="Streaming architecture diagram" />
    <figcaption>Live streaming architecture and components</figcaption>
</body>
</html>`;

/**
 * Extracts sections from the documentation HTML
 */
export async function extractDocumentationContent(): Promise<DocumentationSection[]> {
  try {
    const dom = new JSDOM(documentationHtml);
    const document = dom.window.document;

    const sections: DocumentationSection[] = [];
    let sectionId = 1;

    // Extract main headings and their content
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach((heading: Element) => {
      let content = '';
      const images: DocumentationSection['images'] = [];
      let node = heading.nextElementSibling;

      // Collect all content until the next heading
      while (node && !['H1', 'H2', 'H3'].includes(node.tagName)) {
        if (node.tagName === 'IMG') {
          const img = node as HTMLImageElement;
          images.push({
            src: img.src,
            alt: img.alt || undefined,
            caption: img.nextElementSibling?.tagName === 'FIGCAPTION' 
              ? img.nextElementSibling.textContent?.trim() 
              : undefined
          });
          // Skip the caption element if it exists
          if (img.nextElementSibling?.tagName === 'FIGCAPTION') {
            node = img.nextElementSibling.nextElementSibling;
            continue;
          }
        } else {
          content += node.textContent + ' ';
        }
        node = node.nextElementSibling;
      }

      if (content.trim() || images.length > 0) {
        sections.push({
          id: `doc${sectionId++}`,
          title: heading.textContent?.trim() || '',
          content: content.trim(),
          ...(images.length > 0 && { images })
        });
      }
    });

    return sections;
  } catch (error) {
    console.error('Error extracting documentation content:', error);
    return [];
  }
}

/**
 * Get combined knowledge base from FAQs, documentation, and HTML content
 */
export async function getCombinedKnowledgeBase(): Promise<(FAQ | DocumentationSection)[]> {
  // Import FAQs from the faq module
  const { faqs } = await import('./faq');

  // Get documentation content
  const documentation = await extractDocumentationContent();
  
  // Get HTML content from comprehensive search
  const { getAllWebsiteContent } = await import('./comprehensiveSearch');
  const htmlContent = getAllWebsiteContent();
  
  // Convert DocumentContent to DocumentationSection format
  const convertedHtmlContent: DocumentationSection[] = htmlContent.map(item => ({
    id: item.id,
    title: item.title,
    content: item.content
  }));

  // Load sample-emails.json file
const emailsPath = path.resolve(process.cwd(), 'customer-emails/sample-emails.json');
const sampleEmailsRaw = fs.readFileSync(emailsPath, 'utf-8');
const sampleEmails = JSON.parse(sampleEmailsRaw);

// Convert to FAQ format
const emailFaqs: FAQ[] = sampleEmails.map((item: any, index: number) => ({
  id: item.id || `email_${index + 1}`,
  question: item.customerQuestion,
  answer: item.supportAnswer
}));


  console.log(`Combined knowledge base: ${faqs.length} FAQs + emailFaqs${emailFaqs.length} + ${documentation.length} docs + ${convertedHtmlContent.length} HTML items`);

  return [...faqs, ...emailFaqs, ...documentation, ...convertedHtmlContent];
}
