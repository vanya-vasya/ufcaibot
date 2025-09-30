"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Mail, MapPin, Phone, Clock, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

import { FormData, formSchema } from "@/components/landing/constants";
import { sendContactForm } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const ContactPage = () => {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setSubmitState('submitting');
      
      // Add reCAPTCHA token (you would implement this in production)
      const formDataWithCaptcha = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        message: data.message,
        captchaToken: "placeholder_token", // Replace with actual reCAPTCHA implementation
      };

      await sendContactForm(formDataWithCaptcha);
      
      setSubmitState('success');
      form.reset();
      toast.success("Message sent successfully! We'll get back to you soon.");
      
      // Reset success state after 3 seconds
      setTimeout(() => setSubmitState('idle'), 3000);
      
    } catch (error) {
      setSubmitState('error');
      toast.error("Failed to send message. Please try again later or contact us directly.");
      
      // Reset error state after 3 seconds
      setTimeout(() => setSubmitState('idle'), 3000);
    }
  };

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
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:pr-8"
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

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 px-8 py-10 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Send us a message
                </h3>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we&apos;ll get back to you as soon as possible
                </p>

                <Form {...form}>
                  <form 
                    onSubmit={form.handleSubmit(handleSubmit)} 
                    className="space-y-6"
                    noValidate
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">
                              First name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your first name"
                                className="h-12 bg-white border-gray-300 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                                aria-required="true"
                                disabled={submitState === 'submitting'}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">
                              Last name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your last name"
                                className="h-12 bg-white border-gray-300 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                                aria-required="true"
                                disabled={submitState === 'submitting'}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Email *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email address"
                              className="h-12 bg-white border-gray-300 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                              aria-required="true"
                              disabled={submitState === 'submitting'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Message *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Tell us how we can help you..."
                              className="min-h-[120px] bg-white border-gray-300 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 resize-none"
                              aria-required="true"
                              disabled={submitState === 'submitting'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitState === 'submitting'}
                      className={`w-full h-12 font-semibold text-white transition-all duration-300 ${
                        submitState === 'success'
                          ? 'bg-emerald-500 hover:bg-emerald-500'
                          : submitState === 'error'
                          ? 'bg-red-500 hover:bg-red-500'
                          : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]'
                      } shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2`}
                      aria-label="Send message to Yum-mi team"
                    >
                      {submitState === 'submitting' && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {submitState === 'success' && (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      {submitState === 'error' && (
                        <AlertCircle className="mr-2 h-4 w-4" />
                      )}
                      {submitState === 'submitting'
                        ? 'Sending...'
                        : submitState === 'success'
                        ? 'Message Sent!'
                        : submitState === 'error'
                        ? 'Try Again'
                        : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        </div>
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

export default ContactPage;
