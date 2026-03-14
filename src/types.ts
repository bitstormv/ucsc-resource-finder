export interface Resource {
  id: string;
  category: 'Study' | 'Coding' | 'Scholarship' | 'Campus';
  title: string;
  description: string;
  link: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}
