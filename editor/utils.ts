import { clsx } from 'clsx';
import { Editor, Element, Text, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { twMerge } from 'tailwind-merge';

import type {
  CustomEditorElementType,
  CustomEditorTextElement,
  ImageElement,
} from '.';
import type { ClassValue } from 'clsx';
import type { Descendant, Node as SlateNode } from 'slate';
import type { ReactEditor } from 'slate-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getNodeEntries(
  editor: ReactEditor,
  nodeType: CustomEditorElementType,
) {
  // determine whether any of the currently selected blocks are code blocks.
  return editor.nodes({
    match(node): node is Element {
      return Element.isElement(node) && node.type === nodeType;
    },
  });
}

export const CustomEditorHelper = {
  isBoldMarkActive(editor: ReactEditor) {
    const marks = Editor.marks(editor);
    return marks ? marks.bold : false;
  },
  isCodeBlockActive(editor: ReactEditor) {
    const [match] = getNodeEntries(editor, 'code');
    return !!match;
  },
  toggleCodeBlock(editor: ReactEditor) {
    const isActive = CustomEditorHelper.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? 'paragraph' : 'code' },
      {
        match: node => {
          return Element.isElement(node) && editor.isBlock(node);
        },
      },
    );
  },
  toggleBoldMark(editor: ReactEditor) {
    const isActive = CustomEditorHelper.isBoldMarkActive(editor);

    if (isActive) {
      editor.removeMark('bold');
      return;
    }

    editor.addMark('bold', true);
  },
  insertImage(editor: ReactEditor, url: string, width?: number) {
    const image: SlateNode & ImageElement = {
      type: 'image',
      children: [{ text: '' }],
      url,
      width,
    };
    Transforms.insertNodes(editor, image);
    Transforms.insertNodes(editor, {
      children: [{ text: '' }],
      type: 'paragraph',
    });
  },
};

export function serializeHtml(node: Descendant): string {
  if (!Element.isElement(node)) {
    return '';
  }

  const children: string = node.children
    .map(n => {
      if (Text.isText(n)) {
        let str = n.text;

        if (n.bold) {
          str = `<strong>${str}</strong>`;
        }

        return str;
      }
    })
    .join('');

  switch (node.type) {
    case 'code':
      return `<pre><code>${children}</code></pre>`;
    case 'image':
      return `<img src=${node.url} width="${node.width}" />`;
    default:
      return `<p>${children}</p>`;
  }
}

function breakdownElements(
  element: ChildNode,
  attributes: NamedNodeMap & CustomEditorTextElement,
): Descendant[] {
  if (element.nodeType === Node.TEXT_NODE) {
    return [jsx('text', attributes, element.textContent)];
  }

  if (element.nodeType !== Node.ELEMENT_NODE) {
    return [jsx('text', {}, '')];
  }

  const nodeAttributes = { ...attributes };

  switch (element.nodeName) {
    case 'STRONG':
      nodeAttributes.bold = true;
  }

  const children = Array.from(element.childNodes).flatMap(node =>
    breakdownElements(node, nodeAttributes),
  );

  if (children.length === 0) {
    children.push(jsx('text', {}, ''));
  }

  switch (element.nodeName) {
    case 'P':
      return [jsx('element', nodeAttributes, children)];
    case 'IMG':
      if (element instanceof HTMLImageElement) {
        const url = element.getAttribute('src') || '';
        const width = element.getAttribute('width') || '300';

        return [
          jsx('element', { type: 'paragraph' }, [{ text: '' }]),
          {
            type: 'image',
            url,
            width: Number(width),
            children: [{ text: '' }],
          },
          jsx('element', { type: 'paragraph' }, [{ text: '' }]),
        ];
      }

      return [{ text: '' }];
    default:
      return children;
  }
}

export function deserialize(htmlString: string): Descendant[] {
  const htmlElement = new DOMParser().parseFromString(
    htmlString.length === 0 ? '<p></p>' : htmlString,
    'text/html',
  ).body;

  try {
    return breakdownElements(htmlElement, htmlElement.attributes);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }

    return [jsx('text', {}, '')];
  }
}
