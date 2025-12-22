import type { ClassVarKind, SubroutineVarKind, SymbolEntry } from './types';

export class GlobalSymbolTable {
  private classes = new Map<string, ClassLevelTable>();

  public addClass(className: string): ClassLevelTable {
    if (this.classes.has(className) && !this.classes.get(className)?.isBuiltIn) {
      throw new Error(`Class ${className} already defined.`);
    }
    const table = new ClassLevelTable(className);
    this.classes.set(className, table);
    return table;
  }

  public validateVar(name: string, fromClass: string, fromSubroutine: string) {

  }

  public validateSubroutineCall(name: string, fromClass: string, fromSubroutine: string) {

  }

  
}

export class ClassLevelTable {
  private vars = new Map<string, SymbolEntry>();
  private subroutines = new Map<string, SubroutineLevelTable>();
  private counts: Record<ClassVarKind, number> = { STATIC: 0, FIELD: 0 };

  constructor(
    public readonly className: string,
    public readonly isBuiltIn: boolean = false,
  ) {}

  public defineVar(name: string, type: string, kind: ClassVarKind): void {
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

  public lookupVar(name: string): SymbolEntry {
    if (!this.vars.has(name)) {
      throw new Error(`Var ${name} does not exist in class ${this.className}`);
    }
    return this.vars.get(name)!;
  }

  public defineSubroutine(name: string): SubroutineLevelTable {
    if (this.subroutines.has(name)) {
      throw new Error(`Subroutine '${name}' is already defined in class ${this.className}.`);
    }
    const table = new SubroutineLevelTable(name, this.className);
    this.subroutines.set(name, table);
    return table;
  }


  public lookupSubroutine(name: string): SubroutineLevelTable {
    if (!this.subroutines.has(name)) {
      throw new Error(`Method/Function ${name} does not exist in class ${this.className}`);
    }
    return this.subroutines.get(name)!;
  }
}

export class SubroutineLevelTable {
  private vars: Map<string, SymbolEntry> = new Map();
  private counts: Record<SubroutineVarKind, number> = { VAR: 0, ARG: 0 };

  constructor(
    public readonly subroutineName: string,
    public readonly className: string,
  ) {}

  public defineVar(name: string, type: string, kind: SubroutineVarKind): void {
    if (this.vars.has(name)) {
      throw new Error(
        `Identifier '${name}' is already defined in ${this.className}.${this.subroutineName}`,
      );
    }

    this.vars.set(name, {
      name,
      type,
      kind,
      index: this.counts[kind]++,
    });
  }

  public lookupVar(name: string): SymbolEntry {
    if (!this.vars.has(name)) {
      throw new Error(
        `Var ${name} does not exist in class ${this.className}.${this.subroutineName}`,
      );
    }
    return this.vars.get(name)!;
  }
}
