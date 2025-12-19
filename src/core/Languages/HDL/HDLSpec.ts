import { TokenType } from '../../Token';

export const HDLTokenMatcher: [RegExp, TokenType][] = [
  [/^\s+/, TokenType.SKIP],
  [/^\/\/.*/, TokenType.SKIP],
  [/^\/\*[\s\S]*?\*\//, TokenType.SKIP],
  [/^(CHIP|IN|OUT|PARTS|BUILTIN|CLOCKED)\b/, TokenType.KEYWORD],
  [/^(true|false)\b/, TokenType.KEYWORD],
  [/^[{}()\[\].,;=:]/, TokenType.SYMBOL],
  [/^\d+/, TokenType.INT],
  [/^[a-zA-Z_][a-zA-Z0-9_]*/, TokenType.IDENTIFIER],
];
