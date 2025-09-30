"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import Link from "next/link";

const products = [
  {
    title: "Your Own Chef",
    description: "Take the guesswork out of cooking with a smart service that can turn a photo of ingredients into a ready-to-cook recipe. Instantly discover the most optimal dish for your pantry staples, along with delicious variations inspired by different world cuisines. Cooking becomes simpler, fresher, and more creative starting with just one snap",
    image: "/images/resource/master-chef-transformation.jpg",
    type: "image",
  },
  {
    title: "Your Own Nutritionist", 
    description: "Discover a service that provides you with clear, tailored advice and step-by-step guidance built around your unique goals and wishes. It's like having a supportive coach in your pocket, helping you make choices that truly fit your lifestyle. Think personalized nutrition that adapts to your age, goals, and allergies, so every plan feels made just for you",
    image: "/images/resource/master-nutritionist-personalized.jpg",
    type: "image",
  },
  {
    title: "Your Own Tracker",
    description: "Snap a photo of your meal and instantly see the full nutritional breakdown with real-time macros and calorie counts. Using smart computer vision, the service helps you stay on track effortlessly by turning every plate into clear, actionable insights. Eating well has never been this simple or this quick",
    image: "/images/resource/cal-tracker-computer-vision.jpg",
    type: "image", 
  },
  {
    title: "Your Own Digest",
    description: "Coming Soon",
    image: "/images/resource/digest-recommendations-coming-soon.jpg",
    type: "image",
  },
];

const Products = () => {

  return (
    <section id="products" className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
            style={{
              fontFamily: "var(--contact-font)",
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '0.01em',
            }}
          >
            Our Core Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-8"
          >
            Powerful AI-driven tools to transform your cooking and nutrition experience
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-green-400 hover:bg-green-500 text-slate-900 font-semibold rounded-full transition-all duration-300 hover:shadow-lg"
              aria-label="View all products in dashboard"
            >
              View All Products
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Products stack */}
        <div className="max-w-7xl mx-auto space-y-20 lg:space-y-32">
          {products.map((product, index) => {
            // Apply gray background to Your Own Chef and Your Own Tracker
            const hasGrayBackground = product.title === "Your Own Chef" || product.title === "Your Own Tracker";
            
            return (
              <div
                key={product.title}
                className={hasGrayBackground ? "bg-slate-100 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-16 lg:py-20" : ""}
              >
                <div className={hasGrayBackground ? "container mx-auto px-4" : ""}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center ${
                      index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                    } ${hasGrayBackground ? 'max-w-7xl mx-auto' : ''}`}
                  >
              {/* Text content */}
              <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                    {product.title}
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed mb-8">
                    {product.description}
                  </p>
                </div>
                
                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block"
                >
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-6 py-3 bg-green-400 hover:bg-green-500 text-slate-900 font-semibold rounded-full transition-all duration-300 hover:shadow-lg"
                    aria-label={`Try ${product.title}`}
                  >
                    {product.title === "Your Own Digest" ? "Coming Soon" : "Try Now"}
                    {product.title !== "Your Own Digest" && (
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </Link>
                </motion.div>
              </div>

              {/* Image content */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Image
                    src={product.image}
                    alt={`${product.title} demonstration`}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    loading={index < 2 ? "eager" : "lazy"}
                    priority={index < 2}
                  />
                  
                  {/* Subtle overlay for better contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
                </motion.div>
              </div>
            </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default Products;
