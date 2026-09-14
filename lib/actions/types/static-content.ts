import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

export type StaticContent = {
  id: string;
  title: string | null;
  body: DefaultTypedEditorState;
};
