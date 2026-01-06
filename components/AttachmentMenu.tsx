'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Paperclip, Image as ImageIcon, Code, File, X } from 'lucide-react'
import CodeSnippet from './CodeSnippet'

interface AttachedFile {
  name: string
  size: number
  type: string
  data: string
}

interface AttachmentMenuProps {
  onImageSelect: (imageData: string) => void
  onCodeAdd: (code: string, language: string) => void
  onFileAttach: (file: AttachedFile) => void
  selectedImage: string | null
  pendingCode: { code: string; language: string } | null
  attachedFiles: AttachedFile[]
  onRemoveImage: () => void
  onRemoveCode: () => void
  onRemoveFile: (index: number) => void
}

export default function AttachmentMenu({
  onImageSelect,
  onCodeAdd,
  onFileAttach,
  selectedImage,
  pendingCode,
  attachedFiles,
  onRemoveImage,
  onRemoveCode,
  onRemoveFile,
}: AttachmentMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleImageClick = () => {
    fileInputRef.current?.click()
    setIsOpen(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onImageSelect(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        onFileAttach({
          name: file.name,
          size: file.size,
          type: file.type,
          data: reader.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
    if (documentInputRef.current) {
      documentInputRef.current.value = ''
    }
    setIsOpen(false)
  }

  const handleDocumentClick = () => {
    documentInputRef.current?.click()
    setIsOpen(false)
  }

  const hasAttachments = selectedImage || pendingCode || attachedFiles.length > 0

  return (
    <div className="relative" ref={menuRef}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <input
        ref={documentInputRef}
        type="file"
        accept=".txt,.pdf,.doc,.docx,.json,.csv,.md,.js,.ts,.py,.java,.cpp,.html,.css"
        onChange={handleDocumentChange}
        className="hidden"
      />

      {/* Pin Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-colors relative ${
          hasAttachments
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}
        title="Attach files"
      >
        <Paperclip className="w-5 h-5" />
        {hasAttachments && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center">
            {(selectedImage ? 1 : 0) + (pendingCode ? 1 : 0) + attachedFiles.length}
          </span>
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-50"
          >
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Attach to message
              </p>

              {/* Image Upload Option */}
              <motion.button
                type="button"
                whileHover={{ x: 4 }}
                onClick={handleImageClick}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Image
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </motion.button>

              {/* Code Snippet Option */}
              <div className="w-full">
                <motion.button
                  type="button"
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    setShowCodeModal(true)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Code Snippet
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Add formatted code
                    </p>
                  </div>
                </motion.button>
              </div>

              {/* File Attachment Option */}
              <motion.button
                type="button"
                whileHover={{ x: 4 }}
                onClick={handleDocumentClick}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                  <File className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    File
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOC, TXT up to 5MB
                  </p>
                </div>
              </motion.button>
            </div>

            {/* Current Attachments */}
            {hasAttachments && (
              <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-2 bg-gray-50/50 dark:bg-gray-800/50">
                <p className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Attached ({(selectedImage ? 1 : 0) + (pendingCode ? 1 : 0) + attachedFiles.length})
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedImage && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800">
                      <ImageIcon className="w-4 h-4 text-pink-600" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 flex-1">
                        Image attached
                      </span>
                      <button
                        type="button"
                        onClick={onRemoveImage}
                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <X className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  )}
                  {pendingCode && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800">
                      <Code className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 flex-1">
                        {pendingCode.language}
                      </span>
                      <button
                        type="button"
                        onClick={onRemoveCode}
                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <X className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  )}
                  {attachedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800"
                    >
                      <File className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 flex-1 truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveFile(idx)}
                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <X className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Snippet Modal */}
      {showCodeModal && (
        <CodeSnippet
          onCodeAdd={(code, lang) => {
            onCodeAdd(code, lang)
            setShowCodeModal(false)
          }}
        />
      )}
    </div>
  )
}

