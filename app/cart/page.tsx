"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Trash2, CheckCircle, ShoppingCart, MapPin, Phone, User, Navigation, Truck } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart } = useCart() as any;

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // حساب المجموع الفرعي ورسوم التوصيل الإجبارية
  const DELIVERY_FEE = 2.0;
  const itemsTotal = cart?.reduce((total: number, item: any) => total + item.price * item.quantity, 0) || 0;
  const finalTotal = itemsTotal + DELIVERY_FEE;

  // تحديد الموقع التلقائي عبر GPS و Google Maps
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("خاصية تحديد الموقع غير مدعومة في متصفحك.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const generatedLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setMapLink(generatedLink);
        setCustomerLocation((prev) => 
          prev ? `${prev} (تم التقاط الموقع عبر GPS)` : "تم تحديد الموقع الجغرافي بدقة عبر GPS"
        );
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        alert("تعذر جلب موقعك تلقائياً. يرجى تفعيل إذن الوصول للموقع (GPS) أو كتابة العنوان يدوياً.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || (!customerLocation && !mapLink) || !cart || cart.length === 0) {
      alert("يرجى التأكد من كتابة الاسم، رقم الهاتف، وتحديد الموقع بدقة.");
      return;
    }

    setIsSubmitting(true);

    const savedOrders = localStorage.getItem("abu_touq_orders");
    const existingOrders = savedOrders ? JSON.parse(savedOrders) : [];

    const newOrder = {
      id: `AT-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customerName,
      phone: customerPhone,
      location: customerLocation,
      mapLink: mapLink || null,
      subtotal: `${itemsTotal.toFixed(2)} دينار`,
      deliveryFee: `${DELIVERY_FEE.toFixed(2)} دينار`,
      total: `${finalTotal.toFixed(2)} دينار`,
      status: "قيد التجهيز والتوصيل",
      date: new Date().toLocaleString("ar-JO"),
      items: cart.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    };

    localStorage.setItem("abu_touq_orders", JSON.stringify([newOrder, ...existingOrders]));
    localStorage.removeItem("abu_touq_cart");

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }, 1000);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-blue-100 rounded-3xl p-10 text-center max-w-md w-full shadow-lg">
          <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-blue-950 mb-2">تم تأكيد طلبك بنجاح!</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            تم استلام تفاصيل طلبك وإحداثيات موقعك بدقة. سنتواصل معك لتسليم الطلب في أقرب وقت.
          </p>
          <p className="text-xs text-slate-400">جاري العودة للرئيسية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full hover:bg-slate-100 text-blue-900 transition">
            <ArrowRight className="w-6 h-6" />
          </Link>
          <h1 className="text-xl md:text-2xl font-black text-blue-950">سلة المشتريات والطلب</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {!cart || cart.length === 0 ? (
          <div className="bg-white border border-blue-100 rounded-3xl p-12 text-center shadow-sm max-w-2xl mx-auto">
            <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-black text-blue-950 mb-2">سلتك فارغة حالياً</h2>
            <p className="text-sm text-slate-400 mb-6">تصفح أقسام المكتبة وأضف المنتجات التي تحتاجها!</p>
            <Link href="/" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition">
              العودة للتسوق
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* قائمة المواد */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-black text-blue-950 mb-4">العناصر المضافة ({cart.length})</h2>
                <div className="space-y-4">
                  {cart.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-950 text-base">{item.name}</h3>
                        <p className="text-xs text-blue-700 font-black mt-1">الكمية: {item.quantity} حبة</p>
                        <p className="text-sm font-black text-slate-800 mt-1">المجموع: {(item.price * item.quantity).toFixed(2)} دينار</p>
                      </div>
                      <button
                        onClick={() => removeFromCart && removeFromCart(item.id)}
                        className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition border border-rose-100 bg-white"
                        title="إزالة من السلة"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* تفاصيل التوصيل والحساب */}
            <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm h-fit">
              <h2 className="text-lg font-black text-blue-950 mb-2">بيانات التسليم والموقع</h2>

              {/* تفصيل الحساب مع التوصيل الإجباري */}
              <div className="py-3 border-y border-slate-100 my-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>سعر المواد:</span>
                  <span className="font-bold">{itemsTotal.toFixed(2)} دينار</span>
                </div>
                <div className="flex justify-between items-center text-blue-900 bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>رسوم التوصيل (إجباري):</span>
                  </span>
                  <span className="font-black text-blue-700">{DELIVERY_FEE.toFixed(2)} دينار</span>
                </div>
                <div className="flex justify-between items-center pt-2 text-base border-t border-slate-100">
                  <span className="font-black text-slate-800">المجموع الإجمالي:</span>
                  <span className="text-2xl font-black text-emerald-600">{finalTotal.toFixed(2)} دينار</span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>الاسم الكامل</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="مثال: يوسف أحمد المناصير"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>رقم هاتف فعّال</span>
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="07XXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-sm text-slate-900 text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>موقع التسليم على الخريطة</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isLocating}
                      className="flex items-center gap-1 text-[11px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{isLocating ? "جاري التحديد..." : "حدد موقعي تلقائياً (GPS)"}</span>
                    </button>
                  </div>

                  {mapLink && (
                    <div className="mb-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between">
                      <span>تم ربط موقعك الجغرافي بنجاح!</span>
                      <a href={mapLink} target="_blank" rel="noreferrer" className="underline text-emerald-900">
                        معاينة الخريطة
                      </a>
                    </div>
                  )}

                  <textarea
                    required
                    rows={2}
                    placeholder="أو اكتب تفاصيل إضافية (المنطقة، اسم الشارع، عمارة رقم...)"
                    value={customerLocation}
                    onChange={(e) => setCustomerLocation(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-sm text-slate-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-black rounded-xl transition shadow-md text-base mt-2"
                >
                  {isSubmitting ? "جاري إرسال الطلب..." : `تأكيد الطلب وتوصيله (${finalTotal.toFixed(2)} دينار)`}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}