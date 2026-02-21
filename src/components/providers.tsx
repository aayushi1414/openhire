"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const Providers = ({ children }: ThemeProviderProps) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      {children}
    </NextThemesProvider>
  );
};

export default Providers;
