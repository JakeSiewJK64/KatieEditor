import { cn } from './utils';

import type { RenderElementProps, RenderLeafProps } from 'slate-react';

export function CodeElement(props: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre {...props}>
      <code className="text-red-600">{props.children}</code>
    </pre>
  );
}

export function ParagraphElement(
  props: React.HTMLAttributes<HTMLParagraphElement>,
) {
  return <p {...props}>{props.children}</p>;
}

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
      return <CodeElement {...props} />;
    case 'image':
      return <img src={props.element.url} />;
    default:
      return <ParagraphElement {...props} />;
  }
}
