/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sideBarColor: "#101924",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
