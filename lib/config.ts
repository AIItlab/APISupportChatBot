/**
 * Shared configuration module
 */

// Load environment variables in non-production environments
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' });
}

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
    index: process.env.PINECONE_INDEX,
  },
  email: {
    sendgridUser: process.env.SENDGRID_USER,
    sendgridPass: process.env.SENDGRID_PASS,
    supportEmail: process.env.SUPPORT_EMAIL,
  },
};
