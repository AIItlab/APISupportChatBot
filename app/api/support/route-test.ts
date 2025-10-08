import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userQuestion, botResponse, timestamp } = await request.json();

    // Validate required fields
    if (!userEmail || !userQuestion) {
      return NextResponse.json(
        { error: 'User email and question are required' },
        { status: 400 }
      );
    }

    // Log the support request details for testing
    console.log('🚨 SUPPORT REQUEST RECEIVED:');
    console.log('📧 User Email:', userEmail);
    console.log('❓ User Question:', userQuestion);
    console.log('🤖 Bot Response:', botResponse);
    console.log('🕒 Timestamp:', timestamp);
    console.log('---');

    // Simulate successful email sending for testing
    console.log('✅ Email would be sent to:', process.env.SUPPORT_EMAIL);
    
    // In production, this would send the actual email
    // For now, we'll just log and return success
    
    return NextResponse.json({ 
      success: true, 
      message: 'Support request logged successfully (test mode)',
      details: {
        userEmail,
        supportEmail: process.env.SUPPORT_EMAIL,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Support request error:', error);
    return NextResponse.json(
      { error: 'Failed to process support request' },
      { status: 500 }
    );
  }
}
