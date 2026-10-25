"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ShutterPanelProps {
  leftImage: string;
  rightImage: string;
  altLeft: string;
  altRight: string;
}

const ShutterPanel: React.FC<ShutterPanelProps> = ({
  leftImage,
  rightImage,
  altLeft,
  altRight,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-ew-resize select-none z-0"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* Right Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={rightImage}
          alt={altRight}
          fill
          className="object-cover"
          draggable={false}
        />
      </div>

      {/* Left Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={leftImage}
          alt={altLeft}
          fill
          className="object-cover"
          draggable={false}
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex gap-1">
            <svg width="8" height="16" viewBox="0 0 8 16" fill="none">
              <path d="M7 1L1 8L7 15" stroke="#263329" strokeWidth="2" />
            </svg>
            <svg width="8" height="16" viewBox="0 0 8 16" fill="none">
              <path d="M1 1L7 8L1 15" stroke="#263329" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShutterSlider: React.FC = () => {
  const shutterData = [
    {
      leftImage:
        "/assets/about-us/sections/section_4/section 4 part 1 left side.svg",
      rightImage:
        "/assets/about-us/sections/section_4/section 4 part 1 right side.svg",
      altLeft: "Part 1 Left",
      altRight: "Part 1 Right",
    },
    {
      leftImage:
        "/assets/about-us/sections/section_4/section 4 part 2 left side.svg",
      rightImage:
        "/assets/about-us/sections/section_4/section 4 part 2 right side.svg",
      altLeft: "Part 2 Left",
      altRight: "Part 2 Right",
    },
    {
      leftImage:
        "/assets/about-us/sections/section_4/section 4 part 3 left side.svg",
      rightImage:
        "/assets/about-us/sections/section_4/section 4 part 3 right side.svg",
      altLeft: "Part 3 Left",
      altRight: "Part 3 Right",
    },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row">
      {shutterData.map((panel, index) => (
        <div key={index} className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
          <ShutterPanel {...panel} />
        </div>
      ))}
    </div>
  );
};

export default ShutterSlider;
