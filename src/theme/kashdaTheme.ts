'use client';

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    kashda: {
      bg: string;
      sidebar: string;
      surface: string;
      border: string;
      gold: string;
      muted: string;
    };
  }
  interface PaletteOptions {
    kashda?: {
      bg: string;
      sidebar: string;
      surface: string;
      border: string;
      gold: string;
      muted: string;
    };
  }
}

export const DRAWER_WIDTH = 260;
export const DRAWER_COLLAPSED_WIDTH = 72;

export const kashdaTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6a0dad',
      light: '#8a2dd3',
      dark: '#5a0a9d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d4af37',
      light: '#e6c24d',
      dark: '#c49f2f',
      contrastText: '#171717',
    },
    background: {
      default: '#2a004a',
      paper: '#3a005f',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#a0a0a0',
    },
    divider: '#4a007a',
    success: {
      main: '#4ade80',
      dark: '#166534',
    },
    warning: {
      main: '#fbbf24',
      dark: '#92400e',
    },
    error: {
      main: '#f87171',
      dark: '#991b1b',
    },
    info: {
      main: '#60a5fa',
      dark: '#1e3a8a',
    },
    kashda: {
      bg: '#2a004a',
      sidebar: '#1a003a',
      surface: '#3a005f',
      border: '#4a007a',
      gold: '#d4af37',
      muted: '#a0a0a0',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          scrollbarColor: '#6a0dad #1a003a',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a003a',
          borderRight: '1px solid #4a007a',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#3a005f',
          borderBottom: '1px solid #4a007a',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#3a005f',
          border: '1px solid #4a007a',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a004a',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#4a007a',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a003a',
          borderTop: '1px solid #4a007a',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});
