import { Inter } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { Toaster } from "react-hot-toast";
import { cn } from "~/lib/utils";
import "./globals.css";
import Navbar from "~/components/Navbar";
import { getAPICredit } from "./actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const apiCredit = await getAPICredit();
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <Toaster />
            <main className="min-h-screen">
              <div className="container mx-auto p-4">
                <Navbar apiCredit={apiCredit} />
                {children}
              </div>
            </main>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
