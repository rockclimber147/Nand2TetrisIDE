import { VisitorBase } from '../../../AST/VisitorBase';
import { type ASTNode, ASTNodeKind } from '../../../AST/AST';
import * as JackAST from '../AST';

export abstract class JackVisitorTopLevel<T> extends VisitorBase<T> {
  public override visit(node: ASTNode): T {
    switch (node.kind) {
      case ASTNodeKind.CLASS:
        return this.visitClass(node as JackAST.JackClassNode);
      case ASTNodeKind.SUBROUTINE:
        return this.visitSubroutine(node as JackAST.JackSubroutineNode);
      default:
        throw new Error(`JackVisitor does not support node kind: ${ASTNodeKind[node.kind]}`);
    }
  }

  protected abstract visitClass(node: JackAST.JackClassNode): T;
  protected abstract visitSubroutine(node: JackAST.JackSubroutineNode): T;
}

export abstract class JackVisitorAll<T> extends JackVisitorTopLevel<T> {
  public override visit(node: ASTNode): T {
    switch (node.kind) {
      case ASTNodeKind.STATEMENT:
        return this.visitStatement(node as JackAST.JackStatementNode);
      case ASTNodeKind.EXPRESSION:
      case ASTNodeKind.TERM:
        return this.visitExpression(node as JackAST.JackExpressionNode);
      case ASTNodeKind.CLASS:
      case ASTNodeKind.SUBROUTINE:
        return super.visit(node);

      default:
        throw new Error(`JackVisitorAll does not support node kind: ${ASTNodeKind[node.kind]}`);
    }
  }

  protected abstract visitStatement(node: JackAST.JackStatementNode): T;
  protected abstract visitExpression(node: JackAST.JackExpressionNode): T;
}
