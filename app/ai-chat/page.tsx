"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Bot, User, Sparkles, MapPin } from "lucide-react";

export default function AIChatPage() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string; buttons?: any[] }>>([
    {
      role: "assistant",
      content: "أهلاً بك في مكتبة أبو طوق! أنا مساعدك الذكي 🤖. يرجى اختيار أحد الخيارات التالية لمساعدتك:",
      buttons: [
        { label: "📚 المساعدة في الدوسيات", action: "dossiers_start" },
        { label: "🛍️ القرطاسية والألعاب", action: "stationery_start" },
        { label: "📞 الاتصال وخدمة العملاء", action: "contact_info" },
        { label: "📍 موقع المكتبة على الخريطة", action: "location_info" },
      ]
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // رابط موقع المكتبة على خرائط جوجل
  const googleMapsLink = "https://maps.app.goo.gl/7sKKkkhiEVr5oaSN8?g_st=ic";

  const handleBotLogic = (actionType?: string, customLabel?: string) => {
    setLoading(true);

    setTimeout(() => {
      let replyContent = "";
      let replyButtons: any[] = [];

      // سحب البيانات من المتجر المحلي لتكون محدثة دوماً
      const dossiersRaw = localStorage.getItem("abu_touq_dossiers") || "[]";
      const stationeryRaw = localStorage.getItem("abu_touq_stationery") || "[]";
      const dossiers = JSON.parse(dossiersRaw);
      const stationery = JSON.parse(stationeryRaw);

      if (actionType === "dossiers_start") {
        replyContent = "يرجى اختيار الجيل الدراسي لمساعدتك في العثور على الدوسيات المطلوبة:";
        replyButtons = [
          { label: "جيل 2010", action: "year_2010" },
          { label: "جيل 2009", action: "year_2009" },
          { label: "⬅️ القائمة الرئيسية", action: "reset" },
        ];
      } 
      else if (actionType === "year_2010") {
        replyContent = "اختر الفصل الدراسي لجيل 2010:";
        replyButtons = [
          { label: "الفصل الأول (جيل 2010)", action: "sem1_2010" },
          { label: "الفصل الثاني (جيل 2010)", action: "sem2_2010" },
          { label: "⬅️ رجوع للأجيال", action: "dossiers_start" },
        ];
      }
      else if (actionType === "year_2009") {
        replyContent = "اختر الفصل الدراسي لجيل 2009:";
        replyButtons = [
          { label: "الفصل الأول (جيل 2009)", action: "sem1_2009" },
          { label: "الفصل الثاني (جيل 2009)", action: "sem2_2009" },
          { label: "⬅️ رجوع للأجيال", action: "dossiers_start" },
        ];
      }
      else if (actionType === "sem1_2010" || actionType === "sem2_2010") {
        const targetSem = actionType === "sem1_2010" ? "الفصل الأول" : "الفصل الثاني";
        const items = dossiers.filter((d: any) => d.year === "2010" && d.semester === targetSem);
        if (items.length > 0) {
          replyContent = `وجدت لك الدوسيات التالية لجيل 2010 (${targetSem}):\n` + items.map((i: any) => `• ${i.title} - ${i.price} د.أ`).join("\n");
        } else {
          replyContent = `عذراً، لا توجد دوسيات مضافة حالياً لجيل 2010 (${targetSem}). يمكنك إضافتها من لوحة التحكم!`;
        }
        replyButtons = [
          { label: "⬅️ اختيار جيل آخر", action: "dossiers_start" },
          { label: "🏠 القائمة الرئيسية", action: "reset" }
        ];
      }
      else if (actionType === "sem1_2009" || actionType === "sem2_2009") {
        const targetSem = actionType === "sem1_2009" ? "الفصل الأول" : "الفصل الثاني";
        const items = dossiers.filter((d: any) => d.year === "2009" && d.semester === targetSem);
        if (items.length > 0) {
          replyContent = `وجدت لك الدوسيات التالية لجيل 2009 (${targetSem}):\n` + items.map((i: any) => `• ${i.title} - ${i.price} د.أ`).join("\n");
        } else {
          replyContent = `عذراً، لا توجد دوسيات مضافة حالياً لجيل 2009 (${targetSem}). يمكنك إضافتها من لوحة التحكم!`;
        }
        replyButtons = [
          { label: "⬅️ اختيار جيل آخر", action: "dossiers_start" },
          { label: "🏠 القائمة الرئيسية", action: "reset" }
        ];
      }
      else if (actionType === "stationery_start") {
        if (stationery.length > 0) {
          replyContent = "إليك المنتجات المتوفرة في قسم القرطاسية والألعاب:\n" + stationery.map((s: any) => `• ${s.title} (${s.category || 'عام'}) - ${s.price} د.أ`).join("\n");
        } else {
          replyContent = "قسم القرطاسية والألعاب فارغ حالياً. يمكنك إضافة منتجات جديدة من لوحة التحكم!";
        }
        replyButtons = [{ label: "🏠 القائمة الرئيسية", action: "reset" }];
      }
      else if (actionType === "contact_info") {
        replyContent = "📞 رقم هاتف المكتبة المعتمد للاتصال أو الواتساب:\n0796465131\n\nيمكنك مراسلتنا في أي وقت وسنكون سعداء بخدمتك.";
        replyButtons = [
          { label: "📞 الاتصال الآن", action: "call_phone", isPhone: true, phoneNum: "0796465131" },
          { label: "🏠 القائمة الرئيسية", action: "reset" }
        ];
      }
      else if (actionType === "location_info") {
        replyContent = `📍 موقع مكتبة أبو طوق في عمان، الأردن.\nها هو مكانه بالتحديد على خرائط جوجل:\n\nنوفر أيضاً خدمة التوصيل لجميع الطلبات برسوم 2 دينار!`;
        replyButtons = [
          { label: "🗺️ فتح الموقع على خرائط جوجل", action: "open_map_link", isExternal: true, url: googleMapsLink },
          { label: "🏠 القائمة الرئيسية", action: "reset" }
        ];
      }
      else if (actionType === "reset") {
        replyContent = "كيف يمكنني مساعدتك اليوم؟ اختر أحد الخيارات:";
        replyButtons = [
          { label: "📚 المساعدة في الدوسيات", action: "dossiers_start" },
          { label: "🛍️ القرطاسية والألعاب", action: "stationery_start" },
          { label: "📞 الاتصال وخدمة العملاء", action: "contact_info" },
          { label: "📍 موقع المكتبة على الخريطة", action: "location_info" },
        ];
      }

      setMessages((prev) => [...prev, { role: "assistant", content: replyContent, buttons: replyButtons }]);
      setLoading(false);
    }, 500);
  };

  const handleButtonClick = (btn: any) => {
    if (btn.isExternal && btn.url) {
      window.open(btn.url, "_blank");
      return;
    }
    if (btn.isPhone && btn.phoneNum) {
      window.location.href = `tel:${btn.phoneNum}`;
      return;
    }

    // إضافة اختيار المستخدم للشات ثم الرد عليه
    setMessages((prev) => [...prev, { role: "user", content: btn.label }]);
    handleBotLogic(btn.action, btn.label);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-blue-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full hover:bg-slate-100 text-blue-900 transition">
              <ArrowRight className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-600 rounded-xl text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-lg md:text-xl font-black text-blue-950">مساعد مكتبة أبو طوق الذكي</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 w-full flex-1 flex flex-col">
        <div className="bg-white border border-blue-100 rounded-3xl p-4 sm:p-6 shadow-sm flex-1 flex flex-col justify-between overflow-hidden">
          
          <div className="overflow-y-auto space-y-4 pr-2 max-h-[65vh] sm:max-h-[70vh] flex-1">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === "user" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 border border-blue-100"
                  }`}>
                    {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>

                  <div className={`p-4 rounded-2xl max-w-[85%] text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none shadow-sm" 
                      : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                  }`}>
                    {msg.content}
                  </div>
                </div>

                {msg.buttons && msg.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 mr-12">
                    {msg.buttons.map((btn: any, bIdx: number) => (
                      <button
                        key={bIdx}
                        onClick={() => handleButtonClick(btn)}
                        className="px-4 py-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-900 border border-blue-200 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                      >
                        {btn.isExternal && <MapPin className="w-4 h-4 text-red-500" />}
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                  <Bot className="w-5 h-5 animate-spin" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-100 text-slate-500 text-sm rounded-tl-none border border-slate-200 animate-pulse">
                  جاري تجهيز الخيارات...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* تنبيه بديل لصندوق الكتابة يوضح للمستخدم الاعتماد على الأزرار */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs font-bold text-slate-400">
            يرجى التفاعل والاختيار باستخدام الأزرار أعلاه 👆
          </div>

        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        © مكتبة أبو طوق - المساعد الذكي التفاعلي
      </footer>
    </div>
  );
}