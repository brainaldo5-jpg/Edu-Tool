
import React from 'react';
import { Moon, Shield, Database, Trash2, Info, ChevronRight, Share2, CheckCircle2 } from 'lucide-react';

interface SettingsProps {
    settings: {
        nightMode: boolean;
        examMode: boolean;
        offlineContent: boolean;
    };
    setSettings: React.Dispatch<React.SetStateAction<{
        nightMode: boolean;
        examMode: boolean;
        offlineContent: boolean;
    }>>;
    onExamToggle?: () => void;
}

const SettingsPage: React.FC<SettingsProps> = ({ settings, setSettings, onExamToggle }) => {
  
  const updateSetting = (key: keyof typeof settings) => {
    if (key === 'examMode' && onExamToggle) {
        onExamToggle();
    } else {
        const nextValue = !settings[key];
        setSettings(prev => ({ ...prev, [key]: nextValue }));
    }
  };

  const clearData = () => {
    if (window.confirm('Delete all saved notes and progress? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const shareApp = async () => {
    const url = window.location.origin;
    const shareText = "Hey classmate! 📚 Download EduTool Africa – it's an offline study box for WAEC/JAMB with calculators and digital math sets. Use it here:";
    const waLink = `https://wa.me/?text=${encodeURIComponent(shareText + " " + url)}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'EduTool Africa', text: shareText, url });
      } else {
        await navigator.clipboard.writeText(url);
        if (window.confirm("Link copied! Open WhatsApp to send to your group?")) {
            window.open(waLink, '_blank');
        }
      }
    } catch (err) {
      window.open(waLink, '_blank');
    }
  };

  return (
    <div className="h-full bg-slate-50 dark:bg-dark-bg overflow-y-auto no-scrollbar pb-24">
      <div className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
        
        <section>
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-5 mb-4">Preferences</h3>
          <div className="bg-white dark:bg-dark-card rounded-[32px] border border-slate-200 dark:border-dark-border divide-y divide-slate-100 dark:divide-dark-border overflow-hidden shadow-sm">
            <SettingItem 
              icon={<Moon size={18}/>} 
              label="Night Mode" 
              description="Optimized for late-night study" 
              isOn={settings.nightMode}
              onClick={() => updateSetting('nightMode')}
              toggle
            />
            <SettingItem 
              icon={<Shield size={18}/>} 
              label="Exam Mode" 
              description="Locks distractions during exams" 
              isOn={settings.examMode}
              onClick={() => updateSetting('examMode')}
              toggle
            />
            <SettingItem 
              icon={<Database size={18}/>} 
              label="Offline Content" 
              description="Cache tools and documents" 
              isOn={settings.offlineContent}
              onClick={() => updateSetting('offlineContent')}
              toggle
            />
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-5 mb-4">Data Management</h3>
          <div className="bg-white dark:bg-dark-card rounded-[32px] border border-slate-200 dark:border-dark-border divide-y divide-slate-100 dark:divide-dark-border overflow-hidden shadow-sm">
            <button 
              onClick={shareApp}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl group-active:scale-90 transition-transform"><Share2 size={20}/></div>
                <div className="text-left">
                  <p className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight">Tell a Classmate</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight">Share via WhatsApp / SMS</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>

            <button 
              onClick={clearData} 
              className="w-full flex items-center justify-between p-6 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
            >
              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-2xl group-active:scale-90 transition-transform"><Trash2 size={20}/></div>
                <div className="text-left">
                  <p className="font-black text-red-600 dark:text-red-400 text-sm uppercase tracking-tight">Clear Application Data</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight">Resets notes, syllabus and logs</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-5 mb-4">About EduTool</h3>
          <div className="bg-white dark:bg-dark-card rounded-[32px] border border-slate-200 dark:border-dark-border divide-y divide-slate-100 dark:divide-dark-border overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl"><Info size={20}/></div>
                <div className="text-left">
                  <p className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight">Version</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight">v1.0.4-beta (Offline Ready)</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </div>
            
            <div className="p-10 bg-blue-600 dark:bg-blue-700 text-white rounded-b-[32px]">
              <div className="flex gap-4 items-center mb-3">
                <CheckCircle2 size={28} className="text-emerald-300" />
                <p className="font-black text-lg uppercase tracking-widest leading-none">Verified Engine</p>
              </div>
              <p className="text-xs opacity-90 leading-relaxed font-black uppercase tracking-tighter">
                Designed for West African students. Load once, study forever. Your digital study box works wherever you are.
              </p>
            </div>
          </div>
        </section>

        <div className="text-center py-6">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">EduTool Africa</p>
          <p className="text-[9px] text-slate-300 dark:text-slate-700 mt-2 uppercase font-black tracking-widest italic leading-tight">Empowering Students Through Technology</p>
        </div>
      </div>
    </div>
  );
};

const SettingItem: React.FC<{ 
  icon: React.ReactNode, 
  label: string, 
  description: string, 
  isOn?: boolean, 
  onClick?: () => void,
  toggle?: boolean 
}> = ({ icon, label, description, isOn, onClick, toggle }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
    >
      <div className="flex items-center gap-5 text-left">
        <div className={`p-4 rounded-[22px] transition-all group-active:scale-90 shadow-sm ${isOn && toggle ? 'bg-blue-600 text-white ring-4 ring-blue-500/10' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>
          {icon}
        </div>
        <div>
          <p className={`font-black text-sm uppercase tracking-tight transition-colors ${isOn && toggle ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-white'}`}>{label}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">{description}</p>
        </div>
      </div>
      {toggle ? (
        <div className={`w-14 h-8 rounded-full p-1 transition-all duration-300 border-2 ${isOn ? 'bg-blue-600 border-blue-600' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-dark-border'}`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow-lg toggle-dot ${isOn ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
      ) : (
        <ChevronRight size={18} className="text-slate-300" />
      )}
    </button>
  );
};

export default SettingsPage;
