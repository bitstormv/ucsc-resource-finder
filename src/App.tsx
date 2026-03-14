/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Code, 
  GraduationCap, 
  MapPin, 
  ExternalLink, 
  Trophy, 
  Timer, 
  RotateCcw, 
  Play,
  ChevronRight,
  LayoutDashboard,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RESOURCES, QUIZ_QUESTIONS } from './data';
import { Resource, Question } from './types';
import StudyResources from './StudyResources';
import CoverSlideshow from './CoverSlideshow';

// --- Components ---

const NAV_ITEMS = [
  { id: 'Study', label: 'Study Resources' },
  { id: 'Coding', label: 'Coding Sites' },
  { id: 'Scholarship', label: 'Scholarships' },
  { id: 'Map', label: 'UCSC Places (Map)' },
  { id: 'Quiz', label: 'Quiz Game' }
];

const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  isDarkMode, 
  toggleDarkMode 
}: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  isDarkMode: boolean,
  toggleDarkMode: () => void
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 overflow-x-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-max gap-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center p-1 bg-white rounded-lg h-10 w-auto">
            <img 
              src="https://d1hbpr09pwz0sk.cloudfront.net/logo_url/university-of-colombo-school-of-computing-4b0e5840" 
              alt="UCSC Logo" 
              className="h-full object-contain" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">UCSC Resource Finder</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl gap-1 transition-colors duration-300">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === item.id 
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Study': return <BookOpen className="w-5 h-5" />;
      case 'Coding': return <Code className="w-5 h-5" />;
      case 'Scholarship': return <GraduationCap className="w-5 h-5" />;
      case 'Campus': return <MapPin className="w-5 h-5" />;
      default: return <LayoutDashboard className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Study': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Coding': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Scholarship': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Campus': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl border ${getCategoryColor(resource.category)} dark:bg-opacity-10 dark:border-opacity-20`}>
          {getIcon(resource.category)}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getCategoryColor(resource.category)} dark:bg-opacity-10 dark:border-opacity-20`}>
          {resource.category}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {resource.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">
        {resource.description}
      </p>
      <a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        Visit Resource <ExternalLink className="w-4 h-4" />
      </a>
    </motion.div>
  );
};

const ResourceHub = ({ category }: { category: string }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = useMemo(() => {
    return RESOURCES.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           res.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = res.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, category]);

  const getCategoryTitle = () => {
    switch(category) {
      case 'Study': return 'Study Resources';
      case 'Coding': return 'Coding Sites';
      case 'Scholarship': return 'Scholarships';
      default: return 'Resources';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden mb-12 shadow-lg">
        <CoverSlideshow />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col items-center justify-end text-center px-4 pb-12 z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
            Explore <span className="text-blue-400">{getCategoryTitle()}</span>
          </h1>
          <p className="text-slate-200 max-w-2xl mx-auto text-lg drop-shadow">
            Curated tools and guides to help you excel in your university journey.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
        <div className="relative w-full md:max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${getCategoryTitle().toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredResources.map(res => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredResources.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
            <Search className="text-slate-400 dark:text-slate-500 w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No resources found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
};

const QuizGame = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0 && !isAnswered) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1); // Time's up
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, isAnswered]);

  const startQuiz = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    if (optionIndex === QUIZ_QUESTIONS[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(30);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setGameState('result');
      }
    }, 1500);
  };

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  if (gameState === 'start') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 rounded-3xl p-12 shadow-xl"
        >
          <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Trophy className="text-blue-600 w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Ready to Test Your <span className="text-blue-600">Knowledge?</span>
          </h1>
          <p className="text-slate-600 mb-10 text-lg">
            Challenge yourself with our Computer Science and Web Development quiz. 
            You have 30 seconds per question. Good luck!
          </p>
          <button
            onClick={startQuiz}
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:-translate-y-1"
          >
            Start Quiz <Play className="w-5 h-5 fill-current" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-3xl p-12 shadow-xl"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Quiz Completed!</h2>
          <p className="text-slate-500 mb-8">Here's how you performed:</p>
          
          <div className="bg-slate-50 rounded-2xl p-8 mb-10">
            <div className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-2">Final Score</div>
            <div className="text-6xl font-black text-blue-600">
              {score} <span className="text-slate-300 text-3xl">/ {QUIZ_QUESTIONS.length}</span>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-1"
          >
            Restart Quiz <RotateCcw className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
            <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`} />
            <span className={`font-mono font-bold text-lg ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-700'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
          </div>
        </div>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold">
          Score: {score}
        </div>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full mb-12 overflow-hidden">
        <motion.div 
          className="bg-blue-600 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10 leading-tight">
          {currentQuestion.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = "w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ";
            
            if (!isAnswered) {
              buttonClass += "border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 text-slate-700 font-medium";
            } else {
              if (index === currentQuestion.correctAnswer) {
                buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold";
              } else if (index === selectedOption) {
                buttonClass += "border-red-500 bg-red-50 text-red-700 font-bold";
              } else {
                buttonClass += "border-slate-100 text-slate-400 opacity-50";
              }
            }

            return (
              <button
                key={index}
                disabled={isAnswered}
                onClick={() => handleAnswer(index)}
                className={buttonClass}
              >
                <span>{option}</span>
                {!isAnswered ? (
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                ) : (
                  index === currentQuestion.correctAnswer && <Trophy className="w-5 h-5 text-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

const UCSCMap = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          UCSC <span className="text-blue-600">Places</span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Find your way around the University of Colombo School of Computing campus.
        </p>
      </div>
      <div className="bg-white p-2 md:p-4 rounded-3xl shadow-sm border border-slate-200 h-[600px] w-full overflow-hidden">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9029323036134!2d79.85896427499632!3d6.902205493096695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25963120b1509%3A0x2db2c18a68712863!2sUniversity%20of%20Colombo%20School%20of%20Computing%20(UCSC)!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
          width="100%" 
          height="100%" 
          style={{ border: 0, borderRadius: '1rem' }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Study');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const renderContent = () => {
    switch (activeTab) {
      case 'Study':
        return <StudyResources />;
      case 'Coding':
      case 'Scholarship':
        return <ResourceHub category={activeTab} />;
      case 'Map':
        return <UCSCMap />;
      case 'Quiz':
        return <QuizGame />;
      default:
        return <StudyResources />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 opacity-70">
            <img 
              src="https://d1hbpr09pwz0sk.cloudfront.net/logo_url/university-of-colombo-school-of-computing-4b0e5840" 
              alt="UCSC Logo" 
              className="h-6 w-auto grayscale dark:invert" 
              referrerPolicy="no-referrer" 
            />
            <span className="font-bold tracking-tight text-slate-600 dark:text-slate-400">UCSC Resource Finder</span>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} UCSC Resource Finder. Empowering students through knowledge.
          </p>
        </div>
      </footer>
    </div>
  );
}
