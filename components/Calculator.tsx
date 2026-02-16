
import React, { useState } from 'react';
import { Delete, Info } from 'lucide-react';

const Calculator: React.FC = () => {
  const [current, setCurrent] = useState('');
  const [expression, setExpression] = useState('');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [isFinalResult, setIsFinalResult] = useState(false);

  const formatNumber = (num: string) => {
    if (!num) return '';
    if (num === 'Error') return 'Error';
    const [integer, decimal] = num.split('.');
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
  };

  const calculate = (a: string, b: string, op: string): string => {
    const numA = parseFloat(a.replace(/,/g, ''));
    const numB = parseFloat(b.replace(/,/g, ''));
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

    const resultStr = res.toString();
    if (resultStr.includes('.') && resultStr.length > 12) {
       return parseFloat(res.toFixed(8)).toString();
    }
    return resultStr;
  };

  const appendNumber = (num: string) => {
    if (isFinalResult) {
      setCurrent(num);
      setExpression(num);
      setIsFinalResult(false);
      return;
    }
    if (num === '.' && current.includes('.')) return;
    
    // Limits
    if (current.length > 12) return;

    setCurrent(current + num);
    setExpression(expression + num);
  };

  const chooseOperation = (op: string) => {
    if (isFinalResult) {
      setPrevValue(current);
      setOperation(op);
      setExpression(current + ' ' + op + ' ');
      setCurrent('');
      setIsFinalResult(false);
      return;
    }

    if (current === '') {
      if (expression !== '') {
        setOperation(op);
        setExpression(expression.trim().slice(0, -1) + op + ' ');
      }
      return;
    }

    if (prevValue !== null && operation !== null) {
      const result = calculate(prevValue, current, operation);
      setPrevValue(result);
      setOperation(op);
      setExpression(expression + ' ' + op + ' ');
      setCurrent('');
    } else {
      setPrevValue(current);
      setOperation(op);
      setExpression(expression + ' ' + op + ' ');
      setCurrent('');
    }
  };

  const compute = () => {
    if (!prevValue || !current || !operation) return;
    const result = calculate(prevValue, current, operation);
    setCurrent(result);
    setExpression(expression + ' = ' + result);
    setPrevValue(null);
    setOperation(null);
    setIsFinalResult(true);
  };

  const deleteLast = () => {
    if (isFinalResult) {
      clearAll();
      return;
    }
    setCurrent(current.slice(0, -1));
    setExpression(expression.slice(0, -1));
  };

  const clearAll = () => {
    setCurrent('');
    setExpression('');
    setPrevValue(null);
    setOperation(null);
    setIsFinalResult(false);
  };

  const btnBase = "relative flex items-center justify-center text-2xl font-semibold transition-all duration-100 active:scale-90 active:opacity-70 select-none overflow-hidden rounded-[1.5rem]";
  const numBtn = `${btnBase} bg-[#1e293b]/40 backdrop-blur-md text-white border border-white/5 hover:bg-[#1e293b]/60`;
  const opBtn = `${btnBase} bg-cyan-600/20 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-600/30`;
  const actionBtn = `${btnBase} bg-slate-800/40 text-slate-400 border border-white/5 hover:bg-slate-800/60`;
  const equalBtn = `${btnBase} bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border-none`;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[80vh] animate-fade-in-up px-2 pb-24">
      <div className="w-full bg-[#020617] rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden p-6 relative">
        
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="h-44 flex flex-col justify-end items-end mb-6 px-4">
          <div className="w-full overflow-x-auto no-scrollbar text-right mb-1">
            <span className="text-slate-500 font-medium text-lg whitespace-nowrap">
              {expression || ' '}
            </span>
          </div>
          <div className="w-full overflow-x-auto no-scrollbar text-right">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter whitespace-nowrap leading-none py-2 transition-all">
              {current ? formatNumber(current) : (isFinalResult ? '' : '0')}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 md:gap-4">
          <button onClick={clearAll} className={actionBtn + " text-red-400 font-bold"}>AC</button>
          <button onClick={deleteLast} className={actionBtn}><Delete size={22}/></button>
          <button onClick={() => chooseOperation('%')} className={actionBtn}>%</button>
          <button onClick={() => chooseOperation('÷')} className={opBtn}>÷</button>

          <button onClick={() => appendNumber('7')} className={numBtn}>7</button>
          <button onClick={() => appendNumber('8')} className={numBtn}>8</button>
          <button onClick={() => appendNumber('9')} className={numBtn}>9</button>
          <button onClick={() => chooseOperation('×')} className={opBtn}>×</button>

          <button onClick={() => appendNumber('4')} className={numBtn}>4</button>
          <button onClick={() => appendNumber('5')} className={numBtn}>5</button>
          <button onClick={() => appendNumber('6')} className={numBtn}>6</button>
          <button onClick={() => chooseOperation('-')} className={opBtn}>−</button>

          <button onClick={() => appendNumber('1')} className={numBtn}>1</button>
          <button onClick={() => appendNumber('2')} className={numBtn}>2</button>
          <button onClick={() => appendNumber('3')} className={numBtn}>3</button>
          <button onClick={() => chooseOperation('+')} className={opBtn}>+</button>

          <button onClick={() => appendNumber('0')} className={numBtn + " col-span-1"}>0</button>
          <button onClick={() => appendNumber('00')} className={numBtn}>00</button>
          <button onClick={() => appendNumber('.')} className={numBtn}>.</button>
          <button onClick={compute} className={equalBtn}>=</button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-slate-600 text-xs font-medium bg-white/5 px-4 py-2 rounded-full border border-white/5">
        <Info size={12} />
        <span>রিয়েল-টাইম সিকোয়েন্স ডিসপ্লে সক্রিয়</span>
      </div>
    </div>
  );
};

export default Calculator;
