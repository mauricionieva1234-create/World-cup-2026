'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface Message {
  role: 'user' | 'ai'
  content: string
}

const predefinedQuestions = [
  '¿Quién ganó más Mundiales?',
  'Compará Argentina y Brasil',
  '¿Quién es el máximo goleador histórico?',
  '¿Qué selección tiene más títulos?',
  '¿Quién es el mejor jugador actual?',
]

const mockResponses: Record<string, string> = {
  '¿Quién ganó más Mundiales?': 'Brasil es el país con más títulos mundiales, con 5 Copas del Mundo (1958, 1962, 1970, 1994, 2002). Le siguen Italia y Alemania con 4 títulos cada uno. Argentina tiene 3 (1978, 1986, 2022), Uruguay y Francia tienen 2, y España tiene 1.',
  'Compará Argentina y Brasil': 'Argentina y Brasil son los gigantes de Sudamérica. Brasil tiene 5 Mundiales (récord) y ha producido leyendas como Pelé, Ronaldo y Neymar. Argentina tiene 3 Mundiales y cuenta con Lionel Messi, el mejor jugador del mundo. En enfrentamientos directos, Argentina lidera ligeramente el historial. Brasil se destaca por su estilo ofensivo y samba, mientras Argentina es conocida por su garra y talento táctico.',
  '¿Quién es el máximo goleador histórico?': 'El máximo goleador en la historia de los Mundiales es Miroslav Klose (Alemania) con 16 goles. Le siguen Ronaldo Nazário (Brasil) con 15, Gerd Müller (Alemania) con 14, y Just Fontaine (Francia) con 13. Lionel Messi (Argentina) tiene 13 goles y Kylian Mbappé (Francia) lleva 12. En la historia general del fútbol, Cristiano Ronaldo es el máximo goleador con más de 900 goles en su carrera.',
  '¿Qué selección tiene más títulos?': 'Brasil es la selección con más títulos de la Copa del Mundo, con 5 campeonatos (1958, 1962, 1970, 1994 y 2002). Es el único país que ha participado en todas las ediciones del Mundial. Le siguen Italia y Alemania con 4 títulos cada una.',
  '¿Quién es el mejor jugador actual?': 'El mejor jugador del mundo actualmente es Lionel Messi, campeón del Mundo 2022 con Argentina y 8 veces ganador del Balón de Oro. Otros jugadores de élite incluyen a Kylian Mbappé (Francia), Vinícius Jr. (Brasil), Erling Haaland (Noruega) y Jude Bellingham (Inglaterra). La próxima generación está liderada por Lamine Yamal (España) y Jamal Musiala (Alemania).',
}

export default function AIChat() {
  const t = useTranslations('aiChat')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: t('welcome') },
  ])
  const [selectedQuestion, setSelectedQuestion] = useState('')
  const [showQuestions, setShowQuestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleQuestion = (q: string) => {
    setSelectedQuestion(q)
    setShowQuestions(false)
    setMessages(prev => [...prev, { role: 'user', content: q }])

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: mockResponses[q] || t('noAnswer') }])
    }, 800)
  }

  const resetChat = () => {
    setMessages([
    { role: 'ai', content: t('welcome') },
    ])
    setShowQuestions(true)
    setSelectedQuestion('')
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-gold text-dark flex items-center justify-center shadow-2xl shadow-gold/30 hover:shadow-gold/50 transition-shadow"
        aria-label={t('title')}
      >
        <span className="text-2xl">🤖</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-foreground/10"
            style={{ background: '#0a0e1a' }}
          >
            <div className="gradient-bg px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🤖</span>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{t('title')}</h3>
                  <p className="text-[10px] text-foreground/60">{t('subtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors text-foreground/70"
              >
                o.
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-xs flex-shrink-0 mr-2 mt-1">
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-secondary/30 text-foreground rounded-tr-md'
                        : 'bg-dark-card text-gray-modern/90 rounded-tl-md border border-foreground/5'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {showQuestions && messages.length === 1 && (
                <div className="pt-3 space-y-2">
                  <p className="text-[10px] text-gray-modern/40 uppercase tracking-wider font-medium">{t('suggestedQuestions')}</p>
                  {predefinedQuestions.map((q, i) => (
                    <motion.button
                      key={q}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => handleQuestion(q)}
                      className="block w-full text-left text-xs px-4 py-2.5 rounded-xl bg-dark-hover hover:bg-gold/10 text-gray-modern/70 hover:text-gold transition-all border border-foreground/5"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-foreground/5">
              <button
                onClick={resetChat}
                className="w-full text-xs text-gray-modern/40 hover:text-gold transition-colors py-1"
              >
                {t('newChat')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
