import type { ThemeRegistration } from 'shiki';

type PaletteType = {
  fg: string;
  bg: string;
  keyword: string;
  fn: string;
  type: string;
  string: string;
  property: string;
  comment: string;
};

const DARK: PaletteType = {
  fg: '#dfe2eb',
  bg: '#0d1117',
  keyword: '#3fb950',
  fn: '#58a6ff',
  type: '#f85149',
  string: '#e3b341',
  property: '#bdcab8',
  comment: '#8b949e',
};

const LIGHT: PaletteType = {
  fg: '#1f2328',
  bg: '#ffffff',
  keyword: '#1a7f37',
  fn: '#0969da',
  type: '#cf222e',
  string: '#9a6700',
  property: '#3f4650',
  comment: '#6e7781',
};

const SCOPES: [keyof PaletteType, string[]][] = [
  ['comment', ['comment', 'punctuation.definition.comment']],
  [
    'keyword',
    [
      'keyword',
      'storage',
      'storage.type',
      'storage.modifier',
      'keyword.operator.new',
      'keyword.operator.expression',
      'variable.language',
      'constant.language',
      'entity.name.tag',
      'markup.heading',
    ],
  ],
  [
    'fn',
    [
      'entity.name.function',
      'support.function',
      'meta.function-call',
      'variable.function',
      'entity.other.attribute-name',
      'markup.bold',
    ],
  ],
  [
    'type',
    [
      'entity.name.type',
      'entity.name.class',
      'entity.name.namespace',
      'entity.other.inherited-class',
      'support.type',
      'support.class',
      'support.type.primitive',
      'constant.other',
      'entity.name.section',
    ],
  ],
  [
    'string',
    [
      'string',
      'punctuation.definition.string',
      'string.quoted',
      'string.template',
      'constant.numeric',
      'constant.character.escape',
      'constant.other.symbol',
      'support.constant',
      'markup.inserted',
    ],
  ],
  [
    'property',
    [
      'variable.other.property',
      'variable.other.object.property',
      'meta.object-literal.key',
      'support.variable.property',
      'entity.name.label',
    ],
  ],
  [
    'fg',
    ['keyword.operator', 'storage.type.function.arrow', 'punctuation', 'meta.brace', 'variable', 'variable.other'],
  ],
];

function build(name: string, type: 'dark' | 'light', palette: PaletteType): ThemeRegistration {
  return {
    name,
    type,
    fg: palette.fg,
    bg: palette.bg,
    settings: SCOPES.map(([key, scope]) => ({
      scope,
      settings: { foreground: palette[key] },
    })),
  };
}

export const CODE_THEME_DARK = build('signal-dark', 'dark', DARK);
export const CODE_THEME_LIGHT = build('signal-light', 'light', LIGHT);
