import { LanguageDriver } from "../../Parser/LanguageDriver";
import { GenericTokenizer } from "../../Tokenizer";
import { JackTokenMatcher } from "./JackSpec";
import { JackParser } from "./Parser";
import { type CompilationResult } from "../../Parser/LanguageDriver";
import { CompilerError } from "../../Errors";

export class JackDriver extends LanguageDriver<any> {
  compile(source: string): CompilationResult<any> {
    try {
      const tokenizer =new GenericTokenizer(source, JackTokenMatcher);
      const tokens = tokenizer.tokenize();
      
      const parser = new JackParser(tokens);
      const ast = parser.parse();

      return { ast, errors: [] };
    } catch (e) {
      if (e instanceof CompilerError) {
        return { ast: null, errors: [e] };
      }
      return { ast: null, errors: [] }; 
    }
  }
}