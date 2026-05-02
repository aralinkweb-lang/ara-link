export const metadata = {
  title: "Privacy Policy — ARA Cold Therapy",
  description: "Privacy Policy for ARA Cold Therapy Skincare. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 border-b border-[rgba(124,58,237,0.1)]">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-[#0f0a1e] mb-4">
          Privacy Policy
        </h1>
        <p className="text-base text-[#6b7280] leading-relaxed">
          Last updated: April 15th, 2026
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="prose prose-sm max-w-none text-[#0f0a1e]">
          {/* Introduction */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f0a1e] mb-4 flex items-center gap-3">
              <span className="text-[#7c3aed] font-light text-4xl">1.</span>
              Introduction
            </h2>
            <p className="text-base text-[#6b7280] leading-relaxed mb-4">
              Welcome to Aralink private limited ("ARA", "we", "our", or "us"). We operate the website{' '}
              <span className="text-[#7c3aed] font-medium">www.ara.store</span> and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website or make a purchase.
            </p>
            <p className="text-base text-[#6b7280] leading-relaxed">
              By accessing or using our website, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of our site.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f0a1e] mb-4 flex items-center gap-3">
              <span className="text-[#7c3aed] font-light text-4xl">2.</span>
              Information We Collect
            </h2>
            <p className="text-base text-[#6b7280] leading-relaxed mb-4">
              We may collect the following categories of information:
            </p>
            <ul className="space-y-3">
              {[
                { label: "Personal Information", desc: "Name, email address, phone number, and shipping/billing address" },
                { label: "Payment Information", desc: "Billing and transaction details, processed securely via third-party payment providers (e.g., Razorpay). We do not store your full card details on our servers." },
                { label: "Technical Data", desc: "IP address, browser type, device information, and operating system" },
                { label: "Usage Data", desc: "Pages visited, time spent on site, clicks, and browsing behaviour" },
              ].map((item) => (
                <li key={item.label} className="flex gap-3">
                  <span className="text-[#7c3aed] font-semibold flex-shrink-0 mt-0.5">•</span>
                  <div>
                    <span className="font-semibold text-[#0f0a1e]">{item.label}:</span>{' '}
                    <span className="text-[#6b7280]">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* How We Use Your Information */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f0a1e] mb-4 flex items-center gap-3">
              <span className="text-[#7c3aed] font-light text-4xl">3.</span>
              How We Use Your Information
            </h2>
            <p className="text-base text-[#6b7280] leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="space-y-3">
              {[
                "Process and fulfil your orders and deliver purchased products",
                "Improve website performance, design, and overall user experience",
                "Communicate with you regarding your orders, customer support, updates, and promotional offers",
                "Run targeted advertisements through Meta Platforms (Facebook and Instagram)",
                "Comply with applicable legal obligations",
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-[#7c3aed] font-semibold flex-shrink-0 mt-0.5">•</span>
                  <span className="text-[#6b7280]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cookies & Tracking Technologies */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f0a1e] mb-4 flex items-center gap-3">
              <span className="text-[#7c3aed] font-light text-4xl">4.</span>
              Cookies & Tracking Technologies
            </h2>
            <p className="text-base text-[#6b7280] leading-relaxed mb-4">
              We use cookies and similar tracking technologies, including the Meta Pixel, to:
            </p>
            <ul className="space-y-3 mb-4">
              {[
                "Track website traffic and understand user behaviour on our site",
                "Measure the performance and effectiveness of our advertisements",
                "Show you relevant ads on Meta platforms, including Facebook and Instagram",
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-[#7c3aed] font-semibold flex-shrink-0 mt-0.5">•</span>
                  <span className="text-[#6b7280]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-base text-[#6b7280] leading-relaxed">
              You may opt out of cookie-based tracking by adjusting your browser settings or using Meta's Ad Preferences tool available at <span className="text-[#7c3aed] font-medium">facebook.com/ads/preferences</span>.
            </p>
          </div>

          {/* How We Share Your Information */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f0a1e] mb-4 flex items-center gap-3">
              <span className="text-[#7c3aed] font-light text-4xl">5.</span>
              How We Share Your Information
            </h2>
            <p className="text-base text-[#6b7280] leading-relaxed mb-4">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="space-y-3">
              {[
                "Payment processors (e.g., Razorpay) to complete transactions securely",
                "Logistics and delivery partners to fulfil and ship your orders",
                "Meta Platforms (Facebook/Instagram) for advertising and remarketing purposes via the Meta Pixel",
                "Legal authorities if required to do so by law or in response to valid legal processes",
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-[#7c3aed] font-semibold flex-shrink-0 mt-0.5">•</span>
                  <span className="text-[#6b7280]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Retention */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f0a1e] mb-4 flex items-center gap-3">
              <span className="text-[#7c3aed] font-light text-4xl">6.</span>
              Data Retention
            </h2>
            <p className="text-base text-[#6b7280] leading-relaxed">
              We retain your personal information only for as long as necessary to fulfil the purposes outlined in this Privacy Policy, including for legal, accounting, or reporting requirements. Once data is no longer required, we will securely delete or anonymise it.
            </p>
          </div>

          {/* Your Rights */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f0a1e] mb-4 flex items-center gap-3">
              <span className="text-[#7c3aed] font-light text-4xl">7.</span>
              Your Rights
            </h2>
            <p className="text-base text-[#6b7280] leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="space-y-3">
              {[
                "Access the personal data we hold about you",
                "Request correction of inaccurate or incomplete information",
                "Request deletion of your data, subject to applicable legal requirements",
                "Opt out of marketing communications at any time by clicking 'unsubscribe' in any email we send",
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-[#7c3aed] font-semibold flex-shrink-0 mt-0.5">•</span>
                  <span className="text-[#6b7280]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-base text-[#6b7280] leading-relaxed mt-4">
              To exercise any of these rights, please contact us at the details provided in Section 9.
            </p>
          </div>

          {/* Data Security */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f0a1e] mb-4 flex items-center gap-3">
              <span className="text-[#7c3aed] font-light text-4xl">8.</span>
              Data Security
            </h2>
            <p className="text-base text-[#6b7280] leading-relaxed">
              We implement appropriate technical and organisational measures to protect your personal information from unauthorised access, disclosure, alteration, or destruction. However, no method of transmission over the internet is entirely secure, and we cannot guarantee absolute security.
            </p>
          </div>

          {/* Contact Us */}
          <div className="mb-10 bg-[#faf8ff] border border-[rgba(124,58,237,0.15)] rounded-2xl p-8">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f0a1e] mb-6 flex items-center gap-3">
              <span className="text-[#7c3aed] font-light text-4xl">9.</span>
              Contact Us
            </h2>
            <p className="text-base text-[#6b7280] leading-relaxed mb-6">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:
            </p>
            <div className="space-y-4 text-base text-[#0f0a1e]">
              <div>
                <p className="font-semibold text-[#7c3aed] mb-1">Company:</p>
                <p>Aralink private limited</p>
              </div>
              <div>
                <p className="font-semibold text-[#7c3aed] mb-1">Website:</p>
                <p className="text-[#7c3aed] hover:text-[#6d28d9] transition-colors">www.ara.store</p>
              </div>
              <div>
                <p className="font-semibold text-[#7c3aed] mb-1">Email:</p>
                <p className="text-[#7c3aed] hover:text-[#6d28d9] transition-colors">aralinkindia@gmail.com</p>
              </div>
              <div>
                <p className="font-semibold text-[#7c3aed] mb-1">Address:</p>
                <p>Near bharat hotel opposite anpurna universal food pvt ltd plot 7 taluka paddhari dist Rajkot Gujarat 360110</p>
              </div>
            </div>
          </div>

          {/* Changes to This Policy */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f0a1e] mb-4 flex items-center gap-3">
              <span className="text-[#7c3aed] font-light text-4xl">10.</span>
              Changes to This Policy
            </h2>
            <p className="text-base text-[#6b7280] leading-relaxed">
              We reserve the right to update this Privacy Policy at any time. When we do, we will revise the effective date at the top of this page. We encourage you to review this Policy periodically to stay informed about how we protect your information.
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-[rgba(124,58,237,0.1)] pt-8 mt-12">
            <p className="text-center text-sm text-[#9ca3af]">
              © 2026 ARA Cold Therapy Skincare. All rights reserved. | www.ara.store
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
