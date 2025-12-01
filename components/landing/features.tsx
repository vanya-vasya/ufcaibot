"use client";

import Image from "next/image";

const Features = () => {
  return (
    <section
      id="features"
      className="relative w-full bg-black"
      aria-label="UFC Fighter Face-offs"
    >
      {/* Two enhanced images container - edge to edge, 1:1 aspect ratio optimized */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Left image - Gaethje vs Pimblett (Enhanced 1024x1024) */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:h-[500px] lg:h-[600px] xl:h-[700px]">
          <Image
            src="/images/faceoffs/gaethje-pimblett.jpg"
            alt="Justin Gaethje vs Paddy Pimblett intense UFC weigh-in face-off"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={85}
            priority
          />
        </div>

        {/* Right image - Volkanovski vs Lopes (Enhanced 1024x1024) */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:h-[500px] lg:h-[600px] xl:h-[700px]">
          <Image
            src="/images/faceoffs/volkanovski-lopes.jpg"
            alt="Alexander Volkanovski vs Diego Lopes UFC weigh-in face-off"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={85}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
