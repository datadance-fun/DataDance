import React from "react";
import type { EditorCore } from "@react-editor-js/core/dist/src/editor-core";

export type EditorInstanceContainer = {
  instance: EditorCore | undefined;
};

export const EditorContext = React.createContext<EditorInstanceContainer>({
  instance: undefined,
});
