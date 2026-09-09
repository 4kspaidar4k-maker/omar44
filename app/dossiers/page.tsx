"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingCart,
  BookOpen,
  Layers,
  Calendar,
  ChevronLeft,
  Search,
  FileText,
  Zap,
  HelpCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DossiersPage() {
  const { addToCart, totalItems } = useCart() as any;
  const [dossiersList, setDossiersList] = useState<any[]>([]);

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedDossierType, setSelectedDossierType] = useState<string | null>(null); // النوع: مادة / مكثف / بنك أسئلة
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (error) throw error;

        if (data) {
          const dossiers = data.filter((item) => item.subject || item.year);
          setDossiersList(dossiers);
        }
      } catch (err) {
        console.error("خطأ في جلب الدوسيات من قاعدة البيانات:", err);
      }
    };

    fetchDossiers();
  }, []);

  const handleBack = () => {
    if (selectedDossierType) setSelectedDossierType(null);
    else if (selectedSubject) setSelectedSubject(null);
    else if (selectedSemester) setSelectedSemester(null);
    else if (selectedYear) setSelectedYear(null);
  };

  const semesters = ["الفصل الأول", "الفصل الثاني"];

  // أنواع الدوسيات المطلوبة
  const dossierTypes = [
    { title: "شرح مادة", desc: "الدوسيات الكاملة وتفاصيل المنهج", icon: FileText, color: "text-blue-500" },
    { title: "مكثف", desc: "مراجعات نهائية ومكثفات سريعة للدروس", icon: Zap, color: "text-amber-500" },
    { title: "بنك أسئلة", desc: "أسئلة سنوات سابقة ونماذج وزارية مقترحة", icon: HelpCircle, color: "text-emerald-500" },
  ];

  // مواد جيل 2010
  const subjects2010 = [
    "الرياضيات",
    "اللغة العربية",
    "التربية الإسلامية",
    "تاريخ الأردن"
  ];

  // مواد جيل 2009
  const subjects2009 = [
    "الرياضيات",
    "الرياضيات أعمال",
    "اللغة العربية",
    "اللغة الإنجليزية",
    "التربية الإسلامية",
    "تاريخ الأردن",
    "الكيمياء",
    "الفيزياء",
    "الأحياء",
    "علوم الأرض",
    "علم النفس"
  ];

  const currentSubjects = selectedYear === "2010" ? subjects2010 : subjects2009;

  // فلترة الدوسيات حسب الخيارات وشريط البحث والنوع
  const filteredItems = dossiersList.filter((item) => {
    const yearMatch = !selectedYear || item.year === selectedYear;
    const semesterMatch = !selectedSemester || item.semester === selectedSemester;
    const subjectMatch = !selectedSubject || item.subject === selectedSubject;
    // التحقق من نوع الدوسية سواء كان محفوظاً في الحقل category أو ضمن عنوان الدوسية
    const typeMatch = !selectedDossierType || 
      item.category === selectedDossierType || 
      (item.title && item.title.includes(selectedDossierType));
    const searchMatch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return yearMatch && semesterMatch && subjectMatch && typeMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-blue-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedYear ? (
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-slate-100 text-blue-900 transition flex items-center gap-1 font-bold text-sm"
              >
                <ArrowRight className="w-5 h-5" />
                <span>رجوع</span>
              </button>
            ) : (
              <Link href="/" className="p-2 rounded-full hover:bg-slate-100 text-blue-900 transition">
                <ArrowRight className="w-6 h-6" />
              </Link>
            )}
            <h1 className="text-xl md:text-2xl font-black text-blue-950">قسم الدوسيات والبطاقات</h1>
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

      {/* شريط المسار التعليمي (Breadcrumbs) */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 font-bold overflow-x-auto pb-2">
          <button
            onClick={() => {
              setSelectedYear(null);
              setSelectedSemester(null);
              setSelectedSubject(null);
              setSelectedDossierType(null);
              setSearchQuery("");
            }}
            className="hover:text-blue-600"
          >
            الأجيال
          </button>
          {selectedYear && (
            <>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
              <button
                onClick={() => {
                  setSelectedSemester(null);
                  setSelectedSubject(null);
                  setSelectedDossierType(null);
                }}
                className="hover:text-blue-600 text-blue-900"
              >
                جيل {selectedYear}
              </button>
            </>
          )}
          {selectedSemester && (
            <>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
              <button
                onClick={() => {
                  setSelectedSubject(null);
                  setSelectedDossierType(null);
                }}
                className="hover:text-blue-600 text-blue-900"
              >
                {selectedSemester}
              </button>
            </>
          )}
          {selectedSubject && (
            <>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
              <button
                onClick={() => setSelectedDossierType(null)}
                className="hover:text-blue-600 text-blue-900"
              >
                {selectedSubject}
              </button>
            </>
          )}
          {selectedDossierType && (
            <>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
              <span className="text-blue-600">{selectedDossierType}</span>
            </>
          )}
        </div>

        {/* شريط البحث المطور */}
        <div className="relative mt-4 mb-2">
          <input
            type="text"
            placeholder="ابحث عن أي دوسية أو بطاقة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-blue-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm text-sm font-bold text-blue-950"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-6">
        {/* الخطوة 1: اختيار الجيل */}
        {!selectedYear && (
          <div>
            <h2 className="text-lg font-black text-blue-950 mb-4">اختر الجيل الدراسي:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["2010", "2009"].map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className="p-6 bg-white border border-blue-100 hover:border-blue-500 rounded-2xl shadow-sm hover:shadow-md transition text-right flex items-center justify-between group"
                >
                  <div>
                    <h3 className="text-2xl font-black text-blue-950 group-hover:text-blue-600 transition">
                      دوسيات جيل {year}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">تصفح مواد الدعم والمناهج المعتمدة الخاصة بهذا الجيل</p>
                  </div>
                  <Layers className="w-8 h-8 text-blue-500 group-hover:scale-110 transition" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* الخطوة 2: اختيار الفصل الدراسي */}
        {selectedYear && !selectedSemester && (
          <div>
            <h2 className="text-lg font-black text-blue-950 mb-4">اختر الفصل الدراسي لجيل {selectedYear}:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className="p-6 bg-white border border-blue-100 hover:border-blue-500 rounded-2xl shadow-sm hover:shadow-md transition text-right flex items-center justify-between group"
                >
                  <div>
                    <h3 className="text-xl font-black text-blue-950 group-hover:text-blue-600 transition">{sem}</h3>
                    <p className="text-xs text-slate-400 mt-1">دوسيات ومادة هذا الفصل الدراسي</p>
                  </div>
                  <Calendar className="w-7 h-7 text-blue-500 group-hover:scale-110 transition" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* الخطوة 3: اختيار المادة الدراسية */}
        {selectedYear && selectedSemester && !selectedSubject && (
          <div>
            <h2 className="text-lg font-black text-blue-950 mb-4">
              اختر المادة الدراسية ({selectedSemester} - جيل {selectedYear}):
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentSubjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className="p-5 bg-white border border-blue-100 hover:border-blue-500 rounded-2xl shadow-sm hover:shadow-md transition text-right flex items-center justify-between group"
                >
                  <span className="font-black text-base text-blue-950 group-hover:text-blue-600 transition">{sub}</span>
                  <ChevronLeft className="w-5 h-5 text-blue-400 group-hover:translate-x-[-4px] transition" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* الخطوة 4 (الجديدة): اختيار نوع الدوسية (مادة / مكثف / بنك أسئلة) */}
        {selectedYear && selectedSemester && selectedSubject && !selectedDossierType && (
          <div>
            <h2 className="text-lg font-black text-blue-950 mb-4">
              اختر نوع المحتوى لمادة {selectedSubject}:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dossierTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.title}
                    onClick={() => setSelectedDossierType(type.title)}
                    className="p-6 bg-white border border-blue-100 hover:border-blue-500 rounded-2xl shadow-sm hover:shadow-md transition text-right flex flex-col justify-between group h-44"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                        {selectedSubject}
                      </span>
                      <IconComponent className={`w-8 h-8 ${type.color} group-hover:scale-110 transition`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-blue-950 group-hover:text-blue-600 transition">
                        {type.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{type.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* الخطوة 5: عرض الدوسيات حسب كل الاختيارات */}
        {selectedYear && selectedSemester && selectedSubject && selectedDossierType && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-blue-950">
                {selectedSubject} - {selectedDossierType} ({selectedSemester} - جيل {selectedYear}):
              </h2>
            </div>

            {filteredItems.length === 0 ? (
              <div className="bg-white border border-blue-100 rounded-2xl p-10 text-center text-slate-500 shadow-sm space-y-2">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-sm text-slate-700">لا توجد دوسيات من نوع ({selectedDossierType}) مضافة حالياً.</p>
                <p className="text-xs text-slate-400">يمكنك إضافتها من لوحة التحكم وستظهر هنا فوراً!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-blue-100 rounded-2xl overflow-hidden hover:border-blue-400 shadow-sm hover:shadow-md transition flex flex-col h-[420px]"
                  >
                    <div className="relative h-64 bg-slate-100 overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-12 h-12 text-blue-300" />
                      )}
                      <span className="absolute top-2 right-2 bg-blue-950/80 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-1 rounded-md">
                        {selectedDossierType}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <h3 className="text-sm font-black text-blue-950 line-clamp-2">{item.title}</h3>
                      <span className="text-base font-black text-blue-800">{Number(item.price).toFixed(2)} دينار</span>
                    </div>

                    <div className="p-3 bg-slate-50 border-t border-slate-100">
                      <button
                        onClick={() => {
                          addToCart({ id: item.id, name: item.title, price: item.price, image: item.image }, 1);
                          alert("تمت الإضافة إلى السلة بنجاح!");
                        }}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm text-xs"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        إضافة إلى السلة
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
