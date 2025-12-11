import React, { useState } from 'react'
import { Sidebar } from '../src/components/Sidebar'
import { PromptEditor } from '../src/components/PromptEditor'
import { ParametersPanel } from '../src/components/ParametersPanel'
import { ChatArea } from '../src/components/ChatArea'
import { ThemeToggle } from '../src/components/ThemeToggle'

export default function Home() {
  const [params, setParams] = useState({ temperature: 0.7, max_tokens: 200 })
  const [history, setHistory] = useState<{ id:string; prompt: string; response: string; ts:string }[]>([])
  const [isSending, setIsSending] = useState(false)

  const handleSend = async (prompt: string) => {
    if (!prompt.trim()) return
    setIsSending(true)
    const id = Date.now().toString()

    // Add message immediately with empty response
    setHistory(h => [{ id, prompt, response: '', ts: new Date().toISOString() }, ...h])

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, params })
    })

    if (!res.ok) {
      const text = `Mock response for: ${prompt}`
      setHistory(h => h.map(item => item.id === id ? { ...item, response: text } : item))
      setIsSending(false)
      return
    }

    // Streaming simulation
    const data = await res.json()
    const full = data.text || `Mock response for: ${prompt}`
    let i = 0

    const interval = setInterval(() => {
      i++
      setHistory(h => h.map(item => item.id === id ? { ...item, response: full.slice(0, i) } : item))
      if (i >= full.length) {
        clearInterval(interval)
        setIsSending(false)
      }
    }, 12)
  }

  return (
    <div className="min-h-screen flex text-gray-100">

      {/* SIDEBAR — GLASS PANEL */}
      <div className="glass w-64 hidden md:block">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* PROMPT PANEL (Glass) */}
        <section className="md:col-span-2 glass rounded-xl shadow-lg min-h-[70vh] flex flex-col">

          <div className="p-4 flex justify-between items-center border-b border-white/10">
            <h3 className="text-lg font-semibold">Prompt</h3>
            <div className="hidden md:block">
              <span className="text-sm opacity-70">Temperature: {params.temperature.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <PromptEditor onSend={handleSend} />
          </div>

          <div className="p-4 border-t border-white/10">
            <ParametersPanel params={params} setParams={setParams} />
          </div>
        </section>

        {/* AI OUTPUT (Glass) */}
        <aside className="md:col-span-1 glass rounded-xl shadow-lg min-h-[70vh] overflow-auto">
          <div className="p-4 flex justify-between items-center border-b border-white/10">
            <h2 className="font-semibold">AI Output</h2>
            <ThemeToggle />
          </div>

          <ChatArea history={history} />
        </aside>

      </main>
    </div>
  )
}
