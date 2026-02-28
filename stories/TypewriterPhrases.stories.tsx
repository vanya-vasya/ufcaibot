import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { TypewriterPhrases, DEFAULT_ANALYSIS_PHRASES } from "@/components/dashboard/TypewriterPhrases";

const meta: Meta<typeof TypewriterPhrases> = {
  title: "Dashboard/TypewriterPhrases",
  component: TypewriterPhrases,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
  argTypes: {
    isActive: {
      control: "boolean",
      description: "Whether the animation is active",
    },
    totalDuration: {
      control: { type: "range", min: 1000, max: 10000, step: 500 },
      description: "Total duration for animation cycle (ms)",
    },
    displayDuration: {
      control: { type: "range", min: 100, max: 1000, step: 100 },
      description: "Time to display completed phrase (ms)",
    },
    charDelay: {
      control: { type: "range", min: 10, max: 100, step: 10 },
      description: "Delay between characters (ms)",
    },
    phrases: {
      control: "object",
      description: "List of phrases to display",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TypewriterPhrases>;

/**
 * Default behavior with all analysis phrases
 */
export const Default: Story = {
  args: {
    isActive: true,
    totalDuration: 5000,
    displayDuration: 300,
    charDelay: 30,
    phrases: DEFAULT_ANALYSIS_PHRASES,
  },
};

/**
 * With custom short phrases
 */
export const CustomPhrases: Story = {
  args: {
    isActive: true,
    totalDuration: 5000,
    displayDuration: 500,
    charDelay: 50,
    phrases: [
      "Loading data…",
      "Processing request…",
      "Almost there…",
    ],
  },
};

/**
 * Fast typing speed
 */
export const FastTyping: Story = {
  args: {
    isActive: true,
    totalDuration: 5000,
    displayDuration: 200,
    charDelay: 15,
    phrases: DEFAULT_ANALYSIS_PHRASES,
  },
};

/**
 * Slow typing speed (dramatic effect)
 */
export const SlowTyping: Story = {
  args: {
    isActive: true,
    totalDuration: 8000,
    displayDuration: 500,
    charDelay: 60,
    phrases: DEFAULT_ANALYSIS_PHRASES.slice(0, 5),
  },
};

/**
 * Interactive toggle demo
 */
const ToggleDemo = () => {
  const [isActive, setIsActive] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const handleComplete = () => {
    setCompletedCount((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <button
        onClick={() => setIsActive(!isActive)}
        className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${
          isActive
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isActive ? "Stop Animation" : "Start Animation"}
      </button>

      <TypewriterPhrases
        isActive={isActive}
        totalDuration={5000}
        onComplete={handleComplete}
        className="min-w-[400px]"
      />

      <p className="text-zinc-400 text-sm">
        Animation completed: {completedCount} times
      </p>
    </div>
  );
};

export const InteractiveToggle: Story = {
  render: () => <ToggleDemo />,
};

/**
 * Simulates the Fight button loading state
 */
const FightButtonDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFight = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 6000);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <button
        onClick={handleFight}
        disabled={isLoading}
        className={`px-8 py-4 rounded-lg font-black text-white text-2xl transition-all ${
          isLoading
            ? "bg-zinc-700 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
        style={{ fontFamily: 'var(--font-ufc-heading, "Arial Narrow")' }}
      >
        {isLoading ? "ANALYZING..." : "FIGHT"}
      </button>

      <TypewriterPhrases
        isActive={isLoading}
        totalDuration={5000}
        className="min-w-[350px]"
      />
    </div>
  );
};

export const FightButtonSimulation: Story = {
  render: () => <FightButtonDemo />,
};

/**
 * With callback on complete
 */
const CallbackDemo = () => {
  const [isActive, setIsActive] = useState(true);
  const [status, setStatus] = useState("Running...");

  const handleComplete = () => {
    setStatus("Animation completed!");
    setIsActive(false);
  };

  const handleRestart = () => {
    setStatus("Running...");
    setIsActive(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <TypewriterPhrases
        isActive={isActive}
        totalDuration={3000}
        onComplete={handleComplete}
        className="min-w-[350px]"
      />

      <p className="text-zinc-400">{status}</p>

      {!isActive && (
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Restart
        </button>
      )}
    </div>
  );
};

export const WithCallback: Story = {
  render: () => <CallbackDemo />,
};

/**
 * Single phrase (exhaustion fallback demo)
 */
export const SinglePhrase: Story = {
  args: {
    isActive: true,
    totalDuration: 5000,
    displayDuration: 300,
    charDelay: 40,
    phrases: ["This single phrase will remain visible after typing…"],
  },
};

/**
 * Inactive state (renders nothing)
 */
export const Inactive: Story = {
  args: {
    isActive: false,
    phrases: DEFAULT_ANALYSIS_PHRASES,
  },
};
