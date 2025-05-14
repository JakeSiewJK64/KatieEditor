import { LuBold, LuRedo, LuUndo } from 'react-icons/lu';
import { HistoryEditor } from 'slate-history';

import { CustomEditorHelper } from './utils';

import type { ReactEditor } from 'slate-react';

type ToolbarProps = {
  editor: ReactEditor & HistoryEditor;
};

export function Toolbar({ editor }: ToolbarProps) {
  return (
    <div className="mb-2 flex flex-row rounded border border-slate-300 p-1">
      <button
        className="cursor-pointer p-1 hover:bg-slate-300"
        onClick={() => CustomEditorHelper.toggleBoldMark(editor)}
      >
        <LuBold />
      </button>
      <button
        className="cursor-pointer p-1 hover:bg-slate-300"
        onClick={() => editor.undo()}
      >
        <LuUndo />
      </button>
      <button
        className="cursor-pointer p-1 hover:bg-slate-300"
        onClick={() => editor.redo()}
      >
        <LuRedo />
      </button>
    </div>
  );
}
