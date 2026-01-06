'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, X, ExternalLink, Copy, Check } from 'lucide-react'
import ProjectCard from './ProjectCard'

interface SavedProject {
  id: string
  project: {
    title: string
    description: string
    techStack: string[]
    objectives: string[]
    noveltyScore: number
    difficulty: string
    estimatedTime: string
  }
  savedAt: Date
}

interface SavedProjectsProps {
  isOpen: boolean
  onClose: () => void
}

export default function SavedProjects({ isOpen, onClose }: SavedProjectsProps) {
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Load saved projects from localStorage
      const saved = localStorage.getItem('savedProjects')
      if (saved) {
        const projects = JSON.parse(saved)
        setSavedProjects(projects.map((p: any) => ({
          ...p,
          savedAt: new Date(p.savedAt)
        })))
      }
    }
  }, [isOpen])

  const handleRemove = (id: string) => {
    const updated = savedProjects.filter(p => p.id !== id)
    setSavedProjects(updated)
    localStorage.setItem('savedProjects', JSON.stringify(updated))
  }

  const handleCopy = (project: SavedProject) => {
    const text = `${project.project.title}\n\n${project.project.description}\n\nTech Stack: ${project.project.techStack.join(', ')}\n\nObjectives:\n${project.project.objectives.map(o => `- ${o}`).join('\n')}`
    navigator.clipboard.writeText(text)
    setCopiedId(project.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bookmark className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Saved Projects
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {savedProjects.length} {savedProjects.length === 1 ? 'project' : 'projects'} saved
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {savedProjects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <Bookmark className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No saved projects yet
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                    Bookmark projects from your conversations to access them later!
                  </p>
                </motion.div>
              ) : (
                savedProjects.map((saved, index) => (
                  <motion.div
                    key={saved.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <ProjectCard project={saved.project} />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCopy(saved)}
                        className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
                        title="Copy to clipboard"
                      >
                        {copiedId === saved.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemove(saved.id)}
                        className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
                        title="Remove from saved"
                      >
                        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </motion.button>
                    </div>

                    {/* Saved Date */}
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Saved {saved.savedAt.toLocaleDateString()} at {saved.savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

