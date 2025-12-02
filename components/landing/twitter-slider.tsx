"use client";

import { fontSizes, fontWeights, lineHeights, letterSpacing } from "@/config/ufc-font";
import { Tweet, sampleTweets, formatRelativeTime } from "@/lib/twitter";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface TwitterSliderProps {
  tweets?: Tweet[];
}

// ============================================================================
// TWEET ITEM COMPONENT
// ============================================================================

interface TweetItemProps {
  tweet: Tweet;
}

const TweetItem = ({ tweet }: TweetItemProps) => {
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';

  // Truncate text to keep slider items compact
  const truncatedText = tweet.text.length > 120 
    ? tweet.text.substring(0, 117) + "..." 
    : tweet.text;

  return (
    <a
      href={tweet.link}
      target="_blank"
      rel="noopener noreferrer"
      className="tweet-item"
      role="listitem"
      aria-label={`Tweet from ${tweet.author.name}: ${tweet.text}`}
      tabIndex={0}
    >
      <span className="tweet-content">
        <span 
          className="tweet-author"
          style={{ fontFamily: ufcHeadingFont }}
        >
          @{tweet.author.username}
        </span>
        <span 
          className="tweet-text"
          style={{ fontFamily: ufcHeadingFont }}
        >
          {truncatedText}
        </span>
        <span 
          className="tweet-time"
          style={{ fontFamily: ufcHeadingFont }}
        >
          {formatRelativeTime(new Date(tweet.timestamp))}
        </span>
      </span>
      <span className="item-divider" aria-hidden="true">•</span>
    </a>
  );
};

// ============================================================================
// TWITTER SLIDER COMPONENT
// ============================================================================

const TwitterSlider = ({ tweets = sampleTweets }: TwitterSliderProps) => {
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';

  // Double the content for seamless infinite loop
  const duplicatedTweets = [...tweets, ...tweets];

  return (
    <section
      id="twitter-slider"
      className="twitter-slider-section shrink-0"
      aria-label="Latest UFC tweets"
      role="region"
    >
      <div className="twitter-slider-container">
        <div className="x-label" aria-hidden="true">
          <svg 
            viewBox="0 0 24 24" 
            className="x-logo"
            aria-label="X (Twitter)"
          >
            <path 
              fill="currentColor" 
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
          <span className="x-text">UFC</span>
        </div>
        <div 
          className="marquee-wrapper" 
          role="list"
          aria-label="UFC tweet feed"
        >
          <div className="marquee-content">
            {duplicatedTweets.map((tweet, index) => (
              <TweetItem key={`${tweet.id}-${index}`} tweet={tweet} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .twitter-slider-section {
          width: 100%;
          background: linear-gradient(180deg, #0a0a0a 0%, #111111 100%);
          overflow: hidden;
          flex-shrink: 0;
          min-height: 52px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .twitter-slider-container {
          display: flex;
          align-items: center;
          max-width: 100%;
          margin: 0 auto;
          padding: 14px 0;
          position: relative;
        }

        .x-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 20px;
          font-family: ${ufcHeadingFont};
          font-weight: ${fontWeights.bold};
          font-size: ${fontSizes.sm.value};
          line-height: ${lineHeights.snug};
          letter-spacing: ${letterSpacing.wider};
          text-transform: uppercase;
          color: #ffffff;
          white-space: nowrap;
          flex-shrink: 0;
          z-index: 10;
          background: linear-gradient(90deg, #0a0a0a 70%, transparent);
          padding-right: 32px;
        }

        .x-logo {
          width: 18px;
          height: 18px;
          color: #ffffff;
        }

        .x-text {
          color: #ffffff;
          font-weight: ${fontWeights.bold};
        }

        .marquee-wrapper {
          flex: 1;
          overflow: hidden;
          mask-image: linear-gradient(
            90deg,
            transparent,
            black 3%,
            black 97%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent,
            black 3%,
            black 97%,
            transparent
          );
        }

        .marquee-content {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: marquee-twitter 45s linear infinite;
          will-change: transform;
        }

        @keyframes marquee-twitter {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Pause animation on hover for desktop */
        @media (hover: hover) {
          .marquee-wrapper:hover .marquee-content {
            animation-play-state: paused;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .marquee-content {
            animation: none;
          }
        }
      `}</style>

      <style jsx global>{`
        .tweet-item {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          text-decoration: none;
          transition: opacity 0.2s ease;
          cursor: pointer;
        }

        .tweet-item:hover,
        .tweet-item:focus {
          opacity: 0.85;
        }

        .tweet-item:focus {
          outline: 2px solid rgba(255, 255, 255, 0.3);
          outline-offset: 2px;
          border-radius: 4px;
        }

        .tweet-content {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: ${fontSizes.sm.value};
          line-height: ${lineHeights.snug};
        }

        .tweet-author {
          color: #1d9bf0;
          font-weight: ${fontWeights.bold};
          letter-spacing: ${letterSpacing.wide};
        }

        .tweet-text {
          color: #e0e0e0;
          font-weight: ${fontWeights.normal};
          letter-spacing: ${letterSpacing.normal};
          max-width: 400px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tweet-time {
          color: #6e767d;
          font-size: 0.85em;
          font-weight: ${fontWeights.normal};
          margin-left: 4px;
        }

        .tweet-item .item-divider {
          color: #333333;
          margin-left: 8px;
          font-weight: ${fontWeights.light};
        }

        /* High contrast mode */
        @media (prefers-contrast: more) {
          .tweet-author {
            color: #4db5ff;
          }
          .tweet-text {
            color: #ffffff;
          }
          .tweet-time {
            color: #aaaaaa;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .tweet-item {
            padding: 0 10px;
          }
          .tweet-content {
            font-size: ${fontSizes.xs.value};
            gap: 8px;
          }
          .tweet-text {
            max-width: 200px;
          }
        }

        @media (min-width: 1024px) {
          .tweet-item {
            padding: 0 20px;
          }
          .tweet-content {
            font-size: ${fontSizes.base.value};
          }
          .tweet-text {
            max-width: 500px;
          }
        }
      `}</style>
    </section>
  );
};

export default TwitterSlider;

