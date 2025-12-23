import { type ASTNode, ASTNodeKind } from "../../AST/AST";

export interface HDLChipNode extends ASTNode {
    kind: ASTNodeKind.CHIP_DEFINITION
}

export interface HDLChipNode extends ASTNode {
  kind: ASTNodeKind.CHIP_DEFINITION;
  name: string;
  inputs: HDLPinsNode;
  outputs: HDLPinsNode;
  parts: HDLPartInstanceNode[];
}

export interface HDLPinsNode extends ASTNode {
  kind: ASTNodeKind.PINS;
  pins: { name: string; width?: number }[];
}

export interface HDLPartInstanceNode extends ASTNode {
  kind: ASTNodeKind.PART;
  partName: string;
  connections: HDLPinConnection[];
}

export interface HDLPinConnection {
  lhs: string;
  rhs: string;
  rhsIndex?: { start: number; end?: number };
}