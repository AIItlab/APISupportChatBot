import React from 'react';

interface FAQProps {
  question: string;
  answer: React.ReactNode;
}

const FAQ: React.FC<FAQProps> = ({ question, answer }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <h3 className="text-lg font-semibold mb-3">{question}</h3>
    <div className="text-gray-700">{answer}</div>
  </div>
);

export const FAQSection3 = () => {
  const faqs = [
    {
      question: "Q11: What is the difference between User ID and Organization ID and when to use each?",
      answer: (
        <>
          <p>Upon successful registration you will receive an email containing credentials.</p>
          <p className="mt-2">In APIs, User ID is used in the following cases:</p>
          <ol className="list-decimal list-inside mt-2">
            <li>in token value for "username"</li>
            <li>in API requests header as value for AgentID</li>
          </ol>
          <p className="mt-2">Whilst Organization ID is used in cases:</p>
          <ol className="list-decimal list-inside mt-2">
            <li>in token value for "sourceOrganization"</li>
            <li>in payment booking value for "sourceOrganization"</li>
          </ol>
        </>
      )
    },
    {
      question: "Q12: Can I stop sending Jazeera itinerary emails to the contact email address?",
      answer: (
        <>
          <p>Yes, Jazeera sending notification option can be controlled from booking commit request by setting "notifyContacts" - true/false.</p>
          <p className="mt-2">Itinerary sending option is disabled in production and the itinerary emails will be triggered only from TEST environment.</p>
          <p className="mt-2">"notifyContacts" feature will be enabled on production environment upon request from the Agency.</p>
        </>
      )
    },
    {
      question: "Q13: What options are available on member 'type' in contact details of add passenger API?",
      answer: (
        <>
          <p>These are pre-defined values and can be either one of the following: "Home", "Work", "Fax", "Other"</p>
          <p className="mt-2">However, it is required to pass contact email since notifications about changes, cancellation, etc. are sent to the email.</p>
        </>
      )
    },
    {
      question: "Q14: How can I search for business class (BU) flights or filter for product classes?",
      answer: (
        <>
          <p>Availability API returns all available fare classes including business class. However, business class is only available in [KWI-CAI] and [CAI-KWI] flights currently.</p>
          <p className="mt-2">To filter for product classes, add the appropriate parameters to Availability API request body.</p>
        </>
      )
    },
    {
      question: "Q15: How can promotion codes be applied when booking a flight?",
      answer: (
        <>
          <p>Promo code can be applied by passing the "promotionCode" parameter value in the following 3 API requests:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Availability</li>
            <li>BookingQuote</li>
            <li>TripSell</li>
          </ul>
          <p className="mt-2">Promo Code for Test Environment: j9test</p>
          <p className="mt-2">Please note that while applying promo code make sure that you check for the PGENCode (Discount code has to be passed while applying promo code) returning from the GET passengers API response.</p>
        </>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <FAQ key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};
