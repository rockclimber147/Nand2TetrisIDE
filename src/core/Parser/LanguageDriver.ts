import { CompilerError } from '../Errors';
import type { UINode } from '../Languages/Jack/Visitors/UITreeVisitor/types';

export interface CompilationResponse {
  errors: Record<string, CompilerError[]>;
  trees: Record<string, UINode>;
}

export abstract class LanguageDriver {
  abstract compileProject(files: Record<string, string>): CompilationResponse;
}
