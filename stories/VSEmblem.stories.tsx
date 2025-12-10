import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { VSEmblem, DEFAULT_ANALYSIS_PHRASES } from "@/components/dashboard/VSEmblem";

const meta: Meta<typeof VSEmblem> = {
  title: "Dashboard/VSEmblem",
  component: VSEmblem,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
  argTypes: {
    isLoading: {
      control: "boolean",
      description: "Whether the button is in loading state",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    phraseDuration: {
      control: { type: "range", min: 1000, max: 10000, step: 500 },
      description: "Duration for phrase animation (ms)",
    },
    analysisPhrases: {
      control: "object",
      description: "Custom phrases for the typewriter effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof VSEmblem>;

/**
 * Default state - shows FIGHT button with animation
 */
export const Default: Story = {
  args: {
    isLoading: false,
    disabled: false,
  },
};

/**
 * Loading state - shows spinner and typewriter phrases
 */
export const Loading: Story = {
  args: {
    isLoading: true,
    disabled: false,
    phraseDuration: 5000,
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    isLoading: false,
    disabled: true,
  },
};

/**
 * Loading with custom phrases
 */
export const LoadingCustomPhrases: Story = {
  args: {
    isLoading: true,
    analysisPhrases: [
      "Custom analysis in progress…",
      "Processing your data…",
      "Almost ready…",
    ],
    phraseDuration: 5000,
  },
};

/**
 * Interactive demo - click to start loading
 */
const InteractiveDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate API call completing after 6 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 6000);
  };

  const handlePhraseComplete = () => {
    console.log("Phrase animation completed");
  };

  return (
    <div className="p-8">
      <VSEmblem
        onClick={handleClick}
        isLoading={isLoading}
        disabled={false}
        phraseDuration={5000}
        onPhraseComplete={handlePhraseComplete}
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
  parameters: {
    docs: {
      description: {
        story: "Click the FIGHT button to start the loading animation with typewriter phrases.",
      },
    },
  },
};

/**
 * Full integration demo simulating real usage
 */
const FullIntegrationDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleClick = () => {
    setIsLoading(true);
    setResult(null);

    // Simulate API call with random duration between 3-7 seconds
    const duration = 3000 + Math.random() * 4000;
    
    setTimeout(() => {
      setIsLoading(false);
      setResult("Analysis complete! Fighter A has 67% chance of winning.");
    }, duration);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 min-w-[400px]">
      <VSEmblem
        onClick={handleClick}
        isLoading={isLoading}
        disabled={!!result}
        phraseDuration={5000}
      />

      {result && (
        <div className="text-center">
          <p className="text-green-400 mb-4">{result}</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export const FullIntegration: Story = {
  render: () => <FullIntegrationDemo />,
  parameters: {
    docs: {
      description: {
        story: "Complete integration showing the button click, loading animation with typewriter phrases, and result display.",
      },
    },
  },
};

/**
 * With callback demonstration
 */
const CallbackDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [phraseCompleted, setPhraseCompleted] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setPhraseCompleted(false);
  };

  const handlePhraseComplete = () => {
    setPhraseCompleted(true);
    // Auto-stop after phrase animation completes
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <VSEmblem
        onClick={handleClick}
        isLoading={isLoading}
        disabled={false}
        phraseDuration={3000}
        onPhraseComplete={handlePhraseComplete}
      />

      <div className="text-center text-sm">
        <p className="text-zinc-400">
          Loading: {isLoading ? "Yes" : "No"}
        </p>
        <p className="text-zinc-400">
          Phrase animation completed: {phraseCompleted ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
};

export const WithPhraseCallback: Story = {
  render: () => <CallbackDemo />,
  parameters: {
    docs: {
      description: {
        story: "Demonstrates the onPhraseComplete callback when the typewriter animation finishes.",
      },
    },
  },
};
