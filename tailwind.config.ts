import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores Sagrada Magia - Paleta Cromática
        'sagrada': {
          // Cores principais
          'black': '#252626',      // Preto institucional
          'cream': '#FAF1DE',      // Bege/Creme natural
          'magenta': '#D195CB',    // Rosa/Magenta principal (Pantone 2066 C)
          'mint': '#CEE5C1',       // Verde menta suave (Pantone 7485 C)
          'pink': '#FF9B84',       // Rosa pink quente (Pantone 204 C)

          // Tints (versões mais claras)
          'magenta-light': '#ECF0ED',  // Tint magenta
          'mint-light': '#E2EFD4',     // Tint verde
          'pink-light': '#FFE7F0',     // Tint rosa

          // Shades (versões mais escuras)
          'magenta-dark': '#9C6A95',   // Shade magenta
          'mint-dark': '#98AC91',      // Shade verde
          'pink-dark': '#BF6787',      // Shade rosa

          // Tons de neutralidade
          'gray-dark': '#6D6D6D',      // Gray escuro
          'gray-medium': '#999588',    // Gray médio
          'gray-light': '#EDDCCC',     // Gray claro
        },
      },
      fontFamily: {
        // Tipografia Sagrada Magia
        'quiche': ['Quiche Flare', 'serif'],  // Títulos e destaques
        'amiko': ['Amiko', 'sans-serif'],     // Subtítulos
        'niramit': ['Niramit', 'sans-serif'], // Parágrafos e textos
        'amelia': ['Amelia', 'cursive'],      // Complementar/Acentos
      },
      fontSize: {
        // Tipografia Sagrada Magia
        'display': ['3.5rem', { lineHeight: '1.1', fontFamily: 'Quiche Flare' }],
        'h1': ['2.75rem', { lineHeight: '1.2', fontFamily: 'Quiche Flare' }],
        'h2': ['2.25rem', { lineHeight: '1.3', fontFamily: 'Quiche Flare' }],
        'h3': ['1.875rem', { lineHeight: '1.4', fontFamily: 'Amiko' }],
        'h4': ['1.5rem', { lineHeight: '1.5', fontFamily: 'Amiko' }],
        'body': ['1rem', { lineHeight: '1.6', fontFamily: 'Niramit' }],
        'sm': ['0.875rem', { lineHeight: '1.5', fontFamily: 'Niramit' }],
        'xs': ['0.75rem', { lineHeight: '1.4', fontFamily: 'Niramit' }],
      },
      backgroundImage: {
        // Gradientes Sagrada Magia
        'gradient-sagrada': 'linear-gradient(135deg, #D195CB 0%, #CEE5C1 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FF9B84 0%, #FAF1DE 100%)',
        'gradient-cool': 'linear-gradient(135deg, #CEE5C1 0%, #E2EFD4 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #D195CB 0%, #FF9B84 50%, #FAF1DE 100%)',
      },
      boxShadow: {
        'sagrada-sm': '0 2px 8px rgba(209, 149, 203, 0.15)',
        'sagrada-md': '0 4px 16px rgba(209, 149, 203, 0.2)',
        'sagrada-lg': '0 8px 24px rgba(209, 149, 203, 0.25)',
      },
    },
  },
  plugins: [],
}
export default config
