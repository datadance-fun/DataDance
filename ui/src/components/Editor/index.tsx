import { createReactEditorJS } from "react-editor-js";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import Header from "@editorjs/header";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import ImageBlock from "@editorjs/image";
import { SQLBlock } from "../SQLBlock";
import { EditorContext } from "./Context";
import { useContext, useRef } from "react";
import { OutputData } from "@editorjs/editorjs";

const ReactEditorJS = createReactEditorJS();

export const EDITOR_JS_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  sql: SQLBlock,
  list: {
    class: List,
    inlineToolbar: true,
  },
  code: Code,
  header: {
    class: Header,
    inlineToolbar: true,
  },
  marker: Marker,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  image: {
    class: ImageBlock,
  },
};

export interface IEditorProps {
  defaultValue?: OutputData;
}

export const Editor = (props: IEditorProps) => {
  const editorContainer = useContext(EditorContext);
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef}>
      <ReactEditorJS
        autofocus
        onInitialize={(instance) => {
          editorContainer.instance = instance;
        }}
        tools={EDITOR_JS_TOOLS}
        defaultValue={
          props.defaultValue ?? {
            time: 1635603431943,
            blocks: [
              {
                id: "sheNwCUP5A",
                type: "header",
                data: {
                  text: "Data Dance",
                  level: 2,
                },
              },
              {
                id: "12iM3lqzcm",
                type: "paragraph",
                data: {
                  text: "Hey. Meet the data dance. On this page you can see it in action — try to explore the data.",
                },
              },
              {
                id: "fvZGuFXHmK",
                type: "header",
                data: {
                  text: "Key features",
                  level: 3,
                },
              },
              {
                id: "xnPuiC9Z8M",
                type: "list",
                data: {
                  style: "unordered",
                  items: [
                    "Data just works ™ without any setup",
                    "Analyze and visualize in UI",
                    "Analyze Billions data in seconds",
                    "Community driven",
                  ],
                },
              },
              {
                id: "-MhwnSs3Dw",
                type: "header",
                data: {
                  text: "What does it mean «Data Editor»",
                  level: 3,
                },
              },
              {
                id: "Ptb9oEioJn",
                type: "paragraph",
                data: {
                  text: 'Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Data editor <mark class="cdx-marker">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, visualization etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor\'s Core.',
                },
              },
              {
                id: "N8bOHTfUCN",
                type: "delimiter",
                data: {},
              },
              {
                id: "N83DHTfUCN",
                type: "sql",
                data: {},
              },
            ],
          }
        }
      />
    </div>
  );
};
