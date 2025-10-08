"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Clock } from "lucide-react";

const ContactPage = () => {

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
        
        <div className="mx-auto max-w-4xl py-20 sm:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 
              className="text-black font-bold leading-[1.1] tracking-tight text-4xl sm:text-5xl lg:text-6xl" 
              style={{
                fontFamily: 'var(--contact-font)',
                textTransform: 'none'
              }}
            >
              Get in touch
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
                color: '#1f2937'
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
                color: '#475569'
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
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Get in touch with our team. We&apos;re here to help with your nutrition journey
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Email Support</h4>
                    <p className="text-gray-600 mb-2">For general questions and support</p>
                    <a 
                      href="mailto:info@yum-mi.com"
                      className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
                      aria-label="Send email to Yum-mi support"
                    >
                      info@yum-mi.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Response Time</h4>
                    <p className="text-gray-600">We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Feedback & Ideas</h4>
                    <p className="text-gray-600">Have an idea for a new feature? We&apos;re all ears</p>
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
