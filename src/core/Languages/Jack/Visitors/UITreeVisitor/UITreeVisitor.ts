import { JackSpec } from "../../JackSpec";
import type { 
    JackClassNode, JackSubroutineNode, JackClassVarDecNode, 
    JackSubroutineVarDecNode, JackLetStatementNode, JackIfStatementNode, 
    JackWhileStatementNode, JackDoStatementNode, JackReturnStatementNode, 
    JackBinaryExpressionNode, JackIntegerLiteralNode, JackStringLiteralNode, 
    JackKeywordLiteralNode, JackVariableTermNode, JackUnaryTermNode, 
    JackParenthesizedExpressionNode, JackSubroutineCallNode
} from "../../AST";
import { JackVisitorAll } from "../JackVisitorBase";
import { type UINode } from "./types";

export class UITreeVisitor extends JackVisitorAll<UINode> {
    protected visitClass(node: JackClassNode): UINode {
        return {
            content: JackSpec.CLASS,
            extraContent: node.name,
            children: [
                ...node.classVarDecs.map(v => this.visit(v)),
                ...node.subroutines.map(s => this.visit(s))
            ]
        };
    }

    protected visitSubroutine(node: JackSubroutineNode): UINode {
        return {
            content: node.subroutineKind,
            extraContent: `${node.name} (${node.returnType})`,
            children: [
                { 
                    content: "params", 
                    children: node.parameters.map(p => ({ 
                        content: p.name, 
                        extraContent: p.type, 
                        children: [] 
                    })) 
                },
                { 
                    content: "body", 
                    children: [
                        ...node.body.varDecs.map(v => this.visit(v)),
                        ...node.body.statements.map(s => this.visit(s))
                    ] 
                }
            ]
        };
    }

    protected visitVarDec(node: JackClassVarDecNode | JackSubroutineVarDecNode): UINode {
        return {
            content: node.varKind,
            extraContent: `${node.type} ${node.names.join(', ')}`,
            children: []
        };
    }

    protected visitLetStatement(node: JackLetStatementNode): UINode {
        const children = [this.visit(node.valueExpression)];
        if (node.indexExpression) {
            children.unshift({ 
                content: "index", 
                children: [this.visit(node.indexExpression)] 
            });
        }

        return {
            content: JackSpec.LET,
            extraContent: node.varName,
            children
        };
    }

    protected visitIfStatement(node: JackIfStatementNode): UINode {
        const children: UINode[] = [
            { content: "condition", children: [this.visit(node.condition)] },
            { content: "then", children: node.ifStatements.map(s => this.visit(s)) }
        ];

        if (node.elseStatements) {
            children.push({ 
                content: "else", 
                children: node.elseStatements.map(s => this.visit(s)) 
            });
        }

        return { content: JackSpec.IF, children };
    }

    protected visitWhileStatement(node: JackWhileStatementNode): UINode {
        return {
            content: JackSpec.WHILE,
            children: [
                { content: "condition", children: [this.visit(node.condition)] },
                { content: "body", children: node.statements.map(s => this.visit(s)) }
            ]
        };
    }

    protected visitDoStatement(node: JackDoStatementNode): UINode {
        return {
            content: JackSpec.DO,
            children: [this.visit(node.subroutineCall)]
        };
    }

    protected visitReturnStatement(node: JackReturnStatementNode): UINode {
        return {
            content: JackSpec.RETURN,
            children: node.expression ? [this.visit(node.expression)] : []
        };
    }

    protected visitBinaryExpression(node: JackBinaryExpressionNode): UINode {
        // Handle potentially deep binary trees or flat list of nextTerms
        const children = [this.visit(node.term)];
        
        node.nextTerms.forEach(t => {
            children.push({
                content: "op",
                extraContent: t.op,
                children: [this.visit(t.term)]
            });
        });

        return { content: "expression", children };
    }

    protected visitIntegerLiteral(node: JackIntegerLiteralNode): UINode {
        return { content: "int", extraContent: node.value.toString(), children: [] };
    }

    protected visitStringLiteral(node: JackStringLiteralNode): UINode {
        return { content: "string", extraContent: node.value, children: [] };
    }

    protected visitKeywordLiteral(node: JackKeywordLiteralNode): UINode {
        return { content: "keyword", extraContent: node.keyword, children: [] };
    }

    protected visitVariable(node: JackVariableTermNode): UINode {
        return {
            content: "var",
            extraContent: node.name,
            children: node.arrayIndex ? [this.visit(node.arrayIndex)] : []
        };
    }

    protected visitUnaryExpression(node: JackUnaryTermNode): UINode {
        return {
            content: "unary",
            extraContent: node.op,
            children: [this.visit(node.term)]
        };
    }

    protected visitParenthesizedExpression(node: JackParenthesizedExpressionNode): UINode {
        return this.visit(node.expression);
    }

    protected visitSubroutineCall(node: JackSubroutineCallNode): UINode {
        const callee = node.target ? `${node.target}.${node.methodName}` : node.methodName;
        return {
            content: "call",
            extraContent: callee,
            children: node.arguments.map(arg => this.visit(arg))
        };
    }
}