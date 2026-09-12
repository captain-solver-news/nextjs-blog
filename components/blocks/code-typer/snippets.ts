export type TokenType = 'plain' | 'keyword' | 'comment' | 'fn' | 'string' | 'number';

export type Token = {
  type: TokenType;
  text: string;
};

export type Snippet = {
  filename: string;
  language: string;
  code: string;
};

export const snippets: Snippet[] = [
  {
    filename: 'transformer.ts',
    language: 'TypeScript',
    code: `// Less noise. More signal.

async function optimizeSignal(input: Frame) {
  const kernel = await loadModel('v0.0.1');
  const signal = kernel.process(input);

  return refine(signal, { min: 0.8 });
}`,
  },
  {
    filename: 'cache.ts',
    language: 'TypeScript',
    code: `// Cache the work that costs the most.

export function memoize<T>(run: Fn<T>) {
  const store = new Map<string, T>();

  return (key: string) =>
    store.get(key) ?? fill(store, key, run);
}`,
  },
  {
    filename: 'resilience.ts',
    language: 'TypeScript',
    code: `// Production fails. Plan the retries.

async function withRetry(task: Task, max = 3) {
  for (let i = 1; i <= max; i++) {
    const out = await task().catch(() => null);

    if (out) return out;
    await sleep(2 ** i * 100);
  }
}`,
  },
  {
    filename: 'stream.ts',
    language: 'TypeScript',
    code: `// Ship bytes, not waterfalls.

export async function* read(res: Response) {
  const reader = res.body.getReader();
  let chunk = await reader.read();

  while (!chunk.done) {
    yield chunk.value;
    chunk = await reader.read();
  }
}`,
  },
];

const KEYWORDS = new Set([
  'async',
  'await',
  'function',
  'const',
  'let',
  'var',
  'return',
  'export',
  'import',
  'from',
  'for',
  'while',
  'do',
  'try',
  'catch',
  'finally',
  'yield',
  'new',
  'class',
  'extends',
  'typeof',
  'instanceof',
  'if',
  'else',
  'of',
  'in',
  'this',
  'true',
  'false',
  'null',
  'undefined',
]);

// Comments, strings, numbers and identifiers; everything in between stays plain.
const TOKEN_PATTERN = /(\/\/[^\n]*)|('[^']*'|"[^"]*"|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;

function classify(match: RegExpExecArray, source: string): TokenType {
  const [, comment, string, number, identifier] = match;

  if (comment) return 'comment';
  if (string) return 'string';
  if (number) return 'number';
  if (identifier && KEYWORDS.has(identifier)) return 'keyword';
  // An identifier that opens a call or a generic call reads as a function name.
  return /^[(<]/.test(source.slice(match.index + match[0].length)) ? 'fn' : 'plain';
}

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;

  const push = (type: TokenType, text: string) => {
    if (!text) return;

    const last = tokens[tokens.length - 1];
    if (last?.type === type) last.text += text;
    else tokens.push({ type, text });
  };

  TOKEN_PATTERN.lastIndex = 0;
  let match = TOKEN_PATTERN.exec(code);

  while (match) {
    push('plain', code.slice(cursor, match.index));
    push(classify(match, code), match[0]);

    cursor = match.index + match[0].length;
    match = TOKEN_PATTERN.exec(code);
  }

  push('plain', code.slice(cursor));

  return tokens;
}

// Cuts a pre-tokenized snippet down to the first `length` characters.
export function sliceTokens(tokens: Token[], length: number): Token[] {
  const visible: Token[] = [];
  let remaining = length;

  for (const token of tokens) {
    if (remaining <= 0) break;

    visible.push(remaining >= token.text.length ? token : { ...token, text: token.text.slice(0, remaining) });
    remaining -= token.text.length;
  }

  return visible;
}
