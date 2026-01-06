'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  timestamp: Date
  projectData?: {
    title: string
    noveltyScore: number
    difficulty: string
  }
}

interface ProjectTimelineProps {
  messages: Message[]
}

export default function ProjectTimeline({ messages }: ProjectTimelineProps) {
  const timelineData = useMemo(() => {
    const projects = messages
      .filter(m => m.projectData)
      .map(m => ({
        title: m.projectData!.title,
        timestamp: m.timestamp,
        noveltyScore: m.projectData!.noveltyScore,
        difficulty: m.projectData!.difficulty,
      }))

    // Group by day
    const grouped = projects.reduce((acc, project) => {
      const date = new Date(project.timestamp).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(project)
      return acc
    }, {} as Record<string, typeof projects>)

    return Object.entries(grouped).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    ).slice(0, 7) // Last 7 days with activity
  }, [messages])

  if (timelineData.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No projects generated yet
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Project Timeline
        </h3>
      </div>

      <div className="space-y-4">
        {timelineData.map(([date, projects], dayIndex) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: dayIndex * 0.1 }}
            className="relative"
          >
            {/* Date Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {date}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {projects.length} project{projects.length !== 1 ? 's' : ''} generated
                </p>
              </div>
            </div>

            {/* Projects for this day */}
            <div className="ml-6 space-y-2">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dayIndex * 0.1 + index * 0.05 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {project.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          project.difficulty === 'Beginner' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : project.difficulty === 'Intermediate'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {project.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(project.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          {project.noveltyScore}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        novelty
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

