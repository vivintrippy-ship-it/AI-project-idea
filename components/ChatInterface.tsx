'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, Bot, Lightbulb, Bookmark, Download, Copy, Check, Trash2 } from 'lucide-react'
import ProjectCard from './ProjectCard'
import LoadingDots from './LoadingDots'
import ModelSelector from './ModelSelector'
import SavedProjects from './SavedProjects'
import SearchHistory from './SearchHistory'
import KeyboardShortcuts from './KeyboardShortcuts'
import Analytics from './Analytics'
import AttachmentMenu from './AttachmentMenu'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'

interface AttachedFile {
  name: string
  size: number
  type: string
  data: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  image?: string
  code?: { code: string; language: string }
  attachments?: AttachedFile[]
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
  const [showSaved, setShowSaved] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [pendingCode, setPendingCode] = useState<{ code: string; language: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSaveProject = (messageId: string, projectData: any) => {
    const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]')
    savedProjects.push({
      id: messageId,
      project: projectData,
      savedAt: new Date().toISOString()
    })
    localStorage.setItem('savedProjects', JSON.stringify(savedProjects))
  }

  const handleCopyMessage = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content)
    setCopiedMessageId(messageId)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  const handleExportChat = () => {
    const chatData = messages.map(m => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp
    }))
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all chat history?')) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hello ${studentData.name}! 👋 I'm your AI Project Assistant. I'm excited to help you discover amazing project ideas tailored to your interests in ${studentData.interests}!\n\nYou can ask me to:\n- 🎯 Suggest project ideas based on your skills\n- 💡 Get detailed tech stack recommendations\n- 📊 Understand project complexity and novelty\n- 🚀 Find projects suitable for your academic level\n\nWhat kind of project are you interested in exploring today?`,
          timestamp: new Date(),
        },
      ])
    }
  }

  const handleSelectMessage = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`)
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      messageElement.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50')
      setTimeout(() => {
        messageElement.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50')
      }, 2000)
    }
  }

  const handleImageSelect = (imageData: string) => {
    setSelectedImage(imageData)
  }

  const handleCodeAdd = (code: string, language: string) => {
    setPendingCode({ code, language })
  }

  const handleFileAttach = (file: AttachedFile) => {
    setAttachedFiles((prev) => [...prev, file])
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImage && !pendingCode && attachedFiles.length === 0) || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      image: selectedImage || undefined,
      code: pendingCode || undefined,
      attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setSelectedImage(null)
    setPendingCode(null)
    setAttachedFiles([])
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
        className="bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/30 dark:border-gray-700/30 backdrop-blur-2xl sticky top-0 z-10"
        style={{
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                  Project Ideas
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {studentData.name}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <SearchHistory messages={messages} onSelectMessage={handleSelectMessage} />
            
            <KeyboardShortcuts />

            <Analytics messages={messages} />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSaved(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Saved Projects"
            >
              <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportChat}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Export Chat"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearHistory}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Clear History"
            >
              <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Saved Projects Sidebar */}
      <SavedProjects isOpen={showSaved} onClose={() => setShowSaved(false)} />

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
                id={`message-${message.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex gap-4 transition-all duration-300 rounded-lg ${
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
                  <div className="relative group max-w-3xl">
                    <div
                      className={`px-6 py-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg'
                          : 'bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white shadow-lg border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-xl'
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>

                      {/* Image Attachment */}
                      {message.image && (
                        <div className="mt-3 rounded-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                          <div className="relative w-full h-64">
                            <Image
                              src={message.image}
                              alt="Attached image"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      )}

                      {/* Code Snippet */}
                      {message.code && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded-t-lg">
                            <span className="text-xs font-mono text-gray-300">
                              {message.code.language}
                            </span>
                          </div>
                          <pre className="p-4 bg-gray-900 rounded-b-lg overflow-x-auto">
                            <code className="text-sm text-gray-100 font-mono">
                              {message.code.code}
                            </code>
                          </pre>
                        </div>
                      )}

                      {/* File Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm"
                            >
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                📎 {file.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Message Actions */}
                    {message.role === 'assistant' && (
                      <div className="absolute -right-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCopyMessage(message.content, message.id)}
                          className="p-1.5 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
                          title="Copy message"
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </motion.button>

                        {message.projectData && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSaveProject(message.id, message.projectData)}
                            className="p-1.5 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
                            title="Save project"
                          >
                            <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </motion.button>
                        )}
                      </div>
                    )}
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
        className="bg-white/70 dark:bg-gray-900/70 border-t border-gray-200/30 dark:border-gray-700/30 px-6 py-4 sticky bottom-0 backdrop-blur-2xl"
        style={{
          boxShadow: '0 -1px 3px 0 rgba(0, 0, 0, 0.1), 0 -1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
      >
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Input Area */}
          <div className="flex gap-3 items-end">
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
                className="w-full px-5 py-3 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200/30 dark:focus:ring-blue-900/30 outline-none transition-all resize-none disabled:opacity-50 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60"
                style={{ minHeight: '48px', maxHeight: '200px' }}
              />
            </div>

            {/* Attachment Menu */}
            <AttachmentMenu
              onImageSelect={handleImageSelect}
              onCodeAdd={handleCodeAdd}
              onFileAttach={handleFileAttach}
              selectedImage={selectedImage}
              pendingCode={pendingCode}
              attachedFiles={attachedFiles}
              onRemoveImage={() => setSelectedImage(null)}
              onRemoveCode={() => setPendingCode(null)}
              onRemoveFile={handleRemoveFile}
            />

            {/* Send Button */}
            <motion.button
              type="submit"
              disabled={(!input.trim() && !selectedImage && !pendingCode && attachedFiles.length === 0) || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line • Attach images, code, or files
          </p>
        </form>
      </motion.div>
    </div>
  )
}

