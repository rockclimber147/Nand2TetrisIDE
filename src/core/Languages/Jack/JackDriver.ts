import { LanguageDriver } from '../../Parser/LanguageDriver';
import { GenericTokenizer } from '../../Tokenizer';
import { JackTokenMatcher } from './JackSpec';
import { JackParser } from './Parser';
import { CompilerError } from '../../Errors';
import { GlobalSymbolTable } from './Visitors/SymbolTableVisitor/SymbolTable';
import { SymbolTableVisitor } from './Visitors/SymbolTableVisitor/SymbolTableVisitor';
import { JackSemanticVisitor } from './Visitors/SemanticVisitor/SemanticVisitor';
import { SymbolTableBuiltinBuilder } from './Visitors/SymbolTableVisitor/SymbolTableBuiltInBuilder';

export class JackDriver extends LanguageDriver {
  compileProject(files: Record<string, string>): Record<string, CompilerError[]> {
    const fileNames = Object.keys(files);
    const sources = Object.values(files);
    const projectErrors: Record<string, CompilerError[]> = {};

    fileNames.forEach((name) => (projectErrors[name] = []));

    try {
      const asts = sources.map((source) => {
        const tokenizer = new GenericTokenizer(source, JackTokenMatcher);
        const tokens = tokenizer.tokenize();
        const parser = new JackParser(tokens);
        return parser.parse();
      });

      let globalTable = new GlobalSymbolTable();
      SymbolTableBuiltinBuilder.populate(globalTable);
      const stVisitor = new SymbolTableVisitor(globalTable);
      asts.forEach((ast) => {
        stVisitor.visit(ast);
      });

      const semanticVisitor = new JackSemanticVisitor(globalTable);
      asts.forEach((ast, index) => {
        semanticVisitor.visit(ast);
        const fileName = fileNames[index];
        projectErrors[fileName] = semanticVisitor.getErrorsForCurrentPass();
      });
    } catch (e) {
    }

    return projectErrors;
  }
}
