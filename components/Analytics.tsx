'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, X, TrendingUp, Calendar, Code, Zap, Target, Clock, Award } from 'lucide-react'
import ProjectTimeline from './ProjectTimeline'

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

interface AnalyticsProps {
  messages: Message[]
}

export default function Analytics({ messages }: AnalyticsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const analytics = useMemo(() => {
    const projects = messages.filter(m => m.projectData).map(m => m.projectData!)
    
    if (projects.length === 0) {
      return {
        totalProjects: 0,
        avgNoveltyScore: 0,
        difficultyBreakdown: {},
        techStackCount: {},
        timeEstimates: {},
        noveltyDistribution: { low: 0, medium: 0, high: 0 },
        totalMessages: messages.length,
        projectsThisWeek: 0,
      }
    }

    // Calculate metrics
    const totalProjects = projects.length
    const avgNoveltyScore = projects.reduce((sum, p) => sum + p.noveltyScore, 0) / totalProjects

    // Difficulty breakdown
    const difficultyBreakdown: Record<string, number> = {}
    projects.forEach(p => {
      difficultyBreakdown[p.difficulty] = (difficultyBreakdown[p.difficulty] || 0) + 1
    })

    // Tech stack popularity
    const techStackCount: Record<string, number> = {}
    projects.forEach(p => {
      p.techStack.forEach(tech => {
        techStackCount[tech] = (techStackCount[tech] || 0) + 1
      })
    })

    // Time estimates
    const timeEstimates: Record<string, number> = {}
    projects.forEach(p => {
      timeEstimates[p.estimatedTime] = (timeEstimates[p.estimatedTime] || 0) + 1
    })

    // Novelty distribution
    const noveltyDistribution = {
      low: projects.filter(p => p.noveltyScore < 50).length,
      medium: projects.filter(p => p.noveltyScore >= 50 && p.noveltyScore < 75).length,
      high: projects.filter(p => p.noveltyScore >= 75).length,
    }

    // Projects this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const projectsThisWeek = projects.filter(p => {
      const msg = messages.find(m => m.projectData === p)
      return msg && msg.timestamp >= weekAgo
    }).length

    return {
      totalProjects,
      avgNoveltyScore: Math.round(avgNoveltyScore),
      difficultyBreakdown,
      techStackCount,
      timeEstimates,
      noveltyDistribution,
      totalMessages: messages.length,
      projectsThisWeek,
    }
  }, [messages])

  const topTechnologies = useMemo(() => {
    return Object.entries(analytics.techStackCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
  }, [analytics.techStackCount])

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="View Analytics"
      >
        <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </motion.button>

      {/* Analytics Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: '100%' }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Project Analytics
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your project generation insights
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {analytics.totalProjects === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No Analytics Yet
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Start chatting and generate some projects to see insights!
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total Projects
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {analytics.totalProjects}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Avg Novelty
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          {analytics.avgNoveltyScore}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200/50 dark:border-green-800/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            This Week
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {analytics.projectsThisWeek}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200/50 dark:border-orange-800/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total Messages
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                          {analytics.totalMessages}
                        </p>
                      </motion.div>
                    </div>

                    {/* Difficulty Distribution */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Projects by Difficulty
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(analytics.difficultyBreakdown).map(([difficulty, count], index) => {
                          const percentage = (count / analytics.totalProjects) * 100
                          const colors = {
                            Beginner: 'bg-green-500',
                            Intermediate: 'bg-yellow-500',
                            Advanced: 'bg-red-500',
                          }
                          return (
                            <div key={difficulty}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {difficulty}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {count} ({percentage.toFixed(0)}%)
                                </span>
                              </div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                  className={`h-full ${colors[difficulty as keyof typeof colors] || 'bg-blue-500'}`}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>

                    {/* Top Technologies */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Top Technologies
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {topTechnologies.map(([tech, count], index) => (
                          <motion.div
                            key={tech}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.05 }}
                            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200/50 dark:border-purple-800/50"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                                {tech}
                              </span>
                              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                {count}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Novelty Distribution */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        Novelty Score Distribution
                      </h3>
                      <div className="flex gap-4">
                        {[
                          { label: 'Low (0-49)', count: analytics.noveltyDistribution.low, color: 'from-red-500 to-orange-500' },
                          { label: 'Medium (50-74)', count: analytics.noveltyDistribution.medium, color: 'from-yellow-500 to-amber-500' },
                          { label: 'High (75-100)', count: analytics.noveltyDistribution.high, color: 'from-green-500 to-emerald-500' },
                        ].map((item, index) => {
                          const percentage = analytics.totalProjects > 0 
                            ? (item.count / analytics.totalProjects) * 100 
                            : 0
                          return (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 + index * 0.1 }}
                              className="flex-1"
                            >
                              <div className={`bg-gradient-to-br ${item.color} rounded-lg p-4 text-white`}>
                                <p className="text-2xl font-bold mb-1">{item.count}</p>
                                <p className="text-xs opacity-90">{item.label}</p>
                                <p className="text-sm font-semibold mt-1">{percentage.toFixed(0)}%</p>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </motion.div>

                    {/* Time Estimates */}
                    {Object.keys(analytics.timeEstimates).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                      >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                          Time Estimates
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(analytics.timeEstimates).map(([time, count]) => (
                            <motion.div
                              key={time}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.8 }}
                              className="px-4 py-2 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg border border-teal-200/50 dark:border-teal-800/50"
                            >
                              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                {time}
                              </span>
                              <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                                ({count})
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Project Timeline */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                    >
                      <ProjectTimeline messages={messages} />
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

