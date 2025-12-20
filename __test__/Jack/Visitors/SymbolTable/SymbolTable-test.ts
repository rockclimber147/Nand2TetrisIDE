import { describe, expect, test, beforeEach } from 'vitest';
import {
  GlobalSymbolTable,
  SymbolKinds,
} from '../../../../src/core/Languages/Jack/Visitors/SymbolTableVisitor/SymbolTable';

describe('SymbolTable', () => {
  let globalTable: GlobalSymbolTable;

  beforeEach(() => {
    globalTable = new GlobalSymbolTable();
  });

  test('should define and retrieve class-level variables with correct indices', () => {
    const classTable = globalTable.addClass('Main');

    classTable.defineVar('x', 'int', SymbolKinds.FIELD);
    classTable.defineVar('y', 'int', SymbolKinds.FIELD);
    classTable.defineVar('v', 'boolean', SymbolKinds.STATIC);

    const x = classTable.lookupVar('x');
    const y = classTable.lookupVar('y');
    const v = classTable.lookupVar('v');

    expect(x).toEqual({ name: 'x', type: 'int', kind: SymbolKinds.FIELD, index: 0 });
    expect(y).toEqual({ name: 'y', type: 'int', kind: SymbolKinds.FIELD, index: 1 });
    expect(v).toEqual({ name: 'v', type: 'boolean', kind: SymbolKinds.STATIC, index: 0 });
  });

  test('should define and retrieve subroutine variables', () => {
    const classTable = globalTable.addClass('Main');
    const subTable = classTable.defineSubroutine('main');

    subTable.defineVar('a', 'int', SymbolKinds.ARG);
    subTable.defineVar('b', 'int', SymbolKinds.ARG);
    subTable.defineVar('i', 'int', SymbolKinds.VAR);

    expect(subTable.lookupVar('a').index).toBe(0);
    expect(subTable.lookupVar('b').index).toBe(1);
    expect(subTable.lookupVar('i').index).toBe(0);
  });

  test('should throw error when defining duplicate names in same scope', () => {
    const classTable = globalTable.addClass('Main');
    classTable.defineVar('duplicate', 'int', SymbolKinds.FIELD);

    expect(() => {
      classTable.defineVar('duplicate', 'boolean', SymbolKinds.STATIC);
    }).toThrow(/already defined in class scope/);
  });

  test('should allow same variable name in different subroutines', () => {
    const classTable = globalTable.addClass('Main');

    const sub1 = classTable.defineSubroutine('first');
    const sub2 = classTable.defineSubroutine('second');

    sub1.defineVar('counter', 'int', SymbolKinds.VAR);
    sub2.defineVar('counter', 'int', SymbolKinds.VAR);

    expect(sub1.lookupVar('counter').index).toBe(0);
    expect(sub2.lookupVar('counter').index).toBe(0);
  });

  test('should maintain separate indices for different kinds in same scope', () => {
    const classTable = globalTable.addClass('Main');
    const subTable = classTable.defineSubroutine('test');

    subTable.defineVar('arg0', 'int', SymbolKinds.ARG);
    subTable.defineVar('var0', 'int', SymbolKinds.VAR);
    subTable.defineVar('arg1', 'int', SymbolKinds.ARG);

    expect(subTable.lookupVar('arg0').index).toBe(0);
    expect(subTable.lookupVar('arg1').index).toBe(1);
    expect(subTable.lookupVar('var0').index).toBe(0);
  });

  test('should throw error on looking up non-existent variable', () => {
    const classTable = globalTable.addClass('Main');
    expect(() => classTable.lookupVar('ghost')).toThrow(/does not exist/);
  });
});
