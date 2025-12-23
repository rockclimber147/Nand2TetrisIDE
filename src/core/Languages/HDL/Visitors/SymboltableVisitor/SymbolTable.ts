import { BaseSymbolTable } from "../../../../SymbolTable/SymbolTableBase";
import type { SymbolScope, SymbolMetadata } from "../../../../SymbolTable/types";

export enum HDLSymbolKind {
  IN = "IN",
  OUT = "OUT",
  INTERNAL = "INTERNAL"
}

export interface HDLSymbolEntry {
  name: string;
  kind: HDLSymbolKind;
  width: number;
}

export class HDLGlobalSymbolTable extends BaseSymbolTable {
  private chips = new Map<string, ChipLevelTable>();

  public addChip(chipName: string): ChipLevelTable {
    if (this.chips.has(chipName)) {
      throw new Error(`Chip ${chipName} is already defined.`);
    }
    const table = new ChipLevelTable(chipName);
    this.chips.set(chipName, table);
    return table;
  }

  public getChip(name: string): ChipLevelTable | undefined {
    return this.chips.get(name);
  }

  public validatePin(chipName: string, pinName: string): string | null {
    const chip = this.chips.get(chipName);
    if (!chip) return `Chip '${chipName}' not found in symbol table.`;
    
    if (!chip.hasSymbol(pinName)) {
      return `Identifier '${pinName}' is not a defined input, output, or internal wire in chip '${chipName}'.`;
    }
    return null;
  }

  public toVisual(): SymbolScope {
    const children: Record<string, SymbolScope> = {};
    this.chips.forEach((table, name) => {
      children[name] = table.toVisual();
    });

    return {
      name: 'HDL Project',
      symbols: {},
      children,
    };
  }
}

export class ChipLevelTable {
  private symbols = new Map<string, HDLSymbolEntry>();

  constructor(public readonly chipName: string) {}

  public definePin(name: string, kind: HDLSymbolKind, width: number = 1): void {
    if (this.symbols.has(name)) {
      throw new Error(`Pin/Wire '${name}' is already defined in chip '${this.chipName}'.`);
    }

    this.symbols.set(name, { name, kind, width });
  }

  public hasSymbol(name: string): boolean {
    return this.symbols.has(name);
  }

  public lookup(name: string): HDLSymbolEntry | undefined {
    return this.symbols.get(name);
  }

  public toVisual(): SymbolScope {
    const symbols: Record<string, SymbolMetadata> = {};
    
    this.symbols.forEach((entry, name) => {
      symbols[name] = { 
        kind: entry.kind, 
        width: `${entry.width}-bit` 
      };
    });

    return {
      name: this.chipName,
      metadata: { type: 'CHIP' },
      symbols,
      children: {},
    };
  }
}