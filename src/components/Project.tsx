import React from 'react';
import { Cpu, Code2 } from 'lucide-react';

export type EditorMode = 'jack' | 'hdl';

interface ProjectProps {
  activeMode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
}

export const Project: React.FC<ProjectProps> = ({ activeMode, onModeChange }) => {
  return (
    <div className="flex bg-[#2d2d2d] border-b border-black h-10 shrink-0 items-center px-4 gap-4">
      {/* Branding */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
          Nand2Tetris IDE
        </span>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex h-full">
        <SwitcherButton
          label="Jack Compiler"
          icon={<Code2 size={14} />}
          isActive={activeMode === 'jack'}
          onClick={() => onModeChange('jack')}
        />
        <SwitcherButton
          label="HDL Editor"
          icon={<Cpu size={14} />}
          isActive={activeMode === 'hdl'}
          onClick={() => onModeChange('hdl')}
        />
      </nav>
    </div>
  );
};

interface SwitcherButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const SwitcherButton = ({ label, icon, isActive, onClick }: SwitcherButtonProps) => (
  <button
    onClick={onClick}
    className={`
      px-4 text-[11px] flex items-center gap-2 transition-all border-r border-black/20
      ${
        isActive
          ? 'bg-[#1e1e1e] text-blue-400 shadow-[inset_0_2px_0_0_#60a5fa]'
          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
      }
    `}
  >
    {icon}
    {label}
  </button>
);
