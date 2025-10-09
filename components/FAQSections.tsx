'use client';

import React from 'react';

// Define the structure of a FAQ item
type FAQ = {
  id: string;              
  question: string;        
  answer: React.ReactNode; 
  category: 'basic' | 'advanced';  
  subcategory: string;     
};

// Individual FAQ item component
export const FAQItem: React.FC<FAQ> = ({ question, answer }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-200 transition-colors">
    <h3 className="text-lg font-semibold mb-3 text-gray-800">{question}</h3>
    <div className="text-gray-700 prose prose-sm max-w-none">{answer}</div>
  </div>
);

// FAQSection component to display filtered FAQs
export const FAQSection: React.FC<{ category: 'basic' | 'advanced' }> = ({ category }) => {
  const filteredFAQs = FAQList.filter(faq => faq.category === category);
  return (
    <div className="space-y-6">
      {filteredFAQs.map(faq => (
        <FAQItem key={faq.id} {...faq} />
      ))}
    </div>
  );
};

// Database of all FAQs
export const FAQList: FAQ[] = [
  // Basic FAQs - General
  {
    id: 'basic-general-1',
    category: 'basic',
    subcategory: 'General',
    question: "How are infant fares handled in the API?",
    answer: (
      <>
        <p>Use BookingQuote API which helps as a price itinerary method. It returns fares including adults, children, and infants. Note that infant is not treated as passenger types in our system, instead it is SSR.</p>
        <p className="mt-2">When calling the request body, set "infantCount": "1" for number of required infant on any booking. Number of infants should be less or equal to number of adult passengers.</p>
      </>
    )
  },
  {
    id: 'basic-general-2',
    category: 'basic',
    subcategory: 'General',
    question: "How are currencies handled in the API?",
    answer: (
      <>
        <p>By default, you will receive the fares in availability response in origin station's default currency regardless of which currency you pass in the request. All the remaining API call requests should use the currency specified in the availability API response.</p>
        <p className="mt-2">If you want to display fares for customer in any other currency, use currency conversion API (GET /v1/CurrencyConverter).</p>
      </>
    )
  },
  {
    id: 'basic-general-3',
    category: 'basic',
    subcategory: 'General',
    question: "What options are available for passenger contact types?",
    answer: (
      <>
        <p>These are pre-defined values and can be either one of the following: "Home", "Work", "Fax", "Other"</p>
        <p className="mt-2">However, it is required to pass contact email since notifications about changes, cancellation, etc. are sent to the email.</p>
      </>
    )
  },

  // Basic FAQs - Booking
  {
    id: 'basic-booking-1',
    category: 'basic',
    subcategory: 'Booking',
    question: "How do I handle booking timeouts?",
    answer: (
      <>
        <p>Booking timeouts are handled through two mechanisms:</p>
        <ul className="list-disc pl-4 mt-2">
          <li>Session timeout: 20 minutes from initial availability search</li>
          <li>Payment timeout: 15 minutes from booking creation</li>
        </ul>
        <p className="mt-2">Implement retry logic with exponential backoff for better reliability.</p>
      </>
    )
  },
  {
    id: 'basic-booking-2',
    category: 'basic',
    subcategory: 'Booking',
    question: "Why does booking fail for some seats on the same journey?",
    answer: (
      <>
        <p>The seatsAssignment API does not succeed if the seat is unavailable (if the node value is not "5" (Open)). It is important to check the "availability" node value in the seat availability response before assigning the seat.</p>
        <p className="mt-2">The node value represents the availability of the seat and may have the following values:</p>
        <ul className="list-disc list-inside mt-2">
          <li>0 - Unknown</li>
          <li>1 - Reserved</li>
          <li>2 - Blocked</li>
          <li>3 - HeldForAnotherSession</li>
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
      </>
    )
  },
  {
    id: 'basic-booking-3',
    category: 'basic',
    subcategory: 'Booking',
    question: "How can I add travel documents to a reservation?",
    answer: "Add passport documents to booking using Add Document API to passenger. Document type should be set to P for passport."
  },
  {
    id: 'basic-booking-4',
    category: 'basic',
    subcategory: 'Booking',
    question: "How can I check whether the booking is confirmed?",
    answer: (
      <>
        <p>Check "balanceDue" parameter in the CommitBooking response to check if the booking is confirmed or not. Balance due amount will be zero for confirmed bookings.</p>
        <p className="mt-2">The response booking details status should be "Confirmed" and paid is "true" too.</p>
      </>
    )
  },

  // Basic FAQs - Authentication
  {
    id: 'basic-auth-1',
    category: 'basic',
    subcategory: 'Authentication',
    question: "How do I refresh my API token?",
    answer: (
      <>
        <p>To refresh your API token:</p>
        <ol className="list-decimal pl-4 mt-2">
          <li>Call the /v1/token/refresh endpoint before token expiration</li>
          <li>Include your current valid token in the Authorization header</li>
          <li>Store the new token securely</li>
          <li>Use the new token for subsequent requests</li>
        </ol>
        <p className="mt-2">Implement token refresh 5 minutes before expiration for smooth operation.</p>
      </>
    )
  },
  {
    id: 'basic-auth-2',
    category: 'basic',
    subcategory: 'Authentication',
    question: "What should I do if my token expires?",
    answer: (
      <>
        <p>If your token expires:</p>
        <ol className="list-decimal pl-4 mt-2">
          <li>Request a new token using your API credentials</li>
          <li>Re-authenticate using the new token</li>
          <li>Retry the failed request</li>
        </ol>
        <p className="mt-2">Implement proper error handling to detect 401 Unauthorized responses and handle token expiration gracefully.</p>
      </>
    )
  },

  // Basic FAQs - Rate Limiting
  {
    id: 'basic-rate-1',
    category: 'basic',
    subcategory: 'Rate Limiting',
    question: "What happens when I exceed the rate limit?",
    answer: (
      <>
        <p>When you exceed the rate limit:</p>
        <ul className="list-disc pl-4 mt-2">
          <li>You'll receive a 429 Too Many Requests response</li>
          <li>The response includes X-RateLimit-Reset header</li>
          <li>Wait for the specified time before retrying</li>
        </ul>
        <p className="mt-2">Implement exponential backoff in your retry logic to handle rate limits gracefully.</p>
      </>
    )
  },

  // Advanced FAQs - Technical
  {
    id: 'advanced-tech-1',
    category: 'advanced',
    subcategory: 'Technical',
    question: "How do I implement webhook notifications?",
    answer: (
      <>
        <p>To implement webhook notifications:</p>
        <ol className="list-decimal pl-4 mt-2">
          <li>Register your webhook URL in the developer portal</li>
          <li>Implement an endpoint to receive POST requests</li>
          <li>Verify webhook signatures using your secret key</li>
          <li>Respond with 200 OK to acknowledge receipt</li>
        </ol>
        <p className="mt-2">See the Webhooks section in the documentation for detailed implementation guides.</p>
      </>
    )
  },
  {
    id: 'advanced-tech-2',
    category: 'advanced',
    subcategory: 'Technical',
    question: "How to reset API user password?",
    answer: (
      <>
        <p>To reset an API user password, follow these steps:</p>
        <ol className="list-decimal ml-5 mt-2">
          <li>Log in to your Jazeera Airways API portal account</li>
          <li>Navigate to the Account Settings section</li>
          <li>Click on "Reset Password"</li>
          <li>Follow the instructions sent to your registered email</li>
        </ol>
        <p className="mt-2">For more details, visit <a href="https://api.jazeeraairways.com/docs/authentication#password-reset" className="text-blue-600 hover:text-blue-800">Password Reset Documentation</a>.</p>
      </>
    )
  },

  // Advanced FAQs - Integration
  {
    id: 'advanced-integration-1',
    category: 'advanced',
    subcategory: 'Integration',
    question: "Why do some SSRs appear in one segment but not in others?",
    answer: (
      <>
        <p>Some SSRs are categorized under segment SSRs or leg SSRs, so some SSRs may not be available in some segments. When making connected flights, it is important to check availability of SSRs for segments.</p>
        <p className="mt-2">For example, if we have (JED-KWI & KWI-LHE) journey, add TSML (a leg SSR meal) for both if passenger optionally opted meals for the full journey (JED-LHE). In some cases, it is a must to add same SSRs (Ex. Extra baggage XB10) for both segments of the connected flights.</p>
      </>
    )
  },
  {
    id: 'advanced-integration-2',
    category: 'advanced',
    subcategory: 'Integration',
    question: "Can my agency continue to use the XML APIs?",
    answer: (
      <>
        <p>XML APIs are old. Thus, OTAs face the following challenges:</p>
        <ol className="list-decimal list-inside mt-2">
          <li>Slow response speed and non-MVC</li>
          <li>Limited support - Navitaire will not continue to provide support for a very long time as they have already upgraded to JSON DotRez API</li>
          <li>Ancillaries are a completely separate integration</li>
        </ol>
        <p className="mt-2">And many other problems. Therefore, it is highly recommended to use JSON APIs.</p>
      </>
    )
  },
  {
    id: 'advanced-integration-3',
    category: 'advanced',
    subcategory: 'Integration',
    question: "What is token expiry / idle time?",
    answer: "Token idle timeout is 15 minutes. That is, the token will expire if idle time between each two consecutive API calls is greater than or equal to 15 minutes."
  },
  {
    id: 'advanced-integration-4',
    category: 'advanced',
    subcategory: 'Integration',
    question: "I am getting the error message 'nsk-server:DuplicateLeg, Segment already booked'. How can I solve it?",
    answer: (
      <>
        <p>"JourneyKey" and "AvailabilityKey" should be added in request body. In case of roundtrips, another pair of the previous keys is added but for the return flight. This error returns in API response if the pairs of "JourneyKey" and "AvailabilityKey" are duplicate with the same values.</p>
      </>
    )
  },

  // Advanced FAQs - Booking
  {
    id: 'advanced-booking-1',
    category: 'advanced',
    subcategory: 'Booking',
    question: "Is it possible to add SSRs or assign a seat after paying and committing the booking?",
    answer: (
      <>
        <p>Yes, it is. Generally it is better to add SSRs, assign seats or add any charged service before committing the booking. Still, if addition is possible, you need to pay the difference using addPaymentToBooking API. Then commit the booking using (PUT) CommitBooking API.</p>
      </>
    )
  },
  {
    id: 'advanced-booking-2',
    category: 'advanced',
    subcategory: 'Booking',
    question: "Is it possible to cancel a booking via APIs?",
    answer: (
      <>
        <p>Booking cancelation is not possible via any APIs. For this, you can contact Jazeera Airways call center or via logging-in to your Jazeera airways portal account.</p>
        <p className="mt-2">Also, some fare classes are not refundable. For more information, refer to fare class options and rules: <a href="https://www.jazeeraairways.com/en-kw/plan/flight-information/fare-options" className="text-blue-600 hover:text-blue-800">Fare Options</a></p>
      </>
    )
  },
  {
    id: 'advanced-booking-3',
    category: 'advanced',
    subcategory: 'Booking',
    question: "How can promotion codes be applied when booking a flight?",
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
  },

  // Advanced FAQs - Error Handling
  {
    id: 'advanced-error-1',
    category: 'advanced',
    subcategory: 'Error Handling',
    question: "How should I handle network timeouts?",
    answer: (
      <>
        <p>For network timeouts:</p>
        <ol className="list-decimal pl-4 mt-2">
          <li>Implement request timeouts (recommended: 30 seconds)</li>
          <li>Use exponential backoff for retries</li>
          <li>Maximum 3 retry attempts</li>
          <li>Log failed attempts for monitoring</li>
        </ol>
        <p className="mt-2">For critical operations, implement circuit breakers to prevent cascade failures.</p>
      </>
    )
  },
  {
    id: 'advanced-error-2',
    category: 'advanced',
    subcategory: 'Error Handling',
    question: "How do I handle booking synchronization errors?",
    answer: (
      <>
        <p>For booking sync errors:</p>
        <ol className="list-decimal pl-4 mt-2">
          <li>Verify booking status using GET /v1/booking/{'{pnr}'}</li>
          <li>Compare local and remote booking states</li>
          <li>Implement reconciliation logic</li>
          <li>Use webhook notifications for real-time updates</li>
        </ol>
        <p className="mt-2">Always maintain an audit log of booking state changes.</p>
      </>
    )
  },

  // Advanced FAQs - Performance
  {
    id: 'advanced-perf-1',
    category: 'advanced',
    subcategory: 'Performance',
    question: "What's the recommended caching strategy?",
    answer: (
      <>
        <p>Recommended caching strategy:</p>
        <ul className="list-disc pl-4 mt-2">
          <li>Cache static data (airports, routes) for 24 hours</li>
          <li>Cache availability results for 5 minutes</li>
          <li>Use ETags for validation caching</li>
          <li>Implement stale-while-revalidate for better performance</li>
        </ul>
        <p className="mt-2">Always respect Cache-Control headers in API responses.</p>
      </>
    )
  },

  // Advanced FAQs - Security
  {
    id: 'advanced-security-1',
    category: 'advanced',
    subcategory: 'Security',
    question: "How should I handle sensitive passenger data?",
    answer: (
      <>
        <p>For sensitive passenger data:</p>
        <ul className="list-disc pl-4 mt-2">
          <li>Use field-level encryption for PII</li>
          <li>Implement data masking in logs</li>
          <li>Store only required data</li>
          <li>Follow GDPR/CCPA compliance guidelines</li>
        </ul>
        <p className="mt-2">Refer to our security best practices guide for detailed implementation.</p>
      </>
    )
  },
  {
    id: 'advanced-auth-1',
    category: 'advanced',
    subcategory: 'Authentication',
    question: "How to reset API user password?",
    answer: (
      <>
        <p>To reset an API user password, follow these steps:</p>
        <ol className="list-decimal ml-5 mt-2">
          <li>Log in to your Jazeera Airways API portal account</li>
          <li>Navigate to the Account Settings section</li>
          <li>Click on "Reset Password"</li>
          <li>Follow the instructions sent to your registered email</li>
        </ol>
        <p className="mt-2">For more details, visit <a href="https://api.jazeeraairways.com/docs/authentication#password-reset" className="text-blue-600 hover:text-blue-800">Password Reset Documentation</a>.</p>
      </>
    )
  },

  // Basic FAQs - Authentication
  {
    id: 'basic-auth-1',
    category: 'basic',
    subcategory: 'Authentication',
    question: "How do I refresh my API token?",
    answer: (
      <>
        <p>To refresh your API token:</p>
        <ol className="list-decimal pl-4 mt-2">
          <li>Call the /v1/token/refresh endpoint before token expiration</li>
          <li>Include your current valid token in the Authorization header</li>
          <li>Store the new token securely</li>
          <li>Use the new token for subsequent requests</li>
        </ol>
        <p className="mt-2">Implement token refresh 5 minutes before expiration for smooth operation.</p>
      </>
    )
  },
  {
    id: 'basic-auth-2',
    category: 'basic',
    subcategory: 'Authentication',
    question: "What should I do if my token expires?",
    answer: (
      <>
        <p>If your token expires:</p>
        <ol className="list-decimal pl-4 mt-2">
          <li>Request a new token using your API credentials</li>
          <li>Re-authenticate using the new token</li>
          <li>Retry the failed request</li>
        </ol>
        <p className="mt-2">Implement proper error handling to detect 401 Unauthorized responses and handle token expiration gracefully.</p>
      </>
    )
  },

  // Basic FAQs - Rate Limiting
  {
    id: 'basic-rate-1',
    category: 'basic',
    subcategory: 'Rate Limiting',
    question: "What happens when I exceed the rate limit?",
    answer: (
      <>
        <p>When you exceed the rate limit:</p>
        <ul className="list-disc pl-4 mt-2">
          <li>You'll receive a 429 Too Many Requests response</li>
          <li>The response includes X-RateLimit-Reset header</li>
          <li>Wait for the specified time before retrying</li>
        </ul>
        <p className="mt-2">Implement exponential backoff in your retry logic to handle rate limits gracefully.</p>
      </>
    )
  },

  // Advanced FAQs - Technical
  {
    id: 'advanced-tech-1',
    category: 'advanced',
    subcategory: 'Technical',
    question: "How do I implement webhook notifications?",
    answer: (
      <>
        <p>To implement webhook notifications:</p>
        <ol className="list-decimal pl-4 mt-2">
          <li>Register your webhook URL in the developer portal</li>
          <li>Implement an endpoint to receive POST requests</li>
          <li>Verify webhook signatures using your secret key</li>
          <li>Respond with 200 OK to acknowledge receipt</li>
        </ol>
        <p className="mt-2">See the Webhooks section in the documentation for detailed implementation guides.</p>
      </>
    )
  },
  {
    id: 'advanced-tech-2',
    category: 'advanced',
    subcategory: 'Technical',
    question: "How to reset API user password?",
    answer: (
      <>
        <p className="mt-2">Please fill out the User Maintenance Form: <a href="https://jazeeraairways.jotform.com/212973324988974" className="text-blue-600 hover:text-blue-800">Reset API User Password</a></p>
      </>
    )
  },

  // Advanced FAQs - Integration
  {
    id: 'advanced-integration-1',
    category: 'advanced',
    subcategory: 'Integration',
    question: "Why do some SSRs appear in one segment but not in others?",
    answer: (
      <>
        <p>Some SSRs are categorized under segment SSRs or leg SSRs, so some SSRs may not be available in some segments. When making connected flights, it is important to check availability of SSRs for segments.</p>
        <p className="mt-2">For example, if we have (JED-KWI & KWI-LHE) journey, add TSML (a leg SSR meal) for both if passenger optionally opted meals for the full journey (JED-LHE). In some cases, it is a must to add same SSRs (Ex. Extra baggage XB10) for both segments of the connected flights.</p>
      </>
    )
  },
  {
    id: 'advanced-integration-2',
    category: 'advanced',
    subcategory: 'Integration',
    question: "Can my agency continue to use the XML APIs?",
    answer: (
      <>
        <p>XML APIs are old. Thus, OTAs face the following challenges:</p>
        <ol className="list-decimal list-inside mt-2">
          <li>Slow response speed and non-MVC</li>
          <li>Limited support - Navitaire will not continue to provide support for a very long time as they have already upgraded to JSON DotRez API</li>
          <li>Ancillaries are a completely separate integration</li>
        </ol>
        <p className="mt-2">And many other problems. Therefore, it is highly recommended to use JSON APIs.</p>
      </>
    )
  },
  {
    id: 'advanced-integration-3',
    category: 'advanced',
    subcategory: 'Integration',
    question: "What is token expiry / idle time?",
    answer: "Token idle timeout is 15 minutes. That is, the token will expire if idle time between each two consecutive API calls is greater than or equal to 15 minutes."
  },
  {
    id: 'advanced-integration-4',
    category: 'advanced',
    subcategory: 'Integration',
    question: "I am getting the error message 'nsk-server:DuplicateLeg, Segment already booked'. How can I solve it?",
    answer: (
      <>
        <p>"JourneyKey" and "AvailabilityKey" should be added in request body. In case of roundtrips, another pair of the previous keys is added but for the return flight. This error returns in API response if the pairs of "JourneyKey" and "AvailabilityKey" are duplicate with the same values.</p>
      </>
    )
  },

  // Advanced FAQs - Booking
  {
    id: 'advanced-booking-1',
    category: 'advanced',
    subcategory: 'Booking',
    question: "Is it possible to add SSRs or assign a seat after paying and committing the booking?",
    answer: (
      <>
        <p>Yes, it is. Generally it is better to add SSRs, assign seats or add any charged service before committing the booking. Still, if addition is possible, you need to pay the difference using addPaymentToBooking API. Then commit the booking using (PUT) CommitBooking API.</p>
      </>
    )
  },
  {
    id: 'advanced-booking-2',
    category: 'advanced',
    subcategory: 'Booking',
    question: "Is it possible to cancel a booking via APIs?",
    answer: (
      <>
        <p>Booking cancelation is not possible via any APIs. For this, you can contact Jazeera Airways call center or via logging-in to your Jazeera airways portal account.</p>
        <p className="mt-2">Also, some fare classes are not refundable. For more information, refer to fare class options and rules: <a href="https://www.jazeeraairways.com/en-kw/plan/flight-information/fare-options" className="text-blue-600 hover:text-blue-800">Fare Options</a></p>
      </>
    )
  },
  {
    id: 'advanced-booking-3',
    category: 'advanced',
    subcategory: 'Booking',
    question: "How can promotion codes be applied when booking a flight?",
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
  },

  // Advanced FAQs - Error Handling
  {
    id: 'advanced-error-1',
    category: 'advanced',
    subcategory: 'Error Handling',
    question: "How should I handle network timeouts?",
    answer: (
      <>
        <p>For network timeouts:</p>
        <ol className="list-decimal pl-4 mt-2">
          <li>Implement request timeouts (recommended: 30 seconds)</li>
          <li>Use exponential backoff for retries</li>
          <li>Maximum 3 retry attempts</li>
          <li>Log failed attempts for monitoring</li>
        </ol>
        <p className="mt-2">For critical operations, implement circuit breakers to prevent cascade failures.</p>
      </>
    )
  },
  {
    id: 'advanced-error-2',
    category: 'advanced',
    subcategory: 'Error Handling',
    question: "How do I handle booking synchronization errors?",
    answer: (
      <>
        <p>For booking sync errors:</p>
        <ol className="list-decimal pl-4 mt-2">
          <li>Verify booking status using GET /v1/booking/{'{pnr}'}</li>
          <li>Compare local and remote booking states</li>
          <li>Implement reconciliation logic</li>
          <li>Use webhook notifications for real-time updates</li>
        </ol>
        <p className="mt-2">Always maintain an audit log of booking state changes.</p>
      </>
    )
  },

  // Advanced FAQs - Performance
  {
    id: 'advanced-perf-1',
    category: 'advanced',
    subcategory: 'Performance',
    question: "What's the recommended caching strategy?",
    answer: (
      <>
        <p>Recommended caching strategy:</p>
        <ul className="list-disc pl-4 mt-2">
          <li>Cache static data (airports, routes) for 24 hours</li>
          <li>Cache availability results for 5 minutes</li>
          <li>Use ETags for validation caching</li>
          <li>Implement stale-while-revalidate for better performance</li>
        </ul>
        <p className="mt-2">Always respect Cache-Control headers in API responses.</p>
      </>
    )
  },

  // Advanced FAQs - Security
  {
    id: 'advanced-security-1',
    category: 'advanced',
    subcategory: 'Security',
    question: "How should I handle sensitive passenger data?",
    answer: (
      <>
        <p>For sensitive passenger data:</p>
        <ul className="list-disc pl-4 mt-2">
          <li>Use field-level encryption for PII</li>
          <li>Implement data masking in logs</li>
          <li>Store only required data</li>
          <li>Follow GDPR/CCPA compliance guidelines</li>
        </ul>
        <p className="mt-2">Refer to our security best practices guide for detailed implementation.</p>
      </>
    )
  },
];