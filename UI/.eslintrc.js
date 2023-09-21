module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended', // If using React
    ],
    plugins: ['@typescript-eslint', 'react'], // If using React
    rules: {
        // Your custom ESLint rules here (if any)
    },
};

