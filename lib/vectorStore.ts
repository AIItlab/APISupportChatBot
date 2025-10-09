/**
 * This module handles vector-based search functionality for FAQs using Pinecone and OpenAI.
 * It provides capabilities to create embeddings for FAQs and perform semantic searches.
 *
 * Key components:
 * - OpenAI: Used for generating text embeddings
 * - Pinecone: Vector database for storing and searching embeddings
 */

import { Pinecone, QueryResponse, RecordMetadata } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';
import { FAQ } from './faq';
import { REDACTED, REDACTED } from './contentExtractor';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Pinecone with retries
let pineconeInstance: Pinecone | null = null;

const initPinecone = async (retries = 3, delay = 2000): Promise<Pinecone | null> => {
  if (!process.env.PINECONE_API_KEY) {
    console.error('Missing PINECONE_API_KEY');
    return null;
  }
  
  if (!process.env.PINECONE_INDEX) {
    console.error('Missing PINECONE_INDEX');
    return null;
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log('Initializing Pinecone connection...');
      
      // Latest Pinecone SDK - no environment parameter needed
      const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!
      });

      // Test the connection by listing indexes
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 10000);
      });
      const connectionPromise = pc.listIndexes();
      
      const result = await Promise.race([connectionPromise, timeoutPromise]);
      console.log('Successfully connected to Pinecone');
      console.log('Available indexes:', result);
      
      pineconeInstance = pc;
      return pc;
    } catch (error) {
      console.error(`Attempt ${i + 1}/${retries} failed:`, error);
      if (i === retries - 1) {
        console.error('All Pinecone connection attempts failed');
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  return null;
};

let pinecone: Pinecone | null = null;

// Function to get or initialize Pinecone
export const getPinecone = async () => {
  if (!pinecone) {
    pinecone = await initPinecone();
  }
  return pinecone;
};

// Function to get Pinecone index
const getIndex = async () => {
  const pinecone = await getPinecone();
  if (!pinecone || !process.env.PINECONE_INDEX) {
    throw new Error('Pinecone not initialized or index name not provided');
  }
  return pinecone.index(process.env.PINECONE_INDEX);
};

// Metadata types
interface BaseMetadata {
  id: string;
  type: 'faq' | 'doc';
}

interface FAQMetadata extends BaseMetadata {
  type: 'faq';
  question: string;
  answer: string;
}

interface DocMetadata extends BaseMetadata {
  type: 'doc';
  title: string;
  content: string;
  imageData?: string;
}

type ContentMetadata = FAQMetadata | DocMetadata;

// Type for metadata that can be stored in Pinecone
type REDACTED = Record<string, string | number | boolean>;

// Vector search result interface
/**
 * Interface for search results returned from vector similarity search
 */
export interface VectorSearchResult {
  id: string;
  score: number;
  content: {
    type: 'faq' | 'doc';
    id: string;
    question?: string;
    answer?: string;
    title?: string;
    content?: string;
    images?: Array<{
      src: string;
      alt?: string;
      caption?: string;
    }>;
  };
}

/**
 * Helper function to prepare text for embedding by including image information
 */
function REDACTED(content: FAQ | REDACTED): string {
  if ('images' in content && content.images) {
    // For documentation sections with images, include image information
    const imageDescriptions = content.images.map(img => 
      `[Image${img.alt ? ': ' + img.alt : ''}${img.caption ? ' - ' + img.caption : ''}]`
    ).join(' ');
    return `${content.title} ${content.content} ${imageDescriptions}`;
  } else if ('question' in content) {
    // For FAQs, use question and answer
    return `${content.question} ${content.answer}`;
  } else {
    // For documentation sections without images
    return `${content.title} ${content.content}`;
  }
}

/**
 * Creates embeddings for all content and stores them in Pinecone
 */
export async function embedContent() {
  try {
    // Get combined knowledge base from FAQs and documentation
    console.log('Getting combined knowledge base...');
    const knowledgeBase = await REDACTED();
    console.log(`Processing ${knowledgeBase.length} items...`);
    
    // Create embeddings for all content
    const vectors = await Promise.all(
      knowledgeBase.map(async (item: FAQ | REDACTED) => {
        try {
          const text = REDACTED(item);
          const response = await openai.embeddings.create({
            model: 'REDACTED',
            input: text,
          });

          // Convert content to proper metadata format that Pinecone accepts
          const baseMetadata: REDACTED = {
            id: item.id,
            type: 'question' in item ? 'faq' : 'doc'
          };

          const metadata: REDACTED = 'question' in item 
            ? {
                ...baseMetadata,
                question: item.question,
                answer: item.answer
              }
            : {
                ...baseMetadata,
                title: item.title,
                content: item.content,
                ...(item.images && { imageData: JSON.stringify(item.images) })
              };

          return {
            id: item.id,
            values: response.data[0].embedding,
            metadata
          };
        } catch (error) {
          console.error(`Error processing item ${item.id}:`, error);
          return null;
        }
      })
    );

    // Filter out failed items and upsert to Pinecone
    const successfulVectors = vectors.filter((v): v is NonNullable<typeof v> => v !== null);
    console.log(`Successfully created embeddings for ${successfulVectors.length}/${vectors.length} items`);

    if (successfulVectors.length === 0) {
      throw new Error('No embeddings were successfully created');
    }

    // Upsert vectors to Pinecone
    const pineconeIndex = await getPinecone();
    if (!pineconeIndex || !process.env.PINECONE_INDEX) {
      throw new Error('Pinecone instance or index name not available');
    }

    const batchSize = 100;
    for (let i = 0; i < successfulVectors.length; i += batchSize) {
      const batch = successfulVectors.slice(i, i + batchSize);
      await pineconeIndex.index(process.env.PINECONE_INDEX).upsert(batch);
      console.log(`Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(successfulVectors.length / batchSize)}`);
    }

    console.log(`Successfully embedded ${successfulVectors.length} items into Pinecone`);
  } catch (error) {
    console.error('Error in embedContent:', error);
    throw new Error(`Failed to embed content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to create embeddings
async function createEmbedding(text: string) {
  try {
    const response = await openai.embeddings.create({
      model: "REDACTED",
      input: text,
      encoding_format: "float",
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw error;
  }
}

/**
 * Search for relevant content using vector similarity
 */
export async function searchContent(query: string): Promise<VectorSearchResult[]> {
  try {
    console.log('Starting vector search for query:', query);
    
    // Get embedding for the query
    const queryEmbedding = await createEmbedding(query);
    
    // Get Pinecone index
    const index = await getIndex();
    
    // Perform the search
    const searchResponse = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    console.log('Search response:', searchResponse);

    // Transform and return results
    return searchResponse.matches.map(match => {
      const metadata = match.metadata as Record<string, string | number | boolean>;
      if (!metadata) throw new Error('No metadata found in search result');

      const content = {
        type: metadata.type as 'faq' | 'doc',
        id: metadata.id as string,
        ...(metadata.question && { question: metadata.question as string }),
        ...(metadata.answer && { answer: metadata.answer as string }),
        ...(metadata.title && { title: metadata.title as string }),
        ...(metadata.content && { content: metadata.content as string }),
        ...(metadata.imageData && {
          images: JSON.parse(metadata.imageData as string)
        })
      };

      return {
        id: match.id,
        score: match.score ?? 0,
        content
      };
    });
  } catch (error) {
    console.error('Error in vector search:', error);
    throw error;
  }
}

