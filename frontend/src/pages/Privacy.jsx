import React from "react";

const Privacy = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-navy px-8 py-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
                    <p className="text-teal-400">Last updated: January 2025</p>
                </div>

                <div className="p-8 space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-navy mb-4">
                            1. Information We Collect
                        </h2>
                        <p className="mb-4">
                            We collect information you provide directly to us when you create an account, report an item, or communicate with us. This may include your name, email address, phone number, and details about lost or found items.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy mb-4">
                            2. How We Use Your Information
                        </h2>
                        <p className="mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide, maintain, and improve our services.</li>
                            <li>Match lost items with potential owners.</li>
                            <li>Communicate with you about updates, security alerts, and support messages.</li>
                            <li>Monitor and analyze trends and usage.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy mb-4">
                            3. Information Sharing
                        </h2>
                        <p className="mb-4">
                            We do not share your personal information with third parties except as described in this policy. We may share information with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Other users when you consent to connect regarding a lost item.</li>
                            <li>Service providers who perform services on our behalf.</li>
                            <li>Law enforcement if required by law.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy mb-4">
                            4. Data Security
                        </h2>
                        <p className="mb-4">
                            We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy mb-4">
                            5. Cookies
                        </h2>
                        <p className="mb-4">
                            We use cookies and similar technologies to collect information about your browsing activities to improve your experience and understand how you use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy mb-4">
                            6. Contact Us
                        </h2>
                        <p className="mb-4">
                            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@findit.com" className="text-teal font-medium hover:underline">privacy@findit.com</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
