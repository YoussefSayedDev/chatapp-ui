import { ThemeProvider } from "@/components/ThemeProvider";
import { UserContextProvider } from "@/context/UserContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | ChatApp",
    default: "ChatApp",
  },
  description: "The chat app real time chating",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <UserContextProvider>{children}</UserContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
