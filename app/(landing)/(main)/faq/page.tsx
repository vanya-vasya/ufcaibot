"use client";

import { motion } from "framer-motion";

const FaqPage = () => {
  return (
    <div className="relative" style={{ backgroundColor: '#000000', '--font-ufc-heading': '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif'} as React.CSSProperties & {'--font-ufc-heading': string}}>
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-24 lg:px-8" style={{ marginTop: '80px' }}>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
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
              className="font-bold leading-[1.1] tracking-tight text-4xl sm:text-5xl lg:text-6xl" 
              style={{
                fontFamily: 'var(--font-ufc-heading)',
                textTransform: 'none',
                color: '#FFFFFF'
              }}
            >
              Frequently Asked Questions
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl text-base sm:text-lg text-center mx-auto mt-4"
              style={{
                fontFamily: 'var(--font-ufc-heading)',
                fontWeight: 500,
                letterSpacing: '0.01em',
                textTransform: 'none',
                color: '#FFFFFF'
              }}
            >
              Find answers to common questions about our AI-powered fight prediction web app
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
          <div className="rounded-2xl px-8 py-12" style={{ backgroundColor: '#000000' }}>
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
                  className="border-b border-zinc-600 pb-8"
                >
                  <dt 
                    className="text-lg font-semibold mb-4"
                    style={{
                      fontFamily: 'var(--font-ufc-heading)',
                      color: '#FFFFFF',
                      letterSpacing: '0.01em'
                    }}
                  >
                    What is the AI Fight Predictor?
                  </dt>
                  <dd 
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-ufc-heading)',
                      color: '#FFFFFF',
                      fontWeight: 500,
                      lineHeight: '1.7'
                    }}
                  >
                    It&apos;s your smart co-pilot for fight predictions. The AI Fight Predictor combines live odds from multiple sportsbooks, deep fighter stats, and real-time news to estimate each fighter&apos;s true chances of winning. Instead of scrolling through forums and stats for hours, you get a clear, data-driven view of who has the edge in seconds
                  </dd>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="border-b border-zinc-600 pb-8"
                >
                  <dt 
                    className="text-lg font-semibold mb-4"
                    style={{
                      fontFamily: 'var(--font-ufc-heading)',
                      color: '#FFFFFF',
                      letterSpacing: '0.01em'
                    }}
                  >
                    What is the Odds &amp; Value Scanner?
                  </dt>
                  <dd 
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-ufc-heading)',
                      color: '#FFFFFF',
                      fontWeight: 500,
                      lineHeight: '1.7'
                    }}
                  >
                    The Odds &amp; Value Scanner constantly tracks betting lines across different bookmakers and highlights where the numbers don&apos;t add up. It spots mispriced underdogs, sharp line moves, and unusual market gaps so you can focus on predictions with real value instead of just chasing low-priced favorites
                  </dd>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="border-b border-zinc-600 pb-8"
                >
                  <dt 
                    className="text-lg font-semibold mb-4"
                    style={{
                      fontFamily: 'var(--font-ufc-heading)',
                      color: '#FFFFFF',
                      letterSpacing: '0.01em'
                    }}
                  >
                    What is the Fighter Research Hub?
                  </dt>
                  <dd 
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-ufc-heading)',
                      color: '#FFFFFF',
                      fontWeight: 500,
                      lineHeight: '1.7'
                    }}
                  >
                    The Fighter Research Hub is your all-in-one matchup dashboard. You&apos;ll see side-by-side comparisons of reach, age, record, recent form, methods of victory, striking and grappling stats, plus stylistic notes. Everything is packaged in a clean web interface, so you can understand the story behind the numbers
                  </dd>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="border-b border-zinc-600 pb-8"
                >
                  <dt 
                    className="text-lg font-semibold mb-4"
                    style={{
                      fontFamily: 'var(--font-ufc-heading)',
                      color: '#FFFFFF',
                      letterSpacing: '0.01em'
                    }}
                  >
                    How does the Token system work?
                  </dt>
                  <dd 
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-ufc-heading)',
                      color: '#FFFFFF',
                      fontWeight: 500,
                      lineHeight: '1.7'
                    }}
                  >
                    Tokens give you flexible, pay-as-you-go access to the app. Buy a token pack once, and each AI prediction or full fight breakdown uses a small number of Tokens—no subscriptions, no recurring charges. Larger packs include bonus Tokens, so heavy users and high-volume predictors get more value for every analysis
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
                      fontFamily: 'var(--font-ufc-heading)',
                      color: '#FFFFFF',
                      letterSpacing: '0.01em'
                    }}
                  >
                    What do I get after generating a fight prediction?
                  </dt>
                  <dd 
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-ufc-heading)',
                      color: '#FFFFFF',
                      fontWeight: 500,
                      lineHeight: '1.7'
                    }}
                  >
                    Each prediction gives you a clear, structured breakdown built around three core pillars. First, the AI scans the news and media sentiment to catch signals like injuries, camp changes, and overall hype. Second, it runs a systematic analysis of historical performance to see how both fighters have performed in past matchups and styles. Third, it reviews current betting lines to understand which side the bookmakers favor and how the market is pricing each fighter. All of this is merged into one easy-to-read answer, so you don&apos;t just see who is more likely to win, but why
                  </dd>
                </motion.div>
              </dl>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FaqPage;
