# 🎓 Student Project Idea Generator

An enterprise-level AI-powered web application that helps students discover innovative project ideas with personalized tech stack recommendations, objectives, and novelty scoring.

## ✨ Features

- **🤖 AI-Powered Suggestions**: Integrated with Google Gemini API for intelligent project recommendations
- **💬 ChatGPT-like Interface**: Interactive chat assistant for seamless conversation
- **🎯 Personalized Recommendations**: Tailored suggestions based on student's major, year, and interests
- **📊 Novelty Scoring**: Each project rated on innovation and uniqueness (1-10 scale)
- **🛠️ Tech Stack Recommendations**: Detailed technology suggestions for each project
- **📈 Difficulty Assessment**: Projects categorized by complexity level
- **⏱️ Time Estimation**: Realistic completion timeframes
- **🎨 Beautiful UI**: Modern, clean interface with smooth animations
- **🌓 Dark Mode**: Automatic dark mode support
- **📱 Responsive Design**: Works perfectly on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone or download this project**

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_actual_google_gemini_api_key_here
```

4. **Run the development server:**

```bash
npm run dev
```

5. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: Google Gemini API
- **Icons**: Lucide React
- **Markdown**: React Markdown with GitHub Flavored Markdown

## 📁 Project Structure

```
student-project-idea-generator/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Gemini API integration
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page
│   └── globals.css               # Global styles
├── components/
│   ├── WelcomeScreen.tsx         # Student details collection
│   ├── ChatInterface.tsx         # Chat UI
│   ├── ProjectCard.tsx           # Project display card
│   └── LoadingDots.tsx           # Loading animation
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🎯 How It Works

1. **Welcome Screen**: Students enter their details (name, major, year, interests)
2. **Chat Interface**: AI assistant greets the student and offers help
3. **Project Suggestions**: Students ask for project ideas based on their interests
4. **Detailed Cards**: Projects displayed with:
   - Title and description
   - Tech stack with visual tags
   - Key objectives
   - Novelty score (1-10)
   - Difficulty level
   - Estimated completion time
5. **Continued Conversation**: Students can ask follow-up questions, request modifications, or explore different ideas

## 🎨 UI Features

- **Smooth Animations**: Framer Motion for fluid transitions
- **Loading States**: Beautiful loading indicators during AI processing
- **Gradient Backgrounds**: Modern gradient designs
- **Responsive Layout**: Mobile-first design approach
- **Accessible**: Follows web accessibility guidelines
- **Custom Scrollbars**: Styled scrollbars for better aesthetics

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## 📝 Usage Examples

### Example Prompts:

- "Suggest a machine learning project for me"
- "I want to build something with web development"
- "Show me an IoT project idea"
- "What's a good beginner project for mobile development?"
- "Give me an advanced AI project"

## 🛠️ Development

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Run linter:
```bash
npm run lint
```

## 🌟 Key Components

### WelcomeScreen
- Animated greeting interface
- Form validation
- Smooth transitions to chat interface

### ChatInterface
- Real-time message streaming
- History management
- Responsive message layout
- Loading indicators

### ProjectCard
- Dynamic color coding based on difficulty
- Animated reveal of project details
- Tech stack visualization
- Novelty score display with visual feedback

## 🎓 Educational Value

This application helps students by:
- Discovering project ideas aligned with their interests
- Understanding modern tech stacks
- Learning about project complexity
- Getting implementation guidance
- Building portfolio-worthy projects

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Vercel for Next.js framework
- Tailwind CSS for styling system
- Framer Motion for animations

---

**Made with ❤️ for students by students**

Need help? The AI assistant is always ready to guide you! 🚀

# AI-project-idea
