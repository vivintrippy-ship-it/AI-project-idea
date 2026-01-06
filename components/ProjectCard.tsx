'use client'

import { motion } from 'framer-motion'
import { Code, Target, Clock, Star, TrendingUp } from 'lucide-react'

interface ProjectCardProps {
  project: {
    title: string
    description: string
    techStack: string[]
    objectives: string[]
    noveltyScore: number
    difficulty: string
    estimatedTime: string
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getNoveltyColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400'
    if (score >= 6) return 'text-blue-600 dark:text-blue-400'
    if (score >= 4) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-orange-600 dark:text-orange-400'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-white/90 via-blue-50/50 to-purple-50/50 dark:from-gray-800/90 dark:via-blue-900/20 dark:to-purple-900/20 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden backdrop-blur-sm relative"
      style={{
        boxShadow: '0 10px 40px 0 rgba(31, 38, 135, 0.2)',
      }}
    >
      {/* Animated glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header with Novelty Score */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
              {project.title}
            </h3>
            <p className="text-blue-100 text-sm drop-shadow">{project.description}</p>
          </div>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 ml-4"
          >
            <Star className="w-6 h-6 text-yellow-500 mb-1" />
            <span className={`text-2xl font-bold ${getNoveltyColor(project.noveltyScore)}`}>
              {project.noveltyScore}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Novelty
            </span>
          </motion.div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Difficulty and Time */}
        <div className="flex gap-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`px-4 py-2 rounded-xl font-semibold text-sm ${getDifficultyColor(
              project.difficulty
            )}`}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            {project.difficulty}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="px-4 py-2 rounded-xl bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 font-semibold text-sm"
          >
            <Clock className="w-4 h-4 inline mr-1" />
            {project.estimatedTime}
          </motion.div>
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Tech Stack
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium shadow-md"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Key Objectives
            </h4>
          </div>
          <ul className="space-y-2">
            {project.objectives.map((objective, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
              >
                <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2" />
                <span>{objective}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          💡 Ready to start building? Ask me for more details or implementation guidance!
        </p>
      </motion.div>
    </motion.div>
  )
}

