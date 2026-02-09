import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ClearCash Vault",
  description: "Private Financial Ledger",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FDFDFF]`}>
        <Toaster 
          position="bottom-center" 
          richColors 
          toastOptions={{
            style: {
              borderRadius: '1.5rem',
              padding: '1rem 1.5rem',
              fontSize: '11px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              border: 'none',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            },
            // Force solid green theme for all success toasts
            success: {
              style: {
                background: '#10b981', 
                color: '#ffffff',
              },
              iconTheme: {
                primary: '#ffffff',
                secondary: '#10b981',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}