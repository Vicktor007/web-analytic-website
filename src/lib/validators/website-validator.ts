import { z } from "zod";

export const WEBSITE_VALIDATOR = z
  .string()
  .min(1, "Website domain is required.")
  .regex(
    /^[^:/]+$/,
    "Please enter the domain only (e.g., google.com). URLs or special characters are not allowed."
  );
