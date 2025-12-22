import { LanguageDriver } from '../../Parser/LanguageDriver';
import { GenericTokenizer } from '../../Tokenizer';
import { JackTokenMatcher } from './JackSpec';
import { JackParser } from './Parser';
import { CompilerError } from '../../Errors';
import { GlobalSymbolTable } from './Visitors/SymbolTableVisitor/SymbolTable';
import { SymbolTableVisitor } from './Visitors/SymbolTableVisitor/SymbolTableVisitor';
import { JackSemanticVisitor } from './Visitors/SemanticVisitor/SemanticVisitor';

export class JackDriver extends LanguageDriver {
  compileProject(files: Record<string, string>): Record<string, CompilerError[]> {
    const fileNames = Object.keys(files);
    const sources = Object.values(files);
    const projectErrors: Record<string, CompilerError[]> = {};

    // Initialize error arrays for every file
    fileNames.forEach((name) => (projectErrors[name] = []));

    try {
      const asts = sources.map((source) => {
        const tokenizer = new GenericTokenizer(source, JackTokenMatcher);
        const tokens = tokenizer.tokenize();
        const parser = new JackParser(tokens);
        return parser.parse();
      });

      const stVisitor = new SymbolTableVisitor();
      let globalTable = new GlobalSymbolTable();
      asts.forEach((ast) => {
        globalTable = stVisitor.visit(ast);
      });

      const semanticVisitor = new JackSemanticVisitor(globalTable);
      asts.forEach((ast, index) => {
        semanticVisitor.visit(ast);
        const fileName = fileNames[index];
        projectErrors[fileName] = semanticVisitor.getErrorsForCurrentPass();
      });
    } catch (e) {
      // Handle catastrophic Parse/Lex errors (which usually happen in the active file)
      // You might need to check which file index failed here
    }

    return projectErrors;
  }
}
