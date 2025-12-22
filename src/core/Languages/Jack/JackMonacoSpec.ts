import { type MonacoLanguageSpec } from '../../Editor/types';
import { JackSpec } from './JackSpec';

export const JackMonacoSpec: MonacoLanguageSpec = {
  id: 'jack',
  extensions: ['.jack'],

  // 1. Language Configuration (Editor behavior)
  configuration: {
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
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
    ],
  },

  tokens: {
    keywords: Array.from(JackSpec.KEYWORDS),
    typeKeywords: Array.from(JackSpec.TYPES),
    operators: Array.from(JackSpec.OP),

    symbols: /[{}()\[\].,;+\-*/&|<>=~]/,

    tokenizer: {
      root: [
        [
          /[a-zA-Z_]\w*/,
          {
            cases: {
              '@typeKeywords': 'type',
              '@keywords': 'keyword',
              '@default': 'identifier',
            },
          },
        ],

        // Whitespace and Comments
        { include: '@whitespace' },

        // Literals
        [/\d+/, 'number'],
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

        // Brackets and Symbols
        [/[{}()\[\]]/, '@brackets'],
        [
          /@symbols/,
          {
            cases: {
              '@operators': 'operator',
              '@default': '',
            },
          },
        ],
      ],

      // State handling for multi-line strings/comments
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
        [/[\/*]/, 'comment'],
      ],
    },
  },
};
