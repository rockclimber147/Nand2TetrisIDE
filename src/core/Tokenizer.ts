import { TokenType, type Token } from './Token';

export class GenericTokenizer {
  private cursor = 0;
  private line = 1;
  private column = 1;

  constructor(
    private source: string,
    private spec: [RegExp, TokenType][],
  ) {}

  tokenize(): Token[] {
    const tokens: Token[] = [];
    while (this.cursor < this.source.length) {
      const remaining = this.source.slice(this.cursor);
      let matched = false;

      for (const [regex, type] of this.spec) {
        const match = regex.exec(remaining);
        if (match && match.index === 0) {
          const value = match[0];

          if (type !== TokenType.SKIP) {
            tokens.push({ type, lexeme: value, line: this.line, column: this.column });
          }

          this.advance(value);
          matched = true;
          break;
        }
      }

      if (!matched) {
        throw new Error(
          `Unexpected character at line ${this.line}, col ${this.column}: ${this.source[this.cursor]}`,
        );
      }
    }
    return tokens;
  }

  private advance(value: string) {
    const lines = value.split(/\r?\n/);

    if (lines.length > 1) {
      this.line += lines.length - 1;
      this.column = lines[lines.length - 1].length + 1;
    } else {
      this.column += value.length;
    }

    this.cursor += value.length;
  }
}
