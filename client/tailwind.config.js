/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        dark: {
          bg: '#010103',
          surface: '#0a0a0f',
          elevated: '#111116',
          border: 'rgba(255,255,255,0.05)',
        },
        light: {
          bg: '#f8fafc',
          surface: '#ffffff',
          elevated: '#f1f5f9',
          border: 'rgba(226,232,240,0.8)',
        },
        accent: {
          primary: '#00f2ff', // Neon Cyan
          secondary: '#a855f7', // Deep Purple
          magenta: '#f43f5e',
          glow: 'rgba(0, 242, 255, 0.2)',
          bright: '#22d3ee',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '40px',
        '2xl': '60px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)',
        'glass-lg': '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.15)',
        'glow': '0 0 20px rgba(0, 242, 255, 0.4)',
        'glow-lg': '0 0 40px rgba(168, 85, 247, 0.5)',
        'glow-inner': 'inset 0 0 20px rgba(0,242,255,0.2)',
        'image': '0 12px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'glow-pulse': 'glowPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 15px rgba(0, 242, 255, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
