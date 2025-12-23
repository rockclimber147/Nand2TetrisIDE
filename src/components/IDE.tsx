import { useState, useCallback } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import JSZip from 'jszip';
import { FileExplorer } from './FileExplorer';
import { GenericEditor } from './GenericEditor';
import { type MonacoLanguageSpec } from '../core/Editor/types';
import { LanguageDriver } from '../core/LanguageDriver';
import { ASTVisualizer } from './TreeVisualizer';
import { SymbolTableVisualizer } from './SymbolTableVisualizer';
import { useCompiler } from '../Hooks/useCompiler';

interface IDEProps {
  languageSpec: MonacoLanguageSpec;
  driver: LanguageDriver;
  title: string;
}

export const IDE = ({ languageSpec, driver, title }: IDEProps) => {
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFileName, setActiveFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'tree' | 'symbols'>('editor');

  // Compilation state from hook
  const { errors, symbolTable, activeTree } = useCompiler(driver, files, activeFileName);

  // Consolidated Handlers
  const handleCodeChange = useCallback(
    (code: string | undefined) => {
      if (activeFileName && code !== undefined)
        setFiles((prev) => ({ ...prev, [activeFileName]: code }));
    },
    [activeFileName],
  );

  const handleFileCreate = (name: string) => {
    if (files[name]) return;
    setFiles((prev) => ({ ...prev, [name]: '' }));
    setActiveFileName(name);
  };

  const handleFileDelete = useCallback(
    (name: string) => {
      setFiles(({ [name]: _, ...rest }) => rest);
      if (activeFileName === name) setActiveFileName(null);
    },
    [activeFileName],
  );

  const handleSave = async () => {
    const zip = new JSZip();
    Object.entries(files).forEach(([n, c]) => zip.file(n, c));
    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.toLowerCase()}.zip`;
    link.click();
  };

  const errorFiles = new Set(Object.keys(errors).filter((k) => errors[k].length > 0));

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e] text-slate-300">
      <main className="flex-1 min-h-0">
        <Group className="h-full">
          <Panel defaultSize={200} minSize={150} className="bg-[#252526]">
            <FileExplorer
              files={Object.keys(files)}
              activeFile={activeFileName}
              onFileSelect={setActiveFileName}
              onUpload={setFiles}
              onSave={handleSave}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
              errorFiles={errorFiles}
            />
          </Panel>

          <Separator className="w-1 bg-black/20 hover:bg-blue-600 transition-colors" />

          <Panel className="flex flex-col min-w-0">
            {activeFileName ? (
              <>
                <div className="flex bg-[#252526] border-b border-black h-9">
                  {(['editor', 'tree', 'symbols'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 text-xs capitalize transition-colors border-r border-black ${
                        activeTab === tab
                          ? 'bg-[#1e1e1e] text-white'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {tab === 'tree' ? 'Tree Visualizer' : tab}
                    </button>
                  ))}
                </div>

                <div className="flex-1 min-h-0 overflow-auto">
                  {activeTab === 'editor' && (
                    <GenericEditor
                      spec={languageSpec}
                      path={activeFileName}
                      value={files[activeFileName]}
                      onChange={handleCodeChange}
                      errors={errors}
                    />
                  )}
                  {activeTab === 'tree' && <ASTVisualizer root={activeTree} />}
                  {activeTab === 'symbols' && <SymbolTableVisualizer scope={symbolTable} />}
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
