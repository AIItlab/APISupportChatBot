# Jazeera Airways OTA FAQ Site

A modern, user-friendly documentation site hosting the OTA Navitaire DotRez API integration FAQ with a guard-railed GPT-powered chatbot.

## Features

- Clean, mobile-friendly FAQ documentation site
- Sticky table of contents for easy navigation
- AI-powered chatbot that answers strictly from the FAQ content
- Automatic support ticket creation for unknown questions
- Vector search for accurate FAQ matching
- Built with Next.js 14, TypeScript, and Tailwind CSS

## Requirements

- Node.js 18.x or later
- OpenAI API key
- Pinecone vector database
- SendGrid SMTP credentials

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
# OpenAI API Key for chatbot
OPENAI_API_KEY=

# Pinecone for vector search
PINECONE_API_KEY=
REDACTED=your-pinecone-env
PINECONE_INDEX=jazeera-faq

# SendGrid SMTP settings
SENDGRID_USER=REDACTED
SENDGRID_PASS=

# Support email for escalations
SUPPORT_EMAIL=api-support@jazeeraairways.com
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

1. Push your code to a Git repository

2. Import your repository on [Vercel](https://vercel.com)

3. Add your environment variables in the Vercel dashboard

4. Deploy!

The site will automatically build and deploy on every push to main.

## First-time Setup

After deployment, you need to initialize the vector database by making a PUT request to `/api/embed`. This will create embeddings for all FAQ questions and answers.

```bash
curl -X PUT https://your-domain.com/api/embed
```

## License

Private - Jazeera Airways Internal Use Only

