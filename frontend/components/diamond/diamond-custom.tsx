"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "antd";
import { garamond } from "@/src/common/helper";
import Navbar from "../common/navbar";
import Footer from "../common/footer";
import DesignRequestModal from "./design-request-modal";

const DiamondCustom = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartDesign = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <div className={`w-full min-h-screen ${garamond.className}`}>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="bg-brand-100 py-16">
        <div className="max-w-6xl mx-auto md:px-8 px-4 text-center">
          {/* Icons */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
              <Image
                src="/assets/diamond/custome/customise-diamond-circle.svg"
                alt="Diamond"
                width={100}
                height={100}
                className="w-[100px] h-[100px]"
              />
            </div>
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
              <Image
                src="/assets/diamond/custome/customize-jewellery-circle.svg"
                alt="Diamond"
                width={100}
                height={100}
                className="w-[100px] h-[100px]"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-brand-900 mb-6">
            SCALING YOUR DIAMOND AND JEWELRY REQUIREMENTS
          </h1>

          {/* Description */}
          <div className="max-w-4xl mx-auto md:text-[18px] text-[14px] text-brand-800 leading-relaxed">
            <p>
              We elevate your business inventory with manufacturing capacity
              that meets stringent professional demands. Engage our exclusive
              service for large-scale diamond production or bespoke jewelry
              fabrication, precisely aligned with your market's needs. We ensure
              consistent quality and timely fulfillment, establishing a reliable
              foundation for your commercial success.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto md:px-8 px-4">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-xl font-semibold text-brand-900 mb-4">
              CONCEPTION TO COMPLETION: THE SEQUENCE
            </h2>
            <p className="md:text-[18px] text-[14px] text-brand-700">
              The Design Achieved, Perfected For Lasting Ease
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-brand-50 rounded-lg mb-4 h-64 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-4">
                  <Image
                    src="/assets/diamond/sequence/1 custom.svg"
                    alt="Diamond"
                    width={100}
                    height={100}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-brand-900 mb-2 md:text-[18px] text-[16px]">
                1. ESTIMATE YOUR VISION
              </h3>
              <p className="md:text-[15px] text-[14px] text-brand-700 leading-relaxed">
                Your unprecedented journey begins with a private consultation,
                transforming your unique inspiration into an exacting design
                concept with a dedicated specialist. We then deliver a detailed,
                transparent quotation outlining all costs for budget clarity.
                Upon approval, every detail is confirmed, and your bespoke
                creation moves instantly into the specialized production atelier
                for realization.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-brand-50 rounded-lg mb-4 h-64 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-lg shadow-sm flex items-center justify-center p-4">
                  <Image
                    src="/assets/diamond/sequence/2 custom.svg"
                    alt="Diamond"
                    width={100}
                    height={100}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-brand-900 mb-2 md:text-[18px] text-[16px]">
                2. DESIGN DETAILS DIGITIZED
              </h3>
              <p className="md:text-[15px] text-[14px] text-brand-700 leading-relaxed">
                Initial concepts are meticulously illustrated via detailed
                sketches to establish accurate scale and composition. Following
                your sign-off, the design advances into the technological space.
                Advanced CAD programs sculpt a precise, three-dimensional
                digital replica, confirming absolute proportional excellence
                before the physical journey starts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-brand-50 rounded-lg mb-4 h-64 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-lg shadow-sm flex items-center justify-center p-4">
                  <Image
                    src="/assets/diamond/sequence/3 custom.svg"
                    alt="Diamond"
                    width={100}
                    height={100}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-brand-900 mb-2 md:text-[18px] text-[16px]">
                3. PHYSICAL FORM EMERGES
              </h3>
              <p className="md:text-[15px] text-[14px] text-brand-700 leading-relaxed">
                The precise digital blueprint is transformed into a detailed wax
                form, capturing every geometric subtlety. This model undergoes
                meticulous preparation for the time-honored, accurate lost wax
                technique. Molten chosen metal then replaces the wax, resulting
                in the preliminary structure of your unique piece, perfectly
                translating the design rendering into solid, precious material.
              </p>
            </div>
          </div>

          {/* Second Row of Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-brand-50 rounded-lg mb-4 h-64 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-lg shadow-sm flex items-center justify-center p-4">
                  <Image
                    src="/assets/diamond/sequence/4 custom.svg"
                    alt="Diamond"
                    width={100}
                    height={100}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-brand-900 mb-2  md:text-[18px] text-[16px]">
                4. MASTERY ACHIEVED NOW
              </h3>
              <p className="md:text-[15px] text-[14px] text-brand-700 leading-relaxed">
                Master jewelers undertake meticulous assembly and shaping,
                cleaning the metal form with unparalleled precision. Gemstones
                are subsequently set by hand, guaranteeing maximum security and
                flawless brilliance. The piece then receives ultimate refinement
                through expert polishing, achieving an incomparable mirror
                finish. Following rigorous quality assurance, your unique
                jewelry is prepared for its exceptional unveiling.
              </p>
            </div>

            {/* Step 5 */}
            <div className="text-center">
              <div className="bg-brand-50 rounded-lg mb-4 h-64 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-lg shadow-sm flex items-center justify-center p-4">
                  <Image
                    src="/assets/diamond/sequence/5 custom.svg"
                    alt="Diamond"
                    width={100}
                    height={100}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-brand-900 mb-2 md:text-[18px] text-[16px]">
                5. FLAWLESS FINAL VETTING
              </h3>
              <p className=" md:text-[15px] text-[14px] text-brand-700 leading-relaxed">
                The culmination is a rigorous, multi-point quality audit by a
                senior artisan, scrutinizing setting, finish, and structural
                integrity. Only when every detail meets exacting standards is
                the piece approved. Following certification, it undergoes
                intensive professional cleaning and steaming. This final step
                meticulously removes all creation traces, ensuring peerless
                metal luster and maximum gemstone brilliance for unveiling.
              </p>
            </div>

            {/* Step 6 */}
            <div className="text-center">
              <div className="bg-brand-50 rounded-lg mb-4 h-64 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-lg shadow-sm flex items-center justify-center p-4">
                  <Image
                    src="/assets/diamond/sequence/6 custom.svg"
                    alt="Diamond"
                    width={100}
                    height={100}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-brand-900 mb-2  md:text-[18px] text-[16px]">
                6. ASPIRATION REALIZED FULLY
              </h3>
              <p className="md:text-[15px] text-[14px] text-brand-700 leading-relaxed">
                The fulfillment stage is now complete. Born from your
                specifications and realized through incomparable artistry, your
                collection is precisely prepared. This exceptional inventory,
                rigorously certified for its transcendent quality, is
                efficiently packaged and dispatched. Your distinct stock is
                ready. The final product is now entirely prepared for your
                market placement and sales success.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Uniquely Crafted Section */}
      <div className="bg-brand-50 py-16">
        <div className="max-w-4xl mx-auto md:px-8 px-4 text-center">
          <h2 className="text-xl font-semibold text-brand-900 mb-6 md:text-[18px] text-[16px]">
            THE CUSTOM DIAMOND PROTOCOL
          </h2>
          <p className="md:text-[16px] text-[14px] text-brand-800 leading-relaxed mb-8">
            For clients requiring large-scale production or bespoke diamond
            specifications, our process guarantees precision and reliable
            fulfillment. It commences with detailed{" "}
            <span className="font-semibold">client consultation</span>, defining
            precise parameters and receiving{" "}
            <span className="font-semibold">confirmation</span>. We then execute{" "}
            <span className="font-semibold">selection of rough</span> and
            intricate{" "}
            <span className="font-semibold">planning and shaping</span>. This
            leads to the <span className="font-semibold">polishing</span> phase,
            followed by rigorous{" "}
            <span className="font-semibold">cleaning and boiling</span> for
            unparalleled luster. The finished,{" "}
            <span className="font-semibold">certified diamonds</span> are then
            readied for secure{" "}
            <span className="font-semibold">packaging and delivery</span>,
            culminating in the successful fulfillment of your commercial order.
          </p>

          <Button
            type="primary"
            size="large"
            onClick={handleStartDesign} // Added back the onClick handler
            className={`bg-brand-700 hover:bg-brand-800 border-brand-700 px-12 py-6 h-auto text-white font-medium hover:scale-95 transition-transform ${garamond.className}`}
            style={{ backgroundColor: "#73796f", borderColor: "#73796f" }}
          >
            START A DESIGN
          </Button>
        </div>
      </div>

      {/* Technical Drawings Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto md:px-8 px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Ring Technical Drawing */}
            <div className="flex justify-center">
              <div className="w-full h-full bg-brand-50 rounded-lg flex items-center justify-center">
                <Image
                  src="/assets/diamond/sequence/7 custom.svg"
                  alt="Technical Drawing"
                  width={100}
                  height={100}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Engagement Ring Technical Drawing */}
            <div className="flex justify-center">
              <div className="w-full h-full bg-brand-50 rounded-lg flex items-center justify-center">
                <Image
                  src="/assets/diamond/sequence/8 custom.svg"
                  alt="Technical Drawing"
                  width={100}
                  height={100}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Design Request Modal */}
      <DesignRequestModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default DiamondCustom;
