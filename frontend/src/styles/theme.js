// CanvasQuest Design System

export const theme = {
  colors: {
    parchment: '#f4f1e8',
    ink: '#2c3e50',
    gold: '#d4af37',
    silver: '#c0c0c0',
    bronze: '#cd7f32',
    sage: '#87a96b',
    crimson: '#dc143c',
    shadowAncient: 'rgba(44, 62, 80, 0.1)',
    white: '#ffffff',
    black: '#000000',

    // Semantic colors
    primary: '#d4af37',
    secondary: '#87a96b',
    accent: '#dc143c',
    background: '#f4f1e8',
    text: '#2c3e50',
    textLight: '#7f8c8d',
    border: 'rgba(44, 62, 80, 0.2)',
  },

  fonts: {
    heading: '"Cinzel Decorative", serif',
    body: '"Crimson Text", serif',
    ui: '"Inter", sans-serif',
  },

  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(44, 62, 80, 0.1)',
    md: '0 4px 6px rgba(44, 62, 80, 0.1)',
    lg: '0 10px 15px rgba(44, 62, 80, 0.15)',
    xl: '0 20px 25px rgba(44, 62, 80, 0.2)',
    ancient: '0 8px 16px rgba(44, 62, 80, 0.12)',
  },

  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },

  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },

  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export default theme;
