import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/initUser";

export const metadata: Metadata = {
  title: "FreshCart | 10 minute grocery delivery",
  description:
    "Fresh groceries and daily essentials delivered to your doorstep in just 10 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-[#020617]">
        <Provider>
          <StoreProvider>
            <InitUser />
            {children}
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
