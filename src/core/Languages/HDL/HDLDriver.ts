import { LanguageDriver, type CompilationResponse } from '../../LanguageDriver';
import { GenericTokenizer } from '../../Tokenizer';
import { HDLTokenMatcher } from './HDLSpec';
import { HDLParser } from './Parser';
import { CompilerError } from '../../Errors';
import type { HDLChipNode } from './AST';
import { type UINode } from '../Jack/Visitors/UITreeVisitor/types';

export class HDLDriver extends LanguageDriver {
  compileProject(files: Record<string, string>): CompilationResponse {
    const fileNames = Object.keys(files);
    const projectErrors: Record<string, CompilerError[]> = {};
    const trees: Record<string, UINode> = {};

    const successfulASTs = new Map<string, HDLChipNode>();
    fileNames.forEach((name) => (projectErrors[name] = []));
    fileNames.forEach((name) => {
      try {
        const source = files[name];
        const tokenizer = new GenericTokenizer(source, HDLTokenMatcher);
        const tokens = tokenizer.tokenize();
        const parser = new HDLParser(tokens);

        const ast = parser.parse();
        successfulASTs.set(name, ast);
      } catch (e) {
        if (e instanceof CompilerError) {
          projectErrors[name].push(e);
        } else {
          console.error(`Unexpected parsing error in ${name}:`, e);
        }
      }
    });

    return {
      errors: projectErrors,
      trees: trees,
      symbolTable: {
        name: 'HDL Project (Parsing Phase)',
        symbols: {},
        children: {},
      },
    };
  }
}
