export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
}

export interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  completed: boolean;
}

// Study Planner Schedule Generator (Runs locally and algorithmically)
export const generatePlannerSchedule = (subjects: string[], examDate: string, dailyHours: number): StudyTask[] => {
  const today = new Date();
  const targetDate = new Date(examDate);
  
  // Calculate days difference
  const diffTime = Math.abs(targetDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Default to 7 days if date is invalid or in the past
  const scheduleDays = isNaN(diffDays) || diffDays <= 0 ? 7 : Math.min(diffDays, 14); // plan up to 14 days
  
  const timeSlots = [
    { time: "09:00", duration: 60 },
    { time: "11:00", duration: 90 },
    { time: "14:00", duration: 60 },
    { time: "16:00", duration: 120 }
  ];

  const subtopics: Record<string, string[]> = {
    "math": ["Linear Algebra", "Calculus & Limits", "Probability Distributions", "Trigonometric Identites", "Differential Equations"],
    "biology": ["Cell Respiration", "Genetics & Punnett Squares", "Ecosystem Dynamics", "Human Anatomy", "Plant Reproduction"],
    "chemistry": ["Stoichiometry", "Chemical Equilibrium", "Organic Chemistry", "Periodic Table Trends", "Acid-Base Reactions"],
    "physics": ["Kinematics", "Electromagnetism", "Thermodynamics", "Wave Optics", "Newtonian Mechanics"],
    "history": ["World War Alliance Systems", "The Industrial Revolution", "Cold War Containment", "Ancient Civilizations", "Decolonization Era"],
    "english": ["Literary Devices", "Essay Thesis Building", "Grammatical Syntax", "Shakespearean Sonnets", "Rhetorical Devices"]
  };

  const tasks: StudyTask[] = [];
  
  for (let i = 0; i < scheduleDays; i++) {
    const currentDay = new Date(today);
    currentDay.setDate(today.getDate() + i);
    const dateString = currentDay.toISOString().split('T')[0];
    
    // Choose number of slots based on dailyHours
    const activeSlots = dailyHours <= 2 ? 1 : dailyHours <= 4 ? 2 : 3;
    
    for (let s = 0; s < activeSlots; s++) {
      const subjectIndex = (i * activeSlots + s) % subjects.length;
      const subject = subjects[subjectIndex];
      
      const cleanSubjectKey = subject.toLowerCase();
      const subjectSubtopics = subtopics[cleanSubjectKey] || [
        "Core Concepts Review", "Past Year Questions", "Flashcards Mastery", "Practice Exercises", "Formula Sheet Summary"
      ];
      const topicIndex = (i + s) % subjectSubtopics.length;
      const topic = subjectSubtopics[topicIndex];
      
      const slot = timeSlots[s % timeSlots.length];
      
      tasks.push({
        id: `task-${i}-${s}-${Math.random().toString(36).substr(2, 4)}`,
        subject: subject,
        topic: topic,
        date: dateString,
        time: slot.time,
        duration: slot.duration,
        completed: false
      });
    }
  }

  return tasks;
};
