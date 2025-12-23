import { type ASTNode, ASTNodeKind } from "../../../AST/AST";
import { VisitorBase } from "../../../AST/VisitorBase";
import type { 
  HDLChipNode, 
  HDLPinsNode, 
  HDLPartInstanceNode 
} from "../AST";

export abstract class HDLVisitor<T> extends VisitorBase<T> {
  public visit(node: ASTNode): T {
    switch (node.kind) {
      case ASTNodeKind.CHIP_DEFINITION:
        return this.visitChip(node as HDLChipNode);
      case ASTNodeKind.PINS:
        return this.visitPins(node as HDLPinsNode);
      case ASTNodeKind.PART:
        return this.visitPart(node as HDLPartInstanceNode);
      default:
        throw new Error(`HDLVisitor: Unknown node kind: ${node.kind}`);
    }
  }

  public abstract visitChip(node: HDLChipNode): T;
  public abstract visitPins(node: HDLPinsNode): T;
  public abstract visitPart(node: HDLPartInstanceNode): T;
}