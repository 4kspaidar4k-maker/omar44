"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  PlusCircle,
  Trash2,
  BookOpen,
  ShoppingBag,
  ClipboardList,
  Upload,
  MapPin,
  Phone,
  User,
  Check,
  Navigation,
  Truck,
  Gamepad2,
  Clock,
  CheckCircle2,
  FileText,
  Zap,
  HelpCircle,
} from "lucide-react";

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"dossiers" | "stationery" | "orders">("orders");

  const [dossiers, setDossiers] = useState<any[]>([]);
  const [stationery, setStationery] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // قوائم المواد المحددة لكل جيل
  const subjects2010 = [
    "الرياضيات",
    "اللغة العربية",
    "التربية الإسلامية",
    "تاريخ الأردن"
  ];

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

  const loadData = async () => {
    try {
      const { data: productsData, error: prodError } = await supabase.from("products").select("*");
      if (prodError) throw prodError;

      if (productsData) {
        const dossiersList = productsData.filter((item) => item.subject || item.year);
        const stationeryList = productsData.filter((item) => !item.subject && !item.year);
        setDossiers(dossiersList);
        setStationery(stationeryList);
      }

      const { data: ordersData, error: ordError } = await supabase.from("orders").select("*");
      if (ordError) throw ordError;

      if (ordersData) {
        setOrders(ordersData);
      }
    } catch (err) {
      console.error("خطأ في جلب البيانات من Supabase:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [year, setYear] = useState("2010");
  const [semester, setSemester] = useState("الفصل الأول");
  const [subject, setSubject] = useState("الرياضيات");
  const [dossierType, setDossierType] = useState<"شرح مادة" | "مكثف" | "بنك أسئلة">("شرح مادة");
  const [categoryType, setCategoryType] = useState<"قرطاسية" | "ألعاب">("قرطاسية");
  const [imagePreview, setImagePreview] = useState("");

  // تغيير المادة الافتراضية عند تبديل الجيل
  const handleYearChange = (newYear: string) => {
    setYear(newYear);
    if (newYear === "2010") {
      setSubject(subjects2010[0]);
    } else {
      setSubject(subjects2009[0]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "201028") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("كلمة المرور غير صحيحة.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    const newItem = {
      id: Date.now().toString(),
      title,
      price: parseFloat(price),
      year: activeTab === "dossiers" ? year : null,
      semester: activeTab === "dossiers" ? semester : null,
      subject: activeTab === "dossiers" ? subject : null,
      category: activeTab === "dossiers" ? dossierType : categoryType,
      image:
        imagePreview ||
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=500&auto=format&fit=crop",
    };

    const { error } = await supabase.from("products").insert([newItem]);
    if (error) {
      alert("حدث خطأ أثناء الحفظ في قاعدة البيانات!");
      console.error(error);
      return;
    }

    if (activeTab === "dossiers") {
      setDossiers([newItem, ...dossiers]);
    } else {
      setStationery([newItem, ...stationery]);
    }

    setTitle("");
    setPrice("");
    setImagePreview("");
    alert("تم الحفظ بنجاح في قاعدة البيانات!");
  };

  const handleDelete = async (id: string, type: "dossiers" | "stationery") => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("فشل الحذف من قاعدة البيانات");
      return;
    }

    if (type === "dossiers") {
      setDossiers(dossiers.filter((item) => item.id !== id));
    } else {
      setStationery(stationery.filter((item) => item.id !== id));
    }
  };

  const handleMarkAsReceived = async (orderId: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "تم استلام الطلب وتجهيزه" })
      .eq("id", orderId);

    if (error) {
      alert("فشل تحديث حالة الطلب");
      return;
    }

    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: "تم استلام الطلب وتجهيزه" };
        }
        return order;
      })
    );
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("هل أنت متأكد من مسح هذا الطلب نهائياً بعد تسليمه للزبون؟")) {
      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (error) {
        alert("فشل حذف الطلب من قاعدة البيانات");
        return;
      }
      setOrders(orders.filter((o) => o.id !== orderId));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
        <div className="bg-white border border-blue-100 p-8 rounded-3xl max-w-md w-full shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-blue-950 mb-2">لوحة تحكم مكتبة أبو طوق</h1>
            <p className="text-xs text-slate-500">أدخل كلمة المرور الخاصة بالإدارة</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="كلمة المرور"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center tracking-widest text-lg font-bold text-slate-900 outline-none focus:border-blue-600"
            />
            {authError && <p className="text-xs text-rose-600 text-center font-bold">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
            >
              تسجيل الدخول
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-blue-600 font-bold">
              العودة للموقع الرئيسي
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentSubjectsList = year === "2010" ? subjects2010 : subjects2009;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full hover:bg-slate-100 text-blue-900 transition">
              <ArrowRight className="w-6 h-6" />
            </Link>
            <h1 className="text-xl md:text-2xl font-black text-blue-950">إدارة مكتبة أبو طوق (قاعدة البيانات)</h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-xl text-xs border border-rose-200"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`p-4 rounded-2xl border font-bold text-sm md:text-base flex items-center justify-center gap-2 transition ${
              activeTab === "orders"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-blue-950 border-blue-100 hover:border-blue-300"
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span>الطلبات ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("dossiers")}
            className={`p-4 rounded-2xl border font-bold text-sm md:text-base flex items-center justify-center gap-2 transition ${
              activeTab === "dossiers"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-blue-950 border-blue-100 hover:border-blue-300"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>الدوسيات</span>
          </button>

          <button
            onClick={() => setActiveTab("stationery")}
            className={`p-4 rounded-2xl border font-bold text-sm md:text-base flex items-center justify-center gap-2 transition ${
              activeTab === "stationery"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-blue-950 border-blue-100 hover:border-blue-300"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>القرطاسية والألعاب</span>
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === "orders" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-blue-950">طلبات التوصيل الواردة</h2>
              <button
                onClick={loadData}
                className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-50 transition"
              >
                تحديث الطلبات
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white border border-blue-100 rounded-3xl p-12 text-center shadow-sm">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-600">لا توجد طلبات جديدة</h3>
                <p className="text-xs text-slate-400 mt-1">الطلبات التي يطلبها الطلاب ستظهر هنا فوراً.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => {
                  const isReceived = order.status === "تم استلام الطلب وتجهيزه";
                  return (
                    <div
                      key={order.id}
                      className={`bg-white border rounded-3xl p-6 shadow-sm space-y-4 transition ${
                        isReceived ? "border-emerald-200 bg-emerald-50/20" : "border-amber-200"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-900 text-xs font-black px-2.5 py-1 rounded-md">
                              {order.id}
                            </span>
                            <span className="text-xs text-slate-400">{order.date}</span>

                            {isReceived ? (
                              <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-md">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>تم استلام الطلب وتجهيزه</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-1 rounded-md animate-pulse">
                                <Clock className="w-3.5 h-3.5" />
                                <span>الطلب موجود (بانتظار استلامك)</span>
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-black text-blue-950 flex items-center gap-2 mt-1">
                            <User className="w-4 h-4 text-blue-600" />
                            <span>{order.customer}</span>
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${order.phone}`}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-800 border border-slate-200 font-bold rounded-xl text-xs hover:bg-slate-200 transition"
                          >
                            <Phone className="w-3.5 h-3.5 text-blue-600" />
                            <span>{order.phone}</span>
                          </a>

                          {!isReceived && (
                            <button
                              onClick={() => handleMarkAsReceived(order.id)}
                              className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-4 h-4" />
                              <span>استلام الطلب</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl border border-rose-100 transition"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-3 text-amber-950">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <strong className="text-xs block font-black text-amber-900">موقع الاستلام:</strong>
                            <p className="text-sm font-medium mt-0.5">{order.location || "عبر الخريطة"}</p>
                          </div>
                        </div>

                        {order.map_link && (
                          <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-900">إحداثيات الـ GPS:</span>
                            <a
                              href={order.map_link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition shadow-sm"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>فتح الموقع على خرائط قوقل</span>
                            </a>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-black text-slate-500 mb-2">المنتجات المطلوبة:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {Array.isArray(order.items) && order.items.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-slate-200" />
                              <div>
                                <p className="font-bold text-xs text-blue-950 line-clamp-1">{item.name}</p>
                                <p className="text-xs font-black text-blue-700 mt-1">الكمية: {item.quantity} حبة</p>
                                <p className="text-[11px] text-slate-500">السعر: {item.price} د.أ</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Truck className="w-4 h-4 text-blue-600" />
                          <span>رسوم التوصيل: 2.00 دينار</span>
                        </div>
                        <span className="font-black text-blue-950">
                          الإجمالي المطلوب: <strong className="text-base text-emerald-600">{order.total}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm h-fit">
              <h2 className="text-lg font-black text-blue-950 mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                {activeTab === "dossiers" ? "إضافة دوسية جديدة" : "إضافة منتج (قرطاسية أو ألعاب)"}
              </h2>

              <form onSubmit={handleAddItem} className="space-y-4">
                {activeTab === "stationery" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">اختر القسم لوضع المنتج فيه</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCategoryType("قرطاسية")}
                        className={`p-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition ${
                          categoryType === "قرطاسية"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>قرطاسية</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCategoryType("ألعاب")}
                        className={`p-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition ${
                          categoryType === "ألعاب"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <Gamepad2 className="w-4 h-4" />
                        <span>ألعاب</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "dossiers" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">نوع المحتوى (الدوسية)</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDossierType("شرح مادة")}
                        className={`p-2 rounded-xl border text-[11px] font-black flex flex-col items-center gap-1 transition ${
                          dossierType === "شرح مادة"
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        <span>شرح مادة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDossierType("مكثف")}
                        className={`p-2 rounded-xl border text-[11px] font-black flex flex-col items-center gap-1 transition ${
                          dossierType === "مكثف"
                            ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                        <span>مكثف</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDossierType("بنك أسئلة")}
                        className={`p-2 rounded-xl border text-[11px] font-black flex flex-col items-center gap-1 transition ${
                          dossierType === "بنك أسئلة"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>بنك أسئلة</span>
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {activeTab === "dossiers" ? "اسم / عنوان الدوسية" : "اسم العنصر"}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={activeTab === "dossiers" ? "مثال: دوسية الوافي في الرياضيات، مكثف القمة..." : "اكتب اسم المنتج..."}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">السعر (دينار)</label>
                  <input
                    required
                    type="number"
                    step="0.5"
                    placeholder="3.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>

                {activeTab === "dossiers" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">الجيل</label>
                        <select
                          value={year}
                          onChange={(e) => handleYearChange(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                        >
                          <option value="2010">جيل 2010</option>
                          <option value="2009">جيل 2009</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">الفصل</label>
                        <select
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                        >
                          <option value="الفصل الأول">الفصل الأول</option>
                          <option value="الفصل الثاني">الفصل الثاني</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">المادة ({year})</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                      >
                        {currentSubjectsList.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">صورة الغلاف (من الجهاز)</label>
                  <label className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-blue-100 transition text-blue-800 text-xs font-bold">
                    <Upload className="w-4 h-4" />
                    <span>اختر صورة</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {imagePreview && <p className="text-xs text-emerald-600 font-bold mt-1 text-center">تم اختيار الصورة</p>}
                </div>

                <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow-sm">
                  حفظ ونشر في المتجر
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-black text-blue-950 mb-4">
                  {activeTab === "dossiers" ? `قائمة الدوسيات (${dossiers.length})` : `قائمة القرطاسية والألعاب (${stationery.length})`}
                </h2>

                {(activeTab === "dossiers" ? dossiers : stationery).length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">لا توجد عناصر مضافة بعد.</p>
                ) : (
                  <div className="space-y-3">
                    {(activeTab === "dossiers" ? dossiers : stationery).map((item: any) => (
                      <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl" />
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              {/* نوع الدوسية أو قسم القرطاسية */}
                              {item.category && (
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                  item.category === "ألعاب" 
                                    ? "bg-emerald-100 text-emerald-800" 
                                    : item.category === "مكثف"
                                    ? "bg-amber-100 text-amber-900 border border-amber-300 font-black"
                                    : item.category === "بنك أسئلة"
                                    ? "bg-teal-100 text-teal-900 border border-teal-300 font-black"
                                    : "bg-blue-100 text-blue-800"
                                }`}>
                                  {item.category}
                                </span>
                              )}
                              {item.year && (
                                <>
                                  <span className="text-[11px] font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded">جيل {item.year}</span>
                                  <span className="text-[11px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">{item.semester}</span>
                                  <span className="text-[11px] font-bold bg-blue-900 text-white px-2 py-0.5 rounded">{item.subject}</span>
                                </>
                              )}
                            </div>
                            <h3 className="font-bold text-blue-950 text-sm">{item.title}</h3>
                            <p className="text-xs text-blue-700 font-bold mt-0.5">{Number(item.price).toFixed(2)} دينار</p>
                          </div>
                        </div>

                        <button onClick={() => handleDelete(item.id, activeTab)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl border border-rose-100 bg-white" title="حذف نهائي">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
