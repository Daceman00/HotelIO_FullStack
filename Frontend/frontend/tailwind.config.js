// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)', // Start from 20px above
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)', // End at original position
          },
        },
        fadeInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)', // Start from 20px to the left
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)', // End at original position
          },
        },
        fadeInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)', // Start from 20px to the right
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)', // End at original position
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.7s ease-in forwards',
        fadeInDown: 'fadeInDown 0.7s ease-in forwards',
        fadeInLeft: 'fadeInLeft 0.7s ease-in forwards',
        fadeInRight: 'fadeInRight 0.7s ease-in forwards',
      },
    },
  },
  plugins: [],
  corePlugins: {
    backdropFilter: true, // Ensure backdrop filters are enabled
  }
}
