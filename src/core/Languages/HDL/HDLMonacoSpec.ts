import { type MonacoLanguageSpec } from '../../Editor/types';
import { HDLSpec } from './HDLSpec';

export const HDLMonacoSpec: MonacoLanguageSpec = {
  id: 'hdl',
  extensions: ['.hdl'],

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
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
    ],
  },

  tokens: {
    keywords: Array.from(HDLSpec.KEYWORDS),
    operators: ['='],

    symbols: /[{}()\[\].,;=:]/,

    tokenizer: {
      root: [
        [
          /[a-zA-Z_]\w*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@default': 'identifier',
            },
          },
        ],

        { include: '@whitespace' },

        [/\d+/, 'number'],

        [/[{}()\[\]]/, '@brackets'],

        [
          /[.,;=:]/,
          {
            cases: {
              '@operators': 'operator',
              '@default': 'delimiter',
            },
          },
        ],
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
