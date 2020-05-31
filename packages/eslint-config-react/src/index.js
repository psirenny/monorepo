// @flow strict

export default {
  extends: 'eslint-config-airbnb',
  rules: {
    'react/forbid-component-props': [2, {
      forbid: [{
        allowedFor: ['FormattedNumber'],
        propName: 'style',
      }],
    }],
    'react/forbid-elements': [2, { forbid: ['style'] }],
    'react/jsx-filename-extension': [0],
    'react/jsx-props-no-spreading': [0],
    'react/jsx-sort-props': [2, { reservedFirst: true }],
  },
};
