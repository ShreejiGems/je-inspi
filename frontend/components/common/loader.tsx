import React from "react";
import Image from "next/image";

interface ShreejiLoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const ShreejiLoader: React.FC<ShreejiLoaderProps> = ({
  size = "small",
  color = "#6b8965",
  text,
  fullScreen = false,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          wrapper: "w-14 h-14 sm:w-16 sm:h-16",
          logo: { width: 50, height: 22 },
          text: "text-[10px] sm:text-xs",
        };
      case "large":
        return {
          wrapper: "w-24 h-24 sm:w-28 sm:h-28",
          logo: { width: 110, height: 50 },
          text: "text-sm sm:text-base",
        };
      default:
        return {
          wrapper: "w-20 h-20 sm:w-24 sm:h-24",
          logo: { width: 80, height: 36 },
          text: "text-xs sm:text-sm",
        };
    }
  };

  const sizes = getSizeClasses();

  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-2 select-none">
      <div
        className={`relative ${sizes.wrapper} flex items-center justify-center`}
      >
        {/* Logo */}
        <div className="relative z-10 scale-75 sm:scale-90 md:scale-100 transition-all">
          <Image
            src="/assets/brand/je-inspi-logo-transparent.png"
            width={sizes.logo.width}
            height={sizes.logo.height}
            alt="JE-Inspi logo"
            priority
          />
        </div>

        {/* Circle animation */}
        <div
          className={`
            absolute inset-0 rounded-full border-2 border-dashed 
            animate-[spin_2.5s_linear_infinite]
          `}
          style={{ borderColor: color }}
        />
      </div>

      {text && (
        <p
          className={`${sizes.text} font-medium text-center`}
          style={{ color }}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50 p-4">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default ShreejiLoader;
