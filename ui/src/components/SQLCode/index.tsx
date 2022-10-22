import { BasicSetupOptions, useCodeMirror } from "@uiw/react-codemirror";
import { PostgreSQL, sql } from "@codemirror/lang-sql";
import { EditorView, KeyBinding, keymap } from "@codemirror/view";
import { HighlightTheme } from "./CodeAreaTheme";
import { Extension } from "@codemirror/state";
import React, { useEffect, useRef } from "react";
import {
  cursorMatchingBracket,
  cursorSyntaxLeft,
  cursorSyntaxRight,
  deleteLine,
  indentLess,
  indentMore,
  indentSelection,
  selectSyntaxLeft,
  selectSyntaxRight,
  standardKeymap,
  toggleBlockComment,
  toggleComment,
} from "@codemirror/commands";

export interface ICodeAreaProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
}

const theme = EditorView.theme(
  {
    "&": {
      fontSize: "0.9rem",
    },
    ".cm-content": {
      fontFamily: "'JetBrains Mono', monospace",
    },
    ".cm-selectionBackground": {
      background: "transparent",
    },
    "&.cm-editor.cm-focused": { outline: "0" },
  },
  {
    dark: false,
  }
);

const keyMap: Array<KeyBinding> = [
  ...standardKeymap,
  {
    key: "Alt-ArrowLeft",
    mac: "Ctrl-ArrowLeft",
    run: cursorSyntaxLeft,
    shift: selectSyntaxLeft,
  },
  {
    key: "Alt-ArrowRight",
    mac: "Ctrl-ArrowRight",
    run: cursorSyntaxRight,
    shift: selectSyntaxRight,
  },
  { key: "Mod-[", run: indentLess },
  { key: "Mod-]", run: indentMore },
  { key: "Mod-Alt-\\", run: indentSelection },
  { key: "Shift-Mod-k", run: deleteLine },
  { key: "Shift-Mod-\\", run: cursorMatchingBracket },
  { key: "Mod-/", run: toggleComment },
  { key: "Alt-A", run: toggleBlockComment },
];

const cmExtensions: Array<Extension> = [
  sql({ dialect: PostgreSQL }),
  EditorView.lineWrapping,
  HighlightTheme,
  keymap.of(keyMap),
];

const cmSetup: BasicSetupOptions = {
  defaultKeymap: false,
  lintKeymap: false,
  searchKeymap: false,
  lineNumbers: true,
  foldGutter: false,
  foldKeymap: false,
  autocompletion: false,
  completionKeymap: false,
  highlightActiveLine: true,
  highlightActiveLineGutter: true,
  highlightSelectionMatches: true,
};

function CodeArea_({ value, onChange, ...restProps }: ICodeAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { view, setContainer } = useCodeMirror({
    container: containerRef.current,
    value,
    height: "100%",
    theme,
    extensions: cmExtensions,
    basicSetup: cmSetup,
    indentWithTab: false,
    onChange,
  });

  useEffect(() => {
    setContainer(containerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} {...restProps} />;
}

export const SQLCode = React.memo(CodeArea_);
