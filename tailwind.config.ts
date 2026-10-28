import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#102A43", teal: "#0F9F9A", sky: "#E7F5F5", wash: "#F4F8FB" }, boxShadow: { soft: "0 16px 50px rgba(16,42,67,.08)" } } },
  plugins: []
};
export default config;
