
import React, { useState, useEffect, useRef } from 'react';
import { Beaker, Play, RotateCcw, Info, Droplets } from 'lucide-react';

const VirtualLab: React.FC = () => {
  const [acidVolume, setAcidVolume] = useState(0); // Volume in Burette (max 50)
  const [conicalVolume, setConicalVolume] = useState(25); // Fixed base volume
  const [isFlowing, setIsFlowing] = useState(false);
  const [endpointReached, setEndpointReached] = useState(false);
  const flowInterval = useRef<number | null>(null);

  const endPoint = 22.4; // Hidden endpoint for the experiment

  useEffect(() => {
    if (isFlowing) {
      flowInterval.current = window.setInterval(() => {
        setAcidVolume((prev) => {
          const next = prev + 0.1;
          if (next >= 50) {
            setIsFlowing(false);
            return 50;
          }
          return next;
        });
      }, 50);
    } else {
      if (flowInterval.current) clearInterval(flowInterval.current);
    }
    return () => { if (flowInterval.current) clearInterval(flowInterval.current); };
  }, [isFlowing]);

  useEffect(() => {
    if (acidVolume >= endPoint && !endpointReached) {
      setEndpointReached(true);
    }
  }, [acidVolume, endpointReached]);

  const reset = () => {
    setAcidVolume(0);
    setIsFlowing(false);
    setEndpointReached(false);
  };

  // Color logic for Phenolphthalein indicator
  const getLiquidColor = () => {
    if (acidVolume < endPoint - 0.5) return 'bg-pink-400 opacity-60'; // Deep pink (Base)
    if (acidVolume >= endPoint) return 'bg-blue-50 opacity-30'; // Clear (Neutral/Acid)
    // Transition
    const opacity = 60 - ((acidVolume - (endPoint - 0.5)) * 120);
    return `bg-pink-400 opacity-[${Math.max(0, opacity / 100)}]`;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="p-4 bg-white border-b flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Beaker size={20} className="text-emerald-600" /> Chemistry Practical: Titration
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">Standard HCl vs NaOH with Phenolphthalein</p>
        </div>
        <button onClick={reset} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row p-6 gap-8 items-center justify-center overflow-y-auto">
        {/* Visual Simulation Area */}
        <div className="relative flex flex-col items-center">
          {/* Burette */}
          <div className="w-12 h-64 border-x-2 border-slate-300 relative bg-white/50 flex flex-col justify-end overflow-hidden">
            {/* Liquid in Burette */}
            <div 
              className="w-full bg-blue-100 transition-all duration-100" 
              style={{ height: `${((50 - acidVolume) / 50) * 100}%` }}
            />
            {/* Burette Markings */}
            <div className="absolute inset-0 flex flex-col justify-between p-1 opacity-20">
              {[0, 10, 20, 30, 40, 50].map(m => <div key={m} className="border-t border-slate-800 text-[8px]">{m}</div>)}
            </div>
          </div>
          <div className="w-4 h-8 bg-slate-400 relative">
            <div className={`absolute -right-2 top-1/2 w-6 h-2 bg-slate-800 transition-transform ${isFlowing ? 'rotate-90' : 'rotate-0'}`} />
          </div>
          
          {/* Dripping effect */}
          <div className="h-12 w-1 flex flex-col items-center">
            {isFlowing && <div className="w-1 h-3 bg-blue-300 rounded-full animate-bounce" />}
          </div>

          {/* Conical Flask */}
          <div className="relative mt-2">
            <div className="w-32 h-32 relative flex flex-col justify-end">
               <div className={`w-full h-1/2 rounded-b-3xl border-2 border-slate-300 relative transition-colors duration-500 overflow-hidden ${endpointReached ? 'bg-blue-50/30' : 'bg-pink-400/60'}`}>
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
               </div>
               {/* Flask Neck */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-12 border-x-2 border-t-2 border-slate-300" />
            </div>
            <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conical Flask</p>
          </div>
        </div>

        {/* Controls & Readings */}
        <div className="w-full max-w-xs space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Volume Delivered (cm³)</p>
              <h4 className="text-5xl font-black text-slate-800 font-mono tracking-tighter">
                {acidVolume.toFixed(1)}
              </h4>
            </div>

            <button 
              onMouseDown={() => setIsFlowing(true)}
              onMouseUp={() => setIsFlowing(false)}
              onTouchStart={() => setIsFlowing(true)}
              onTouchEnd={() => setIsFlowing(false)}
              className={`w-full py-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 border-b-4 ${isFlowing ? 'bg-emerald-500 text-white border-emerald-700' : 'bg-slate-100 text-slate-600 border-slate-300'}`}
            >
              {isFlowing ? <Droplets className="animate-pulse" /> : <Play />}
              <span className="font-bold uppercase text-xs">Hold to Drop Acid</span>
            </button>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">End-point Reached:</span>
                <span className={`font-bold ${endpointReached ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {endpointReached ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Indicator:</span>
                <span className="font-bold text-slate-700">Phenolphthalein</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3 items-start">
            <Info className="text-blue-500 shrink-0" size={18} />
            <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
              Observe the color change. Phenolphthalein turns clear when the solution becomes neutral (pH 7) or acidic. Stop exactly at the point of disappearance!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualLab;
