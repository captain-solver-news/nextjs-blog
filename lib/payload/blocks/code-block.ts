import type { Block } from 'payload';
import { CODE_SYNTAXES, DEFAULT_CODE_SYNTAX } from '@/lib/utils/code-syntaxes';

export const CodeBlock: Block = {
  slug: 'codeBlock',
  interfaceName: 'CodeBlock',
  labels: {
    singular: 'Code',
    plural: 'Code blocks',
  },
  jsx: {
    export: ({ fields }) => {
      const code = String(fields.code ?? '');
      const longestRun = Math.max(2, ...(code.match(/`+/g) ?? []).map((run) => run.length));
      const fence = '`'.repeat(longestRun + 1);
      const caption = [fields.filename, fields.note].filter(Boolean).join(' — ');

      return `${caption ? `${caption}\n\n` : ''}${fence}${fields.syntax ?? ''}\n${code}\n${fence}`;
    },
    import: () => false,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'filename',
          type: 'text',
          label: 'File name',
          admin: {
            width: '50%',
            description: 'Shown on the left of the header, e.g. rust_example.rs',
          },
        },
        {
          name: 'note',
          type: 'text',
          label: 'Note',
          admin: {
            width: '50%',
            description: 'Shown on the right of the header, e.g. WASI Preview 2',
          },
        },
      ],
    },
    {
      name: 'syntax',
      type: 'select',
      required: true,
      defaultValue: DEFAULT_CODE_SYNTAX,
      options: [...CODE_SYNTAXES],
    },
    {
      name: 'code',
      type: 'code',
      required: true,
      label: 'Code',
    },
  ],
};
