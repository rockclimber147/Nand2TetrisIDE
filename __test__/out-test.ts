import { expect, test } from 'vitest';
import { OutputTest } from "../src/core/output"


test("output", () => {
    const o = new OutputTest();
    o.out();
    expect(1).toBe(1);
})