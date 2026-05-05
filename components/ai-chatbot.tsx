"use client";

// components/AIChatbot.tsx
// Epic 9: AI Conversational Health Assistant
// Features:
// - Floating button accessible from all pages
// - Context-aware: reads food scan results from sessionStorage
// - Multi-language: English, Bahasa Malaysia, Simplified Chinese
// - Safety: disclaimer on every message, no medical diagnosis
// - Fallback handling for API errors

import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, X, Send, Loader2, ChevronDown } from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type LangCode = "en" | "ms" | "zh";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

// Shape of what /api/predict stores — mirrors the API response
interface ScanContext {
  "Appetizer"?: { ranking: FoodItem[] };
  "Main Dish"?: { ranking: FoodItem[] };
  "Dessert"?: { ranking: FoodItem[] };
  "Drinks"?: { ranking: FoodItem[] };
  uniqueFoodCount?: number;
}

interface FoodItem {
  f: string;
  sugar: number;
  salt: number;
  fat: number;
  risk: "Low" | "Medium" | "High";
  tip?: string;
  best_reason?: string;
}

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────

const t = {
  en: {
    title: "SIHAT Assistant",
    subtitle: "Ask me about diabetes & diet",
    placeholder: "Ask about diabetes, food choices...",
    send: "Send",
    welcome:
      "Hello! 👋 I'm Siti, your SIHAT health buddy!\n\nI can help you with:\n• Is this food okay for my diabetes?\n• What foods should I avoid?\n• What are the Three Highs?\n\nJust type your question below lah! 😊",
    scanFound: "💡 I can see you've scanned a menu! Ask me about your food choices and I'll give you personalised advice.",
    noScan: "No food scan found. Try scanning a menu first for personalised advice!",
    thinking: "Thinking...",
    errorRetry: "Something went wrong. Please try again.",
    ariaOpen: "Open health assistant",
    ariaClose: "Close health assistant",
    suggestedQ: ["Is my food safe for diabetes?", "What should I avoid eating?", "Explain the Three Highs"],
  },
  ms: {
    title: "Pembantu SIHAT",
    subtitle: "Tanya saya tentang diabetes & pemakanan",
    placeholder: "Tanya tentang diabetes, pilihan makanan...",
    send: "Hantar",
    welcome:
      "Helo! 👋 Saya Siti, kawan kesihatan SIHAT anda!\n\nSaya boleh bantu anda dengan:\n• Adakah makanan ini selamat untuk diabetes saya?\n• Makanan apa yang perlu saya elakkan?\n• Apa itu Tiga Tinggi?\n\nTaip soalan anda di bawah ya! 😊",
    scanFound: "💡 Saya nampak anda telah mengimbas menu! Tanya saya tentang pilihan makanan anda untuk nasihat peribadi.",
    noScan: "Tiada imbasan makanan ditemui. Cuba imbas menu dahulu untuk nasihat peribadi!",
    thinking: "Sedang berfikir...",
    errorRetry: "Ada masalah. Sila cuba lagi.",
    ariaOpen: "Buka pembantu kesihatan",
    ariaClose: "Tutup pembantu kesihatan",
    suggestedQ: ["Adakah makanan saya selamat untuk diabetes?", "Apa yang perlu saya elakkan?", "Terangkan Tiga Tinggi"],
  },
  zh: {
    title: "SIHAT 健康助手",
    subtitle: "询问关于糖尿病和饮食的问题",
    placeholder: "询问关于糖尿病、食物选择...",
    send: "发送",
    welcome:
      "你好！👋 我是Siti，您的SIHAT健康小助手！\n\n我可以帮您解答：\n• 这个食物对我的糖尿病安全吗？\n• 我应该避免哪些食物？\n• 什么是三高？\n\n请直接在下方输入您的问题吧！😊",
    scanFound: "💡 我看到您已扫描了菜单！向我询问您的食物选择，我将为您提供个性化建议。",
    noScan: "未找到食物扫描记录。请先扫描菜单以获取个性化建议！",
    thinking: "思考中...",
    errorRetry: "出现错误，请重试。",
    ariaOpen: "打开健康助手",
    ariaClose: "关闭健康助手",
    suggestedQ: ["我的食物对糖尿病安全吗？", "我应该避免什么食物？", "解释三高"],
  },
} as const;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Reads food scan results from sessionStorage (stored by recommendation page) */
function readScanContext(): ScanContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("sihat_scan_results");
    if (!raw) return null;
    return JSON.parse(raw) as ScanContext;
  } catch {
    return null;
  }
}

/** Generates a simple unique ID for messages */
function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function AIChatbot({ lang }: { lang: LangCode }) {
  const tx = t[lang] ?? t["en"];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scanContext, setScanContext] = useState<ScanContext | null>(null);
  const [hasInitialised, setHasInitialised] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialise chatbot when first opened
  useEffect(() => {
    if (isOpen && !hasInitialised) {
      const ctx = readScanContext();
      setScanContext(ctx);

      const welcomeMsg: Message = {
        role: "assistant",
        content: tx.welcome,
        id: uid(),
      };

      const msgs: Message[] = [welcomeMsg];

      // If scan context found, add a hint message
      if (ctx) {
        msgs.push({
          role: "assistant",
          content: tx.scanFound,
          id: uid(),
        });
      }

      setMessages(msgs);
      setHasInitialised(true);

      // Focus input after open animation
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, hasInitialised, tx]);

  // Re-read scan context when chat opens (user may have just scanned)
  useEffect(() => {
    if (isOpen) {
      const ctx = readScanContext();
      setScanContext(ctx);
    }
  }, [isOpen]);

  // Re-read scan context when chat opens (user may have just scanned)
  useEffect(() => {
    if (isOpen) {
      const ctx = readScanContext();
      setScanContext(ctx);
    }
  }, [isOpen]);

  // 當語言改變時更新 welcome message（第一條訊息）
  useEffect(() => {
    if (messages.length === 0) return;
    setMessages(prev => {
      const newFirst = { ...prev[0], content: tx.welcome };
      return [newFirst, ...prev.slice(1)];
    });
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (hasInitialised) {
      setMessages([]);
      setHasInitialised(false);
    }
  }, [lang]);

  // ─── SEND MESSAGE ───────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: Message = { role: "user", content: trimmed, id: uid() };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            // Send only content for API (exclude id field)
            history: newMessages.slice(-6).map(({ role, content }) => ({ role, content })),
            language: lang,
            scanContext: scanContext ?? null,
          }),
        });

        const data = await res.json();
        const reply = data.reply || tx.errorRetry;

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: reply, id: uid() },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: tx.errorRetry, id: uid() },
        ]);
      } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [isLoading, messages, lang, scanContext, tx]
  );

  // Handle Enter key (Shift+Enter for newline)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 text-white"
        style={{ background: "linear-gradient(135deg, #0a7a74 0%, #047a57 100%)", border: "2px solid #047a57" }}
        aria-label={isOpen ? tx.ariaClose : tx.ariaOpen}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <ChevronDown className="w-7 h-7" />
        ) : (
          <Bot className="w-8 h-8" />
        )}
      </button>

      {/* ── Chat Window ── */}
      {isOpen && (
        <>
          {/* 透明背景 — 點擊關閉 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed bottom-24 right-4 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-white"
          style={{ width: "min(96vw, 520px)", height: "min(85vh, 720px)", border: "2px solid #0a7a74" }}
          role="dialog"
          aria-label={tx.title}
        >
          {/* ── Header — teal green to stand out from the dark blue site ── */}
          <div className="flex items-center justify-between px-5 py-4 text-white shrink-0" style={{ background: "linear-gradient(135deg, #0a7a74 0%, #047a57 100%)" }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-base leading-tight">{tx.title}</p>
                <p className="text-sm text-white/80 leading-tight">{tx.subtitle}</p>
              </div>
            </div>
            {scanContext && (
              <span className="text-xs bg-white/20 text-white font-semibold px-2.5 py-1 rounded-full mr-2">
                {lang === "zh" ? "已扫描菜单" : lang === "ms" ? "Menu diimbas" : "Menu scanned"}
              </span>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              aria-label={tx.ariaClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 mr-2" style={{ background: "linear-gradient(135deg, #0a7a74, #047a57)" }}>
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-4 py-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "text-white rounded-tr-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm"
                  }`}
                  style={{
                    fontSize: "17px",
                    lineHeight: "1.65",
                    ...(msg.role === "user" ? { background: "linear-gradient(135deg, #0a7a74, #047a57)" } : {}),
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 mr-2" style={{ background: "linear-gradient(135deg, #0a7a74, #047a57)" }}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#0a7a74" }} />
                  <span className="text-gray-500" style={{ fontSize: "16px" }}>{tx.thinking}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Suggested Questions ── */}
          {messages.length <= 2 && !isLoading && !input.trim() && (
            <div className="px-4 py-3 flex flex-col gap-2 bg-gray-50 border-t border-gray-100 shrink-0">
              {tx.suggestedQ.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left px-4 py-3 rounded-xl transition-colors font-medium"
                  style={{ 
                    fontSize: "15px", 
                    background: "#f0faf9",
                    border: "none",
                    color: "#0a7a74",
                  }}
                >
                  → {q}
                </button>
              ))}
            </div>
          )}

          {/* ── Input Area ── */}
          <div className="px-4 py-3 bg-white border-t border-gray-200 shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tx.placeholder}
                rows={1}
                disabled={isLoading}
                className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors max-h-28 overflow-y-auto"
                style={{ fontSize: "17px", lineHeight: "1.5", outline: "none" }}
                onFocus={(e) => { e.target.style.borderColor = "#0a7a74"; e.target.style.boxShadow = "0 0 0 3px rgba(15,95,90,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none"; }}
                aria-label={tx.placeholder}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 disabled:cursor-not-allowed"
                style={{
                  background: input.trim() && !isLoading ? "linear-gradient(135deg, #0a7a74, #047a57)" : "#e5e7eb",
                  color: input.trim() && !isLoading ? "white" : "#9ca3af",
                }}
                aria-label={tx.send}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── Fixed Disclaimer Bar ── */}
          <div className="px-4 py-3 shrink-0" style={{ background: "#ecfdf5", borderTop: "1.5px solid #6ee7b7" }}>
            <p className="text-center font-semibold" style={{ fontSize: "14px", color: "#064e3b" }}>
              🩺{" "}
              {lang === "zh"
                ? "以上仅为一般性建议——如需个人医疗建议，请咨询您的医生。"
                : lang === "ms"
                ? "Panduan umum sahaja — sila rujuk doktor anda untuk nasihat peribadi."
                : "General guidance only — please consult your doctor for personal medical advice."}
            </p>
          </div>
        </div>
        </>
      )}
    </>
  );
}