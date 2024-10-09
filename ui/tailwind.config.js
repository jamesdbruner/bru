module.exports = {
  content: ['./src/**/*.tsx', './src/**/*.css'],
  plugins: [require('@tailwindcss/forms')],
  darkMode: 'selector',
  theme: {
    extend: {
      keyframes: {
        appear: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
       },
        animation: {
          appear: "appear 0.5s ease-in-out",
        }
      }
    }
  }
}
