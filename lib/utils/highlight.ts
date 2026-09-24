import { createHighlighter, type BundledLanguage, type Highlighter } from 'shiki';
import { CODE_THEME_DARK, CODE_THEME_LIGHT } from '@/lib/utils/code-theme';
import { CODE_SYNTAXES, DEFAULT_CODE_SYNTAX } from '@/lib/utils/code-syntaxes';

const SUPPORTED = new Set<string>(CODE_SYNTAXES.map((entry) => entry.value));

let pending: Promise<Highlighter> | null = null;

function loadHighlighter() {
  pending ??= createHighlighter({
    themes: [CODE_THEME_DARK, CODE_THEME_LIGHT],
    langs: CODE_SYNTAXES.map((entry) => entry.value).filter((value) => value !== 'text') as BundledLanguage[],
  });

  return pending;
}

export async function highlight(code: string, syntax?: string | null) {
  const lang = syntax && SUPPORTED.has(syntax) ? syntax : DEFAULT_CODE_SYNTAX;
  const highlighter = await loadHighlighter();

  return highlighter.codeToHtml(code, {
    lang,
    themes: { light: CODE_THEME_LIGHT.name!, dark: CODE_THEME_DARK.name! },
    defaultColor: false,
  });
}
