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

export const FAQSection = () => {
  const faqs = [
    {
      question: "Q1: Infant fares are not returned among other fares in flight availability API response despite adding infants to availability request?",
      answer: (
        <>
          <p>Use BookingQuote API which helps as a price itinerary method. It returns fares including adults, children, and infants. Note that infant is not treated as passenger types in our system, instead it is SSR.</p>
          <p className="mt-2">When calling the request body, set "infantCount": "1" for number of required infant on any booking. Number of infants should be less or equal to number of adult passengers.</p>
        </>
      )
    },
    {
      question: "Q2: How currencies are handled?",
      answer: (
        <>
          <p>By default, you will receive the fares in availability response in origin station's default currency regardless of which currency you pass in the request. All the remaining API call requests (BookingQuote, TripSell, SellSSR, etc) should use the currency specified in the availability API response.</p>
          <p className="mt-2">If you want to display fares for customer in any other currency, use currency conversion API (GET /v1/CurrencyConverter).</p>
        </>
      )
    },
    {
      question: "Q3: The currency returned by availability request (currency of outbound country) is not the same as my agency account credit currency?",
      answer: "Equivalent amount will be deducted (Ex. from your AG account) if you are using any other currencies in the booking."
    },
    {
      question: "Q4: Where can I find baggage allowance for flights?",
      answer: (
        <>
          <p>Using BookingQuote API, baggage allowance can be found in response under the field "REDACTED" which represents allowed baggage. Example: "2PC,30KG" means piece allowance of 30 Kg maximum in each one of the 2 pieces.</p>
          <p className="mt-2">In Jazeera airways, allowed baggage varies according to fare class options (Economy Light (EL), Economy Value (EV) and Economy Extra (EE)). Please refer to the following link for reference and weight allowance of each:</p>
          <a href="https://www.jazeeraairways.com/en-kw/plan/flight-information/fare-options" className="text-blue-600 hover:text-blue-800 mt-2 block">
            View Fare Options →
          </a>
        </>
      )
    },
    {
      question: "Q5: Why booking of some seats fails while it works for another seats in the same journey?",
      answer: (
        <>
          <p>The seatsAssignment API does not succeed if the seat is unavailable (if the node value is not "5" (Open)). It is important to check the "availability" node value in the seat availability response before assigning the seat.</p>
          <p className="mt-2 font-semibold">What does the node value "availability key" in the availability response mean?</p>
          <p className="mt-2">It is a single digit and it represents the availability of the seat. It may have the following values:</p>
          <ul className="list-disc list-inside mt-2">
            <li>0 - Unknown</li>
            <li>1 - Reserved</li>
            <li>2 - Blocked</li>
            <li>3 - REDACTED</li>
            <li>4 - HeldForThisSession</li>
            <li>5 - Open</li>
            <li>6 - Missing</li>
            <li>7 - CheckedIn</li>
            <li>8 - FleetBlocked</li>
            <li>9 - Restricted</li>
            <li>10 - Broken</li>
            <li>11 - ReservedForPnr</li>
            <li>12 - SoftBlocked</li>
            <li>13 - Unavailable</li>
          </ul>
          <p className="mt-2">Booking a seat will not succeed if seats availability value is not 5.</p>
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

