import { describe, expect, test } from 'vitest';
import { GenericTokenizer } from "../../src/core/Tokenizer";
import { TokenType } from '../../src/core/Token';
import { ASMSpec } from '../../src/core/ASM/ASMSpec';

describe('ASM Tokenizer', () => {

  test('should tokenize A-instructions', () => {
    const source = "@100\n@LOOP";
    const tokenizer = new GenericTokenizer(source, ASMSpec);
    const tokens = tokenizer.tokenize();

    // @100
    expect(tokens[0].lexeme).toBe("@");
    expect(tokens[1]).toMatchObject({ type: TokenType.INT, lexeme: "100" });
    
    // @LOOP
    expect(tokens[3].lexeme).toBe("@");
    expect(tokens[4]).toMatchObject({ type: TokenType.IDENTIFIER, lexeme: "LOOP" });
  });

  test('should tokenize C-instructions', () => {
    const source = "D=M+1;JGT";
    const tokenizer = new GenericTokenizer(source, ASMSpec);
    const tokens = tokenizer.tokenize();

    // D = M + 1 ; JGT
    expect(tokens[0].lexeme).toBe("D");
    expect(tokens[1].lexeme).toBe("=");
    expect(tokens[3].lexeme).toBe("+");
    expect(tokens[5].lexeme).toBe(";");
    expect(tokens[6].lexeme).toBe("JGT");
  });

  test('should tokenize labels', () => {
    const source = "(MY_LABEL)";
    const tokenizer = new GenericTokenizer(source, ASMSpec);
    const tokens = tokenizer.tokenize();

    expect(tokens[0].lexeme).toBe("(");
    expect(tokens[1].lexeme).toBe("MY_LABEL");
    expect(tokens[2].lexeme).toBe(")");
  });

  test('should track line numbers correctly with comments', () => {
    const source = `// Start
    @10
    D=A // inline
    (END)`;
    const tokenizer = new GenericTokenizer(source, ASMSpec);
    const tokens = tokenizer.tokenize();

    // (END) is on line 4
    const openParen = tokens.find(t => t.lexeme === "(");
    expect(openParen?.line).toBe(4);
  });
});