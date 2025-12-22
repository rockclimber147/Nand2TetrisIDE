import React from 'react';
import type { SymbolScope } from '../../core/SymbolTable/types';

interface SymbolTableVisualizerProps {
  scope: SymbolScope | null;
}

export const SymbolTableVisualizer: React.FC<SymbolTableVisualizerProps> = ({ scope }) => {
  if (!scope) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 italic text-sm bg-[#1e1e1e]">
        No symbol table data available.
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#1e1e1e] overflow-auto p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="text-blue-400">#</span> {scope.name}
          </h2>
          <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-semibold">
            Project Symbol Hierarchy
          </p>
        </header>

        <ScopeSection scope={scope} depth={0} />
      </div>
    </div>
  );
};

const ScopeSection = ({ scope, depth }: { scope: SymbolScope; depth: number }) => {
  const symbolNames = Object.keys(scope.symbols);

  // Determine table columns based on the first symbol's metadata keys
  const columns = symbolNames.length > 0 ? Object.keys(scope.symbols[symbolNames[0]]) : [];

  return (
    <div className={`mb-8 ${depth > 0 ? 'ml-6 border-l border-slate-800 pl-6' : ''}`}>
      {/* Scope Header */}
      <div className="flex items-center justify-between mb-3 group">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500/50" />
          <h3 className="font-mono text-sm font-bold text-blue-300 group-hover:text-blue-200 transition-colors">
            {scope.name}
          </h3>
          {scope.metadata &&
            Object.entries(scope.metadata).map(([key, val]) => (
              <span
                key={key}
                className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700"
              >
                {key}: <span className="text-slate-200">{val}</span>
              </span>
            ))}
        </div>
      </div>

      {/* Local Symbols Table */}
      {symbolNames.length > 0 ? (
        <div className="overflow-hidden rounded-md border border-slate-800 bg-[#252526] mb-6">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#323233] text-slate-400 uppercase text-[10px] tracking-tight">
                <th className="px-4 py-2 font-semibold border-b border-black">Identifier</th>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-2 font-semibold border-b border-black">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {symbolNames.map((name) => (
                <tr key={name} className="hover:bg-blue-500/5 transition-colors group">
                  <td className="px-4 py-2 font-mono text-amber-200 group-hover:text-amber-100">
                    {name}
                  </td>
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-2 text-slate-300 font-mono">
                      {formatValue(scope.symbols[name][col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mb-6 px-4 py-2 text-[11px] text-slate-600 italic border border-dashed border-slate-800 rounded">
          No symbols defined in this scope.
        </div>
      )}

      {/* Recursive Render of Children */}
      {Object.values(scope.children).map((childScope, idx) => (
        <ScopeSection key={`${childScope.name}-${idx}`} scope={childScope} depth={depth + 1} />
      ))}
    </div>
  );
};

const formatValue = (val: string | number | boolean) => {
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  return val;
};
