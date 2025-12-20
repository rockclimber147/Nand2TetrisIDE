import type { JackClassNode, JackSubroutineNode } from "../../AST";
import { JackSpec } from "../../JackSpec";
import { JackVisitorTopLevel } from "../JackVisitorBase"
import { ClassLevelTable, GlobalSymbolTable, SymbolKinds } from "./SymbolTable"

export class SymbolTableVisitor extends JackVisitorTopLevel<GlobalSymbolTable> {
  private table: GlobalSymbolTable;
  private current: ClassLevelTable | undefined = undefined;
  constructor() {
    super();
    this.table = new GlobalSymbolTable();
  }
  protected visitClass(node: JackClassNode): GlobalSymbolTable {
    const classTable = this.table.addClass(node.name);
    this.current = classTable;
    node.classVarDecs.forEach(varDecNode => {
      varDecNode.names.forEach(name => {
        classTable.defineVar(name, varDecNode.type, varDecNode.varKind == JackSpec.STATIC ? SymbolKinds.STATIC : SymbolKinds.FIELD); // TODO: Better organization of types
      })
    })

    node.subroutines.forEach(subroutineNode => {
      this.visitSubroutine(subroutineNode);
    })

    this.current = undefined;
    return this.table;
  }
  protected visitSubroutine(node: JackSubroutineNode): GlobalSymbolTable {
    const classTable = this.current!;
    const subroutineTable = classTable.defineSubroutine(node.name);
    node.parameters.forEach(param => {
      subroutineTable.defineVar(param.name, param.type, SymbolKinds.ARG);
    })
    const varDecs = node.body?.varDecs
    if (varDecs) {
      varDecs.forEach(varDecNode => {
        varDecNode.names.forEach(name => {
          subroutineTable.defineVar(name, varDecNode.varKind, SymbolKinds.VAR);
        })
      })
    }
    return this.table;
  }

}
