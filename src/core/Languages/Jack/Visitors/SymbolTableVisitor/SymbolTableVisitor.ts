import type { JackClassNode, JackSubroutineNode } from '../../AST';
import { JackSpec } from '../../JackSpec';
import { JackVisitorTopLevel } from '../JackVisitorBase';
import { ClassLevelTable, GlobalSymbolTable, SymbolKinds } from './SymbolTable';

export class SymbolTableVisitor extends JackVisitorTopLevel<GlobalSymbolTable> {
  private table: GlobalSymbolTable;
  private currentClass: ClassLevelTable | undefined = undefined;

  constructor() {
    super();
    this.table = new GlobalSymbolTable();
  }

  protected visitClass(node: JackClassNode): GlobalSymbolTable {
    const classTable = this.table.addClass(node.name);
    this.currentClass = classTable;

    node.classVarDecs.forEach((varDecNode) => {
      varDecNode.names.forEach((name) => {
        const kind = varDecNode.varKind === JackSpec.STATIC
          ? SymbolKinds.STATIC
          : SymbolKinds.FIELD;
        classTable.defineVar(name, varDecNode.type, kind);
      });
    });

    node.subroutines.forEach((subroutineNode) => {
      this.visitSubroutine(subroutineNode);
    });

    this.currentClass = undefined;
    return this.table;
  }

  protected visitSubroutine(node: JackSubroutineNode): GlobalSymbolTable {
    const classTable = this.currentClass!;
    const subroutineTable = classTable.defineSubroutine(node.name);

    if (node.subroutineKind === JackSpec.METHOD) {
      subroutineTable.defineVar(JackSpec.THIS, classTable.className, SymbolKinds.ARG);
    }

    node.parameters.forEach((param) => {
      subroutineTable.defineVar(param.name, param.type, SymbolKinds.ARG);
    });

    node.body?.varDecs.forEach((varDecNode) => {
      varDecNode.names.forEach((name) => {
        subroutineTable.defineVar(name, varDecNode.type, SymbolKinds.VAR);
      });
    });

    return this.table;
  }
}