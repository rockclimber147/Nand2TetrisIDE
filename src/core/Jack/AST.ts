import { ASTNodeKind, type ASTNode } from "../Parser/AST";
import { JackSpec } from "./JackSpec";

export interface JackClassNode extends ASTNode {
    kind: ASTNodeKind.CLASS;
    name: string;
    classVarDecs: JackVarDecNode[];
    subroutines: JackSubroutineNode[];
}

export interface JackVarDecNode extends ASTNode {
    kind: ASTNodeKind.VAR_DEC;
    varKind: typeof JackSpec.STATIC | typeof JackSpec.FIELD | typeof JackSpec.VAR;
    type: string;
    names: string[];
}

export interface JackSubroutineNode extends ASTNode {
    kind: ASTNodeKind.SUBROUTINE;
    subroutineKind: typeof JackSpec.CONSTRUCTOR | typeof JackSpec.FUNCTION | typeof JackSpec.METHOD;
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
