module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ], //
  theme: {
    extend: {
      colors: {
        'l-mainColor': '#398AB9',
        'l-hoverColor': '#3F72AF',
        'l-backgroundColor': '#F9F7F7',
        'l-highlightColor': '#112D4E',
        'd-mainColor': '#0F4C75',
        'd-hoverColor': '#3282B8',
        'd-backgroundColor': '#1B262C',
        'd-highlightColor': '#BBE1FA',
        'text-dark': '#312f3a',
        'text-white': '#fff',
      },
      keyframes: {
        darkModeChangeKeyFrame: {
          /*           '0%': {
            'clip-path': 'polygon(0 0, 100% 0%, 100% 10%, 0 10%)',
          },
          '25%': {
            'clip-path': 'polygon(0 0, 100% 0%, 100% 33%, 0 10%)',
          },
          '50%': {
            'clip-path': 'polygon(0 0, 100% 0%, 100% 33%, 0 66%)',
          },
          '75%': {
            'clip-path': 'polygon(0 0, 100% 0%, 100% 100%, 0 66%)',
          },
          '100%': {
            'clip-path': 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)',
          }, */
          '0%': {
            'clip-path': 'circle(30% at -25% -25%)',
          },
          '100%': {
            'clip-path': 'circle(150% at 0 0)',
          },
        },
      },
      animation: {
        darkModeChange: 'darkModeChangeKeyFrame 1s 1 both',
      },
    },
  },
  darkMode: 'class', //mdeia : 자동(시스템 설정값을 불러옴), class : 수동
  plugins: [],
};
