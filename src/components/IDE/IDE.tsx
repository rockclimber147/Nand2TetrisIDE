import { useState, useCallback, useEffect } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import JSZip from 'jszip';
import { FileExplorer } from './FileExplorer';
import { GenericEditor } from './GenericEditor';
import { type MonacoLanguageSpec } from '../../core/Editor/types';
import { LanguageDriver } from '../../core/Parser/LanguageDriver';
import { CompilerError } from '../../core/Errors';
import { ASTVisualizer } from './UINode';
import type { UINode } from '../../core/Languages/Jack/Visitors/UITreeVisitor/types';

interface IDEProps {
  languageSpec: MonacoLanguageSpec;
  driver: LanguageDriver;
  title: string;
}

export const IDE = ({ languageSpec, driver, title }: IDEProps) => {
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFileName, setActiveFileName] = useState<string | null>(null);
  const [allErrors, setAllErrors] = useState<Record<string, CompilerError[]>>({});
  const [activeTree, setActiveTree] = useState<UINode | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'tree'>('editor');
  const handleUpload = useCallback((newFiles: Record<string, string>) => {
    setFiles(newFiles);
    const firstFile = Object.keys(newFiles)[0];
    if (firstFile) setActiveFileName(firstFile);
  }, []);

  const handleCodeChange = useCallback(
    (newCode: string | undefined) => {
      if (activeFileName && newCode !== undefined) {
        setFiles((prev) => ({
          ...prev,
          [activeFileName]: newCode,
        }));

        const newErrors = driver.compileProject(files).errors;
        setAllErrors(newErrors);
      }
    },
    [activeFileName],
  );

  const handleSave = async () => {
    const zip = new JSZip();
    Object.entries(files).forEach(([name, content]) => zip.file(name, content));
    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.toLowerCase()}_project.zip`;
    link.click();
  };

  const handleFileCreate = (name: string) => {
    if (files[name] !== undefined) return;

    setFiles((prev) => ({
      ...prev,
      [name]: '',
    }));

    // 3. Focus the new file immediately
    setActiveFileName(name);
  };

    useEffect(() => {
        if (!activeFileName || !files[activeFileName]) return;
        const result = driver.compileProject(files);
        setAllErrors(result.errors);
        
        if (result.trees && result.trees[activeFileName]) {
        setActiveTree(result.trees[activeFileName]);
        } else {
        setActiveTree(null);
        }
    }, [files, activeFileName, driver]);

    // Derived error set for Sidebar
    const errorFiles = new Set(
        Object.keys(allErrors).filter(k => allErrors[k].length > 0)
    );

return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e] text-slate-300">
      {/* Top Bar ... */}

      <main className="flex-1 min-h-0">
        <Group className="h-full">
          <Panel defaultSize={20} minSize={15} className="bg-[#252526]">
            <FileExplorer
              files={Object.keys(files)}
              activeFile={activeFileName}
              onFileSelect={setActiveFileName}
              onUpload={handleUpload}
              onSave={handleSave}
              onFileCreate={handleFileCreate}
            />
          </Panel>

          <Separator className="w-1 bg-black/20 hover:bg-blue-600 transition-colors cursor-col-resize" />

          <Panel className="flex flex-col min-w-0">
            {activeFileName ? (
              <>
                {/* TAB BAR */}
                <div className="flex bg-[#252526] border-b border-black h-9">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`px-4 text-xs flex items-center gap-2 border-r border-black transition-colors ${
                      activeTab === 'editor' ? 'bg-[#1e1e1e] text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setActiveTab('tree')}
                    className={`px-4 text-xs flex items-center gap-2 border-r border-black transition-colors ${
                      activeTab === 'tree' ? 'bg-[#1e1e1e] text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Tree Visualizer
                  </button>
                </div>

                {/* TAB CONTENT */}
                <div className="flex-1 min-h-0">
                  {activeTab === 'editor' ? (
                    <GenericEditor
                      spec={languageSpec}
                      path={activeFileName}
                      value={files[activeFileName]}
                      onChange={handleCodeChange}
                      errors={allErrors}
                    />
                  ) : (
                    <ASTVisualizer root={activeTree} />
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 italic text-sm">
                Select a file to begin
              </div>
            )}
          </Panel>
        </Group>
      </main>
    </div>
  );
};