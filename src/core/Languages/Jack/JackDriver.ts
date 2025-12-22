import { LanguageDriver, type CompilationResponse } from '../../Parser/LanguageDriver';
import { GenericTokenizer } from '../../Tokenizer';
import { JackTokenMatcher } from './JackSpec';
import { JackParser } from './Parser';
import { CompilerError } from '../../Errors';
import { GlobalSymbolTable } from './Visitors/SymbolTableVisitor/SymbolTable';
import { SymbolTableVisitor } from './Visitors/SymbolTableVisitor/SymbolTableVisitor';
import { JackSemanticVisitor } from './Visitors/SemanticVisitor/SemanticVisitor';
import { SymbolTableBuiltinBuilder } from './Visitors/SymbolTableVisitor/SymbolTableBuiltInBuilder';
import { type JackClassNode } from './AST';
import type { UINode } from './Visitors/UITreeVisitor/types';
import { UITreeVisitor } from './Visitors/UITreeVisitor/UITreeVisitor';

export class JackDriver extends LanguageDriver {
  compileProject(files: Record<string, string>): CompilationResponse {
    const fileNames = Object.keys(files);
    const projectErrors: Record<string, CompilerError[]> = {};
    const asts: (JackClassNode | null)[] = [];

    fileNames.forEach((name) => (projectErrors[name] = []));

    fileNames.forEach((name) => {
      try {
        const source = files[name];
        const tokenizer = new GenericTokenizer(source, JackTokenMatcher);
        const tokens = tokenizer.tokenize();
        const parser = new JackParser(tokens);

        asts.push(parser.parse());
      } catch (e) {
        asts.push(null);
        if (e instanceof CompilerError) {
          projectErrors[name].push(e);
        } else {
          console.error(`Unexpected error in ${name}:`, e);
        }
      }
    });

    let globalTable = new GlobalSymbolTable();
    SymbolTableBuiltinBuilder.populate(globalTable);
    const stVisitor = new SymbolTableVisitor(globalTable);

    asts.forEach((ast) => {
      if (ast) stVisitor.visit(ast);
    });

    const semanticVisitor = new JackSemanticVisitor(globalTable);
    asts.forEach((ast, index) => {
      if (ast) {
        const fileName = fileNames[index];
        semanticVisitor.visit(ast);
        projectErrors[fileName].push(...semanticVisitor.getErrorsForCurrentPass());
      }
    });

    const trees: Record<string, UINode> = {};
    const uiVisitor = new UITreeVisitor();

    asts.forEach((ast, index) => {
      if (ast) {
        const fileName = fileNames[index];
        trees[fileName] = uiVisitor.visit(ast);
      }
    });

    return { errors: projectErrors, trees: trees };
  }
}
