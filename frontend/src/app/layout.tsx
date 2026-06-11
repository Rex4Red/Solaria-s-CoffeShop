import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solaria's CoffeeShop",
  description: "Pesan kopi dan makanan favoritmu dengan mudah — Solaria's CoffeeShop",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#3D2B1F',
              color: '#FAF8F4',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: {
                primary: '#5D9B6B',
                secondary: '#FAF8F4',
              },
            },
            error: {
              iconTheme: {
                primary: '#C07070',
                secondary: '#FAF8F4',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
