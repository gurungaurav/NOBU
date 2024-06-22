export default function FaqListMyHotel() {
  // Array of FAQ objects
  const faqList = [
    {
      question: "How can I list my hotel on your website?",
      answer:
        "To list your hotel on our website, please visit our 'List Your Property' page and fill out the necessary information. Our team will review your submission and contact you regarding the listing process.",
    },
    {
      question: "How many hotels can I list as a user or vendor?",
      answer:
        "As a user or vendor, you can list only one hotel per account. If you own or manage multiple properties, you'll need to create separate accounts for each hotel listing.",
    },
    {
      question: "What are the requirements for listing a hotel?",
      answer:
        "To list your hotel on our website, your property must meet certain criteria, including compliance with safety standards, availability of amenities, and adherence to our terms and conditions. Please refer to our 'List Your Property' page for detailed information.",
    },
    {
      question: "How do I manage my hotel listing?",
      answer:
        "Once your hotel is listed on our website, you can manage your listing by logging into your account dashboard. From there, you can update room availability, rates, property details, and respond to guest reviews.",
    },
    {
      question: "Do you charge a commission for bookings?",
      answer:
        "Yes, we charge a commission for bookings made through our platform. The commission rate may vary depending on various factors. Please contact our sales team for more information.",
    },
    {
      question: "How do I update my hotel's rates and availability?",
      answer:
        "You can update your hotel's rates and availability by logging into your account dashboard on our website. From there, you can make real-time adjustments to room rates and inventory based on your hotel's occupancy and pricing strategy.",
    },
    {
      question: "What marketing support do you provide for listed hotels?",
      answer:
        "We provide various marketing tools and support for listed hotels, including featured listings, promotional campaigns, and visibility in search results. Our marketing team works closely with hotel partners to maximize their exposure and bookings.",
    },
    {
      question: "How do I respond to guest reviews?",
      answer:
        "You can respond to guest reviews by accessing your account dashboard and navigating to the 'Reviews' section. From there, you can view and respond to guest feedback to address any concerns and maintain a positive reputation.",
    },
    // Add more questions as needed
  ];

  return (
    <div className="relative  w-full px-5 py-10 text-gray-800 sm:px-20 md:max-w-screen-lg lg:py-10">
      <ul className="divide-y divide-gray-200">
        {faqList.map((faq, index) => (
          <li key={index} className="text-left">
            <div>
              <details className="group">
                <summary className="flex items-center gap-3 px-4 py-3 font-medium marker:content-none hover:cursor-pointer">
                  <svg
                    className="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                    ></path>
                  </svg>
                  <span>{faq.question}</span>
                </summary>
                <article className="px-4 pb-4">
                  <p>{faq.answer}</p>
                </article>
              </details>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
