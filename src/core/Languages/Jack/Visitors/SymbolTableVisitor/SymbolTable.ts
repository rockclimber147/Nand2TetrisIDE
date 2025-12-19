export class SymbolKinds {
    static readonly STATIC = "STATIC";
    static readonly FIELD = "FIELD";
    static readonly ARG = "ARG";
    static readonly VAR = "VAR";
}
export type ClassSymbolKind = typeof SymbolKinds.STATIC | typeof SymbolKinds.FIELD
export type FieldSymbolKind = typeof SymbolKinds.ARG | typeof SymbolKinds.VAR;

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
}



export interface ClassSymbolEntry {
    name: string;
    type: string;
    kind: ClassSymbolKind;
    index: number;
}

export class ClassLevelTable {
    private vars = new Map<string, ClassSymbolEntry>();
    private subroutines = new Map<string, SubroutineLevelTable>();
    private counts: Record<ClassSymbolKind, number> = { STATIC: 0, FIELD: 0 };

    constructor(public readonly className: string, public readonly isBuiltIn: boolean = false) { }

    public defineVar(name: string, type: string, kind: ClassSymbolKind): void {
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

    public lookup(name: string): ClassSymbolEntry | undefined {
        if (!this.vars.has(name)) {
            throw new Error(`Var ${name} does not exist in class ${this.className}`)
        }
        return this.vars.get(name);
    }

    public getSubroutine(name: string): SubroutineLevelTable | undefined {
        if (!this.vars.has(name)) {
            throw new Error(`Method/Function ${name} does not exist in class ${this.className}`)
        }
        return this.subroutines.get(name);
    }
}

export class SubroutineLevelTable { }
