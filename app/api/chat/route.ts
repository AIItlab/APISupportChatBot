import { OpenAI } from 'openai';
import { searchContent } from '@/lib/vectorStore';
import { fallbackSearch } from '@/lib/fallbackSearch';
import { sendSupportEmail } from '@/lib/email';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const requestSchema = z.object({
  prompt: z.string().min(1),
  userEmail: z.string(),
});

// Using default Node.js runtime for Nodemailer support
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Log request details
    console.log(`[${new Date().toISOString()}] Chat request received`);
    
    // Parse and validate request body first
    let body;
    try {
      body = requestSchema.parse(await req.json());
    } catch (error) {
      console.error('Invalid request body:', error);
      return Response.json({ error: 'Invalid request format' }, { status: 400 });
    }

    console.log('Processing query:', body.prompt);
    
    // Handle greetings and general conversation
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    const helpRequests = ['help', 'what can you do', 'what do you know', 'how can you help'];
    const queryLower = body.prompt.toLowerCase().trim();
    
    // Check for greetings
    if (greetings.some(greeting => queryLower === greeting || queryLower.startsWith(greeting))) {
      return Response.json({
        text: "Hello! 👋 I'm here to help you with Jazeera Airways API documentation.\n\n**I can answer questions about:**\n\n• Flight booking and availability\n• Payment processing\n• Passenger management\n• SSR (Special Service Requests)\n• Error handling\n• API authentication\n• Seat selection\n• Baggage policies\n\nWhat would you like to know about the Jazeera Airways API?",
        escalated: false
      });
    }
    
    // Check for help requests
    if (helpRequests.some(help => queryLower.includes(help))) {
      return Response.json({
        text: "I'm your Jazeera Airways API assistant! 🛫\n\n**📋 Common Topics:**\n• How to add infants to bookings\n• Payment options (AG Account, BSP)\n• API authentication and tokens\n• Booking confirmation and status\n• Error codes and troubleshooting\n• Currency handling\n• Seat selection and availability\n\n**💡 Just ask me anything like:**\n• \"How do I add infants to a booking?\"\n• \"What payment options are available?\"\n• \"Why am I getting booking errors?\"\n\nWhat specific API topic can I help you with?",
        escalated: false
      });
    }
    
    // Search for relevant content
    let results = [];
    try {
      console.log('Initiating content search...');
      results = await searchContent(body.prompt);
      console.log('Search completed successfully. Results count:', results.length);
    } catch (error) {
      console.error('Vector search failed, using fallback search:', error);
      // Use fallback search when vector search fails
      try {
        const fallbackResults = fallbackSearch(body.prompt);
        results = fallbackResults.map(result => ({
          content: result.content,
          score: result.score
        }));
        console.log('Fallback search completed. Results count:', results.length);
      } catch (fallbackError) {
        console.error('Fallback search also failed:', fallbackError);
        return Response.json({ 
          text: "I'm having trouble accessing my knowledge base. Please try again in a moment.",
          escalated: false 
        });
      }
    }

    // If no results found, give a helpful response
    if (!results || results.length === 0) {
      console.log('No results found');
      
      // Check if it's a valid API-related query that just didn't match
      const apiKeywords = ['api', 'booking', 'payment', 'passenger', 'flight', 'availability', 'token', 'error', 'authentication', 'seat', 'baggage', 'currency', 'infant', 'ssr'];
      const containsApiTerms = apiKeywords.some(keyword => queryLower.includes(keyword));
      
      if (containsApiTerms) {
        return Response.json({ 
          text: "I couldn't find specific information about that in our FAQ.\n\n**Here are some related topics I can help with:**\n\n• Flight booking and availability\n• Payment processing (AG Account, BSP)\n• Adding infants to bookings\n• API authentication and tokens\n• Error handling and troubleshooting\n\nCould you rephrase your question or ask about one of these topics?",
          escalated: false 
        });
      } else {
        return Response.json({ 
          text: "I'm specialized in **Jazeera Airways API documentation**. I can help you with booking, payments, authentication, error handling, and other API-related questions.\n\nWhat would you like to know about the Jazeera Airways API?",
          escalated: false 
        });
      }
    }

    // Get top matches and format them for OpenAI
    const topMatches = results.slice(0, 5);
    const context = topMatches.map((match, index) => {
      const content = match.content;
      
      // Handle both FAQ and DocumentContent formats
      if ('question' in content && 'answer' in content) {
        // Traditional FAQ format
        return `
Source ${index + 1} (Confidence: ${Math.round(match.score * 100)}%):
Q: ${content.question}
A: ${content.answer}`;
      } else if ('title' in content && 'content' in content) {
        // DocumentContent format
        return `
Source ${index + 1} (Confidence: ${Math.round(match.score * 100)}%):
Title: ${content.title}
Type: ${content.type || 'documentation'}
Content: ${content.content}`;
      } else {
        // Fallback format
        return `
Source ${index + 1} (Confidence: ${Math.round(match.score * 100)}%):
Content: ${JSON.stringify(content).substring(0, 500)}...`;
      }
    }).join('\n\n');

    // Generate response using OpenAI
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a friendly and helpful AI assistant specializing in Jazeera Airways API documentation and services. 

Your role:
- Answer questions using ONLY the information provided in the context below
- You have access to comprehensive documentation including FAQs, API guides, booking workflows, and troubleshooting information
- Be conversational and helpful while staying professional
- Use clear, easy-to-understand language with proper formatting
- Structure your responses with headers, bullet points, and numbered lists when appropriate
- Include practical examples when available in the context
- If you see code snippets, API parameters, or technical details, format them clearly using quotes
- If the context doesn't fully answer the question, acknowledge this and suggest related topics from the available documentation

Response formatting guidelines:
- Use **bold text** for important headers or sections
- Use bullet points (•) for lists of features or options  
- Use numbered lists (1., 2., 3.) for step-by-step instructions
- Put API parameters, values, and code in "quotes"
- Keep responses well-structured and scannable
- Start with a helpful, direct answer to the question
- Reference multiple sources when they provide complementary information

Available content types in context:
- FAQ entries with specific questions and answers
- API documentation and guides
- Booking workflow documentation
- Authentication and security information
- Error handling and troubleshooting guides

Here is the relevant documentation to use:

${context}`
          },
          {
            role: 'user',
            content: body.prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return Response.json({
        text: completion.choices[0].message.content,
        escalated: false,
      });
    } catch (error) {
      console.error('OpenAI error:', error);
      return Response.json({ 
        text: "I'm having trouble generating a response right now. Please try again in a moment.",
        escalated: false 
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return Response.json({ 
      text: "Sorry, I encountered an unexpected error. Please try again.",
      escalated: false 
    });
  }
}
