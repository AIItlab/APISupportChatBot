import 'dotenv/config';
import { OpenAI } from 'openai';

async function testOpenAI() {
  console.log('Testing OpenAI connection...');
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set in environment variables');
    process.exit(1);
  }

  console.log('API Key found:', process.env.OPENAI_API_KEY.substring(0, 12) + '...');
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: 'test',
    });
    console.log('Successfully connected to OpenAI API');
    console.log('Embedding dimension:', response.data[0].embedding.length);
  } catch (error: any) {
    console.error('Error connecting to OpenAI:');
    console.error(error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

testOpenAI();
