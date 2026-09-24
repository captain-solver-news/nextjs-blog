import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical';
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react';
import type { CodeBlock as CodeBlockType } from '@/lib/payload/generated-types';
import { CodeBlock } from '@/components/blocks/code-block/code-block';

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<CodeBlockType>;

export const richTextConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    codeBlock: ({ node }) => (
      <CodeBlock
        filename={node.fields.filename}
        note={node.fields.note}
        syntax={node.fields.syntax}
        code={node.fields.code}
      />
    ),
  },
});
