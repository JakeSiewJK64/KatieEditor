import React from 'react';
import { BaseEditor, createEditor, Descendant, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';

import { CustomEditorLeaf, CustomEditorRenderElement } from './editorElements';
import { Toolbar } from './toolbar';
import { cn, CustomEditorHelper, serializeHtml } from './utils';

import type { Path } from 'slate';

export type CustomEditorElementType = 'paragraph' | 'code' | 'image';

export type CustomEditorElementBase = {
  children: CustomEditorTextElement[];
};

export type StandardElement = CustomEditorElementBase & {
  type: 'code' | 'paragraph';
};

export type ImageElement = CustomEditorElementBase & {
  type: 'image';
  url: string;
  width?: number;
};

export type CustomEditorElement = ImageElement | StandardElement;

export type CustomEditorTextElement = { text?: string; bold?: boolean };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomEditorElement;
    Text: CustomEditorTextElement;
  }
}

type JSONExportMode = {
  mode: 'json';
  onSave?: (value: Descendant[]) => void;
};

type HTMLExportMode = {
  mode: 'html';
  onSave?: (value: string) => void;
};

type EditorProps = React.HTMLAttributes<HTMLDivElement> &
  (JSONExportMode | HTMLExportMode) & {
    initialValue: Descendant[];
  };

export function RichTextEditor({
  initialValue,
  mode,
  onSave,
  ...props
}: EditorProps) {
  const [editor] = React.useState(() => withReact(withHistory(createEditor())));

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={value => {
        const changes = editor.operations.some(
          op => 'set_selection' !== op.type,
        );

        // handle saving
        if (!onSave) {
          return;
        }

        if (changes) {
          if (mode === 'json') {
            onSave(value);
            return;
          }

          const final = value.map(val => serializeHtml(val)).join('\n');
          onSave(final);
        }
      }}
    >
      <Toolbar editor={editor} />
      <Editable
        {...props}
        className={cn('rounded border border-slate-300 p-1', props.className)}
        renderLeaf={CustomEditorLeaf}
        renderElement={CustomEditorRenderElement}
        onDrop={e => {
          const imgSrc = e.dataTransfer.getData('data-img');

          if (imgSrc) {
            const {
              nodeIndex,
              url,
              width,
            }: ImageElement & { nodeIndex: Path } = JSON.parse(imgSrc);
            Transforms.removeNodes(editor, { at: nodeIndex });
            CustomEditorHelper.insertImage(editor, url, width);
          }
        }}
        onPaste={async e => {
          const clipboardData = e.clipboardData;
          const items = clipboardData?.items;

          if (!items) {
            return;
          }

          for (const item of items) {
            if (item.type.startsWith('image/')) {
              e.preventDefault();

              const file = item.getAsFile();
              if (file) {
                const url = URL.createObjectURL(file);
                CustomEditorHelper.insertImage(editor, url);
              }
            }
          }
        }}
        onKeyDown={e => {
          if (!e.ctrlKey) {
            return;
          }

          switch (e.key) {
            case '`': {
              e.preventDefault();
              CustomEditorHelper.toggleCodeBlock(editor);
              break;
            }
            case 'y':
              editor.redo();
              break;
            case 'z':
              editor.undo();
              break;
            case 'b':
              e.preventDefault();
              CustomEditorHelper.toggleBoldMark(editor);
              break;
          }
        }}
      />
    </Slate>
  );
}
