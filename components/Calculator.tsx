import React, { useState } from 'react';
import Card from './Card';
import { Delete, History } from 'lucide-react';

const Calculator: React.FC = () => {
  const [current, setCurrent] = useState('');
  const [previous, setPrevious] = useState('');
  const [operation, setOperation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [shouldReset, setShouldReset] = useState(false);

  // Format numbers with commas for better readability
  const formatNumber = (num: string) => {
    if (!num) return '';
    if (num === 'Error') return 'Error';
    if (num.includes('e') || num.includes('Infinity')) return num;

    const [integer, decimal] = num.split('.');
    
    // Manually add commas to the string to avoid precision loss
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    if (decimal !== undefined) {
      return `${formattedInteger}.${decimal}`;
    }
    return formattedInteger;
  };

  const calculate = (a: string, b: string, op: string): string => {
    const cleanA = a.replace(/,/g, '');
    const cleanB = b.replace(/,/g, '');

    // Check if we can use BigInt (Integers only)
    const isIntegerA = /^-?\d+$/.test(cleanA);
    const isIntegerB = /^-?\d+$/.test(cleanB);
    const isBigOp = op === '+' || op === '-' || op === '×';

    if (isIntegerA && isIntegerB && isBigOp) {
        try {
            const bigA = BigInt(cleanA);
            const bigB = BigInt(cleanB);
            switch(op) {
                case '+': return (bigA + bigB).toString();
                case '-': return (bigA - bigB).toString();
                case '×': return (bigA * bigB).toString();
            }
        } catch {
            // Fallback to float if BigInt fails
        }
    }

    // Float Arithmetic
    const numA = parseFloat(cleanA);
    const numB = parseFloat(cleanB);
    if (isNaN(numA) || isNaN(numB)) return 'Error';

    let res = 0;
    switch (op) {
      case '+': res = numA + numB; break;
      case '-': res = numA - numB; break;
      case '×': res = numA * numB; break;
      case '÷': 
          if(numB === 0) return 'Error';
          res = numA / numB; 
          break;
      case '%': res = (numA / 100) * numB; break;
      default: return 'Error';
    }

    if (!isFinite(res)) return 'Error';

    // Convert to string and handle rough precision issues for floats
    const resultStr = res.toString();
    // Avoid ultra-long decimals for simple float operations
    if (resultStr.includes('.') && resultStr.length > 15 && !resultStr.includes('e')) {
       return parseFloat(resultStr).toPrecision(12).replace(/\.?0+$/, "");
    }
    return resultStr;
  };

  const appendNumber = (num: string) => {
    if (shouldReset) {
        setCurrent(num);
        setShouldReset(false);
        return;
    }

    if (num === '.' && current.includes('.')) return;
    if (current.length > 50) return; // Increased limit
    setCurrent(current + num);
  };

  const chooseOperation = (op: string) => {
    if (current === '') {
        // Allow swapping operation if waiting for second operand
        if (previous !== '') setOperation(op);
        return;
    }

    if (previous !== '') {
       // Chain calculation: Perform previous calc before setting new op
       const result = calculate(previous, current, operation);
       
       if (result === 'Error') {
           setCurrent('Error');
           setPrevious('');
           setOperation('');
           setShouldReset(true);
           return;
       }
       
       setHistory(h => [`${formatNumber(previous)} ${operation} ${formatNumber(current)} = ${formatNumber(result)}`, ...h].slice(0, 5));
       setPrevious(result);
       setOperation(op);
       setCurrent('');
    } else {
       setOperation(op);
       setPrevious(current);
       setCurrent('');
    }
  };

  const compute = () => {
    if (!previous || !current) return;
    const result = calculate(previous, current, operation);
    
    setHistory(h => [`${formatNumber(previous)} ${operation} ${formatNumber(current)} = ${formatNumber(result)}`, ...h].slice(0, 5));
    setCurrent(result);
    setPrevious('');
    setOperation('');
    setShouldReset(true);
  };

  const deleteLast = () => {
    if (shouldReset) {
        setCurrent('');
        setShouldReset(false);
        return;
    }
    setCurrent(current.slice(0, -1));
  };

  const clearAll = () => {
    setCurrent('');
    setPrevious('');
    setOperation('');
    setShouldReset(false);
  };

  const btnClass = "h-16 w-16 md:h-20 md:w-20 rounded-full font-bold text-2xl transition-all duration-200 active:scale-95 flex items-center justify-center shadow-lg border border-white/5 select-none";
  const numBtn = `${btnClass} bg-slate-800 text-white hover:bg-slate-700`;
  const opBtn = `${btnClass} bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-500/20`;
  const actionBtn = `${btnClass} bg-slate-600 text-slate-200 hover:bg-slate-500`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] animate-fade-in-up pb-20">
      <Card className="w-full max-w-md bg-[#020617] border border-slate-800 p-8 shadow-2xl rounded-[3rem] relative overflow-hidden">
        
        {/* Glossy Overlay */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-800/20 to-transparent pointer-events-none"></div>

        {/* Display Screen */}
        <div className="flex flex-col items-end justify-end h-40 mb-6 px-4">
          <div className="text-slate-400 text-xl font-medium mb-1 h-6 flex items-center gap-2">
             {previous && (
                 <>
                    <span className="truncate max-w-[200px]">{formatNumber(previous)}</span>
                    <span className="text-cyan-400">{operation}</span>
                 </>
             )}
          </div>
          {/* Output Display */}
          <div className="w-full overflow-x-auto no-scrollbar text-right">
              <div className="text-4xl md:text-5xl font-bold text-white tracking-tight whitespace-nowrap leading-tight">
                {current 
                    ? formatNumber(current) 
                    : (previous && operation ? formatNumber(previous) : '0')
                }
              </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-4 gap-4 md:gap-5 justify-items-center">
          <button onClick={clearAll} className={`${actionBtn} text-red-300`}>AC</button>
          <button onClick={deleteLast} className={actionBtn}><Delete size={28}/></button>
          <button onClick={() => chooseOperation('%')} className={actionBtn}>%</button>
          <button onClick={() => chooseOperation('÷')} className={opBtn}>÷</button>

          <button onClick={() => appendNumber('7')} className={numBtn}>7</button>
          <button onClick={() => appendNumber('8')} className={numBtn}>8</button>
          <button onClick={() => appendNumber('9')} className={numBtn}>9</button>
          <button onClick={() => chooseOperation('×')} className={opBtn}>×</button>

          <button onClick={() => appendNumber('4')} className={numBtn}>4</button>
          <button onClick={() => appendNumber('5')} className={numBtn}>5</button>
          <button onClick={() => appendNumber('6')} className={numBtn}>6</button>
          <button onClick={() => chooseOperation('-')} className={opBtn}>-</button>

          <button onClick={() => appendNumber('1')} className={numBtn}>1</button>
          <button onClick={() => appendNumber('2')} className={numBtn}>2</button>
          <button onClick={() => appendNumber('3')} className={numBtn}>3</button>
          <button onClick={() => chooseOperation('+')} className={opBtn}>+</button>

          <button onClick={() => appendNumber('00')} className={numBtn}>00</button>
          <button onClick={() => appendNumber('0')} className={numBtn}>0</button>
          <button onClick={() => appendNumber('.')} className={numBtn}>.</button>
          <button onClick={compute} className={`${btnClass} bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30`}>=</button>
        </div>
      </Card>
      
      {/* History Hint */}
      {history.length > 0 && (
          <div className="mt-6 w-full max-w-md bg-slate-900/50 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
             <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-white/5 pb-2">
                 <History size={16} />
                 <span className="text-xs font-semibold uppercase tracking-wider">পূর্ববর্তী হিসাব</span>
             </div>
             <div className="space-y-1">
                 {history.map((h, i) => (
                     <div key={i} className="text-right text-slate-300 text-sm font-mono opacity-70 break-all">{h}</div>
                 ))}
             </div>
          </div>
      )}
    </div>
  );
};

export default Calculator;