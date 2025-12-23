import { useEffect, useState } from "react";
import { LanguageDriver } from "../core/LanguageDriver";
import { CompilerError } from "../core/Errors";
import { type UINode } from "../core/Languages/Jack/Visitors/UITreeVisitor/types";
import { type SymbolScope } from "../core/SymbolTable/types";

export const useCompiler = (driver: LanguageDriver, files: Record<string, string>, activeFileName: string | null) => {
  const [data, setData] = useState({
    errors: {} as Record<string, CompilerError[]>,
    symbolTable: null as SymbolScope | null,
    activeTree: null as UINode | null
  });

  useEffect(() => {
    if (!activeFileName) return;
    const timer = setTimeout(() => {
      const result = driver.compileProject(files);
      setData({
        errors: result.errors,
        symbolTable: result.symbolTable || null,
        activeTree: (result.trees && result.trees[activeFileName]) || null
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [files, activeFileName, driver]);

  return data;
};