import React from 'react';

import { RichTextEditor } from '../editor';
import { deserialize } from '../editor/utils';

function DeserializeHtml() {
  const [value, setValue] = React.useState('');

  return (
    <div>
      <RichTextEditor
        mode="html"
        onSave={setValue}
        initialValue={deserialize(
          '<img src="https://th.bing.com/th?id=ORMS.619350583d28c0fdd02328c89273585a&pid=Wdp&w=240&h=129&qlt=90&c=1&rs=1&dpr=0.800000011920929&p=0" />',
        )}
      />
      <div className="p-2">
        <p>Preview: </p>
        {value.length > 0 && (
          <pre className="h-[10rem] overflow-y-scroll border border-slate-300 p-2">
            {JSON.stringify(value, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

function SerializeHtml() {
  const [value, setValue] = React.useState('');

  return (
    <div>
      <RichTextEditor
        mode="html"
        onSave={setValue}
        initialValue={deserialize(
          '<img src="https://th.bing.com/th?id=ORMS.619350583d28c0fdd02328c89273585a&pid=Wdp&w=240&h=129&qlt=90&c=1&rs=1&dpr=0.800000011920929&p=0" />',
        )}
      />
      <div className="p-2">
        <p>Preview: </p>
        {value.length > 0 && (
          <pre className="h-[10rem] overflow-y-scroll border border-slate-300 p-2">
            {value}
          </pre>
        )}
      </div>
    </div>
  );
}

function Example() {
  return (
    <RichTextEditor
      mode="html"
      initialValue={[
        {
          type: 'paragraph',
          children: [{ text: 'A line of text in a paragraph.' }],
        },
      ]}
    />
  );
}

function App() {
  return (
    <div>
      <Example />
      <hr />
      <DeserializeHtml />
      <hr />
      <SerializeHtml />
      <hr />
    </div>
  );
}

export default App;
