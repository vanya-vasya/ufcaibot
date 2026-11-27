"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Database,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";

import { FeatureContainer } from "@/components/feature-container";
import {
  inputStyles,
  buttonStyles,
  contentStyles,
} from "@/components/ui/feature-styles";
import { cn } from "@/lib/utils";
import { currencies, type Currency } from "@/constants/index";

type ModelKey = "toolA" | "toolB" | "toolC";

const MODELS: Record<ModelKey, { name: string; tokens: number }> = {
  toolA: { name: "Fight Analysis", tokens: 25 },
  toolB: { name: "Face-off Image", tokens: 10 },
  toolC: { name: "Fighter Stats Infographic", tokens: 5 },
};
const ALL_MODELS = Object.keys(MODELS) as ModelKey[];

const PAGE_SIZE = 20;
const MAX_PAYMENT_ROWS = 500;
const MAX_TOKENS_SPEND = 100000;
const DEFAULT_TOKENS_SPEND = "1500";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROW_ID_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

const DEFAULT_PAYMENT = {
  amount: "20.00",
  currency: "GBP" as Currency,
  tokens: "100",
  status: "successful" as PaymentStatus,
};

const PAYMENT_STATUSES = ["successful", "failed", "pending"] as const;
type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

const STATUS_BADGE_STYLES: Record<PaymentStatus, string> = {
  successful: "bg-emerald-50 text-emerald-700 border-emerald-100",
  failed: "bg-red-50 text-red-600 border-red-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
};

type SortDirection = "asc" | "desc";

interface ActivityRow {
  seq: number;
  ts: number;
  date: string;
  tool: string;
  tokensUsed: number;
  tokensTotal: number;
}

interface PaymentRow {
  id: string;
  date: string;
  amount: string;
  currency: Currency;
  tokens: string;
  status: PaymentStatus;
}

interface SessionEntry {
  tool: string;
  tokensUsed: number;
}

interface TimedEntry extends SessionEntry {
  ts: number;
}

type SaveFeedback = { kind: "success" | "error"; message: string } | null;

const cardStyle: CSSProperties = {
  boxShadow:
    "0 0 0 1px rgba(129,140,248,0.15), 0 4px 6px -1px rgba(0,0,0,0.05)",
};

const cardClassName = "rounded-xl border border-gray-200 bg-white shadow-sm";
const primaryButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm";
const disabledButtonClassName =
  "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none";
const cellInputClassName =
  "w-full bg-gray-100 border border-gray-200 rounded-md px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-indigo-500";
const headerCellClassName =
  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500";

const rand = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const parseDate = (value: string): Date | null => {
  const parts = value.trim().split(".");
  if (parts.length !== 3) return null;
  if (!parts.every((part) => /^\d+$/.test(part))) return null;

  const [day, month, year] = parts.map(Number);
  if (day < 1 || day > 31) return null;
  if (month < 1 || month > 12) return null;
  if (year < 1900) return null;

  const date = new Date(year, month - 1, day);
  if (date.getDate() !== day || date.getMonth() !== month - 1) return null;
  return date;
};

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
};

const generateId = (): string =>
  "cmp" +
  Array.from(
    { length: 22 },
    () => ROW_ID_CHARS[rand(0, ROW_ID_CHARS.length - 1)]
  ).join("");

const generateActivity = (
  tokensTarget: number,
  startDate: Date,
  endDate: Date
): ActivityRow[] => {
  let remaining = tokensTarget;
  const sessions: SessionEntry[][] = [];

  while (remaining > 0) {
    const sessionTools = shuffle(ALL_MODELS).slice(0, rand(1, 3));
    const session: SessionEntry[] = [];

    for (const toolKey of sessionTools) {
      const model = MODELS[toolKey];
      const uses = rand(1, 4);
      for (let use = 0; use < uses && remaining > 0; use++) {
        const tokensUsed = Math.min(model.tokens, remaining);
        remaining -= tokensUsed;
        session.push({ tool: model.name, tokensUsed });
      }
      if (remaining <= 0) break;
    }

    if (session.length > 0) sessions.push(session);
  }

  const startMs = startDate.getTime();
  const endMs = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
    23,
    59,
    59
  ).getTime();
  const rangeMs = Math.max(endMs - startMs, 60_000);
  const slotMs = rangeMs / sessions.length;
  const maxStartMinutes = Math.max(0, Math.floor((slotMs * 0.25) / 60_000));

  const timedEntries: TimedEntry[] = [];
  sessions.forEach((session, sessionIndex) => {
    const slotStart = startMs + sessionIndex * slotMs;
    let cursor =
      slotStart + rand(0, maxStartMinutes) * 60_000 + rand(0, 59) * 1000;

    session.forEach((entry) => {
      const ts = Math.min(cursor + rand(0, 59) * 1000, endMs);
      timedEntries.push({ ...entry, ts });
      cursor += rand(2, 25) * 60_000;
    });
  });

  timedEntries.sort((a, b) => a.ts - b.ts);

  let runningTotal = 0;
  return timedEntries.map((entry, seq) => {
    runningTotal += entry.tokensUsed;
    return {
      seq,
      ts: entry.ts,
      date: formatDate(new Date(entry.ts)),
      tool: entry.tool,
      tokensUsed: entry.tokensUsed,
      tokensTotal: runningTotal,
    };
  });
};

const getPageNumbers = (page: number, total: number): (number | "…")[] => {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (page <= 3) return [1, 2, 3, "…", total];
  if (page >= total - 2) return [1, "…", total - 2, total - 1, total];
  return [1, "…", page - 1, page, page + 1, "…", total];
};

interface PaginationProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, total, onChange }: PaginationProps) => {
  if (total <= 1) return null;

  const pageButtonClassName =
    "h-8 w-8 rounded text-sm flex items-center justify-center transition-colors";
  const isFirstPage = page === 1;
  const isLastPage = page === total;

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
      <span className="text-xs text-gray-400">
        Page {page} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          aria-disabled={isFirstPage}
          disabled={isFirstPage}
          onClick={() => onChange(page - 1)}
          className={cn(
            pageButtonClassName,
            "text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {getPageNumbers(page, total).map((item, index) => {
          if (item === "…") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center text-sm text-gray-400"
              >
                …
              </span>
            );
          }
          const isActive = item === page;
          return (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onChange(item)}
              className={cn(
                pageButtonClassName,
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {item}
            </button>
          );
        })}
        <button
          type="button"
          aria-label="Next page"
          aria-disabled={isLastPage}
          disabled={isLastPage}
          onClick={() => onChange(page + 1)}
          className={cn(
            pageButtonClassName,
            "text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

interface LabeledInputProps {
  label: string;
  children: React.ReactNode;
}

const LabeledInput = ({ label, children }: LabeledInputProps) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className={cn(inputStyles.container, "p-0 px-3 py-2.5 md:px-4")}>
      {children}
    </div>
  </label>
);

const TestDataBadge = () => (
  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
    Test data
  </span>
);

const getTotalPages = (count: number): number =>
  Math.max(1, Math.ceil(count / PAGE_SIZE));

const AdminDashboardPage = () => {
  const [configVisible, setConfigVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [tokensSpend, setTokensSpend] = useState(DEFAULT_TOKENS_SPEND);
  const [firstDate, setFirstDate] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [activityRows, setActivityRows] = useState<ActivityRow[]>([]);
  const [activityError, setActivityError] = useState("");
  const [activityGenerated, setActivityGenerated] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const [activitySortDir, setActivitySortDir] =
    useState<SortDirection>("desc");
  const [rowsCount, setRowsCount] = useState("5");
  const [paymentRows, setPaymentRows] = useState<PaymentRow[]>([]);
  const [paymentLocked, setPaymentLocked] = useState(false);
  const [paymentPage, setPaymentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<SaveFeedback>(null);

  const trimmedEmail = email.trim();
  const isEmailValid = EMAIL_PATTERN.test(trimmedEmail);
  const tokensTarget = Number(tokensSpend);
  const parsedStart = parseDate(firstDate);
  const parsedEnd = parseDate(lastDate);

  const canGenerateActivity =
    isEmailValid &&
    Number.isFinite(tokensTarget) &&
    tokensTarget > 0 &&
    tokensTarget <= MAX_TOKENS_SPEND &&
    parsedStart !== null &&
    parsedEnd !== null &&
    parsedEnd.getTime() >= parsedStart.getTime();

  const parsedRowsCount = Number(rowsCount);
  const canGenerateRows = Number.isFinite(parsedRowsCount) && parsedRowsCount > 0;

  const purchasedTokens = paymentRows
    .filter((row) => row.status === "successful")
    .reduce((sum, row) => sum + (Number(row.tokens) || 0), 0);
  const spentTokens = activityRows.reduce((sum, row) => sum + row.tokensUsed, 0);

  const canSaveToDatabase =
    isEmailValid &&
    paymentLocked &&
    paymentRows.length > 0 &&
    activityGenerated &&
    !isSaving;

  const sortedActivityRows = useMemo(
    () =>
      [...activityRows].sort((a, b) =>
        activitySortDir === "asc" ? a.seq - b.seq : b.seq - a.seq
      ),
    [activityRows, activitySortDir]
  );

  const visibleActivityRows = sortedActivityRows.slice(
    (activityPage - 1) * PAGE_SIZE,
    activityPage * PAGE_SIZE
  );
  const visiblePaymentRows = paymentRows.slice(
    (paymentPage - 1) * PAGE_SIZE,
    paymentPage * PAGE_SIZE
  );

  const invalidateSavedState = () => {
    setIsSaved(false);
    setSaveFeedback(null);
  };

  const handleGenerateActivity = () => {
    if (!parsedStart || !parsedEnd) {
      setActivityError("Invalid date format. Use DD.MM.YYYY");
      return;
    }
    if (parsedEnd.getTime() < parsedStart.getTime()) {
      setActivityError("Last date must be equal to or later than first date.");
      return;
    }
    if (!Number.isFinite(tokensTarget) || tokensTarget <= 0) {
      setActivityError("Tokens spend must be greater than 0.");
      return;
    }
    if (tokensTarget > MAX_TOKENS_SPEND) {
      setActivityError(`Tokens spend must not exceed ${MAX_TOKENS_SPEND}.`);
      return;
    }

    setActivityError("");
    setActivityRows(
      generateActivity(Math.floor(tokensTarget), parsedStart, parsedEnd)
    );
    setActivityGenerated(true);
    setActivityPage(1);
    invalidateSavedState();
  };

  const handleResetActivity = () => {
    setEmail("");
    setTokensSpend(DEFAULT_TOKENS_SPEND);
    setFirstDate("");
    setLastDate("");
    setActivityRows([]);
    setActivityError("");
    setActivityGenerated(false);
    setActivityPage(1);
    invalidateSavedState();
  };

  const handleToggleActivitySort = () => {
    setActivitySortDir((direction) => (direction === "desc" ? "asc" : "desc"));
    setActivityPage(1);
  };

  const handleGenerateRows = () => {
    if (!canGenerateRows) return;

    const count = Math.min(
      Math.max(Math.floor(parsedRowsCount), 1),
      MAX_PAYMENT_ROWS
    );
    const today = formatDate(new Date());

    setPaymentRows(
      Array.from({ length: count }, () => ({
        id: generateId(),
        date: today,
        amount: DEFAULT_PAYMENT.amount,
        currency: DEFAULT_PAYMENT.currency,
        tokens: DEFAULT_PAYMENT.tokens,
        status: DEFAULT_PAYMENT.status,
      }))
    );
    setPaymentPage(1);
    setPaymentLocked(false);
    invalidateSavedState();
  };

  const handleUpdateRow = <K extends keyof PaymentRow>(
    globalIndex: number,
    field: K,
    value: PaymentRow[K]
  ) => {
    if (globalIndex < 0) return;
    setPaymentRows((rows) =>
      rows.map((row, index) =>
        index === globalIndex ? { ...row, [field]: value } : row
      )
    );
  };

  const handleCreateTable = () => {
    setPaymentLocked(true);
    setPaymentPage(1);
    invalidateSavedState();
  };

  const handleSaveToDatabase = async () => {
    const invalidRow = paymentRows.find(
      (row) =>
        parseDate(row.date) === null ||
        !Number.isFinite(Number(row.amount)) ||
        Number(row.amount) < 0 ||
        !Number.isInteger(Number(row.tokens)) ||
        Number(row.tokens) < 0
    );
    if (invalidRow) {
      setSaveFeedback({
        kind: "error",
        message: `Payment ${invalidRow.id} has an invalid date, amount or tokens value.`,
      });
      return;
    }
    if (spentTokens > purchasedTokens) {
      setSaveFeedback({
        kind: "error",
        message: `Tokens spent (${spentTokens}) exceed tokens from successful payments (${purchasedTokens}).`,
      });
      return;
    }

    setIsSaving(true);
    setSaveFeedback(null);
    try {
      const response = await fetch("/api/admin/test-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          payments: paymentRows.map((row) => ({
            id: row.id,
            date: row.date,
            amount: Number(row.amount),
            currency: row.currency,
            tokens: Number(row.tokens),
            status: row.status,
          })),
          activity: activityRows.map((row) => ({
            ts: row.ts,
            tool: row.tool,
            tokensUsed: row.tokensUsed,
          })),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setSaveFeedback({
          kind: "error",
          message: result.error ?? `Request failed (${response.status}).`,
        });
        return;
      }

      setIsSaved(true);
      setSaveFeedback({
        kind: "success",
        message: `Saved ${result.paymentsSaved} payments and ${result.activitySaved} activity rows. Balance: ${result.remaining} of ${result.available} tokens left.`,
      });
    } catch {
      setSaveFeedback({ kind: "error", message: "Network error." });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePurgeTestUser = async () => {
    setIsSaving(true);
    setSaveFeedback(null);
    try {
      const response = await fetch(
        `/api/admin/test-data?email=${encodeURIComponent(trimmedEmail)}`,
        { method: "DELETE" }
      );
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setSaveFeedback({
          kind: "error",
          message: result.error ?? `Request failed (${response.status}).`,
        });
        return;
      }

      setIsSaved(false);
      setSaveFeedback({
        kind: "success",
        message: `Test user removed with ${result.deletedTransactions} transactions.`,
      });
    } catch {
      setSaveFeedback({ kind: "error", message: "Network error." });
    } finally {
      setIsSaving(false);
    }
  };

  const showPaymentEditor =
    configVisible && paymentRows.length > 0 && !paymentLocked;
  const showPaymentHistory = paymentLocked && paymentRows.length > 0;
  const showActivity = activityGenerated;

  return (
    <FeatureContainer
      title="Account Overview"
      description="View account activity, usage history, and transaction records for the selected user."
      iconName="SlidersHorizontal"
      gradient="from-cyan-400 via-blue-500 to-indigo-600"
    >
      <div className={cn(contentStyles.base, "mx-auto max-w-5xl space-y-8")}>
        <div className="text-center">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="text-sm text-gray-400 transition-colors hover:text-black"
          >
            ← Dashboard
          </Link>
        </div>

        {configVisible && (
          <section
            className={cn(cardClassName, "space-y-5 p-6")}
            style={cardStyle}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-gray-900">
                Activity configuration
              </h2>
              <button
                type="button"
                aria-label="Hide configuration"
                onClick={() => setConfigVisible(false)}
                className="text-sm text-gray-400 transition-colors hover:text-gray-900"
              >
                Hide
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <LabeledInput label="Email">
                <input
                  type="email"
                  aria-label="Email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={cn(inputStyles.base, "w-full")}
                />
              </LabeledInput>
              <LabeledInput label="Tokens spend">
                <input
                  type="number"
                  min={1}
                  aria-label="Tokens spend"
                  value={tokensSpend}
                  onChange={(event) => setTokensSpend(event.target.value)}
                  className={cn(inputStyles.base, "w-full")}
                />
              </LabeledInput>
              <LabeledInput label="First date">
                <input
                  type="text"
                  maxLength={10}
                  aria-label="First date"
                  placeholder="DD.MM.YYYY"
                  value={firstDate}
                  onChange={(event) => setFirstDate(event.target.value)}
                  className={cn(inputStyles.base, "w-full")}
                />
              </LabeledInput>
              <LabeledInput label="Last date">
                <input
                  type="text"
                  maxLength={10}
                  aria-label="Last date"
                  placeholder="DD.MM.YYYY"
                  value={lastDate}
                  onChange={(event) => setLastDate(event.target.value)}
                  className={cn(inputStyles.base, "w-full")}
                />
              </LabeledInput>
            </div>

            {activityError && (
              <p role="alert" className="text-sm text-red-500">
                {activityError}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                aria-label="Generate activity"
                aria-disabled={!canGenerateActivity}
                disabled={!canGenerateActivity}
                onClick={handleGenerateActivity}
                className={cn(
                  primaryButtonClassName,
                  canGenerateActivity
                    ? buttonStyles.base
                    : disabledButtonClassName
                )}
              >
                Generate activity
              </button>
              <button
                type="button"
                aria-label="Reset activity"
                onClick={handleResetActivity}
                className={cn(primaryButtonClassName, buttonStyles.outline)}
              >
                Reset
              </button>
            </div>
          </section>
        )}

        {configVisible && (
          <section
            className={cn(cardClassName, "space-y-5 p-6")}
            style={cardStyle}
          >
            <h2 className="font-heading font-semibold text-gray-900">
              Payment configuration
            </h2>
            <div className="flex flex-wrap items-end gap-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-gray-700">
                  Rows count
                </span>
                <div
                  className={cn(
                    inputStyles.container,
                    "w-32 p-0 px-3 py-2.5 md:px-3"
                  )}
                >
                  <input
                    type="number"
                    min={1}
                    max={MAX_PAYMENT_ROWS}
                    aria-label="Rows count"
                    value={rowsCount}
                    onChange={(event) => setRowsCount(event.target.value)}
                    className={cn(inputStyles.base, "w-full")}
                  />
                </div>
              </label>
              <button
                type="button"
                aria-label="Generate rows"
                aria-disabled={!canGenerateRows}
                disabled={!canGenerateRows}
                onClick={handleGenerateRows}
                className={cn(
                  primaryButtonClassName,
                  canGenerateRows ? buttonStyles.base : disabledButtonClassName
                )}
              >
                Generate rows
              </button>
            </div>
          </section>
        )}

        {showPaymentEditor && (
          <section className={cn(cardClassName, "overflow-hidden")} style={cardStyle}>
            <div className="flex items-center justify-between p-6">
              <h2 className="font-heading font-semibold text-gray-900">
                Payment rows —{" "}
                <span className="text-indigo-600">
                  {paymentRows.length} rows
                </span>
              </h2>
              <button
                type="button"
                aria-label="Create table"
                onClick={handleCreateTable}
                className={cn(primaryButtonClassName, buttonStyles.base)}
              >
                Create table
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={headerCellClassName}>Date</th>
                    <th className={headerCellClassName}>Amount</th>
                    <th className={headerCellClassName}>Currency</th>
                    <th className={headerCellClassName}>Tokens</th>
                    <th className={headerCellClassName}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visiblePaymentRows.map((row) => {
                    const globalIndex = paymentRows.findIndex(
                      (paymentRow) => paymentRow.id === row.id
                    );
                    return (
                      <tr key={row.id}>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            aria-label={`Date for payment ${row.id}`}
                            value={row.date}
                            onChange={(event) =>
                              handleUpdateRow(globalIndex, "date", event.target.value)
                            }
                            className={cellInputClassName}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            step="0.01"
                            aria-label={`Amount for payment ${row.id}`}
                            value={row.amount}
                            onChange={(event) =>
                              handleUpdateRow(globalIndex, "amount", event.target.value)
                            }
                            className={cellInputClassName}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <div className="relative">
                            <select
                              aria-label={`Currency for payment ${row.id}`}
                              value={row.currency}
                              onChange={(event) =>
                                handleUpdateRow(
                                  globalIndex,
                                  "currency",
                                  event.target.value as Currency
                                )
                              }
                              className={cn(cellInputClassName, "appearance-none pr-7")}
                            >
                              {currencies.map((currency) => (
                                <option key={currency} value={currency}>
                                  {currency}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            aria-label={`Tokens for payment ${row.id}`}
                            value={row.tokens}
                            onChange={(event) =>
                              handleUpdateRow(globalIndex, "tokens", event.target.value)
                            }
                            className={cellInputClassName}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <div className="relative">
                            <select
                              aria-label={`Status for payment ${row.id}`}
                              value={row.status}
                              onChange={(event) =>
                                handleUpdateRow(
                                  globalIndex,
                                  "status",
                                  event.target.value as PaymentStatus
                                )
                              }
                              className={cn(cellInputClassName, "appearance-none pr-7")}
                            >
                              {PAYMENT_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              page={paymentPage}
              total={getTotalPages(paymentRows.length)}
              onChange={setPaymentPage}
            />
          </section>
        )}

        {configVisible && (
          <section
            className={cn(cardClassName, "space-y-4 p-6")}
            style={cardStyle}
          >
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-indigo-600" />
              <h2 className="font-heading font-semibold text-gray-900">
                Database
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Saves the locked payment table and generated activity as a test
              user in the database (credits, used tokens, transactions). Test
              records are tagged{" "}
              <code className="rounded bg-gray-100 px-1">TEST_DATA</code> and
              receipts carry a test-data banner. Real users are never touched.
            </p>
            {saveFeedback && (
              <p
                role="status"
                className={cn(
                  "text-sm",
                  saveFeedback.kind === "success"
                    ? "text-emerald-600"
                    : "text-red-500"
                )}
              >
                {saveFeedback.message}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                aria-label="Save test data to database"
                aria-disabled={!canSaveToDatabase}
                disabled={!canSaveToDatabase}
                onClick={handleSaveToDatabase}
                className={cn(
                  primaryButtonClassName,
                  canSaveToDatabase ? buttonStyles.base : disabledButtonClassName
                )}
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save to database
              </button>
              <button
                type="button"
                aria-label="Remove test user from database"
                aria-disabled={!isEmailValid || isSaving}
                disabled={!isEmailValid || isSaving}
                onClick={handlePurgeTestUser}
                className={cn(
                  primaryButtonClassName,
                  buttonStyles.outline,
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                <Trash2 className="h-4 w-4" />
                Remove test user
              </button>
            </div>
          </section>
        )}

        {showPaymentHistory && (
          <section className={cn(cardClassName, "overflow-hidden")} style={cardStyle}>
            <div className="flex flex-wrap items-center justify-between gap-3 p-6">
              <div>
                <h2 className="font-heading font-semibold text-gray-900">
                  Payment History —{" "}
                  <span className="text-indigo-600">
                    {paymentRows.length} records
                  </span>
                </h2>
                <p className="text-sm text-gray-500">
                  Payment transactions linked to this account
                </p>
              </div>
              <TestDataBadge />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={headerCellClassName}>ID</th>
                    <th className={headerCellClassName}>Date</th>
                    <th className={headerCellClassName}>Amount</th>
                    <th className={headerCellClassName}>Currency</th>
                    <th className={headerCellClassName}>Tokens</th>
                    <th className={headerCellClassName}>Status</th>
                    {isSaved && <th className={headerCellClassName}>Receipt</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visiblePaymentRows.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">
                        {row.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {row.date}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {(Number(row.amount) || 0).toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {row.currency}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {row.tokens}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={cn(
                            "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                            STATUS_BADGE_STYLES[row.status]
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                      {isSaved && (
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          {row.status === "successful" && (
                            <a
                              href={`/api/admin/test-data/receipt?id=${row.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open PDF receipt for payment ${row.id}`}
                              className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                            >
                              <FileText className="h-4 w-4" />
                              PDF
                            </a>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={paymentPage}
              total={getTotalPages(paymentRows.length)}
              onChange={setPaymentPage}
            />
          </section>
        )}

        {showActivity && (
          <section className={cn(cardClassName, "overflow-hidden")} style={cardStyle}>
            <div className="flex flex-wrap items-center justify-between gap-3 p-6">
              <h2 className="font-heading font-semibold text-gray-900">
                User activity
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {activityRows.length > 0 && (
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                    {activityRows.length} rows · {trimmedEmail}
                  </span>
                )}
                <TestDataBadge />
              </div>
            </div>

            {activityRows.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-gray-500">
                No activity could be generated. Try a wider date range or more
                tokens.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className={headerCellClassName}>#</th>
                        <th
                          className={headerCellClassName}
                          aria-sort={
                            activitySortDir === "asc" ? "ascending" : "descending"
                          }
                        >
                          <button
                            type="button"
                            aria-label="Sort by date"
                            onClick={handleToggleActivitySort}
                            className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-gray-900"
                          >
                            Date
                            {activitySortDir === "asc" ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </th>
                        <th className={headerCellClassName}>Tool</th>
                        <th className={headerCellClassName}>Tokens</th>
                        <th className={headerCellClassName}>Total spent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {visibleActivityRows.map((row, index) => (
                        <tr
                          key={row.seq}
                          className="transition-colors hover:bg-gray-50"
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-400">
                            {(activityPage - 1) * PAGE_SIZE + index + 1}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                            {row.date}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                              {row.tool}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                            {row.tokensUsed}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-indigo-600">
                            {row.tokensTotal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  page={activityPage}
                  total={getTotalPages(activityRows.length)}
                  onChange={setActivityPage}
                />
              </>
            )}
          </section>
        )}
      </div>
    </FeatureContainer>
  );
};

export default AdminDashboardPage;
