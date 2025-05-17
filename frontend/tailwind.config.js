import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui, '@tailwindcss/aspect-ratio'],
  daisyui: {
    themes: [
      "nord",
    ],
  },
};
