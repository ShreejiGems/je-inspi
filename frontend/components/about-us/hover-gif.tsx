import Image from "next/image";
import React, { useState } from "react";

const HoverGif = ({ still, gif }: any) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Image
      src={isHover ? gif : still}
      alt="gif"
      width={500}
      height={500}
      className="w-[636px] h-[100px]"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    />
  );
};

export default HoverGif;
