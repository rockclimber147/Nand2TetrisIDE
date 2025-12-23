import { useState } from 'react';
import { IDE } from './components/IDE';
import { JackMonacoSpec } from './core/Languages/Jack/JackMonacoSpec';
import { JackDriver } from './core/Languages/Jack/JackDriver';
import { HDLMonacoSpec } from './core/Languages/HDL/HDLMonacoSpec';
import { HDLDriver } from './core/Languages/HDL/HDLDriver';
import { Cpu, Code2 } from 'lucide-react';

type EditorMode = 'jack' | 'hdl';

export default function App() {
  const [mode, setMode] = useState<EditorMode>('jack');

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#1e1e1e]">
      {/* Root Language Switcher */}
      <div className="flex bg-[#2d2d2d] border-b border-black h-10 shrink-0 items-center px-4 gap-4">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-tighter">Nand2Tetris IDE</span>
        </div>

        <nav className="flex h-full">
          <button
            onClick={() => setMode('jack')}
            className={`px-4 text-xs flex items-center gap-2 transition-colors border-x border-black/20 ${
              mode === 'jack' ? 'bg-[#1e1e1e] text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Code2 size={14} />
            Jack Compiler
          </button>
          <button
            onClick={() => setMode('hdl')}
            className={`px-4 text-xs flex items-center gap-2 transition-colors border-r border-black/20 ${
              mode === 'hdl' ? 'bg-[#1e1e1e] text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Cpu size={14} />
            Hardware Simulator
          </button>
        </nav>
      </div>

      {/* Main IDE View */}
      <div className="flex-1 min-h-0">
        {mode === 'jack' ? (
          <IDE 
            key="jack-ide" // Key ensures state reset when switching modes
            languageSpec={JackMonacoSpec} 
            driver={new JackDriver()} 
            title="Jack Compiler" 
          />
        ) : (
          <IDE 
            key="hdl-ide" 
            languageSpec={HDLMonacoSpec} 
            driver={new HDLDriver()} 
            title="Hardware Simulator" 
          />
        )}
      </div>
    </div>
  );
}