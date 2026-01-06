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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Subtle Apple-style background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
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

