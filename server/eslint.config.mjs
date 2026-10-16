import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage', 'src/generated'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    // domain must stay pure: no Prisma, Express or Zod.
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@prisma/*',
            'express',
            'zod',
            '**/repositories/*',
            '**/services/*',
            '**/controllers/*',
            '**/routes/*',
            '**/dto/*',
          ],
        },
      ],
    },
  },
);
