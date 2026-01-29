// src/components/TermsAndConditions.jsx
import React, { useState } from "react";

/**
 * TermsAndConditions.jsx — improved layout & readability
 *
 * IMPORTANT: Content text/ordering is preserved verbatim from the uploaded PDF.
 * Only layout, typography, and presentation are changed.
 */

const sections = [
  {
    id: "privacy-policy",
    title: "1. Privacy Policy",
    content: [
`At The Golden Nest Group LTD, we are committed to protecting your privacy. This policy outlines how we collect, use, and protect your personal information in accordance with the UK General Data Protection Regulation (UK GDPR).`,
`We collect personal data such as name, contact details, IP addresses, and browsing behaviour when you use our website or services. This information is used to provide services, respond to enquiries, process payments, and for marketing (with consent).`,
`We store your data securely and do not share it with third parties unless required by law or with your consent. You have the right to access, rectify, or erase your data at any time. Contact us at legal@thegoldennest.co.uk for any data requests.`,
`Our site uses cookies to improve your experience. Please refer to our Cookie Policy for more details.`
    ],
  },
  {
    id: "terms-conditions",
    title: "2. Terms and Conditions",
    content: [
`By using our website, you agree to be bound by these Terms and Conditions. Golden Nest is a trading name of The Golden Nest Group LTD, a company registered in England and Wales.`,
`Our platform provides marketing and advertising space for property listings. We do not act as estate agents unless specifically stated.`,
`Users must not misuse the website. We reserve the right to remove content or access for violations. Intellectual property on the site remains our property or our licensors'.`,
`We disclaim liability for loss or damage from use of the site. This does not affect your statutory rights under UK law.`
    ],
  },
  {
    id: "cookie-policy",
    title: "3. Cookie Policy",
    content: [
`Our website uses cookies to distinguish you from other users. This helps us provide a better browsing experience and improve our site.`,
`Cookies we use:`,
`• Essential cookies (necessary for site operation)`,
`• Analytical/performance cookies`,
`• Functionality cookies`,
`You can control cookie settings through your browser at any time. Continued use of the site implies consent to our cookie usage.`
    ],
  },
  {
    id: "disclaimer",
    title: "4. Disclaimer",
    content: [
`Golden Nest provides a property listing platform for third-party agents and landlords. We are not responsible for the accuracy, completeness, or legality of any listings submitted by third parties unless clearly stated.`,
`Buyers, tenants, and landlords are advised to conduct their own due diligence. We accept no liability for property outcomes resulting from listings.`
    ],
  },
  {
    id: "about-us",
    title: "5. About Us",
    content: [
`Golden Nest is a UK-based online property platform operated by The Golden Nest Group LTD. We connect buyers, tenants, landlords, and agencies through technology and service innovation.`,
`Our mission is to make property transactions simpler, transparent, and accessible for everyone.`
    ],
  },
  {
    id: "contact-page",
    title: "6. Contact Page",
    content: [
`Business Name: The Golden Nest Group LTD`,
`Trading As: Golden Nest`,
`Registered Address: 128 City Road, London, EC1V 2NX, United Kingdom`,
`Email: legal@thegoldennest.co.uk`,
`Website: https://thegoldennest.co.uk`
    ],
  },
  {
    id: "complaints-procedure",
    title: "7. Complaints Procedure",
    content: [
`1. Introduction`,
`At The Golden Nest Ltd, we are committed to providing the highest level of service to our clients. If something goes wrong, we want you to tell us about it so we can put things right.`,
`2. How to Make a Complaint`,
`If you wish to make a complaint, please contact us by email at: manager@thegoldennest.co.uk`,
`In your email, please provide:`,
`• Your full name`,
`• Your contact details`,
`• A clear description of your complaint`,
`• Any supporting evidence, if available`,
`3. What Happens Next`,
`• We will acknowledge your complaint within 3 working days.`,
`• A thorough investigation will be conducted by a senior member of our team.`,
`• We aim to respond with a formal outcome within 15 working days of receiving your complaint.`,
`4. If You Are Not Satisfied`,
`If you are not happy with our final response, you have the right to refer your complaint to our redress scheme:`,
`The Property Redress Scheme (PRS)`,
`Website: www.theprs.co.uk`,
`Tel: 0333 321 9418`,
`You must refer your complaint to the PRS within 12 months of our final response.`,
`5. Commitment to Improvement`,
`All complaints are taken seriously and reviewed regularly to help us improve our services.`
    ],
  },
  {
    id: "aml-kyc",
    title: "8. AML/KYC Statement",
    content: [
`Anti-Money Laundering (AML) & Know Your Customer (KYC) Policy`,
`Golden Nest is committed to complying with the UK Anti-Money Laundering (AML) regulations, including the Money Laundering, Terrorist Financing and Transfer of Funds Regulations 2017. As part of our legal obligations, we carry out Know Your Customer (KYC) checks to verify the identity of our clients and users.`,
`Why We Do This`,
`These checks are essential to:`,
`• Prevent fraud, money laundering, and financial crime`,
`• Ensure that all transactions on our platform are secure and lawful`,
`• Comply with UK laws and regulatory standards`,
`What We May Ask For`,
`Before granting access to certain services—such as listing a property, managing a rental, or completing a financial transaction—we may request:`,
`• A valid form of photo ID (e.g. passport or driving licence)`,
`• Proof of address dated within the last 3 months (e.g. utility bill, bank statement)`,
`• In some cases, further information such as source of funds or ownership documentation`,
`These documents must be submitted digitally via our secure upload system or email, and we will confirm when your identity has been verified.`,
`How Your Information Is Handled`,
`We handle all personal data in accordance with the UK GDPR and our Privacy Policy. Your documents are stored securely and are only used for compliance purposes. We do not share KYC data with third parties unless required by law or regulatory authorities.`,
`Failure to Provide Verification`,
`If you are unable or unwilling to provide the required verification documents, we may have to limit or deny access to certain services, including listings, property management, or account approval.`
    ],
  },
  {
    id: "client-money-protection",
    title: "9. Client Money Protection Statement",
    content: [
`Golden Nest does not hold client funds such as deposits or rent. All funds are handled through secure channels and forwarded promptly to landlords or agents.`,
`If this changes, we will register with a Client Money Protection (CMP) scheme and update our clients accordingly.`
    ],
  },
  {
    id: "accessibility-statement",
    title: "10. Accessibility Statement",
    content: [
`We are committed to ensuring our website is accessible to all users, including those with disabilities. If you experience any issues accessing content, please contact us at legal@thegoldennest.co.uk so we can assist and improve our service.`
    ],
  },
  {
    id: "payment-refund",
    title: "11. Payment & Refund Policy",
    content: [
`All payments for listings or services are made securely through our payment processors. We do not store payment card information on our servers.`,
`Refunds are subject to review and are not guaranteed once a listing has gone live. For refund requests, please email finance@thegoldennest.co.uk.`
    ],
  },
  {
    id: "notes",
    title: "Notes",
    content: [
`Please note: All policies are subject to change at any time without prior notice. Any significant updates will be communicated through appropriate channels, such as email or website notifications, where applicable. We encourage all users to regularly check our website for the most up-to-date versions of our policies.`,
`For questions or clarification, you may contact us at legal@thegoldennest.co.uk.`,
`Last updated: 21 October 2025`
    ],
  },
];

export default function TermsAndConditionsImproved() {
  // store which sections are collapsed; default: all expanded
  const [collapsed, setCollapsed] = useState(() =>
    Object.fromEntries(sections.map((s) => [s.id, false]))
  );

  const toggle = (id) => {
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));
    // scroll into view after expanding for convenience
    if (collapsed[id]) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar / TOC */}
        <aside className="hidden lg:block sticky top-24 self-start">
          <div className="bg-white border rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-3">Contents</h2>
            <nav className="space-y-1 text-sm">
              {sections.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-slate-700 hover:text-slate-900 py-1"
                >
                  <span className="font-medium mr-2 text-slate-500">{i + 1}.</span>
                  {s.title}
                </a>
              ))}
            </nav>

            <div className="mt-4 border-t pt-3">
              <a
                href="/Terms And Conditions.pdf"
                download
                className="inline-flex items-center justify-center w-full rounded-md bg-amber-500 hover:bg-amber-600 text-black px-3 py-2 text-sm font-semibold shadow"
              >
                Download PDF
              </a>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            <div className="font-medium">The Golden Nest Group LTD</div>
            <div>128 City Road, London, EC1V 2NX</div>
            <div className="mt-2">legal@thegoldennest.co.uk</div>
          </div>
        </aside>

        {/* Main content */}
        <main>
          <div className="bg-white rounded-2xl shadow p-6">
            <header className="mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Legal & Compliance Pages for The Golden Nest
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                The Golden Nest Group LTD • Registered Address: 128 City Road, London, EC1V 2NX
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="/Terms And Conditions.pdf"
                  download
                  className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-amber-600"
                >
                  Download Terms & Conditions (PDF)
                </a>
                {/* <button
                  type="button"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                >
                  Back to top
                </button> */}
              </div>
            </header>

            {/* Mobile TOC */}
            <div className="lg:hidden mb-4">
              <details className="bg-slate-50 p-3 rounded-md">
                <summary className="font-medium cursor-pointer">Contents</summary>
                <nav className="mt-2 text-sm space-y-1">
                  {sections.map((s, i) => (
                    <a key={s.id} href={`#${s.id}`} className="block text-slate-700 py-1">
                      <span className="font-medium mr-2 text-slate-500">{i + 1}.</span>
                      {s.title}
                    </a>
                  ))}
                </nav>
              </details>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {sections.map((s) => (
                <section id={s.id} key={s.id} className="break-inside-avoid">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">{s.title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`#${s.id}`}
                        className="text-xs text-slate-500 hover:text-slate-700"
                        aria-label={`Link to ${s.title}`}
                      >
                        permalink
                      </a>
                      <button
                        onClick={() => toggle(s.id)}
                        aria-expanded={!collapsed[s.id]}
                        className="text-sm text-slate-600 hover:text-slate-900 px-2 py-1 rounded"
                      >
                        {collapsed[s.id] ? "Expand" : "Collapse"}
                      </button>
                    </div>
                  </div>

                  <div
                    className={`mt-3 prose prose-slate text-sm ${collapsed[s.id] ? "hidden" : ""}`}
                    style={{ maxWidth: "none" }}
                  >
                    {s.content.map((line, idx) => {
                      // Preserve bullet line items that start with the bullet character used in the source
                      if (line.trim().startsWith("• ")) {
                        return (
                          <p key={idx} className="ml-4 list-disc">
                            {line.replace(/^•\s+/, "• ")}
                          </p>
                        );
                      }
                      // Preserve lines that look like headings inside a section (e.g., "1. Introduction")
                      if (/^[0-9]+\.\s+/.test(line)) {
                        return (
                          <p key={idx} className="font-semibold">
                            {line}
                          </p>
                        );
                      }
                      // simple paragraph
                      return <p key={idx}>{line}</p>;
                    })}
                  </div>
                </section>
              ))}
            </div>

            <footer className="mt-8 border-t pt-4 text-sm text-slate-500">
              <p>
                The Golden Nest Group LTD • Registered Address: 128 City Road, London, EC1V 2NX, United Kingdom. Website: https://thegoldennest.co.uk
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
