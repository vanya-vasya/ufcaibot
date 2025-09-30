"use client";

import { motion } from "framer-motion";

const FaqPage = () => {
  return (
    <div className="bg-white relative" style={{'--contact-font': 'Inter, system-ui, -apple-system, sans-serif'} as React.CSSProperties & {'--contact-font': string}}>
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-24 lg:px-8" style={{ marginTop: '80px' }}>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 
              className="text-black font-semibold leading-[1.1] tracking-[0.01em]" 
              style={{
                fontFamily: 'var(--contact-font)',
                fontSize: '2.5rem',
                textTransform: 'none'
              }}
            >
              Frequently Asked Questions
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl text-base text-center mx-auto mt-6"
              style={{
                fontFamily: 'var(--contact-font)',
                fontWeight: 600,
                letterSpacing: '0.01em',
                textTransform: 'none',
                color: '#475569'
              }}
            >
              Find answers to common questions about Yum-mi&apos;s AI-powered nutrition platform
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <div className="rounded-2xl bg-gray-50 px-8 py-12">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <dl className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="border-b border-gray-200 pb-8"
                >
                  <dt 
                    className="text-lg font-semibold mb-4"
                    style={{
                      fontFamily: 'var(--contact-font)',
                      color: '#1e293b',
                      letterSpacing: '0.01em'
                    }}
                  >
                    What is the AI Recipe Generator?
                  </dt>
                  <dd 
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: 'var(--contact-font)',
                      color: '#475569',
                      fontWeight: 500,
                      lineHeight: '1.7'
                    }}
                  >
                    Say goodbye to mealtime stress! Our AI Recipe Generator turns a simple photo of your ingredients into a ready-to-cook recipe. In seconds, you&apos;ll uncover the perfect dish for what&apos;s in your kitchen, along with exciting twists inspired by cuisines from around the world. Cooking becomes easier, fresher, and way more fun starting with just one snap
                  </dd>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="border-b border-gray-200 pb-8"
                >
                  <dt 
                    className="text-lg font-semibold mb-4"
                    style={{
                      fontFamily: 'var(--contact-font)',
                      color: '#1e293b',
                      letterSpacing: '0.01em'
                    }}
                  >
                    What is the AI Nutrition Solution Generator?
                  </dt>
                  <dd 
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: 'var(--contact-font)',
                      color: '#475569',
                      fontWeight: 500,
                      lineHeight: '1.7'
                    }}
                  >
                    Meet your new pocket-sized wellness partner! This smart service gives you clear, personalized advice and step-by-step guidance based on your unique goals and lifestyle. Think of it as personalized nutrition that adapts to your age, goals, and allergies making healthy living effortless, flexible, and completely yours
                  </dd>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="border-b border-gray-200 pb-8"
                >
                  <dt 
                    className="text-lg font-semibold mb-4"
                    style={{
                      fontFamily: 'var(--contact-font)',
                      color: '#1e293b',
                      letterSpacing: '0.01em'
                    }}
                  >
                    What is the AI Cal Tracker Generator?
                  </dt>
                  <dd 
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: 'var(--contact-font)',
                      color: '#475569',
                      fontWeight: 500,
                      lineHeight: '1.7'
                    }}
                  >
                    Turn every meal into instant insights! Just snap a photo of your food, and our AI instantly delivers a full breakdown of calories, proteins, fats, and carbs all in real time. With computer-vision magic, you&apos;ll always know exactly what&apos;s on your plate, keeping healthy eating simple, quick, and motivating
                  </dd>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="border-b border-gray-200 pb-8"
                >
                  <dt 
                    className="text-lg font-semibold mb-4"
                    style={{
                      fontFamily: 'var(--contact-font)',
                      color: '#1e293b',
                      letterSpacing: '0.01em'
                    }}
                  >
                    How does the Token system work?
                  </dt>
                  <dd 
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: 'var(--contact-font)',
                      color: '#475569',
                      fontWeight: 500,
                      lineHeight: '1.7'
                    }}
                  >
                    Our Tokens make it easy and flexible to use the service. Simply purchase a package, and each recipe generation uses just a few Tokens no subscriptions or hidden fees. Plus, larger packages come with bonus Tokens, giving you even more value and freedom to explore
                  </dd>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="border-b border-gray-200 pb-8"
                >
                  <dt 
                    className="text-lg font-semibold mb-4"
                    style={{
                      fontFamily: 'var(--contact-font)',
                      color: '#1e293b',
                      letterSpacing: '0.01em'
                    }}
                  >
                    Can I specify dietary requirements?
                  </dt>
                  <dd 
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: 'var(--contact-font)',
                      color: '#475569',
                      fontWeight: 500,
                      lineHeight: '1.7'
                    }}
                  >
                    Absolutely! You can set your preferences to match your lifestyle whether you&apos;re vegan, gluten-free, or simply in the mood for Italian tonight. You can even set a maximum cooking time, so every recipe is a perfect fit for your needs
                  </dd>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <dt 
                    className="text-lg font-semibold mb-4"
                    style={{
                      fontFamily: 'var(--contact-font)',
                      color: '#1e293b',
                      letterSpacing: '0.01em'
                    }}
                  >
                    What do I get after generating a recipe?
                  </dt>
                  <dd 
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: 'var(--contact-font)',
                      color: '#475569',
                      fontWeight: 500,
                      lineHeight: '1.7'
                    }}
                  >
                    Every recipe you generate comes in a beautifully designed PDF. It includes a complete list of ingredients, and simple step-by-step instructions
                  </dd>
                </motion.div>
              </dl>
            </motion.section>
          </div>
        </motion.div>
      </div>
      
      <style jsx global>{`
        /* Ensure header has proper z-index and positioning */
        header {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 9999 !important;
          background: white !important;
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        /* Ensure body has proper scroll behavior */
        body {
          padding-top: 0 !important;
        }
        
        /* Ensure all nav links are clickable */
        .nav-link {
          pointer-events: auto !important;
          cursor: pointer !important;
        }
        
        /* Ensure dropdown works properly */
        .dropdown-menu {
          z-index: 10000 !important;
        }
      `}</style>
    </div>
  );
};

export default FaqPage;
