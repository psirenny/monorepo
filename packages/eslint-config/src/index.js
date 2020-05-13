// @flow strict

export default {
  extends: [
    'eslint-config-airbnb-base',
    'plugin:array-func/all',
    'plugin:ava/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:eslint-plugin/recommended',
    'plugin:flowtype/recommended',
  ],
  parser: 'babel-eslint',
  plugins: [
    'array-func',
    'ava',
    'babel',
    'eslint-comments',
    'eslint-plugin',
    'flowtype',
    'markdown',
    'optimize-regex',
    'unicorn',
  ],
  rules: {
    'arrow-parens': [0],
    'eslint-comments/disable-enable-pair': [2, { allowWholeFile: true }],
    'flowtype/newline-after-flow-annotation': [2, 'always'],
    'flowtype/no-existential-type': [2],
    'flowtype/no-weak-types': [2],
    'flowtype/require-types-at-top': [2],
    'flowtype/require-valid-file-annotation': [2, 'always', { annotationStyle: 'line' }],
    'flowtype/sort-keys': [2, 'asc', { natural: true }],
    'flowtype/type-id-match': [2, '^([A-Z][a-z0-9]*)+$'],
    'function-paren-newline': [0, 'consistent'],
    'max-len': [2, {
      code: 160,
      ignoreComments: false,
      ignorePattern: '^(ex|im)port (.*)',
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreUrls: true,
      tabWidth: 2,
    }],
    'no-duplicate-imports': [0],
    'no-multiple-empty-lines': [2, { max: 1 }],
    'no-underscore-dangle': [0],
    'object-curly-newline': [2, {
      ExportDeclaration: {
        consistent: true,
        minProperties: 6,
        multiline: true,
      },
      ImportDeclaration: {
        consistent: true,
        minProperties: 6,
        multiline: true,
      },
      ObjectExpression: {
        consistent: true,
        minProperties: 6,
        multiline: true,
      },
      ObjectPattern: {
        consistent: true,
        minProperties: 6,
        multiline: true,
      },
    }],
    'optimize-regex/optimize-regex': [2],
    'quote-props': [2, 'consistent-as-needed'],
    'sort-keys': [2, 'asc', { natural: true }],
    'sort-vars': [2],
    'unicorn/error-message': [2],
    'unicorn/escape-case': [2],
    'unicorn/explicit-length-check': [2],
    'unicorn/import-index': [2],
    'unicorn/new-for-builtins': [2],
    'unicorn/no-array-instanceof': [2],
    'unicorn/no-console-spaces': [2],
    'unicorn/no-hex-escape': [2],
    'unicorn/no-keyword-prefix': [2, { onlyCamelCase: false }],
    'unicorn/no-zero-fractions': [2],
    'unicorn/number-literal-case': [2],
    'unicorn/prefer-add-event-listener': [2],
    'unicorn/prefer-dataset': [2],
    'unicorn/prefer-event-key': [2],
    'unicorn/prefer-exponentiation-operator': [2],
    'unicorn/prefer-includes': [2],
    'unicorn/prefer-modern-dom-apis': [2],
    'unicorn/prefer-node-append': [2],
    'unicorn/prefer-node-remove': [2],
    'unicorn/prefer-number-properties': [2],
    'unicorn/prefer-optional-catch-binding': [2],
    'unicorn/prefer-reflect-apply': [2],
    'unicorn/prefer-replace-all': [2],
    'unicorn/prefer-set-has': [2],
    'unicorn/prefer-starts-ends-with': [2],
    'unicorn/prefer-text-content': [2],
    'unicorn/prefer-type-error': [2],
    'unicorn/prevent-abbreviations': [2, {
      checkFilenames: false,
      checkProperties: false,
      extendDefaultReplacements: false,
      replacements: {
        argument: { arg: true },
        arguments: { args: true },
        array: { arr: true },
        attribute: { attr: true },
        attributes: { attrs: true },
        boolean: { bool: true },
        callback: { cb: true },
        collection: { coll: true },
        config: { conf: true },
        context: { ctx: true },
        database: { db: true },
        destination: { dest: true },
        development: { dev: true },
        dictionary: { dict: true },
        direction: { dir: true },
        directions: { dirs: true },
        directories: { dirs: true },
        directory: { dir: true },
        document: { doc: true },
        documents: { docs: true },
        element: { el: true },
        environment: { env: true },
        error: { err: true },
        ev: { e: true },
        event: { e: true },
        evt: { e: true },
        extension: { ext: true },
        length: { len: true },
        library: { lib: true },
        message: { msg: true },
        module: { mod: true },
        number: { num: true },
        object: { obj: true },
        package: { pkg: true },
        parameter: { param: true },
        parameters: { params: true },
        previous: { prev: true },
        production: { prod: true },
        properties: { props: true },
        property: { prop: true },
        reference: { ref: true },
        references: { refs: true },
        request: { req: true },
        returnValue: { ret: true },
        separator: { sep: true },
        separators: { seps: true },
        source: { src: true },
        string: { str: true },
        table: { tbl: true },
        temp: { tmp: true },
        temporary: { tmp: true },
        value: { val: true },
      },
    }],
  },
};
