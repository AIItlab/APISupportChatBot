/**
 * Enhanced fallback search implementation that searches across all website content
 * Uses comprehensive text matching across FAQs, documentation, and HTML content
 */

import { faqs, FAQ } from './faq';
import { searchAllContent, DocumentContent } from './comprehensiveSearch';

interface SearchResult {
  content: FAQ | DocumentContent;
  score: number;
}

/**
 * Enhanced search that covers all website content when vector search is unavailable
 */
export const fallbackSearch = (query: string): SearchResult[] => {
  console.log('Enhanced fallback search started with query:', query);
  
  try {
    // First, try comprehensive search across all content
    const REDACTED = searchAllContent(query);
    
    if (REDACTED.length > 0) {
      console.log(`Comprehensive search found ${REDACTED.length} results`);
      
      // Convert to SearchResult format and assign scores
      return REDACTED.map((item, index) => ({
        content: item,
        score: Math.max(0.9 - (index * 0.1), 0.1) // Decreasing score based on position
      }));
    }
  } catch (error) {
    console.error('Comprehensive search failed, falling back to basic FAQ search:', error);
  }
  
  // Fallback to basic FAQ search if comprehensive search fails
  console.log('Using basic FAQ search as fallback');
  console.log('Total FAQs available:', faqs.length);
  
  const queryLower = query.toLowerCase();
  const results: SearchResult[] = [];
  
  faqs.forEach((faq, index) => {
    let score = 0;
    const questionLower = faq.question.toLowerCase();
    const answerLower = faq.answer.toLowerCase();
    
    // Exact phrase matches get highest score
    if (questionLower.includes(queryLower)) {
      score += 2.0;
    }
    if (answerLower.includes(queryLower)) {
      score += 1.5;
    }
    
    // Keyword matching
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    queryWords.forEach(word => {
      if (questionLower.includes(word)) score += 0.5;
      if (answerLower.includes(word)) score += 0.3;
    });
    
    // Specific API terms get bonus
    const apiTerms = ['infant', 'booking', 'payment', 'passenger', 'seat', 'availability', 'token', 'error', 'api', 'currency', 'baggage'];
    apiTerms.forEach(term => {
      if (queryLower.includes(term) && (questionLower.includes(term) || answerLower.includes(term))) {
        score += 0.2;
      }
    });
    
    if (score > 0) {
      results.push({ content: faq, score });
      console.log(`FAQ ${index + 1} matched with score ${score.toFixed(2)}: ${faq.question.substring(0, 50)}...`);
    }
  });
  
  // Sort by score and return top 5
  const sortedResults = results.sort((a, b) => b.score - a.score).slice(0, 5);
  console.log('Basic FAQ search results:', sortedResults.length);
  
  return sortedResults;
};

