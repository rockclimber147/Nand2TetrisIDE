import { BaseParser } from "../Parser/BaseParser";
import { TokenType } from "../Token";
import { JackSpec } from "./JackSpec";
import type { 
    JackClassNode, 
    JackClassVarDecNode, 
    ClassVarKind,
    JackSubroutineNode,
    SubroutineKind, 
    JackParameterNode, 
    JackSubroutineBodyNode,
    SubroutineVarKind,
    JackSubroutineVarDecNode
} from "./AST";
import { ASTNodeKind } from "../Parser/AST";

export class JackParser extends BaseParser<JackClassNode> {
    
    public parse(): JackClassNode {
        return this.parseClass();
    }

    private parseClass(): JackClassNode {
        const startToken = this.validator.expectLexeme(JackSpec.CLASS);
        const className = this.validator.expectType(TokenType.IDENTIFIER).lexeme;
        
        this.validator.expectLexeme(JackSpec.L_BRACE);

        const classVarDecs: JackClassVarDecNode[] = [];
        const subroutines: JackSubroutineNode[] = [];

        while (this.check(TokenType.KEYWORD, JackSpec.STATIC) || 
               this.check(TokenType.KEYWORD, JackSpec.FIELD)) {
            classVarDecs.push(this.parseClassVarDec());
        }

        while (this.check(TokenType.KEYWORD, JackSpec.CONSTRUCTOR) || 
               this.check(TokenType.KEYWORD, JackSpec.FUNCTION) || 
               this.check(TokenType.KEYWORD, JackSpec.METHOD)) {
            subroutines.push(this.parseSubroutine());
        }

        const endToken = this.validator.expectLexeme(JackSpec.R_BRACE);

        return {
            kind: ASTNodeKind.CLASS,
            startToken,
            endToken,
            name: className,
            classVarDecs,
            subroutines
        };
    }

    private parseClassVarDec(): JackClassVarDecNode {
        const varKinds = new Set([JackSpec.STATIC, JackSpec.FIELD]);
        const startToken = this.validator.expectOneOfLexemes(varKinds);
        const varKind = startToken.lexeme as ClassVarKind;

        let type: string;
        const next = this.validator.peek();
        if (next.type === TokenType.KEYWORD) {
            type = this.validator.expectOneOfLexemes(JackSpec.TYPES).lexeme;
        } else {
            type = this.validator.expectType(TokenType.IDENTIFIER).lexeme;
        }

        const names: string[] = [];
        names.push(this.validator.expectType(TokenType.IDENTIFIER).lexeme);

        while (this.match(TokenType.SYMBOL, JackSpec.COMMA)) {
            names.push(this.validator.expectType(TokenType.IDENTIFIER).lexeme);
        }

        const endToken = this.validator.expectLexeme(JackSpec.SEMI);

        return {
            kind: ASTNodeKind.VAR_DEC,
            startToken,
            endToken,
            varKind,
            type,
            names
        };
    }

    /**
     * ('constructor'|'function'|'method') ('void'|type) subroutineName '(' parameterList ')' subroutineBody
     */
    private parseSubroutine(): JackSubroutineNode {
        const subroutineKinds = new Set([JackSpec.CONSTRUCTOR, JackSpec.METHOD, JackSpec.FUNCTION])
        const startToken = this.validator.expectOneOfLexemes(subroutineKinds);
        const subroutineKind = startToken.lexeme as SubroutineKind;

        let returnType: string;
        const next = this.validator.peek();
        if (next.type === TokenType.KEYWORD) {
            returnType = this.validator.expectOneOfLexemes(JackSpec.RETURN_TYPES).lexeme;
        } else {
            returnType = this.validator.expectType(TokenType.IDENTIFIER).lexeme;
        }

        const subroutineNameToken = this.validator.expectType(TokenType.IDENTIFIER);
        const parameters: JackParameterNode[] = this.parseParameterList();
        const body: JackSubroutineBodyNode = this.parseSubroutineBody();
        return {
            kind: ASTNodeKind.SUBROUTINE,
            startToken: startToken,
            subroutineKind: subroutineKind,
            name: subroutineNameToken.lexeme,
            returnType: returnType,
            parameters: parameters,
            body: body,
            endToken: body.endToken
        }
    }

private parseParameterList(): JackParameterNode[] {
    const params: JackParameterNode[] = [];
    
    this.validator.expectLexeme(JackSpec.L_PAREN);

    if (!this.check(TokenType.SYMBOL, JackSpec.R_PAREN)) {
        do {
            const paramStart = this.validator.peek(0);

            let type: string;
            if (this.check(TokenType.KEYWORD)) {
                type = this.validator.expectOneOfLexemes(JackSpec.TYPES).lexeme;
            } else {
                type = this.validator.expectType(TokenType.IDENTIFIER).lexeme;
            }

            const nameToken = this.validator.expectType(TokenType.IDENTIFIER);
            const name = nameToken.lexeme;

            params.push({
                kind: ASTNodeKind.PARAMS,
                startToken: paramStart,
                endToken: nameToken,
                type: type,
                name: name
            });

        } while (this.match(TokenType.SYMBOL, JackSpec.COMMA));
    }

    this.validator.expectLexeme(JackSpec.R_PAREN);
    return params;
}

    private parseSubroutineBody(): JackSubroutineBodyNode {
        const startToken = this.validator.expectLexeme(JackSpec.L_BRACE);
        const subroutineVarDecs: JackSubroutineVarDecNode[] = [];
        while (this.check(TokenType.KEYWORD, JackSpec.VAR)) {
            subroutineVarDecs.push(this.parseSubroutineVarDec())
        }
        const endToken = this.validator.expectLexeme(JackSpec.R_BRACE);
        return {
            kind: ASTNodeKind.SUBROUTINE,
            startToken: startToken,
            varDecs: subroutineVarDecs,
            endToken: endToken,
        };
    }

        private parseSubroutineVarDec(): JackSubroutineVarDecNode {
        const startToken = this.validator.expectLexeme(JackSpec.VAR);
        const varKind = startToken.lexeme as SubroutineVarKind;

        let type: string;
        const next = this.validator.peek();
        if (next.type === TokenType.KEYWORD) {
            type = this.validator.expectOneOfLexemes(JackSpec.TYPES).lexeme;
        } else {
            type = this.validator.expectType(TokenType.IDENTIFIER).lexeme;
        }

        const names: string[] = [];
        names.push(this.validator.expectType(TokenType.IDENTIFIER).lexeme);

        while (this.match(TokenType.SYMBOL, JackSpec.COMMA)) {
            names.push(this.validator.expectType(TokenType.IDENTIFIER).lexeme);
        }

        const endToken = this.validator.expectLexeme(JackSpec.SEMI);

        return {
            kind: ASTNodeKind.VAR_DEC,
            startToken,
            endToken,
            varKind,
            type,
            names
        };
    }
}