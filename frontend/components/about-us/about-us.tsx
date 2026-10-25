"use client";
import React, { useState, useEffect, useRef } from "react";
import { garamond } from "@/src/common/helper";
import Image from "next/image";
import { ABOUT_US } from "@/src/libs/constants";
import Footer from "../common/footer";
import CardShuffleAnimation from "./CardShuffleAnimation";
import ShutterSlider from "./ShutterSlider";
import Link from "next/link";
import HoverGif from "./hover-gif";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const AboutUs = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isSticky, setIsSticky] = useState<boolean>(true);

  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  const stickyNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { ref: section3Ref, index: 0 },
        { ref: section4Ref, index: 1 },
        { ref: section5Ref, index: 2 },
        { ref: section6Ref, index: 3 },
      ];

      // Check if section 6 is half scrolled to unstick the nav
      if (section6Ref.current) {
        const section6Rect = section6Ref.current.getBoundingClientRect();
        const section6Height = section6Ref.current.offsetHeight;
        const halfScrolled = section6Rect.top <= -section6Height / 2;
        setIsSticky(!halfScrolled);
      }

      // Determine which section is currently in view
      let currentActive = 0;
      sections.forEach(({ ref, index }) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          // Check if section is in the viewport (top is above middle of screen)
          if (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          ) {
            currentActive = index;
          }
        }
      });

      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobileSwiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (mobileSwiperRef.current) {
      mobileSwiperRef.current.slideTo(activeSection);
    }
  }, [activeSection]);

  return (
    <div className={`${garamond.className} w-auto h-auto select-none`}>
      {/* Section 0: About-us intro section */}
      <div className="w-full h-[100vh] fixed">
        <Image
          src="/assets/about-us/about-us-hero.svg"
          alt="About Us Banner"
          width={330}
          height={330}
          // fill
          className="object-cover h-full w-[100vw] fixed"
          priority
        />
      </div>

      {/* Section 1: About-us intro section */}
      <div className="relative w-full h-[100vh] z-10 px-4 md:px-8 lg:px-16 md:py-16 py-10 flex flex-col justify-between items-start">
        <div className="py-3 my-2 px-5 backdrop-blur-md rounded-4xl border-0">
          <Link href="/">
            <Image
              src="/assets/brand/je-inspi-logo-transparent.png"
              width={330}
              height={330}
              alt="JE-Inspi logo"
              data-aos="zoom-in"
              className="cursor-pointer w-[190px] h-[80px] md:w-[330px] md:h-auto"
            />
          </Link>
        </div>
        <p className="text-[28px] md:text-5xl font-[500] text-[#263329] tex1t-start font-serif md:px-16 px-8">
          IMPERATIVE
          <br /> ARTISTRY <br /> ETHOS
        </p>
        <p className="md:text-2xl text-[18px] font-[500] text-[#263329] text-start font-serif md:px-16 px-8 md:w-[78%] w-full">
          Our Profound, Generational Heritage Seamlessly Merges With Technical
          Mastery And Artistic Vision, Securing A Dependable Supply Of
          Exceptional Products, Guaranteeing Clients Both Absolute Market
          Certainty And Holistic Ethical Commitment Worldwide.
        </p>
      </div>

      {/* Section 2: Main four summary section */}
      <div
        ref={stickyNavRef}
        className={`w-full h-auto px-4 md:px-8 pb-3 lg:px-16 ${isSticky ? "sticky" : "relative"
          } top-0 z-10 bg-white pt-5 transition-all duration-300`}
      >
        <div className="mx-auto">
          {/* DESKTOP / TABLET VIEW (GRID) */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ABOUT_US.map((item, index) => (
              <div
                key={index}
                className={`group relative bg-white overflow-hidden cursor-pointer 
            transition-all duration-300 ease-in-out hover:-translate-y-2 ${activeSection === index ? "-translate-y-2" : ""
                  }`}
              >
                <div className="p-3">
                  <h3
                    className={`text-xl font-semibold text-center transition-colors duration-300 ${activeSection === index
                        ? "text-brand-700"
                        : "text-brand-900 group-hover:text-brand-700"
                      }`}
                  >
                    {item.value}
                  </h3>
                </div>

                <div className="relative max-h-[200px] h-[200px] w-auto overflow-hidden">
                  {/* <Image
                    src={item.image}
                    alt={item.value}
                    fill
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110 rounded-2xl"
                  /> */}
                  {activeSection === index ? (
                    <video
                      src={item.video}
                      className="object-contain w-full h-full rounded-2xl"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.value}
                      fill
                      className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110 rounded-2xl"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE VIEW — AUTO CAROUSEL (NO SWIPE) */}
          <div className="block md:hidden">
            <Swiper
              slidesPerView={1}
              allowTouchMove={false}
              onSwiper={(swiper) => {
                mobileSwiperRef.current = swiper;
              }}
            >
              {ABOUT_US.map((item, index) => (
                <SwiperSlide key={index}>
                  <div
                    className={`group relative bg-white overflow-hidden transition-all duration-300 ${activeSection === index ? "-translate-y-2" : ""
                      }`}
                  >
                    <div className="p-3">
                      <h3
                        className={`text-xl font-semibold text-center transition-colors duration-300 ${activeSection === index
                            ? "text-brand-700"
                            : "text-brand-900"
                          }`}
                      >
                        {item.value}
                      </h3>
                    </div>

                    <div className="relative max-h-[200px] h-[200px] w-auto overflow-hidden">
                      {activeSection === index ? (
                        <video
                          src={item.video}
                          className="object-contain w-full h-full rounded-2xl"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <Image
                          src={item.image}
                          alt={item.value}
                          fill
                          className="object-contain rounded-2xl"
                        />
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Section 3: Our Enduring Legacy */}
      <div
        ref={section3Ref}
        className="relative w-full h-auto px-4 md:px-8 lg:px-16 flex md:flex-row flex-col justify-between items-center bg-white md:pt-24 pt-16"
      >
        <div className="w-full md:w-[30%] flex justify-center items-center">
          <Image
            src="/assets/about-us/sections/section_1/about us S1.svg"
            alt="Our Enduring Legacy"
            width={500}
            height={500}
            className="w-full h-auto" // 308px
          />
        </div>
        <div className="md:w-[60%] w-full md:mt-0 mt-5">
          <p className="md:text-[18px] text-[14px] font-[500] pb-3">
            Our Enduring Legacy: From Humble Beginnings to Global Brilliance
          </p>
          <p className="md:text-[18px] text-[14px] font-[500] pb-3 text-justify">
            The year was 1987. In the vibrant heart of Surat, India, a journey
            began – a journey of passion, precision, and an unyielding
            commitment to excellence. Shreeji Gems started as a small,
            self-employed endeavor, driven by a deep reverence for the timeless
            beauty of diamonds and jewelry. This wasn't just about business; it
            was about building a legacy.
          </p>
          <p className="md:text-[18px] text-[14px] font-[500] text-justify">
            Over nearly four decades, that initial spark ignited into a
            thriving, globally recognized enterprise with a significant presence
            in Linz, Austria, serving the entire European Union. Our heritage is
            etched in every facet we polish and every setting we craft. We've
            cultivated unparalleled experience and expertise across the entire
            "raw to retail" spectrum, transforming nature's wonders into
            wearable art. At our core lie values of unwavering trust,
            transparency, and integrity. These aren't just words; they're the
            guiding principles that have fostered profound loyalty with our
            clients and fueled our global presence, ensuring easy reach and
            support wherever you are. Our commitment to perfection isn't just a
            goal; it's our promise.
          </p>
        </div>
      </div>

      {/* Section 4: The Art of Creation */}
      <div
        ref={section4Ref}
        className="relative w-full min-h-[450px] h-auto px-4 md:px-8 lg:px-16 flex md:flex-row flex-col justify-between items-center bg-white md:pt-24 pt-16"
      >
        <div className="md:w-[55%] w-full md:mb-0 mb-10">
          <p className="md:text-[18px] text-[14px] font-[500] pb-3">
            The Art of Creation: Where Innovation Meets Human Touch
          </p>
          <p className="md:text-[18px] text-[14px] font-[500] pb-3 text-justify">
            At Shreeji Gems, we don't just manufacture; we create. Our belief,
            "We Create Luxury with Accuracy," perfectly encapsulates the
            meticulous dance between cutting-edge technology and the
            irreplaceable human touch. We understand that the true value of a
            diamond or a piece of jewelry extends far beyond its inherent
            rarity. It's in the artistry and work infused into every millimeter,
            the culmination of innovation, skill, and technology in our advanced
            facility in India.
          </p>
          <p className="md:text-[18px] text-[14px] font-[500] text-justify">
            Our manufacturing process is a symphony of precision. From advanced
            machines to the discerning minds of our artisans, every element is
            optimized for unparalleled quality. Our state-of-the-art
            infrastructure is designed for excellence, but it's the creativity,
            passion, and dedication of our team that truly elevates our craft.
            We foster an environment where work-life balance fuels inspiration,
            ensuring that every piece crafted is a testament to genuine human
            effort. This relentless pursuit of precision ensures that whether
            we're shaping a rough diamond or setting a precious gem, we're not
            just adding value; we're creating a masterpiece.
          </p>
        </div>
        <CardShuffleAnimation
          images={[
            "/assets/about-us/sections/section_2/about us s2 1.svg",
            "/assets/about-us/sections/section_2/about us s2 2.svg",
            "/assets/about-us/sections/section_2/about us s2 3.svg",
            "/assets/about-us/sections/section_2/about us s2 4.svg",
            "/assets/about-us/sections/section_2/about us s2 6.svg",
            "/assets/about-us/sections/section_2/about us s2 7.svg",
            "/assets/about-us/sections/section_2/about us s2 8.svg",
            "/assets/about-us/sections/section_2/about us s2 9.svg",
            "/assets/about-us/sections/section_2/about us s2 10.svg",
          ]}
          containerClassName="w-[40%]"
          cardWidth={300}
          cardHeight={300}
          autoShuffleInterval={4000}
        />
      </div>

      {/* Section 5: Your Vision, Our Expertise */}
      <div
        ref={section5Ref}
        className="relative w-full h-auto px-4 md:px-8 lg:px-16 bg-white md:pt-24 pt-20"
      >
        {/* <h3 className="w-full mb-3 text-center text-[24px] font-[600]"> Your Vision, Our Expertise </h3> */}
        <div className="flex md:flex-row flex-col justify-between items-center">
          <div className="md:w-[40%] w-full flex flex-col justify-center items-center">
            <HoverGif
              still="/assets/about-us/sections/section_3/4 SECTION 3 PART 1.png"
              gif="/assets/about-us/sections/section_3/4 SECTION 3 PART 1.gif"
            />

            <HoverGif
              still="/assets/about-us/sections/section_3/4 SECTION 3 PART 2.png"
              gif="/assets/about-us/sections/section_3/4 SECTION 3 PART 2.gif"
            />

            <HoverGif
              still="/assets/about-us/sections/section_3/4 SECTION 3 PART 3.png"
              gif="/assets/about-us/sections/section_3/4 SECTION 3 PART 3.gif"
            />

            <HoverGif
              still="/assets/about-us/sections/section_3/4 SECTION 3 PART 4.png"
              gif="/assets/about-us/sections/section_3/4 SECTION 3 PART 4.gif"
            />

            <HoverGif
              still="/assets/about-us/sections/section_3/4 SECTION 3 PART 5.png"
              gif="/assets/about-us/sections/section_3/4 SECTION 3 PART 5.gif"
            />
          </div>
          <div className="md:w-[50%] w-full md:mt-0 mt-10">
            <p className="md:text-[18px] text-[14px] font-[500] pb-3">
              Your Advantage: Complete Solutions at Shreeji Gems
            </p>
            <p className="md:text-[18px] text-[14px] font-[500] pb-3 text-justify">
              Partnering with Shreeji Gems means unlocking a complete solution
              tailored to your business needs, truly bringing "your imagination
              at one place." We pride ourselves on offering an extensive variety
              of products, providing the flexibility and breadth your inventory
              demands. Explore our diverse range of diamond types, including
              both natural and lab-grown options in various shapes and colors.
              Our jewelry types encompass meticulously crafted pieces in 10kt,
              14kt, or 18kt gold, as well as 925 silver, all available with both
              natural and lab diamonds to suit your specific market.
            </p>
            <p className="md:text-[18px] text-[14px] font-[500] text-justify">
              We stand by unwavering quality, unmatched prices, and superior
              services. We deliver quantity on time with impeccable finishing of
              product, always backed by the trust of certificates ensuring
              authenticity and brilliance. Our responsive communication and
              dedicated after-sales services ensure a seamless experience. We
              stay ahead of market demands with an efficient supply chain and an
              easy order process, guaranteeing shipping within time limits.
              Every piece embodies authenticity, brilliance, and beauty, with
              perfect alignments. Crucially, we are staunch advocates for
              responsible sourcing, guaranteeing that all our diamond and metal
              materials are conflict-free and sustainably acquired.
            </p>
          </div>
        </div>
      </div>

      {/* Section 6: Shaping Tomorrow */}
      <div
        ref={section6Ref}
        className="relative w-full h-auto px-4 md:px-4 lg:px-16 bg-white md:pt-24 pt-20"
      >
        <h3 className="w-full mb-3 text-center md:text-[28px] text-[20px] font-[600]">
          {" "}
          Shaping Tomorrow: Our Pledge to a Brighter Future{" "}
        </h3>
        <div className="flex w-full flex-col justify-center items-center text-center mb-5">
          <p className="md:text-[18px] text-[14px] font-[500] pb-3 w-full">
            At Shreeji Gems, our responsibility extends beyond exquisite
            diamonds and jewelry; it encompasses the well-being of our planet
            and our people. We are actively shaping tomorrow through
            comprehensive Corporate Social Responsibility (CSR) initiatives
            focused on Climate Change, Social Work, and Ethical Practice.
          </p>
          <p className="md:text-[18px] text-[14px] font-[500] pb-3 w-full">
            For Climate Change, we are committed to environmental stewardship
            through extensive plantation drives, crucial water harvesting
            programs, and efforts to ensure clean water access. We power our
            operations with solar energy and strive for a pollution-free campus,
            actively participating in cleaning campaigns to protect our natural
            world.
          </p>
          <p className="md:text-[18px] text-[14px] font-[500] pb-3 w-full">
            Our Social Work is woven into the fabric of our community
            engagement. We support education through school donations,
            contribute to public health with blood donations, alleviate hunger
            with meal donations, and improve living conditions by providing
            basic home equipment. Our skill development programs empower
            individuals, fostering a stronger, more capable society. We also
            actively promote civic sense, encouraging responsible citizenship.
          </p>
          <p className="md:text-[18px] text-[14px] font-[500] pb-3 w-full">
            Finally, our commitment to Responsible and Ethical Practice defines
            our internal culture. We cultivate comfortable working environments
            and a great work culture, valuing every team member. We provide
            substantial benefits and donations for our staff and their families,
            organize enriching tours, and conduct teamwork motivational
            seminars. We believe that by investing in our people, we build a
            foundation of collective success and contribute positively to our
            extended family and community.
          </p>
          <p className="md:text-[18px] text-[14px] font-[500] pb-3 w-full">
            “Moving right confirms your selection of our imperative principled
            path”
          </p>
        </div>

        {/* Shaping Tomorrow - Interactive Shutter Slider */}
        <div className="w-full h-[50%] bg-white md:pb-24 pb-5">
          <ShutterSlider />
        </div>
      </div>

      {/* Setion 7: Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
