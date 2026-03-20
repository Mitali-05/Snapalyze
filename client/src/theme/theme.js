import { createTheme } from '@mui/material';

// ── Brand palette — extracted from Snapalyze logo ────────────────────────────
export const BRAND = {
  blue:       '#1e7bc4',   // central eye blue
  blueDark:   '#1560a0',
  blueLight:  '#3d9be0',
  navy:       '#0d2e3f',   // dark background of logo
  navyLight:  '#1a4a60',
  green:      '#4a8c3f',   // mid green leaf
  greenLight: '#7db84a',   // bright leaf tips
  teal:       '#1a6b6b',   // teal-green segment
  tealLight:  '#2a9090',
  bg:         '#eef3f7',
  surface:    '#ffffff',
  border:     '#dde5ed',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary:    { main: BRAND.blue, light: BRAND.blueLight, dark: BRAND.blueDark, contrastText: '#fff' },
    secondary:  { main: BRAND.green, light: BRAND.greenLight, dark: '#336b2a', contrastText: '#fff' },
    success:    { main: BRAND.teal, light: BRAND.tealLight, contrastText: '#fff' },
    warning:    { main: '#f59e0b' },
    error:      { main: '#e53935' },
    background: { default: BRAND.bg, paper: BRAND.surface },
    text:       { primary: BRAND.navy, secondary: '#4a6070' },
    divider:    BRAND.border,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h1: { fontWeight: 800, letterSpacing: -1 },
    h2: { fontWeight: 800, letterSpacing: -0.5 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8, boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        containedPrimary: {
          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueDark})`,
          '&:hover': { background: `linear-gradient(135deg, ${BRAND.blueDark}, #0f4a80)` },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${BRAND.green}, #336b2a)`,
          '&:hover': { background: `linear-gradient(135deg, #336b2a, #235020)` },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 1px 4px rgba(13,46,63,0.07), 0 4px 16px rgba(13,46,63,0.06)',
          border: `1px solid ${BRAND.border}`,
        },
      },
    },
    MuiPaper:     { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiTextField: {
      styleOverrides: {
        root: { '& .MuiOutlinedInput-root': { borderRadius: 8 } },
      },
    },
    MuiChip:          { styleOverrides: { root: { borderRadius: 6, fontWeight: 500 } } },
    MuiAlert:         { styleOverrides: { root: { borderRadius: 8 } } },
    MuiLinearProgress:{ styleOverrides: { root: { borderRadius: 4 } } },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: '#f0f5fa',
            fontWeight: 700,
            color: BRAND.navy,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: 0.6,
          },
        },
      },
    },
  },
});

export default theme;