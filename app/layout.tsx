import { Inter } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { Toaster } from "react-hot-toast";
import { cn } from "~/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <Toaster />
            <main className="min-h-screen">
              {children}
            </main>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
