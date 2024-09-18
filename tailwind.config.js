/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "media",
  prefix: "",
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "synthwave"]
  }
}
