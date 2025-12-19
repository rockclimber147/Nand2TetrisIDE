export enum TokenType {
  KEYWORD = 'KEYWORD',
  SYMBOL = 'SYMBOL',
  IDENTIFIER = 'IDENTIFIER',
  INT = 'INT',
  STRING = 'STRING',
  NEWLINE = 'NEWLINE',
  SKIP = 'SKIP',
  EOF = 'EOF',
}

export interface Token {
  type: TokenType;
  lexeme: string;
  line: number;
  column: number;
}
