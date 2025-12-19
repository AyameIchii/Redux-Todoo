module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}"
  ],
  theme: {
    extend: {
      keyframes: {
        floatText: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-6px)' },
    },
  },
  animation: {
    floatText: 'floatText 3s ease-in-out infinite',

      fadeInScale: {
        '0%': { opacity: 0, transform: 'scale(0.95)' },
        '100%': { opacity: 1, transform: 'scale(1)' },
      },
    },
    animation: {
      fadeInScale: 'fadeInScale 0.6s ease-out',
      gradientMove: {
      '0%': { backgroundPosition: '0% 50%' },
      '100%': { backgroundPosition: '100% 50%' },
    },
  },
  animation: {
    gradientMove: 'gradientMove 6s ease infinite',
    },
  },
  
  },
  plugins: [],
}
