/**
 * Email service module for handling support request escalations.
 * 
 * This module provides functionality to send support emails when the FAQ chatbot 
 * cannot adequately answer a user's question. It uses Gmail SMTP for email delivery
 * and Zod for input validation.
 */

import nodemailer from 'nodemailer';
import { z } from 'zod';

// Email configuration
// Support custom SMTP configuration via these env vars (recommended when using your own SMTP):
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (true/false)
// For backward compatibility the project also accepts SENDGRID_USER and SENDGRID_PASS
// (used previously as Gmail/SendGrid credentials).

const supportEmail = process.env.SUPPORT_EMAIL;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
const smtpSecure = (process.env.SMTP_SECURE || '').toLowerCase() === 'true';
const smtpUser = process.env.SMTP_USER || process.env.SENDGRID_USER;
const smtpPass = process.env.SMTP_PASS || process.env.SENDGRID_PASS;

if (!smtpUser || !smtpPass || !supportEmail) {
  throw new Error('Missing email configuration. Please set SMTP_USER, SMTP_PASS, and SUPPORT_EMAIL (or use SENDGRID_USER/SENDGRID_PASS for legacy config).');
}

// Build transport options. If SMTP_HOST is provided, use host/port; otherwise fall back to Gmail service
let transportOptions: any;
if (smtpHost) {
  transportOptions = {
    host: smtpHost,
    port: smtpPort || (smtpSecure ? 465 : 587),
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      // allow self-signed certs when explicitly disabled via env
      rejectUnauthorized: process.env.REDACTED !== 'false',
    },
  };
} else {
  // REDACTED default: use gmail service (was used previously)
  transportOptions = {
    service: 'gmail',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  };
}

const transporter = nodemailer.createTransport(transportOptions);

/**
 * Zod schema for validating support email data.
 * Ensures that:
 * - userEmail is a valid email address
 * - question is not empty
 */
const supportEmailSchema = z.object({
  userEmail: z.string().email(),
  question: z.string().min(1),
});

// TypeScript type derived from the Zod schema
export type SupportEmailData = z.infer<typeof supportEmailSchema>;

/**
 * Sends a support request email when the chatbot cannot answer a question.
 * 
 * @param data - Object containing user's email and question
 * @throws Error if email sending fails or validation fails
 * 
 * Process:
 * 1. Validates input data using Zod schema
 * 2. Formats email content with HTML and plain text versions
 * 3. Sends email using nodemailer
 * 4. Logs success or failure
 */
export async function sendSupportEmail(data: SupportEmailData) {
  try {
    // Validate input data
    const validated = supportEmailSchema.parse(data);
    console.log('Sending support email for:', validated.userEmail);

    // Send email using preconfigured transport
    await transporter.sendMail({
      from: process.env.SUPPORT_EMAIL,
      to: process.env.SUPPORT_EMAIL,
      subject: '[FAQ Escalation]',
      // Plain text version
      text: `User Email: ${validated.userEmail}\nQuestion: ${validated.question}`,
      // HTML version
      html: `
        <h2>FAQ Support Request</h2>
        <p><strong>User Email:</strong> ${validated.userEmail}</p>
        <p><strong>Question:</strong> ${validated.question}</p>
      `,
    });

    console.log('Support email sent successfully');
  } catch (error) {
    console.error('Failed to send support email:', error);
    throw new Error('Failed to send support email');
  }
}

