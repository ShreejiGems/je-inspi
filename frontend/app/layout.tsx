import type { Metadata } from "next";
import { EB_Garamond } from "@/src/common/fonts";
import "./globals.css";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { AppProvider } from "@/src/contexts/AppContext";
import BrandThemeProvider from "@/components/common/BrandThemeProvider";

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-garamond",
});

export const metadata: Metadata = {
  title: "JE-Inspi | Jewellery, Diamonds & Fashion",
  description: "Discover jewellery, diamonds and fashion with JE-Inspi.",
  icons: { icon: "/assets/brand/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className={`${garamond.variable}r antialiased`}>
        <BrandThemeProvider>
          <AuthProvider>
            <AppProvider>{children}</AppProvider>
          </AuthProvider>
        </BrandThemeProvider>
      </body>
    </html>
  );
}
