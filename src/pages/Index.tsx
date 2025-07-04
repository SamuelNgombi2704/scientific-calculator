
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calculator, RotateCcw, History } from 'lucide-react';

const Index = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isRadians, setIsRadians] = useState(true);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setHistory(prev => [...prev, `${currentValue} ${operation} ${inputValue} = ${newValue}`]);
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '^':
        return Math.pow(firstValue, secondValue);
      default:
        return secondValue;
    }
  };

  const performScientificOperation = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(isRadians ? inputValue : (inputValue * Math.PI) / 180);
        break;
      case 'cos':
        result = Math.cos(isRadians ? inputValue : (inputValue * Math.PI) / 180);
        break;
      case 'tan':
        result = Math.tan(isRadians ? inputValue : (inputValue * Math.PI) / 180);
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      case 'sqrt':
        result = Math.sqrt(inputValue);
        break;
      case 'square':
        result = inputValue * inputValue;
        break;
      case 'inverse':
        result = 1 / inputValue;
        break;
      case 'factorial':
        result = factorial(inputValue);
        break;
      case 'abs':
        result = Math.abs(inputValue);
        break;
      default:
        return;
    }

    if (isNaN(result) || !isFinite(result)) {
      setDisplay('Error');
      return;
    }

    setDisplay(String(result));
    setHistory(prev => [...prev, `${func}(${inputValue}) = ${result}`]);
    setWaitingForOperand(true);
  };

  const factorial = (n: number): number => {
    if (n < 0 || n !== Math.floor(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const toggleAngleMode = () => {
    setIsRadians(!isRadians);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="h-6 w-6 text-white" />
              <h1 className="text-2xl font-bold text-white">Scientific Calculator</h1>
            </div>

            {/* Display */}
            <div className="mb-6">
              <div className="bg-black/50 rounded-lg p-4 min-h-[80px] flex items-center justify-end">
                <span className="text-3xl font-mono text-white break-all text-right">
                  {display}
                </span>
              </div>
              <div className="flex justify-between mt-2 text-sm text-white/70">
                <span>Memory: {memory !== 0 ? memory : 'Empty'}</span>
                <span>Mode: {isRadians ? 'RAD' : 'DEG'}</span>
              </div>
            </div>

            {/* Button Grid */}
            <div className="grid grid-cols-6 gap-2">
              {/* Row 1 - Memory and Mode */}
              <Button onClick={memoryClear} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold">MC</Button>
              <Button onClick={memoryRecall} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold">MR</Button>
              <Button onClick={memoryAdd} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold">M+</Button>
              <Button onClick={memorySubtract} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold">M-</Button>
              <Button onClick={toggleAngleMode} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">{isRadians ? 'RAD' : 'DEG'}</Button>
              <Button onClick={clear} className="bg-red-600 hover:bg-red-700 text-white font-semibold">C</Button>

              {/* Row 2 - Scientific Functions */}
              <Button onClick={() => performScientificOperation('sin')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">sin</Button>
              <Button onClick={() => performScientificOperation('cos')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">cos</Button>
              <Button onClick={() => performScientificOperation('tan')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">tan</Button>
              <Button onClick={() => performScientificOperation('log')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">log</Button>
              <Button onClick={() => performScientificOperation('ln')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">ln</Button>
              <Button onClick={clearEntry} className="bg-red-500 hover:bg-red-600 text-white font-semibold">CE</Button>

              {/* Row 3 - More Functions */}
              <Button onClick={() => performScientificOperation('sqrt')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">√</Button>
              <Button onClick={() => performScientificOperation('square')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">x²</Button>
              <Button onClick={() => performOperation('^')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">xʸ</Button>
              <Button onClick={() => performScientificOperation('inverse')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">1/x</Button>
              <Button onClick={() => performScientificOperation('factorial')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">n!</Button>
              <Button onClick={() => performOperation('÷')} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xl">÷</Button>

              {/* Row 4 - Numbers and Operations */}
              <Button onClick={() => inputNumber('7')} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold text-xl">7</Button>
              <Button onClick={() => inputNumber('8')} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold text-xl">8</Button>
              <Button onClick={() => inputNumber('9')} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold text-xl">9</Button>
              <Button onClick={() => performOperation('×')} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xl">×</Button>
              <Button onClick={() => performScientificOperation('abs')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">|x|</Button>
              <Button onClick={() => inputNumber('(')} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold text-xl">(</Button>

              {/* Row 5 */}
              <Button onClick={() => inputNumber('4')} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold text-xl">4</Button>
              <Button onClick={() => inputNumber('5')} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold text-xl">5</Button>
              <Button onClick={() => inputNumber('6')} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold text-xl">6</Button>
              <Button onClick={() => performOperation('-')} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xl">-</Button>
              <Button onClick={() => setDisplay(String(Math.PI))} className="bg-green-600 hover:bg-green-700 text-white font-semibold">π</Button>
              <Button onClick={() => inputNumber(')')} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold text-xl">)</Button>

              {/* Row 6 */}
              <Button onClick={() => inputNumber('1')} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold text-xl">1</Button>
              <Button onClick={() => inputNumber('2')} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold text-xl">2</Button>
              <Button onClick={() => inputNumber('3')} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold text-xl">3</Button>
              <Button onClick={() => performOperation('+')} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xl">+</Button>
              <Button onClick={() => setDisplay(String(Math.E))} className="bg-green-600 hover:bg-green-700 text-white font-semibold">e</Button>
              <Button onClick={() => setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display)} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold">±</Button>

              {/* Row 7 */}
              <Button onClick={() => inputNumber('0')} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold text-xl col-span-2">0</Button>
              <Button onClick={inputDecimal} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold text-xl">.</Button>
              <Button onClick={() => performOperation('=')} className="bg-green-600 hover:bg-green-700 text-white font-semibold text-xl col-span-3">=</Button>
            </div>
          </Card>
        </div>

        {/* History Panel */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-white" />
                <h2 className="text-lg font-semibold text-white">History</h2>
              </div>
              <Button
                onClick={clearHistory}
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="h-[400px]">
              {history.length === 0 ? (
                <p className="text-white/50 text-center mt-8">No calculations yet</p>
              ) : (
                <div className="space-y-2">
                  {history.slice().reverse().map((entry, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white/5 rounded-lg text-white text-sm font-mono break-all"
                    >
                      {entry}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
