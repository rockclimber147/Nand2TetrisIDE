import { SymbolKind, type ClassVarKind, type SubroutineVarKind, type SymbolEntry } from './types';
import { JackSpec } from '../../JackSpec';

export class GlobalSymbolTable {
  private classes = new Map<string, ClassLevelTable>();

  public addClass(className: string): ClassLevelTable {
    if (this.classes.has(className) && !this.classes.get(className)?.getBuiltin()) {
      throw new Error(`Class ${className} already defined.`);
    }
    const table = new ClassLevelTable(className);
    this.classes.set(className, table);
    return table;
  }

  public validateVar(name: string, fromClass: string, fromSubroutine: string): string | null {
    const symbol = this.findVar(name, fromClass, fromSubroutine);

    if (!symbol) {
      return `Variable '${name}' is not defined.`;
    }

    // Access Rule: field variables cannot be accessed in static functions
    if (symbol.kind === SymbolKind.FIELD) {
      const sub = this.classes.get(fromClass)?.lookupSubroutine(fromSubroutine);
      // You'll need to store the subroutine type (function/method) in the table
      if (sub?.category === JackSpec.FUNCTION) {
        return `Field variable '${name}' cannot be accessed from a static function.`;
      }
    }

    return null;
  }

  public validateSubroutineCall(
    methodName: string,
    fromClass: string,
    fromSubroutine: string,
    target?: string, // The 'x' in x.y()
  ): string | null {
    const callerClass = this.classes.get(fromClass);
    const callerSub = callerClass?.lookupSubroutine(fromSubroutine);

    let targetClassName: string;
    let isInstanceCall = false;

    if (!target) {
      if (callerSub?.category === JackSpec.FUNCTION) {
        return `Cannot call method '${methodName}' from a static function without an instance.`;
      }
      targetClassName = fromClass;
      isInstanceCall = true;
    } else {
      const targetVar = this.findVar(target, fromClass, fromSubroutine);

      if (targetVar) {
        targetClassName = targetVar.type;
        isInstanceCall = true;
      } else {
        targetClassName = target;
        isInstanceCall = false;
      }
    }

    const targetClassTable = this.classes.get(targetClassName);
    if (!targetClassTable) {
      return `Class '${targetClassName}' is not defined.`;
    }

    try {
      const targetSub = targetClassTable.lookupSubroutine(methodName);

      if (isInstanceCall && targetSub.category === JackSpec.FUNCTION) {
        return `Function '${methodName}' must be called using the class name, not an instance.`;
      }
      if (!isInstanceCall && targetSub.category === JackSpec.METHOD) {
        return `Method '${methodName}' must be called using an instance, not the class name.`;
      }
    } catch (e) {
      return `Subroutine '${methodName}' does not exist in class '${targetClassName}'.`;
    }

    return null;
  }

  private findVar(
    name: string,
    fromClass: string,
    fromSubroutine: string,
  ): SymbolEntry | undefined {
    const classTable = this.classes.get(fromClass);
    if (!classTable) return undefined;

    try {
      const subTable = classTable.lookupSubroutine(fromSubroutine);
      return subTable.lookupVar(name);
    } catch {
      try {
        return classTable.lookupVar(name);
      } catch {
        return undefined;
      }
    }
  }
}

export class ClassLevelTable {
  private vars = new Map<string, SymbolEntry>();
  private subroutines = new Map<string, SubroutineLevelTable>();
  private counts: Record<ClassVarKind, number> = { STATIC: 0, FIELD: 0 };

  constructor(
    public readonly className: string,
    private isBuiltIn: boolean = false,
  ) {}

  public setBuiltIn() {this.isBuiltIn = true}
  public getBuiltin() {return this.isBuiltIn}

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

  public defineSubroutine(name: string, category: string): SubroutineLevelTable {
    if (this.subroutines.has(name)) {
      throw new Error(`Subroutine '${name}' is already defined in class ${this.className}.`);
    }
    const table = new SubroutineLevelTable(name, this.className, category);
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
    public readonly category: string,
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
