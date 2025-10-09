/**
 * FAQ data module containing comprehensive API documentation in Q&A format
 */

/**
 * Interface defining the structure of an FAQ entry
 */
export interface FAQ {
  id: string;     // Unique identifier for the FAQ
  question: string;  // The question text
  answer: string;    // The answer text
}

/**
 * Array of FAQ entries used throughout the application.
 * Each entry contains a unique ID, question, and answer.
 * 
 * This data is used for:
 * 1. Direct display in the UI
 * 2. Creating vector embeddings for search
 * 3. Training the chatbot responses
 */
export const faqs: FAQ[] = [
  {
    id: 'q1',
    question: 'Infant fares are not returned in shopping, why?',
    answer: 'Infant fares are not part of normal fare shopping. To get an infant fare, a call to GetPrices must be made specifically requesting SalesCategory Infant using a passenger type INF. Infants without seat (INF) fares must have an adult fare included in the same request.'
  },
  {
    id: 'q2',
    question: 'How do I handle session management in the API?',
    answer: 'Sessions expire after 15 minutes of inactivity. You should implement proper session management by: 1) Storing the session token securely, 2) Refreshing the session before expiration, and 3) Creating a new session if the current one expires. Always include the session token in the Authorization header of your requests.'
  },
  {
    id: 'q3',
    question: 'What authentication methods are supported?',
    answer: 'The API supports two authentication methods: 1) API Key Authentication using the X-Api-Key header, and 2) Basic Authentication using base64-encoded username:password in the Authorization header. API keys are recommended for production use as they provide better security and management capabilities.'
  },
  {
    id: 'q4',
    question: 'How do I handle booking errors?',
    answer: 'The API returns standardized error responses with a code, message, and details object. Common error codes include AUTH001 (Invalid API key), BOOK001 (Invalid booking data), and AVAIL001 (No availability). Always check the error.code field to handle specific error cases appropriately in your application.'
  },
  {
    id: 'q5',
    question: 'What is the process for adding special service requests (SSRs)?',
    answer: 'Special Service Requests can be added after creating the booking but before payment. Use the AddSSR endpoint with the booking reference and required SSR codes. Common SSRs include WCHR (wheelchair), MEAL (special meals), and LANG (language assistance). All SSRs must be confirmed before proceeding to payment.'
  },
  {
    id: 'q6',
    question: 'How do I implement the payment flow?',
    answer: 'The payment flow consists of these steps: 1) Get booking quote using GetPrices, 2) Check agency balance with GetBalance, 3) Process payment using ProcessPayment endpoint, 4) Confirm booking with CommitBooking, and 5) Verify booking status with GetBookingStatus. Always implement proper error handling and retry logic for payment processing.'
  },
  {
    id: 'q7',
    question: 'What are the required fields for passenger data?',
    answer: 'Required passenger fields include: firstName, lastName, dateOfBirth, gender, and nationality. For international flights, you must also provide passport details including: passportNumber, passportCountry, and passportExpiry. All names must match travel documents exactly. Optional fields include: middleName, title, and frequentFlyerNumber.'
  },
  {
    id: 'q8',
    question: 'How do I handle seat assignments?',
    answer: 'Seat assignments are managed through the GetSeatMap and AssignSeat endpoints. First retrieve the seat map for your flight, then assign seats using the seat codes. Note that some seats may have additional charges or restrictions. You can also use the GetSeatPrices endpoint to check seat-specific pricing before assignment.'
  },
  {
    id: 'q9',
    question: 'What is the booking flow sequence?',
    answer: '1. Get Token\n2. Get Availability\n3. Booking Quote\n4. Trip Sell\n5. Get Passengers\n6. Add Passenger and Contact\n7. Seat Availability (optional)\n8. Seat Assignment (optional)\n9. Get Available SSRs (optional)\n10. Add SSRs\n11. Add Travel Documents\n12. Check Balance\n13. Get Booking Details\n14. Add Payment\n15. Commit Booking\n16. Get Booking Status\n17. Logout.'
  },
  {
    id: 'auth1',
    question: 'How do I get an API key?',
    answer: 'You can obtain an API key by signing up on our developer portal and creating a new project. Once your project is approved, you\'ll receive your API credentials.'
  },
  {
    id: 'auth2',
    question: 'How do I include authentication in my requests?',
    answer: 'Add your API key to the request headers using the "X-API-Key" header. For example: X-API-Key: your_api_key_here'
  },
  {
    id: 'api1',
    question: 'What is the base URL for API requests?',
    answer: 'The base URL for all API requests is https://api.aljazeera.com/v1/'
  },
  {
    id: 'api2',
    question: 'What response formats are supported?',
    answer: 'Our API supports JSON responses by default. You can specify your preferred format using the Accept header.'
  },
  {
    id: 'payment1',
    question: 'What payment options are available in API?',
    answer: 'There are two types of payment options available: 1. AG Account Payment Option (Agency should have credit balance in their account to use this option) 2. BSP Payment Option (The Agent ID should be under IATA Organization ID to avail BSP Payment option) - BSP Cash - BSP Easy Pay. Note: For testing BSP Payment in staging environment, the agency IATA ID should be registered under the IFG Test Environment.'
  },
  {
    id: 'infant1',
    question: 'How to add infants to a booking?',
    answer: 'In the TripSell API request body, set "infantCount": "1" or the number of required infants. For any booking, number of infants should be less or equal to number of adult passengers. Use BookingQuote API which helps as a price itinerary method and returns fares including adults, children, infants, baggage etc. Note that Infants are not considered as passenger types in our system, instead it is SSR.'
  },
  {
    id: 'stream1',
    question: 'How do I access live streams?',
    answer: 'Live streams are available through our streaming endpoints. You\'ll need to authenticate and then use the /streams/live endpoint to get available streams.'
  }
];

export default faqs;
