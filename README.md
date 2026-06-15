# 🎓 StudyHelper.ai

StudyHelper.ai is a premium, AI-powered study companion and productivity suite designed to revolutionize the way students learn, organize, and excel in their academic journeys. By integrating **Google Gemini AI** (`gemini-2.5-flash`), StudyHelper.ai provides real-time intelligent solvers, dynamic note summarization, interactive flashcards, customizable quizzes, and algorithmic study schedules—all wrapped in a highly-polished, responsive user interface with complete dark mode support.

---

## ✨ Key Features

### 📊 Interactive Analytics Dashboard
* **Dynamic Study Tracker:** Monitor study metrics including total study minutes, completed tasks, generated quizzes, solved questions, and notes summarized.
* **Progress Analytics:** Visual charts using **Recharts** displaying quiz performance scores and study consistency.
* **Activity Feed:** Chronological history of recent studies, generated materials, and planner achievements.
* **Daily Agenda:** A focused checklist showing tasks slated for today, directly syncable to study stats.

### 🤖 AI Step-by-Step Solver
* **Intelligent Explanations:** Type any academic question or math problem, select your learning tier (**Beginner**, **School**, or **College**), and get step-by-step guides powered by Gemini.
* **Tiered Explanations:** Tailored language complexity matching the user's educational stage.

### 📄 Notes Summarizer & Flashcards (with OCR)
* **Smart Summaries:** Paste long lecture transcripts, reading files, or notes to get core takeaway bullet lists.
* **Photo Upload / OCR:** Upload an image of handwritten notes or textbook pages. The application encodes the file into Base64 and sends it directly to Gemini for visual text extraction and summarization.
* **Interactive Flashcards:** Automatically generates flippable flashcards with active recall mechanics ("Mastered" vs "Needs Review") to build and test retention.

### ✍️ AI Quiz Generator
* **Topic-Based Quizzing:** Enter any topic (e.g., *Cellular Respiration*, *French Revolution*, *Quantum Physics*) and define the number of questions to get a customized multiple-choice test.
* **Instant Feedbacks:** Real-time marking with visual explanations for why the selected answer is correct or incorrect.
* **Score Integration:** Automatical sync of scores and completion indicators back to the user's stats dashboard.

### 📅 Algorithmic Study Planner
* **Dynamic Schedules:** Set your target subjects, daily study duration, and the date of your upcoming exam. The helper automatically drafts a day-by-day study schedule with customizable time slots.
* **Completion Checklist:** Check off scheduled blocks as they are completed to log study minutes and build up streaks.

### ⚙️ Secure Settings & Customization
* **Personalized profile:** Customize your name, email, and academic major.
* **Gemini API Integration:** Easily input your Gemini API Key directly within the app (stored securely in local browser storage) or configure it via environments.
* **Theme Switching:** Sleek transitions between Light Mode and a deep HSL-tailored Dark Mode.
* **Reset Sandbox:** Option to wipe learning history and start clean.

---

## 🛠️ Technology Stack

* **Core Framework:** React 19, TypeScript, Vite
* **Styling:** Tailwind CSS (utility-first styling, grid layouts, glassmorphic card patterns, custom transition utilities)
* **Icons:** Lucide React (feather-light, crisp vector icons)
* **Data Visualization:** Recharts (responsive vector area and bar graphs for progress logs)
* **AI Model:** Google Gemini API (`gemini-2.5-flash:generateContent`)
* **State & Caching:** React hooks + **LocalStorage** persistence for session-resilient client-side storage (zero database setup required).

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18 or higher) and **npm** installed on your local environment.

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd ai-study-helper
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
To use the AI features, you need a Google Gemini API Key. You can obtain one from the [Google AI Studio](https://aistudio.google.com/).

Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note:** Alternatively, you can run the application directly and input your key in the **Settings** panel within the user interface. This key is saved locally in your browser's secure cache.

### 4. Run Development Server
```bash
npm run dev
```
The server will boot up, typically accessible at [http://localhost:5173/](http://localhost:5173/).

### 5. Build for Production
```bash
npm run build
```
This generates a static production bundle in the `dist` folder, ready to be deployed to static hosting providers (Netlify, Vercel, Firebase Hosting, Github Pages, etc.).

---

## 📂 Project Structure

```
ai-study-helper/
├── public/                 # Static assets (favicons, manifest)
├── src/
│   ├── assets/             # Images, SVGs
│   ├── components/         # Reusable presentation and UI components
│   │   ├── AISolver.tsx         # Academic solver component
│   │   ├── Dashboard.tsx        # Analytics overview, charts, and activities
│   │   ├── LandingPage.tsx      # Welcome landing viewport and CTAs
│   │   ├── Login.tsx            # Login panel layout
│   │   ├── Signup.tsx           # Account registration panel
│   │   ├── NotesSummarizer.tsx  # Summarization, OCR upload, and flashcards deck
│   │   ├── QuizGenerator.tsx    # Multiple-choice quiz generator
│   │   ├── Settings.tsx         # User profiles, keys, theme triggers
│   │   ├── Sidebar.tsx          # Nav links, dark mode toggle, and logout button
│   │   └── StudyPlanner.tsx     # Calendar, scheduling algorithms
│   ├── services/           # Backend adapters and mocks
│   │   ├── ai.ts                # Gemini API adapter & fetch endpoints
│   │   └── mockData.ts          # Planner calculators & schemas
│   ├── App.tsx             # Main router state machine and localStorage sync
│   ├── index.css           # Global typography, color schemes, and animations
│   └── main.tsx            # App entry point
├── package.json            # Configuration and script tasks
├── tailwind.config.js      # Styling configuration, color themes
└── vite.config.ts          # Vite configuration
```

---

## 🔒 Security & Privacy

* **Direct API Calls:** Your Gemini API Key is communicated *directly* from your browser to Google's generative language servers. No proxy servers, databases, or third-party loggers are used.
* **Offline-First Storage:** User statistics, notes, planners, and quiz marks are saved inside your browser's private `localStorage`. Your academic data never leaves your device unless you choose to clear it.
