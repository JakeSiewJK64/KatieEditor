import { ImageElement } from 'editor';
import { LuTrash } from 'react-icons/lu';
import { Transforms } from 'slate';
import {
  ReactEditor,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react';

import { cn } from './utils';

import type { RenderElementProps, RenderLeafProps } from 'slate-react';

export function CustomEditorLeaf(props: RenderLeafProps) {
  return (
    <span
      {...props.attributes}
      className={cn(props.leaf.bold ? 'font-bold' : 'font-normal')}
    >
      {props.children}
    </span>
  );
}

function CustomImageRenderElement({
  onDelete = () => {},
  ...props
}: ImageElement & { onDelete: () => void }) {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div
      className={cn(
        'w-fit rounded border border-slate-300 p-2',
        focused && selected && 'border-red-600',
      )}
      contentEditable={false}
    >
      <div className="mb-1 flex flex-row items-center gap-1">
        <button
          title="Remove image"
          className="cursor-pointer rounded border border-slate-300 p-1 text-red-600"
          onClick={onDelete}
        >
          <LuTrash />
        </button>
      </div>
      <img draggable={false} src={props.url} />
    </div>
  );
}

export function CustomEditorRenderElement(props: RenderElementProps) {
  const editor = useSlateStatic();

  switch (props.element.type) {
    case 'code':
      return (
        <pre {...props}>
          <code className="text-red-600">{props.children}</code>
        </pre>
      );
    case 'image':
      return (
        <CustomImageRenderElement
          {...props.element}
          onDelete={() => {
            Transforms.removeNodes(editor, {
              at: ReactEditor.findPath(editor, props.element),
            });
          }}
        />
      );
    default:
      return <p {...props}>{props.children}</p>;
  }
}
