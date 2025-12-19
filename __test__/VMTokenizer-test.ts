import { describe, expect, test } from 'vitest';
import { GenericTokenizer } from "../src/core/Tokenizer"
import { Token, TokenType } from '../src/core/Token';
import { VMSpec } from "../src/core/VM/VMSpec"

describe('Jack Tokenizer', () => {
  
  test('should tokenize basic keywords and symbols', () => {
    const source = "push constant 0";
    const tokenizer = new GenericTokenizer(source, VMSpec);
    const tokens = tokenizer.tokenize();
    expect(tokens).toHaveLength(3);
    expect(tokens[0].lexeme).toBe("push");
    expect(tokens[0].type).toBe(TokenType.KEYWORD);
    expect(tokens[1].lexeme).toBe("constant");
    expect(tokens[1].type).toBe(TokenType.KEYWORD);
    expect(tokens[2].lexeme).toBe("0");
    expect(tokens[2].type).toBe(TokenType.INT);
  });
});

describe('VM Tokenizer - Advanced Scenarios', () => {

  test('should handle newlines and track line/column correctly', () => {
    const source = "push local 0\npop argument 1";
    const tokenizer = new GenericTokenizer(source, VMSpec);
    const tokens = tokenizer.tokenize();

    // Line 1
    expect(tokens[0].lexeme).toBe("push");
    expect(tokens[0].line).toBe(1);
    expect(tokens[0].column).toBe(1);

    // Newline Token
    const newline = tokens[3];
    expect(newline.type).toBe(TokenType.NEWLINE);
    expect(newline.line).toBe(1);

    // Line 2 starts after the newline
    expect(tokens[4].lexeme).toBe("pop");
    expect(tokens[4].line).toBe(2);
    expect(tokens[4].column).toBe(1);
  });

  test('should skip comments and maintain line integrity', () => {
    const source = `// Header comment
push constant 10 // Inline comment
add`;
    const tokenizer = new GenericTokenizer(source, VMSpec);
    const tokens = tokenizer.tokenize();

    // 1. "push" should be on line 2 because of header comment and its newline
    expect(tokens[1].lexeme).toBe("push");
    expect(tokens[1].line).toBe(2);

    // 2. "add" should be on line 3
    const addToken = tokens.find(t => t.lexeme === "add");
    expect(addToken?.line).toBe(3);
    expect(addToken?.column).toBe(1);
  });

  test('should handle crazy whitespace and indentation', () => {
    const source = "   label   LOOP   \n\t  goto LOOP";
    const tokenizer = new GenericTokenizer(source, VMSpec);
    const tokens = tokenizer.tokenize();

    // "label" starts after 3 spaces
    expect(tokens[0].lexeme).toBe("label");
    expect(tokens[0].column).toBe(4);

    const gotoToken = tokens.find(t => t.lexeme === "goto");
    expect(gotoToken?.line).toBe(2);
    expect(gotoToken?.column).toBe(4); 
  });

  test('should tokenize complex VM identifiers (dots and colons)', () => {
    const source = "call Main.fibonacci 1\nlabel Sys.init$loop: ";
    const tokenizer = new GenericTokenizer(source, VMSpec);
    const tokens = tokenizer.tokenize();

    const funcName = tokens[1];
    expect(funcName.lexeme).toBe("Main.fibonacci");
    expect(funcName.type).toBe(TokenType.IDENTIFIER);

    const labelName = tokens.find(t => t.lexeme.includes("$"));
    expect(labelName?.lexeme).toBe("Sys.init$loop:");
    expect(labelName?.type).toBe(TokenType.IDENTIFIER);
  });

  test('should handle empty lines and multiple newlines', () => {
    const source = "push constant 1\n\n\npush constant 2";
    const tokenizer = new GenericTokenizer(source, VMSpec);
    const tokens = tokenizer.tokenize();

    // Find the second "push"
    const secondPush = tokens.filter(t => t.lexeme === "push")[1];
    
    // Line 1: push, constant, 1, \n
    // Line 2: \n
    // Line 3: \n
    // Line 4: push
    expect(secondPush.line).toBe(4);
  });
});