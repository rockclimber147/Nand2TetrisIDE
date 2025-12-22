import { CompilerError } from "../Errors";

export interface CompilationResult<T> {
  ast: T | null;
  errors: CompilerError[];
}

export abstract class LanguageDriver<T_AST> {
  abstract compile(source: string): CompilationResult<T_AST>;
}