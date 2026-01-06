'use client'

import { motion } from 'framer-motion'
import { BookOpen, Video, Code, Globe, ExternalLink } from 'lucide-react'

interface ResourceRecommenderProps {
  techStack: string[]
}

const resourceMap: Record<string, any> = {
  'React': {
    docs: 'https://react.dev',
    tutorial: 'https://react.dev/learn',
    video: 'https://www.youtube.com/results?search_query=react+tutorial',
  },
  'Node.js': {
    docs: 'https://nodejs.org/docs',
    tutorial: 'https://nodejs.dev/learn',
    video: 'https://www.youtube.com/results?search_query=nodejs+tutorial',
  },
  'Python': {
    docs: 'https://docs.python.org',
    tutorial: 'https://docs.python.org/3/tutorial',
    video: 'https://www.youtube.com/results?search_query=python+tutorial',
  },
  'TypeScript': {
    docs: 'https://www.typescriptlang.org/docs',
    tutorial: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    video: 'https://www.youtube.com/results?search_query=typescript+tutorial',
  },
}

export default function ResourceRecommender({ techStack }: ResourceRecommenderProps) {
  if (!techStack || techStack.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50"
    >
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Learning Resources
        </h4>
      </div>

      <div className="space-y-2">
        {techStack.slice(0, 3).map((tech) => {
          const resources = resourceMap[tech]
          if (!resources) return null

          return (
            <div key={tech} className="space-y-1">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {tech}
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={resources.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  <span>Docs</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </a>
                <a
                  href={resources.tutorial}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
                >
                  <Code className="w-3 h-3" />
                  <span>Tutorial</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </a>
                <a
                  href={resources.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
                >
                  <Video className="w-3 h-3" />
                  <span>Videos</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

