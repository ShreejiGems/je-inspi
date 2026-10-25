"use client";
import React, { useEffect, useState } from "react";
import { Button, Input, Select, Checkbox, Carousel, Collapse } from "antd";
import TextArea from "antd/es/input/TextArea";
import { contactUsAPI } from "@/src/services/contact-us.api";
import { FiMapPin, FiPhone, FiMail, FiDownload } from "react-icons/fi";
import { garamond } from "@/src/common/helper";
import Image from "next/image";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { PlusOutlined } from "@ant-design/icons";
import { countries } from "@/src/libs/constants";
import { message } from "antd";
import { authAPI, ContactUsRequest } from "@/src/services/auth.api";

interface Location {
  id: string;
  country: string;
  countryCode: string;
  phone: string;
  email: string;
  address?: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: string;
  title: string;
  image: string;
  description: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Catalogue {
  id: string;
  name: string;
  coverImage: string;
  pdfUrl: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const INDIA_CONTACT = {
  country: "India",
  address: "A-401, Pramukh Building, Nandu Doshini Wadi, Katargam, Surat, Gujarat, India, 395004.",
  email: "contact@shreejigems.co.in",
  phone: "+91 9913574918",
};

const AUSTRALIA_CONTACT = {
  country: "Austria",
  address: "Promenade 23, 4020, Linz, Austria",
  email: "contact@shreejigems.co.in",
  phone: "+43 670 3593935",
};

const FAQ_DATA = [
  {
    key: "1",
    question: "Which sizing standard are the product dimensions measured in?",
    answer:
      "All sizing metrics provided on our product pages, including ring sizes, chain lengths, and dimensions, are based strictly on European (EU) Standardized measurements. Clients are responsible for converting these EU measurements to their local or preferred sizing standard prior to placing an order.",
  },
  {
    key: "2",
    question:
      "Is the Jewellery and are the Diamonds supplied by SHREEJI GEMS certified?",
    answer:
      "Yes, our quality and authenticity are certified. All primary, high-value Diamonds are certified by GIA or IGI, the industry's most reputable gemological laboratories. Please note that smaller accent diamonds and loose diamonds are not individually certified. However, all finished jewellery items carry the international Common Control Mark (CCM-hallmark) and are certified by SGL or IGI for dual authentication of the product itself. Certificate/report numbers are included on your invoice for direct verification.",
  },
  {
    key: "3",
    question:
      "What level of precision can be expected for product specifications and color presentation?",
    answer:
      "We strive for the highest accuracy, but slight, unavoidable variations may occur: Diamond specifications (weight ±0.01 ct and size ±0.10 mm may vary per stone. Additionally, due to differences in screen settings and calibration, the actual product color may differ slightly from the image displayed on your viewing device.",
  },
  {
    key: "4",
    question: "How do I establish a formal Client Account with SHREEJI GEMS?",
    answer:
      'Establishing an account is simple. Navigate to the "Register" icon on the top right corner of our website\'s navigation menu and complete all required registration fields. Following submission, our team will contact you to complete the essential Business Verification Process (as per our service conditions). Upon successful verification, your registered ID and password will be provided, granting you full access for future transactions and purchases.',
  },
  {
    key: "5",
    question:
      "Does SHREEJI GEMS offer custom-designed Jewellery, Diamonds, or Make-to-Order requests?",
    answer:
      "Yes, we specialize in comprehensive bespoke services. We welcome requests for custom-designed Jewellery, specific cuts or sourcing of Diamonds, and any general Make-to-Order base work. To discuss your specific vision and obtain a quotation, please contact our customization team by filling out the detailed inquiry form located on our dedicated Custom Design page.",
  },
  {
    key: "6",
    question:
      "Can I place an order for delivery outside of your specified service countries?",
    answer:
      "No. SHREEJI GEMS currently only accepts and processes orders with a final shipping destination located within the specific list of countries published on our Contact Us page. If your required delivery location is outside of this predefined service area, please contact us directly to formally express your interest for potential future expansion.",
  },
  {
    key: "7",
    question:
      "What are the details concerning shipping fees and typical delivery times?",
    answer:
      "We offer complimentary, fully insured shipping on all orders. As most items are made-to-order, total lead time is typically 15–20 working days, but this may vary depending on the quantity of your order. Bespoke orders may take 3–4 weeks. Please note that while outbound shipping is free, all return and exchange costs, fees, and liability are the exclusive responsibility of the Client.",
  },
  {
    key: "8",
    question:
      "Who is responsible for paying import duties, sales taxes, and customs fees?",
    answer:
      "The Client is solely responsible for all governmental fees, duties, taxes (including VAT/GST/Sales Tax), customs clearance costs, and brokerage fees in all circumstances. This liability applies not only to the initial new purchase but also to all costs incurred during exchanges, returns, and service-related shipments, as these fees are determined by your local jurisdiction.",
  },
  {
    key: "9",
    question: "What conditions and limitations apply to returns and exchanges?",
    answer:
      "Requests must be submitted via our website contact us page within 15 days of receipt. Items must be returned in original, unused condition with all packaging and certificates. Returns are strictly prohibited for engraved, customized, modified, or Special Make-to-Order Products. Approved returns result in an Exchange or Credit Note only, not a refund. Credit Note is valid for one (1) year from the date of issuance.",
  },
  {
    key: "10",
    question: "What are the conditions for complimentary free services?",
    answer:
      "We offer five years of complimentary services, strictly limited to the first five service events per piece of Jewellery. Services include cleaning, shining, and stone maintenance. The offer is immediately voided by any Client modification or alteration. The Client is responsible for all shipping and insurance costs associated with sending products to and from the service location.",
  },
  {
    key: "11",
    question: "How does SHREEJI GEMS handle claims related to product defects?",
    answer:
      "We are committed to the highest quality and will gladly assist with verifiable manufacturing defects. The Client must contact us immediately, or within two (2) calendar days of receiving the product, if a defect is suspected. However, SHREEJI GEMS cannot assist with claims such as missing parts, links, or stones that occur after delivery, or damages resulting from standard wear and tear, accidents, or unauthorized modifications. Our liability is limited exclusively to proven manufacturing defects present at the time of dispatch, and all other types of damage are excluded.",
  },
];

const ContactUs = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [cataloguesLoading, setCataloguesLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    message: "",
    agreeToTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch locations
        const locationsResponse = await contactUsAPI.getEnabledLocations({
          skip: 0,
          take: 50,
        });
        setLocations(locationsResponse?.list || []);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoading(false);
      }

      try {
        // Fetch events
        const eventsResponse = await contactUsAPI.getEnabledEvents({
          skip: 0,
          take: 50,
        });
        setEvents(eventsResponse?.list || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setEventsLoading(false);
      }

      try {
        // Fetch catalogues
        const cataloguesResponse = await contactUsAPI.getEnabledCatalogs({
          skip: 0,
          take: 50,
        });
        setCatalogues(cataloguesResponse?.list || []);
      } catch (error) {
        console.error("Failed to fetch catalogues:", error);
      } finally {
        setCataloguesLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: e.target.checked,
    }));
  };

  const handleDownloadPdf = (pdfUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenPdf = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    setSubmitting(true);
    try {
      // Handle form submission

      const modifiedData: ContactUsRequest = {
        ...formData,
        streetAddress: formData.address,
      };

      await authAPI.contactUs(modifiedData);

      // Reset form after successful submission
      setFormData({
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        message: "",
        agreeToTerms: false,
      });

      message.success("Message sent successfully!");
    } catch (error) {
      console.error("Failed to submit form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter out India and Australia from API locations
  const otherLocations = locations.filter(
    (loc) =>
      loc.country.toLowerCase() !== "india" &&
      loc.country.toLowerCase() !== "australia"
  );

  return (
    <div className={`bg-white ${garamond.className}`}>
      {/* Contact Form Section */}
      <div className="w-full mx-auto py-12 lg:py-16 md:px-0 px-3">
        <div className="text-center md:mb-12 mb-4">
          <h2
            className={`text-3xl font-bold text-brand-900 ${garamond.className}`}
          >
            Contact Us
          </h2>
        </div>

        {/* Contact Form */}
        <div className="mx-auto max-w-7xl bg-white md:p-10 p-4 md:rounded-2xl rounded-md shadow-lg border border-brand-50 mb-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3
                className={`text-lg font-semibold text-brand-900 mb-4 pb-2 border-b border-brand-100 ${garamond.className}`}
              >
                Personal Information
              </h3>
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label
                    className={`block text-sm font-medium text-brand-800 mb-2 ${garamond.className}`}
                  >
                    Title
                  </label>
                  <Input
                    placeholder="Mr. / Mrs. / Ms. / Dr."
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full h-12 rounded-lg"
                    size="large"
                  />
                </div>

                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium text-brand-800 mb-2 ${garamond.className}`}
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter your first name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-lg"
                      size="large"
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium text-brand-800 mb-2 ${garamond.className}`}
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter your last name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-lg"
                      size="large"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div>
              <h3
                className={`text-lg font-semibold text-brand-900 mb-4 pb-2 border-b border-brand-100 ${garamond.className}`}
              >
                Contact Details
              </h3>
              <div className="space-y-4">
                {/* Email and Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium text-brand-800 mb-2 ${garamond.className}`}
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-lg"
                      size="large"
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium text-brand-800 mb-2 ${garamond.className}`}
                    >
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-lg"
                      size="large"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div>
              <h3
                className={`text-lg font-semibold text-brand-900 mb-4 pb-2 border-b border-brand-100 ${garamond.className}`}
              >
                Address Information
              </h3>
              <div className="space-y-4">
                {/* Address */}
                <div>
                  <label
                    className={`block text-sm font-medium text-brand-800 mb-2 ${garamond.className}`}
                  >
                    Street Address
                  </label>
                  <Input
                    placeholder="Enter your street address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="h-12 rounded-lg"
                    size="large"
                  />
                </div>

                {/* City and Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium text-brand-800 mb-2 ${garamond.className}`}
                    >
                      City
                    </label>
                    <Input
                      placeholder="Enter your city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="h-12 rounded-lg"
                      size="large"
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium text-brand-800 mb-2 ${garamond.className}`}
                    >
                      Postal Code
                    </label>
                    <Input
                      placeholder="Enter postal code"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="h-12 rounded-lg"
                      size="large"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label
                    className={`block text-sm font-medium text-brand-800 mb-2 ${garamond.className}`}
                  >
                    Country
                  </label>
                  <Select
                    placeholder="Select your country"
                    value={formData.country || undefined}
                    onChange={(value) => handleSelectChange("country", value)}
                    className="w-full"
                    size="large"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={countries.map((country) => ({
                      label: country.name,
                      value: country.name,
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Message Section */}
            <div>
              <h3
                className={`text-lg font-semibold text-brand-900 mb-4 pb-2 border-b border-brand-100 ${garamond.className}`}
              >
                Your Message
              </h3>
              <div>
                <label
                  className={`block text-sm font-medium text-brand-800 mb-2 ${garamond.className}`}
                >
                  How can JE-Inspi help you?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <TextArea
                  placeholder="Tell us about your inquiry, requirements, or any questions you may have..."
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="rounded-lg"
                  size="large"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-brand-50 md:p-4 p-0 rounded-lg">
              <Checkbox
                checked={formData.agreeToTerms}
                onChange={handleCheckboxChange}
              >
                <span className={`text-sm text-brand-800 ${garamond.className}`}>
                  I agree to the{" "}
                  <span className="text-brand-600 font-medium">
                    terms & conditions
                  </span>{" "}
                  and understand that my data will be held securely in
                  accordance with the{" "}
                  <span className="text-brand-600 font-medium">
                    privacy policy
                  </span>
                </span>
              </Checkbox>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center md:pt-4 pt-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={!formData.agreeToTerms}
                className={`!cursor-pointer bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 hover:bg-gradient-to-br border-0 h-12 px-16 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 ${garamond.className}`}
                size="large"
              >
                Send Message
              </Button>
            </div>
          </form>
        </div>

        {/* Contact Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* India - Fixed */}
          <div className="space-y-4">
            <h3
              className={`text-xl font-semibold text-brand-900 mb-4 ${garamond.className}`}
            >
              India
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FiMapPin className="h-5 w-5 text-brand-700 mt-1 mr-3 flex-shrink-0" />
                <p
                  className={`md:text-[16px] text-[14px] text-brand-700 ${garamond.className}`}
                >
                  {INDIA_CONTACT.address}
                </p>
              </div>
              <div className="flex items-start">
                <FiMail className="h-5 w-5 text-brand-700 mt-1 mr-3 flex-shrink-0" />
                <p
                  className={`md:text-[16px] text-[14px] text-brand-700 ${garamond.className}`}
                >
                  {INDIA_CONTACT.email}
                </p>
              </div>
              <div className="flex items-start">
                <FiPhone className="h-5 w-5 text-brand-700 mt-1 mr-3 flex-shrink-0" />
                <p
                  className={`md:text-[16px] text-[14px] text-brand-700 ${garamond.className}`}
                >
                  {INDIA_CONTACT.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Austria - Fixed */}
          <div className="space-y-4">
            <h3
              className={`text-xl font-semibold text-brand-900 mb-4 ${garamond.className}`}
            >
              Austria
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FiMapPin className="h-5 w-5 text-brand-700 mt-1 mr-3 flex-shrink-0" />
                <p
                  className={`md:text-[16px] text-[14px] text-brand-700 ${garamond.className}`}
                >
                  {AUSTRALIA_CONTACT.address}
                </p>
              </div>
              <div className="flex items-start">
                <FiMail className="h-5 w-5 text-brand-700 mt-1 mr-3 flex-shrink-0" />
                <p
                  className={`md:text-[16px] text-[14px] text-brand-700 ${garamond.className}`}
                >
                  {AUSTRALIA_CONTACT.email}
                </p>
              </div>
              <div className="flex items-start">
                <FiPhone className="h-5 w-5 text-brand-700 mt-1 mr-3 flex-shrink-0" />
                <p
                  className={`md:text-[16px] text-[14px] text-brand-700 ${garamond.className}`}
                >
                  {AUSTRALIA_CONTACT.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Other Address - From API */}
          <div className="space-y-4">
            <h3
              className={`text-xl font-semibold text-brand-900 mb-4 ${garamond.className}`}
            >
            </h3>
            {loading ? (
              <p className={`text-sm text-brand-600 ${garamond.className}`}>
                Loading...
              </p>
            ) : otherLocations.length > 0 ? (
              <div className="space-y-6">
                {otherLocations.map((location) => (
                  <div key={location.id} className="space-y-3">
                    <div className="flex items-start">
                      <FiMapPin className="h-5 w-5 text-brand-700 mt-1 mr-3 flex-shrink-0" />
                      <p
                        className={`font-medium text-brand-900 ${garamond.className}`}
                      >
                        {location.country}
                      </p>
                    </div>
                    {location.address && (
                      <div className="flex items-start">
                        <FiMapPin className="h-5 w-5 text-brand-700 mt-1 mr-3 flex-shrink-0" />
                        <p
                          className={`md:text-[16px] text-[14px] text-brand-700 ${garamond.className}`}
                        >
                          {location.address}
                        </p>
                      </div>
                    )}
                    <div className="flex items-start">
                      <FiMail className="h-5 w-5 text-brand-700 mt-1 mr-3 flex-shrink-0" />
                      <p
                        className={`md:text-[16px] text-[14px] text-brand-700 ${garamond.className}`}
                      >
                        {location.email}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <FiPhone className="h-5 w-5 text-brand-700 mt-1 mr-3 flex-shrink-0" />
                      <p
                        className={`md:text-[16px] text-[14px] text-brand-700 ${garamond.className}`}
                      >
                        {location.countryCode} {location.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-sm text-brand-600 ${garamond.className}`}>

              </p>
            )}
          </div>
        </div>

        {/* Events Section */}
        <div id="events-section" className="md:pt-16 pt-14 scroll-mt-20 w-full">
          <div className="text-center md:mb-12 mb-8">
            <h2
              className={`text-3xl font-bold text-brand-900 ${garamond.className}`}
            >
              Events
            </h2>
          </div>

          {eventsLoading ? (
            <p className={`text-center text-brand-600 ${garamond.className}`}>
              Loading events...
            </p>
          ) : events.length > 0 ? (
            <div className="relative w-full mx-auto md:px-20 px-0">
              {/* Custom Arrow Buttons */}
              <style jsx global>{`
                .events-carousel .slick-prev,
                .events-carousel .slick-next {
                  width: 40px;
                  height: 40px;
                  z-index: 10;
                }
                .events-carousel .slick-prev {
                  left: -60px;
                }
                .events-carousel .slick-next {
                  right: -60px;
                }
                .events-carousel .slick-prev:before,
                .events-carousel .slick-next:before {
                  display: none;
                }

                /* Slick dots customization */
                .events-carousel .slick-dots li button:before {
                  font-size: 10px;
                  color: #aec2a4; /* brand-300 for inactive */
                  opacity: 0.6;
                }

                .events-carousel .slick-dots li.slick-active button:before {
                  color: #6b8965; /* brand-400 (active) */
                  opacity: 1;
                }
              `}</style>
              <Carousel
                autoplay
                dots={true}
                arrows
                className="events-carousel"
                prevArrow={
                  <div className="md:flex hidden items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:bg-brand-50 cursor-pointer">
                    <IoChevronBack className="h-6 w-6 text-brand-900" />
                  </div>
                }
                nextArrow={
                  <div className="md:flex hidden items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:bg-brand-50 cursor-pointer">
                    <IoChevronForward className="h-6 w-6 text-brand-900" />
                  </div>
                }
              >
                {events.map((event) => (
                  <div key={event.id}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4">
                      {/* Event Image */}
                      <div className="relative h-[400px] rounded-lg overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Event Details */}
                      <div className="space-y-4">
                        <h3
                          className={`text-2xl font-bold text-brand-900 ${garamond.className}`}
                        >
                          {event.title}
                        </h3>
                        <p
                          className={`text-brand-700 leading-relaxed md:text-[16px] text-[14px] ${garamond.className}`}
                        >
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          ) : (
            <p className={`text-center text-brand-600 ${garamond.className}`}>
              No events available
            </p>
          )}
        </div>

        {/* Catalogue Section */}
        <div
          id="catalogue-section"
          className="bg-white md:mt-16 mt-14 w-full pb-5"
        >
          <div className="text-center md:mb-12 mb-8">
            <h2
              className={`text-3xl pt-5 font-bold text-brand-900 ${garamond.className}`}
            >
              Catalogue
            </h2>
          </div>

          {cataloguesLoading ? (
            <p className={`text-center text-brand-600 ${garamond.className}`}>
              Loading catalogues...
            </p>
          ) : catalogues.length > 0 ? (
            <div className="relative w-full mx-auto md:px-20 px-0">
              {/* Custom Arrow Buttons */}
              <style jsx global>{`
                .catalogue-carousel .slick-prev,
                .catalogue-carousel .slick-next {
                  width: 40px;
                  height: 40px;
                  z-index: 10;
                }
                .catalogue-carousel .slick-prev {
                  left: -60px;
                }
                .catalogue-carousel .slick-next {
                  right: -60px;
                }
                .catalogue-carousel .slick-prev:before,
                .catalogue-carousel .slick-next:before {
                  display: none;
                }
                /* Catalogue slick dots */
                .catalogue-carousel .slick-dots li button:before {
                  font-size: 10px;
                  color: #aec2a4; /* brand-300 (inactive) */
                  opacity: 0.5;
                }

                .catalogue-carousel .slick-dots li.slick-active button:before {
                  color: #6b8965; /* brand-400 (active) */
                  opacity: 1;
                }
              `}</style>
              <Carousel
                autoplay
                dots={true}
                slidesToShow={4}
                slidesToScroll={1}
                arrows
                className="catalogue-carousel"
                prevArrow={
                  <div className="md:flex hidden items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:bg-brand-50 cursor-pointer">
                    <IoChevronBack className="h-6 w-6 text-brand-900" />
                  </div>
                }
                nextArrow={
                  <div className="md:flex hidden items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:bg-brand-50 cursor-pointer">
                    <IoChevronForward className="h-6 w-6 text-brand-900" />
                  </div>
                }
                responsive={[
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 3,
                    },
                  },
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 2,
                    },
                  },
                  {
                    breakpoint: 480,
                    settings: {
                      slidesToShow: 1,
                    },
                  },
                ]}
              >
                {catalogues.map((catalogue) => (
                  <div key={catalogue.id} className="px-3">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      {/* Cover Image - Clickable */}
                      <div
                        className="relative h-64 cursor-pointer"
                        onClick={() => handleOpenPdf(catalogue.pdfUrl)}
                      >
                        <Image
                          src={catalogue.coverImage}
                          alt={catalogue.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Catalogue Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`text-lg font-semibold text-brand-900 truncate ${garamond.className}`}
                          >
                            {catalogue.name}
                          </h3>
                          <button
                            onClick={() =>
                              handleDownloadPdf(
                                catalogue.pdfUrl,
                                catalogue.name
                              )
                            }
                            className="flex items-center gap-2 text-brand-600 hover:text-brand-700 transition-colors"
                          >
                            <FiDownload className="h-5 w-5" />
                            <span
                              className={`text-sm font-medium ${garamond.className}`}
                            >
                              Download
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          ) : (
            <p className={`text-center text-brand-600 ${garamond.className}`}>
              No catalogues available
            </p>
          )}
        </div>

        {/* FAQ Section */}
        <div
          id="faq-section"
          className="md:pt-16 pt-14 scroll-mt-20 flex flex-col justify-center items-center"
        >
          <div className="text-center md:mb-12 mb-8">
            <h2
              className={`text-3xl font-bold text-brand-900 ${garamond.className}`}
            >
              FAQ
            </h2>
          </div>

          <Collapse
            accordion
            expandIconPosition="end"
            expandIcon={({ isActive }) => (
              <PlusOutlined
                style={{
                  fontSize: "20px",
                  transform: isActive ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}
              />
            )}
            className="bg-white border-0 max-w-7xl "
            items={FAQ_DATA.map((faq) => ({
              key: faq.key,
              label: (
                <span
                  className={`md:text-[16px] text-[14px] font-medium text-brand-900 ${garamond.className}`}
                >
                  {faq.question}
                </span>
              ),
              children: (
                <p
                  className={`text-brand-700 md:text-[16px] text-[14px] leading-relaxed ${garamond.className}`}
                >
                  {faq.answer}
                </p>
              ),
              style: {
                // marginBottom: '16px',
                // border: '1px solid #cbd9c3',
                borderRadius: "8px",
                overflow: "hidden",
              },
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
