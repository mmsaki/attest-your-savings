import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Menu from "@/app/components/Menu";
import { Providers } from "./providers";
import Layout from "./components/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "😀 Attest Your Savings",
  description: "Save your crypto for tomorrow, save, save...",
};

type LayoutProps = {
  background?: boolean;
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Layout title="Attest your savings">
            <Menu />
            <div>{children}</div>
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
