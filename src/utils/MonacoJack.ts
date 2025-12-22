// src/utils/monaco-jack.ts
import { JackSpec } from '../core/Languages/Jack/JackSpec';

export const registerJackLanguage = (monaco: any) => {
  const languageId = 'jack';
  monaco.languages.register({ id: languageId });
  monaco.languages.setMonarchTokensProvider(languageId, {
    keywords: Array.from(JackSpec.KEYWORDS),
    typeKeywords: Array.from(JackSpec.TYPES),
    operators: Array.from(JackSpec.OP),
    symbols:  /[{}()\[\].,;+\-*/&|<>=~]/,

    tokenizer: {
      root: [
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@typeKeywords': 'type',
            '@keywords': 'keyword',
            '@default': 'identifier'
          }
        }],
        { include: '@whitespace' },

        // Numbers
        [/\d+/, 'number'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

        // Symbols and Operators
        [/[{}()\[\]]/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],
      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],

      comment: [
        [/[^\/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment']
      ],
    },
  });

  // Optional: Set language configuration (braces, comments)
  monaco.languages.setLanguageConfiguration(languageId, {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
    ],
  });
};