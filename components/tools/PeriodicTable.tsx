
import React, { useState } from 'react';
import { Search, Info, X as CloseIcon } from 'lucide-react';
import { PeriodicElement } from '../../types';

interface ExtendedElement extends PeriodicElement {
  configuration: string;
  state: 'solid' | 'liquid' | 'gas';
  boilingPoint: string;
}

const ELEMENTS: ExtendedElement[] = [
  { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'nonmetal', configuration: '1s¹', state: 'gas', boilingPoint: '-252.9°C' },
  { number: 2, symbol: 'He', name: 'Helium', mass: 4.0026, category: 'noble', configuration: '1s²', state: 'gas', boilingPoint: '-268.9°C' },
  { number: 3, symbol: 'Li', name: 'Lithium', mass: 6.94, category: 'alkali', configuration: '[He] 2s¹', state: 'solid', boilingPoint: '1342°C' },
  { number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.0122, category: 'alkaline', configuration: '[He] 2s²', state: 'solid', boilingPoint: '2470°C' },
  { number: 5, symbol: 'B', name: 'Boron', mass: 10.81, category: 'metalloid', configuration: '[He] 2s² 2p¹', state: 'solid', boilingPoint: '3927°C' },
  { number: 6, symbol: 'C', name: 'Carbon', mass: 12.011, category: 'nonmetal', configuration: '[He] 2s² 2p²', state: 'solid', boilingPoint: 'Sublimes 3642°C' },
  { number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.007, category: 'nonmetal', configuration: '[He] 2s² 2p³', state: 'gas', boilingPoint: '-195.8°C' },
  { number: 8, symbol: 'O', name: 'Oxygen', mass: 15.999, category: 'nonmetal', configuration: '[He] 2s² 2p⁴', state: 'gas', boilingPoint: '-183.0°C' },
  { number: 9, symbol: 'F', name: 'Fluorine', mass: 18.998, category: 'halogen', configuration: '[He] 2s² 2p⁵', state: 'gas', boilingPoint: '-188.1°C' },
  { number: 10, symbol: 'Ne', name: 'Neon', mass: 20.180, category: 'noble', configuration: '[He] 2s² 2p⁶', state: 'gas', boilingPoint: '-246.1°C' },
  { number: 11, symbol: 'Na', name: 'Sodium', mass: 22.990, category: 'alkali', configuration: '[Ne] 3s¹', state: 'solid', boilingPoint: '883°C' },
  { number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.305, category: 'alkaline', configuration: '[Ne] 3s²', state: 'solid', boilingPoint: '1090°C' },
  { number: 13, symbol: 'Al', name: 'Aluminum', mass: 26.982, category: 'metal', configuration: '[Ne] 3s² 3p¹', state: 'solid', boilingPoint: '2470°C' },
  { number: 14, symbol: 'Si', name: 'Silicon', mass: 28.085, category: 'metalloid', configuration: '[Ne] 3s² 3p²', state: 'solid', boilingPoint: '3265°C' },
  { number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.974, category: 'nonmetal', configuration: '[Ne] 3s² 3p³', state: 'solid', boilingPoint: '280.5°C' },
  { number: 16, symbol: 'S', name: 'Sulfur', mass: 32.06, category: 'nonmetal', configuration: '[Ne] 3s² 3p⁴', state: 'solid', boilingPoint: '444.6°C' },
  { number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, category: 'halogen', configuration: '[Ne] 3s² 3p⁵', state: 'gas', boilingPoint: '-34.0°C' },
  { number: 18, symbol: 'Ar', name: 'Argon', mass: 39.948, category: 'noble', configuration: '[Ne] 3s² 3p⁶', state: 'gas', boilingPoint: '-185.8°C' },
  { number: 19, symbol: 'K', name: 'Potassium', mass: 39.098, category: 'alkali', configuration: '[Ar] 4s¹', state: 'solid', boilingPoint: '759°C' },
  { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.078, category: 'alkaline', configuration: '[Ar] 4s²', state: 'solid', boilingPoint: '1484°C' },
  { number: 21, symbol: 'Sc', name: 'Scandium', mass: 44.956, category: 'transition', configuration: '[Ar] 3d¹ 4s²', state: 'solid', boilingPoint: '2830°C' },
  { number: 22, symbol: 'Ti', name: 'Titanium', mass: 47.867, category: 'transition', configuration: '[Ar] 3d² 4s²', state: 'solid', boilingPoint: '3287°C' },
  { number: 23, symbol: 'V', name: 'Vanadium', mass: 50.942, category: 'transition', configuration: '[Ar] 3d³ 4s²', state: 'solid', boilingPoint: '3407°C' },
  { number: 24, symbol: 'Cr', name: 'Chromium', mass: 51.996, category: 'transition', configuration: '[Ar] 3d⁵ 4s¹', state: 'solid', boilingPoint: '2671°C' },
  { number: 25, symbol: 'Mn', name: 'Manganese', mass: 54.938, category: 'transition', configuration: '[Ar] 3d⁵ 4s²', state: 'solid', boilingPoint: '2061°C' },
  { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.845, category: 'transition', configuration: '[Ar] 3d⁶ 4s²', state: 'solid', boilingPoint: '2862°C' },
  { number: 27, symbol: 'Co', name: 'Cobalt', mass: 58.933, category: 'transition', configuration: '[Ar] 3d⁷ 4s²', state: 'solid', boilingPoint: '2927°C' },
  { number: 28, symbol: 'Ni', name: 'Nickel', mass: 58.693, category: 'transition', configuration: '[Ar] 3d⁸ 4s²', state: 'solid', boilingPoint: '2913°C' },
  { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.546, category: 'transition', configuration: '[Ar] 3d¹⁰ 4s¹', state: 'solid', boilingPoint: '2562°C' },
  { number: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, category: 'transition', configuration: '[Ar] 3d¹⁰ 4s²', state: 'solid', boilingPoint: '907°C' },
];

const CAT_COLORS: Record<string, string> = {
  nonmetal: 'bg-green-100 text-green-800 border-green-200',
  noble: 'bg-purple-100 text-purple-800 border-purple-200',
  alkali: 'bg-red-100 text-red-800 border-red-200',
  alkaline: 'bg-orange-100 text-orange-800 border-orange-200',
  metalloid: 'bg-teal-100 text-teal-800 border-teal-200',
  halogen: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  metal: 'bg-blue-100 text-blue-800 border-blue-200',
  transition: 'bg-pink-100 text-pink-800 border-pink-200',
};

const PeriodicTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState<ExtendedElement | null>(null);

  const filtered = ELEMENTS.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="p-4 bg-slate-50 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search elements by name or symbol..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white focus:ring-2 ring-blue-500 outline-none text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 content-start no-scrollbar">
        {filtered.map(el => (
          <button
            key={el.number}
            onClick={() => setSelectedElement(el)}
            className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all active:scale-95 hover:shadow-md ${CAT_COLORS[el.category] || 'bg-slate-50 border-slate-200'}`}
          >
            <span className="text-[10px] self-start font-bold opacity-60">{el.number}</span>
            <span className="text-2xl font-black tracking-tighter">{el.symbol}</span>
            <span className="text-[10px] font-medium truncate w-full text-center mt-0.5">{el.name}</span>
          </button>
        ))}
      </div>

      {selectedElement && (
        <div className="fixed inset-x-0 bottom-0 md:relative md:inset-auto p-6 border-t bg-white shadow-2xl md:shadow-none animate-in slide-in-from-bottom flex flex-col sm:flex-row gap-6 items-start z-50">
          <div className={`p-8 border-4 rounded-3xl flex flex-col items-center justify-center shadow-lg w-full sm:w-auto shrink-0 ${CAT_COLORS[selectedElement.category]}`}>
            <span className="text-xl font-bold opacity-70 mb-2">{selectedElement.number}</span>
            <span className="text-7xl font-black leading-none">{selectedElement.symbol}</span>
            <span className="text-sm font-bold mt-4 uppercase tracking-widest">{selectedElement.category}</span>
          </div>
          <div className="flex-1 py-2 space-y-4">
            <div>
              <h3 className="text-3xl font-black text-slate-800">{selectedElement.name}</h3>
              <p className="text-slate-500 font-medium">Electronic Configuration: <span className="font-mono text-blue-600 font-bold">{selectedElement.configuration}</span></p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Atomic Mass</p>
                <p className="text-sm font-bold text-slate-700">{selectedElement.mass} u</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border">
                <p className="text-[10px] font-bold text-slate-400 uppercase">State (at STP)</p>
                <p className="text-sm font-bold text-slate-700 capitalize">{selectedElement.state}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Boiling Point</p>
                <p className="text-sm font-bold text-slate-700">{selectedElement.boilingPoint}</p>
              </div>
            </div>

            <button className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase group">
              <Info size={16} /> 
              <span className="group-hover:underline">Detailed Bohr Model & Trends</span>
            </button>
          </div>
          <button 
            onClick={() => setSelectedElement(null)} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <CloseIcon size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PeriodicTable;
