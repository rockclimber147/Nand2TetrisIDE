import { CompilerError } from './Errors';
import type { UINode } from './Languages/Jack/Visitors/UITreeVisitor/types';
import type { SymbolScope } from './SymbolTable/types';

export interface CompilationResponse {
  errors: Record<string, CompilerError[]>;
  trees: Record<string, UINode>;
  symbolTable?: SymbolScope;
}

export abstract class LanguageDriver {
  abstract compileProject(files: Record<string, string>): CompilationResponse;
}
