module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    'globals': {
        'module': 'readonly'
    },
    rules: {
        'indent': ['error', 2],
        'semi': ['error', 'always'],
        'no-trailing-spaces': 'error',
        'no-unused-vars': 'warn',
        'quotes': ['error', 'single', { 'avoidEscape': true }],
        'no-multiple-empty-lines': ['error', { 'max': 1 }],
        'space-in-parens': ['error', 'never'],
        'comma-spacing': ['error', { 'before': false, 'after': true }],
        'func-call-spacing': ['error', 'never'],
        'no-underscore-dangle': 'warn',
        'no-param-reassign': 'warn',
        'prefer-promise-reject-errors': 'error',
        'import/no-unresolved': 0,
        'no-await-in-loop': 'warn',
        'new-cap': 'warn',
        'max-len': ['error', { 'code': 250 }],
        'object-curly-spacing': ['error', 'always'],
        'no-console': 'warn'
    },
};