/**
 * Customer email data module containing past customer questions and answers
 * This allows the chatbot to learn from historical customer support interactions
 */

export interface CustomerEmail {
  id: string;
  date: string;
  customerQuestion: string;
  supportAnswer: string;
  category?: string;
  tags?: string[];
}

/**
 * Array of customer email interactions
 * Add your past customer emails here in this format
 */
export const customerEmails: CustomerEmail[] = [
  // Example entries - replace with your actual email data
  {
    id: 'email_001',
    date: '2024-01-15',
    customerQuestion: 'I need to add an infant to my existing booking. How can I do this?',
    supportAnswer: 'To add an infant to your existing booking, you need to call our customer service team at +965 177 or use the "Manage Booking" section on our website. Please have your booking reference ready. Note that infant fares are separate from adult fares and must be added specifically.',
    category: 'booking_modification',
    tags: ['infant', 'booking', 'modification']
  },
  {
    id: 'email_002',
    date: '2024-01-20',
    customerQuestion: 'What payment methods do you accept for online bookings?',
    supportAnswer: 'We accept multiple payment methods including credit cards (Visa, Mastercard, American Express), debit cards, and for corporate customers, we also accept AG Account and BSP payments. All payments are processed securely through our payment gateway.',
    category: 'payment',
    tags: ['payment', 'methods', 'credit_card', 'bsp']
  },
  {
   id: "email_003",
    date: "2024-02-15",
    customerQuestion: "What is the booking flow sequence?",
    supportAnswer: "1. Get Token\n2. Get Availability\n3. Booking Quote\n4. Trip Sell\n5. Get Passengers\n6. Add Passenger and Contact\n7. Seat Availability (optional)\n8. Seat Assignment (optional)\n9. Get Available SSRs (optional)\n10. Add SSRs\n11. Add Travel Documents\n12. Check Balance\n13. Get Booking Details\n14. Add Payment\n15. Commit Booking\n16. Get Booking Status\n17. Logout",
    category: "booking_flow",
    tags: ["booking", "sequence", "steps", "process"]
  },
    
  
  // Add more email entries here...
];

/**
 * Convert customer emails to DocumentContent format for search integration
 */
export const getCustomerEmailContent = () => {
  return customerEmails.map(email => ({
    id: `customer_${email.id}`,
    title: `Customer Question: ${email.customerQuestion}`,
    content: `Customer Question: ${email.customerQuestion}\n\nSupport Answer: ${email.supportAnswer}\n\nCategory: ${email.category || 'general'}\nDate: ${email.date}`,
    type: 'customer_email' as const,
    metadata: {
      category: email.category,
      tags: email.tags,
      date: email.date
    }
  }));
};

export default customerEmails;
