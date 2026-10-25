"use client";
import React from "react";
import Footer from "../../common/footer";
import Navbar from "@/components/common/navbar";
import { garamond } from "@/src/common/helper";

const ConditionsOfSale = () => {
  return (
    <>
      <Navbar />
      <div className={`min-h-screen bg-brand-50 ${garamond.className}`}>
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-brand-900">
              Conditions Of Sale
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
              <p className="text-brand-800 leading-relaxed text-justify">
                We may revise these Conditions of Sale periodically, so we
                advise reviewing them regularly to stay informed of any updates.
                The most current version will always be accessible on the
                SHREEJI GEMS website (<a href="https://www.shreejigems.co.in" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">www.shreejigems.co.in</a>). Any revised
                edition of these Conditions of Sale will take effect immediately
                from the date of posting and will govern all orders for products
                or services placed from that time forward. Modifications to the
                Conditions of Sale after you have placed an order will not
                impact that particular transaction and your relationship with
                us, except where legally mandated.
              </p>
            </section>

            {/* About Section */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                ABOUT SHREEJI GEMS AND THESE CONDITIONS OF SALE
              </h2>
              <p className="text-brand-800 leading-relaxed text-justify mb-4">
                "SHREEJI GEMS" is a Diamond and Jewelry Manufacturing Company,
                with its principal place of business (Head Office) located at
                4th Floor, Office No-A, 401, Pramukh Building, Nandu Doshini
                Wadi, Katargam, Surat, Gujarat, 395004, India. SHREEJI GEMS is
                responsible for the operation and management of the Website,
                <a href="https://www.shreejigems.co.in" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">www.shreejigems.co.in</a>.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS maintains a branch office, officially named SHREEJI
                GEMS Zweigniederlassung Österreich, located at Promenade 23,
                4020, Linz, Austria, for the purpose of managing and conducting
                business operations within the European Union member states.
              </p>

              <div className="bg-brand-50 p-4 rounded-lg mb-4 text-justify">
                <h3 className="font-semibold text-brand-900 mb-2">
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
                <h3 className="font-semibold text-brand-900 mb-2">
                  Details of SHREEJI GEMS Zweigniederlassung Österreich:
                </h3>
                <ul className="list-disc list-inside text-brand-800 space-y-1">
                  <li>Firmenbuch-Nr: 632291 s</li>
                  <li>VAT/UID NO: ATU81189526</li>
                  <li>EUID: ATBRA.632291-001</li>
                  <li>EORI: ATEOS1000152756</li>
                  <li>Steuernummer: 46 584/5600</li>
                </ul>
              </div>

              <p className="text-brand-800 leading-relaxed mt-4 text-justify">
                These Conditions of Sale (hereinafter referred to as the
                "Conditions") apply to all transactions for SHREEJI GEMS
                products (referred to collectively as the "Goods," "Diamond(s),"
                or "Jewellery" throughout these Conditions) or services (or
                “Repair”) that you (the "User" or "you" or "your" "client" or
                “buyer” or “customer”) initiate with our Sales Facilitator
                through any of our Sales Channels. For the purposes of these
                Conditions, "Sales Channels" shall include the Website, physical
                retail stores, Events, Exhibitions, or any other SHREEJI GEMS
                Premises that reference these Conditions of Sale.
              </p>
              <p className="text-brand-800 leading-relaxed mt-4 text-justify">
                The terms "SHREEJI GEMS," "SHREEJI GEMS Zweigniederlassung
                Österreich," "we," "us," and "our" refer to the contracting
                entity responsible for your transaction, hereinafter referred to
                as the "Sales Facilitator."
              </p>
              <p className="text-brand-800 leading-relaxed mt-4 mb-2 text-justify">
                Identity of the Sales Facilitator: The identity of the Sales
                Facilitator responsible for the sale and service of the Goods to
                you is determined by the Delivery Address for your shipment:
              </p>
              <ul className="list-disc list-inside text-brand-800 space-y-2 ml-4">
                <li>
                  For shipments delivered within the European Union member
                  states, the Sales Facilitator is SHREEJI GEMS
                  Zweigniederlassung Österreich (Branch Office).
                </li>
                <li>
                  For shipments delivered to all other jurisdictions (including
                  India and the rest of the world), the Sales Facilitator is
                  SHREEJI GEMS (Head Office).
                </li>
              </ul>
              <p className="text-brand-800 leading-relaxed mt-4 text-justify">
                By finalizing an order, you consent to be bound by our Terms of
                Use, Privacy Policy, and Cookie Policy, all of which are
                integrated into these Conditions of Sale. Please carefully
                examine these Conditions of Sale. They are applicable to every
                order made via our Sales Channels. Your agreement to these
                Conditions of Sale is required before placing an order for any
                products or services. If you disagree with these Conditions of
                Sale, you will not be able to order any products or services
                through the Sales Channels.
              </p>
            </section>

            {/* Purchasing Eligibility */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                PURCHASING ELIGIBILITY
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Orders placed through our Sales Channels are strictly restricted
                to entities purchasing for business, wholesale, or commercial
                purposes only (excluding natural persons purchasing for personal
                use). By placing an order, the purchasing entity ("Client")
                represents and warrants to the Sales Facilitator that it meets
                the following essential criteria:
              </p>
              <ul className="list-disc list-inside text-brand-800 space-y-2 ml-4">
                <li>
                  The Client is a legally formed, validly existing, and duly
                  authorized Business Entity (such as a corporation,
                  partnership, or limited liability company) in its jurisdiction
                  of incorporation.
                </li>
                <li>
                  The individual executing the order possesses the necessary
                  corporate authority to legally bind the Client to these
                  Conditions of Sale.
                </li>
                <li>
                  The Client possesses the required commercial licenses,
                  permits, and tax registrations necessary for the legal
                  operation of its business.
                </li>
                <li>
                  The Client provides a valid commercial shipping address
                  located within our current delivery areas.
                </li>
              </ul>
            </section>

            {/* Order Acceptance */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                ORDER ACCEPTANCE
              </h2>
              <p className="text-brand-800 leading-relaxed text-justify">
                All confirmed orders must be paid in full and in advance before
                the commencement of manufacturing or shipment. Prices are
                non-negotiable and shall be deemed confirmed only upon the Sales
                Facilitator's formal Order Acceptance. We reserve the right to
                correct any errors, inaccuracies, or omissions (including but
                not limited to pricing, product descriptions, or inventory
                levels) even after a Client has placed an order; should such a
                correction affect a pending order, the Client will be notified
                and given the option to reconfirm the order at the correct terms
                or receive a full refund. Any additional services requested by
                the Client outside the scope of the confirmed order will incur
                separate, agreed-upon charges and will be invoiced accordingly.
                Furthermore, the confirmation and acceptance of any order by the
                Sales Facilitator is strictly subject to the final availability
                of the required raw materials, components, or Standard Inventory
                products. SHREEJI GEMS reserves the absolute right to reject,
                refuse, or cancel an order for any reason, including suspected
                breach of these Conditions or errors/omissions in the
                information provided by the Client. If SHREEJI GEMS cancels an
                order after the Client's payment has been processed, we will
                issue a full refund to the Client in the amount of the purchase
                price, provided no Special Make-to-Order production has
                commenced. Finally, once an order has been placed by the Client,
                the specifications or quantity cannot be changed. Cancellation
                may only be requested for Standard Inventory orders and is only
                possible if shipment processing has not yet commenced.
                Currently, SHREEJI GEMS exclusively accept orders to addresses
                within the list of countries specified on our Contact Us page.
              </p>
            </section>

            {/* PRODUCT AVAILABILITY & QUANTITY
             */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                PRODUCT AVAILABILITY & QUANTITY
              </h2>
              <p className="text-brand-800 leading-relaxed text-justify">
                All orders placed through the Sales Channels are subject to
                availability and our acceptance. Products shown on the Website
                that cannot be added to the shopping bag are not available for
                purchase through the Website. Our customer service can offer
                more details about such items. Order quantities for certain
                products may be limited. We retain the right to reject orders
                that exceed a specific number of authorized products at any time
                and without prior notification.
              </p>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                ACCOUNT REGISTRATION
              </h2>
              <p className="text-brand-800 leading-relaxed text-justify">
                To initiate an order or obtain a quotation, the Client must
                first register and establish an official Client Account through
                our Website or other Sales Channels. This process requires the
                provision of all mandatory business and contact details, which
                are necessary for the purposes of verification and legal
                compliance.
              </p>
            </section>

            {/* MANDATORY COMMUNICATION CHANNEL */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                MANDATORY COMMUNICATION CHANNEL
              </h2>
              <p className="text-brand-800 leading-relaxed text-justify">
                All formal inquiries, notifications, and communications related
                to these Conditions of Sale, including but not limited to
                claims, warranty requests, and declarations of intent, must be
                initiated by the Client exclusively through the designated
                contact forms and submission processes on the SHREEJI GEMS
                Website.
              </p>
            </section>

            {/* Customized Orders */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                CUSTOMIZED OR MAKE-TO-ORDERS
              </h2>
              <p className="text-brand-800 leading-relaxed text-justify">
                SHREEJI GEMS provides customized, make-to-order services. If you
                wish to place a customized order, you will be required to
                provide specific details through our Sales Channels. We reserve
                the right to decline any customized order that includes language
                or designs that are objectionable, unlawful, or contrary to our
                policies. It is your responsibility to ensure that all
                specifications provided for customized orders are accurate and
                complete. Due to the bespoke nature of these items, customized
                orders cannot be canceled for any reason, and these products,
                having been created according to your unique specifications, are
                not eligible for return or exchange.
              </p>
            </section>

            {/* Customized Orders */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                ORDER PROCESS
              </h2>
              <p className="text-brand-800 leading-relaxed text-justify">
                When placing an order through our Sales Channels (website), the
                following steps will guide you:
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                To initiate any transaction, access account history, or view
                proprietary commercial pricing, the Client is required to
                authenticate their identity by logging into their existing
                SHREEJI GEMS Client Account.
              </p>
              <ul className="list-disc list-inside text-brand-800 mb-4 space-y-2 ml-4">
                <li className="text-brand-800 leading-relaxed text-justify">
                  Product Selection and Addition: Begin by exploring our
                  collections. Once you've found an item you love, add it to
                  your virtual shopping bag. Feel free to browse further and add
                  more items, keeping in mind that product availability and
                  quantity limits may apply. Please note: Adding a product to
                  your bag does not reserve it; confirmation only occurs upon
                  shipment.
                </li>
                <li className="text-brand-800 leading-relaxed text-justify">
                  Initiating Checkout: When you're ready to complete your
                  purchase, proceed to checkout. At this stage, you may also
                  modify the contents of your shopping bag
                </li>
                <li className="text-brand-800 leading-relaxed text-justify">
                  Order Details and Payment: During checkout, you'll be prompted
                  to enter and verify your shipping and billing information, as
                  well as your preferred payment method. It's important to
                  carefully review all these details before submitting your
                  order to ensure accuracy.
                </li>
                <li className="text-brand-800 leading-relaxed text-justify">
                  Order Confirmation: After reviewing your order, you'll be able
                  to finalize it.
                </li>
              </ul>
              <p className="text-brand-800 leading-relaxed">
                SHREEJI GEMS reserves the right to decline, cancel, or terminate
                orders at our discretion for legitimate reasons. This may
                include situations involving payment disputes from previous
                transactions or suspected fraudulent activity.
              </p>
            </section>

            {/* Prices and Shipping */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                PRICES, TAXES, AND SHIPPING COSTS
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The cost of each item is clearly presented on the Website or
                provided by our dedicated customer service team. SHREEJI GEMS is
                pleased to offer complimentary delivery on all orders. The price
                will be displayed in the Designated Transaction Currency, which
                is the single, appropriate currency unit for all international
                transactions. This price will be readily visible in your
                shopping cart before the Client finalizes the purchase. It is
                your responsibility to carefully review the price and currency
                details before completing the transaction.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                It's important to note that sales taxes, usage taxes, or other
                fiscal impositions may vary depending on where the products are
                being shipped.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                We retain the authority to adjust product prices at our
                discretion, without any prior notice. We are committed to
                providing precise pricing information; however, occasional
                discrepancies may occur. In the event of a pricing error, we
                will make every effort to contact you promptly to inform you of
                the correct details. If we are unable to establish contact using
                the information you provided during the order process, the
                affected portion of the order will be canceled, and you will be
                notified in writing. If we inadvertently accept and process an
                order where a pricing error has occurred, we reserve the right
                to cancel the order and issue a full refund of any payments
                made.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Please be aware that alterations to applicable tax legislation
                between the date of your order and the date you receive a
                written Confirmation of Order & Shipment may lead to
                modifications in the taxes applied to your order. Should this
                result in an increase in your tax liability, we will contact you
                to request your reconfirmation of the order.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The Sales Facilitator reserves the absolute right to decline, at
                its sole discretion, shipments to specific international
                destinations or addresses that pose unacceptable risks, are
                outside our established courier network, or are subject to trade
                restrictions. The Client is solely responsible for all local
                clearance costs, including, but not limited to, customs duties,
                tariffs, local taxes, import fees, and final mile delivery
                charges imposed by the destination jurisdiction; these charges
                are separate from, and not included in, the purchase price of
                the Goods and will be borne exclusively by the Client. Once an
                order has been formally picked up by the designated courier for
                shipment (the "Shipment Date"), the order status is final and
                cannot be cancelled for any reason. Furthermore, risk of loss
                and title for the Goods transfer from the Sales Facilitator to
                the Client upon the Shipment Date, at the point the courier
                takes possession of the shipment at our facility (Ex Works/FCA
                Incoterms apply, unless otherwise agreed in writing).
              </p>
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                PAYMENT
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                We accept the methods of payment identified as part of the order
                process via the Sales Channels. Depending upon the means of
                payment, we may require additional information, including
                specific forms of identification. When ordering on the Website,
                you will need to enter your payment details on the provided
                form. All payment card holders are subject to validation check
                and authorization by the card issuer. If the issuer of your
                payment card refuses to authorize payment to us, you will need
                to contact your card issuer directly.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                You expressly permit us to conduct security checks as necessary,
                to transmit or obtain information (including any updated
                information) from third parties, including your payment card
                details, to verify your identity, validate your payment card,
                secure initial payment authorization, and approve individual
                purchase transactions.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                If you use a credit/debit card or another instant payment method
                offered on the Website, your payment may be processed
                immediately after order placement. Pre-payment does not affect
                your legal rights under these Conditions of Sale, including any
                refund rights. Once your order is dispatched, you will receive a
                shipment confirmation. If we fail to meet our shipping/delivery
                obligations, we will notify you via email, and the pre-payment
                will be refunded promptly.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                We may accept bank wire transfer for orders at our sole
                discretion. We do not charge a fee for bank wire transfers for
                orders made through the Sales Channels. However, some financial
                institutions may charge a fee for using a bank wire transfer. We
                may acknowledge a bank wire transfer order, but the order will
                not be processed until the payment has been received and
                confirmed by us by e-mail. If your wire transfer payment is not
                credited into our bank account within seven (7) days after you
                have placed your order, your order will be cancelled.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                To facilitate your transaction experience, SHREEJI GEMS partners
                with various secure, third-party payment processing platforms,
                including but not limited to Klarna, PayPal, Airpay, Razorpay,
                Apple Pay, and Google Pay. The availability of these services is
                subject to change without prior notice. The Client explicitly
                acknowledges that these platforms operate under their own
                independent Terms of Service and Privacy Policies. It is the
                Client's responsibility to thoroughly review and comply with the
                terms and conditions of the selected payment platform. SHREEJI
                GEMS is not responsible for any procedural delays, denials of
                service, or issues arising from the operation, policies, or
                specific refund procedures of any third-party payment processor,
                including those applicable to Klarna transactions.
              </p>
            </section>

            {/* Shipping & Delivery */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                ACKNOWLEDGEMENT OF ORDER & INVOICES
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Following the placement of your order through our Sales
                Channels, you will receive an initial order summary. This
                communication confirms that your order has been received and is
                being processed within our systems. Please note that this
                initial summary does not constitute formal order acceptance.
                Formal acceptance of your order will occur when we dispatch the
                products and send you a Confirmation of Order & Shipment
                notification. This confirmation will include details such as
                shipment tracking information and a final invoice. You will
                receive an invoice that will be sent to you in writing (to your
                e-mail address as a PDF attachment or otherwise).
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS reserves the right to decline or cancel orders for
                reasons including, but not limited to:
              </p>
              <ul className="list-disc list-inside text-brand-800 mb-4 ml-4">
                <li>Product unavailability</li>
                <li>Pricing errors</li>
                <li>Suspicion of fraudulent activity</li>
                <li>Inability to process payment</li>
                <li>Non-compliance with these Conditions of Sale</li>
              </ul>
              <p className="text-brand-800 leading-relaxed text-justify">
                In the event that we cancel your order, we will notify you using the contact information you
                provided and issue a full refund of any payments received.
              </p>
            </section>

            {/* DISCRETIONARY DISCOUNTS AND PROMOTIONAL OFFERS */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                DISCRETIONARY DISCOUNTS AND PROMOTIONAL OFFERS
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                All discounts, sales, promotional offers, and pricing
                adjustments are granted solely at the absolute and
                non-negotiable discretion of SHREEJI GEMS. Eligibility for any
                offered discount is determined by SHREEJI GEMS based on an
                internal assessment of various commercial parameters, including,
                but not limited to, the Client’s order history and volume. The
                Client expressly acknowledges that the availability,
                continuation, and terms of any discount are entirely subject to
                the unilateral decision of the Sales Facilitator and do not
                constitute a binding right or precedent for future transactions.
              </p>
            </section>

            {/* Shipping & Delivery */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                SHIPPING & DELIVERY POLICY
              </h2>
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
              <p className="text-brand-800 leading-relaxed text-justify">
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
              <p>
                Shreeji Gems is not liable for delays or damages caused by
                third-party carriers, customs, or acts beyond our control.
              </p>
            </section>

            {/* Service Repair */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                CONDITIONS OF SERVICE REPAIR
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                This provision, referred to herein as the "Conditions of
                Service," outlines the definitive contractual terms and
                conditions governing all After-Sales Services and repair work
                provided by SHREEJI GEMS to the Client. We may modify these
                Service Repair Conditions periodically. The most current version
                will always be available on the SHREEJI GEMS website. Any
                updated version of these Conditions of Service will take effect
                immediately upon posting and will govern any service requests
                made from that date forward. Changes to these conditions after
                you have placed a service order will not affect that order,
                except where required by law.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                These Service Repair Conditions apply to any after-sales
                services, including repairs, paid service and complimentary
                services ("Services"), requested from SHREEJI GEMS through the
                SHREEJI GEMS website (<a href="https://www.shreejigems.co.in" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">www.shreejigems.co.in</a>), contacting SHREEJI
                GEMS client support, or visiting a SHREEJI GEMS premises. The
                provided information shall be true, accurate and not misleading,
                as it will be used as a reference for the Services.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                These Conditions of Service Repair are important and should be
                read thoroughly, as they are applicable to all Services and
                Service Orders placed. Acceptance of these Conditions of Service
                Repair is mandatory before placing a Service Order. If you do
                not agree to these Conditions of Service Repair, you are
                prohibited from ordering Services through the Service Channels.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Preamble
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                These Conditions of Service Repair (hereinafter referred to as
                "Conditions") delineate the terms and conditions governing the
                provision of after-sales services, including repairs and
                complimentary services ("Services") by SHREEJI GEMS to its
                clientele. It is crucial to understand that these Conditions
                constitute a legally binding agreement between the customer
                seeking such Services and SHREEJI GEMS. The customer is strongly
                advised to meticulously review these Conditions prior to
                engaging any Service, as the submission of a Service request
                shall be interpreted as an unequivocal acceptance of these
                Conditions in their entirety. Should the customer not accede to
                these Conditions, they shall be precluded from availing
                themselves of the Services offered by SHREEJI GEMS.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Legal Eligibility for Service Orders
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS will only accept Service Orders from a Client who
                meets the following mandatory requirements:
              </p>
              <ul className="list-disc list-inside text-brand-800 space-y-1 mb-4 ml-4">
                <li>
                  The Client is a legally registered business entity, is validly
                  existing, and maintains a current and registered Client
                  Account on the SHREEJI GEMS Website.
                </li>
                <li>
                  The individual placing the Service Order has attained the
                  legal age of majority and possesses the full legal capacity
                  and corporate authority to enter into binding contractual
                  agreements on behalf of the Client.
                </li>
                <li>
                  The Client provides a valid service or shipping address
                  located within the list of countries specified on our Contact
                  Us page.
                </li>
              </ul>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS reserves the right to refuse any Service Order if
                the Service is unavailable or if we reasonably believe the order
                violates these Service Repair Conditions.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Eligibility for Services is at the sole discretion of SHREEJI
                GEMS. Only genuine SHREEJI GEMS products are eligible for
                Services hereunder.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Scope of Services
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The Services provided by SHREEJI GEMS under these conditions
                include:
              </p>
              <ul className="list-disc list-inside text-brand-800 ml-4">
                <li>Complimentary free services (subject to eligibility)</li>
                <li>Jewelry repair services</li>
                <li>Diamond repair services</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Complimentary Free Services
              </h3>
              <p className="text-brand-800 leading-relaxed mb-2">Eligibility:</p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS extends complimentary free services for a duration
                of five (5) years from the original date of purchase, subject to
                a limitation of the first five (5) service events per individual
                piece of Jewellery during the five-year period. This
                complimentary service warranty applies exclusively to Jewellery
                and does not include any other products, components, or Goods
                (such as loose Diamonds or packaging).
              </p>
              <p className="text-brand-800 leading-relaxed mb-2">
                Covered Services:
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The complimentary services covered include comprehensive product
                inspection, professional shining and polishing, meticulous
                cleaning, diligent stone and prong setting maintenance, and the
                application of rhodium plating (limited exclusively to silver
                items with a white color finish).
              </p>
              <p className="text-brand-800 leading-relaxed mb-2">
                Conditions and Exclusions:
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                It is imperative to note that the complimentary service period
                shall definitively conclude upon the occurrence of either the
                completion of the first five (5) service events or the lapse of
                five (5) years from the purchase date, whichever transpires
                first. Any and all modifications, alterations, or resizing of
                SHREEJI GEMS products shall result in the immediate and
                irrevocable voidance of the complimentary free service
                agreement. Services explicitly excluded from the purview of
                complimentary offerings include, but are not limited to,
                resizing, engraving, and any alterations to the original design
                of the product.
              </p>
              <p className="text-brand-800 leading-relaxed mb-2">
                Procedure for Accessing Complimentary Services:
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                To initiate a request for complimentary free services, the
                customer must submit a formal service request through the
                designated SHREEJI GEMS contact us form, providing all requisite
                details pertaining to the service required. For products
                purchased from SHREEJI GEMS, the Client is formally obligated to
                seek all complimentary and paid services exclusively at the
                original point of sale (the original dispatch location or the
                SHREEJI GEMS Premises from which the Goods were collected). Any
                attempt to secure service at a different location or premises
                may result in the voidance of the complimentary service
                warranty.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Scope of Paid Services
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                All services requested by the Client, except for the complimentary service events explicitly
                extended for eligible Jewellery under the Complimentary Service, shall constitute Paid Services.
                This includes, without limitation, all service or repair work for Diamonds, Goods, and all other
                products not classified as eligible Jewellery, as well as any service requested for Jewellery that
                falls outside the defined five-year or five-event limit. All Paid Services will be subject to a
                separate fee schedule and quotation.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Shipping Your Product
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Please adequately package your product with all due care and
                taking into consideration the value thereof. Once your packaging
                is ready, please contact the carrier of your choice for shipping
                to the designated address. SHREEJI GEMS declines any and all
                responsibility for any damage, destruction, loss or theft of
                your product during transport, and any of which, should it
                occur, shall be under your own responsibility. For security
                reasons, the package boxes should be unbranded. You must keep a
                proof of shipment. Only products received by the SHREEJI GEMS
                will be eligible for the Service, in accordance with these
                Conditions of Service. The Client shall bear the sole
                responsibility and liability for all costs and risks associated
                with the shipment of the products to and from the mandatory
                service location. This includes the explicit mandate that the
                Client is solely responsible for arranging the secure, fully
                insured logistics of the service shipment. These costs include,
                but are not limited to, all shipping fees, insurance premiums,
                duties, and any potential loss or damage incurred during
                transit. SHREEJI GEMS is not liable for items lost or damaged
                during transportation for service.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Service Item Evaluation
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                When a customer consigns a product to SHREEJI GEMS for service,
                it is understood and agreed that SHREEJI GEMS is authorized to
                disassemble the product and conduct an examination to ascertain
                the scope of necessary repairs. Following this evaluation
                procedure, SHREEJI GEMS shall furnish the customer with a
                proposed estimate of the costs associated with the required
                services (hereinafter referred to as "the Service Estimate").
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Upon receipt of a product, SHREEJI GEMS will initially verify
                that the item is eligible for service under these Conditions.
                Subsequently, a technical evaluation of the product will be
                performed to determine the requisite services, consistent with
                the information provided in the service pre-registration. The
                resulting Service Estimate will be communicated to the customer
                through the designated service channels.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The customer acknowledges that, to facilitate an accurate
                analysis, the product may be transferred to the facilities of
                SHREEJI GEMS's manufacturer. In such instances, the customer
                will be informed of any additional costs related to this
                transfer, and it is recognized that the overall service timeline
                may be extended. SHREEJI GEMS will endeavor to provide
                reasonable updates regarding the progress of the service. The
                customer may be required to furnish supplementary documentation
                to comply with export regulations. If the customer fails to
                supply the necessary export documents, the product will be
                returned to them. By submitting a product for service, the
                customer also affirms that the product was originally imported
                into their country of residence in accordance with all pertinent
                legal requirements.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Service Estimate
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                If the product qualifies for the requested Services, the
                customer will be furnished with a Service Estimate through the
                designated Service Channels for their review and approval.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The Service Estimate will remain valid for the period specified
                therein. If the customer does not provide acceptance within the
                stipulated timeframe, the Service Estimate shall become void. In
                such a case, or if the customer declines the Service Estimate,
                SHREEJI GEMS will not proceed with any repair work and will
                return the product to the customer at their provided shipping
                address, in an unrepaired state. If the Service Estimate is not
                approved by the customer, the product will be dispatched back to
                them, with the customer assuming all costs and liability for the
                return shipping.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The Service Estimate will detail the proposed service fees for
                each service, differentiating between required and optional
                services. Customers are encouraged to carefully examine all
                particulars of the Service Estimate and these Conditions of
                Service prior to confirming the Service Estimate and submitting
                their Service Order through the Service Channels.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Confirmation of the Service Estimate by the customer through any
                Service Channel signifies the customer's irrevocable agreement
                to the performance of the Services by SHREEJI GEMS, subject to
                these Conditions of Service, and establishes a binding contract
                that obligates the customer to remit the total amount due for
                the specified Services.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                If, during the service process, SHREEJI GEMS determines for
                technical or unforeseen reasons that the required repair costs
                will materially exceed the initial approved estimate, a revised
                commercial quotation will be submitted to the Client. The
                continuation of service shall be suspended until the Client
                provides explicit written approval or rejection of the revised
                quotation.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                By authorizing SHREEJI GEMS to proceed with the Service, the
                customer commits to settle the repair charges, up to the amount
                of the validated Service Estimate, excluding any instances of
                complimentary service as defined by SHREEJI GEMS.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Service Costs and Payment
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The costs associated with repair services shall vary depending
                on the specific product and the nature of the service required,
                including the cost of any necessary replacement parts and labor
                charges. The customer shall be duly notified of the applicable
                costs prior to the commencement of any service work. The
                customer shall bear sole responsibility for all expenses and
                risks associated with the transportation of the product,
                including but not limited to shipping fees, courier charges,
                customs duties, insurance costs, and any potential loss or
                damage incurred during transit, regardless of service
                eligibility, including products qualifying for complimentary
                free service, for both inbound and outbound product
                transportation.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Payment Terms
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS accepts the payment methods specified during the
                order process through the Service Channels. Depending on the
                payment method chosen, supplemental information, potentially
                including specific identification, may be required from the
                customer. The customer is responsible for remitting the full
                amount detailed in the Service Estimate, clearly referencing the
                Service Order number with their payment. SHREEJI GEMS will
                initiate the shipment or delivery of the serviced product only
                upon the receipt of full payment. In instances where the Service
                Estimate is not approved and the product is to be returned
                without any services rendered, the customer is obligated to
                cover all shipping and insurance costs, as well as any other
                transit-related expenses, for both the initial delivery to
                SHREEJI GEMS and the subsequent return.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Customers should refrain from transmitting credit card details
                via email, postal mail, or any other written communication
                medium when placing Service Orders. All payment card
                transactions are subject to verification and authorization by
                the card issuer. If the customer's card issuer declines payment
                authorization, the customer must resolve the issue directly with
                their card issuer. Similarly, alternative payment methods may
                also be subject to validation and authorization procedures by
                the respective payment system providers.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The customer expressly grants SHREEJI GEMS the authority to
                conduct security verification procedures as deemed necessary.
                Furthermore, the customer expressly authorizes SHREEJI GEMS to
                utilize the provided personal information, and to transmit or
                obtain information (including any updated details) pertaining to
                the customer from third parties, including but not limited to
                payment card information, for the purposes of identity
                authentication, payment validation, initial payment card
                authorization (if applicable), and authorization of individual
                service transactions.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The total cost of the Service Order will typically be charged to
                the customer's payment card or other chosen payment method upon
                completion of the service work. Customers are reminded to
                include the Service Order reference number with their payment,
                when requested. It is important to note that some financial
                institutions may impose fees, which will be the responsibility
                of the customer.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS is legally prohibited from providing services to
                individuals or entities listed on applicable sanctions or
                prohibition lists, or to countries sanctioned by relevant
                authorities. Any attempts to engage in such transactions will be
                rejected.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                If the customer fails to provide full payment of the invoice
                within three (3) calendar months of notification, or if the
                serviced product remains unclaimed for twelve (12) calendar
                months following notification, SHREEJI GEMS reserves the right,
                to the extent permitted by law, to sell or otherwise dispose of
                the product at its sole discretion. The proceeds from any such
                sale or disposal will be applied to settle any outstanding
                amounts owed, including but not limited to storage fees and
                administrative costs, with any remaining balance to be returned
                to the customer, where feasible.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Service Turnaround Time
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The duration required to complete a repair is contingent upon
                the nature and complexity of the service required. The customer
                shall be provided with an estimated timeframe for service
                completion following a comprehensive inspection of the product.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Delivery of Serviced Items
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS will dispatch or deliver the serviced product to
                the customer only after the receipt of the full payment for the
                services rendered. The serviced product will be returned to the
                shipping address previously provided by the customer in the
                service pre-registration form
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The Client shall bear the sole responsibility and liability for
                all costs and risks associated with the shipment or delivery of
                the products to and from the mandatory service location.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                It is important to note that SHREEJI GEMS currently facilitates
                deliveries exclusively within listed countries in contact us
                page of website and certain addresses may be excluded from
                delivery service (e.g., military installations, addresses within
                certain restricted zones such as hotels, post office boxes, or
                specific remote locations). Delivery timelines are estimates and
                should not be considered guaranteed. Upon receiving the
                delivered product, the customer may be required to provide
                confirmation of receipt, potentially via text message or email.
                SHREEJI GEMS will specify the required method for confirming receipt,
                and at the point of such confirmation, the responsibility for
                the product transfers to the customer. The customer's signature
                on the delivery receipt will serve as confirmation of the
                product's receipt in satisfactory condition. Delivery will be
                executed to the delivery address registered and confirmed in
                accordance with these terms, and the delivery process will
                adhere to SHREEJI GEMS's established guidelines.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Customers are advised to provide clear instructions in the event
                they are unavailable to receive the delivery. This is
                particularly important if a third party is designated to accept
                the returned product. SHREEJI GEMS reserves the right to accept
                or decline to release the product to a third party. Any delivery
                date communicated to the customer is an approximation and is not
                a binding commitment by SHREEJI GEMS. SHREEJI GEMS shall not be
                held accountable for any damages or losses arising from
                alterations to the estimated delivery date. SHREEJI GEMS will
                inform the customer as soon as reasonably practicable of any
                adjustments to the delivery date estimate.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                SHREEJI GEMS's Right to Cancel Service Orders
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS reserves the right, notwithstanding any other provision herein, to decline,
                cancel, or terminate service orders at any time, when deemed justifiable. Such instances may
                include, but are not limited to, situations where there is an ongoing dispute concerning the
                payment for a previous service, if SHREEJI GEMS has reason to believe the customer has
                violated these Conditions of Service or any applicable laws, if such action is permissible under
                the law, or due to events beyond SHREEJI GEMS's reasonable control, including force majeure
                occurrences.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                In the event that SHREEJI GEMS elects to cancel a service order, SHREEJI GEMS shall not be
                held liable for any compensation or damages, and the customer hereby agrees that they shall not
                assert any claims against SHREEJI GEMS, its agents, affiliates, or employees.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Service Descriptions
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                While SHREEJI GEMS endeavors to ensure the accuracy of all information presented on its
                platforms, in advertisements, catalogs, or through other Service Channels, SHREEJI GEMS
                offers no guarantees, either explicit or implied, regarding the precision, reliability, or
                completeness of said information. SHREEJI GEMS does not finalize the service cost until a
                formal Service Estimate has been issued to the customer.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                While SHREEJI GEMS takes precautions to present service descriptions, photographs, or
                graphical depictions of the Services on its platforms with the greatest possible accuracy,
                SHREEJI GEMS does not warrant that such materials or other content are entirely free from
                errors, whether due to inaccuracy, omission, outdated information, or other reasons.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Product limited Warranty
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS warrants that its products are crafted with the
                highest standards of quality and workmanship, and the company is
                committed to addressing any defects in materials or
                manufacturing. However, SHREEJI GEMS shall not be held liable
                for or responsible for providing service in respect of products
                with missing components, such as parts, stones, or links, damage
                resulting from the loss of stones, pearls, or backings, or
                damage attributable to normal wear and tear, accidental
                occurrences, or unauthorized modifications.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Limitation of Liability
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS does not establish the definitive cost of the
                Services until a Service Estimate has been issued to the
                customer.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                To the maximum extent permissible under applicable law, SHREEJI
                GEMS disclaims and excludes all other terms, conditions, and
                warranties pertaining to the Services and Service Channels,
                whether explicitly stated or implied by statute, common law, or
                arising from prior dealings, customary practices, or trade
                usage.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Nothing within these Conditions of Service serves to limit or
                exclude SHREEJI GEMS's liability for any obligations that cannot
                be limited or excluded under applicable law. Subject to the
                preceding stipulation, SHREEJI GEMS's total liability to the
                customer under these Conditions of Service for any service
                order, regardless of whether it arises in contract, tort
                (including negligence), or otherwise, shall in no event exceed
                one hundred percent (100%) of the service cost specified in the
                customer's Service Order, even if SHREEJI GEMS has been advised
                of the possibility of such damages. Under no circumstances shall
                SHREEJI GEMS be liable for any indirect, consequential,
                incidental, or punitive damages.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                In the event that a customer sends a product for service in
                contravention of these Conditions of Service or SHREEJI GEMS's
                instructions, the customer shall assume all associated risks and
                costs, and SHREEJI GEMS shall bear no liability whatsoever.
                Specifically, SHREEJI GEMS shall not be held responsible for any
                risks, damage, destruction, theft, or loss of the product,
                including during its transportation to SHREEJI GEMS.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                It is important to note that the laws of certain jurisdictions
                may not permit the exclusion or limitation of certain warranties
                or liabilities, and therefore, some of the exclusions and
                limitations outlined above may not apply to customers in those
                jurisdictions.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Entire Agreement
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                If any provision, or portion of a provision, within these
                Conditions of Service is determined to be illegal, invalid, or
                unenforceable, the remaining provisions of these Conditions of
                Service shall remain in full force and effect, continuing to be
                valid, binding, and enforceable.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                These Conditions of Service, along with any referenced terms,
                constitute the complete agreement between the customer and
                SHREEJI GEMS concerning the service order, and supersede and
                replace all prior agreements, drafts, arrangements,
                understandings, and collateral contracts, whether oral or
                written, made by the parties with respect to the subject matter
                hereof.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS shall not be held responsible for any failure or
                delay in the performance of, or compliance with, its obligations
                under these Conditions of Service, when such failure or delay
                arises from any cause beyond SHREEJI GEMS's reasonable control.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The customer represents and warrants that all information
                provided in the Service Order is true, accurate, and complete at
                all times; failure to do so will result in the customer being
                solely liable for any resulting consequences.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Any waiver by SHREEJI GEMS of a breach of any provision of these
                Conditions of Service shall not be construed as a waiver of any
                other or subsequent breach of that provision or any other
                provision.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                This agreement is established solely between the customer and
                SHREEJI GEMS. No other party shall possess any right to enforce
                any of its terms. These Conditions constitute the entire
                agreement between the customer and SHREEJI GEMS with respect to
                the provision of Services and supersede all prior or
                contemporaneous communications and proposals, whether oral or
                written, between the parties.
              </p>
            </section>

            {/* Returns & Exchanges */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                RETURNS, EXCHANGES & CREDIT NOTE POLICY
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                This provision details the guidelines for returns, exchanges,
                and credit note for purchases made from SHREEJI GEMS.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Right of Withdrawal
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                You have the right to withdraw from this contract within 15 days
                without providing any reason. The withdrawal period is 15 days
                from the day you or a third party designated by you, who is not
                the carrier, takes possession of the goods. To meet the
                withdrawal deadline, it is sufficient for you to withdraw before
                the withdrawal period has expired.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Conditions for Returns, Exchanges, and Credit note
              </h3>
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
                that ensures secure transit.
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
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                All returns will be subject to strict mandatory quality control
                inspection by us to ensure that the returned products satisfy
                these requirements. If the products do not meet QC standards, we
                will refuse the return, and the products will be returned to
                you. If the returned product satisfies QC, we will proceed with
                the applicable credit note or exchange. Failure to comply with
                these Conditions of Sale will entitle us to refuse the returned
                product and send it back to you, at your own cost.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Return, Exchange, or Credit Note Process
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                To request a return, exchange, or Credits for purchase, you must
                complete the request form on our website’s contact us within 15
                days of receiving your item. You will receive a Return
                Authorization Number via email.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Following the receipt of the formal email confirming return
                approval, the Client must dispatch the eligible Goods directly
                to the original dispatch location specified by the Sales
                Facilitator. The Client is responsible for ensuring the return
                address label precisely matches the address provided in the
                return confirmation email. Upon arrival at our facility, the
                returned item(s) will undergo a quality control inspection,
                which typically takes 7-10 working days. Following the
                successful completion of the inspection and verification
                process, the Client will receive a formal email notification
                from the Sales Facilitator confirming one of two outcomes: the
                issuance of a Credit Note against the value of the returned
                Goods, or authorization for an exchange for other products of
                equivalent value.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Exchanges are subject to product availability.
              </p>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Credit note validity & Conditions
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
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

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Rejected Returns
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                If a returned item does not pass quality control or meet the
                return conditions, it will be returned to you. You will be
                responsible for all shipping and insurance costs (both outbound
                and return).
              </p>
            </section>

            {/* Warranty */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                MANUFACTURER'S LIMITED WARRANTY
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                We are committed to ensuring that each product strictly complies
                with our quality criteria and that it has passed all our
                controls, both technical and aesthetic. We aim to ensure your
                satisfaction with our products for many years. Our customer
                service team is ready to address any questions about product
                defects. Please note that SHREEJI GEMS cannot provide assistance
                if your product has:
              </p>
              <ul className="list-disc list-inside text-brand-800">
                <li>Missing parts, stones, or links.</li>
                <li>Loss of stones, pearls, or backings.</li>
                <li>
                  Damage resulting from normal wear, accidents, or
                  modifications.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-900 mb-3 mt-6">
                Immediate Inspection and Claims Procedure
              </h3>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                The Client is required to conduct an immediate and thorough
                inspection of the Goods upon delivery. Any claim must be
                submitted in writing through website contact us to the Sales
                Facilitator within two (2) calendar days of receiving the Goods.
                If the Goods contain any verifiable manufacturing defects not
                resulting from transit damage, the Client must document the
                issue immediately for warranty processing. If the outer
                packaging or the Goods display any signs of damage incurred
                during transit or logistics, the Client must immediately notify
                the courier and simultaneously notify SHREEJI GEMS. Failure to
                notify SHREEJI GEMS within the two (2) calendar day period shall
                constitute the Client's waiver of any claim for transit damage,
                as this stringent timeline is required for the initiation of
                necessary insurance claims.
              </p>
            </section>

            {/* Product Descriptions */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                PRODUCT DESCRIPTIONS AND AUTHENTICITY
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS is dedicated to providing comprehensive and
                accurate information across all our platforms, including product
                descriptions, dimensions, and colors, in our advertisements,
                catalogs, and communications from our customer service team.
                While we strive for excellence in detail and clarity, we
                acknowledge that minor variations may occur. Therefore, we do
                not extend any explicit or implied guarantees regarding the
                absolute precision, reliability, or completeness of this
                information. Specifically, any details concerning precious
                material weights, stone counts and carats, product measurements,
                and similar specifications are provided for general guidance
                only, and slight discrepancies may be present. To ensure your
                satisfaction, we encourage you to contact our customer service
                team with any specific inquiries. We also recommend a thorough
                inspection of the products upon receipt, prior to use. In case
                of diamond, please allow for slight variations in diamond weight
                (±0.01 ct) and size (±0.10 mm). Product colors may appear
                differently on your device due to screen settings.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS uses a variety of premium materials in its
                products, including 18kt gold, 14kt gold, 925 sterling silver,
                natural diamonds, lab-grown diamonds, and cords. We meticulously
                select each material, ensuring ethical and sustainable sourcing,
                and all diamonds are conflict-free. The majority of SHREEJI GEMS
                jewelry, diamonds, and products are produced in our workshop in
                India.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Major Diamonds are certified by GIA (<a href="https://www.gia.edu" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">https://www.gia.edu</a>) or IGI
                (<a href="https://www.gia.edu" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">https://www.gia.edu</a>), reputable gemological laboratories. The
                certificate/report number will be included on your invoice,
                enabling you to independently verify and download the
                certificate from the laboratory's website. All jewelry items are
                certified by SGL (<a href="https://sgl-labs.com" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">https://sgl-labs.com</a>) or IGI
                (<a href="https://www.igi.org" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline hover:underline-offset-1 decoration-current">https://www.igi.org</a>). The certificate/report number will be on
                your invoice for independent verification and download from the
                respective laboratory's website.
              </p>
            </section>

            {/* Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                LIABILITY CONSIDERATIONS
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                To the maximum extent permitted under applicable law, SHREEJI
                GEMS disclaims and excludes all conditions, terms, and
                warranties relating to our products and Sales Channels, whether
                explicitly stated or implied by statute, custom, or established
                commercial practices.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Nothing within these Conditions of Sale operates to limit or
                exclude our responsibility or liability in any situation where
                such limitation or exclusion is prohibited by law. Subject to
                the preceding stipulation, our total financial responsibility to
                you under these Conditions of Sale, regardless of whether a
                claim arises from contract, tort (including negligence), or any
                other legal theory, will not, under any circumstances, exceed
                one hundred percent (100%) of the purchase price of the
                product(s) in your specific order.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                It is crucial to acknowledge that consumer protection
                regulations in certain jurisdictions may not allow the exclusion
                or limitation of particular warranties or liabilities. As a
                result, some of the exclusions and limitations detailed above
                may not be applicable in your specific case.
              </p>
            </section>

            {/* General Provisions */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                GENERAL PROVISIONS
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                If any clause, or portion of a clause, within these Conditions
                of Sale is deemed to be illegal, invalid, or unenforceable, that
                specific clause or portion will be considered as if it does not
                form part of these Conditions of Sale. The legality, validity,
                and enforceability of the remaining clauses within these
                Conditions of Sale will remain unaffected, unless such effect is
                mandated by applicable law.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                These Conditions of Sale, along with any associated terms
                incorporated by reference, establish the complete agreement
                between you and us concerning the order of products or services.
                These Conditions of Sale supersede and replace all prior
                agreements, drafts, arrangements, undertakings, or collateral
                contracts of any nature, whether communicated orally or in
                writing, between the parties relating to the subject matter
                herein.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                SHREEJI GEMS shall not be held responsible for any failure or
                delay in the performance of, or compliance with, our obligations
                under these Conditions of Sale, when such failure or delay
                arises from any cause beyond our reasonable control.
              </p>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                Any waiver by SHREEJI GEMS of a breach of any provision of these
                Conditions of Sale will not be interpreted as a waiver of any
                other breach, whether prior or subsequent. This contract is
                established solely between us and you. No other individual or
                entity shall possess any rights to enforce any of its terms.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                GOVERNING LAW AND JURISDICTION
              </h2>
              <p className="text-brand-800 leading-relaxed mb-4 text-justify">
                These Conditions of Sale shall be governed by and construed in
                accordance with the substantive laws of India, specifically the
                laws of the State of Gujarat, without reference to its conflict
                of laws principles. Any dispute, controversy or claim arising
                out of or in relation to the Conditions of Sale, including the
                validity, invalidity, breach or termination of the Conditions of
                Sale, shall be adjudicated or arbitrated in accordance with the
                Conditions of Sale. You may bring proceedings in the country
                where you are domiciled. We may also bring proceedings against
                you in the courts of the country where you are domiciled.
                Without any restriction to bring proceedings before a court, you
                and SHREEJI GEMS will first make reasonable efforts for a period
                of thirty (30) days to resolve amicably any dispute or failure
                to agree that may arise out of or relate to the product, the
                Conditions of Sale or any breach thereof.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-semibold text-brand-900 mb-4 text-justify">
                CONTACT US
              </h2>
              <div className="bg-brand-50 p-6 rounded-lg">
                <p className="font-semibold text-brand-900 mb-2">
                  For any inquiries or feedback regarding these Conditions of
                  Sale, or other matters, please contact us using the
                  information below:
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

export default ConditionsOfSale;
