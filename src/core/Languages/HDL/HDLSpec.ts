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

export class HDLSpec {
  // --- Symbols ---
  static readonly L_BRACE = '{';
  static readonly R_BRACE = '}';
  static readonly L_PAREN = '(';
  static readonly R_PAREN = ')';
  static readonly L_BRACKET = '[';
  static readonly R_BRACKET = ']';
  static readonly DOT = '.';
  static readonly COMMA = ',';
  static readonly SEMI = ';';
  static readonly EQ = '=';
  static readonly COLON = ':';

  static readonly SYMBOLS = new Set([
    HDLSpec.L_BRACE,
    HDLSpec.R_BRACE,
    HDLSpec.L_PAREN,
    HDLSpec.R_PAREN,
    HDLSpec.L_BRACKET,
    HDLSpec.R_BRACKET,
    HDLSpec.DOT,
    HDLSpec.COMMA,
    HDLSpec.SEMI,
    HDLSpec.EQ,
    HDLSpec.COLON,
  ]);

  // --- Keywords ---
  static readonly CHIP = 'CHIP';
  static readonly IN = 'IN';
  static readonly OUT = 'OUT';
  static readonly PARTS = 'PARTS';
  static readonly BUILTIN = 'BUILTIN';
  static readonly CLOCKED = 'CLOCKED';
  
  // Constants
  static readonly TRUE = 'true';
  static readonly FALSE = 'false';

  static readonly KEYWORDS = new Set([
    HDLSpec.CHIP,
    HDLSpec.IN,
    HDLSpec.OUT,
    HDLSpec.PARTS,
    HDLSpec.BUILTIN,
    HDLSpec.CLOCKED,
    HDLSpec.TRUE,
    HDLSpec.FALSE,
  ]);

  // --- Useful Helpers for the HDL Parser ---
  static readonly IO_KEYWORDS = new Set([
    HDLSpec.IN,
    HDLSpec.OUT
  ]);
}
