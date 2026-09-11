'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/i18n/routing'
import Navbar from '@/components/Navbar'
import ParticleBackground from '@/components/ParticleBackground'
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
  '¿Cuántos mundiales ha ganado Argentina?',
  '¿Quién es el jugador más joven del torneo?',
  '¿Qué estadio tiene mayor capacidad?',
  '¿Cuándo y dónde es la final?',
  '¿Qué selección anfitriona tiene mejor ranking?',
]

const mockResponses: Record<string, string> = {
  '¿Quién ganó más Mundiales?': 'Brasil es el país con más títulos mundiales, con 5 Copas del Mundo (1958, 1962, 1970, 1994, 2002). Le siguen Italia y Alemania con 4 títulos cada uno. Argentina tiene 3 (1978, 1986, 2022), Uruguay y Francia tienen 2, y España tiene 1.',
  'Compará Argentina y Brasil': 'Argentina y Brasil son los gigantes de Sudamérica. Brasil tiene 5 Mundiales (récord) y ha producido leyendas como Pelé, Ronaldo y Neymar. Argentina tiene 3 Mundiales y cuenta con Lionel Messi, el mejor jugador del mundo. En enfrentamientos directos, Argentina lidera ligeramente el historial. Brasil se destaca por su estilo ofensivo y samba, mientras Argentina es conocida por su garra y talento táctico.',
  '¿Quién es el máximo goleador histórico?': 'El máximo goleador en la historia de los Mundiales es Miroslav Klose (Alemania) con 16 goles. Le siguen Ronaldo Nazário (Brasil) con 15, Gerd Müller (Alemania) con 14, y Just Fontaine (Francia) con 13. Lionel Messi (Argentina) tiene 13 goles y Kylian Mbappé (Francia) lleva 12. En la historia general del fútbol, Cristiano Ronaldo es el máximo goleador con más de 900 goles en su carrera.',
  '¿Qué selección tiene más títulos?': 'Brasil es la selección con más títulos de la Copa del Mundo, con 5 campeonatos (1958, 1962, 1970, 1994 y 2002). Es el único país que ha participado en todas las ediciones del Mundial. Le siguen Italia y Alemania con 4 títulos cada una.',
  '¿Quién es el mejor jugador actual?': 'El mejor jugador del mundo actualmente es Lionel Messi, campeón del Mundo 2022 con Argentina y 8 veces ganador del Balón de Oro. Otros jugadores de élite incluyen a Kylian Mbappé (Francia), Vinícius Jr. (Brasil), Erling Haaland (Noruega) y Jude Bellingham (Inglaterra). La próxima generación está liderada por Lamine Yamal (España) y Jamal Musiala (Alemania).',
  '¿Cuántos mundiales ha ganado Argentina?': 'Argentina ha ganado 3 Copas del Mundo: 1978 (como local), 1986 (en México con Maradona como figura) y 2022 (en Catar con Lionel Messi como capitán). También fue subcampeón en 1930, 1990 y 2014.',
  '¿Quién es el jugador más joven del torneo?': 'El jugador más joven del Mundial 2026 es Lamine Yamal (España) con 18 años. Le siguen Florian Wirtz (Alemania) con 22 años, Eduardo Camavinga (Francia) con 23 años, y Jamal Musiala (Alemania) y Pedri (España) también con 23 años.',
  '¿Qué estadio tiene mayor capacidad?': 'El estadio con mayor capacidad del Mundial 2026 es el Rose Bowl en Pasadena, California, con 92,542 asientos. Le siguen el Estadio Azteca en Ciudad de México con 87,523, el MetLife Stadium en Nueva Jersey con 82,500, y el AT&T Stadium en Arlington con 80,000.',
  '¿Cuándo y dónde es la final?': 'La Final del Mundial 2026 se jugará el 19 de julio de 2026 a las 21:00 horas en el MetLife Stadium en East Rutherford, Nueva Jersey, cerca de Nueva York. El partido programado es Argentina contra Francia.',
  '¿Qué selección anfitriona tiene mejor ranking?': 'De las tres selecciones anfitrionas, Estados Unidos tiene el mejor ranking FIFA (#13), seguido por México (#15) y Canadá (#31). Los tres países son de la CONCACAF y compartirán la organización del Mundial 2026.',
}

function TypewriterText({ text, delay = 20 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, delay)
    return () => clearInterval(interval)
  }, [text, delay])

  return (
    <span>
      {displayed}
      {!done && <span className="animate-pulse text-gold">|</span>}
    </span>
  )
}

export default function AIPage() {
  const t = useTranslations('aiPage')
  const common = useTranslations('common')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: t('welcome') },
  ])
  const [selectedQuestion, setSelectedQuestion] = useState('')
  const [showQuestions, setShowQuestions] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleQuestion = (q: string) => {
    setSelectedQuestion(q)
    setShowQuestions(false)
    setIsTyping(true)
    setMessages(prev => [...prev, { role: 'user', content: q }])

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: mockResponses[q] || t('noAnswer') }])
      setIsTyping(false)
    }, 600)
  }

  const resetChat = () => {
    setMessages([
      { role: 'ai', content: t('welcome') },
    ])
    setShowQuestions(true)
    setSelectedQuestion('')
    setIsTyping(false)
  }

  return (
    <div className="relative min-h-screen bg-dark overflow-x-hidden">
      <ParticleBackground />
      <Navbar />
      <div className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-gray-modern/50 hover:text-gold transition-colors text-sm mb-6">
              <span>←</span> {common('backToHome')}
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3">
              {t('title')}
            </h1>
            <p className="text-gray-modern/60 text-lg">
              {t('subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="glass-card rounded-3xl p-6 text-center sticky top-28">
                <motion.div
                  animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="w-24 h-24 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center"
                >
                  <span className="text-5xl">🤖</span>
                </motion.div>
                <h3 className="text-lg font-bold text-foreground">{t('title')}</h3>
                <p className="text-xs text-gray-modern/50 mb-4">Conocimiento total del Mundial</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-modern/40">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Conectado</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-modern/40">
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    <span>{messages.length - 1} mensajes</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div
                className="rounded-3xl overflow-hidden border border-foreground/10 flex flex-col"
                style={{ background: '#0a0e1a', height: '600px' }}
              >
                <div className="gradient-bg px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🤖</span>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{t('title')}</h3>
                      <p className="text-[10px] text-foreground/60">Listo para responder</p>
                    </div>
                  </div>
                  <button
                    onClick={resetChat}
                    className="text-xs text-foreground/50 hover:text-gold transition-colors px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10"
                  >
                    {t('newChat')}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-sm flex-shrink-0 mr-3 mt-1">
                          🤖
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-blue-secondary/30 text-foreground rounded-tr-md'
                            : 'bg-dark-card text-gray-modern/90 rounded-tl-md border border-foreground/5'
                        }`}
                      >
                        {msg.role === 'ai' && i === messages.length - 1 ? (
                          <TypewriterText text={msg.content} />
                        ) : (
                          msg.content
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-sm flex-shrink-0">
                        🤖
                      </div>
                      <div className="bg-dark-card border border-foreground/5 rounded-2xl px-5 py-3">
                        <div className="flex gap-1">
                          <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-2 h-2 bg-gold/60 rounded-full" />
                          <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-2 h-2 bg-gold/60 rounded-full" />
                          <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-2 h-2 bg-gold/60 rounded-full" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {showQuestions && messages.length === 1 && (
                    <div className="pt-4 space-y-2">
                      <p className="text-xs text-gray-modern/40 uppercase tracking-wider font-medium mb-3">{t('suggestedQuestions')}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {predefinedQuestions.map((q, i) => (
                          <motion.button
                            key={q}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => handleQuestion(q)}
                            className="text-left text-xs px-4 py-3 rounded-xl bg-dark-hover hover:bg-gold/10 text-gray-modern/70 hover:text-gold transition-all border border-foreground/5"
                          >
                            {q}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
