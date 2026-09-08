"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, BookOpen, Bot, PhoneCall, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const { totalItems } = useCart() as any;

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { title: "أدوات والعاب وقرطاسية", desc: "أقلام، دفاتر، ومستلزمات مدرسية ومكتبية", href: "/stationery", icon: ShoppingBag },
    { title: "دوسيات ", desc: "أحدث الدوسيات والبطاقات المعتمدة", href: "/dossiers", icon: BookOpen },
    { title: "استفسار عند الذكاء الاصطناعي", desc: "إجابات فورية ودقيقة عن التوفر والأسعار", href: "/ai-chat", icon: Bot },
    { title: "اتصال وشكاوى", desc: "نحن هنا لخدمتك ومتابعة ملاحظاتك", href: "/contact", icon: PhoneCall },
    { title: "سلة الطلبات", desc: "مراجعة العناصر وإتمام عملية التوصيل", href: "/cart", icon: ShoppingCart },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* الشاشة الافتتاحية */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-900 text-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center flex flex-col items-center gap-4"
            >
              <div className="relative w-24 h-24 bg-white rounded-2xl p-2 shadow-xl flex items-center justify-center overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="شعار مكتبة أبو طوق" 
                  width={80} 
                  height={80} 
                  className="object-contain"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-white">
                مكتبة أبو طوق
              </h1>
              <p className="text-blue-200 text-sm tracking-widest uppercase">
                التميز والجودة للقرطاسية والخدمات التعليمية
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الشريط العلوي مع الشعار */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 bg-white rounded-xl border border-blue-100 p-1 flex items-center justify-center shadow-sm overflow-hidden">
              <Image 
                src="/logo.png" 
                alt="شعار مكتبة أبو طوق" 
                width={44} 
                height={44} 
                className="object-contain"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <h2 className="text-2xl font-black text-blue-900">
              مكتبة أبو طوق
            </h2>
          </div>

          <Link
            href="/cart"
            className="relative flex items-center justify-center p-3 rounded-full bg-blue-50 border border-blue-200 hover:bg-blue-100 transition shadow-sm"
          >
            <ShoppingCart className="w-5 h-5 text-blue-900" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        
        {/* قسم البانر العلوي (صورة واحدة وشرح المكتبة المتخصصة) */}
        <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-sm mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
              <Image 
                src="/omar1.png" 
                alt="صورة المكتبة" 
                fill 
                className="object-cover"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
          </div>
          
          <div className="w-full md:w-2/3 text-right">
            <h2 className="text-2xl sm:text-3xl font-black text-blue-950 mb-3">
              مكتبة أبو طوق التعليمية
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              مكتبة أبو طوق متخصصة في بيع الدوسيات، الألعاب، والقرطاسية المدرسية والمكتبية بأفضل الأسعار وأعلى جودة. نوفر لكم كل ما تحتاجه المسيرة التعليمية لضمان التفوق والتميز، مع خدمات توصيل سريعة ومضمونة لجميع الطلبات.
            </p>
          </div>
        </div>

        {/* قائمة الخيارات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isFullWidth = idx === 4;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`group relative p-8 rounded-2xl bg-white border border-blue-100 hover:border-blue-500 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                  isFullWidth ? "md:col-span-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white border-transparent" : ""
                }`}
              >
                <div className="flex items-start justify-between z-10">
                  <div className={`p-4 rounded-xl border transition-transform group-hover:scale-105 ${
                    isFullWidth 
                      ? "bg-white/10 border-white/20 text-white" 
                      : "bg-blue-50 border-blue-100 text-blue-700"
                  }`}>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>
                <div className="mt-8 z-10">
                  <h3 className={`text-xl font-bold transition-colors ${
                    isFullWidth ? "text-white" : "text-blue-950 group-hover:text-blue-600"
                  }`}>
                    {item.title}
                  </h3>
                  <p className={`mt-2 text-sm ${isFullWidth ? "text-blue-100" : "text-slate-500"}`}>
                    {item.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* الفوتر بالأسفل */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs font-bold text-slate-500 shadow-inner">
        <p>© 2026 مكتبة أبو طوق - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}