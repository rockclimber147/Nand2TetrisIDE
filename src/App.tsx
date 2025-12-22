import { useState } from 'react';

import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center gap-8">
      
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
        Tailwind + Jack IDE
      </h1>

      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 flex flex-col items-center">
        <p className="text-slate-300 mb-6 font-mono">
          Testing Tailwind installation...
        </p>
        
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white rounded-lg font-bold shadow-lg"
        >
          Count is: {count}
        </button>
      </div>

      <p className="text-slate-500 text-sm italic">
        If the background is dark and the button is blue, Tailwind is working!
      </p>
    </div>
  );
}

export default App;
