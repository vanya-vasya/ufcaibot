"use client";

interface VSEmblemProps {
  className?: string;
  onClick?: () => void;
}

export const VSEmblem = ({ className = "", onClick }: VSEmblemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-red-500 rounded-lg px-4 py-2 transition-all ${className}`}
      data-testid="vs-emblem"
      aria-label="Start fight analysis"
    >
      <span
        className="text-3xl md:text-4xl font-black text-white dark:text-white fight-button-text"
        style={{
          fontFamily: 'var(--font-ufc-heading)',
          letterSpacing: '0.05em',
        }}
      >
        FIGHT
      </span>

      <style jsx>{`
        @keyframes jump {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        .fight-button-text {
          animation: jump 1s ease-in-out infinite, blink 1.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .fight-button-text {
            animation: none;
          }
        }
      `}</style>
    </button>
  );
};

