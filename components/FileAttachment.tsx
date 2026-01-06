'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Paperclip, File, X, FileText, FileCode, FileImage } from 'lucide-react'

interface AttachedFile {
  name: string
  size: number
  type: string
  data: string
}

interface FileAttachmentProps {
  onFileAttach: (file: AttachedFile) => void
  attachedFiles: AttachedFile[]
  onRemoveFile: (index: number) => void
}

export default function FileAttachment({ onFileAttach, attachedFiles, onRemoveFile }: FileAttachmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
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

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return FileImage
    if (type.includes('text') || type.includes('json') || type.includes('xml')) return FileText
    if (type.includes('javascript') || type.includes('typescript') || type.includes('python')) return FileCode
    return File
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="file-attachment"
        accept=".txt,.pdf,.doc,.docx,.json,.csv,.md,.code,.js,.ts,.py,.java,.cpp,.html,.css"
      />

      {/* Attach Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Attach File"
      >
        <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </motion.button>

      {/* Attached Files List */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {attachedFiles.map((file, index) => {
            const FileIcon = getFileIcon(file.type)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <FileIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white truncate max-w-[150px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemoveFile(index)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

