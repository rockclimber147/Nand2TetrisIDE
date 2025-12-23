// src/components/Sidebar/FileExplorer.tsx
import { useRef, useState } from 'react';
import { FileCode, FilePlus, UploadCloud, Download, Trash2 } from 'lucide-react'; // Optional: npm install lucide-react

interface FileExplorerProps {
  files: string[];
  activeFile: string | null;
  onFileSelect: (name: string) => void;
  onUpload: (files: Record<string, string>) => void;
  onSave: () => void;
  onFileCreate: (name: string) => void;
  onFileDelete: (name: string) => void;
  errorFiles: Set<string>;
}

export const FileExplorer = ({
  files,
  activeFile,
  onFileSelect,
  onUpload,
  onSave,
  onFileCreate,
  onFileDelete,
  errorFiles,
}: FileExplorerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');

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

  const handleCreateSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newFileName.trim()) {
      // Basic check: Ensure extension is valid for your compiler
      const name = newFileName.trim();
      onFileCreate(name);
      setNewFileName('');
      setIsCreating(false);
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewFileName('');
    }
  };

  const handleDelete = (e: React.MouseEvent, fileName: string) => {
    e.stopPropagation(); // Prevents the file from being selected when deleted
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      onFileDelete(fileName);
    }
  };

  return (
    <div className="flex flex-col h-full select-none border-r border-black/20 bg-[#252526]">
      <div className="flex items-center justify-between p-3 shrink-0">
        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
          Explorer
        </span>

        <div className="flex gap-1">
          <button
            onClick={() => setIsCreating(true)}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
            title="New File"
          >
            <FilePlus size={16} className="text-slate-400" />
          </button>

          <button
            onClick={onSave}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
            title="Download Project (ZIP)"
          >
            <Download size={16} className="text-slate-400" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
            title="Upload Folder"
          >
            <UploadCloud size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {/* INLINE NEW FILE INPUT */}
        {isCreating && (
          <div className="px-4 py-1.5 flex items-center gap-2 bg-[#37373d]">
            <FileCode size={14} className="text-blue-400" />
            <input
              autoFocus
              className="bg-transparent outline-none text-sm text-white w-full border border-blue-500 px-1"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={handleCreateSubmit}
              onBlur={() => setIsCreating(false)}
              placeholder="filename.jack"
            />
          </div>
        )}

        {files.length === 0 && !isCreating ? (
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
            const hasError = errorFiles.has(fileName);

            return (
            <div
              key={fileName}
              onClick={() => onFileSelect(fileName)}
              className={`
                group flex items-center justify-between px-4 py-1.5 cursor-pointer text-sm transition-colors
                ${isActive ? 'bg-[#37373d] text-white' : hasError ? 'text-red-400 hover:bg-[#2a2d2e]' : 'text-slate-400 hover:bg-[#2a2d2e] hover:text-slate-200'}
              `}
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode size={14} className={hasError ? 'text-red-500' : isActive ? 'text-blue-400' : 'text-slate-500'} />
                <span className="truncate">{fileName}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                {/* Visual indicator for errors */}
                {hasError && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                
                {/* DELETE BUTTON - Visible on hover */}
                <button
                  onClick={(e) => handleDelete(e, fileName)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-600 rounded text-slate-400 hover:text-red-400 transition-all"
                  title="Delete File"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
          })
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFolderUpload}
        className="hidden"
        multiple
        {...({ webkitdirectory: '', directory: '' } as any)}
      />
    </div>
  );
};
