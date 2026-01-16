
import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Calendar, FileText } from 'lucide-react';
import { Note } from '../../types';

const Notebook: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('edutool-notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const saveNote = () => {
    if (!title.trim()) return;
    
    const newNote: Note = {
      id: activeNoteId || Date.now().toString(),
      title,
      content,
      lastModified: Date.now()
    };

    const updated = activeNoteId 
      ? notes.map(n => n.id === activeNoteId ? newNote : n)
      : [newNote, ...notes];

    setNotes(updated);
    localStorage.setItem('edutool-notes', JSON.stringify(updated));
    if (!activeNoteId) setActiveNoteId(newNote.id);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('edutool-notes', JSON.stringify(updated));
    if (activeNoteId === id) {
      setActiveNoteId(null);
      setTitle('');
      setContent('');
    }
  };

  const currentNote = notes.find(n => n.id === activeNoteId);

  return (
    <div className="h-full flex bg-slate-50 overflow-hidden">
      {/* List Sidebar */}
      <div className={`w-full md:w-80 bg-white border-r flex flex-col h-full ${activeNoteId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-slate-700">My Study Notes</h3>
          <button 
            onClick={() => { setActiveNoteId(null); setTitle(''); setContent(''); }}
            className="p-2 bg-blue-50 text-blue-600 rounded-lg"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
          {notes.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <FileText size={48} className="mx-auto opacity-20 mb-4" />
              <p className="text-sm">Start your first note</p>
            </div>
          ) : (
            notes.map(note => (
              <button
                key={note.id}
                onClick={() => { setActiveNoteId(note.id); setTitle(note.title); setContent(note.content); }}
                className={`w-full text-left p-4 rounded-xl transition-all border ${activeNoteId === note.id ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
              >
                <h4 className="font-bold text-slate-800 truncate">{note.title}</h4>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Calendar size={12} /> {new Date(note.lastModified).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{note.content}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className={`flex-1 flex flex-col bg-white h-full ${!activeNoteId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b flex items-center justify-between bg-slate-50/50">
          <button 
            onClick={() => setActiveNoteId(null)}
            className="md:hidden p-2 text-slate-500"
          >
            <X size={20} />
          </button>
          <div className="flex gap-2">
            {activeNoteId && (
              <button 
                onClick={() => deleteNote(activeNoteId)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button 
              onClick={saveNote}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm"
            >
              <Save size={16} /> Save
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col p-6 space-y-4 max-w-3xl mx-auto w-full">
          <input 
            type="text" 
            placeholder="Note Title (e.g. Physics Laws)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold border-none outline-none placeholder:text-slate-200 text-slate-800"
          />
          <textarea 
            placeholder="Start typing your study notes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 text-lg leading-relaxed border-none outline-none resize-none placeholder:text-slate-200 text-slate-600 no-scrollbar"
          />
        </div>
      </div>
    </div>
  );
};

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

export default Notebook;
