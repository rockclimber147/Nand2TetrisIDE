import { type Token } from './Token';

export class CompilerError extends Error {
  public readonly line: number;
  public readonly column: number;
  public readonly lexeme: string;

  constructor(
    public readonly token: Token,
    message: string,
  ) {
    const fullMessage = `[Line ${token.line}:${token.column}] ${message} (Found ${token.type}: '${token.lexeme}')`;
    super(fullMessage);

    this.name = 'CompilerError';
    this.line = token.line;
    this.column = token.column;
    this.lexeme = token.lexeme;

    Object.setPrototypeOf(this, CompilerError.prototype);
  }
}
