module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        dark: "#222428",
        soft: "#35393B",
        light: "#f7f7f7",
        contrast: "#f9a620",
        accent: " #8888b0",
      },
      screens: {
        xs: "400px",
      }
    },
    
  },
  plugins: [],
}