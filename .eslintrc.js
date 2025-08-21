module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Suppress console.error warnings in production
    'no-console': 'off',
    // Allow unused variables in development
    'no-unused-vars': 'warn',
    // Allow missing dependencies in useEffect for now
    'react-hooks/exhaustive-deps': 'warn',
    // Allow missing prop types
    'react/prop-types': 'off',
    // Allow missing display name
    'react/display-name': 'off'
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
};
