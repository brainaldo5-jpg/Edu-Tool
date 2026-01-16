
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, BookMarked, ChevronDown } from 'lucide-react';

const SYLLABUS_DATA = {
  Maths: ['Number Bases', 'Fractions & Decimals', 'Indices & Logarithms', 'Sets', 'Sequences & Series', 'Quadratic Equations', 'Trigonometry', 'Calculus (Basic)', 'Statistics', 'Probability'],
  Physics: ['Units & Dimensions', 'Kinematics', 'Dynamics', 'Work, Energy & Power', 'Heat & Temperature', 'Waves', 'Optics', 'Electrostatics', 'Current Electricity', 'Atomic Physics'],
  Chemistry: ['Atomic Structure', 'Chemical Bonding', 'Stoichiometry', 'States of Matter', 'Periodic Table', 'Energetics', 'Rates of Reaction', 'Organic Chemistry', 'Electrolysis']
};

const SyllabusChecker: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<keyof typeof SYLLABUS_DATA>('Maths');
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('edutool-syllabus');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const toggleTopic = (topic: string) => {
    const newProgress = { ...progress, [topic]: !progress[topic] };
    setProgress(newProgress);
    localStorage.setItem('edutool-syllabus', JSON.stringify(newProgress));
  };

  const currentTopics = SYLLABUS_DATA[activeSubject];
  const completedCount = currentTopics.filter(t => progress[t]).length;
  const percent = Math.round((completedCount / currentTopics.length) * 100);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b bg-slate-50">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {Object.keys(SYLLABUS_DATA).map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeSubject === sub ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500 border'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
        
        <div className="mt-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall Progress</p>
              <h3 className="text-lg font-bold text-slate-800">{activeSubject} Syllabus</h3>
            </div>
            <span className="text-2xl font-black text-blue-600">{percent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out" 
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
        {currentTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => toggleTopic(topic)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              progress[topic] ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-white border-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              {progress[topic] ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Circle className="text-slate-200" size={20} />}
              <span className="font-semibold text-sm">{topic}</span>
            </div>
            <BookMarked size={14} className={progress[topic] ? 'text-emerald-300' : 'text-slate-300'} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SyllabusChecker;
