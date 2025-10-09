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

export const FAQSection2 = () => {
  const faqs = [
    {
      question: "Q6: Some SSRs are appearing in one segments but not in others in get available SSR API response. How to handle this case in connected flights?",
      answer: (
        <>
          <p>Some SSRs are categorized under segment SSRs or leg SSRs, so some SSRs may not be available in some segments. When making a connected flights, it is important to check availability of SSRs for segments.</p>
          <p className="mt-2">For example, if we have (JED-KWI & KWI-LHE) journey, add TSML (a leg SSR meal) for both if passenger optionally opted meals for the full journey (JED-LHE). In some cases, it is a must to add same SSRs (Ex. Extra baggage XB10) for both segments of the connected flights.</p>
        </>
      )
    },
    {
      question: "Q7: How can I add travel documents (like passport) to a reservation?",
      answer: "Add passport documents to booking using Add Document API to passenger. Document type should be set to P for passport."
    },
    {
      question: "Q8: How can I check whether the booking is confirmed or not?",
      answer: (
        <>
          <p>Check "balanceDue" parameter in the CommitBooking response to check if the booking is confirmed or not. Balance due amount will be zero for confirmed bookings.</p>
          <p className="mt-2">The response booking details status should be "Confirmed" and paid is "true" too.</p>
        </>
      )
    },
    {
      question: "Q9: Can my agency continue to use the XML APIs?",
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
      question: "Q10: I am trying to login and token management is not working. What is the error?",
      answer: (
        <>
          <p>IP address should be whitelisted by Navitaire before being able to login (Token API) successfully. For that purpose, contact apisupport@jazeeraairways.com and mention your user ID and IP addresses that require whitelisting.</p>
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
