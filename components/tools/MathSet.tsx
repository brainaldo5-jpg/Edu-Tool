
import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, MousePointer2, Pencil, Trash2, Download, Eraser, Move, Info, X, PlusCircle, HelpCircle } from 'lucide-react';

type MathToolType = 'ruler' | 'protractor' | 'set-square-45' | 'set-square-60' | 'compass' | 'divider';

interface ToolState {
  type: MathToolType;
  x: number;
  y: number;
  rotation: number;
}

const MathSet: React.FC = () => {
  const [drawingMode, setDrawingMode] = useState<'move' | 'pencil' | 'eraser'>('move');
  const [activeTools, setActiveTools] = useState<ToolState[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState<{ index: number, offset: { x: number, y: number } } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const resize = () => {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
        }
      };
      resize();
      window.addEventListener('resize', resize);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
      }
      return () => window.removeEventListener('resize', resize);
    }
  }, []);

  const addTool = (type: MathToolType) => {
    const newTool: ToolState = {
      type,
      x: 20 + activeTools.length * 15,
      y: 100 + activeTools.length * 15,
      rotation: 0
    };
    setActiveTools([...activeTools, newTool]);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (drawingMode !== 'move') return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const tool = activeTools[index];
    
    // Bring tool to front
    const updated = [...activeTools];
    const [item] = updated.splice(index, 1);
    updated.push(item);
    setActiveTools(updated);
    
    setDragging({ index: updated.length - 1, offset: { x: clientX - tool.x, y: clientY - tool.y } });
  };

  const handleGlobalMove = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    if (dragging) {
      const updated = [...activeTools];
      updated[dragging.index] = { 
        ...updated[dragging.index], 
        x: clientX - dragging.offset.x, 
        y: clientY - dragging.offset.y 
      };
      setActiveTools(updated);
    } else if (isDrawing) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (drawingMode === 'move') return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.globalCompositeOperation = drawingMode === 'eraser' ? 'destination-out' : 'source-over';
      ctx.lineWidth = drawingMode === 'eraser' ? 24 : 2;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden select-none touch-none" 
      onMouseMove={handleGlobalMove} onMouseUp={() => { setDragging(null); setIsDrawing(false); }}
      onTouchMove={handleGlobalMove} onTouchEnd={() => { setDragging(null); setIsDrawing(false); }}>
      
      {/* Mobile-Optimized Header/Tray */}
      <div className="bg-white border-b shadow-sm z-30">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <ModeBtn active={drawingMode === 'move'} icon={<Move size={18}/>} onClick={() => setDrawingMode('move')} />
            <ModeBtn active={drawingMode === 'pencil'} icon={<Pencil size={18}/>} onClick={() => setDrawingMode('pencil')} />
            <ModeBtn active={drawingMode === 'eraser'} icon={<Eraser size={18}/>} onClick={() => setDrawingMode('eraser')} />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
             <button onClick={() => setShowHelp(true)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg shrink-0"><HelpCircle size={20}/></button>
             <button onClick={() => { canvasRef.current?.getContext('2d')?.clearRect(0,0,2000,2000); setActiveTools([]); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0"><Trash2 size={20}/></button>
             <button onClick={() => {
                const link = document.createElement('a');
                link.download = 'geometry-work.png';
                link.href = canvasRef.current!.toDataURL();
                link.click();
             }} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg shrink-0"><Download size={20}/></button>
          </div>
        </div>
        
        {/* Tool Selector - Horizontal Scrollable */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          <ToolAddBtn label="Ruler" onClick={() => addTool('ruler')} />
          <ToolAddBtn label="Protractor" onClick={() => addTool('protractor')} />
          <ToolAddBtn label="Set Square 45°" onClick={() => addTool('set-square-45')} />
          <ToolAddBtn label="Set Square 60°" onClick={() => addTool('set-square-60')} />
          <ToolAddBtn label="Compass" onClick={() => addTool('compass')} />
          <ToolAddBtn label="Divider" onClick={() => addTool('divider')} />
        </div>
      </div>

      <div className="flex-1 relative bg-white overflow-hidden">
        <canvas ref={canvasRef} onMouseDown={startDrawing} onTouchStart={startDrawing} className="absolute inset-0 z-0" />
        
        {/* Visual Graph Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />

        {/* Floating Interactive Tools */}
        {activeTools.map((tool, idx) => (
          <div key={idx} 
            style={{ left: tool.x, top: tool.y, transform: `rotate(${tool.rotation}deg)` }}
            onMouseDown={(e) => handleDragStart(e, idx)}
            onTouchStart={(e) => handleDragStart(e, idx)}
            className={`absolute z-10 origin-top-left transition-shadow ${drawingMode === 'move' ? 'cursor-grab active:cursor-grabbing hover:shadow-2xl' : 'pointer-events-auto'}`}
          >
            <ToolVisual type={tool.type} />
            
            {/* Contextual Controls when in Move Mode */}
            {drawingMode === 'move' && (
              <div className="absolute -top-10 left-0 flex gap-2">
                <button 
                  className="bg-blue-600 text-white p-2 rounded-lg shadow-lg border border-white/20 active:scale-90"
                  onClick={(e) => {
                    e.stopPropagation();
                    const updated = [...activeTools];
                    updated[idx].rotation = (updated[idx].rotation + 15) % 360;
                    setActiveTools(updated);
                  }}
                >
                  <RotateCw size={14} />
                </button>
                <button 
                  className="bg-white text-red-500 p-2 rounded-lg shadow-lg border border-red-100 active:scale-90"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTools(activeTools.filter((_, i) => i !== idx));
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Dynamic User Feedback */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none w-full px-10">
          <div className="bg-slate-900/90 text-white px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md text-center max-w-sm mx-auto border border-white/10">
            <p className="text-[10px] font-black uppercase tracking-widest leading-tight">
              {drawingMode === 'move' ? 'Move & Rotate tools to place them' : `${drawingMode} mode active - Tools are your guides`}
            </p>
          </div>
        </div>
      </div>

      {/* Tutorial Overlay */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">How to use Math Set</h3>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 p-1"><X size={24} /></button>
            </div>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">1</div>
                <p><span className="font-bold text-slate-800 uppercase">Place Tools:</span> Use <b>MOVE</b> mode to drag tools and the blue button to rotate them.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">2</div>
                <p><span className="font-bold text-slate-800 uppercase">Construct:</span> Switch to <b>PENCIL</b>. Use the edges of the Ruler or Protractor as guides for perfect lines and angles.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">3</div>
                <p><span className="font-bold text-slate-800 uppercase">Compass/Set Square:</span> These help you bisect lines or draw parallel lines just like a real set!</p>
              </div>
            </div>
            <button onClick={() => setShowHelp(false)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Start Construction</button>
          </div>
        </div>
      )}
    </div>
  );
};

const ToolVisual: React.FC<{ type: MathToolType }> = ({ type }) => {
  switch (type) {
    case 'ruler':
      return (
        <div className="w-[320px] h-14 bg-gradient-to-b from-blue-50/80 to-blue-100/60 border border-blue-200 shadow-lg backdrop-blur-[4px] rounded-sm flex flex-col items-end px-2 overflow-hidden ring-1 ring-white/50">
          <div className="w-full flex items-end gap-[1.5px] h-8 pb-1 border-b border-blue-900/10">
            {Array.from({ length: 151 }).map((_, i) => (
              <div key={i} className={`bg-blue-900/60 ${i % 10 === 0 ? 'h-6 w-[2px]' : i % 5 === 0 ? 'h-4 w-[1px]' : 'h-2 w-[0.5px]'}`} />
            ))}
          </div>
          <div className="w-full flex justify-between px-2 text-[8px] font-black text-blue-900/50 mt-1 uppercase tracking-tighter">
            <span>0</span><span>5</span><span>10</span><span>15 cm</span>
          </div>
        </div>
      );
    case 'protractor':
      return (
        <div className="w-[240px] h-[120px] bg-gradient-to-tr from-blue-50/60 to-blue-100/50 border border-blue-200 rounded-t-full shadow-lg backdrop-blur-[4px] relative overflow-hidden flex flex-col justify-end ring-1 ring-white/50">
           <div className="absolute inset-0 flex items-center justify-center opacity-10">
             <div className="w-28 h-28 border border-blue-900 rounded-full" />
           </div>
           <div className="flex justify-between px-5 pb-2 text-[8px] font-black text-blue-900/40">
             <span>180°</span><span>90°</span><span>0°</span>
           </div>
           <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-900/10" />
        </div>
      );
    case 'set-square-45':
      return (
        <div className="w-[160px] h-[160px] bg-gradient-to-br from-blue-50/50 to-blue-100/50 border border-blue-200 shadow-lg backdrop-blur-[4px] relative overflow-hidden ring-1 ring-white/50" 
          style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-900/10" />
          <div className="absolute bottom-0 left-0 h-full w-1 bg-blue-900/10" />
        </div>
      );
    case 'set-square-60':
      return (
        <div className="w-[120px] h-[200px] bg-gradient-to-bl from-blue-50/50 to-blue-100/50 border border-blue-200 shadow-lg backdrop-blur-[4px] relative overflow-hidden ring-1 ring-white/50" 
          style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-900/10" />
          <div className="absolute bottom-0 left-0 h-full w-1 bg-blue-900/10" />
        </div>
      );
    case 'compass':
      return (
        <div className="relative w-24 h-40 flex flex-col items-center drop-shadow-2xl">
          <div className="w-4 h-12 bg-gradient-to-b from-slate-300 to-slate-500 rounded-full border border-slate-200" />
          <div className="flex gap-4 -mt-3">
            <div className="w-2 h-28 bg-slate-400 origin-top rotate-[20deg] rounded-full shadow-md border-r border-slate-500" />
            <div className="w-2 h-28 bg-slate-400 origin-top -rotate-[20deg] rounded-full shadow-md border-l border-slate-500 relative">
              <div className="absolute bottom-3 -right-1 w-3.5 h-8 bg-blue-700 rounded-lg shadow-inner border border-blue-500" />
            </div>
          </div>
        </div>
      );
    case 'divider':
      return (
        <div className="relative w-24 h-40 flex flex-col items-center drop-shadow-2xl">
          <div className="w-4 h-12 bg-gradient-to-b from-slate-300 to-slate-500 rounded-full border border-slate-200" />
          <div className="flex gap-4 -mt-3">
            <div className="w-2 h-28 bg-slate-400 origin-top rotate-[14deg] rounded-full border-b-[4px] border-slate-700 shadow-md" />
            <div className="w-2 h-28 bg-slate-400 origin-top -rotate-[14deg] rounded-full border-b-[4px] border-slate-700 shadow-md" />
          </div>
        </div>
      );
    default: return null;
  }
};

const ModeBtn: React.FC<{ active: boolean, icon: React.ReactNode, onClick: () => void }> = ({ active, icon, onClick }) => (
  <button onClick={onClick} className={`p-3 rounded-xl transition-all ${active ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
  </button>
);

const ToolAddBtn: React.FC<{ label: string, onClick: () => void }> = ({ label, onClick }) => (
  <button onClick={onClick} className="px-4 py-2 bg-white border border-slate-200 rounded-2xl text-[9px] font-black text-slate-700 uppercase tracking-tight hover:border-blue-300 hover:bg-blue-50 transition-all shrink-0 shadow-sm active:scale-95 whitespace-nowrap">
    + {label}
  </button>
);

export default MathSet;
