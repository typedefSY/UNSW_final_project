import "@/styles/globals.css";
import "@radix-ui/themes/styles.css";

import AppInner from "@/components/structural/AppInner";
import { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brainwaves",
  description: "Brainwaves App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppInner>{children}</AppInner>
      </body>
    </html>
  );
}
