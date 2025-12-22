import { useState, useCallback, useEffect } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import JSZip from "jszip";
import { FileExplorer } from "./FileExplorer";
import { GenericEditor } from "./GenericEditor";
import { type MonacoLanguageSpec } from "../../core/Editor/types";
import { LanguageDriver } from "../../core/Parser/LanguageDriver";
import { CompilerError } from "../../core/Errors";

interface IDEProps {
  languageSpec: MonacoLanguageSpec;
  driver: LanguageDriver<any>;
  title: string;
}

export const IDE = ({ languageSpec, driver, title }: IDEProps) => {
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFileName, setActiveFileName] = useState<string | null>(null);
  const [errors, setErrors] = useState<CompilerError[]>([]);

  const handleUpload = useCallback((newFiles: Record<string, string>) => {
    setFiles(newFiles);
    const firstFile = Object.keys(newFiles)[0];
    if (firstFile) setActiveFileName(firstFile);
  }, []);

  const handleCodeChange = useCallback((newCode: string | undefined) => {
    if (activeFileName && newCode !== undefined) {
      setFiles((prev) => ({
        ...prev,
        [activeFileName]: newCode,
      }));

    const { errors: newErrors } = driver.compile(files[activeFileName]);
    setErrors(newErrors);
    }
  }, [activeFileName]);

  const handleSave = async () => {
    const zip = new JSZip();
    Object.entries(files).forEach(([name, content]) => zip.file(name, content));
    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.toLowerCase()}_project.zip`;
    link.click();
  };

  useEffect(() => {
    if (!activeFileName || !files[activeFileName]) return;

    const { errors: newErrors } = driver.compile(files[activeFileName]);
    setErrors(newErrors);

  }, [files, activeFileName, driver]);

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e] text-slate-300">
      {/* Top Bar */}
      <div className="h-9 bg-[#323233] flex items-center px-4 text-xs border-b border-black shrink-0">
        <span className="text-blue-400 font-bold tracking-tight uppercase">{title}</span>
        <span className="mx-2 text-slate-600">|</span>
        <span className="text-slate-400">{activeFileName || "No file open"}</span>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-h-0">
        <Group className="h-full">
          <Panel defaultSize={200} collapsible minSize={150} className="bg-[#252526]">
            <FileExplorer
              files={Object.keys(files)}
              activeFile={activeFileName}
              onFileSelect={setActiveFileName}
              onUpload={handleUpload}
              onSave={handleSave}
            />
          </Panel>

          <Separator 
            className="w-1 bg-blue-900 transition-colors hover:bg-blue-600 active:bg-blue-500 outline-none cursor-col-resize" 
          />

          <Panel className="flex flex-col min-w-0">
            {activeFileName ? (
              <GenericEditor
                spec={languageSpec}
                path={activeFileName}
                value={files[activeFileName]}
                onChange={handleCodeChange}
                errors={errors}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 italic text-sm">
                Upload a folder to begin editing
              </div>
            )}
          </Panel>
        </Group>
      </main>
    </div>
  );
};