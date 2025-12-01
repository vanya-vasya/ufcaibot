"use client";

import Image from "next/image";

const Features = () => {
  return (
    <section
      id="features"
      className="relative w-full bg-black"
    >
      {/* Two images container - edge to edge, no gaps */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Left image - Gaethje vs Pimblett */}
        <div className="relative w-full md:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          <Image
            src="/images/faceoffs/gaethje-pimblett.jpg"
            alt="Justin Gaethje vs Paddy Pimblett face-off"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Right image - Volkanovski vs Lopes */}
        <div className="relative w-full md:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          <Image
            src="/images/faceoffs/volkanovski-lopes.jpg"
            alt="Volkanovski vs Lopes face-off"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
