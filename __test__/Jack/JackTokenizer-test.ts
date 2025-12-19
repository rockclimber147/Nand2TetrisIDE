import { describe, expect, test } from 'vitest';
import { GenericTokenizer } from '../../src/core/Tokenizer';
import { TokenType } from '../../src/core/Token';
import { JackTokenMatcher } from '../../src/core/Languages/Jack/JackSpec';

describe('Jack Tokenizer', () => {
  test('should tokenize basic keywords and symbols', () => {
    const source = 'class Main {';
    const tokenizer = new GenericTokenizer(source, JackTokenMatcher);
    const tokens = tokenizer.tokenize();

    expect(tokens).toHaveLength(3);

    expect(tokens[0]).toMatchObject({
      type: TokenType.KEYWORD,
      lexeme: 'class',
      line: 1,
      column: 1,
    });

    expect(tokens[1]).toMatchObject({
      type: TokenType.IDENTIFIER,
      lexeme: 'Main',
      line: 1,
      column: 7,
    });

    expect(tokens[2]).toMatchObject({
      type: TokenType.SYMBOL,
      lexeme: '{',
      line: 1,
      column: 12,
    });
  });

  test('should skip comments and whitespace', () => {
    const source = `
      // This is a comment
      let x = 5; /* block 
                    comment */
    `;
    const tokenizer = new GenericTokenizer(source, JackTokenMatcher);
    const tokens = tokenizer.tokenize();

    // Only "let", "x", "=", "5", ";" should remain
    expect(tokens).toHaveLength(5);
    expect(tokens[0].lexeme).toBe('let');
    expect(tokens[3].type).toBe(TokenType.INT);
    expect(tokens[3].lexeme).toBe('5');
  });

  test('should handle string constants', () => {
    const source = 'let s = "hello world";';
    const tokenizer = new GenericTokenizer(source, JackTokenMatcher);
    const tokens = tokenizer.tokenize();

    const stringToken = tokens.find((t) => t.type === TokenType.STRING);
    expect(stringToken?.lexeme).toBe('"hello world"');
  });

  test('should throw error on unexpected characters', () => {
    const source = 'let x = #;'; // '#' is not in JackSpec
    const tokenizer = new GenericTokenizer(source, JackTokenMatcher);

    expect(() => tokenizer.tokenize()).toThrow(/Unexpected character/);
  });

  test('Tokenizer gives the correct line numbers', () => {
    const source = `class
    Test
    `;
    const tokenizer = new GenericTokenizer(source, JackTokenMatcher);
    const tokens = tokenizer.tokenize();

    expect(tokens[0].line).toBe(1);
    expect(tokens[1].line).toBe(2);
  });

  test('Tokenizer gives the correct line numbers with comments', () => {
    const source = `class        //1
    // comment    //2
    /*            //3
    block comment //4
    */            //5
    Test          //6
    `;
    const tokenizer = new GenericTokenizer(source, JackTokenMatcher);
    const tokens = tokenizer.tokenize();

    expect(tokens[0].line).toBe(1);
    expect(tokens[1].line).toBe(6);
  });
});
