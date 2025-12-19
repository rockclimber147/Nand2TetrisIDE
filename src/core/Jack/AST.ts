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
  subroutineCall: JackSubroutineCall;
}

export interface JackReturnStatementNode extends ASTNode {
  kind: ASTNodeKind.STATEMENT;
  statementType: typeof JackSpec.RETURN;
  expression?: JackExpressionNode;
}

export interface JackSubroutineCall {
  target?: string;
  name: string;
  arguments: JackExpressionNode[];
}

export interface JackExpressionNode extends ASTNode {
  kind: ASTNodeKind.EXPRESSION;
  term: JackTermNode;
  nextTerms: { op: string; term: JackTermNode }[];
}

export type JackTermType =
  | 'INTEGER'
  | 'STRING'
  | 'KEYWORD'
  | 'VAR_NAME'
  | 'ARRAY_ACCESS'
  | 'SUBROUTINE_CALL'
  | 'PAREN_EXPRESSION'
  | 'UNARY_OP';

export interface JackTermNode extends ASTNode {
  kind: ASTNodeKind.TERM;
  termType: JackTermType;
  indexExpression?: JackExpressionNode;
  subroutineCall?: JackSubroutineCall;
  nestedExpression?: JackExpressionNode;
  unaryOp?: { op: string; term: JackTermNode };
}
