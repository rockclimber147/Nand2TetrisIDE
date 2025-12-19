import type { Token } from "../Token";

export enum ASTNodeKind {
    PROGRAM,
    
    CLASS, SUBROUTINE, VAR_DEC, STATEMENT, EXPRESSION,
    
    VM_COMMAND,
    
    INSTRUCTION, LABEL,
    
    CHIP_DEFINITION, PINS, PART
}

export interface ASTNode {
    kind: ASTNodeKind;
    startToken: Token;
    endToken: Token;
    children?: ASTNode[];
}