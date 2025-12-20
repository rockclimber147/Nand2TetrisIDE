import type { JackClassNode, JackSubroutineNode } from "../../AST";
import { JackSpec } from "../../JackSpec";
import { JackVisitorTopLevel } from "../JackVisitorBase"
import { GlobalSymbolTable, SymbolKinds } from "./SymbolTable"

class SymbolTableVisitor extends JackVisitorTopLevel<GlobalSymbolTable> {
  private table: GlobalSymbolTable;
  constructor() {
    super();
    this.table = new GlobalSymbolTable();
  }
  protected visitClass(node: JackClassNode): GlobalSymbolTable {
    const classTable = this.table.addClass(node.name);
    node.classVarDecs.forEach(varDecNode => {
      varDecNode.names.forEach(name => {
        classTable.defineVar(name, varDecNode.type, varDecNode.varKind == JackSpec.STATIC? SymbolKinds.STATIC : SymbolKinds.FIELD);
      })
    })

    return this.table;
  }
  protected visitSubroutine(node: JackSubroutineNode): GlobalSymbolTable {
    throw new Error("Method not implemented.");
  }
}
