"use client";
import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

// Create a default theme that will be overridden in individual components
const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#F48C06",
    },
    secondary: {
      main: "#1A2333",
    },
    mode: "dark",
  },
});

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
