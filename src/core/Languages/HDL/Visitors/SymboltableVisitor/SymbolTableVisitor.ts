import { HDLGlobalSymbolTable, HDLSymbolKind, ChipLevelTable } from "./SymbolTable";
import { HDLVisitor } from "../HDLVisitorBase";
import { HDLSpec } from "../../HDLSpec";
import type { HDLChipNode, HDLPinsNode, HDLPartInstanceNode } from "../../AST";

export class HDLSymbolTableVisitor extends HDLVisitor<HDLGlobalSymbolTable> {
  private globalTable: HDLGlobalSymbolTable;
  private currentChip: ChipLevelTable | null = null;

  constructor(globalTable?: HDLGlobalSymbolTable) {
    super();
    this.globalTable = globalTable || new HDLGlobalSymbolTable();
  }

  public visitChip(node: HDLChipNode): HDLGlobalSymbolTable {
    this.currentChip = this.globalTable.addChip(node.name);
    this.visitPins(node.inputs);
    this.visitPins(node.outputs);
    node.parts.forEach((part) => this.visitPart(part));

    return this.globalTable;
  }

  public visitPins(node: HDLPinsNode): HDLGlobalSymbolTable {
    if (!this.currentChip) return this.globalTable;
    const pinKind = node.startToken.lexeme === HDLSpec.IN 
      ? HDLSymbolKind.IN 
      : HDLSymbolKind.OUT;

    node.pins.forEach((pin) => {
      this.currentChip!.definePin(pin.name, pinKind, pin.width || 1);
    });

    return this.globalTable;
  }

  public visitPart(node: HDLPartInstanceNode): HDLGlobalSymbolTable {
    if (!this.currentChip) return this.globalTable;

    node.connections.forEach((conn) => {
      if (!this.currentChip!.hasSymbol(conn.rhs)) {
        this.currentChip!.definePin(conn.rhs, HDLSymbolKind.INTERNAL);
      }
    });

    return this.globalTable;
  }
}