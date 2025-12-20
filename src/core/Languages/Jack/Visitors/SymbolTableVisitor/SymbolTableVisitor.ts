import type { JackClassNode, JackSubroutineNode } from "../../AST";
import { JackVisitorTopLevel } from "../JackVisitorBase"
import { GlobalSymbolTable } from "./SymbolTable"

class SymbolTableVisitor extends JackVisitorTopLevel<GlobalSymbolTable> {
  private table: GlobalSymbolTable;
  constructor() {
    super();
    this.table = new GlobalSymbolTable();
  }
  protected visitClass(node: JackClassNode): GlobalSymbolTable {
    throw new Error("Method not implemented.");
  }
  protected visitSubroutine(node: JackSubroutineNode): GlobalSymbolTable {
    throw new Error("Method not implemented.");
  }
}
