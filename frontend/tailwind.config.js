/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
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
