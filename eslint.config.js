import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import googleAppsScript from 'eslint-plugin-googleappsscript';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,gs}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module', // Changed from 'script' to 'module'
      globals: {
        ...googleAppsScript.environments.googleappsscript.globals,
      },
    },
    plugins: {
      prettier: prettier,
      googleappsscript: googleAppsScript,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^(onEdit|onOpen|onInstall|show[A-Z].*Dialog)$',
        },
      ],
      'no-console': 'off',
    },
  },
];
