"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface CardShuffleAnimationProps {
  images: string[];
  containerClassName?: string;
  cardWidth?: number;
  cardHeight?: number;
  autoShuffleInterval?: number;
}

const CardShuffleAnimation: React.FC<CardShuffleAnimationProps> = ({
  images,
  containerClassName = "w-[40%]",
  cardWidth = 300,
  cardHeight = 300,
  autoShuffleInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToNext = useCallback(() => {
    if (isAnimating || images.length <= 1) return;
    
    setIsAnimating(true);
    
    // After animation completes, update indices
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setNextIndex((prev) => (prev + 1) % images.length);
      setIsAnimating(false);
    }, 500); // Match this with CSS transition duration
  }, [isAnimating, images.length]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    
    // After animation completes, update indices
    setTimeout(() => {
      setCurrentIndex(index);
      setNextIndex((index + 1) % images.length);
      setIsAnimating(false);
    }, 500); // Match this with CSS transition duration
  };

  // Auto-advance to next slide
  useEffect(() => {
    const interval = setInterval(goToNext, autoShuffleInterval);
    return () => clearInterval(interval);
  }, [goToNext, autoShuffleInterval]);

  return (
    <div className={`flex flex-col justify-center items-center gap-4 z-0 ${containerClassName}`}>
      {/* Stacked Carousel Container */}
      <div 
        className="relative" 
        style={{ 
          width: cardWidth + 60, 
          height: cardHeight + 60,
          perspective: '1000px' // Add perspective for 3D effect
        }}
      >
        {/* Back Card (Next in line) */}
        <div
          className={`absolute transition-all duration-500 ease-out rounded-2xl overflow-hidden shadow-xl -mt-10 ${
            isAnimating ? 'z-10' : 'z-0'
          }`}
          style={{
            width: cardWidth,
            height: cardHeight,
            top: '5%',
            right: '5%',
            transform: isAnimating 
              ? 'translateX(0) translateY(0) scale(1.1) rotateY(0deg)'
              : 'translateX(30px) translateY(30px) scale(0.9) rotateY(5deg)',
            opacity: isAnimating ? 1 : 0.8,
            zIndex: isAnimating ? 10 : 1,
            transition: 'all 0.5s ease-out, z-index 0.5s step-end',
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src={images[nextIndex]}
              alt={`Slide ${nextIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>

        {/* Front Card (Current) */}
        <div
          className={`absolute transition-all duration-500 ease-out rounded-2xl overflow-hidden shadow-2xl cursor-pointer ${
            isAnimating ? 'z-0' : 'z-10'
          }`}
          style={{
            width: cardWidth,
            height: cardHeight,
            bottom: 0,
            left: 0,
            transform: isAnimating 
              ? 'translateX(-30px) translateY(-30px) scale(0.9) rotateY(-5deg)'
              : 'translateX(0) translateY(0) scale(1) rotateY(0deg)',
            opacity: isAnimating ? 0.8 : 1,
            zIndex: isAnimating ? 1 : 10,
            transition: 'all 0.5s ease-out, z-index 0.5s step-start',
          }}
          onClick={goToNext}
        >
          <div className="relative w-full h-full">
            <Image
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex gap-2 justify-center items-center mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-brand-700'
                : 'w-2 h-2 bg-brand-400 hover:bg-brand-700'
            } disabled:cursor-not-allowed`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CardShuffleAnimation;
