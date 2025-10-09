import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userEmail, question, scenario, satisfied } = await req.json();

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASS,
      },
    });

    let subject, text;

    if (scenario === 'unsatisfactory') {
      subject = 'Unsatisfactory Chatbot Response';
      text = `A user was not satisfied with the chatbot's response.\n\n` +
             `User Email: ${userEmail}\n` +
             `Question: ${question}\n` +
             `Original Response: ${satisfied}\n\n` +
             `Please review and provide a better response to the user.`;
    } else if (scenario === 'not_found') {
      subject = 'Chatbot Unable to Answer Question';
      text = `The chatbot was unable to find an answer to a user's question.\n\n` +
             `User Email: ${userEmail}\n` +
             `Question: ${question}\n\n` +
             `Please provide an answer to this question.`;
    }

    // Send email
    await transporter.sendMail({
      from: process.env.SENDGRID_USER,
      // to: 'spam.faq.test@gmail.com',
      to: 'apisupport@jazeeraairways.com',
      subject,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send support email' },
      { status: 500 }
    );
  }
}
  

