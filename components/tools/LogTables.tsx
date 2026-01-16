
import React, { useState } from 'react';
import { Table, Search, ChevronRight } from 'lucide-react';

const LogTables: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'antilogs' | 'trig'>('logs');
  
  // Generating a subset of log values for display (Real log tables are massive, we simulate the layout)
  const rows = Array.from({ length: 45 }, (_, i) => 10 + i);
  const cols = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="bg-slate-50 p-4 border-b flex gap-2 overflow-x-auto no-scrollbar">
        {['logs', 'antilogs', 'trig'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-600 border'
            }`}
          >
            {tab === 'logs' ? 'Logarithms' : tab === 'antilogs' ? 'Antilogarithms' : 'Trigonometry'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-2">
        <div className="min-w-[600px] border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-[10px] font-mono border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-2 border-r border-slate-200 bg-slate-200 sticky left-0 z-10 w-12">No.</th>
                {cols.map(c => (
                  <th key={c} className="p-2 border-r border-slate-200 w-10">{c}</th>
                ))}
                <th className="p-2 bg-orange-50 text-orange-700">M.D</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b hover:bg-orange-50 transition-colors cursor-pointer`}>
                  <td className="p-2 border-r border-slate-200 font-bold bg-slate-100 sticky left-0 z-10 text-center">{row}</td>
                  {cols.map(col => {
                    const val = Math.log10(row + col/10).toString().substring(2, 6);
                    return <td key={col} className="p-2 border-r border-slate-200 text-center text-slate-600">{val}</td>
                  })}
                  <td className="p-2 text-center text-orange-600 font-bold">{(row % 7)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-3 bg-orange-50 border-t flex items-center justify-between text-[10px] text-orange-700">
        <p className="font-medium italic">Standard 4-Figure Tables (Calculated values for reference)</p>
        <div className="flex gap-2">
          <span className="font-bold">M.D = Mean Differences</span>
        </div>
      </div>
    </div>
  );
};

export default LogTables;
