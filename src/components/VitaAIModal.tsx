'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, MessageCircle, Pill, Heart, Brain, Zap } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface VitaAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Static AI responses for demo
const aiResponses: Record<string, string> = {
  'heart': 'Based on your interest in heart health, I recommend our Omega-3 Fish Oil Premium and CoQ10 200mg. These supplements work synergistically to support cardiovascular health and reduce inflammation. Would you like to know more about either of these?',
  'brain': 'For brain health and cognitive function, I suggest our DHA Omega-3 Brain Support and Lion\'s Mane Mushroom. DHA is essential for brain structure, while Lion\'s Mane promotes neurogenesis. Interested in learning more?',
  'immune': 'To boost your immune system, I recommend Vitamin D3 5000IU and Elderberry Extract. Vitamin D3 is crucial for immune response, and elderberry has powerful antiviral properties. Would you like dosage recommendations?',
  'performance': 'For athletic performance, our Whey Protein Isolate and Creatine Monohydrate are excellent choices. Protein supports muscle recovery, while creatine enhances strength and power output. Need a workout supplement plan?',
  'energy': 'Feeling tired? I recommend B-Complex Vitamins for sustained energy and CoQ10 for cellular energy production. These work great together. Want to know more about energy-boosting supplements?',
  'sleep': 'For better sleep, try Magnesium Glycinate. It helps relax muscles and calm the nervous system. Taken 30 minutes before bed, it can significantly improve sleep quality. Interested?',
  'default': 'Hi! I\'m Vita AI, your personal supplement advisor. I can help you find the perfect supplements based on your health goals. What are you looking to improve? (Heart health, brain function, immunity, performance, energy, or sleep?)',
};

const quickActions = [
  { icon: Heart, label: 'Heart Health', key: 'heart' },
  { icon: Brain, label: 'Brain Power', key: 'brain' },
  { icon: Sparkles, label: 'Immune Support', key: 'immune' },
  { icon: Zap, label: 'Performance', key: 'performance' },
];

const VitaAIModal: React.FC<VitaAIModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: '1',
          text: aiResponses.default,
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
      setInput('');
      setIsTyping(false);
    } else {
      setMessages([]);
      setInput('');
      setIsTyping(false);
    }
  }, [isOpen]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('heart') || lowerMessage.includes('cardiovascular')) {
      return aiResponses.heart;
    }
    if (lowerMessage.includes('brain') || lowerMessage.includes('cognitive') || lowerMessage.includes('memory')) {
      return aiResponses.brain;
    }
    if (lowerMessage.includes('immune') || lowerMessage.includes('immunity') || lowerMessage.includes('cold') || lowerMessage.includes('flu')) {
      return aiResponses.immune;
    }
    if (lowerMessage.includes('performance') || lowerMessage.includes('workout') || lowerMessage.includes('muscle') || lowerMessage.includes('protein')) {
      return aiResponses.performance;
    }
    if (lowerMessage.includes('energy') || lowerMessage.includes('tired') || lowerMessage.includes('fatigue')) {
      return aiResponses.energy;
    }
    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
      return aiResponses.sleep;
    }
    
    return 'That\'s interesting! Could you tell me more about your health goals? I can provide personalized supplement recommendations for heart health, brain function, immunity, performance, energy, or sleep.';
  };

  const handleSend = (overrideText?: string) => {
    const textToSend = (overrideText ?? input).trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(textToSend),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickAction = (key: string) => {
    const message = key.charAt(0).toUpperCase() + key.slice(1) + ' health';
    handleSend(message);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-bg rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Vita AI</h2>
                  <p className="text-sm text-white/80">Your Personal Supplement Advisor</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-bg">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-border text-text'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-primary">Vita AI</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-border text-text max-w-[80%] rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                    </div>
                    <span className="text-xs text-muted">Vita AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-6 py-3 border-t border-border bg-bg">
              <p className="text-xs text-muted mb-3">Quick suggestions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={action.key}
                      onClick={() => handleQuickAction(action.key)}
                      className="flex items-center space-x-2 px-3 py-2 bg-border hover:bg-primary/10 rounded-lg transition-colors text-sm text-text hover:text-primary"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 border-t border-border bg-bg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Vita AI anything..."
                className="flex-1 px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-bg text-text placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="btn-primary p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VitaAIModal;

