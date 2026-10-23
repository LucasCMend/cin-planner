import { describe, test, expect } from 'vitest';
import validateTerm, { TermInput, Output } from './validateTerm.js';

function returnsInput(overrides: Partial<TermInput> = {}): TermInput {
  return {
    termCourses: ['CIN0144', 'CIN0143'],
    completed: new Set(['CIN0133', 'CIN0138', 'CIN0134']),
    preRequisites: new Map([
      ['CIN0144', ['CIN0133', 'CIN0138']],
      ['CIN0143', ['CIN0134']],
    ]),
    termWorkload: 180,
    ...overrides,
  };
}

describe('Validate Term', () => {
  describe('Happy Path', () => {
    test('Pre-Requisites completed and Workload under the max', () => {
      const output: Output = validateTerm(returnsInput());

      expect(output.reason).toEqual(new Map());
      expect(output.blocks).toEqual(new Map());
      expect(output.completed).toEqual([]);
      expect(output.overWorkload).toBe(false);
    });
  });
  describe('Pre-requisites', () => {
    test('Blocks with PR and lists missing requisites', () => {
      const output: Output = validateTerm(
        returnsInput({ completed: new Set(['CIN0133', 'CIN0138']) }),
      );

      expect(output.reason).toEqual(new Map([['CIN0143', ['PR']]]));
      expect(output.blocks).toEqual(new Map([['CIN0143', ['CIN0134']]]));
      expect(output.completed).toEqual([]);
      expect(output.overWorkload).toBe(false);
    });
  });
});
