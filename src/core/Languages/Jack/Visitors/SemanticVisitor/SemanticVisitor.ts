import type {
  JackLetStatementNode,
  JackIfStatementNode,
  JackWhileStatementNode,
  JackDoStatementNode,
  JackReturnStatementNode,
  JackBinaryExpressionNode,
  JackVariableTermNode,
  JackUnaryTermNode,
  JackParenthesizedExpressionNode,
  JackSubroutineCallNode,
  JackClassNode,
  JackSubroutineNode,
} from '../../AST';
import { JackVisitorAll } from '../JackVisitorBase';
import { GlobalSymbolTable } from '../SymbolTableVisitor/SymbolTable';
import { CompilerError } from '../../../../Errors';

export class SemanticVisitor extends JackVisitorAll<void> {
  private errors: CompilerError[] = [];
  private currentClassName: string = '';
  private currentSubroutineName: string = '';
  constructor(private table: GlobalSymbolTable) {
    super();
  }

  public getErrors(): CompilerError[] {
    return this.errors;
  }

  protected override visitClass(node: JackClassNode): void {
    this.currentClassName = node.name;

    node.subroutines.forEach((subroutine) => this.visit(subroutine));

    this.currentClassName = '';
  }

  protected override visitSubroutine(node: JackSubroutineNode): void {
    this.currentSubroutineName = node.name;

    this.visitMany(node.body.statements);
    this.visitMany(node.body.varDecs);

    this.currentSubroutineName = '';
  }

  protected visitLetStatement(node: JackLetStatementNode): void {
    const error = this.table.validateVar(node.varName, this.currentClassName, this.currentSubroutineName)
    if (error) this.errors.push(new CompilerError(node.startToken, error))
    if (node.indexExpression)
      this.visit(node.indexExpression);
    this.visit(node.valueExpression)
  }
  protected visitIfStatement(node: JackIfStatementNode): void {
    this.visit(node.condition);
    node.ifStatements?.forEach(statement => this.visit(statement))
    node.elseStatements?.forEach(statement => this.visit(statement))
  }
  protected visitWhileStatement(node: JackWhileStatementNode): void {
    this.visit(node.condition);
    node.statements?.forEach(statement => this.visit(statement))
  }
  protected visitDoStatement(node: JackDoStatementNode): void {
    this.visit(node.subroutineCall)
  }
  protected visitReturnStatement(node: JackReturnStatementNode): void {
    if (node.expression) this.visit(node.expression);
  }
  protected visitBinaryExpression(node: JackBinaryExpressionNode): void {
    this.visit(node.term);
    node.nextTerms.forEach(expr => this.visit(expr.term))
  }
  protected visitVariable(node: JackVariableTermNode): void {
    const error = this.table.validateVar(node.name, this.currentClassName, this.currentSubroutineName)
    if (error) this.errors.push(new CompilerError(node.startToken, error))
    if (node.arrayIndex) {
      this.visit(node.arrayIndex)
    }
  }
  protected visitUnaryExpression(node: JackUnaryTermNode): void {
    this.visit(node.term)
  }
  protected visitParenthesizedExpression(node: JackParenthesizedExpressionNode): void {
    this.visit(node.expression)
  }
  protected visitSubroutineCall(node: JackSubroutineCallNode): void {
    const error = this.table.validateSubroutineCall(node.methodName, this.currentClassName, this.currentSubroutineName, node.target)
    if (error) this.errors.push(new CompilerError(node.startToken, error))
    node.arguments?.forEach(argExpr => this.visit(argExpr))
  }

  protected visitIntegerLiteral(): void {}
  protected visitStringLiteral(): void {}
  protected visitKeywordLiteral(): void {}
    protected visitVarDec(): void {}
}
