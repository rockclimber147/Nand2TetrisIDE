import { describe, expect, test } from 'vitest';
import { GenericTokenizer } from "../../src/core/Tokenizer";
import { TokenType } from '../../src/core/Token';
import { HDLSpec } from '../../src/core/HDL/HDLSpec';

describe('HDL Tokenizer', () => {

  test('should tokenize a basic CHIP header and pins', () => {
    const source = "CHIP And { IN a, b; OUT out; }";
    const tokenizer = new GenericTokenizer(source, HDLSpec);
    const tokens = tokenizer.tokenize();

    expect(tokens[0]).toMatchObject({ type: TokenType.KEYWORD, lexeme: "CHIP" });
    expect(tokens[1]).toMatchObject({ type: TokenType.IDENTIFIER, lexeme: "And" });
    expect(tokens[2]).toMatchObject({ type: TokenType.SYMBOL, lexeme: "{" });

    expect(tokens[3].lexeme).toBe("IN");
    expect(tokens[4].lexeme).toBe("a");
    expect(tokens[5].lexeme).toBe(",");
    expect(tokens[7].lexeme).toBe(";");
  });

  test('should handle bus notation and ranges', () => {
    const source = "IN in[16]; OUT out[8];";
    const tokenizer = new GenericTokenizer(source, HDLSpec);
    const tokens = tokenizer.tokenize();

    expect(tokens[1].lexeme).toBe("in");
    expect(tokens[2].lexeme).toBe("[");
    expect(tokens[3]).toMatchObject({ type: TokenType.INT, lexeme: "16" });
    expect(tokens[4].lexeme).toBe("]");
  });

  test('should tokenize part mapping with true/false constants', () => {
    const source = "Nand(a=in, b=true, out=w1);";
    const tokenizer = new GenericTokenizer(source, HDLSpec);
    const tokens = tokenizer.tokenize();

    expect(tokens[0].lexeme).toBe("Nand");
    
    expect(tokens[2].lexeme).toBe("a");
    expect(tokens[3].lexeme).toBe("=");
    expect(tokens[4].lexeme).toBe("in");

    expect(tokens[6].lexeme).toBe("b");
    expect(tokens[7].lexeme).toBe("=");
    expect(tokens[8]).toMatchObject({ type: TokenType.KEYWORD, lexeme: "true" });
  });

  test('should ignore block and line comments correctly', () => {
    const source = `
      /** * Multi-line 
       */
      CHIP Not { // single line
          IN in;
          OUT out;
      }
    `;
    const tokenizer = new GenericTokenizer(source, HDLSpec);
    const tokens = tokenizer.tokenize();

    expect(tokens[0].lexeme).toBe("CHIP");
    expect(tokens[0].line).toBe(5);
  });

  test('should handle complex spacing and formatting', () => {
    const source = "PARTS:And(  a =  a  ,b=b,out=out  );";
    const tokenizer = new GenericTokenizer(source, HDLSpec);
    const tokens = tokenizer.tokenize();

    expect(tokens[0].lexeme).toBe("PARTS");
    expect(tokens[1].lexeme).toBe(":");
    expect(tokens[2].lexeme).toBe("And");
    
    const equalsToken = tokens.find(t => t.lexeme === "=");
    expect(equalsToken).toBeDefined();
  });
});