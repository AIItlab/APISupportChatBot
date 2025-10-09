// Test script to verify email support functionality
const testSupportEmail = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/support', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userEmail: 'test.user@example.com',
        userQuestion: 'How do I make a booking with infant passengers?',
        botResponse: 'To make a booking with infant passengers, you need to specify the passenger type during the booking process. Here are the steps...',
        timestamp: new Date().toISOString()
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS: Support email sent successfully!');
      console.log('Response:', result);
    } else {
      console.log('❌ ERROR: Failed to send support email');
      console.log('Error:', result);
    }
  } catch (error) {
    console.log('❌ NETWORK ERROR:', error.message);
  }
};

testSupportEmail();
