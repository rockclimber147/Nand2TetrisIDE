import { TokenType } from '../../Token';

export const VMTokenMatcher: [RegExp, TokenType][] = [
  [/^[ \t\r]+/, TokenType.SKIP],
  [/^\/\/.*/, TokenType.SKIP],
  [/^\n/, TokenType.NEWLINE],
  [/^(push|pop|add|sub|neg|eq|gt|lt|and|or|not)\b/, TokenType.KEYWORD],
  [/^(label|goto|if-goto|function|call|return)\b/, TokenType.KEYWORD],
  [/^(argument|local|static|this|that|pointer|temp|constant)\b/, TokenType.KEYWORD],
  [/^\d+/, TokenType.INT],
  [/^[a-zA-Z_$.:][a-zA-Z0-9_$.:]*/, TokenType.IDENTIFIER],
];
