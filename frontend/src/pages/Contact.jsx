import ContactForm from "../components/ContactForm";
import ContactInfoCard from "../components/ContactInfoCard";
import FAQItem from "../components/FAQItem";

function Contact() {
  const faqs = [
    {
      question: "How do I report a lost item?",
      answer:
        "Simply navigate to the 'Feed' page and click 'Report Item'. Fill in the details such as category, location, and date, and upload a photo if you have one. Our community will be notified immediately.",
      icon: "help",
    },
    {
      question: "Is there a fee for using FindIt?",
      answer:
        "FindIt is completely free for basic users to report lost or found items. We offer premium features for power users and businesses who want to manage multiple locations or get priority support.",
      icon: "payments",
    },
    {
      question: "How do you verify ownership of items?",
      answer:
        "When claiming an item, we ask users to provide unique identifiers (like serial numbers, specific markings, or lock screen wallpapers) that aren't visible in the public listing photos. This ensures the item goes back to its rightful owner.",
      icon: "verified_user",
    },
    {
      question: "How long do listings stay active?",
      answer:
        "Listings remain active for 90 days by default. You can renew a listing if the item hasn't been found or claimed within that period. We'll send you a reminder before the listing expires.",
      icon: "schedule",
    },
  ];

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-bold text-navy mb-4 tracking-tight">
          Contact & Support
        </h1>
        <p className="text-slate text-lg max-w-2xl">
          We're here to help you find what matters. Reach out to our team or
          find quick answers below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Contact Form Column (Left) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <ContactForm />
        </div>

        {/* Contact Info & Map Column (Right) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          {/* Info Cards */}
          <div className="grid gap-4">
            <ContactInfoCard
              icon="alternate_email"
              title="Email Support"
              description="For general inquiries and support."
              contact="support@findit.com"
              link="mailto:support@findit.com"
              iconBg="bg-teal/10"
              iconColor="text-teal"
            />

            <ContactInfoCard
              icon="call"
              title="Phone Support"
              description="Available Mon-Fri, 9am-5pm EST."
              contact="+1 (555) 123-4567"
              link="tel:+15551234567"
              iconBg="bg-amber/10"
              iconColor="text-amber"
            />

            <ContactInfoCard
              icon="chat"
              title="Live Chat"
              description="Chat with our support team instantly."
              contact="Start a chat"
              iconBg="bg-teal/10"
              iconColor="text-teal"
            />
          </div>

          {/* Map Section */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
            <img
              alt="Minimal map view of city streets with a location pin"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq16Ta--FZbC85EEj9dswSZHBkrKd-QR9SCOOpo6EvtEsMWQL1t1sp4ddK5aCn4jgPFv0Mdbj6F-7-MsniqaMfsthTeH_S0xPHyeVTOnOB_AUe0SXJhrbME5D5ajgLsgRiXEgqB0R8WjWtg-M8FmnBMUOk5LJ6u5ail3yICqmRLinQ6m76bZqXUMWikrqPt2tSMT-xXLVgYViBjL5IKZS8ZjRAz0to6zwnOdTqQllf86LqpSwdfWrpzstFVtMSZ6LIyRWIzvv3qNM"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-bold text-lg">Main Office</p>
              <p className="text-sm opacity-90">
                123 FindIt Way, New York, NY 10001
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-24 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-teal font-bold tracking-wider text-xs uppercase mb-2 block">
            Help Center
          </span>
          <h2 className="text-3xl font-bold text-navy">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              icon={faq.icon}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Contact;
