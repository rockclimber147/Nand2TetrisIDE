import { useState } from "react";
import { 
  Group, 
  Panel, 
  Separator 
} from "react-resizable-panels";
import { GenericEditor } from "./components/Editor/GenericEditor";
import { FileExplorer } from "./components/Editor/FileExplorer";
import { JackMonacoSpec } from "./core/Languages/Jack/JackMonacoSpec";

export default function App() {
  // 1. Storage for files: { "Main.jack": "contents...", "Sys.jack": "..." }
  const [files, setFiles] = useState<Record<string, string>>({});
  
  // 2. Track which file the user clicked on
  const [activeFileName, setActiveFileName] = useState<string | null>(null);

  // Helper to handle folder upload
  const handleUpload = (newFiles: Record<string, string>) => {
    setFiles(newFiles);
    // Automatically open the first file found so the editor isn't empty
    const firstFile = Object.keys(newFiles)[0];
    if (firstFile) setActiveFileName(firstFile);
  };

  // Helper to update code when you type in Monaco
  const handleCodeChange = (newCode: string | undefined) => {
    if (activeFileName && newCode !== undefined) {
      setFiles(prev => ({
        ...prev,
        [activeFileName]: newCode
      }));
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e1e1e] text-slate-300">
      
      {/* Top Bar */}
      <div className="h-9 bg-[#323233] flex items-center px-4 text-xs border-b border-black shrink-0">
        <span className="text-blue-400 font-bold tracking-tight uppercase">Jack IDE</span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full">
        <Group className="h-full">
          
          {/* LEFT PANEL: File Explorer */}
          <Panel defaultSize={20} collapsible minSize={15} className="bg-[#252526] flex flex-col">
            <FileExplorer 
              files={Object.keys(files)} 
              activeFile={activeFileName}
              onFileSelect={(name) => setActiveFileName(name)}
              onUpload={handleUpload}
            />
          </Panel>

          <Separator 
            className="w-1 bg-blue-900 transition-colors duration-200 
                       hover:bg-blue-600 active:bg-blue-500 
                       outline-none focus:outline-none cursor-col-resize" 
          />

          {/* RIGHT PANEL: Editor */}
          <Panel className="flex flex-col min-w-0">
            {activeFileName ? (
              <GenericEditor 
                spec={JackMonacoSpec}
                path={activeFileName}
                value={files[activeFileName]} 
                onChange={handleCodeChange}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 italic">
                Select a file or upload a folder to begin
              </div>
            )}
          </Panel>

        </Group>
      </main>
    </div>
  );
}