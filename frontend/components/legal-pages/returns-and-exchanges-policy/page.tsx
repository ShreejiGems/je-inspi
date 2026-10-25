"use client";
import React from "react";
import Footer from "../../common/footer";
import Navbar from "@/components/common/navbar";
import { garamond } from "@/src/common/helper";

const ReturnsAndExchangesPolicy = () => {
  return (
    <>
      <Navbar />
      <div className={`min-h-screen bg-brand-50 ${garamond.className}`}>
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-brand-900">
              Returns & Exchanges Policy
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
              <p className="text-brand-800 leading-relaxed mb-6">
                This provision details the guidelines for returns, exchanges,
                and credit note for purchases made from SHREEJI GEMS.
              </p>

              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                Right of Withdrawal
              </h2>
              <p className="text-brand-800 leading-relaxed mb-6">
                You have the right to withdraw from this contract within 15 days
                without providing any reason. The withdrawal period is 15 days
                from the day you or a third party designated by you, who is not
                the carrier, takes possession of the goods. To meet the
                withdrawal deadline, it is sufficient for you to withdraw before
                the withdrawal period has expired.
              </p>

              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                Conditions for Returns, Exchanges, and Credit note
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                To be eligible for a return, exchange, or credit note, a request
                must be initiated through our website within 15 days of
                receiving your SHREEJI GEMS item. Proof of purchase is required.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Items must be returned in their original, unused condition,
                including all protective materials, invoices, certificates (if
                applicable), packaging, tags, and stickers. All complimentary
                items received with the purchase must also be returned.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Returns and exchanges are strictly limited to Standard Inventory
                Orders that have not commenced shipment. Special Make-to-Order
                Products are ineligible for return, exchange, or cancellation
                due to the bespoke nature of production. To initiate an eligible
                return, the Client must obtain prior written approval from the
                Sales Facilitator via the Website’s Contact Us page. Approved
                returns are processed as a Credit Note applied to the Client’s
                account, which is valid for a period of one (1) year from
                issuance, after which it automatically expires without liability
                to SHREEJI GEMS. Furthermore, the return option is limited to
                orders shipped to and returned from the countries listed on our
                Contact Us page, and the Client must ship the Goods back to the
                original dispatch location using an insured, verifiable method
                that ensures secure transit
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                All costs associated with the return of eligible Goods,
                including but not limited to insurance, shipping, courier fees,
                import/export costs, customs clearance costs, duties, tariffs,
                and any applicable sales tax (e.g., VAT/GST) on the returned
                Goods, shall be borne exclusively by the Client. The Client is
                solely responsible for arranging the secure, fully insured
                logistics of the return shipment. The Client shall retain full
                responsibility for the Goods and liability for any loss or
                damage until the moment the shipment is officially received and
                physically accepted by the Sales Facilitator at the original
                dispatch location. SHREEJI GEMS reserves the right to refuse
                returns of items that show signs of wear, use, or alteration.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Engraved, embossed, modified, customized, or made-to-order items
                are not eligible for return, exchange, refund and credit notes.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The right to return or exchange under this policy is limited to
                the initial transaction originating from a purchase order. Any
                item that has been previously returned or exchanged is excluded
                from further return or exchange consideration.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                We will verify that the returned product satisfies the
                conditions of the Returns and Exchanges Policy and, if so, then
                proceed with the applicable credit note or exchange.
              </p>
              <p className="text-brand-800 leading-relaxed mb-6 text-justify">
                All returns will be subject to strict mandatory quality control
                inspection by us to ensure that the returned products satisfy
                these requirements. If the products do not meet QC standards, we
                will refuse the return, and the products will be returned to
                you. If the returned product satisfies QC, we will proceed with
                the applicable credit note or exchange. Failure to comply with
                these Conditions of Sale will entitle us to refuse the returned
                product and send it back to you, at your own cost.
              </p>

              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                Return, Exchange, or Credit Note Process
              </h2>
              <p className="text-brand-800 leading-relaxed mb-6 text-justify">
                To request a return, exchange, or Credits for purchase, you must complete the request form on
                our website’s contact us within 15 days of receiving your item. You will receive a Return
                Authorization Number via email.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Following the receipt of the formal email confirming return approval, the Client must dispatch
                the eligible Goods directly to the original dispatch location specified by the Sales Facilitator. The
                Client is responsible for ensuring the return address label precisely matches the address provided
                in the return confirmation email. Upon arrival at our facility, the returned item(s) will undergo a
                quality control inspection, which typically takes 7-10 working days. Following the successful
                completion of the inspection and verification process, the Client will receive a formal email
                notification from the Sales Facilitator confirming one of two outcomes: the issuance of a Credit
                Note against the value of the returned Goods, or authorization for an exchange for other products
                of equivalent value.
              </p>
              <p className="text-brand-800 leading-relaxed mb-6">
                Exchanges are subject to product availability.
              </p>

              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                Credit note validity & Conditions
              </h2>
              <p className="text-brand-800 leading-relaxed mb-6 text-justify">
                If the Client chooses a Credit Note against approved returned
                Goods, the Credit Note's value shall be strictly calculated
                based on the Base Purchase Price of the returned items. The Base
                Purchase Price is defined as the product's price exclusive of
                any original or incurred logistical and transactional costs,
                including but not limited to shipping, insurance, courier fees,
                import/export costs, customs clearance charges, duties, tariffs,
                and any applicable sales tax. All such expenses shall be
                deducted from the Credit Note. The resulting Credit Note shall
                be applied to the Client's account for future purchases and is
                valid for a period of one (1) year from the date of issuance,
                after which it will automatically expire without liability to
                SHREEJI GEMS.
              </p>

              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                Rejected Returns
              </h2>
              <p className="text-brand-800 leading-relaxed mb-6 text-justify">
                If a returned item does not pass quality control or meet the
                return conditions, it will be returned to you. You will be
                responsible for all shipping and insurance costs (both outbound
                and return).
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                CONTACT US
              </h2>
              <div className="bg-brand-50 p-6 rounded-lg">
                <p className="font-semibold text-brand-900 mb-2 text-justify">
                  For any inquiries or feedback regarding these policy, or other matters, please contact us using the
                  information below:
                </p>
                <p className="font-semibold text-brand-900 mb-2 text-justify">SHREEJI GEMS</p>
                <p className="text-brand-800 text-justify">
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

export default ReturnsAndExchangesPolicy;
