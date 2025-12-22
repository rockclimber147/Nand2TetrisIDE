import { CompilerError } from '../Errors';

export interface CompilationResult<T> {
  ast: T | null;
  errors: CompilerError[];
}

export abstract class LanguageDriver {
  abstract compileProject(files: Record<string, string>): Record<string, CompilerError[]>;
}
