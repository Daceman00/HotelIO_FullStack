// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Sve datoteke u "src" folderu
  ],
  theme: {
    extend: {
      /* colors: {
        green_primary: '#798645',
        white_primary: '#FEFAE0',
        white_secondary: '#F2EED7',
        green_secondary: '#626F47',
      }, */
      /* colors: {
        green_primary: '#1e3d58',
        white_primary: '#e8eef1',
        white_secondary: '#43b0f1',
        green_secondary: '#057dcd',
      }, */
      /* colors: {
        green_primary: '#798645',
        white_primary: '#FEFAE0',
        white_secondary: '#F2EED7',
        green_secondary: '#626F47',
        muted_blue: '#5B7F95',
        Warm_coral: '#EE6C4D',
        soft_yellow: '#F2C94C',
        Dark_grey: '#333333',
        čight_grey: '#B2B2B2',
        neutral_gray: '#E0E0E0 ',
        gold_highlight: '#D4AF37',
        forest_green: '#2F4F4F',
        olive_muted: '#6B8E23'
      }, */
      /* colors: {
        green_primary: "#007FFF",
        green_secondary: "#ffffff",
        white_primary: "#3399FF"
      }
 */ 	colors: {
        black: "#000000"
      },
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
}
