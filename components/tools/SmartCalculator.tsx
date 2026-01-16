
import React, { useState } from 'react';
import { History, Delete, X, HelpCircle, Calculator as CalcIcon } from 'lucide-react';

type CalcMode = 'basic' | 'scientific' | 'waec';

const SmartCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [mode, setMode] = useState<CalcMode>('basic');
  const [showHistory, setShowHistory] = useState(false);

  const handleInput = (val: string) => {
    if (display === 'Error') {
      setDisplay(val);
      return;
    }
    
    // Replace '0' with the value unless it's a decimal point or operator
    if (display === '0' && !['.', '×', '÷', '+', '-', ')'].includes(val)) {
      setDisplay(val);
    } else {
      setDisplay(prev => prev + val);
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const calculate = () => {
    try {
      let rawExpression = display;
      
      // Robust mapping for scientific terms
      let expression = rawExpression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin((Math.PI/180)*')
        .replace(/cos\(/g, 'Math.cos((Math.PI/180)*')
        .replace(/tan\(/g, 'Math.tan((Math.PI/180)*')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        // Handle square roots even if user didn't add a bracket: e.g. √9 -> Math.sqrt(9)
        .replace(/√(\d+\.?\d*)/g, 'Math.sqrt($1)')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

      // Auto-balance parentheses
      const openParens = (expression.match(/\(/g) || []).length;
      const closeParens = (expression.match(/\)/g) || []).length;
      for (let i = 0; i < openParens - closeParens; i++) {
        expression += ')';
      }

      // Special case for trigonometric conversion nested brackets
      const trigCount = (rawExpression.match(/(sin|cos|tan)\(/g) || []).length;
      for (let i = 0; i < trigCount; i++) {
        expression += ')';
      }

      const result = new Function(`return ${expression}`)();
      
      const formattedResult = Number.isInteger(result) 
        ? result 
        : parseFloat(result.toFixed(10));

      if (isNaN(formattedResult) || !isFinite(formattedResult)) {
        throw new Error();
      }

      setHistory(prev => [`${display} = ${formattedResult}`, ...prev].slice(0, 10));
      setEquation(`${display} =`);
      setDisplay(String(formattedResult));
    } catch (e) {
      setDisplay('Error');
    }
  };

  const getButtons = () => {
    switch(mode) {
      case 'basic':
        return ['C', '÷', '×', 'DEL', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.', '(', ')'];
      case 'scientific':
        return ['sin', 'cos', 'tan', 'DEL', 'log', 'ln', '√', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', 'π', '=', '^', '(', ')', 'C'];
      case 'waec':
        return ['sin', 'cos', 'tan', 'DEL', 'log', '√', 'x²', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', 'π', '=', '(', ')', 'Exp', 'C'];
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 max-w-lg mx-auto border-x select-none overflow-hidden">
      <div className="bg-white px-4 py-3 border-b flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-blue-600">
          <CalcIcon size={18} />
          <span className="text-[12px] font-black uppercase tracking-tight">{mode} Mode</span>
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {(['basic', 'scientific', 'waec'] as CalcMode[]).map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-2.5 py-1.5 text-[10px] font-black rounded-lg uppercase border transition-all ${mode === m ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>{m}</button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 relative flex flex-col justify-end min-h-[140px] border-b">
        <div className="text-right text-slate-400 text-sm h-6 mb-1 font-mono">{equation}</div>
        <div className="text-right text-4xl sm:text-5xl font-bold text-slate-800 overflow-x-auto whitespace-nowrap no-scrollbar font-mono tracking-tighter">
          {display}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-1.5 p-3 bg-slate-100 content-start overflow-y-auto no-scrollbar">
        {getButtons().map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === '=') calculate();
              else if (btn === 'C') clear();
              else if (btn === 'DEL') setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
              else if (['sin', 'cos', 'tan', 'log', 'ln', '√'].includes(btn)) handleInput(btn + '(');
              else if (btn === 'x²') handleInput('^2');
              else if (btn === 'Exp') handleInput('*10^');
              else handleInput(btn);
            }}
            className={`h-[15vw] max-h-16 rounded-2xl font-black text-lg flex items-center justify-center transition-all active:scale-90 shadow-sm border-b-4
              ${btn === '=' ? 'bg-blue-600 text-white border-blue-800' : 
                ['sin', 'cos', 'tan', 'log', 'ln', '√', '^', 'x²', 'Exp'].includes(btn) ? 'bg-slate-200 text-slate-600 border-slate-300' :
                ['+', '-', '×', '÷'].includes(btn) ? 'bg-white text-blue-600 border-slate-200' :
                btn === 'C' ? 'bg-red-50 text-red-600 border-red-100' :
                'bg-white text-slate-800 border-slate-200'}
            `}
          >
            {btn === 'DEL' ? <Delete size={22} /> : btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SmartCalculator;
