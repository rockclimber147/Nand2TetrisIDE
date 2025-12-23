// src/App.tsx
import { useState } from 'react';
import { IDE } from './components/IDE';
import { Project, type EditorMode } from './components/Project';

// Language Specs
import { JackMonacoSpec } from './core/Languages/Jack/JackMonacoSpec';
import { JackDriver } from './core/Languages/Jack/JackDriver';
import { HDLMonacoSpec } from './core/Languages/HDL/HDLMonacoSpec';
import { HDLDriver } from './core/Languages/HDL/HDLDriver';

export default function App() {
  const [mode, setMode] = useState<EditorMode>('jack');

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#1e1e1e]">
      <Project activeMode={mode} onModeChange={setMode} />

      <main className="flex-1 min-h-0">
        {mode === 'jack' ? (
          <IDE
            key="jack-project"
            title="Jack Compiler"
            languageSpec={JackMonacoSpec}
            driver={new JackDriver()}
          />
        ) : (
          <IDE
            key="hdl-project"
            title="HDL Editor"
            languageSpec={HDLMonacoSpec}
            driver={new HDLDriver()}
          />
        )}
      </main>
    </div>
  );
}
