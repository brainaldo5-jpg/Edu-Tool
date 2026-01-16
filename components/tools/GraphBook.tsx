
import React, { useState } from 'react';
import { Plus, Trash2, LineChart as ChartIcon, Table } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GraphBook: React.FC = () => {
  const [points, setPoints] = useState<{ x: number, y: number }[]>([
    { x: -5, y: -5 },
    { x: 0, y: 0 },
    { x: 5, y: 5 },
  ]);
  const [newX, setNewX] = useState('');
  const [newY, setNewY] = useState('');

  const addPoint = () => {
    if (newX && newY) {
      setPoints([...points, { x: Number(newX), y: Number(newY) }].sort((a, b) => a.x - b.x));
      setNewX('');
      setNewY('');
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      {/* Sidebar / Controls */}
      <div className="w-full md:w-80 bg-white border-r flex flex-col h-1/3 md:h-full shrink-0">
        <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <Table size={18} /> Table of Values
          </h3>
          <button onClick={() => setPoints([])} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="number" 
              placeholder="X Value" 
              value={newX}
              onChange={(e) => setNewX(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500 outline-none text-sm"
            />
            <input 
              type="number" 
              placeholder="Y Value" 
              value={newY}
              onChange={(e) => setNewY(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500 outline-none text-sm"
            />
          </div>
          <button 
            onClick={addPoint}
            className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Coordinates
          </button>

          <div className="mt-6">
            <div className="grid grid-cols-2 text-xs font-bold text-slate-400 px-2 mb-2">
              <span>X (Independent)</span>
              <span>Y (Dependent)</span>
            </div>
            <div className="space-y-1">
              {points.map((p, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-lg text-sm font-mono border">
                  <span>{p.x}</span>
                  <span>{p.y}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex-1 bg-white border rounded-2xl shadow-inner p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="x" 
                type="number" 
                domain={['auto', 'auto']} 
                tick={{fontSize: 10}}
                label={{ value: 'X-Axis', position: 'bottom', fontSize: 12 }}
              />
              <YAxis 
                type="number" 
                domain={['auto', 'auto']} 
                tick={{fontSize: 10}}
                label={{ value: 'Y-Axis', angle: -90, position: 'insideLeft', fontSize: 12 }}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
          <p>Manual scale: 1cm to 1 unit</p>
          <button className="flex items-center gap-1 text-blue-600 font-bold uppercase tracking-wider">
            Export PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphBook;
