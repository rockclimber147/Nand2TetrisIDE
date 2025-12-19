import { ASTNodeKind, type ASTNode } from '../Parser/AST';
import { JackSpec } from './JackSpec';

export interface JackClassNode extends ASTNode {
  kind: ASTNodeKind.CLASS;
  name: string;
  classVarDecs: JackClassVarDecNode[];
  subroutines: JackSubroutineNode[];
}

export type ClassVarKind = typeof JackSpec.STATIC | typeof JackSpec.FIELD | typeof JackSpec.VAR;
export interface JackClassVarDecNode extends ASTNode {
  kind: ASTNodeKind.VAR_DEC;
  varKind: ClassVarKind;
  type: string;
  names: string[];
}

export type SubroutineKind =
  | typeof JackSpec.CONSTRUCTOR
  | typeof JackSpec.FUNCTION
  | typeof JackSpec.METHOD;
export interface JackSubroutineNode extends ASTNode {
  kind: ASTNodeKind.SUBROUTINE;
  subroutineKind: SubroutineKind;
  returnType: string;
  name: string;
  parameters: JackParameterNode[];
  body: JackSubroutineBodyNode;
}

export interface JackParameterNode extends ASTNode {
  type: string;
  name: string;
}

export interface JackSubroutineBodyNode extends ASTNode {
  varDecs: JackSubroutineVarDecNode[];
  statements: JackStatementNode[];
}

export type SubroutineVarKind = typeof JackSpec.VAR;
export interface JackSubroutineVarDecNode extends ASTNode {
  kind: ASTNodeKind.VAR_DEC;
  varKind: SubroutineVarKind;
  type: string;
  names: string[];
}

export type JackStatementNode =
  | JackLetStatementNode
  | JackIfStatementNode
  | JackWhileStatementNode
  | JackDoStatementNode
  | JackReturnStatementNode;

export interface JackLetStatementNode extends ASTNode {
  kind: ASTNodeKind.STATEMENT;
  statementType: typeof JackSpec.LET;
  varName: string;
  indexExpression?: JackExpressionNode;
  valueExpression: JackExpressionNode;
}

export interface JackIfStatementNode extends ASTNode {
  kind: ASTNodeKind.STATEMENT;
  statementType: typeof JackSpec.IF;
  condition: JackExpressionNode;
  ifStatements: JackStatementNode[];
  elseStatements?: JackStatementNode[];
}

export interface JackWhileStatementNode extends ASTNode {
  kind: ASTNodeKind.STATEMENT;
  statementType: typeof JackSpec.WHILE;
  condition: JackExpressionNode;
  statements: JackStatementNode[];
}

export interface JackDoStatementNode extends ASTNode {
  kind: ASTNodeKind.STATEMENT;
  statementType: typeof JackSpec.DO;
  subroutineCall: JackSubroutineCallNode;
}

export interface JackReturnStatementNode extends ASTNode {
  kind: ASTNodeKind.STATEMENT;
  statementType: typeof JackSpec.RETURN;
  expression?: JackExpressionNode;
}

export type JackExpressionNode =
  | JackIntegerLiteralNode
  | JackStringLiteralNode
  | JackKeywordLiteralNode
  | JackVariableTermNode
  | JackUnaryTermNode
  | JackSubroutineCallNode
  | JackParenthesizedExpressionNode
  | JackBinaryExpressionNode;

// Helper for the "term (op term)*" structure used in Jack
export interface JackBinaryExpressionNode extends ASTNode {
  kind: ASTNodeKind.EXPRESSION;
  term: JackExpressionNode;
  nextTerms: { op: string; term: JackExpressionNode }[];
}

export interface JackIntegerLiteralNode extends ASTNode {
  kind: ASTNodeKind.TERM;
  type: 'INTEGER';
  value: number;
}

export interface JackStringLiteralNode extends ASTNode {
  kind: ASTNodeKind.TERM;
  type: 'STRING';
  value: string;
}

export interface JackKeywordLiteralNode extends ASTNode {
  kind: ASTNodeKind.TERM;
  type: 'KEYWORD';
  keyword: string; // true, false, null, this
}

export interface JackVariableTermNode extends ASTNode {
  kind: ASTNodeKind.TERM;
  type: 'VAR_NAME';
  name: string;
  arrayIndex?: JackBinaryExpressionNode; // let x = a[i]
}

export interface JackUnaryTermNode extends ASTNode {
  kind: ASTNodeKind.TERM;
  type: 'UNARY_OP';
  op: string;
  term: JackExpressionNode;
}

export interface JackParenthesizedExpressionNode extends ASTNode {
  kind: ASTNodeKind.TERM;
  type: 'PAREN_EXPRESSION';
  expression: JackBinaryExpressionNode;
}

export interface JackSubroutineCallNode extends ASTNode {
  kind: ASTNodeKind.TERM;
  type: 'SUBROUTINE_CALL';
  target?: string;
  methodName: string;
  arguments: JackExpressionNode[];
}
