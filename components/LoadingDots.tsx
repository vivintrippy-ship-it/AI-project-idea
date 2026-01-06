'use client'

import { motion } from 'framer-motion'

export default function LoadingDots() {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
        AI is thinking
      </span>
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
            animate={{
              y: [-3, 3, -3],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}

