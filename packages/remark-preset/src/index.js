// @flow

import * as remarkRetextPreset from '@psirenny/retext-preset';
import remarkLintBlockquoteIndentation from 'remark-lint-blockquote-indentation';
import remarkLintCheckboxCharacterStyle from 'remark-lint-checkbox-character-style';
import remarkLintCodeBlockStyle from 'remark-lint-code-block-style';
import remarkLintEmphasisMarker from 'remark-lint-emphasis-marker';
import remarkLintFencedCodeMarker from 'remark-lint-fenced-code-marker';
import remarkLintHeadingStyle from 'remark-lint-heading-style';
import remarkLintLinkTitleStyle from 'remark-lint-link-title-style';
import remarkLintRuleStyle from 'remark-lint-rule-style';
import remarkLintStrongMarker from 'remark-lint-strong-marker';
import remarkLintTableCellPadding from 'remark-lint-table-cell-padding';
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import remarkRetext from 'remark-retext';
import unified from 'unified';

export const plugins = [
  [remarkRetext, unified().use(remarkRetextPreset)], // eslint-disable-line tree-shaking/no-side-effects-in-initialization
  [remarkLintBlockquoteIndentation, 2],
  [remarkLintCheckboxCharacterStyle, { checked: 'x', unchecked: ' ' }],
  [remarkLintCodeBlockStyle, 'fenced'],
  [remarkLintEmphasisMarker, '_'],
  [remarkLintFencedCodeMarker, '`'],
  [remarkLintHeadingStyle, 'atx'],
  [remarkLintLinkTitleStyle, '"'],
  [remarkLintRuleStyle, '* * *'],
  [remarkLintStrongMarker, '*'],
  [remarkLintTableCellPadding, 'padded'],
  [remarkPresetLintMarkdownStyleGuide],
  [remarkPresetLintRecommended],
];

export const settings = {
  bullet: '*',
  fences: true,
};
