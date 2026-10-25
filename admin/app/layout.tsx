import type { Metadata } from "next";
import { Poppins } from "@/src/common/fonts";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientLayout from "@/components/client-layout/layout";
import BrandThemeProvider from "@/components/common/BrandThemeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose weights
  variable: "--font-poppins",           // optional CSS variable
});


export const metadata: Metadata = {
  title: "JE-Inspi Admin | Jewellery Management",
  description: "JE-Inspi jewellery and diamond management portal.",
  icons: { icon: "/assets/brand/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <BrandThemeProvider>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
          </AuthProvider>
        </BrandThemeProvider>
      </body>
    </html>
  );
}
