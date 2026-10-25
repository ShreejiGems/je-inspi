"use client";
import React from "react";
import Footer from "../../common/footer";
import Navbar from "@/components/common/navbar";
import { garamond } from "@/src/common/helper";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className={`min-h-screen bg-brand-50 ${garamond.className}`}>
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-brand-900">Privacy Policy</h1>
            <p className="text-sm text-brand-700 mt-2">
              Last Updated: November 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                ABOUT SHREEJI GEMS
              </h2>
              <p className="text-brand-800 leading-relaxed text-justify mb-4">
                "SHREEJI GEMS" ("SHREEJI GEMS," "we," "us," and "our"), is a Diamond and Jewelry
                Manufacturing Company, with its principal place of business (Head Office) located at 4th Floor,
                Office No-A, 401, Pramukh Building, Nandu Doshini Wadi, Katargam, Surat, Gujarat, 395004,
                India. SHREEJI GEMS is responsible for the operation and management of the Website, {" "}
                <a href="https://www.shreejigems.co.in" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">www.shreejigems.co.in</a>
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS maintains a branch office, officially named SHREEJI GEMS
                Zweigniederlassung Österreich, located at Promenade 23, 4020, Linz, Austria, for the purpose of
                managing and conducting business operations within the European Union member states.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                At SHREEJI GEMS, we deeply value our relationship with you. We are dedicated to providing
                you with relevant services and a positive experience, which we achieve by handling your
                personal information with utmost care and diligence. We are committed to complying with
                applicable global regulations, including the specific requirements of the laws of India and the
                European Union's General Data Protection Regulation (GDPR).
              </p>
            </section>

            {/* About Section */}
            <section>
              <div className="bg-brand-50 p-4 rounded-lg mb-4 text-justify">
                <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                  Details of SHREEJI GEMS:
                </h3>
                <ul className="list-disc list-inside text-brand-800 space-y-1">
                  <li>Firm No: GUJSR208264</li>
                  <li>GST No: 24ADFFS7733L1ZO</li>
                  <li>IEC No: ADFFS7733L</li>
                  <li>PAN No: ADFFS7733L</li>
                </ul>
              </div>

              <div className="bg-brand-50 p-4 rounded-lg">
                <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                  Additional details of SHREEJI GEMS Zweigniederlassung
                  Österreich:
                </h3>
                <ul className="list-disc list-inside text-brand-800 space-y-1">
                  <li>Firmenbuch-Nr: 632291 s</li>
                  <li>VAT/UID NO: ATU81189526</li>
                  <li>EUID: ATBRA.632291-001</li>
                  <li>EORI: ATEOS1000152756</li>
                  <li>Steuernummer: 46 584/5600</li>
                </ul>
              </div>
            </section>

            {/* Privacy Statement */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                PRIVACY STATEMENT
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Your personal data (such as name, birth date, address, phone
                number, and email) collected (i) Place an order through the
                Website; (ii) Complete our Customer Data Form; or (iii) Provide
                any data inputs into the Website, including but not limited to
                chat functions, contact forms, or subscription sign-ups. This
                data is processed exclusively to fulfill your order, deliver our
                services, and manage our contractual relationship with you. This
                processing is based on a lawful premise that complies with the
                global principles of purpose limitation and necessity,
                specifically:
              </p>
              <ul className="list-disc list-inside text-brand-800 space-y-2 ml-4 mb-4">
                <li>
                  For processing within the European Union (EU), the legal basis
                  is Contractual Necessity (GDPR Article 6(1) (b)).
                </li>
                <li>
                  For processing within India, the lawful basis is Legitimate
                  Use of data provided voluntarily for a specified purpose, in
                  compliance with the Digital Personal Data Protection Act (DPDP
                  Act, 2023)
                </li>
                <li>
                  For all other jurisdictions, processing is conducted based on
                  the universal principle of Contractual Obligation, ensuring
                  data is collected and used solely for the explicitly stated
                  purpose of completing your transaction.
                </li>
              </ul>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                This data will not be shared with or sold to external parties,
                except in specific cases detailed in subsequent provisions. To
                identify you as a registered customer, the aforementioned data
                will be accessible. Where you provide us with your Affirmative
                Consent by ticking the appropriate box or clearly accepting a
                separate notice, we will additionally use your data on
                www.shreejigems.co.in for:
              </p>
              <ul className="list-disc list-inside text-brand-800 space-y-2 ml-4 mb-4">
                <li className="text-justify">
                  Newsletter distribution: By opting to subscribe, you agree
                  that your provided personal data can be used by SHREEJI GEMS
                  for <br />(i) surveys on service and consultation satisfaction, <br />(ii)
                  distributing invitations to events, vouchers, and discount
                  promotions, <br />(iii) sending reminders for incomplete online
                  shopping carts, <br />(iv) communicating product availability, and
                  <br />(v) delivering marketing and product information about goods
                  and services from SHREEJI GEMS (via email, SMS, or phone). You
                  can withdraw this consent for specific or all purposes by
                  contacting SHREEJI GEMS (e.g., via email).
                </li>
                <li className="text-justify">
                  Use of contact numbers: Personal data (surname and first name,
                  telephone number, messenger ID, IP address, profile picture
                  and message history) will be stored, processed and used with
                  your agreement when you use WhatsApp, SMS or other messenger
                  services, to send you messages. Usage of the Messenger service
                  requires an active account with the respective provider. You
                  can revoke your consent to this data processing at any time by
                  notifying our support.
                </li>
              </ul>
              <p className="text-brand-800 leading-relaxed text-justify">
                We retain your personal data for a maximum of seven years
                following contract completion, as required by company and tax
                law. If you only subscribed to the newsletter and are not a
                SHREEJI GEMS customer, your data is stored until you revoke your
                consent, or for a maximum of three years after your last
                interaction with us. You can request details of your stored
                personal data at any time. Additionally, you can request the
                correction or deletion of your data under certain conditions.
                You also have the right to limit data processing, object to
                processing, and receive your data in a structured, commonly
                used, machine-readable format. You can contact us before file a
                complaint with a data protection supervisory authority.
              </p>
            </section>

            {/* Prices and Shipping */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                OUR COMMITMENT TO PRIVACY PRINCIPLES
              </h2>

              <div className="space-y-4">
                <p className="text-brand-800 leading-relaxed text-justify">
                  This Privacy Policy is built upon the following fundamental
                  privacy tenets:
                </p>
                <div className="border-l-4 border-brand-500 pl-4">
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Tenet 1: Clarity and Assurance:
                  </h3>
                  <p className="text-brand-800 leading-relaxed text-justify">
                    We embed privacy into the design and standard settings of
                    all our offerings. We value the trust you place in us when
                    you share your personal details. We are committed to being
                    fully transparent with you about why we use your personal
                    information and will only use it for those specific reasons
                    when we have a lawful basis to do so. This includes
                    obtaining your express permission where required. You will
                    be notified of any significant changes to how we handle your
                    personal information
                  </p>
                </div>

                <div className="border-l-4 border-brand-500 pl-4">
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Tenet 2: Safeguarding Your Personal Data
                  </h3>
                  <p className="text-brand-800 leading-relaxed text-justify">
                    We pledge to uphold strong data protection, privacy, and
                    security measures to ensure your personal information
                    remains secure. If an incident affects your personal
                    information, we are committed to informing you and relevant
                    regulatory bodies, adhering to data breach notification
                    obligations, including the Digital Personal Data Protection
                    Act (DPDP Act, 2023) and the GDPR. Your personal information
                    will be afforded the same level of protection when shared
                    with external parties or transferred across international
                    borders. We will keep your personal information only as long
                    as necessary or as mandated by law.
                  </p>
                </div>

                <div className="border-l-4 border-brand-500 pl-4">
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Tenet 3: Honoring Your Entitlements
                  </h3>
                  <p className="text-brand-800 leading-relaxed text-justify">
                    We are dedicated to honoring the choices you make regarding
                    your personal information. We will support your legal rights
                    to access, correct, and erase the personal information we
                    hold about you, in addition to your rights under the Data
                    Protection law, such as the right to data portability and
                    the right to limit processing. Furthermore, we will respect
                    your options concerning objecting to how we process your
                    personal information and will provide channels for you to
                    contact us with inquiries or complaints.
                  </p>
                </div>
              </div>
            </section>

            {/* Information We Gather */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                DATA PROCESSING RESPONSIBILITY
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS is the data controller accountable for decisions
                regarding how your personal data is utilized.
              </p>
            </section>

            {/* Information We Gather */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                INFORMATION WE GATHER
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                We gather various categories of personal information, including:
              </p>

              <div className="space-y-3">
                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    General Personal and User Account Information:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    To avail yourself of our products, services, events, store
                    appointments, and/or other client programs, you might need
                    to furnish contact details or establish an account. This
                    information may encompass your name, address, date of birth,
                    email address, telephone number, marital status,
                    nationality, and gender. Your account might store details
                    such as your purchase history, account ID, username,
                    password, time zone, and communication history. We may also
                    amass data concerning your behavior, interests, preferences,
                    wish lists, hobbies, client interactions, marketing campaign
                    activities, opinions, reviews, demographics, habits, and
                    purchasing tendencies.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Transactional and Payment Information:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    When you finalize purchases of products and/or services, we
                    gather supplementary information, such as your shipping
                    address, proof of delivery, billing address, and pertinent
                    payment information.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Identification Information:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    We may gather identification information from you, such as
                    passport data or national ID data, in instances where we
                    necessitate this to furnish products and/or services to you.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Correspondence, Call Recordings, Online or Video Chat:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    We gather personal information from you when you correspond
                    with us (for example, if you contact us with a query about
                    one of our products and/or services), when you provide your
                    details when you visit our premises, contact us or our Care
                    Center by e-mail, telephone, contact form, or participate in
                    online or video chat. Please note that phone calls, online
                    or video chat, or other correspondence will on occasion be
                    recorded for security, evidence, training, quality control,
                    analysis, and development purposes
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Social Media Platforms Data:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    Should you opt to interact with us via a social media
                    platform or other third-party service, we will gather the
                    information you have supplied to us through that platform,
                    which may include behavioral data such as your browsing
                    records and purchase history on that platform. Furthermore,
                    you may grant us access to specific data from your social
                    media profiles for social log-in purposes.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Cookie Data:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    We additionally amass certain information automatically
                    about visitors to our Platforms, detailed in our dedicated
                    “Cookie Policy” provisions. This may encompass data
                    pertaining to advertising IDs, pixel tags, or your unique
                    online personal identifier
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Location Data:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    We will gather information about your location to the extent
                    that we render any location services.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    CCTV, Video Surveillance & Wi-Fi Data:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    Within our retail store, corporate premises, or other areas,
                    we gather data utilizing CCTV or other video surveillance
                    technology. If you enroll for our complimentary Wi-Fi
                    service at our stores, events, or other premises, we may
                    gather specific information about your device, including
                    device or IP address, connection date and time, and the
                    location(s) at which you connected to our Wi-Fi service
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Photos & Video Recordings:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    Certain of our technology products, including connected
                    mirrors, augmented reality technologies, or photo booths,
                    gather photographs or video recordings from you. This data
                    may also enable us to take measurements from you
                    necessitated for our products and/or services. We may also
                    capture photographs or make video or voice recordings of you
                    at one of our events.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Surveys and Market Research:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    We conduct surveys and market research, and we will gather
                    your response data.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Information You Provide About Third Parties:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    You may furnish personal information about another
                    individual (such as your partner or child), including name
                    and address, date of birth, email address, telephone number,
                    marital status, wish list, hobbies, and preferences.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Information We Collect from Third Parties About You:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    We also may collect any of the aforementioned information
                    about you from third parties, including our authorized
                    dealers, social media platforms, advertising and marketing
                    partners, analytics providers, and third parties that extend
                    technical or strategic data services to us, and we may
                    collate such information with other information that we
                    possess. We may also collect personal information about you
                    from publicly accessible sources
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Sensitive or Special Categories of Data:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    We may solicit you to provide sensitive or special
                    categories of data (for example, allergens or accessibility
                    requirements for events), in which instance we will furnish
                    you with enhanced privacy information and request your
                    explicit consent at the time of our request. Otherwise, if
                    you provide such data to us without us asking you for it, we
                    will interpret the fact you have provided such data as your
                    explicit consent for us to process it.
                  </p>
                </div>
              </div>
            </section>

            {/* Purposes of Processing */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                PURPOSES OF PROCESSING AND OUR LEGAL JUSTIFICATION FOR
                PROCESSING
              </h2>

              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                We may handle your personal data for the purposes detailed below, in accordance with the
                following legal grounds:
              </p>

              <div className="bg-brand-50 p-4 rounded-lg mb-4 text-justify">
                <ul className="list-disc list-inside text-brand-800 space-y-1 text-sm text-justify">
                  <li>
                    <strong>Consent:</strong> This is the lawful basis when you
                    have freely and explicitly given us permission to handle
                    your personal data (e.g., when you opt to receive marketing
                    communications).
                  </li>
                  <li>
                    <strong>Contractual Necessity:</strong> The handling of data is essential for fulfilling a contract we are
                    about to enter into or have entered into with you (including compliance with our Terms of
                    Use), or because you have specifically requested us to take preliminary steps before
                    entering into a contract (e.g., handling your contact details to finalize a purchase and
                    arrange delivery).
                  </li>
                  <li>
                    <strong>Legitimate Interests:</strong> The handling of data
                    is essential for our justified business interests or the
                    justified interests of a third party (e.g., for efficient
                    business operations, fraud prevention, ensuring platform
                    security, and personalizing user experience), unless there
                    is a compelling reason to protect your personal data that
                    overrides those justified interests.
                  </li>
                  <li>
                    <strong>Legal Obligation:</strong> The handling of data is
                    essential for us to adhere to applicable laws and
                    regulations (e.g., in response to a court order or to comply
                    with DPDP/GDPR).
                  </li>
                  <li>
                    <strong>Other Lawful Grounds:</strong> Data handling may
                    occasionally be required for other lawful reasons, such as
                    crime prevention and detection, protection of an
                    individual's fundamental interests, or when the handling is
                    otherwise carried out in the public interest.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    The purposes for which we handle data and the legal
                    justifications are as follows:
                    <br />
                    Service-Related Data Handling
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle your personal data for a variety of
                    service-related functions. These include, but are not
                    limited to:
                  </p>
                  <ul className="list-disc list-inside text-brand-800 space-y-1 text-sm text-justify mb-2">
                    <li>Product reservations and sales transactions</li>
                    <li>
                      Service-related communications (e.g., order updates)
                    </li>
                    <li>Program updates and announcements</li>
                    <li>
                      AAdministrative notifications (e.g., order and shipment
                      confirmations or changes, event or appointment booking
                      confirmations or changes, and repair notifications)
                    </li>
                    <li>
                      Informing you about changes to our terms or privacy policy
                    </li>
                    <li>
                      Sending you service-related messages if you abandon your
                      online shopping cart or browsing session
                    </li>
                  </ul>
                  <p className="text-brand-700 text-sm">
                    Our primary justification for this handling is contractual
                    necessity, as it is essential for providing you with the
                    services you request. However, we may also depend on
                    legitimate interests (e.g., to optimize your interaction,
                    ensure efficient service provision, and maintain customer
                    satisfaction), legal obligation (e.g., for record-keeping),
                    or consent (e.g., for specific optional services).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Marketing Communications and Digital Advertising
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle your personal data for various marketing-related
                    functions, including:
                  </p>
                  <ul className="list-disc list-inside text-brand-800 space-y-1 text-sm text-justify mb-2">
                    <li>
                      Distributing marketing communications through a range of
                      channels (e.g., phone, email, mail, electronic or text
                      messages, including WhatsApp or other direct messaging
                      platforms)
                    </li>
                    <li>
                      Delivering tailored messages or advertisements on social
                      media and other digital platforms
                    </li>
                    <li>
                      Conducting marketing research and analysis to improve our
                      marketing strategies and tailor your experience
                    </li>
                    <li>Managing your marketing preferences</li>
                  </ul>
                  <p className="text-brand-700 text-sm text-justify">
                    Our legal basis for this handling is primarily consent
                    (e.g., when you subscribe to our newsletter or agree to
                    receive tailored ads). However, we may also depend on
                    legitimate interests (e.g., to promote our products and
                    services, personalize marketing communications, and target
                    relevant audiences) or, in certain circumstances,
                    contractual necessity (e.g., if marketing communications are
                    a required component of a service you have requested).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Account Administration
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle your personal data for functions related to the
                    management of your user account on our platforms, including:
                  </p>
                  <ul className="list-disc list-inside text-brand-800 space-y-1 text-sm text-justify mb-2">
                    <li>Account creation and maintenance procedures</li>
                    <li>
                      Login credential management and account security measures
                    </li>
                    <li>Transaction history and preference management</li>
                    <li>Communication with you concerning your account</li>
                  </ul>
                  <p className="text-brand-700 text-sm text-justify">
                    The legal basis for this handling is primarily contractual
                    necessity (as it is required to provide you with account
                    services) or legitimate interests (e.g., for account
                    security and efficient account management).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Website and Platform Operation and Enhancement:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle personal data to operate, maintain, and enhance
                    our website and other digital platforms, including:
                  </p>
                  <ul className="list-disc list-inside text-brand-800 space-y-1 mb-2 text-sm text-justify">
                    <li>
                      Ensuring website functionality and security protocols
                    </li>
                    <li> Analyzing website usage patterns and trends</li>
                    <li>Tailoring your browsing experience</li>
                    <li>Developing new features and functionalities</li>
                    <li>Conducting testing and research activities</li>
                  </ul>
                  <p className="text-brand-700 text-sm text-justify">
                    The legal basis for this handling is primarily legitimate
                    interests (e.g., to ensure the proper functioning of our
                    platforms, improve user interaction, and optimize our
                    service offerings).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Order Processing and Fulfillment:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle personal data to facilitate your orders,
                    including:
                  </p>
                  <ul className="list-disc list-inside text-brand-800 space-y-1 text-sm mb-2 text-justify">
                    <li>Order placement and confirmation processes</li>
                    <li>Payment processing procedures</li>
                    <li>Shipping and delivery logistics</li>
                    <li>Managing returns and exchanges</li>
                    <li>Providing customer support related to your orders</li>
                  </ul>
                  <p className="text-brand-700 text-sm text-justify">
                    The legal basis for this handling is primarily contractual
                    necessity (as it is required to fulfill your orders) or
                    legal obligation (e.g., for tax and accounting purposes).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Customer Service and Support:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle personal data to provide customer service and
                    support assistance, including:
                  </p>
                  <ul className="list-disc list-inside text-brand-800 space-y-1 text-sm mb-2 text-justify">
                    <li>Responding to your inquiries and requests</li>

                    <li>Addressing complaints and resolving</li>
                    <li>
                      Providing assistance with product information or services
                    </li>
                    <li>Managing customer feedback</li>
                  </ul>
                  <p className="text-brand-700 text-sm text-justify">
                    The legal basis for this handling is primarily contractual
                    necessity (if the support is related to a contract with you)
                    or legitimate interests (e.g., to provide efficient customer
                    service and resolve issues)
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Legal Compliance and Protection:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle personal data to comply with applicable laws and
                    regulations, and to protect our legal rights and interests,
                    including:
                  </p>
                  <ul className="list-disc list-inside text-brand-800 space-y-1 mb-2 text-sm text-justify">
                    <li>
                      Complying with tax, accounting, and other legal
                      obligations
                    </li>
                    <li>Responding to legal demands and court orders</li>
                    <li>Preventing fraud and illegal activities</li>
                    <li>Enforcing our terms and conditions</li>
                    <li>Protecting our business operations and assets</li>
                  </ul>
                  <p className="text-brand-700 text-sm text-justify">
                    The legal basis for this handling is primarily legal
                    obligation or legitimate interests (e.g., to protect our
                    business and legal rights).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Managing User Accounts:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle your personal data for the administration of your
                    user accounts and our internal records. This processing is
                    fundamentally tied to our contractual obligations, but may
                    also occur based on your consent, our essential business
                    needs (such as for security), or our need to adhere to legal
                    mandates.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Purchase Processing and Order Fulfillment:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle your personal data to facilitate purchases,
                    including gift orders, coordinate repairs, process returns,
                    manage communication preferences related to after-sales
                    care, arrange deliveries, and administer post-sale services.
                    This is primarily carried out to fulfill our agreement with
                    you, but might also be justified by our legitimate interests
                    (like ensuring effective payment procedures), legal duties,
                    or your agreement.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Handling Customer Queries:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle your personal data to address your inquiries,
                    respond to your requests, and deliver client support
                    services. While this is often required to meet our
                    contractual responsibilities, it may also be necessary for
                    our essential business purposes (like providing effective
                    customer service) or with your permission.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Event Coordination and Community Engagement:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle your personal data to organize and operate events,
                    schedule appointments at our stores, and administer
                    community memberships. This includes actions such as
                    registering members, tracking attendance, managing speakers,
                    and documenting health and safety incidents. We may also
                    capture photos or videos during our events for promotional
                    activities. This handling may occur due to contractual
                    obligations, your consent, our essential business needs
                    (such as event management), or legal requirements.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Administering Promotions:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle your personal data to run contests, prize draws,
                    and other promotional activities. This involves the
                    collection of necessary details from you for the operation
                    of these promotions. Our justification for this can stem
                    from contract execution, our essential business needs (like
                    analyzing customer engagement), legal obligations, or your
                    agreement.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Ensuring Compliance, Security, and Preventing Prohibited
                    Actions:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle your personal data to meet legal and regulatory
                    obligations concerning anti-money laundering, international
                    sanctions, credit evaluations, fraud prevention, and other
                    prohibited or illegal activities. This is integral to our
                    efforts to maintain the security of our platforms and
                    services, as well as to respond to lawful demands from
                    authorities (e.g., regulatory bodies, law enforcement, or
                    financial institutions). This handling is chiefly justified
                    by our essential business needs (e.g., preventing fraud),
                    but may also be due to legal duties or your consent. We
                    reserve the right to decline to provide products or services
                    when we possess a lawful and legitimate reason to do so.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Data Processing with Automated Systems:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We utilize innovative technologies, encompassing profiling,
                    artificial intelligence, machine learning, and advanced
                    algorithms, to analyze your data. This helps us identify and
                    anticipate products, diagnostics, services, or information
                    that might appeal to you, based on what you provide or what
                    we obtain from other sources (as detailed in the section
                    "Information We Collect from Third Parties About You"). This
                    analysis may lead to automated decision-making. These
                    decisions could relate to our offerings, such as products,
                    services, event invitations, or customer benefits. This
                    processing aims to enhance your interaction with our
                    products and services by presenting you with tailored
                    options and responding efficiently to your input. For
                    example, this can involve techniques like data clustering,
                    data mining, data fusion, or other data analysis methods to
                    derive insights from your personal information. These
                    processes may be fully automated (e.g., for complaint
                    escalation) or involve human review. When your personal
                    information is used for automated decision-making or
                    profiling, we are committed to transparency, fairness, and
                    unbiased decisions. We implement appropriate safeguards to
                    protect your personal information. Where applicable, you
                    will be offered the chance to opt out of automated decisions
                    or profiling. Our justification for this processing includes
                    our legitimate interests (e.g., improving our customer
                    support) and your consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Market Research and Client Interaction Improvement:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle your personal information to conduct market
                    research (including surveys) and analyze data to improve
                    customer interaction. This is based on client feedback,
                    comments, preferences, and your usage of our platforms,
                    products, or services. This enables us to continuously
                    refine our offerings and the products and services we
                    provide to you. Our justification for this processing is our
                    legitimate interests (e.g., enhancing our platforms) and,
                    where applicable, your consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Location-Based Services:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    When we offer location-based services, we handle your location
                    information to provide those services. These services, typically available on mobile devices or
                    applications, may require your consent to use location data. This data could be derived from
                    sources like GPS, sensors, beacons, or Wi-Fi access points, allowing for a more personalized
                    experience. Your device settings will allow you to disable these services if desired. Our
                    justification for this processing is your consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Security Monitoring with Technology:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle personal information collected through CCTV, video
                    surveillance, and Wi-Fi data to prevent and detect crime,
                    support law enforcement investigations, ensure the safety of
                    our staff, visitors, and property, and monitor activity
                    within our premises or Wi-Fi usage. Our justification for
                    this processing is our legitimate interests, legal
                    obligations, and, where applicable, your consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Use of Advanced Retail Technologies:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We may handle your personal information to facilitate
                    your use of new retail technologies that enhance your experience, both in-store and online. These
                    may include virtual try-ons, augmented reality, and product customization tools. For instance, we
                    might use images or videos of your hand to generate and send you a photo or video showing a
                    product on your hand. Our justification for this processing is our legitimate interests (e.g.,
                    monitoring customer interaction with new technologies) and your consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Platform Maintenance, Support, and Protection:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle your personal information for the
                    administration and protection of our business and platforms. This includes activities such as
                    troubleshooting, error resolution, data analysis, testing, system maintenance, support, reporting,
                    and data hosting. Our justification for this processing is our legitimate interests (e.g., ensuring
                    platform functionality and security), and we may also rely on legal obligations or your consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Acquiring Products and Services from Suppliers:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    When you or your organization provide
                    products or services to us, we handle your personal information to receive those products or
                    services. Our justification for this processing is the performance of a contract, but we may also
                    rely on our legitimate interests (e.g., to facilitate the receipt of services) or your consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Sharing Data with Authorized Dealers:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    To provide you with a consistent customer experience
                    across our authorized dealer network, we may handle your personal information to enable data
                    sharing. You can choose to allow your account data, including contact details and transaction
                    history, to be shared within our network, between our authorized dealers and our stores, to
                    enhance your experience when you visit our sales locations. Our justification for this processing
                    is your consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Business Operations and Legal Adherence:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle your personal information for the
                    management of our business operations and to comply with our legal responsibilities. Our
                    primary justification is legal obligation, but we may also rely on our legitimate interests (e.g.,
                    maintaining records) or your consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Corporate Restructuring:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    In the context of a merger, acquisition, or similar corporate
                    restructuring, we handle your personal information and may disclose it to a third party involved
                    in the transaction, such as a purchaser or entity to which we transfer our assets and business. Our
                    primary justification is our legitimate interests (e.g., to facilitate discussions with stakeholders),
                    but we may also rely on legal obligations or your consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Data Handling via Cookies and Automated Tools:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    We handle your personal information in
                    accordance with our Cookie Policy. Our primary justification is consent, performance of a
                    contract, and our legitimate interests (e.g., for essential cookies).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Informing You of Significant Changes:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    If we make substantial changes to how we handle your
                    personal information, or if we decide to use your information for a new purpose not previously
                    disclosed, we will take appropriate steps as required by law, which may include notifying you via
                    email or other suitable methods.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-900 mb-2 text-justify">
                    Our Cookie Usage Policy:
                  </h3>
                  <p className="text-brand-800 text-sm mb-2 text-justify">
                    This website uses cookies as described in our Cookie Policy. The
                    Cookie Policy is accessible to users on every page of the website linked to this Privacy Policy
                    and within cookie information banners.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                ENSURING THE SECURITY OF YOUR DATA
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                We want you to feel secure when entrusting your personal details to us. Therefore, we are
                dedicated to safeguarding the personal data we collect by employing robust data protection,
                privacy, and security measures. Access to your personal information is limited to personnel with
                a legitimate need to view it, whether to deliver products or services to you or to fulfill their job
                responsibilities. We maintain suitable technical, organizational, physical, electronic, and
                procedural safeguards to shield the personal information you provide from unauthorized or
                unlawful handling, as well as from accidental loss, damage, or destruction. However, if you are
                required to set a password to access specific areas of our platforms, you are responsible for
                choosing a strong password and keeping it confidential. It is your responsibility to select a
                password that you do not use on any other site, and you must not disclose it to anyone.
              </p>
            </section>

            {/* Service Repair */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                DISCLOSING YOUR PERSONAL INFORMATION
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                We only disclose personal information to other parties when
                legally permissible. When we disclose personal information, we
                implement contractual agreements and security measures to
                protect the shared data and to adhere to our data protection,
                confidentiality, and security standards and obligations. We
                share your personal information with other parties under the
                following circumstances:
              </p>

              <div className="space-y-3">
                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Our Corporate Affiliates:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    We might share your personal information with our corporate
                    affiliates for the purposes detailed earlier, where we are
                    legally allowed to do so (including when there's a lawful
                    basis).
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Service Providers (including Data Processors):
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    We will share your personal information with designated
                    third-party service providers (who may handle your personal
                    information as data processors on our behalf), for purposes
                    such as facilitating online and other payment transactions,
                    managing credit checks and fraud prevention, arranging
                    product shipment, providing cloud storage, and any other
                    services necessary for us to utilize your personal
                    information for the purposes outlined in this Privacy
                    Policy. In some situations, particular fraud prevention
                    service providers act as independent data controllers.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Disclosures to Regulatory Bodies, Authorities, and Other
                    Third Parties:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    We will disclose your personal information to any law
                    enforcement agency, court, police, regulator, government
                    body, or any other third party, including relevant financial
                    institutions, if we believe it's necessary to comply with a
                    legal or regulatory requirement, to protect our rights or
                    the rights of another party, or if it's in the public
                    interest or our legitimate interests or those of another
                    party (for example, to fulfill a third-party request to
                    reveal personal information to investigate a suspected
                    crime, to verify our adherence to applicable laws and
                    regulations, or to establish, exercise, or defend legal
                    claims). Furthermore, we may share your data with insurance
                    providers or organizations dealing with lost or stolen
                    property to aid in the recovery of any missing or stolen
                    items.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Payment Financing Providers:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    To offer you various payment solutions (where they are
                    available), we will share your personal information with
                    financial service providers. This includes details such as
                    your contact and order information, which they need to
                    assess your eligibility for different payment options and to
                    present suitable payment choices to you. For Klarna
                    solutions, your personal information is handled according to
                    relevant data protection law and in line with Klarna's
                    privacy policy, which you can access via the links provided
                    on the official Klarna website.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Authorized Dealers:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    When you engage with our authorized dealer network, we may
                    seek your consent to share your personal information with an
                    authorized dealer periodically, to: <br />(i) deliver services
                    you've requested; <br />(ii) enhance your customer journey and
                    experience within our premises when interacting with our
                    products, services, or authorized dealers; <br />(iii) ensure the
                    accuracy and currency of the information we have about you,
                    including purchase registrations, warranty extensions, and
                    other transactions, as well as your marketing preferences;
                    and <br />(iv) manage customer and vendor relationships to improve
                    cooperation with our authorized dealers and offer you
                    personalized customer experiences. In situations where an
                    authorized dealer needs access to your information, we will
                    request your permission before granting that access. If you
                    permit us to share your personal information with an
                    authorized dealer, we will maintain industry-leading
                    security measures to protect your information's ongoing
                    security. When your personal information is shared with an
                    authorized dealer, both the dealer and we may be acting as
                    independent data controllers or data processors regarding
                    your personal information, depending on how we or our
                    authorized dealer are interacting with you.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Mergers and Acquisitions:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    We will disclose your personal information to any third
                    party that acquires, or to which we transfer, all or a
                    substantial portion of our assets and business. If such a
                    sale or transfer occurs, we will make reasonable efforts to
                    ensure that the entity receiving your personal information
                    uses it in a manner consistent with this Privacy Policy.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Social Media Platforms and Other Third-Party Digital
                    Vendors:
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    We might share your personal information with social media
                    platforms as described earlier or in the Cookie Policy.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    International Data Transfers
                  </h3>
                  <p className="text-brand-800 text-justify">
                    We may share your personal information with:
                  </p>
                  <ul className="list-disc list-inside text-brand-800 mb-2 text-justify">
                    <li>Affiliates and subsidiaries</li>
                    <li>Service providers</li>
                    <li>Business partners</li>
                    <li>Legal authorities</li>
                  </ul>
                  <p className="text-brand-800 text-justify">
                    If we transfer your data internationally, we will institute
                    appropriate safeguards to protect your information, in
                    compliance with GDPR or DPDP requirements for international
                    data transfers. If we transfer your personal information to
                    a country that doesn't offer an adequate level of data
                    protection, we've implemented standard contractual clauses
                    to ensure appropriate safeguards are in place for the
                    protection of your personal information when it's
                    transferred to our affiliated companies, stores, or
                    third-party service providers in territories outside the
                    European Economic Area, the United Kingdom, and Switzerland.
                    While other territories may have different data protection
                    standards compared to your home country, we will continue to
                    protect the personal information we transfer according to
                    this Privacy Policy.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Privacy Risk Assessments
                  </h3>
                  <p className="text-brand-800 text-justify">
                    We may periodically perform risk evaluations related to the
                    handling of your personal information, especially when
                    introducing new technologies or functionalities. In some
                    cases, these new technologies or functionalities might
                    require us to provide updated privacy notices or consent
                    forms to ensure we continue to meet our privacy commitments
                    to you.
                  </p>
                </div>

                <div className="bg-brand-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                    Retention of Your Personal Information
                  </h3>
                  <p className="text-brand-800 text-justify">
                    We retain your personal information only as long as
                    necessary for our processing purposes, particularly to
                    defend ourselves in the event of a legal claim (for example,
                    information related to a contract with you will be kept for
                    the contract's duration and for up to ten years afterward)
                    and to comply with legal retention obligations. After this
                    period, it will be deleted or, in some instances,
                    anonymized. If you've given us consent to handle your
                    personal information and we have no other legal basis to
                    continue that handling, we will delete your personal
                    information if you later withdraw your consent. If you ask
                    us to stop sending you direct marketing communications or if
                    you exercise your right to be forgotten, we will keep a
                    record of your request and contact details to ensure that
                    your request is honored.
                  </p>
                </div>
              </div>
            </section>

            {/* Returns & Exchanges */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                UPHOLDING YOUR ENTITLEMENTS
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                We pledge to uphold your entitlements with the utmost diligence.
                Should you wish to exercise any of the rights detailed below,
                which are granted to you by applicable law, we invite you to
                communicate with us at the address provided.
              </p>

              <div className="space-y-3">
                <div className="border-l-4 border-brand-500 pl-4">
                  <h3 className="font-semibold text-brand-900 mb-1">
                    Access Right
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    You possess the entitlement to request access to any
                    personal data that is undergoing processing by us.
                  </p>
                </div>

                <div className="border-l-4 border-brand-500 pl-4">
                  <h3 className="font-semibold text-brand-900 mb-1">
                    Deletion/Processing Limitations
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    Under certain conditions, you hold the entitlement to seek
                    the deletion of your personal data or to impose restrictions
                    on how we utilize it.
                  </p>
                </div>

                <div className="border-l-4 border-brand-500 pl-4">
                  <h3 className="font-semibold text-brand-900 mb-1">
                    Revision or Rectification
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    You are entitled to instruct us to rectify any imprecise
                    personal data and to revise any outdated personal data.
                  </p>
                </div>

                <div className="border-l-4 border-brand-500 pl-4">
                  <h3 className="font-semibold text-brand-900 mb-1">
                    Right to Contest
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    In specific scenarios, you are vested with the right to
                    contest, based on grounds related to your particular
                    situation, the processing of personal data concerning you,
                    especially when such processing is founded on legitimate
                    interests or serves the public interest. Furthermore, you
                    have the absolute right to contest the use of your personal
                    data for direct marketing purposes.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-brand-900 mb-1">
                    Data Portability Privilege
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    In select circumstances, you are privileged to request that
                    we furnish you with the personal data you have entrusted to
                    us, presented in a structured, commonly used, and
                    machine-readable format.
                  </p>
                </div>

                <div className="border-l-4 border-brand-500 pl-4">
                  <h3 className="font-semibold text-brand-900 mb-1">
                    Consent Withdrawal Option
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    If you have granted us consent to process your personal
                    data, you retain the power to retract this consent at any
                    moment, effective prospectively. Such a retraction does not
                    invalidate the lawfulness of the processing executed based
                    on this consent before its withdrawal.
                  </p>
                </div>

                <div className="border-l-4 border-brand-500 pl-4">
                  <h3 className="font-semibold text-brand-900 mb-1">
                    Right to Object to Advertising via Electronic Mail
                  </h3>
                  <p className="text-brand-800 text-sm text-justify">
                    In the event that we have obtained your electronic mail
                    address in connection with a product and/or service
                    transaction and utilize your electronic mail address for
                    direct advertising of our own analogous products and/or
                    services, you are empowered to object to such utilization of
                    your electronic mail address at any juncture, effective for
                    the future, by dispatching an electronic mail to the address
                    indicated below in the section titled “Contact us” or by
                    selecting the ‘unsubscribe’ link embedded in any of our
                    marketing electronic mails. However, it is important to note
                    that we may continue to transmit service-related
                    communications to you (i.e., non-marketing communications),
                    including electronic mail updates pertaining to your order
                    status.
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-brand-50 p-4 rounded-lg">
                <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                  Complaint Procedure
                </h3>
                <p className="text-brand-800 text-sm text-justify">
                  If you harbor any concerns about our handling of your personal
                  data, we urge you, as a preliminary step, to reach out to us
                  using the contact details provided below. We will commit our
                  best efforts to address and resolve your concern. Following a
                  thorough investigation of your concern, we will furnish you
                  with a written response within a reasonable timeframe,
                  outlining our proposed remedial actions.
                </p>
              </div>

              <div className="mt-4 bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-brand-900 mb-2 text-justify">
                  Children
                </h3>
                <p className="text-brand-800 text-sm text-justify">
                  Our Platforms are not designed for or directed at individuals
                  whom we know to be children in the relevant country from which
                  data is collected (e.g., in the United States, this age is
                  under 13, and in certain European countries, it is under 16).
                  Furthermore, we do not intentionally collect any personal
                  information from anyone whom we know to be a child, unless we
                  have obtained consent from a parent or guardian. Children must
                  not utilize the Platforms, nor should they submit any personal
                  information to us without the explicit consent of a parent or
                  guardian.
                </p>
              </div>
            </section>

            {/* COOKIES */}
            <section>
              <h1 className="text-2xl font-semibold text-brand-900 mb-4 text-center">Cookie Policy</h1>
              <div>
                <h3 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                  WHAT ARE COOKIES?
                </h3>
                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  Cookies are small text files that are placed on your computer
                  or mobile device when you visit a website. When you return to
                  the website, these cookies are sent back to the site, allowing
                  it to recognize your device. Cookies help the website remember
                  your actions and preferences, such as login details, language
                  preferences, font size, and other display settings, so you
                  don't have to re-enter them each time you return to the site
                  or navigate between pages.
                </p>
                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  Cookies are used for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-brand-800 text-sm text-justify mb-4">
                  <li>Digital authentication</li>
                  <li>Session tracking</li>
                  <li>Storing information about user activities on the site</li>
                  <li>
                    Tracking user navigation for statistical or advertising
                    purposes
                  </li>
                </ul>
                <p>
                  When you browse our Website, you may also receive cookies from
                  other websites or web servers (third-party cookies) on your
                  computer or mobile device. Some actions on the Website may not
                  be possible without the use of cookies, which are sometimes
                  essential for the website to function correctly.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-brand-900 mb-3">
                  TYPES OF COOKIES USED ON THE WEBSITE
                </h3>
                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  There are different types of cookies, and each has specific
                  characteristics and functions. Cookies can be stored on your
                  device for varying periods. Session cookies are typically
                  deleted when you close your browser, while persistent cookies
                  remain on your device for a pre-defined period. According to
                  current legal requirements, using cookies does not always
                  require your explicit consent. Specifically, technical
                  cookies, which are essential for the operation of the Website
                  or to provide services you have requested, do not require
                  consent.
                </p>

                <p className="text-brand-800 leading-relaxed mb-4 text-justify">However, your prior consent is required for:</p>
                <ul className="list-disc list-inside text-brand-800 text-justify mb-4">
                  <li>
                    Functionality cookies, which enable specific Website
                    features and remember your preferences (e.g., language,
                    selected products) to improve your experience.
                  </li>
                  <li>
                    Analytical cookies, including third-party cookies, which
                    help us understand how you and other users use the Website.{" "}
                  </li>
                  <li>
                    Advertising cookies, which create user profiles to deliver
                    targeted advertising based on your browsing behavior, and
                    social cookies (e.g., from Facebook,Instagram) that enable
                    interaction with social media platforms.
                  </li>
                </ul>
                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  More information and details on the various types of cookies,
                  the way they work and their characteristics can be found on
                  the following site (completely independent and not affiliated
                  with Shreeji Gems (us)){" "}
                  <a href="https://www.allaboutcookies.org/" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">
                    www.AllAboutCookies.org
                  </a>{" "}
                  and {" "}
                  <a href="https://www.youronlinechoices.eu/" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">
                    www.youronlinechoices.eu
                  </a>
                  .
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-brand-900 mb-3">
                  COOKIES USED ON THE SHREEJI GEMS WEBSITE
                </h3>
                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  The Website uses various types of cookies to:
                </p>
                {/* <ul className="list-disc list-inside text-brand-800 space-y-2"> */}
                <ul className="list-disc list-inside text-brand-800 mb-4 text-sm text-justify">
                  <li>Operate the Website and provide services</li>
                  <li>Enhance your browsing experience</li>
                  <li>Deliver advertisements tailored to your preferences</li>
                  <li> Enable other functionalities</li>
                </ul>
                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  The cookies used on the Website can be categorized as follows:
                </p>
                <ul className="list-disc list-inside text-brand-800 mb-4 text-sm text-justify">
                  <li>
                    <b>Technical cookies:</b> These are essential for the Website's
                    operation and to provide the services and content you
                    request. They include browsing or session cookies.
                  </li>
                  <li>
                    <b>Functionality cookies:</b> These cookies enable specific
                    features and remember your preferences (e.g., language,
                    products selected for purchase) to improve your experience.
                    <li>
                      <b>Analytical cookies:</b> These cookies, including third-party
                      cookies, help us analyze how users interact with the
                      Website.
                    </li>
                    <li>
                      <b>Advertising cookies:</b> These cookies, including third-party
                      cookies, create user profiles to deliver targeted
                      advertisements based on your browsing behavior.
                    </li>{" "}
                    <li>
                      {" "}
                      <b>Social cookies:</b> These are third-party cookies (e.g., from
                      social media platforms) that allow you to interact with
                      social media.
                    </li>
                  </li>
                </ul>
                <p>
                  Functional, analytical, advertising, and social cookies are
                  only activated and used if you provide your prior consent.
                  Third-party cookies, which come from other websites or web
                  servers, may also be used for purposes specific to those third
                  parties.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-brand-900 mb-3">
                  HOW TO MANAGE COOKIE SETTINGS
                </h3>
                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  You can manage your cookie preferences through your browser
                  settings. Most browsers allow you to:
                </p>
                {/* <ul className="list-disc list-inside text-brand-800 space-y-2"> */}
                <ul className="list-disc list-inside text-brand-800 mb-4 text-sm text-justify">
                  <li>View cookies and delete them individually</li>
                  <li>Block third-party cookies</li>
                  <li>DBlock all cookies</li>
                  <li>Delete all cookies when you close your browser</li>
                </ul>
                <p>
                  Please note that blocking all cookies may affect your browsing
                  experience and prevent you from using certain features of the
                  Website.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-brand-900 mb-3">
                  BROWSER SETTINGS
                </h3>
                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  You have the ability to permit, block, or remove cookies
                  (either entirely or selectively) through your browser's
                  configuration options. Should you choose to disable some or
                  all cookies (including technical, functional, and third-party
                  cookies), please be aware that the Website may experience
                  reduced functionality:
                </p>
                {/* <ul className="list-disc list-inside text-brand-800 space-y-2"> */}
                <ul className="list-disc list-inside text-brand-800 mb-4 text-sm text-justify">
                  <li>
                    The Website or specific services may become unavailable;{" "}
                  </li>
                  <li>
                    Certain features might not function as expected or may be
                    inaccessible;
                  </li>
                  <li>
                    You might be required to repeatedly adjust settings or
                    manually input information each time you visit the Website.{" "}
                  </li>
                </ul>
                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  For detailed guidance on adjusting cookie preferences in your
                  browser, please consult the browser's help documentation.
                  Below are links to cookie setting guides for popular browsers:
                </p>
                <ul className="list-disc list-inside text-brand-800 mb-4 text-sm text-justify">
                  <li>
                    Internet Explorer: {" "}
                    <a href="http://windows.microsoft.com/en-us/windows7/block-enable-or-allow-cookies" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">http://windows.microsoft.com/en-us/windows7/block-enable-or-allow-cookies</a>
                  </li>
                  <li>
                    Safari: {" "} <a href="http://support.apple.com/kb/PH19255?viewlocale=en_UK" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">http://support.apple.com/kb/PH19255?viewlocale=en_UK</a>
                  </li>
                  <li>
                    Chrome: {" "}
                    <a href="https://support.google.com/chrome/answer/95647?hl=en&hlrm=fr&hlrm=en" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">https://support.google.com/chrome/answer/95647?hl=en&hlrm=fr&hlrm=en</a>
                  </li>
                  <li>
                    Opera: {" "}
                    <a href="https://help.opera.com/en/latest/web-preferences/#cookies" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">https://help.opera.com/en/latest/web-preferences/#cookies</a>
                  </li>
                  <li>
                    Firefox: {" "} <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences</a>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-brand-900 mb-3">
                  COOKIE PREFERENCE CENTER
                </h3>

                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  Upon your first visit, you can accept only essential cookies,
                  accept all cookies, or customize your cookie settings using
                  the{" "}
                  <span className="font-medium">"Cookie Preference Center"</span>,
                  accessible via the banner at the bottom of the homepage. You
                  can revisit and modify your preferences at any time through
                  the{" "}
                  <span className="font-medium">Cookie Preference Center</span>{" "}
                  link located in the Website&apos;s footer.
                </p>

                <p className="text-brand-800 leading-relaxed mb-2 text-justify">
                  Please keep the following in mind:
                </p>

                <ul className="list-disc list-inside text-brand-800 space-y-1 mb-4 text-justify">
                  <li>
                    <span className="font-medium">Technical cookies</span>{" "}
                    (including third-party technical cookies) are strictly
                    necessary for the Website&apos;s operation and to provide
                    the content and services you request. Disabling these
                    cookies will impair the Website&apos;s functionality and
                    your access to its content and services.
                  </li>
                  <li>
                    Refusing{" "}
                    <span className="font-medium">functionality cookies</span>{" "}
                    (including third-party functionality cookies) may result in
                    certain services or features being unavailable or
                    functioning incorrectly, and you may be required to re-enter
                    information or preferences each time you visit the Website.
                  </li>
                  <li>
                    Declining{" "}
                    <span className="font-medium">
                      analytical, advertising, or social cookies
                    </span>{" "}
                    (including third-party cookies) will not affect the
                    Website&apos;s basic operation.
                  </li>
                </ul>

                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  Your cookie choices for the Website will be saved in a
                  specific technical cookie, detailed in the cookie table. In
                  some situations, this cookie may not function correctly. If
                  this occurs, we recommend deleting unwanted cookies and
                  adjusting your preferences through your browser settings.
                </p>

                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  You will need to reset your cookie preferences if you access
                  the Website from different devices or browsers, or if you
                  delete cookies from your device.
                </p>

                <h3 className="text-xl font-semibold text-brand-900 mb-3">
                  ADDITIONAL INFORMATION
                </h3>

                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  For more information about how we handle your personal data,
                  please refer to our Privacy Policy and Terms of Use.
                </p>

                <h3 className="text-xl font-semibold text-brand-900 mb-3">
                  UPDATES TO THIS COOKIE POLICY
                </h3>

                <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                  We may update this Cookie Policy from time to time. Any
                  changes will be posted on the Website, and we encourage you to
                  review this policy periodically to stay informed about how we
                  use cookies.
                </p>

                <h3 className="text-xl font-semibold text-brand-900 mb-3">
                  THIS PRIVACY POLICY AND AMENDMENTS
                </h3>

                <p className="text-brand-800 leading-relaxed text-justify mb-4">
                  This Privacy Policy, in conjunction with our Cookie Policy, furnishes details on how we gather,
                  utilize, reveal, and transfer your personal information across various interactions, including our
                  website (www.shreejigems.co.in), and other digital interfaces, when you visit our store, our
                  premises or events, interact with us via email, telephone, or online chat, or engage with us on
                  social media or other marketing and advertising channels. Our Cookie Policy elucidates our
                  utilization of cookies and similar technologies to amass information when you use our Platforms.
                </p>
                <p className="text-brand-800 leading-relaxed text-justify mb-4">
                  When you procure products online or via telephone, please consult our Conditions of Sale, as
                  they govern such transactions. Additional terms and conditions, such as our Terms of Use, may
                  also govern services we render. We may revise this Privacy Policy periodically. Modifications
                  will be posted on our website.
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                CONTACT US
              </h2>
              <div className="bg-brand-50 p-6 rounded-lg">
                <p className="font-semibold text-brand-900 mb-2 text-justify">
                  If you have any inquiries, concerns, or requests concerning this Privacy Policy and Cookie
                  Policy or our data practices, please contact us at:
                </p>
                <p className="font-semibold text-brand-900 mb-2 text-justify">
                  SHREEJI GEMS
                </p>
                <p className="text-brand-800">
                  4th Floor, Office No-A, 401, Pramukh Building
                </p>
                <p className="text-brand-800">Nandu Doshini Wadi, Katargam</p>
                <p className="text-brand-800">Surat, Gujarat, 395004, India</p>
                <p className="text-brand-800 mt-3">
                  Email: contact@shreejigems.co.in
                </p>
                <p className="text-brand-800">Contact no.: +91 9913574918</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
