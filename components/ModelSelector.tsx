'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, Brain, Rocket } from 'lucide-react'

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

const models = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    icon: Zap,
    description: 'Fastest, great for quick responses',
    speed: 'Very Fast',
    quality: 'Good',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    icon: Brain,
    description: 'Most capable, detailed responses',
    speed: 'Moderate',
    quality: 'Excellent',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash',
    icon: Rocket,
    description: 'Latest experimental, cutting-edge',
    speed: 'Fast',
    quality: 'Very Good',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro',
    icon: Sparkles,
    description: 'Most advanced experimental model',
    speed: 'Slower',
    quality: 'Premium',
    color: 'from-indigo-500 to-purple-500',
  },
]

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          AI Model
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {models.map((model) => {
          const Icon = model.icon
          const isSelected = selectedModel === model.id

          return (
            <motion.button
              key={model.id}
              onClick={() => onModelChange(model.id)}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 shadow-xl backdrop-blur-sm'
                  : 'border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:border-purple-300 dark:hover:border-purple-600 backdrop-blur-sm shadow-md hover:shadow-lg'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full px-2 py-1 text-xs font-bold"
                >
                  Active
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${model.color} mb-2`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              {/* Model Name */}
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                {model.name}
              </h4>

              {/* Description */}
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {model.description}
              </p>

              {/* Stats */}
              <div className="flex gap-2 text-xs">
                <span
                  className={`px-2 py-1 rounded-full ${
                    isSelected
                      ? 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  ⚡ {model.speed}
                </span>
                <span
                  className={`px-2 py-1 rounded-full ${
                    isSelected
                      ? 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  ⭐ {model.quality}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Info Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3 flex items-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg backdrop-blur-sm shadow-sm"
      >
        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>Tip:</strong> Flash models are faster but Pro models provide more detailed
          and creative responses. Experimental models (Gemini 3) have the latest features!
        </p>
      </motion.div>
    </div>
  )
}

