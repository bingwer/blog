module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-console': 'off', // 콘솔 사용 허용
    'spaced-comment': 'off', // 주석을 뒤에 쓸 수 있다.
    'no-unused-vars': 'off', // 사용 안한 변수 중복 제거
    'global-require': 'off', // 함수 내에서 require 사용 가능
    'arrow-body-style': 'off', // 화살표 함수 안에 return을 사용할 수 있다.
    'react/no-unescaped-entities': 'off', // 문자열 내에서 " ' > } 허용
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'jsx-a11y/anchor-is-valid': 'off', // next js 에서는 a태그에 href 없이 사용
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off', //spreding 허용
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      },
      react: {
        version: 'detect',
      },
    },
  },
};
