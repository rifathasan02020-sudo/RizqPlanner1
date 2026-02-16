
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
    if (num === '.') return '.';
    const parts = num.split('.');
    const formattedInteger = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length > 1 ? `${formattedInteger}.${parts[1]}` : formattedInteger;
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
    return resultStr.length > 15 ? res.toPrecision(10).toString() : resultStr;
  };

  const appendNumber = (num: string) => {
    if (isFinalResult) {
      setCurrent(num);
      setExpression(num);
      setIsFinalResult(false);
      return;
    }
    if (num === '.' && current.includes('.')) return;
    if (current.length > 14) return;

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

    if (current === '' && prevValue !== null) {
      setOperation(op);
      setExpression(expression.trim().split(' ').slice(0, -1).join(' ') + ' ' + op + ' ');
      return;
    }

    if (current === '') return;

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

  const btnBase = "relative flex items-center justify-center text-3xl font-bold transition-all duration-100 active:scale-90 active:opacity-70 select-none overflow-hidden rounded-3xl h-20 md:h-24 lg:h-28";
  const numBtn = `${btnBase} bg-slate-900/40 backdrop-blur-md text-white border border-white/5 hover:bg-slate-800/60 shadow-inner`;
  const opBtn = `${btnBase} bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20`;
  const actionBtn = `${btnBase} bg-slate-800/60 text-slate-400 border border-white/10 hover:bg-slate-700/60`;
  const equalBtn = `${btnBase} bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 border-none`;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[85vh] animate-fade-in-up px-2 pb-24">
      <div className="w-full bg-[#020617] rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(6,182,212,0.1)] overflow-hidden p-6 md:p-10 relative">
        
        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        {/* Display Panel */}
        <div className="h-44 md:h-52 flex flex-col justify-end items-end mb-8 px-4 border-b border-white/5 pb-6">
          <div className="w-full overflow-x-auto no-scrollbar text-right mb-2">
            <span className="text-slate-500 font-medium text-lg md:text-2xl whitespace-nowrap tracking-wide">
              {expression || ' '}
            </span>
          </div>
          <div className="w-full overflow-x-auto no-scrollbar text-right">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter whitespace-nowrap leading-none py-2 transition-all">
              {current ? formatNumber(current) : (isFinalResult ? '' : '0')}
            </h1>
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-4 md:gap-6">
          <button onClick={clearAll} className={actionBtn + " text-red-500 text-xl md:text-3xl uppercase"}>AC</button>
          <button onClick={deleteLast} className={actionBtn}><Delete size={32}/></button>
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

          <button onClick={() => appendNumber('0')} className={numBtn}>0</button>
          <button onClick={() => appendNumber('00')} className={numBtn}>00</button>
          <button onClick={() => appendNumber('.')} className={numBtn}>.</button>
          <button onClick={compute} className={equalBtn}>=</button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 text-slate-500 text-sm md:text-base font-bold tracking-widest bg-white/5 px-8 py-4 rounded-full border border-white/5 uppercase">
        <Info size={16} className="text-cyan-500" />
        <span>স্মার্ট চেইন ক্যালকুলেশন সক্রিয়</span>
      </div>
    </div>
  );
};

export default Calculator;
