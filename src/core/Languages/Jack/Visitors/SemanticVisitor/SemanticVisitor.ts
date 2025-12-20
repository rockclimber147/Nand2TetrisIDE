import type { JackLetStatementNode, JackIfStatementNode, JackWhileStatementNode, JackDoStatementNode, JackReturnStatementNode, JackBinaryExpressionNode, JackIntegerLiteralNode, JackStringLiteralNode, JackKeywordLiteralNode, JackVariableTermNode, JackUnaryTermNode, JackParenthesizedExpressionNode, JackSubroutineCallNode, JackClassNode, JackSubroutineNode } from "../../AST";
import { JackVisitorAll } from "../JackVisitorBase";
import { GlobalSymbolTable } from "../SymbolTableVisitor/SymbolTable";
import { CompilerError } from "../../../../Errors";

export class SemanticVisitor extends JackVisitorAll<void> {
    private errors: CompilerError[] = [];
    private currentClassName: string = "";
    private currentSubroutineName: string = "";
    constructor(private table: GlobalSymbolTable) {
        super();
    }

    public getErrors(): CompilerError[] {
        return this.errors;
    }

    protected override visitClass(node: JackClassNode): void {
        this.currentClassName = node.name;

        node.subroutines.forEach(subroutine => this.visit(subroutine));

        this.currentClassName = "";
    }

    protected override visitSubroutine(node: JackSubroutineNode): void {
        this.currentSubroutineName = node.name;

        this.visitMany(node.body.statements);
        this.visitMany(node.body.varDecs);

        this.currentSubroutineName = "";
    }

    protected visitLetStatement(node: JackLetStatementNode): CompilerError[] {
        throw new Error("Method not implemented.");
    }

    protected visitIfStatement(node: JackIfStatementNode): CompilerError[] {
        throw new Error("Method not implemented.");
    }

    protected visitWhileStatement(node: JackWhileStatementNode): CompilerError[] {
        throw new Error("Method not implemented.");
    }

    protected visitDoStatement(node: JackDoStatementNode): CompilerError[] {
        throw new Error("Method not implemented.");
    }

    protected visitReturnStatement(node: JackReturnStatementNode): CompilerError[] {
        throw new Error("Method not implemented.");
    }

    protected visitBinaryExpression(node: JackBinaryExpressionNode): CompilerError[] {
        throw new Error("Method not implemented.");
    }

    protected visitIntegerLiteral(node: JackIntegerLiteralNode): CompilerError[] {
        throw new Error("Method not implemented.");
    }

    protected visitStringLiteral(node: JackStringLiteralNode): CompilerError[] {
        throw new Error("Method not implemented.");
    }

    protected visitKeywordLiteral(node: JackKeywordLiteralNode): CompilerError[] {
        throw new Error("Method not implemented.");
    }

    protected visitVariable(node: JackVariableTermNode): CompilerError[] {
        throw new Error("Method not implemented.");
    }
    
    protected visitUnaryExpression(node: JackUnaryTermNode): CompilerError[] {
        throw new Error("Method not implemented.");
    }

    protected visitParenthesizedExpression(node: JackParenthesizedExpressionNode): CompilerError[] {
        throw new Error("Method not implemented.");
    }

    protected visitSubroutineCall(node: JackSubroutineCallNode): CompilerError[] {
        throw new Error("Method not implemented.");
    }
}