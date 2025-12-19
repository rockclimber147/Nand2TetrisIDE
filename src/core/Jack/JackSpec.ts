import { TokenType } from "../Token";

export const JackTokenMatcher: [RegExp, TokenType][] = [
  [/^\/\/.*/, TokenType.SKIP],
  [/^\/\*[\s\S]*?\*\//, TokenType.SKIP],
  [/^\s+/, TokenType.SKIP],
  [/^(class|constructor|method|function|int|boolean|char|void|var|static|field|let|do|if|else|while|return|true|false|null|this)\b/, TokenType.KEYWORD],
  [/^[{}()\[\].,;+\-*/&|<>=~]/, TokenType.SYMBOL],
  [/^\d+/, TokenType.INT],
  [/^"[^"]*"/, TokenType.STRING],
  [/^[a-zA-Z_][a-zA-Z0-9_]*/, TokenType.IDENTIFIER],
];