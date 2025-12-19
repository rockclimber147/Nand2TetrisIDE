import { type Token, TokenType } from '../Token';
import { TokenValidator } from './TokenValidator';

export abstract class BaseParser<T_AST> {
  protected validator: TokenValidator;

  constructor(tokens: Token[]) {
    this.validator = new TokenValidator(tokens);
  }

  abstract parse(): T_AST;

  protected check(type: TokenType, lexeme?: string): boolean {
    const token = this.validator.peek(0);
    if (token.type === TokenType.EOF) return false;
    if (lexeme) return token.type === type && token.lexeme === lexeme;
    return token.type === type;
  }

  protected match(type: TokenType, lexeme?: string): boolean {
    if (this.check(type, lexeme)) {
      this.validator.expectType(type); // Advances the cursor
      return true;
    }
    return false;
  }

  protected skipNewlines(): void {
    while (this.check(TokenType.NEWLINE)) {
      this.validator.expectType(TokenType.NEWLINE);
    }
  }
}
