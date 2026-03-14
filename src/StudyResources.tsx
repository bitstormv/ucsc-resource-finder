import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  FileArchive, 
  PlayCircle, 
  Book, 
  Star, 
  MessageSquare, 
  Send, 
  ThumbsUp,
  ExternalLink,
  Search,
  X,
  Download
} from 'lucide-react';
import CoverSlideshow from './CoverSlideshow';

type SubCategory = 'All' | 'Lecture Notes' | 'Past Papers' | 'Tutorial Videos' | 'Reference Books';

interface StudyItem {
  id: string;
  title: string;
  description: string;
  type: Exclude<SubCategory, 'All'>;
  link: string;
  rating: number;
  reviews: number;
}

const STUDY_ITEMS: StudyItem[] = [
  {
    id: 's1',
    title: 'Data Structures & Algorithms Notes',
    description: 'Comprehensive lecture notes covering arrays, trees, graphs, and dynamic programming.',
    type: 'Lecture Notes',
    link: '#',
    rating: 4.8,
    reviews: 124
  },
  {
    id: 's2',
    title: '2025 Mid-Semester Past Paper (CS101)',
    description: 'Previous year mid-semester exam with detailed solutions and marking scheme.',
    type: 'Past Papers',
    link: '#',
    rating: 4.5,
    reviews: 89
  },
  {
    id: 's3',
    title: 'React.js Crash Course',
    description: 'A 2-hour video tutorial covering React fundamentals, hooks, and state management.',
    type: 'Tutorial Videos',
    link: '#',
    rating: 4.9,
    reviews: 342
  },
  {
    id: 's4',
    title: 'Clean Code by Robert C. Martin',
    description: 'A Handbook of Agile Software Craftsmanship. Essential reading for developers.',
    type: 'Reference Books',
    link: '#',
    rating: 4.7,
    reviews: 512
  },
  {
    id: 's5',
    title: 'Database Management Systems (CS202)',
    description: 'Lecture slides on SQL, normalization, and transaction management.',
    type: 'Lecture Notes',
    link: '#',
    rating: 4.2,
    reviews: 56
  },
  {
    id: 's6',
    title: 'Calculus II Final Exam 2024',
    description: 'Past paper for Calculus II including integration techniques and series.',
    type: 'Past Papers',
    link: '#',
    rating: 4.6,
    reviews: 112
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case 'Lecture Notes': return <FileText className="w-5 h-5" />;
    case 'Past Papers': return <FileArchive className="w-5 h-5" />;
    case 'Tutorial Videos': return <PlayCircle className="w-5 h-5" />;
    case 'Reference Books': return <Book className="w-5 h-5" />;
    default: return <FileText className="w-5 h-5" />;
  }
};

const getColor = (type: string) => {
  switch (type) {
    case 'Lecture Notes': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Past Papers': return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'Tutorial Videos': return 'bg-rose-50 text-rose-600 border-rose-100';
    case 'Reference Books': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

const StudyCard = ({ item, onSelect }: { item: StudyItem, onSelect: (item: StudyItem) => void }) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all flex flex-col h-full group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl border ${getColor(item.type)} dark:bg-opacity-10 dark:border-opacity-20`}>
          {getIcon(item.type)}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getColor(item.type)} dark:bg-opacity-10 dark:border-opacity-20`}>
          {item.type}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {item.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
        {item.description}
      </p>
      
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Rate this resource:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setUserRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-4 h-4 ${
                      (hoverRating || userRating || 0) >= star 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-300'
                    }`} 
                  />
                </button>
              ))}
              <span className="text-xs text-slate-500 ml-2">
                ({item.rating} avg • {item.reviews + (userRating ? 1 : 0)} reviews)
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onSelect(item)}
          className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 py-2.5 rounded-xl transition-colors"
        >
          Access Resource <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default function StudyResources() {
  const [activeTab, setActiveTab] = useState<SubCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<StudyItem | null>(null);
  
  // Student Hub State
  const [feedback, setFeedback] = useState('');
  const [question, setQuestion] = useState('');
  const [qaList, setQaList] = useState([
    { id: 1, q: "Where can I find the syllabus for CS101?", a: "It's usually uploaded on the university LMS under the course overview section.", upvotes: 12 },
    { id: 2, q: "Are the past papers here updated for 2025?", a: "Yes, the 2025 mid-semester papers were just added last week.", upvotes: 8 }
  ]);

  const tabs: SubCategory[] = ['All', 'Lecture Notes', 'Past Papers', 'Tutorial Videos', 'Reference Books'];

  const filteredItems = STUDY_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || item.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setQaList([{ id: Date.now(), q: question, a: "Awaiting answer from the community...", upvotes: 0 }, ...qaList]);
    setQuestion('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden mb-12 shadow-lg">
        <CoverSlideshow />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col items-center justify-end text-center px-4 pb-12 z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
            Study <span className="text-blue-400">Resources</span>
          </h1>
          <p className="text-slate-200 max-w-2xl mx-auto text-lg drop-shadow">
            Access lecture notes, past papers, tutorial videos, and reference books all in one place.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search study materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map(item => (
            <StudyCard key={item.id} item={item} onSelect={setSelectedResource} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 mb-16">
          <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
            <Search className="text-slate-400 dark:text-slate-500 w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No materials found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or category filter.</p>
        </div>
      )}

      {/* Student Hub Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm transition-colors">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Student Hub
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Connect with peers, ask questions, and share your feedback.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Q&A Thread */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              Community Q&A
            </h3>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {qaList.map((qa) => (
                <div key={qa.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 transition-colors">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <button className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{qa.upvotes}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm mb-1">{qa.q}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mt-2 transition-colors">
                        <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">A:</span>
                        {qa.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAskQuestion} className="relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <button 
                type="submit"
                disabled={!question.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Feedback Form */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 transition-colors">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Submit Resource Feedback</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Found a broken link? Have a resource to suggest? Let us know!
            </p>
            <form 
              onSubmit={(e) => { e.preventDefault(); setFeedback(''); alert('Feedback submitted! Thank you.'); }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Feedback Type</label>
                <select className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-colors">
                  <option>Suggest new resource</option>
                  <option>Report broken link</option>
                  <option>General feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  placeholder="Tell us more..."
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-medium hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors text-sm"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Resource Viewer Modal */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResource(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${getColor(selectedResource.type)} dark:bg-opacity-10 dark:border-opacity-20`}>
                    {getIcon(selectedResource.type)}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                    {selectedResource.title}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedResource(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center min-h-[400px]">
                {/* Placeholder for actual PDF/Video viewer */}
                <div className="text-center max-w-md mx-auto">
                  <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto mb-6">
                    {getIcon(selectedResource.type)}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Resource Viewer
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">
                    In a real application, the {selectedResource.type.toLowerCase()} would be displayed here using a PDF viewer or video player.
                  </p>
                  
                  <button
                    onClick={() => {
                      // Mock download functionality
                      const element = document.createElement("a");
                      const file = new Blob(["Mock content for " + selectedResource.title], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = `${selectedResource.title.replace(/\s+/g, '_')}.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm w-full sm:w-auto"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
