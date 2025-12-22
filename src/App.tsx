import { 
  Group, 
  Panel, 
  Separator 
} from "react-resizable-panels";
import { JackEditor } from "./components/Editor/JackEditor";

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e1e1e] text-slate-300">
      
      {/* Top Bar */}
      <div className="h-9 bg-[#323233] flex items-center px-4 text-xs border-b border-black shrink-0">
        <span className="text-blue-400 font-bold tracking-tight">JACK COMPILER</span>
        <span className="mx-2 text-slate-600">|</span>
        <span className="text-slate-400">File</span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full">
        <Group className="h-full">
          
          <Panel defaultSize={300} collapsible minSize={100} className="bg-[#252526] flex flex-col">
            <div className="p-3 text-[11px] uppercase tracking-wider font-bold text-slate-500">
              Explorer
            </div>
            <div className="flex-1 p-4 border-t border-slate-800 italic text-slate-600 text-xs">
              Drag files here to begin...
            </div>
          </Panel>
          <Separator 
            className="w-1 bg-blue-900 transition-colors duration-200 
                      hover:bg-blue-600 active:bg-blue-500 
                      outline-none focus:outline-none" 
          />
          <Panel className="flex flex-col min-w-0">
              <JackEditor />
          </Panel>

        </Group>
      </main>
    </div>
  );
}