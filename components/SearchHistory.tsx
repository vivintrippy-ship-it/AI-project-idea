'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface SearchHistoryProps {
  messages: Message[]
  onSelectMessage: (messageId: string) => void
}

export default function SearchHistory({ messages, onSelectMessage }: SearchHistoryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = messages.filter(msg =>
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredMessages(filtered)
    } else {
      setFilteredMessages([])
    }
  }, [searchQuery, messages])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
        title="Search (⌘K)"
      >
        <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </motion.button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50 overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chat history..."
                    autoFocus
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto p-2">
                {searchQuery.trim() === '' ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Type to search your chat history</p>
                    <p className="text-xs mt-1 opacity-75">Press ⌘K or Ctrl+K to open</p>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No results found</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredMessages.map((msg) => (
                      <motion.button
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => {
                          onSelectMessage(msg.id)
                          setIsOpen(false)
                        }}
                        className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === 'user' 
                              ? 'bg-blue-600' 
                              : 'bg-green-600'
                          }`}>
                            <span className="text-xs text-white font-medium">
                              {msg.role === 'user' ? 'U' : 'AI'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:line-clamp-none">
                              {msg.content}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {msg.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{filteredMessages.length} result{filteredMessages.length !== 1 ? 's' : ''}</span>
                  <div className="flex gap-2">
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">ESC</kbd>
                    <span>to close</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

