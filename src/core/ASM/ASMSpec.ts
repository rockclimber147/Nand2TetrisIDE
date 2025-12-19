import { TokenType } from "../Token";

export const ASMTokenMatcher: [RegExp, TokenType][] = [
  [/^[ \t\r]+/, TokenType.SKIP],
  [/^\/\/.*/, TokenType.SKIP],
  [/^\n/, TokenType.NEWLINE],
  [/^[@=;()\-+&|!]/, TokenType.SYMBOL],
  [/^\d+/, TokenType.INT],
  [/^[a-zA-Z_$.:][a-zA-Z0-9_$.:]*/, TokenType.IDENTIFIER],
];