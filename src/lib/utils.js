import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges tailwind classes easily
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Formats numbers into Indian Rupees (₹)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Formats dates for the GPay-style timeline
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};