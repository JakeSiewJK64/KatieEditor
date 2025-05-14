import React from 'react';

import { RichTextEditor } from '../editor';
import { deserialize } from '../editor/utils';

import type { Descendant } from 'slate';

function DeserializeHtml() {
  const [value, setValue] = React.useState<Descendant[]>(
    deserialize(
      '<img width="150" src="https://th.bing.com/th?id=ORMS.619350583d28c0fdd02328c89273585a&pid=Wdp&w=240&h=129&qlt=90&c=1&rs=1&dpr=0.800000011920929&p=0" />',
    ),
  );

  return (
    <div className="w-[25rem] rounded border p-2">
      <h2 className="text-xl">Deserialize HTML</h2>
      <p className="text-sm text-slate-600">
        Deserializes html to JSON which is readable by slate editor.
      </p>
      <RichTextEditor mode="json" onSave={setValue} initialValue={value} />
      {value && (
        <div>
          <p>Preview: </p>
          {value.length > 0 && (
            <pre className="h-[10rem] overflow-y-scroll border border-slate-300 p-2">
              {JSON.stringify(value, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

function SerializeHtml() {
  const [value, setValue] = React.useState(
    '<img src="https://th.bing.com/th?id=ORMS.619350583d28c0fdd02328c89273585a&pid=Wdp&w=240&h=129&qlt=90&c=1&rs=1&dpr=0.800000011920929&p=0" />',
  );

  return (
    <div className="w-[25rem] rounded border p-2">
      <h2 className="text-xl">Serialize HTML</h2>
      <p className="text-sm text-slate-600">Serializes JSON to HTML.</p>
      <RichTextEditor
        mode="html"
        onSave={setValue}
        initialValue={deserialize(value)}
      />
      <p>Preview: </p>
      {value.length > 0 && (
        <pre className="h-[10rem] overflow-y-scroll border border-slate-300 p-2">
          {value}
        </pre>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="flex flex-row flex-wrap gap-2 p-2">
      <DeserializeHtml />
      <SerializeHtml />
    </div>
  );
}

export default App;
