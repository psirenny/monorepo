// @flow

/* eslint-disable import/prefer-default-export */

import dictionaryEnUs from 'dictionary-en-us';
import retextAssuming from 'retext-assuming';
import retextContractions from 'retext-contractions';
import retextDiacritics from 'retext-diacritics';
import retextEnglish from 'retext-english';
import retextEquality from 'retext-equality';
import retextIndefiniteArticle from 'retext-indefinite-article';
import retextIntensify from 'retext-intensify';
import retextPassive from 'retext-passive';
import retextProfanities from 'retext-profanities';
import retextQuotes from 'retext-quotes';
import retextReadability from 'retext-readability';
import retextRedundantAcronyms from 'retext-redundant-acronyms';
import retextRepeatedWords from 'retext-repeated-words';
import retextSentenceSpacing from 'retext-sentence-spacing';
import retextSimplify from 'retext-simplify';
import retextSpell from 'retext-spell';
import retextSyntaxMentions from 'retext-syntax-mentions';
import retextSyntaxUrls from 'retext-syntax-urls';

const dictionaryExo = `
  psirenny
`;

export const plugins = [
  [retextEnglish],
  [retextAssuming],
  [retextContractions],
  [retextDiacritics],
  [retextEquality],
  [retextIndefiniteArticle],
  [retextIntensify],
  [retextPassive],
  [retextProfanities],
  [retextRedundantAcronyms],
  [retextRepeatedWords],
  [retextQuotes],
  [retextReadability, { age: 21 }],
  [retextSentenceSpacing],
  [retextSimplify],
  [retextSyntaxMentions],
  [retextSyntaxUrls],
  [retextSpell, { dictionary: dictionaryEnUs, personal: dictionaryExo }],
];
