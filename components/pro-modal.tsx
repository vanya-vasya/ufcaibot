"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { GENERATIONS_PRICE } from "@/constants";
import { useRouter } from "next/navigation";
import { currencies, currenciesRate, Currency } from "@/constants/index";
import Image from "next/image";
import { z } from "zod";
import { useAuth, useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NetworkPaymentWidget } from "@/components/networx-payment-widget";
import {
  Checkbox,
  Field,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

const formSchema = z.object({
  tokens: z
    .number()
    .min(0, { message: "Token count must be zero or greater" }),
  currency: z.enum(currencies),
  policies: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export const ProModal = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const { user } = useUser();
  const proModal = useProModal();
  const [loading, setLoading] = useState(false);
  const [tokenPrice, setTokenPrice] = useState(GENERATIONS_PRICE);
  const [showPaymentWidget, setShowPaymentWidget] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokens: 0,
      currency: "GBP",
      policies: false,
    },
  });

  const onSubmit = async () => {
    try {
      setLoading(true);
      setShowPaymentWidget(true);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (currency: Currency) => {
    setValue("currency", currency);
    setTokenPrice(GENERATIONS_PRICE * currenciesRate[currency]);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setValue("policies", checked);
  };

  const calculatePrice = (tokens: number): number => {
    const currentCurrency = watch("currency");
    if (currentCurrency === "GBP") {
      return tokens * GENERATIONS_PRICE;
    }
    const priceInEUR = GENERATIONS_PRICE / currenciesRate["GBP"];
    return tokens * priceInEUR * currenciesRate[currentCurrency];
  };

  const handlePaymentSuccess = (transactionData: any) => {
    proModal.onClose();
    setShowPaymentWidget(false);
    router.refresh();
    toast.success("Tokens added successfully!");
  };

  const handlePaymentError = (error: any) => {
    setShowPaymentWidget(false);
    toast.error("Payment failed. Please try again.");
  };

  const handlePaymentCancel = () => {
    setShowPaymentWidget(false);
    toast("Payment was canceled");
  };

  const handleBackToForm = () => {
    setShowPaymentWidget(false);
  };

  const handleModalClose = () => {
    setShowPaymentWidget(false);
    proModal.onClose();
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold text-xl text-gray-900">
              {showPaymentWidget ? "Complete Payment" : "Buy More"}
            </div>
          </DialogTitle>
        </DialogHeader>

        {showPaymentWidget ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={handleBackToForm}
                variant="outline"
                size="sm"
                className="text-gray-900 border-gray-300 hover:bg-gray-100"
              >
                ← Back to Selection
              </Button>
              <div className="text-gray-900 text-sm font-medium">
                {watch("tokens")} Tokens -{" "}
                {(() => {
                  const curr = watch("currency");
                  const symbol =
                    curr === "GBP" ? "£" : curr === "EUR" ? "€" : curr === "USD" ? "$" : "";
                  return `${symbol}${calculatePrice(watch("tokens")).toFixed(2)}`;
                })()}
              </div>
            </div>

            <NetworkPaymentWidget
              amount={calculatePrice(watch("tokens"))}
              currency={watch("currency")}
              orderId={`gen_${userId}_${Date.now()}`}
              description={`Yum-mi Tokens Purchase (${watch("tokens")} Tokens)`}
              customerEmail={user?.emailAddresses[0].emailAddress || ""}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handlePaymentCancel}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full items-center gap-1.5">
              <div className="mb-6">
                <div className="flex items-center justify-center gap-3">
                  <Listbox
                    {...register("currency")}
                    value={watch("currency")}
                    onChange={handleCurrencyChange}
                    disabled={loading}
                  >
                    <div className="relative">
                      <ListboxButton className="w-[80px] h-[52px] text-center rounded-lg border-2 border-gray-300 text-sm font-medium flex items-center justify-center bg-white text-gray-900 transition-all duration-200 appearance-none shadow-sm hover:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1">
                        {watch("currency")}
                      </ListboxButton>
                      <ListboxOptions className="absolute top-full left-0 z-10 mt-1 grid w-[80px] origin-top gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-lg outline-none">
                        {currencies.map((currency, idx) => (
                          <ListboxOption
                            key={idx}
                            className={({ active }) =>
                              `flex cursor-pointer items-center justify-center rounded-md text-sm transition py-1
                              ${
                                active
                                  ? "bg-black text-white font-medium"
                                  : "text-gray-900 border border-transparent hover:bg-gray-100"
                              }`
                            }
                            value={currency}
                          >
                            {currency}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>

                  <div className="text-4xl font-bold py-2 text-gray-900">
                    {calculatePrice(watch("tokens")).toFixed(2)}
                  </div>
                </div>
              </div>

              <Label htmlFor="tokens" className="text-gray-900 mb-2 block font-medium">
                Enter token amount
              </Label>
              <div className="w-full">
                <input
                  disabled={loading}
                  type="number"
                  id="tokens"
                  placeholder="0"
                  {...register("tokens", { valueAsNumber: true })}
                  min={0}
                  step={1}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 focus:border-black hover:border-gray-500"
                />
              </div>
              {errors.tokens && (
                <p className="text-red-600 text-sm pt-1">{errors.tokens.message}</p>
              )}
            </div>

            <div className="mt-3">
              <Field className="flex items-center gap-2">
                <Checkbox
                  {...register("policies")}
                  checked={watch("policies")}
                  onChange={handleCheckboxChange}
                  className="group block w-[1rem] h-[1rem] rounded border border-gray-300 bg-white data-[checked]:bg-black"
                >
                  <svg
                    className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Checkbox>
                <Label className="text-gray-900 mb-2 block text-sm">
                  I agree to the{" "}
                  <a
                    href="/terms-and-conditions"
                    className="font-semibold underline underline-offset-2 hover:text-gray-600"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    className="font-semibold underline underline-offset-2 hover:text-gray-600"
                  >
                    Privacy Policy
                  </a>
                  .
                </Label>
              </Field>
              {errors.policies && (
                <p className="text-red-600 text-sm">{errors.policies.message}</p>
              )}
            </div>

            <DialogFooter className="mt-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button
                  disabled={loading}
                  size="lg"
                  type="submit"
                  className="w-full bg-black hover:bg-black/85 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Buy Tokens
                  <Zap className="w-4 h-4 ml-2 fill-white" />
                </Button>
              </motion.div>
            </DialogFooter>
          </form>
        )}

        {!showPaymentWidget && (
          <>
            <Image
              alt="Visa, Visa Secure, Mastercard, ID Check, 3D Secure payment logos"
              className="w-full max-w-md m-auto mt-1"
              src="/cards_new.svg"
              width={2537}
              height={394}
            />
            <Label className="text-center text-gray-400 mb-2 block text-xs">
              UL. JANA HEWELIUSZA, NR 11, LOK. 819, GDAŃSK, 80-890, POLSKA
            </Label>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
