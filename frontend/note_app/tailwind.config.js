/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        royalblue: "#4169e1",
        primary: "#2B85FF",
        secondary:"#EF863E"
      },
    },
  },
  plugins: [],
};
