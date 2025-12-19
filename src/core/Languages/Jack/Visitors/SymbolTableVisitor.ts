export class GlobalSymbolTable {
    private classes = new Map<string, ClassLevelTable>();
    
    public addClass(className: string): ClassLevelTable {
        if (this.classes.has(className)) {
            throw new Error(`Class ${className} already defined.`);
        }
        const table = new ClassLevelTable(className);
        this.classes.set(className, table);
        return table;
    }
}

export type SymbolKind = 'STATIC' | 'FIELD' | 'ARG' | 'VAR';

export interface SymbolEntry {
  name: string;
  type: string;
  kind: SymbolKind;
  index: number;
}

export class ClassLevelTable {
  private vars = new Map<string, SymbolEntry>();
  private subroutines = new Map<string, SubroutineLevelTable>();
  private counts: Record<'STATIC' | 'FIELD', number> = { STATIC: 0, FIELD: 0 };

  constructor(public readonly className: string) {}

  public defineVar(name: string, type: string, kind: 'STATIC' | 'FIELD'): void {
    if (this.vars.has(name)) {
      throw new Error(`Identifier '${name}' is already defined in class scope.`);
    }

    this.vars.set(name, {
      name,
      type,
      kind,
      index: this.counts[kind]++,
    });
  }

  public defineSubroutine(name: string): SubroutineLevelTable {
    if (this.subroutines.has(name)) {
      throw new Error(`Subroutine '${name}' is already defined in class ${this.className}.`);
    }
    const table = new SubroutineLevelTable();
    this.subroutines.set(name, table);
    return table;
  }

  public lookup(name: string): SymbolEntry | undefined {
    return this.vars.get(name);
  }

  public getSubroutine(name: string): SubroutineLevelTable | undefined {
    return this.subroutines.get(name);
  }
}

export class SubroutineLevelTable {}
