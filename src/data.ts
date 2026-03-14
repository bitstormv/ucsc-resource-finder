import { Resource, Question } from './types';

export const RESOURCES: Resource[] = [
  {
    id: '1',
    category: 'Coding',
    title: 'MDN Web Docs',
    description: 'The definitive resource for web developers. Documentation for HTML, CSS, and JavaScript.',
    link: 'https://developer.mozilla.org'
  },
  {
    id: '2',
    category: 'Study',
    title: 'Khan Academy',
    description: 'Free online courses, lessons and practice for various subjects including math and science.',
    link: 'https://www.khanacademy.org'
  },
  {
    id: '3',
    category: 'Scholarship',
    title: 'Fastweb',
    description: 'A leading scholarship search provider with access to over 1.5 million scholarships.',
    link: 'https://www.fastweb.com'
  },
  {
    id: '4',
    category: 'Campus',
    title: 'Student Beans',
    description: 'Student discount platform offering deals on tech, fashion, and food.',
    link: 'https://www.studentbeans.com'
  },
  {
    id: '5',
    category: 'Coding',
    title: 'freeCodeCamp',
    description: 'Learn to code for free with interactive tutorials and certifications.',
    link: 'https://www.freecodecamp.org'
  },
  {
    id: '6',
    category: 'Study',
    title: 'Wolfram Alpha',
    description: 'Computational intelligence engine for solving complex math and science problems.',
    link: 'https://www.wolframalpha.com'
  },
  {
    id: '7',
    category: 'Coding',
    title: 'LeetCode',
    description: 'Platform for practicing coding interviews and improving algorithmic skills.',
    link: 'https://leetcode.com'
  },
  {
    id: '8',
    category: 'Scholarship',
    title: 'Scholarships.com',
    description: 'Search for scholarships and grants to help pay for college.',
    link: 'https://www.scholarships.com'
  }
];

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'What does HTML stand for?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Hyperlink and Text Management Language',
      'Home Tool Markup Language'
    ],
    correctAnswer: 0
  },
  {
    id: 'q2',
    question: 'Which CSS property is used to change the text color of an element?',
    options: [
      'font-color',
      'text-style',
      'color',
      'background-color'
    ],
    correctAnswer: 2
  },
  {
    id: 'q3',
    question: 'What is the correct way to write a JavaScript array?',
    options: [
      'var colors = "red", "green", "blue"',
      'var colors = (1:"red", 2:"green", 3:"blue")',
      'var colors = ["red", "green", "blue"]',
      'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")'
    ],
    correctAnswer: 2
  },
  {
    id: 'q4',
    question: 'Which of the following is NOT a JavaScript framework or library?',
    options: [
      'React',
      'Vue',
      'Django',
      'Angular'
    ],
    correctAnswer: 2
  },
  {
    id: 'q5',
    question: 'What does CSS stand for?',
    options: [
      'Creative Style Sheets',
      'Cascading Style Sheets',
      'Computer Style Sheets',
      'Colorful Style Sheets'
    ],
    correctAnswer: 1
  },
  {
    id: 'q6',
    question: 'In computer science, what is the time complexity of a binary search algorithm?',
    options: [
      'O(n)',
      'O(n^2)',
      'O(log n)',
      'O(1)'
    ],
    correctAnswer: 2
  },
  {
    id: 'q7',
    question: 'Which HTTP status code represents "Not Found"?',
    options: [
      '200',
      '404',
      '500',
      '403'
    ],
    correctAnswer: 1
  }
];
