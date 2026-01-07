import React from "react";

const Terms = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-navy px-8 py-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
                    <p className="text-teal-400">Last updated: January 2025</p>
                </div>

                <div className="p-8 space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                            1. Acceptance of Terms
                        </h2>
                        <p className="mb-4">
                            By accessing and using FindIt ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                            2. Description of Service
                        </h2>
                        <p className="mb-4">
                            FindIt provides a platform for users to report lost items and browse found items. We act as an intermediary to facilitate communication between parties but do not guarantee the recovery of any item or the authenticity of any claim.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                            3. User Conduct
                        </h2>
                        <p className="mb-4">
                            You agree to use the Service only for lawful purposes. You are prohibited from:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Posting false or misleading information.</li>
                            <li>Harassing or harming another person.</li>
                            <li>Uploading viruses or malicious code.</li>
                            <li>Attempting to gain unauthorized access to the Service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                            4. Intellectual Property
                        </h2>
                        <p className="mb-4">
                            All content provided on the Service is the property of FindIt or its users. You may not reproduce, distribute, or create derivative works from this content without express written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                            5. Disclaimer of Warranties
                        </h2>
                        <p className="mb-4">
                            The Service is provided on an "as is" and "as available" basis. FindIt makes no representations or warranties of any kind, express or implied, as to the operation of the Service or the information, content, materials, or products included on the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                            6. Limitation of Liability
                        </h2>
                        <p className="mb-4">
                            FindIt shall not be liable for any damages of any kind arising from the use of the Service, including, but not limited to direct, indirect, incidental, punitive, and consequential damages.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                            7. Contact Information
                        </h2>
                        <p className="mb-4">
                            If you have any questions about these Terms, please contact us at <a href="mailto:legal@findit.com" className="text-teal font-medium hover:underline">legal@findit.com</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
