import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomEditorElementType = 'paragraph' | 'code' | 'image';

type CustomEditorElementBase = {
  children: CustomEditorTextElement[];
};

type ParagraphElement = CustomEditorElementBase & {
  type: 'paragraph';
};

type CodeElement = CustomEditorElementBase & {
  type: 'code';
};

type ImageElement = CustomEditorElementBase & {
  type: 'image';
  url: string;
};

type CustomEditorElement = ParagraphElement | CodeElement | ImageElement;

type CustomEditorTextElement = { text?: string; bold?: boolean };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomEditorElement;
    Text: CustomEditorTextElement;
  }
}
