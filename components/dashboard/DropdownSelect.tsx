"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  KeyboardEvent,
} from "react";
import { ChevronDown, X, Search } from "lucide-react";

/**
 * DropdownSelect - A feature-rich dropdown select component
 * 
 * Features:
 * - Click-to-open and keyboard navigation (Arrow keys, Enter, Escape, Tab)
 * - Placeholder when no value selected
 * - Clear (x) control to reset selection
 * - Search/filter functionality for large option lists
 * - Full ARIA accessibility support
 * - Responsive design matching UFC theme
 * - Click outside to close
 */

interface DropdownSelectProps {
  /** Label displayed above the dropdown */
  label: string;
  /** Array of options to display */
  options: string[];
  /** Currently selected value (empty string for no selection) */
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Whether to show search input (auto-enabled for 5+ options) */
  searchable?: boolean;
  /** Whether the clear button is shown */
  clearable?: boolean;
  /** Minimum options count to auto-enable search */
  searchThreshold?: number;
  /** Optional ID for accessibility */
  id?: string;
  /** Test ID for testing */
  testId?: string;
  /** Fixed width class (e.g., "w-80", "w-[320px]") */
  widthClass?: string;
  /** Fixed height class for the trigger button */
  heightClass?: string;
}

export const DropdownSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchable,
  clearable = true,
  searchThreshold = 5,
  id,
  testId,
  widthClass,
  heightClass = "h-[52px]",
}: DropdownSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  
  const inputId = id || `dropdown-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const dataTestId = testId || `dropdown-select-${label.toLowerCase().replace(/\s+/g, "-")}`;

  // Auto-enable search for large option lists
  const showSearch = searchable ?? options.length >= searchThreshold;

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
  }, [filteredOptions]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 10);
    }
  }, [isOpen, showSearch]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  /**
   * Toggle dropdown open/closed
   */
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setSearchQuery("");
      // Set highlighted index to current value or first option
      const currentIndex = filteredOptions.indexOf(value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [isOpen, filteredOptions, value]);

  /**
   * Select an option and close dropdown
   */
  const handleSelect = useCallback(
    (option: string) => {
      onChange(option);
      setIsOpen(false);
      setSearchQuery("");
      triggerRef.current?.focus();
    },
    [onChange]
  );

  /**
   * Clear the current selection
   */
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange("");
      triggerRef.current?.focus();
    },
    [onChange]
  );

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;
          
        case " ":
          // Only handle space if search input is not focused
          if (!showSearch || document.activeElement !== searchInputRef.current) {
            e.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
            } else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
              handleSelect(filteredOptions[highlightedIndex]);
            }
          }
          break;
          
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearchQuery("");
          triggerRef.current?.focus();
          break;
          
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;
          
        case "ArrowUp":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
          }
          break;
          
        case "Home":
          if (isOpen) {
            e.preventDefault();
            setHighlightedIndex(0);
          }
          break;
          
        case "End":
          if (isOpen) {
            e.preventDefault();
            setHighlightedIndex(filteredOptions.length - 1);
          }
          break;
          
        case "Tab":
          if (isOpen) {
            setIsOpen(false);
            setSearchQuery("");
          }
          break;
      }
    },
    [isOpen, highlightedIndex, filteredOptions, handleSelect, showSearch]
  );

  /**
   * Handle search input change
   */
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className={`flex flex-col space-y-3 ${widthClass || "w-full"}`}
      data-testid={dataTestId}
      onKeyDown={handleKeyDown}
    >
      {/* Label */}
      <label
        id={`${inputId}-label`}
        className="text-lg md:text-xl font-semibold text-white"
        style={{
          fontFamily: "var(--font-ufc-heading)",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </label>

      {/* Dropdown Container */}
      <div className="relative">
        {/* Trigger Button */}
        <button
          ref={triggerRef}
          type="button"
          id={inputId}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={`${inputId}-label`}
          aria-controls={`${inputId}-listbox`}
          aria-activedescendant={
            isOpen && highlightedIndex >= 0
              ? `${inputId}-option-${highlightedIndex}`
              : undefined
          }
          onClick={handleToggle}
          className={`
            w-full flex items-center justify-between gap-2
            px-4 py-3 rounded-lg
            bg-zinc-900 border-2 transition-all duration-200
            text-left cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-zinc-500/50
            ${heightClass}
            ${isOpen 
              ? "border-zinc-500 ring-2 ring-zinc-500/30" 
              : "border-zinc-700 hover:border-zinc-600"
            }
          `}
        >
          {/* Selected Value or Placeholder */}
          <span
            className={`flex-1 truncate text-base md:text-lg font-medium ${
              value ? "text-white" : "text-zinc-500"
            }`}
            style={{
              fontFamily: "var(--font-ufc-heading)",
              letterSpacing: "0.02em",
            }}
          >
            {value || placeholder}
          </span>

          {/* Clear Button & Chevron */}
          <div className="flex items-center gap-1">
            {clearable && value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
                aria-label="Clear selection"
                tabIndex={-1}
              >
                <X className="w-4 h-4 text-zinc-400 hover:text-white" />
              </button>
            )}
            <ChevronDown
              className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div
            className={`
              absolute z-50 w-full mt-2
              bg-zinc-900 border-2 border-zinc-700 rounded-lg
              shadow-xl shadow-black/50
              overflow-hidden
              animate-in fade-in slide-in-from-top-2 duration-200
            `}
          >
            {/* Search Input */}
            {showSearch && (
              <div className="p-2 border-b border-zinc-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className="
                      w-full pl-9 pr-3 py-2 rounded-md
                      bg-zinc-800 border border-zinc-600
                      text-white text-sm placeholder-zinc-500
                      focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/50
                    "
                    aria-label={`Search ${label} options`}
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <ul
              ref={listRef}
              id={`${inputId}-listbox`}
              role="listbox"
              aria-labelledby={`${inputId}-label`}
              className="max-h-60 overflow-y-auto py-1"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isSelected = option === value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <li
                      key={option}
                      id={`${inputId}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`
                        px-4 py-3 cursor-pointer transition-colors duration-100
                        ${isHighlighted ? "bg-zinc-800" : ""}
                        ${isSelected ? "text-white" : "text-zinc-400"}
                        hover:bg-zinc-800
                      `}
                      style={{
                        fontFamily: "var(--font-ufc-heading)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      <span className="text-base md:text-lg font-medium flex items-center gap-2">
                        {/* Selection indicator */}
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                        )}
                        <span className={isSelected ? "" : "ml-4"}>
                          {option}
                        </span>
                      </span>
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-3 text-zinc-500 text-center">
                  No options found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* ARIA Live Region for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {value ? `Selected: ${value}` : "No selection"}
      </div>
    </div>
  );
};

export default DropdownSelect;

