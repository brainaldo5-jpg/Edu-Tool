
import React, { useState, useEffect } from 'react';
import { Home, Calculator, Ruler, LineChart, BookOpen, Settings, Menu, ArrowLeft, Table, FlaskConical, Atom, ListChecks, ShieldAlert, Lock, Info } from 'lucide-react';
import { ToolCategory, Tool } from './types';
import { TOOLS, CATEGORY_COLORS } from './constants';
import SmartCalculator from './components/tools/SmartCalculator';
import MathSet from './components/tools/MathSet';
import GraphBook from './components/tools/GraphBook';
import PeriodicTable from './components/tools/PeriodicTable';
import Notebook from './components/tools/Notebook';
import LogTables from './components/tools/LogTables';
import SyllabusChecker from './components/tools/SyllabusChecker';
import SettingsPage from './components/tools/SettingsPage';
import VirtualLab from './components/tools/VirtualLab';

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<ToolCategory | 'all'>('all');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [viewingSettings, setViewingSettings] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('edutool-settings');
      return saved ? JSON.parse(saved) : { nightMode: false, examMode: false, offlineContent: true };
    } catch (e) {
      return { nightMode: false, examMode: false, offlineContent: true };
    }
  });

  // THEME ENGINE: Strictly controls the <html> tag for dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (settings.nightMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('edutool-settings', JSON.stringify(settings));
  }, [settings]);

  const toggleExamMode = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSettings(prev => {
        const nextMode = !prev.examMode;
        return { ...prev, examMode: nextMode };
      });
      setActiveToolId(null);
      setViewingSettings(false);
      setIsTransitioning(false);
    }, 1200);
  };

  const activeTool = TOOLS.find(t => t.id === activeToolId);

  const renderTool = () => {
    if (viewingSettings) return <SettingsPage settings={settings} setSettings={setSettings} onExamToggle={toggleExamMode} />;
    
    // Safety check for Exam Mode - Strictly blocks non-approved tools
    if (settings.examMode && activeToolId && !['calc', 'logtables'].includes(activeToolId)) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full bg-white dark:bg-slate-900">
                <ShieldAlert size={64} className="text-orange-500 mb-4" />
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white">Exam Restrictions</h2>
                <p className="text-slate-400 font-medium max-w-xs mx-auto">Access to this tool is disabled during active Exam Mode to ensure academic integrity.</p>
                <button 
                  onClick={() => setActiveToolId(null)} 
                  className="mt-8 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm shadow-xl"
                >
                  Return to Dashboard
                </button>
            </div>
        );
    }

    switch (activeToolId) {
      case 'calc': return <SmartCalculator />;
      case 'mathset': return <MathSet />;
      case 'graph': return <GraphBook />;
      case 'periodic': return <PeriodicTable />;
      case 'vlab': return <VirtualLab />;
      case 'notes': return <Notebook />;
      case 'logtables': return <LogTables />;
      case 'syllabus': return <SyllabusChecker />;
      default: return null;
    }
  };

  const displayedTools = settings.examMode 
    ? TOOLS.filter(t => ['calc', 'logtables'].includes(t.id))
    : (currentCategory === 'all' ? TOOLS : TOOLS.filter(t => t.category === currentCategory));

  return (
    <div className={`flex h-screen overflow-hidden relative bg-slate-50 dark:bg-slate-950`}>
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:relative md:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg">
                <BookOpen size={24} />
             </div>
             <div>
                <h1 className="text-xl font-black text-slate-800 dark:text-white leading-none">EduTool</h1>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Digital Suite</p>
             </div>
          </div>
        </div>
        
        <nav className="mt-4 px-3 space-y-1 overflow-y-auto no-scrollbar max-h-[calc(100vh-200px)]">
          <NavItem 
            icon={<Home size={20} />} 
            label="Home Dashboard" 
            active={!activeToolId && !viewingSettings && currentCategory === 'all'} 
            onClick={() => { setActiveToolId(null); setViewingSettings(false); setCurrentCategory('all'); setSidebarOpen(false); }} 
          />
          
          {!settings.examMode && (
            <>
              <div className="pt-6 pb-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subjects</div>
              <CategoryBtn cat="math" label="Mathematics" active={currentCategory === 'math' && !activeToolId} onClick={() => { setCurrentCategory('math'); setActiveToolId(null); setViewingSettings(false); setSidebarOpen(false); }} />
              <CategoryBtn cat="science" label="Sciences" active={currentCategory === 'science' && !activeToolId} onClick={() => { setCurrentCategory('science'); setActiveToolId(null); setViewingSettings(false); setSidebarOpen(false); }} />
              <CategoryBtn cat="study" label="Study Center" active={currentCategory === 'study' && !activeToolId} onClick={() => { setCurrentCategory('study'); setActiveToolId(null); setViewingSettings(false); setSidebarOpen(false); }} />
              <CategoryBtn cat="exam" label="Exam Prep" active={currentCategory === 'exam' && !activeToolId} onClick={() => { setCurrentCategory('exam'); setActiveToolId(null); setViewingSettings(false); setSidebarOpen(false); }} />
            </>
          )}

          <div className="pt-6 pb-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System</div>
          <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={viewingSettings} 
            onClick={() => { setViewingSettings(true); setActiveToolId(null); setSidebarOpen(false); }} 
          />
        </nav>

        {settings.examMode && (
          <div className="absolute bottom-6 inset-x-4 p-5 bg-orange-600 rounded-3xl flex items-center gap-3 text-white shadow-xl animate-pulse">
             <Lock size={20} strokeWidth={3} />
             <p className="text-[10px] font-black leading-tight uppercase tracking-tighter">EXAM MODE ACTIVE<br/><span className="opacity-80 font-medium">Safe Tools Only</span></p>
          </div>
        )}
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {!activeToolId && !viewingSettings && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 md:hidden text-slate-500">
                <Menu size={22} />
              </button>
            )}
            {activeToolId || viewingSettings ? (
              <div className="flex items-center gap-3">
                <button onClick={() => { setActiveToolId(null); setViewingSettings(false); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-600 dark:text-slate-300"><ArrowLeft size={20} /></button>
                <h2 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter text-sm sm:text-base">{viewingSettings ? 'Settings' : activeTool?.name}</h2>
              </div>
            ) : (
              <h2 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                {settings.examMode ? 'Safe Station' : currentCategory === 'all' ? 'Your Dashboard' : `${currentCategory === 'exam' ? 'Exam Prep' : currentCategory} Lab`}
              </h2>
            )}
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-full">
            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Live Offline</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {activeToolId || viewingSettings ? renderTool() : (
            <div className="p-4 sm:p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24">
              {displayedTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} onClick={() => setActiveToolId(tool.id)} />
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM NAV (MOBILE) */}
        {!activeToolId && !viewingSettings && (
          <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-4 z-50 shadow-2xl">
             <NavIcon label="Home" icon={<Home size={22} />} active={!viewingSettings && !activeToolId && currentCategory === 'all'} onClick={() => { setActiveToolId(null); setViewingSettings(false); setCurrentCategory('all'); }} />
             <NavIcon label="Calc" icon={<Calculator size={22} />} active={activeToolId === 'calc'} onClick={() => { setActiveToolId('calc'); setViewingSettings(false); }} />
             <NavIcon label="JAMB" icon={<ListChecks size={22} />} active={activeToolId === 'syllabus'} onClick={() => { setActiveToolId('syllabus'); setViewingSettings(false); }} />
             <NavIcon label="Logs" icon={<Table size={22} />} active={activeToolId === 'logtables'} onClick={() => { setActiveToolId('logtables'); setViewingSettings(false); }} />
          </nav>
        )}
      </main>

      {/* EXAM LOCK OVERLAY */}
      {isTransitioning && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center text-white animate-in fade-in duration-500">
            <div className="relative mb-8 p-10 bg-white/5 rounded-[40px] border border-white/10">
                <Lock size={80} className="text-orange-500 animate-bounce" />
                <div className="absolute inset-0 bg-orange-500/20 rounded-[40px] blur-3xl animate-pulse" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-[0.3em]">{settings.examMode ? 'Disabling Lock...' : 'Enabling Exam Guard...'}</h2>
            <p className="text-slate-500 mt-4 font-black uppercase text-[10px] tracking-widest opacity-80">Syncing Local Database</p>
        </div>
      )}
    </div>
  );
};

// NavItem component
const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-black transition-all ${active ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
    {icon} {label}
  </button>
);

// CategoryBtn component
const CategoryBtn = ({ cat, label, active, onClick }: { cat: string, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[11px] font-black transition-all uppercase tracking-tighter ${active ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
    <div className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[cat]}`} /> {label}
  </button>
);

// NavIcon component
const NavIcon = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center p-2 rounded-xl transition-all ${active ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400'}`}>
    {icon} <span className="text-[9px] font-black mt-1 uppercase tracking-tighter">{label}</span>
  </button>
);

// ToolCard component
const ToolCard: React.FC<{ tool: Tool, onClick: () => void }> = ({ tool, onClick }) => {
  const IconMap: any = { Calculator, Ruler, LineChart, Table, BookOpen, FlaskConical, Atom, ListChecks };
  const Icon = IconMap[tool.icon] || Info;
  return (
    <button onClick={onClick} className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] transition-all active:scale-95 text-center shadow-sm hover:shadow-xl group">
      <div className={`p-5 rounded-[22px] ${CATEGORY_COLORS[tool.category]} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform group-hover:rotate-3`}>
        <Icon size={32} />
      </div>
      <h3 className="font-black text-slate-800 dark:text-white text-[13px] uppercase tracking-tighter">{tool.name}</h3>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1 font-black uppercase tracking-widest">{tool.description}</p>
    </button>
  );
};

export default App;
