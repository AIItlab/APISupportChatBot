/**
 * Script to populate Pinecone vector database with FAQ and documentation embeddings
 * 
 * Usage:
 * 1. Set up environment variables in .env.local
 * 2. Run with: npx tsx scripts/populate-vectors.ts
 */

import { config } from 'dotenv';
import path from 'node:path';
import { embedContent } from '../lib/vectorStore';
import { getCombinedKnowledgeBase } from '../lib/contentExtractor';

// Load environment variables from .env.local with absolute path
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('Loading environment from:', envPath);
const result = config({ path: envPath });

if (result.error) {
  console.error('Error loading .env.local file:', result.error);
  process.exit(1);
}

// Validate environment variables
const requiredEnvVars = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
  PINECONE_INDEX: process.env.PINECONE_INDEX
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    console.error(`Error: Missing ${key} in .env.local`);
    process.exit(1);
  }
}

console.log('Environment variables loaded successfully');
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY?.slice(0, 7) + '...');
console.log('Pinecone Environment:', process.env.PINECONE_ENVIRONMENT);

async function main() {
  try {
    // First, verify we can get the combined knowledge base
    console.log('\nGathering content from FAQs and documentation...');
    const knowledgeBase = await getCombinedKnowledgeBase();
    console.log(`Found ${knowledgeBase.length} total content items:`);
    console.log(`- ${knowledgeBase.filter(item => 'question' in item).length} FAQs`);
    console.log(`- ${knowledgeBase.filter(item => !('question' in item)).length} documentation sections`);

    // Process and embed all content
    console.log('\nStarting embedding process...');
    await embedContent();
    console.log('Successfully embedded all content into Pinecone');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
