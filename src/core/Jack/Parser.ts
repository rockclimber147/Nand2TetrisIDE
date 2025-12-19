import { BaseParser } from '../Parser/BaseParser';
import { TokenType } from '../Token';
import { JackSpec } from './JackSpec';
import type {
  JackClassNode,
  JackClassVarDecNode,
  ClassVarKind,
  JackSubroutineNode,
  SubroutineKind,
  JackParameterNode,
  JackSubroutineBodyNode,
  SubroutineVarKind,
  JackSubroutineVarDecNode,
  JackStatementNode,
  JackLetStatementNode,
  JackExpressionNode,
  JackIfStatementNode,
  JackWhileStatementNode,
  JackReturnStatementNode,
  JackDoStatementNode,
  JackSubroutineCall,
} from './AST';
import { ASTNodeKind } from '../Parser/AST';

export class JackParser extends BaseParser<JackClassNode> {
  public parse(): JackClassNode {
    return this.parseClass();
  }

  private parseClass(): JackClassNode {
    const startToken = this.validator.expectLexeme(JackSpec.CLASS);
    const className = this.validator.expectType(TokenType.IDENTIFIER).lexeme;

    this.validator.expectLexeme(JackSpec.L_BRACE);

    const classVarDecs: JackClassVarDecNode[] = [];
    const subroutines: JackSubroutineNode[] = [];

    while (
      this.check(TokenType.KEYWORD, JackSpec.STATIC) ||
      this.check(TokenType.KEYWORD, JackSpec.FIELD)
    ) {
      classVarDecs.push(this.parseClassVarDec());
    }

    while (
      this.check(TokenType.KEYWORD, JackSpec.CONSTRUCTOR) ||
      this.check(TokenType.KEYWORD, JackSpec.FUNCTION) ||
      this.check(TokenType.KEYWORD, JackSpec.METHOD)
    ) {
      subroutines.push(this.parseSubroutine());
    }

    const endToken = this.validator.expectLexeme(JackSpec.R_BRACE);

    return {
      kind: ASTNodeKind.CLASS,
      startToken,
      endToken,
      name: className,
      classVarDecs,
      subroutines,
    };
  }

  private parseClassVarDec(): JackClassVarDecNode {
    const varKinds = new Set([JackSpec.STATIC, JackSpec.FIELD]);
    const startToken = this.validator.expectOneOfLexemes(varKinds);
    const varKind = startToken.lexeme as ClassVarKind;

    let type: string;
    const next = this.validator.peek();
    if (next.type === TokenType.KEYWORD) {
      type = this.validator.expectOneOfLexemes(JackSpec.TYPES).lexeme;
    } else {
      type = this.validator.expectType(TokenType.IDENTIFIER).lexeme;
    }

    const names: string[] = [];
    names.push(this.validator.expectType(TokenType.IDENTIFIER).lexeme);

    while (this.match(TokenType.SYMBOL, JackSpec.COMMA)) {
      names.push(this.validator.expectType(TokenType.IDENTIFIER).lexeme);
    }

    const endToken = this.validator.expectLexeme(JackSpec.SEMI);

    return {
      kind: ASTNodeKind.VAR_DEC,
      startToken,
      endToken,
      varKind,
      type,
      names,
    };
  }

  /**
   * ('constructor'|'function'|'method') ('void'|type) subroutineName '(' parameterList ')' subroutineBody
   */
  private parseSubroutine(): JackSubroutineNode {
    const subroutineKinds = new Set([JackSpec.CONSTRUCTOR, JackSpec.METHOD, JackSpec.FUNCTION]);
    const startToken = this.validator.expectOneOfLexemes(subroutineKinds);
    const subroutineKind = startToken.lexeme as SubroutineKind;

    let returnType: string;
    const next = this.validator.peek();
    if (next.type === TokenType.KEYWORD) {
      returnType = this.validator.expectOneOfLexemes(JackSpec.RETURN_TYPES).lexeme;
    } else {
      returnType = this.validator.expectType(TokenType.IDENTIFIER).lexeme;
    }

    const subroutineNameToken = this.validator.expectType(TokenType.IDENTIFIER);
    const parameters: JackParameterNode[] = this.parseParameterList();
    const body: JackSubroutineBodyNode = this.parseSubroutineBody();
    return {
      kind: ASTNodeKind.SUBROUTINE,
      startToken: startToken,
      subroutineKind: subroutineKind,
      name: subroutineNameToken.lexeme,
      returnType: returnType,
      parameters: parameters,
      body: body,
      endToken: body.endToken,
    };
  }

  private parseParameterList(): JackParameterNode[] {
    const params: JackParameterNode[] = [];

    this.validator.expectLexeme(JackSpec.L_PAREN);

    if (!this.check(TokenType.SYMBOL, JackSpec.R_PAREN)) {
      do {
        const paramStart = this.validator.peek(0);

        let type: string;
        if (this.check(TokenType.KEYWORD)) {
          type = this.validator.expectOneOfLexemes(JackSpec.TYPES).lexeme;
        } else {
          type = this.validator.expectType(TokenType.IDENTIFIER).lexeme;
        }

        const nameToken = this.validator.expectType(TokenType.IDENTIFIER);
        const name = nameToken.lexeme;

        params.push({
          kind: ASTNodeKind.PARAMS,
          startToken: paramStart,
          endToken: nameToken,
          type: type,
          name: name,
        });
      } while (this.match(TokenType.SYMBOL, JackSpec.COMMA));
    }

    this.validator.expectLexeme(JackSpec.R_PAREN);
    return params;
  }

  private parseSubroutineBody(): JackSubroutineBodyNode {
    const startToken = this.validator.expectLexeme(JackSpec.L_BRACE);
    const subroutineVarDecs: JackSubroutineVarDecNode[] = [];
    while (this.check(TokenType.KEYWORD, JackSpec.VAR)) {
      subroutineVarDecs.push(this.parseSubroutineVarDec());
    }
    const subroutinreStatements: JackStatementNode[] = [];
    while (JackSpec.STATEMENTS.has(this.validator.peek().lexeme)) {
      subroutinreStatements.push(this.parseStatement());
    }
    const endToken = this.validator.expectLexeme(JackSpec.R_BRACE);
    return {
      kind: ASTNodeKind.SUBROUTINE,
      startToken: startToken,
      varDecs: subroutineVarDecs,
      statements: subroutinreStatements,
      endToken: endToken,
    };
  }

  private parseSubroutineVarDec(): JackSubroutineVarDecNode {
    const startToken = this.validator.expectLexeme(JackSpec.VAR);
    const varKind = startToken.lexeme as SubroutineVarKind;

    let type: string;
    const next = this.validator.peek();
    if (next.type === TokenType.KEYWORD) {
      type = this.validator.expectOneOfLexemes(JackSpec.TYPES).lexeme;
    } else {
      type = this.validator.expectType(TokenType.IDENTIFIER).lexeme;
    }

    const names: string[] = [];
    names.push(this.validator.expectType(TokenType.IDENTIFIER).lexeme);

    while (this.match(TokenType.SYMBOL, JackSpec.COMMA)) {
      names.push(this.validator.expectType(TokenType.IDENTIFIER).lexeme);
    }

    const endToken = this.validator.expectLexeme(JackSpec.SEMI);

    return {
      kind: ASTNodeKind.VAR_DEC,
      startToken,
      endToken,
      varKind,
      type,
      names,
    };
  }

  private parseStatement(): JackStatementNode {
    const token = this.validator.peek(0);

    switch (token.lexeme) {
      case JackSpec.LET:
        return this.parseLet();
      case JackSpec.IF:
        return this.parseIf();
      case JackSpec.WHILE:
        return this.parseWhile();
      case JackSpec.RETURN:
        return this.parseReturn();
      case JackSpec.DO:
        return this.parseDo();
    }
    this.validator.throwCompilerError(token, 'Expected statement');
  }

  private parseLet(): JackLetStatementNode {
    const startToken = this.validator.expectLexeme(JackSpec.LET);
    const varName = this.validator.expectType(TokenType.IDENTIFIER).lexeme;

    let indexExpression: JackExpressionNode | undefined;
    if (this.match(TokenType.SYMBOL, JackSpec.L_BRACKET)) {
      indexExpression = this.parseExpression();
      this.validator.expectLexeme(JackSpec.R_BRACKET);
    }

    this.validator.expectLexeme(JackSpec.EQ);
    const valueExpression = this.parseExpression();
    const endToken = this.validator.expectLexeme(JackSpec.SEMI);

    return {
      kind: ASTNodeKind.STATEMENT,
      statementType: JackSpec.LET,
      startToken,
      endToken,
      varName,
      indexExpression,
      valueExpression,
    };
  }

private parseIf(): JackIfStatementNode {
    const startToken = this.validator.expectLexeme(JackSpec.IF);
    
    this.validator.expectLexeme(JackSpec.L_PAREN);
    const condition = this.parseExpression();
    this.validator.expectLexeme(JackSpec.R_PAREN);
    
    this.validator.expectLexeme(JackSpec.L_BRACE);
    const ifStatements: JackStatementNode[] = [];
    while (!this.check(TokenType.SYMBOL, JackSpec.R_BRACE)) {
      ifStatements.push(this.parseStatement());
    }
    let endToken = this.validator.expectLexeme(JackSpec.R_BRACE);

    let elseStatements: JackStatementNode[] | undefined;
    if (this.match(TokenType.KEYWORD, JackSpec.ELSE)) {
      this.validator.expectLexeme(JackSpec.L_BRACE);
      elseStatements = [];
      while (!this.check(TokenType.SYMBOL, JackSpec.R_BRACE)) {
        elseStatements.push(this.parseStatement());
      }
      endToken = this.validator.expectLexeme(JackSpec.R_BRACE);
    }

    return {
      kind: ASTNodeKind.STATEMENT,
      statementType: JackSpec.IF,
      startToken,
      endToken,
      condition,
      ifStatements: ifStatements,
      elseStatements: elseStatements,
    };
  }

  private parseWhile(): JackWhileStatementNode {
    const startToken = this.validator.expectLexeme(JackSpec.WHILE);

    this.validator.expectLexeme(JackSpec.L_PAREN);
    const condition = this.parseExpression();
    this.validator.expectLexeme(JackSpec.R_PAREN);

    this.validator.expectLexeme(JackSpec.L_BRACE);
    const statements: JackStatementNode[] = [];
    while (!this.check(TokenType.SYMBOL, JackSpec.R_BRACE)) {
      statements.push(this.parseStatement());
    }
    const endToken = this.validator.expectLexeme(JackSpec.R_BRACE);

    return {
      kind: ASTNodeKind.STATEMENT,
      statementType: JackSpec.WHILE,
      startToken,
      endToken,
      condition,
      statements,
    };
  }

  private parseReturn(): JackReturnStatementNode {
    const startToken = this.validator.expectLexeme(JackSpec.RETURN);

    let expression: JackExpressionNode | undefined;
    if (!this.check(TokenType.SYMBOL, JackSpec.SEMI)) {
      expression = this.parseExpression();
    }

    const endToken = this.validator.expectLexeme(JackSpec.SEMI);

    return {
      kind: ASTNodeKind.STATEMENT,
      statementType: JackSpec.RETURN,
      startToken,
      endToken,
      expression,
    };
  }

  private parseDo(): JackDoStatementNode {
    const startToken = this.validator.expectLexeme(JackSpec.DO);
    const subroutineCall = this.parseSubroutineCall();
    const endToken = this.validator.expectLexeme(JackSpec.SEMI);

    return {
      kind: ASTNodeKind.STATEMENT,
      statementType: JackSpec.DO,
      startToken: startToken,
      subroutineCall: subroutineCall,
      endToken: endToken,
    };
  }

  private parseSubroutineCall(): JackSubroutineCall {
    throw Error();
  }

  private parseExpression(): JackExpressionNode {
    throw Error();
  }
}
