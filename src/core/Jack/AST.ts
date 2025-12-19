import { ASTNodeKind, type ASTNode } from "../Parser/AST";
import { JackSpec } from "./JackSpec";

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

export type SubroutineKind = typeof JackSpec.CONSTRUCTOR | typeof JackSpec.FUNCTION | typeof JackSpec.METHOD;
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
}

export type SubroutineVarKind = typeof JackSpec.VAR;
export interface JackSubroutineVarDecNode extends ASTNode {
    kind: ASTNodeKind.VAR_DEC;
    varKind: SubroutineVarKind;
    type: string;
    names: string[];
}
