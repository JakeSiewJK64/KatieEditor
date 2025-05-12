import React from 'react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';

import { CustomEditorLeaf, CustomEditorRenderElement } from './editorElements';
import { Toolbar } from './toolbar';
import { cn, CustomEditorHelper, serializeHtml } from './utils';

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
        className={cn(
          'm-2 rounded border border-slate-300 p-1',
          props.className,
        )}
        renderLeaf={CustomEditorLeaf}
        renderElement={CustomEditorRenderElement}
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
