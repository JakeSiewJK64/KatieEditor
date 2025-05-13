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

export function CustomEditorRenderElement(props: RenderElementProps) {
  switch (props.element.type) {
    case 'code':
      return (
        <pre {...props}>
          <code className="text-red-600">{props.children}</code>
        </pre>
      );
    case 'image':
      return <img src={props.element.url} />;
    default:
      return <p {...props}>{props.children}</p>;
  }
}
