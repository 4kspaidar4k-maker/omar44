import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, dossiers, stationery } = await req.json();

    const API_KEY = "Gsk_g1TdhuvGiBr6QsUQeYHiWGdyb3FYuO1pu8fxpTUNOeg9mWJ5a3h9";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `أنت مساعد ذكي ومحترف لمتجر ومكتبة "أبو طوق" في عمان، الأردن (رقم الهاتف: 0796465131). 
            معلومات منتجات المتجر الحالية في المستودع هي:
            الدوسيات: ${dossiers}
            القرطاسية والألعاب: ${stationery}
            أجب الزبون بذكاء ودقة وأسلوب ودي. إذا سأل عن تحية مثل "كيف حالك"، أجب بلطف وأخبره عن جاهزية مكتبة أبو طوق لمساعدته.`
          },
          ...messages
        ],
      }),
    });

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || "عذراً، لم أستطع معالجة الرد.";

    return NextResponse.json({ reply: aiReply });
  } catch (error) {
    return NextResponse.json({ reply: "حدث خطأ في الاتصال بالخادم." }, { status: 500 });
  }
}