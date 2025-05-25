/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideUpDown: {
          "0%": { opacity: 0.7, transform: "translateY(5px)" },
          "100%": { opacity: 1, transform: "translateY(0px)" },
        },
      },
      animation: {
        "bounce-1": "bounce 1s infinite 0s",
        "bounce-2": "bounce 1s infinite 0.1s",
        "bounce-3": "bounce 1s infinite 0.2s",
        slideUpDown: "slideUpDown 0.3s ease-in-out",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
      "night",
      "coffee",
      "cupcake",
      "valentine",
      "retro",
      "garden",
      "lofi",
      "wireframe",
      "luxury",
      "acid",
      "synthwave",
      "cyberpunk",
    ],
    darkTheme: "night",
  },
};
