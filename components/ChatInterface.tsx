'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, Bot, Lightbulb } from 'lucide-react'
import ProjectCard from './ProjectCard'
import LoadingDots from './LoadingDots'
import ModelSelector from './ModelSelector'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  projectData?: {
    title: string
    description: string
    techStack: string[]
    objectives: string[]
    noveltyScore: number
    difficulty: string
    estimatedTime: string
  }
}

interface ChatInterfaceProps {
  studentData: {
    name: string
    major: string
    year: string
    interests: string
  }
}

export default function ChatInterface({ studentData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${studentData.name}! 👋 I'm your AI Project Assistant. I'm excited to help you discover amazing project ideas tailored to your interests in ${studentData.interests}!\n\nYou can ask me to:\n- 🎯 Suggest project ideas based on your skills\n- 💡 Get detailed tech stack recommendations\n- 📊 Understand project complexity and novelty\n- 🚀 Find projects suitable for your academic level\n\nWhat kind of project are you interested in exploring today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          studentData,
          history: messages,
          model: selectedModel,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        projectData: data.projectData,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl sticky top-0 z-10"
        style={{
          boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.15)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Lightbulb className="w-8 h-8 text-yellow-500" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-50"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Project Idea Generator
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {studentData.name}!
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-6 h-6 text-purple-500" />
          </motion.div>
        </div>
      </motion.header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Model Selector */}
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />

          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                      : 'bg-gradient-to-br from-green-500 to-teal-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-6 h-6 text-white" />
                  ) : (
                    <Bot className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`flex-1 ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  } flex flex-col`}
                >
                  <div
                    className={`px-6 py-4 rounded-2xl max-w-3xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-xl'
                        : 'bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm'
                    }`}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Project Card if available */}
                  {message.projectData && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 w-full max-w-3xl"
                    >
                      <ProjectCard project={message.projectData} />
                    </motion.div>
                  )}

                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <LoadingDots />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 border-t border-gray-200/50 dark:border-gray-700/50 px-4 py-4 sticky bottom-0 backdrop-blur-xl"
        style={{
          boxShadow: '0 -4px 24px 0 rgba(31, 38, 135, 0.15)',
        }}
      >
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Ask me for project ideas, tech stacks, or anything else..."
                rows={1}
                disabled={isLoading}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50 dark:focus:ring-blue-900/50 outline-none transition-all resize-none disabled:opacity-50 shadow-sm hover:border-gray-300 dark:hover:border-gray-500"
                style={{ minHeight: '56px', maxHeight: '200px' }}
              />
            </div>
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.05, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <Send className="w-6 h-6 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            </motion.button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </form>
      </motion.div>
    </div>
  )
}

