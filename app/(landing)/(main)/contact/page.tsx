"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Clock } from "lucide-react";

const ContactPage = () => {

  return (
    <div className="bg-black relative" style={{'--contact-font': '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif'} as React.CSSProperties & {'--contact-font': string}}>
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-24 lg:px-8" style={{ marginTop: '80px' }}>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        <div className="mx-auto max-w-4xl py-20 sm:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 
              className="text-white font-bold leading-[1.1] tracking-tight text-4xl sm:text-5xl lg:text-6xl" 
              style={{
                fontFamily: 'var(--contact-font)',
                textTransform: 'none'
              }}
            >
              Get In Touch
            </h1>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl text-xl sm:text-2xl text-center mx-auto mt-6 font-semibold"
              style={{
                fontFamily: 'var(--contact-font)',
                letterSpacing: '0.01em',
                textTransform: 'none',
                color: '#FFFFFF'
              }}
            >
              Have a question or feedback?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl text-base sm:text-lg text-center mx-auto mt-4"
              style={{
                fontFamily: 'var(--contact-font)',
                fontWeight: 500,
                letterSpacing: '0.01em',
                textTransform: 'none',
                color: '#d1d5db'
              }}
            >
              We would love to hear from you
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="flex justify-center">
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <h3 
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: 'var(--contact-font)' }}
              >
                Contact Information
              </h3>
              <p 
                className="text-lg text-gray-300 mb-8"
                style={{ fontFamily: 'var(--contact-font)' }}
              >
                Get in touch with our team. We&apos;re here to help with your nutrition journey
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 
                      className="text-lg font-semibold text-white mb-1"
                      style={{ fontFamily: 'var(--contact-font)' }}
                    >
                      Email Support
                    </h4>
                    <p 
                      className="text-gray-300 mb-2"
                      style={{ fontFamily: 'var(--contact-font)' }}
                    >
                      For general questions and support
                    </p>
                    <a 
                      href="mailto:info@ufcaibot.com"
                      className="text-white hover:text-gray-300 font-medium transition-colors duration-200"
                      aria-label="Send email to UFC AI Bot support"
                      style={{ fontFamily: 'var(--contact-font)' }}
                    >
                      info@ufcaibot.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 
                      className="text-lg font-semibold text-white mb-1"
                      style={{ fontFamily: 'var(--contact-font)' }}
                    >
                      Response Time
                    </h4>
                    <p 
                      className="text-gray-300"
                      style={{ fontFamily: 'var(--contact-font)' }}
                    >
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 
                      className="text-lg font-semibold text-white mb-1"
                      style={{ fontFamily: 'var(--contact-font)' }}
                    >
                      Feedback & Ideas
                    </h4>
                    <p 
                      className="text-gray-300"
                      style={{ fontFamily: 'var(--contact-font)' }}
                    >
                      Have an idea for a new feature? We&apos;re all ears
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
