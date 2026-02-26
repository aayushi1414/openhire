"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const Providers = ({ children }: ThemeProviderProps) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <NuqsAdapter>{children}</NuqsAdapter>
    </NextThemesProvider>
  );
};

export default Providers;
