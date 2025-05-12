import { LuBold } from 'react-icons/lu';

import { CustomEditorHelper } from './utils';

import type { ReactEditor } from 'slate-react';

type ToolbarProps = {
  editor: ReactEditor;
};

export function Toolbar({ editor }: ToolbarProps) {
  return (
    <div className="m-2 flex flex-row rounded border border-slate-300 p-1">
      <button
        className="cursor-pointer p-1 hover:bg-slate-300"
        onClick={() => CustomEditorHelper.toggleBoldMark(editor)}
      >
        <LuBold />
      </button>
    </div>
  );
}
