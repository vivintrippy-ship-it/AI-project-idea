import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface StudentData {
  name: string
  major: string
  year: string
  interests: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, studentData, history, model: selectedModel } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      )
    }

    // Use the model selected by the user, default to gemini-2.5-flash
    const modelName = selectedModel || 'gemini-2.5-flash'
    const model = genAI.getGenerativeModel({ model: modelName })

    // Build context with student information
    const systemContext = `You are an expert AI assistant specializing in helping students find innovative project ideas. 

Student Profile:
- Name: ${studentData.name}
- Major: ${studentData.major}
- Academic Year: ${studentData.year}
- Interests & Skills: ${studentData.interests}

Your role is to:
1. Suggest creative, innovative project ideas tailored to the student's background
2. Provide detailed technical stack recommendations
3. Outline clear project objectives
4. Assign a novelty score (1-10) based on innovation and uniqueness
5. Estimate project difficulty (Beginner/Intermediate/Advanced)
6. Provide estimated completion time
7. Engage in helpful conversation about project planning and implementation

When suggesting a project, ALWAYS include it in this exact format at the end of your response:

PROJECT_DATA_START
{
  "title": "Project Title",
  "description": "Brief description",
  "techStack": ["Technology1", "Technology2", "Technology3"],
  "objectives": ["Objective 1", "Objective 2", "Objective 3"],
  "noveltyScore": 8,
  "difficulty": "Intermediate",
  "estimatedTime": "2-3 weeks"
}
PROJECT_DATA_END

Be enthusiastic, supportive, and educational. Help students understand why certain technologies are chosen and how they can learn them.`

    // Build conversation history
    const conversationHistory = history
      .slice(-6)
      .map((msg: Message) => `${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.content}`)
      .join('\n\n')

    const prompt = `${systemContext}

Previous Conversation:
${conversationHistory}

Student's Current Question: ${message}

Provide a helpful, detailed response. If suggesting a project, include the PROJECT_DATA format.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let responseText = response.text()

    // Extract project data if present
    let projectData = null
    const projectDataMatch = responseText.match(
      /PROJECT_DATA_START\s*(\{[\s\S]*?\})\s*PROJECT_DATA_END/
    )

    if (projectDataMatch) {
      try {
        projectData = JSON.parse(projectDataMatch[1])
        // Remove the project data block from the response text
        responseText = responseText
          .replace(/PROJECT_DATA_START[\s\S]*?PROJECT_DATA_END/, '')
          .trim()
      } catch (e) {
        console.error('Failed to parse project data:', e)
      }
    }

    return NextResponse.json({
      response: responseText,
      projectData,
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

