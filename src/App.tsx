import { useState } from "react";
import { 
  Group, 
  Panel, 
  Separator 
} from "react-resizable-panels";
import JSZip from "jszip";
import { GenericEditor } from "./components/Editor/GenericEditor";
import { FileExplorer } from "./components/Editor/FileExplorer";
import { JackMonacoSpec } from "./core/Languages/Jack/JackMonacoSpec";

export default function App() {
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFileName, setActiveFileName] = useState<string | null>(null);
  const handleUpload = (newFiles: Record<string, string>) => {
    setFiles(newFiles);
    const firstFile = Object.keys(newFiles)[0];
    if (firstFile) setActiveFileName(firstFile);
  };

  const handleCodeChange = (newCode: string | undefined) => {
    if (activeFileName && newCode !== undefined) {
      setFiles(prev => ({
        ...prev,
        [activeFileName]: newCode
      }));
    }
  };

  const handleDownload = async () => {
  const zip = new JSZip();

  Object.entries(files).forEach(([fileName, content]) => {
    zip.file(fileName, content);
  });

  const content = await zip.generateAsync({ type: "blob" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = "jack_project.zip";
  link.click();
};

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e1e1e] text-slate-300">
      
      <div className="h-9 bg-[#323233] flex items-center px-4 text-xs border-b border-black shrink-0">
        <span className="text-blue-400 font-bold tracking-tight uppercase">Jack IDE</span>
      </div>

      <main className="flex-1 h-full">
        <Group className="h-full">
          
          <Panel defaultSize={200} collapsible minSize={150} className="bg-[#252526] flex flex-col">
            <FileExplorer 
              files={Object.keys(files)} 
              activeFile={activeFileName}
              onFileSelect={(name) => setActiveFileName(name)}
              onUpload={handleUpload}
              onSave={handleDownload}
            />
          </Panel>

          <Separator 
            className="w-1 bg-blue-900 transition-colors duration-200 
                       hover:bg-blue-600 active:bg-blue-500 
                       outline-none focus:outline-none cursor-col-resize" 
          />

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