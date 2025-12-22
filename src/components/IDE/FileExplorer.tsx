// src/components/Sidebar/FileExplorer.tsx
import { useRef } from 'react';
import { FileCode, UploadCloud, Download } from 'lucide-react'; // Optional: npm install lucide-react

interface FileExplorerProps {
  files: string[];
  activeFile: string | null;
  onFileSelect: (name: string) => void;
  onUpload: (files: Record<string, string>) => void;
  onSave: () => void;
}

export const FileExplorer = ({ files, activeFile, onFileSelect, onUpload, onSave }: FileExplorerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;
    const newFiles: Record<string, string> = {};
    const promises = Array.from(uploadedFiles).map(async (file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jack', 'hdl', 'vm', 'asm'];
      
      if (validExtensions.includes(extension || '')) {
        const text = await file.text();
        newFiles[file.name] = text;
      }
    });

    await Promise.all(promises);
    onUpload(newFiles);
    event.target.value = '';
  };

  return (
<div className="flex flex-col h-full select-none border-r border-black/20">
      <div className="flex items-center justify-between p-3 shrink-0">
        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
          Explorer
        </span>
        
        <div className="flex gap-1">
          {/* SAVE BUTTON */}
          <button 
            onClick={onSave}
            disabled={files.length === 0}
            className="p-1 hover:bg-slate-700 rounded transition-colors disabled:opacity-30"
            title="Download Project (ZIP)"
          >
            <Download size={16} className="text-slate-400" />
          </button>

          {/* UPLOAD BUTTON */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
            title="Upload Folder"
          >
            <UploadCloud size={16} className="text-slate-400" />
          </button>
        </div>

        <input
        type="file"
        ref={fileInputRef}
        onChange={handleFolderUpload}
        className="hidden"
        multiple
        {...{ webkitdirectory: "", directory: "" } as any}
        />
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {files.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-slate-600 italic">No files loaded.</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-xs text-blue-400 hover:underline"
            >
              Open a folder
            </button>
          </div>
        ) : (
          files.sort().map((fileName) => {
            const isActive = fileName === activeFile;
            return (
              <div
                key={fileName}
                onClick={() => onFileSelect(fileName)}
                className={`
                  flex items-center gap-2 px-4 py-1.5 cursor-pointer text-sm transition-colors
                  ${isActive 
                    ? 'bg-[#37373d] text-white' 
                    : 'text-slate-400 hover:bg-[#2a2d2e] hover:text-slate-200'}
                `}
              >
                <FileCode size={14} className={isActive ? "text-blue-400" : "text-slate-500"} />
                <span className="truncate">{fileName}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};