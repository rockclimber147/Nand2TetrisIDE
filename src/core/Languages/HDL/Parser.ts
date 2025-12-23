import { BaseParser } from '../../Parser/BaseParser';
import { TokenType } from '../../Token';
import { HDLSpec } from './HDLSpec';
import { ASTNodeKind } from '../../AST/AST';
import type { HDLChipNode, HDLPinsNode, HDLPartInstanceNode, HDLPinConnection } from './AST';

export class HDLParser extends BaseParser<HDLChipNode> {
  public parse(): HDLChipNode {
    const startToken = this.validator.peek();

    this.validator.expectLexeme(HDLSpec.CHIP);
    const name = this.validator.expectType(TokenType.IDENTIFIER).lexeme;
    this.validator.expectLexeme(HDLSpec.L_BRACE);

    const inputs = this.parsePins(HDLSpec.IN);
    const outputs = this.parsePins(HDLSpec.OUT);

    this.validator.expectLexeme(HDLSpec.PARTS);
    this.validator.expectLexeme(HDLSpec.COLON);

    const parts: HDLPartInstanceNode[] = [];
    while (!this.check(TokenType.SYMBOL, HDLSpec.R_BRACE)) {
      parts.push(this.parsePart());
    }

    const endToken = this.validator.expectLexeme(HDLSpec.R_BRACE);

    return {
      kind: ASTNodeKind.CHIP_DEFINITION,
      name,
      inputs,
      outputs,
      parts,
      startToken,
      endToken,
    };
  }

  private parsePins(kind: string): HDLPinsNode {
    const startToken = this.validator.peek();
    this.validator.expectLexeme(kind);

    const pins: { name: string; width?: number }[] = [];

    do {
      const name = this.validator.expectType(TokenType.IDENTIFIER).lexeme;
      let width: number | undefined;

      if (this.match(TokenType.SYMBOL, HDLSpec.L_BRACKET)) {
        width = parseInt(this.validator.expectType(TokenType.INT).lexeme);
        this.validator.expectLexeme(HDLSpec.R_BRACKET);
      }

      pins.push({ name, width });
    } while (this.match(TokenType.SYMBOL, HDLSpec.COMMA));

    const endToken = this.validator.expectLexeme(HDLSpec.SEMI);

    return {
      kind: ASTNodeKind.PINS,
      pins,
      startToken,
      endToken,
    };
  }

  private parsePart(): HDLPartInstanceNode {
    const startToken = this.validator.peek();
    const partName = this.validator.expectType(TokenType.IDENTIFIER).lexeme;

    this.validator.expectLexeme(HDLSpec.L_PAREN);

    const connections: HDLPinConnection[] = [];
    do {
      connections.push(this.parseConnection());
    } while (this.match(TokenType.SYMBOL, HDLSpec.COMMA));

    this.validator.expectLexeme(HDLSpec.R_PAREN);
    const endToken = this.validator.expectLexeme(HDLSpec.SEMI);

    return {
      kind: ASTNodeKind.PART,
      partName,
      connections,
      startToken,
      endToken,
    };
  }

  private parseConnection(): HDLPinConnection {
    const lhs = this.validator.expectType(TokenType.IDENTIFIER).lexeme;
    this.validator.expectLexeme(HDLSpec.EQ);
    const rhs = this.validator.expectType(TokenType.IDENTIFIER).lexeme;

    let rhsIndex: { start: number; end?: number } | undefined;

    if (this.match(TokenType.SYMBOL, HDLSpec.L_BRACKET)) {
      const start = parseInt(this.validator.expectType(TokenType.INT).lexeme);
      let end: number | undefined;

      if (this.match(TokenType.SYMBOL, HDLSpec.DOT)) {
        this.validator.expectLexeme(HDLSpec.DOT);
        end = parseInt(this.validator.expectType(TokenType.INT).lexeme);
      }

      this.validator.expectLexeme(HDLSpec.R_BRACKET);
      rhsIndex = { start, end };
    }

    return { lhs, rhs, rhsIndex };
  }
}
