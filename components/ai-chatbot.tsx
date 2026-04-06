"use client"

import { Bot } from "lucide-react"

type LangCode = "en" | "ms" | "zh"

export function AIChatbot({ lang }: { lang: LangCode }) {
  // Chatbot functionality will be added in Iteration 2
  // For now, just show a clickable button that does nothing
  
  return (
    <>
      {/* Floating Chat Button - clickable but no popup */}
      <button
        onClick={() => {
          // Chatbot popup will be implemented in Iteration 2
        }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-[var(--cb-cyan)] border-2 border-[var(--cb-blue-text)] shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        aria-label="Open chat assistant"
      >
        <Bot className="w-8 h-8 text-[var(--cb-blue-text)]" />
      </button>
    </>
  )
}
