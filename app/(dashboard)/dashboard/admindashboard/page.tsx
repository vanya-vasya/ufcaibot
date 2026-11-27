"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { currencies, type Currency } from "@/constants/index";
import {
  ACTIVITY_TOOLS,
  MIN_TOOL_COST,
  formatDate,
  generateActivity,
  getSpendableTokens,
  randomInt,
  type ActivityRow,
} from "@/lib/admin-activity";

const UFC_HEADING_FONT =
  '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';
const ufcFontStyle = { fontFamily: UFC_HEADING_FONT } as const;

const PAGE_SIZE = 20;
const MAX_PAYMENT_ROWS = 500;
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
  successful: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  failed: "bg-red-500/15 text-red-400 border-red-500/30",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

type SortDirection = "asc" | "desc";

interface PaymentRow {
  id: string;
  date: string;
  amount: string;
  currency: Currency;
  tokens: string;
  status: PaymentStatus;
}

const cardStyle: CSSProperties = {
  boxShadow:
    "0 0 0 1px rgba(255,255,255,0.3), 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
};
const cardClassName = "rounded-2xl bg-[#1a1a1a] shadow-lg";

const fieldInputClassName =
  "w-full bg-[#2a2a2a] border-2 border-[#666] rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-[#888] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.2)] transition-colors";
const cellInputClassName =
  "w-full bg-[#2a2a2a] border-2 border-[#666] rounded-md px-2 py-1.5 text-sm text-white outline-none focus:border-[#888] transition-colors";
const headerCellClassName =
  "px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white/60";

interface UfcButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
}

const UfcButton = ({
  variant = "solid",
  className,
  style,
  ...props
}: UfcButtonProps) => (
  <button
    style={{ ...ufcFontStyle, ...style }}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded bg-black border-2 font-bold uppercase tracking-wider transition-colors duration-200",
      variant === "solid"
        ? "border-white text-white hover:bg-gray-900"
        : "border-[#666] bg-transparent text-white hover:border-white",
      "disabled:cursor-not-allowed",
      className,
    )}
    {...props}
  />
);

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

const generateId = (): string =>
  "cmp" +
  Array.from(
    { length: 22 },
    () => ROW_ID_CHARS[randomInt(0, ROW_ID_CHARS.length - 1)],
  ).join("");

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
    <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
      <span className="text-xs text-white/50">
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
            "text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {getPageNumbers(page, total).map((item, index) => {
          if (item === "…") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center text-sm text-white/40"
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
                  ? "bg-white text-black"
                  : "text-white/70 hover:bg-white/10",
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
            "text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
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
    <span className="text-sm font-medium text-white/70">{label}</span>
    {children}
  </label>
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
  const [activitySortDir, setActivitySortDir] = useState<SortDirection>("desc");
  const [rowsCount, setRowsCount] = useState("5");
  const [paymentRows, setPaymentRows] = useState<PaymentRow[]>([]);
  const [paymentLocked, setPaymentLocked] = useState(false);
  const [paymentPage, setPaymentPage] = useState(1);
  const [receiptBusyId, setReceiptBusyId] = useState<string | null>(null);

  const trimmedEmail = email.trim();
  const isEmailValid = EMAIL_PATTERN.test(trimmedEmail);
  const tokensTarget = Number(tokensSpend);
  const parsedStart = parseDate(firstDate);
  const parsedEnd = parseDate(lastDate);

  const canGenerateActivity =
    isEmailValid &&
    Number.isFinite(tokensTarget) &&
    tokensTarget > 0 &&
    parsedStart !== null &&
    parsedEnd !== null &&
    parsedEnd.getTime() >= parsedStart.getTime();

  const spendableTokens = getSpendableTokens(tokensTarget);
  const activityTotalTokens = activityRows.reduce(
    (total, row) => total + row.tokensUsed,
    0,
  );
  const toolPricesLabel = ACTIVITY_TOOLS.map(
    (tool) => `${tool.label} ${tool.cost}`,
  ).join(" · ");

  const parsedRowsCount = Number(rowsCount);
  const canGenerateRows =
    Number.isFinite(parsedRowsCount) && parsedRowsCount > 0;

  const sortedActivityRows = useMemo(
    () =>
      [...activityRows].sort((a, b) =>
        activitySortDir === "asc" ? a.seq - b.seq : b.seq - a.seq,
      ),
    [activityRows, activitySortDir],
  );

  const visibleActivityRows = sortedActivityRows.slice(
    (activityPage - 1) * PAGE_SIZE,
    activityPage * PAGE_SIZE,
  );
  const visiblePaymentRows = paymentRows.slice(
    (paymentPage - 1) * PAGE_SIZE,
    paymentPage * PAGE_SIZE,
  );

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
    if (tokensTarget < MIN_TOOL_COST) {
      setActivityError(
        `Tokens spend must be at least ${MIN_TOOL_COST} (cheapest tool).`,
      );
      return;
    }

    setActivityError("");
    setActivityRows(
      generateActivity(Math.floor(tokensTarget), parsedStart, parsedEnd),
    );
    setActivityGenerated(true);
    setActivityPage(1);
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
  };

  const handleToggleActivitySort = () => {
    setActivitySortDir((direction) => (direction === "desc" ? "asc" : "desc"));
    setActivityPage(1);
  };

  const handleGenerateRows = () => {
    if (!canGenerateRows) return;

    const count = Math.min(
      Math.max(Math.floor(parsedRowsCount), 1),
      MAX_PAYMENT_ROWS,
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
      })),
    );
    setPaymentPage(1);
    setPaymentLocked(false);
  };

  const handleUpdateRow = <K extends keyof PaymentRow>(
    globalIndex: number,
    field: K,
    value: PaymentRow[K],
  ) => {
    if (globalIndex < 0) return;
    setPaymentRows((rows) =>
      rows.map((row, index) =>
        index === globalIndex ? { ...row, [field]: value } : row,
      ),
    );
  };

  const handleCreateTable = () => {
    setPaymentLocked(true);
    setPaymentPage(1);
  };

  const handleGenerateReceipt = async (row: PaymentRow) => {
    if (receiptBusyId) return;
    setReceiptBusyId(row.id);
    try {
      const [{ pdf }, { default: DemoReceipt }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/demo-receipt"),
      ]);
      const blob = await pdf(
        <DemoReceipt
          receiptId={row.id}
          email={trimmedEmail}
          date={row.date}
          tokens={Number(row.tokens) || 0}
          description={`ufcaibot Tokens Purchase (${row.tokens} Tokens)`}
          amount={(Number(row.amount) || 0) * 100}
          currency={row.currency}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${row.id}.pdf`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (error) {
      console.error("[Generate PDF]", error);
    } finally {
      setReceiptBusyId(null);
    }
  };

  const showPaymentEditor =
    configVisible && paymentRows.length > 0 && !paymentLocked;
  const showPaymentHistory = paymentLocked && paymentRows.length > 0;
  const showActivity = activityGenerated;

  return (
    <div className="rounded-2xl bg-[#0a0a0a] px-4 py-12 md:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1
            className="text-3xl font-bold leading-tight text-white md:text-4xl"
            style={ufcFontStyle}
          >
            Account Overview
          </h1>
          <p
            className="max-w-2xl text-sm leading-relaxed text-white/70 md:text-base"
            style={ufcFontStyle}
          >
            View account activity, usage history, and transaction records for
            the selected user.
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="text-sm text-white/50 transition-colors hover:text-white"
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
              <h2 className="text-xl font-bold text-white" style={ufcFontStyle}>
                Activity configuration
              </h2>
              <button
                type="button"
                aria-label="Hide configuration"
                onClick={() => setConfigVisible(false)}
                className="text-sm text-white/50 transition-colors hover:text-white"
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
                  className={fieldInputClassName}
                />
              </LabeledInput>
              <LabeledInput label="Tokens spend">
                <input
                  type="number"
                  min={1}
                  aria-label="Tokens spend"
                  value={tokensSpend}
                  onChange={(event) => setTokensSpend(event.target.value)}
                  className={fieldInputClassName}
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
                  className={fieldInputClassName}
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
                  className={fieldInputClassName}
                />
              </LabeledInput>
            </div>

            <p
              className="text-xs text-white/50"
              data-testid="activity-tools-hint"
            >
              Random tools: {toolPricesLabel} tokens.
              {tokensTarget >= MIN_TOOL_COST &&
                spendableTokens !== Math.floor(tokensTarget) &&
                ` Spend is rounded down to ${spendableTokens} so the total matches exactly.`}
            </p>

            {activityError && (
              <p role="alert" className="text-sm text-red-400">
                {activityError}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <UfcButton
                type="button"
                aria-label="Generate activity"
                aria-disabled={!canGenerateActivity}
                disabled={!canGenerateActivity}
                onClick={handleGenerateActivity}
                className={cn(
                  "px-6 py-3",
                  !canGenerateActivity &&
                    "border-white/30 bg-black/40 text-white/40 hover:bg-black/40",
                )}
              >
                Generate activity
              </UfcButton>
              <UfcButton
                type="button"
                variant="outline"
                aria-label="Reset activity"
                onClick={handleResetActivity}
                className="px-6 py-3"
              >
                Reset
              </UfcButton>
            </div>
          </section>
        )}

        {configVisible && (
          <section
            className={cn(cardClassName, "space-y-5 p-6")}
            style={cardStyle}
          >
            <h2 className="text-xl font-bold text-white" style={ufcFontStyle}>
              Payment configuration
            </h2>
            <div className="flex flex-wrap items-end gap-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-white/70">
                  Rows count
                </span>
                <input
                  type="number"
                  min={1}
                  max={MAX_PAYMENT_ROWS}
                  aria-label="Rows count"
                  value={rowsCount}
                  onChange={(event) => setRowsCount(event.target.value)}
                  className={cn(fieldInputClassName, "w-32")}
                />
              </label>
              <UfcButton
                type="button"
                aria-label="Generate rows"
                aria-disabled={!canGenerateRows}
                disabled={!canGenerateRows}
                onClick={handleGenerateRows}
                className={cn(
                  "px-6 py-3",
                  !canGenerateRows &&
                    "border-white/30 bg-black/40 text-white/40 hover:bg-black/40",
                )}
              >
                Generate rows
              </UfcButton>
            </div>
          </section>
        )}

        {showPaymentEditor && (
          <section
            className={cn(cardClassName, "overflow-hidden")}
            style={cardStyle}
          >
            <div className="flex items-center justify-between p-6">
              <h2 className="text-xl font-bold text-white" style={ufcFontStyle}>
                Payment rows —{" "}
                <span className="text-white">{paymentRows.length} rows</span>
              </h2>
              <UfcButton
                type="button"
                aria-label="Create table"
                onClick={handleCreateTable}
                className="px-6 py-3"
              >
                Create table
              </UfcButton>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    <th className={headerCellClassName}>Date</th>
                    <th className={headerCellClassName}>Amount</th>
                    <th className={headerCellClassName}>Currency</th>
                    <th className={headerCellClassName}>Tokens</th>
                    <th className={headerCellClassName}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {visiblePaymentRows.map((row) => {
                    const globalIndex = paymentRows.findIndex(
                      (paymentRow) => paymentRow.id === row.id,
                    );
                    return (
                      <tr key={row.id}>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            aria-label={`Date for payment ${row.id}`}
                            value={row.date}
                            onChange={(event) =>
                              handleUpdateRow(
                                globalIndex,
                                "date",
                                event.target.value,
                              )
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
                              handleUpdateRow(
                                globalIndex,
                                "amount",
                                event.target.value,
                              )
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
                                  event.target.value as Currency,
                                )
                              }
                              className={cn(
                                cellInputClassName,
                                "appearance-none pr-7",
                              )}
                            >
                              {currencies.map((currency) => (
                                <option key={currency} value={currency}>
                                  {currency}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            aria-label={`Tokens for payment ${row.id}`}
                            value={row.tokens}
                            onChange={(event) =>
                              handleUpdateRow(
                                globalIndex,
                                "tokens",
                                event.target.value,
                              )
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
                                  event.target.value as PaymentStatus,
                                )
                              }
                              className={cn(
                                cellInputClassName,
                                "appearance-none pr-7",
                              )}
                            >
                              {PAYMENT_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
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

        {showPaymentHistory && (
          <section
            className={cn(cardClassName, "overflow-hidden")}
            style={cardStyle}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 p-6">
              <div>
                <h2
                  className="text-xl font-bold text-white"
                  style={ufcFontStyle}
                >
                  Payment History —{" "}
                  <span className="text-white">
                    {paymentRows.length} records
                  </span>
                </h2>
                <p className="text-sm text-white/50" style={ufcFontStyle}>
                  Payment transactions linked to this account
                </p>
              </div>
              <span
                className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white"
                style={ufcFontStyle}
              >
                {trimmedEmail}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    <th className={headerCellClassName}>ID</th>
                    <th className={headerCellClassName}>Date</th>
                    <th className={headerCellClassName}>Amount</th>
                    <th className={headerCellClassName}>Currency</th>
                    <th className={headerCellClassName}>Tokens</th>
                    <th className={headerCellClassName}>Status</th>
                    <th className={headerCellClassName}>Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {visiblePaymentRows.map((row) => (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-white/5"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-white/50">
                        {row.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-white/80">
                        {row.date}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-white/80">
                        {(Number(row.amount) || 0).toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-white/80">
                        {row.currency}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-white/80">
                        {row.tokens}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={cn(
                            "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                            STATUS_BADGE_STYLES[row.status],
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {row.status === "successful" ? (
                          <UfcButton
                            type="button"
                            aria-label={`Generate PDF receipt for payment ${row.id}`}
                            aria-disabled={receiptBusyId === row.id}
                            disabled={receiptBusyId === row.id}
                            onClick={() => handleGenerateReceipt(row)}
                            className="px-3 py-1.5 text-xs"
                          >
                            {receiptBusyId === row.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <FileText className="h-3.5 w-3.5" />
                            )}
                            Generate PDF
                          </UfcButton>
                        ) : (
                          <span className="text-sm text-white/30">—</span>
                        )}
                      </td>
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
          <section
            className={cn(cardClassName, "overflow-hidden")}
            style={cardStyle}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 p-6">
              <h2 className="text-xl font-bold text-white" style={ufcFontStyle}>
                User activity
              </h2>
              {activityRows.length > 0 && (
                <span
                  className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white"
                  style={ufcFontStyle}
                >
                  {activityRows.length} rows · {activityTotalTokens} tokens ·{" "}
                  {trimmedEmail}
                </span>
              )}
            </div>

            {activityRows.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-white/60">
                No activity could be generated. Try a wider date range or more
                tokens.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                      <tr>
                        <th className={headerCellClassName}>#</th>
                        <th
                          className={headerCellClassName}
                          aria-sort={
                            activitySortDir === "asc"
                              ? "ascending"
                              : "descending"
                          }
                        >
                          <button
                            type="button"
                            aria-label="Sort by date"
                            onClick={handleToggleActivitySort}
                            className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-white"
                            style={ufcFontStyle}
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
                    <tbody className="divide-y divide-white/10">
                      {visibleActivityRows.map((row, index) => (
                        <tr
                          key={row.seq}
                          className="transition-colors hover:bg-white/5"
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-white/40">
                            {(activityPage - 1) * PAGE_SIZE + index + 1}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-white/80">
                            {row.date}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <span
                              className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white"
                              style={ufcFontStyle}
                            >
                              {row.tool}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-white/80">
                            {row.tokensUsed}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-white">
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
    </div>
  );
};

export default AdminDashboardPage;
