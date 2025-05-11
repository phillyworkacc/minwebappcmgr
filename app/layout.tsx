import "@/styles/globals.css";
import type { Metadata } from "next";
import { InterFont } from "@/fonts/fonts";
import SessionWrapper from "@/components/SessionWrapper/SessionWrapper";
import { UserProviderWrapper } from "./context/UserContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "MinWeb",
  description: "MinWeb Client Manager, Manage clients that are paying me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <UserProviderWrapper>
        <html lang="en">
          <head>
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/favicon.ico" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
          </head>
          <body className={InterFont.className}>
            <Toaster richColors position="top-center" />
            {children}
          </body>
        </html>
      </UserProviderWrapper>
    </SessionWrapper>
  );
}
