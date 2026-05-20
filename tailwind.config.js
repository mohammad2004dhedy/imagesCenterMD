module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./hooks/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
    "./services/**/*.{js,jsx}",
    "./utils/**/*.{js,jsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          500: "#6c5ce7",
          600: "#5b4ad6",
          700: "#4d3fc2"
        },
        accent: {
          400: "#fd79a8",
          500: "#f25f9b"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(45, 52, 54, 0.12)"
      }
    }
  },
  plugins: []
};
