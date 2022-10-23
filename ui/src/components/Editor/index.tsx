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
            time: 1666522786358,
            blocks: [
              {
                id: "csyxUmlghN",
                type: "header",
                data: {
                  text: "Welcome to Data Dance",
                  level: 2,
                },
              },
              {
                id: "szwhWof1aH",
                type: "paragraph",
                data: {
                  text: "Data Dance is a service where you can analysis and visualize tons of real-time updated dataset without any professional knowledge.",
                },
              },
              {
                id: "kmLvpkYVzR",
                type: "sql",
                data: {},
              },
              {
                id: "w1nJs8CHHB",
                type: "header",
                data: {
                  text: "Key features",
                  level: 3,
                },
              },
              {
                id: "-UuKViSGn_",
                type: "list",
                data: {
                  style: "unordered",
                  items: [
                    "Data just works ™<b> </b>without any setup",
                    "Analyze and visualize in UI",
                    "Analyze Billions data in seconds",
                    "Community driven",
                  ],
                },
              },
              {
                id: "mpkKM4ZYyI",
                type: "header",
                data: {
                  text: "How to Analyze and visualize in UI",
                  level: 3,
                },
              },
              {
                id: "hIigcWPe57",
                type: "paragraph",
                data: {
                  text: "Next, we will introduce how to analyze and visualize data without any professional knowledge.",
                },
              },
              {
                id: "C483dXXrZb",
                type: "paragraph",
                data: {
                  text: "1. Open a Visualization block",
                },
              },
              {
                id: "j7uevvQ3P6",
                type: "paragraph",
                data: {
                  text: "2. Select a block and ready to choose a dataset.",
                },
              },
              {
                id: "9bhwux8QGE",
                type: "paragraph",
                data: {
                  text: "3. Choose the dataset you like",
                },
              },
              {
                id: "sS0GZxnQFu",
                type: "paragraph",
                data: {
                  text: "4. Preview the dataset",
                },
              },
              {
                id: "XKqXxZ7Mnj",
                type: "paragraph",
                data: {
                  text: "5. We also support customized queries.",
                },
              },
              {
                id: "Uj6qGErKqU",
                type: "paragraph",
                data: {
                  text: "6. Check the result",
                },
              },
              {
                id: "9oDZXVMIfx",
                type: "paragraph",
                data: {
                  text: "7. Choose x, y and color axis, the chart is generated.<br>",
                },
              },
              {
                id: "0NiqXJNPyU",
                type: "paragraph",
                data: {
                  text: "8. Also you can add some filters",
                },
              },
            ],
            version: "2.25.0",
          }
        }
      />
    </div>
  );
};
