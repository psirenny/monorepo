// @flow strict

export default {
  extends: [
    'eslint-config-airbnb',
    '@psirenny/eslint-config',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
