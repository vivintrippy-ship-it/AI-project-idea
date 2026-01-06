'use client'

import { useState } from 'react'
import WelcomeScreen from '@/components/WelcomeScreen'
import ChatInterface from '@/components/ChatInterface'

export default function Home() {
  const [studentData, setStudentData] = useState<{
    name: string
    major: string
    year: string
    interests: string
  } | null>(null)

  const handleStudentSubmit = (data: {
    name: string
    major: string
    year: string
    interests: string
  }) => {
    setStudentData(data)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400/10 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10">
        {!studentData ? (
          <WelcomeScreen onSubmit={handleStudentSubmit} />
        ) : (
          <ChatInterface studentData={studentData} />
        )}
      </div>
    </main>
  )
}

