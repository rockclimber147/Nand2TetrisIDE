import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Circle } from 'lucide-react';
import { type UINode } from '../../core/Languages/Jack/Visitors/UITreeVisitor/types';

interface TreeNodeProps {
  node: UINode;
  isLast: boolean;
  isRoot?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, isLast, isRoot = false }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="relative ml-4">
      {/* Vertical connector line for parent to children */}
      {!isRoot && (
        <div 
          className="absolute left-[-13px] top-[-8px] bottom-0 w-[1px] bg-slate-700" 
          style={{ height: isLast ? '22px' : '100%' }}
        />
      )}
      
      {/* Horizontal connector line to the node itself */}
      {!isRoot && (
        <div className="absolute left-[-13px] top-[14px] w-3 h-[1px] bg-slate-700" />
      )}

      <div className="flex items-center group py-1 select-none cursor-pointer">
        {hasChildren ? (
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-0.5 hover:bg-slate-700 rounded mr-1 z-10 bg-[#1e1e1e]"
          >
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-5 flex justify-center mr-1">
            <Circle size={4} className="fill-slate-600 text-slate-600" />
          </span>
        )}

        <div className="flex gap-2 text-xs font-mono">
          <span className="text-blue-400 font-bold">{node.content}</span>
          {node.extraContent && (
            <span className="text-amber-200 opacity-90">{node.extraContent}</span>
          )}
        </div>
      </div>

      {isOpen && hasChildren && (
        <div className="ml-1">
          {node.children.map((child: UINode, index: number) => (
            <TreeNode 
              key={index} 
              node={child} 
              isLast={index === node.children.length - 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ASTVisualizer: React.FC<{ root: UINode | null }> = ({ root }) => {
  if (!root) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 italic text-sm">
        No AST available. Parse a file to see the tree.
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#1e1e1e] text-slate-300 p-4 overflow-auto">
      <div className="mb-4 text-[11px] uppercase tracking-wider font-bold text-slate-500">
        AST Visualizer
      </div>
      <TreeNode node={root} isLast={true} isRoot={true} />
    </div>
  );
};