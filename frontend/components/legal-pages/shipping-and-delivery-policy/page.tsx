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
            <h1 className="text-3xl font-bold text-brand-900">
              Shipping & Delivery Policy
            </h1>
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
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS facilitates delivery to the countries specified
                during the Order Process. Please be aware that certain locations
                may be excluded from our delivery service. Please note that, for
                security and logistical reasons, we do not deliver to military
                addresses, restricted areas, pick-up points, or PO boxes. For
                comprehensive details regarding delivery destinations and any
                potential restrictions, please consult our customer service
                team. Delivery is provided at no cost to the customer. All
                shipments are fully insured and include tracking. Currently,
                SHREEJI GEMS exclusively offers delivery to addresses within the
                list of countries specified on our Contact Us page. If the
                Client requires shipment to a location outside the countries
                listed on our Contact Us page, we invite the Client to contact
                the Sales Facilitator to discuss specific needs and to arrange
                for a special, mutually agreed-upon delivery agreement. Dispatch
                of the order will be initiated immediately following the
                successful receipt of the full advance payment for the
                corresponding Standard Inventory or Special Make-to-Order
                Products. Where a Client's order includes multiple Goods, the
                Sales Facilitator shall consolidate the shipment. This means the
                complete order will be dispatched as a single delivery and only
                once all items are manufactured, available, and have passed
                final quality control checks. The Client acknowledges that this
                consolidated approach means the delivery date will be determined
                by the item with the longest lead time.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS endeavors to facilitate timely delivery of your
                order using reputable carriers (FedEx, DHL, Malca Amit, Brinks,
                etc.). Given that the majority of SHREEJI GEMS Goods are
                manufactured on a Make-to-Order basis, the estimated production
                period is typically fifteen (15) to twenty (20) working days
                from the date of Order Acceptance. This estimated timeframe is
                subject to increase and is directly dependent upon the quantity
                of items ordered, the complexity of the design, and any specific
                Customized requirements; consequently, Customized or bespoke
                pieces typically require a longer production timeframe, which
                may extend to three (3) to four (4) weeks or more. The estimated
                delivery window commences only after the completion of the
                production period and receipt of full payment, and SHREEJI GEMS
                is not responsible for courier delays. Furthermore, all
                production and delivery dates provided are estimates only and
                shall not be deemed binding commitments, and the Sales
                Facilitator is not liable for any losses or damages incurred by
                the Client due to reasonable delays in manufacturing or
                delivery. If expedited delivery is necessary, please contact us,
                and we will explore available options to meet your needs. In any
                event, your sole remedy for any failure by us to deliver the
                order to you shall be your right to cancel the relevant order
                and receive a refund of sums you pre-paid us for any products
                which you have not received. When estimating your delivery time,
                please allow time for credit approval, address verification,
                security checks and order processing. Please note that delivery
                is always subject to receiving your full payment.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                For order collection at any SHREEJI GEMS Premises, the
                individual authorized to collect the order must be a duly
                authorized representative of the Client. To ensure secure
                handover, this representative must present a valid
                government-issued photo identification (ID) that clearly matches
                the name of the representative officially designated for
                collection in the Client Account or in the confirmed Purchase
                Order. Collection will not be permitted without successful
                verification. When the Client elects to collect the Goods
                directly from any SHREEJI GEMS Premises, the purchase price is
                exclusive of any applicable local taxes, import duties, or fees
                that may be assessed by the country of the collection premises
                (e.g., import duty, clearance cost, local Value Added Tax/VAT in
                Austria). The Client is solely responsible for timely
                declaration and remittance of any such taxes or duties arising
                from the collection or subsequent movement of the Goods.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Shreeji Gems is not liable for delays or damages caused by
                third-party carriers, customs, or acts beyond our control.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                CONTACT US
              </h2>
              <div className="bg-brand-50 p-6 rounded-lg">
                <p className="font-semibold text-brand-900 mb-2">
                  For any inquiries or feedback regarding these policy, or other
                  matters, please contact us using the information below:
                </p>
                <p className="font-semibold text-brand-900 mb-2">SHREEJI GEMS</p>
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
