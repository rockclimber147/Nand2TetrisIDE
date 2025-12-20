import { describe, expect, test } from 'vitest';
import { GenericTokenizer } from '../../../../src/core/Tokenizer';
import { JackTokenMatcher } from '../../../../src/core/Languages/Jack/JackSpec';
import { JackParser } from '../../../../src/core/Languages/Jack/Parser';
import { SymbolTableVisitor } from '../../../../src/core/Languages/Jack/Visitors/SymbolTableVisitor/SymbolTableVisitor';
import { SymbolKinds } from '../../../../src/core/Languages/Jack/Visitors/SymbolTableVisitor/SymbolTable';

describe('SymbolTableVisitor', () => {
    const getTableFromSource = (source: string) => {
        const tokenizer = new GenericTokenizer(source, JackTokenMatcher);
        const tokens = tokenizer.tokenize();
        const parser = new JackParser(tokens);
        const ast = parser.parse();

        const visitor = new SymbolTableVisitor();
        return visitor.visit(ast);
    };

    test('should populate class-level fields and statics', () => {
        const source = `
      class Square {
        field int x, y;
        static int count;
        
        function void main() {}
      }
    `;
        const globalTable = getTableFromSource(source);
        // Note: You'll need to expose a getClass method or make classes public in GlobalSymbolTable
        const squareTable = (globalTable as any).classes.get("Square");

        expect(squareTable.lookupVar("x")).toMatchObject({ kind: SymbolKinds.FIELD, index: 0, type: 'int' });
        expect(squareTable.lookupVar("y")).toMatchObject({ kind: SymbolKinds.FIELD, index: 1, type: 'int' });
        expect(squareTable.lookupVar("count")).toMatchObject({ kind: SymbolKinds.STATIC, index: 0, type: 'int' });
    });

    test('should handle implicit "this" in methods but not functions', () => {
        const source = `
      class Square {
        method void draw() {}
        function void reset() {}
      }
    `;
        const globalTable = getTableFromSource(source);
        const squareTable = (globalTable as any).classes.get("Square");

        const drawTable = squareTable.lookupSubroutine("draw");
        const resetTable = squareTable.lookupSubroutine("reset");

        // draw is a method, should have 'this' at ARG 0
        expect(drawTable.lookupVar("this")).toMatchObject({
            kind: SymbolKinds.ARG,
            index: 0,
            type: "Square"
        });

        // reset is a function, 'this' should not exist
        expect(() => resetTable.lookupVar("this")).toThrow();
    });

    test('should populate subroutine arguments and local variables', () => {
        const source = `
      class Math {
        function int add(int a, int b) {
          var int sum;
          let sum = a + b;
          return sum;
        }
      }
    `;
        const globalTable = getTableFromSource(source);
        const mathTable = (globalTable as any).classes.get("Math");
        const addTable = mathTable.lookupSubroutine("add");

        expect(addTable.lookupVar("a")).toMatchObject({ kind: SymbolKinds.ARG, index: 0 });
        expect(addTable.lookupVar("b")).toMatchObject({ kind: SymbolKinds.ARG, index: 1 });
        expect(addTable.lookupVar("sum")).toMatchObject({ kind: SymbolKinds.VAR, index: 0 });
    });

    test('should maintain separate indices for different subroutines', () => {
        const source = `
      class Test {
        method void first(int a) { var int x; }
        method void second(int b) { var int x, y; }
      }
    `;
        const globalTable = getTableFromSource(source);
        const testTable = (globalTable as any).classes.get("Test");

        const first = testTable.lookupSubroutine("first");
        const second = testTable.lookupSubroutine("second");

        // 'this' is at index 0 for both because they are methods
        expect(first.lookupVar("a").index).toBe(1);
        expect(second.lookupVar("b").index).toBe(1);

        expect(first.lookupVar("x").index).toBe(0);
        expect(second.lookupVar("y").index).toBe(1);
    });

    test('should throw error on duplicate class variable definition', () => {
        const source = `
      class Bad {
        field int x;
        static int x;
      }
    `;
        expect(() => getTableFromSource(source)).toThrow(/already defined in class scope/);
    });
});