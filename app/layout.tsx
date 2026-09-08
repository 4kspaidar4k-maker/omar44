import "./globals.css";
import { CartProvider } from "../context/CartContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مكتبة أبو طوق",
  description: "مكتبة أبو طوق متخصصة في بيع الدوسيات، الألعاب، والقرطاسية المدرسية والمكتبية في عمان، الأردن.",
  icons: {
    // هون أجبرناه يقرأ الصورة النظيفة من مجلد public مباشرة
    icon: "/abu-touq-library/public/logo.png",
    apple: "/abu-touq-library/public/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}