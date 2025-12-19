import { ASTNodeKind, type ASTNode } from "../Parser/AST";

export interface JackClassNode extends ASTNode {
    kind: ASTNodeKind.CLASS;
    name: string;
    classVarDecs: JackVarDecNode[];
    subroutines: JackSubroutineNode[];
}

export interface JackVarDecNode extends ASTNode {
    kind: ASTNodeKind.VAR_DEC;
    varKind: 'static' | 'field' | 'var';
    type: string;
    names: string[];
}

export interface JackSubroutineNode extends ASTNode {
    kind: ASTNodeKind.SUBROUTINE;
    subroutineKind: 'constructor' | 'function' | 'method';
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
    varDecs: JackVarDecNode[];
}