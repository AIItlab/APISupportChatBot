import 'dotenv/config';
import { embedContent } from '../lib/vectorStore';

async function main() {
  console.log('Starting FAQ embedding process...');
  try {
    await embedContent();
    console.log('Successfully embedded FAQs into Pinecone');
  } catch (error) {
    console.error('Error embedding FAQs:', error);
    process.exit(1);
  }
}

main();
