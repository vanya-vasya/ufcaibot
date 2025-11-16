"use client";

interface FighterInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export const FighterInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "Enter fighter name",
  id 
}: FighterInputProps) => {
  const inputId = id || `fighter-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div 
      className="flex flex-col space-y-3 w-full"
      data-testid={`fighter-input-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <label
        htmlFor={inputId}
        className="text-lg md:text-xl font-semibold text-white dark:text-white"
        style={{
          fontFamily: 'var(--font-ufc-heading)',
          letterSpacing: '0.02em',
        }}
      >
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-4 py-3 rounded-lg bg-zinc-900 dark:bg-zinc-900 border-2 border-zinc-700 dark:border-zinc-700 text-white dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-500"
        aria-label={`${label} name input`}
        style={{
          boxShadow: 'none',
        }}
      />
    </div>
  );
};

