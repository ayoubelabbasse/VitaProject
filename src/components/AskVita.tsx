'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface AskVitaProps {
  isOpen?: boolean
  onClose?: () => void
}

const AskVita = ({ isOpen: externalIsOpen, onClose }: AskVitaProps = {}) => {
  const { t, i18n } = useTranslation()
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  
  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const handleClose = onClose || (() => setInternalIsOpen(false))

  useEffect(() => {
    const handleOpenEvent = () => {
      // Only handle event if not externally controlled
      if (externalIsOpen === undefined) {
        setInternalIsOpen(true)
      }
    }
    window.addEventListener('openAskVita', handleOpenEvent)
    return () => window.removeEventListener('openAskVita', handleOpenEvent)
  }, [externalIsOpen])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: i18n.language === 'ar' 
        ? 'مرحباً! أنا فيتا، مساعدك الصحي الذكي. كيف يمكنني مساعدتك اليوم؟'
        : i18n.language === 'fr'
        ? 'Bonjour! Je suis Vita, votre assistant santé intelligent. Comment puis-je vous aider aujourd\'hui?'
        : 'Hello! I\'m Vita, your smart health assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, handleClose])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    const lang = i18n.language

    // Simple rule-based responses (in production, connect to AI API)
    if (lowerMessage.includes('vitamin') || lowerMessage.includes('vitamine') || lowerMessage.includes('فيتامين')) {
      return lang === 'ar'
        ? 'نوصي بفيتامين د3 للصحة العامة، وأوميغا 3 لصحة القلب والدماغ. هل تريد توصيات محددة؟'
        : lang === 'fr'
        ? 'Je recommande la vitamine D3 pour la santé générale et les oméga-3 pour la santé cardiaque et cérébrale. Voulez-vous des recommandations spécifiques?'
        : 'I recommend Vitamin D3 for general health, and Omega-3 for heart and brain health. Would you like specific recommendations?'
    }

    if (lowerMessage.includes('protein') || lowerMessage.includes('protéine') || lowerMessage.includes('بروتين')) {
      return lang === 'ar'
        ? 'بروتين مصل اللبن ممتاز للرياضيين. يمكنني مساعدتك في اختيار المنتج المناسب حسب أهدافك. ما هدفك؟'
        : lang === 'fr'
        ? 'La protéine de lactosérum est excellente pour les athlètes. Je peux vous aider à choisir le bon produit selon vos objectifs. Quel est votre objectif?'
        : 'Whey protein is excellent for athletes. I can help you choose the right product based on your goals. What\'s your goal?'
    }

    if (lowerMessage.includes('immune') || lowerMessage.includes('immunité') || lowerMessage.includes('مناعة')) {
      return lang === 'ar'
        ? 'لتعزيز المناعة، أنصح بفيتامين ج وفيتامين د3. لدينا منتجات عالية الجودة من علامات تجارية موثوقة.'
        : lang === 'fr'
        ? 'Pour renforcer l\'immunité, je recommande la vitamine C et la vitamine D3. Nous avons des produits de haute qualité de marques de confiance.'
        : 'To boost immunity, I recommend Vitamin C and Vitamin D3. We have high-quality products from trusted brands.'
    }

    // Default response
    return lang === 'ar'
      ? 'شكراً لسؤالك! يمكنني مساعدتك في اختيار المكملات الغذائية المناسبة لاحتياجاتك الصحية. ما هي اهتماماتك الصحية الرئيسية؟'
      : lang === 'fr'
      ? 'Merci pour votre question! Je peux vous aider à choisir les suppléments appropriés pour vos besoins de santé. Quels sont vos principaux intérêts en matière de santé?'
      : 'Thanks for your question! I can help you choose the right supplements for your health needs. What are your main health interests?'
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(input),
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1000)
  }

  const isArabic = i18n.language === 'ar'

  // If opened externally, don't show floating button, only show chat window
  if (externalIsOpen === undefined) {
    return (
      <>
        {/* Floating Button - only show if not externally controlled */}
        <button
          onClick={() => setInternalIsOpen(!internalIsOpen)}
          className="fixed bottom-6 right-24 z-40 bg-primary text-white rounded-full shadow-soft-lg hover:shadow-soft-md transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group"
          aria-label={isArabic ? 'اسأل فيتا' : 'Ask Vita'}
        >
          <div className="relative flex items-center gap-3 px-4 py-3">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  className="relative"
                >
                  <Sparkles className="w-5 h-5" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {!isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium hidden sm:block whitespace-nowrap"
              >
                {isArabic ? 'اسأل فيتا' : 'Ask Vita'}
              </motion.span>
            )}
          </div>
        </button>
        {/* Chat Window */}
        {isOpen && (
          <AskVitaChatWindow 
            isOpen={isOpen} 
            onClose={() => setInternalIsOpen(false)}
            isArabic={isArabic}
            messages={messages}
            setMessages={setMessages}
            input={input}
            setInput={setInput}
            isTyping={isTyping}
            setIsTyping={setIsTyping}
            handleSend={handleSend}
            messagesEndRef={messagesEndRef}
            chatRef={chatRef}
          />
        )}
      </>
    )
  }

  // If externally controlled, only render chat window
  return isOpen ? (
    <AskVitaChatWindow 
      isOpen={isOpen} 
      onClose={onClose || (() => {})}
      isArabic={isArabic}
      messages={messages}
      setMessages={setMessages}
      input={input}
      setInput={setInput}
      isTyping={isTyping}
      setIsTyping={setIsTyping}
      handleSend={handleSend}
      messagesEndRef={messagesEndRef}
      chatRef={chatRef}
    />
  ) : null
}

// Extract chat window as separate component
interface AskVitaChatWindowProps {
  isOpen: boolean
  onClose: () => void
  isArabic: boolean
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  isTyping: boolean
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
  handleSend: (e: React.FormEvent) => void
  messagesEndRef: React.RefObject<HTMLDivElement>
  chatRef: React.RefObject<HTMLDivElement>
}

const AskVitaChatWindow = ({
  isOpen,
  onClose,
  isArabic,
  messages,
  setMessages,
  input,
  setInput,
  isTyping,
  setIsTyping,
  handleSend,
  messagesEndRef,
  chatRef,
}: AskVitaChatWindowProps) => {
  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            ref={chatRef}
            className={`fixed bottom-24 right-6 md:right-24 z-40 w-[calc(100vw-3rem)] md:w-96 max-w-md h-[500px] bg-bg border border-border rounded-lg shadow-soft-lg flex flex-col overflow-hidden ${
              isArabic ? 'rtl' : 'ltr'
            }`}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Modern Header with Gradient */}
            <div className="bg-gradient-to-r from-primary to-primary-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{isArabic ? 'اسأل فيتا' : 'Ask Vita'}</h3>
                  <p className="text-xs text-white/80">{isArabic ? 'مساعدك الصحي الذكي' : 'Your Smart Health Assistant'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-border text-text'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-border text-text rounded-lg px-4 py-2">
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-border">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isArabic ? 'اكتب سؤالك...' : 'Type your question...'}
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg text-text placeholder:text-muted"
                  dir={isArabic ? 'rtl' : 'ltr'}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-primary text-white p-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AskVita
