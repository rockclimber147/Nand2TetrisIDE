import { describe, expect, test } from 'vitest';
import { GenericTokenizer } from '../../src/core/Tokenizer';
import { HDLTokenMatcher } from '../../src/core/Languages/HDL/HDLSpec';
import { HDLParser } from '../../src/core/Languages/HDL/Parser';
import { ASTNodeKind } from '../../src/core/AST/AST';

describe('HDLParser', () => {
  const parseSource = (source: string) => {
    const tokenizer = new GenericTokenizer(source, HDLTokenMatcher);
    const tokens = tokenizer.tokenize();
    const parser = new HDLParser(tokens);
    return parser.parse();
  };

  test('should parse a minimal chip definition', () => {
    const source = `
      CHIP Empty {
        IN a;
        OUT b;
        PARTS:
      }
    `;
    const ast = parseSource(source);

    expect(ast.kind).toBe(ASTNodeKind.CHIP_DEFINITION);
    expect(ast.name).toBe('Empty');
    expect(ast.inputs.pins).toHaveLength(1);
    expect(ast.outputs.pins).toHaveLength(1);
    expect(ast.parts).toHaveLength(0);
  });

  test('should parse pins with widths (buses)', () => {
    const source = `
      CHIP BusExample {
        IN a, b[16], sel;
        OUT out[16];
        PARTS:
      }
    `;
    const ast = parseSource(source);

    // Check Inputs
    expect(ast.inputs.pins).toEqual([
      { name: 'a', width: undefined },
      { name: 'b', width: 16 },
      { name: 'sel', width: undefined },
    ]);

    // Check Outputs
    expect(ast.outputs.pins[0]).toEqual({ name: 'out', width: 16 });
  });

  test('should parse parts with multiple connections', () => {
    const source = `
      CHIP And {
        IN a, b;
        OUT out;
        PARTS:
        Nand(a=a, b=b, out=n);
        Not(in=n, out=out);
      }
    `;
    const ast = parseSource(source);

    expect(ast.parts).toHaveLength(2);

    // Check first part: Nand
    const nand = ast.parts[0];
    expect(nand.partName).toBe('Nand');
    expect(nand.connections).toContainEqual({ lhs: 'a', rhs: 'a', rhsIndex: undefined });
    expect(nand.connections).toContainEqual({ lhs: 'out', rhs: 'n', rhsIndex: undefined });
  });

  test('should parse bus slicing in part connections', () => {
    const source = `
      CHIP Mux16 {
        IN a[16], b[16], sel;
        OUT out[16];
        PARTS:
        Mux(a=a[0], b=b[0], sel=sel, out=out[0]);
        Mux8(a=a[8..15], b=b[8..15], sel=sel, out=out[8..15]);
      }
    `;
    const ast = parseSource(source);

    const mux0 = ast.parts[0];
    expect(mux0.connections[0].rhsIndex).toEqual({ start: 0, end: undefined });

    const mux8 = ast.parts[1];
    expect(mux8.connections[0].rhsIndex).toEqual({ start: 8, end: 15 });
  });

  test('should throw error on missing parts colon', () => {
    const source = `
      CHIP Fail {
        IN a;
        OUT out;
        PARTS // Missing colon
        Not(in=a, out=out);
      }
    `;
    expect(() => parseSource(source)).toThrow('Expected :');
  });
});
