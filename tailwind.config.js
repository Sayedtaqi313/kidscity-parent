/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        winky: ["Winky Sans", "sans-serif"], // Add Winky Sans as the font family
      },
      colors: {
        primary: "#B22222", // A deep, earthy crimson
        secondary: "#2C3E50", // A dark, elegant navy
        accent: "#F4A261", // A soft, muted peach-orange
        "adult-blue": "#34495E", // A sophisticated slate blue
        "adult-purple": "#8E44AD", // A refined, muted violet
        "adult-gray": "#7F8C8D", // A versatile and neutral gray
      },
    },
  },
  plugins: [],
};
